'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Buffer } from 'buffer';
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
  TransactionInstruction,
} from '@solana/web3.js';

if (typeof window !== 'undefined') {
  (window as any).Buffer = (window as any).Buffer ?? Buffer;
}

// ── Constants ──
const WAGER_PROGRAM_ID   = new PublicKey('Cs1z5RKFzUNughgamPk3yA7jJhbMMXHNb1YXp2Mbuv4d');
const REFEREE_PROGRAM_ID = new PublicKey('Fq4ThqS2tFAWbcSce5pKqcEBB9k4XJxbsq6Mzpjh3yJ7');
const ARENA_PROGRAM_ID   = new PublicKey('DcMdSfBtccFMATGfaPWzx6hSEZpsfH4oy2V2t291eHyd');
const RPC_URL   = 'https://api.devnet.solana.com';
const MATCH_LEN = 296;
const STATE_SIZE = 8 + 8 * 32;
const EXPLORER_TX   = (sig: string)  => `https://explorer.solana.com/tx/${sig}?cluster=devnet`;
const EXPLORER_ADDR = (addr: string) => `https://explorer.solana.com/address/${addr}?cluster=devnet`;

const PHASE_NAME  = ['open', 'live', 'settled'];
const SIDE_NAME   = ['draw', 'player A', 'player B'];
const PHASE_STYLE = [
  'background:rgba(96,129,212,.1);color:var(--g-blue);',
  'background:rgba(90,112,82,.1);color:var(--success);',
  'background:var(--bg-subtle);color:var(--text-3);',
];
const ZERO_PK = '11111111111111111111111111111111';

// ── Merkle ──
const CHUNK = 32;
async function sha256v(...parts: Uint8Array[]) {
  const total = parts.reduce((s, p) => s + p.length, 0);
  const buf = new Uint8Array(total);
  let off = 0;
  for (const p of parts) { buf.set(p, off); off += p.length; }
  return new Uint8Array(await crypto.subtle.digest('SHA-256', buf));
}
function leafCount(len: number) {
  const chunks = Math.max(Math.ceil(len / CHUNK), 1);
  return 1 << Math.ceil(Math.log2(Math.max(chunks, 1)));
}
function chunkAt(state: Uint8Array, i: number) {
  const c = new Uint8Array(CHUNK);
  const s = i * CHUNK;
  if (s < state.length) c.set(state.subarray(s, Math.min(s + CHUNK, state.length)));
  return c;
}
async function stateRoot(state: Uint8Array) {
  const n = leafCount(state.length);
  const level: Uint8Array[] = [];
  for (let i = 0; i < n; i++) level.push(await sha256v(new Uint8Array([0]), chunkAt(state, i)));
  let width = n;
  while (width > 1) {
    for (let i = 0; i < width / 2; i++) level[i] = await sha256v(new Uint8Array([1]), level[2*i], level[2*i+1]);
    width >>= 1;
  }
  const lenLe = new Uint8Array(8);
  new DataView(lenLe.buffer).setBigUint64(0, BigInt(state.length), true);
  return sha256v(new Uint8Array([2]), lenLe, level[0]);
}
function arenaGenesisState() {
  const state = new Uint8Array(STATE_SIZE);
  const view  = new DataView(state.buffer);
  for (let i = 0; i < 8; i++) {
    const base = 8 + i * 32;
    const p = BigInt(32 + i * 28) << 32n;
    view.setBigInt64(base,     p, true);
    view.setBigInt64(base + 8, p, true);
  }
  return state;
}
async function genesisClaim() {
  const claim = new Uint8Array(64);
  claim.set(await stateRoot(arenaGenesisState()), 0);
  return claim;
}

// ── Instruction builders ──
function u64le(v: bigint | number) {
  const b = new Uint8Array(8);
  new DataView(b.buffer).setBigUint64(0, BigInt(v), true);
  return b;
}
function wagerIx(accounts: { pubkey: PublicKey; isSigner: boolean; isWritable: boolean }[], data: Uint8Array) {
  return new TransactionInstruction({ programId: WAGER_PROGRAM_ID, keys: accounts, data: Buffer.from(data) });
}
async function buildCreateMatchIxs(
  payer: PublicKey, matchPubkey: PublicKey, playerB: PublicKey,
  stake: bigint, finalTick: bigint, deadlineSlots: bigint, rentLamports: number
) {
  const gc   = await genesisClaim();
  const data = new Uint8Array(1 + 8 + 8 + 8 + 64);
  data[0] = 0;
  data.set(u64le(stake),        1);
  data.set(u64le(finalTick),    9);
  data.set(u64le(deadlineSlots),17);
  data.set(gc, 25);
  return [
    SystemProgram.createAccount({
      fromPubkey: payer, newAccountPubkey: matchPubkey,
      lamports: rentLamports + Number(stake),
      space: MATCH_LEN, programId: WAGER_PROGRAM_ID,
    }),
    wagerIx([
      { pubkey: matchPubkey,       isSigner: false, isWritable: true  },
      { pubkey: payer,             isSigner: true,  isWritable: false },
      { pubkey: playerB,           isSigner: false, isWritable: false },
      { pubkey: ARENA_PROGRAM_ID,  isSigner: false, isWritable: false },
      { pubkey: REFEREE_PROGRAM_ID,isSigner: false, isWritable: false },
    ], data),
  ];
}

interface MatchAccount {
  pubkey: PublicKey;
  lamports: number;
  phase: number;
  winner: number;
  playerA: PublicKey;
  playerB: PublicKey;
  sessionA: PublicKey;
  sessionB: PublicKey;
  stake: bigint;
  finalTick: bigint;
  deadlineSlots: bigint;
  deadline: bigint;
}

function decodeMatch(pubkey: PublicKey, lamports: number, data: Uint8Array): MatchAccount | null {
  if (data.length !== MATCH_LEN) return null;
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const pk = (o: number) => new PublicKey(data.subarray(o, o + 32));
  return {
    pubkey, lamports,
    phase: data[0], winner: data[1],
    playerA: pk(8), playerB: pk(40),
    sessionA: pk(136), sessionB: pk(168),
    stake:         view.getBigUint64(200, true),
    finalTick:     view.getBigUint64(208, true),
    deadlineSlots: view.getBigUint64(216, true),
    deadline:      view.getBigUint64(224, true),
  };
}

function buildJoinIxs(m: MatchAccount) {
  return [
    SystemProgram.transfer({ fromPubkey: m.playerB, toPubkey: m.pubkey, lamports: Number(m.stake) }),
    wagerIx([
      { pubkey: m.pubkey,  isSigner: false, isWritable: true  },
      { pubkey: m.playerB, isSigner: true,  isWritable: false },
    ], new Uint8Array([1])),
  ];
}
function buildCancelIx(m: MatchAccount) {
  return wagerIx([
    { pubkey: m.pubkey,  isSigner: false, isWritable: true },
    { pubkey: m.playerA, isSigner: true,  isWritable: true },
  ], new Uint8Array([2]));
}
function buildCoopSettleIx(m: MatchAccount, winner: number) {
  return wagerIx([
    { pubkey: m.pubkey,  isSigner: false, isWritable: true },
    { pubkey: m.playerA, isSigner: true,  isWritable: true },
    { pubkey: m.playerB, isSigner: true,  isWritable: true },
  ], new Uint8Array([4, winner]));
}
function buildExpireIx(m: MatchAccount) {
  return wagerIx([
    { pubkey: m.pubkey,  isSigner: false, isWritable: true },
    { pubkey: m.playerA, isSigner: false, isWritable: true },
    { pubkey: m.playerB, isSigner: false, isWritable: true },
  ], new Uint8Array([6]));
}

function shortPk(pk: PublicKey) { const s = pk.toBase58(); return s.slice(0,4) + '..' + s.slice(-4); }
function lamportsToSol(l: bigint | number) { return (Number(l)/1e9).toLocaleString('en-US',{maximumFractionDigits:4}); }
function toBase64(bytes: Uint8Array) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}
function fromBase64(b64: string) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

const WALLET_EMOJI: Record<string, string> = { Phantom: '👻', Solflare: '☀️', Backpack: '🎒' };
const WALLET_DESC:  Record<string, string> = { Phantom: 'Most popular Solana wallet', Solflare: 'Feature-rich Solana wallet', Backpack: 'xNFT wallet by Armada' };
const WALLET_GRAD:  Record<string, string> = { Phantom: 'linear-gradient(135deg,#ab9ff2,#7c69e8)', Solflare: 'linear-gradient(135deg,#fc8c0c,#fc5c0c)', Backpack: 'linear-gradient(135deg,#1a1a2e,#333366)' };

interface WalletState {
  connected: boolean;
  publicKey: PublicKey | null;
  provider: any;
  name: string | null;
  emoji: string | null;
}

function getProvider(name: string) {
  if (typeof window === 'undefined') return null;
  const w = window as any;
  if (name === 'Phantom')  return w.phantom?.solana ?? (w.solana?.isPhantom ? w.solana : null);
  if (name === 'Solflare') return w.solflare?.isSolflare ? w.solflare : null;
  if (name === 'Backpack') return w.backpack?.solana ?? null;
  return null;
}

// ── SVG icons ──
const GithubIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);
const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function HomePage() {
  const connectionRef = useRef<Connection | null>(null);
  const getConnection = () => {
    if (!connectionRef.current) connectionRef.current = new Connection(RPC_URL, 'confirmed');
    return connectionRef.current;
  };

  const [wallet, setWallet] = useState<WalletState>({
    connected: false, publicKey: null, provider: null, name: null, emoji: null,
  });
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchAccount[]>([]);
  const [matchSlot, setMatchSlot] = useState(0);
  const [onlyMine, setOnlyMine] = useState(false);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState('');
  const [matchErrors, setMatchErrors] = useState<Record<number, string>>({});
  const [coopShare, setCoopShare] = useState<Record<number, string>>({});
  const [coopPaste, setCoopPaste] = useState<Record<number, string>>({});
  const [winnersSelect, setWinnersSelect] = useState<Record<number, number>>({});

  const [opponent, setOpponent] = useState('');
  const [stakeSol, setStakeSol] = useState('0.01');
  const [ticks, setTicks] = useState('32');
  const [slots, setSlots] = useState('5000');
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const openModal = (id: string) => {
    setActiveModal(id);
    document.body.style.overflow = 'hidden';
    if (id === 'matches') fetchMatches();
  };
  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const connectWallet = async (name: string) => {
    const provider = getProvider(name);
    if (!provider) { alert(name + ' wallet not found. Please install it first.'); return; }
    try {
      const resp = await provider.connect();
      const newWallet: WalletState = {
        publicKey: resp.publicKey,
        provider,
        name,
        emoji: WALLET_EMOJI[name] ?? '🔑',
        connected: true,
      };
      setWallet(newWallet);
      provider.on?.('disconnect', () => setWallet({ connected: false, publicKey: null, provider: null, name: null, emoji: null }));
      closeModal();
    } catch (e: any) {
      if (e?.code !== 4001) console.error(e);
    }
  };

  const disconnectWallet = () => {
    wallet.provider?.disconnect?.().catch(() => {});
    setWallet({ connected: false, publicKey: null, provider: null, name: null, emoji: null });
  };

  const walletShort = (wlt: WalletState = wallet) => {
    if (!wlt.publicKey) return null;
    const s = wlt.publicKey.toBase58();
    return s.slice(0,4) + '..' + s.slice(-4);
  };

  const sendTx = async (ixs: TransactionInstruction[], partialSigners: Keypair[] = []) => {
    if (!wallet.connected || !wallet.provider) throw new Error('wallet not connected');
    const conn = getConnection();
    const tx = new Transaction().add(...ixs);
    tx.feePayer = wallet.publicKey!;
    const { blockhash } = await conn.getLatestBlockhash('confirmed');
    tx.recentBlockhash = blockhash;
    for (const kp of partialSigners) tx.partialSign(kp);
    const signed = await wallet.provider.signTransaction(tx);
    const sig = await conn.sendRawTransaction(signed.serialize());
    await conn.confirmTransaction(sig, 'confirmed');
    return sig;
  };

  const fetchMatches = useCallback(async () => {
    setMatchesLoading(true);
    setMatchesError('');
    try {
      const conn = getConnection();
      const [accounts, slot] = await Promise.all([
        conn.getProgramAccounts(WAGER_PROGRAM_ID, { filters: [{ dataSize: MATCH_LEN }] }),
        conn.getSlot('confirmed'),
      ]);
      setMatchSlot(slot);
      const decoded = accounts
        .map(({ pubkey, account }) => decodeMatch(pubkey, account.lamports, account.data as any as Uint8Array))
        .filter(Boolean)
        .sort((a, b) => a!.phase - b!.phase) as MatchAccount[];
      setMatches(decoded);
    } catch (e: any) {
      setMatchesError(e.message || String(e));
    } finally {
      setMatchesLoading(false);
    }
  }, []);

  const matchAction = async (idx: number, fn: () => Promise<unknown>) => {
    setMatchErrors(prev => ({ ...prev, [idx]: '' }));
    try { await fn(); await fetchMatches(); }
    catch (e: any) { setMatchErrors(prev => ({ ...prev, [idx]: e.message || String(e) })); }
  };

  const matchJoin   = (idx: number) => matchAction(idx, () => sendTx(buildJoinIxs(matches[idx])));
  const matchCancel = (idx: number) => matchAction(idx, () => sendTx([buildCancelIx(matches[idx])]));
  const matchExpire = (idx: number) => matchAction(idx, () => sendTx([buildExpireIx(matches[idx])]));

  const matchSignCoop = async (idx: number) => {
    const m = matches[idx];
    const winner = winnersSelect[idx] ?? 1;
    setMatchErrors(prev => ({ ...prev, [idx]: '' }));
    try {
      if (!wallet.connected || !wallet.provider) throw new Error('wallet not connected');
      const conn = getConnection();
      const tx = new Transaction().add(buildCoopSettleIx(m, winner));
      tx.feePayer = m.playerA;
      const { blockhash } = await conn.getLatestBlockhash('confirmed');
      tx.recentBlockhash = blockhash;
      const signed = await wallet.provider.signTransaction(tx);
      const b64 = toBase64(signed.serialize({ requireAllSignatures: false, verifySignatures: false }));
      await navigator.clipboard.writeText(b64).catch(() => {});
      setCoopShare(prev => ({ ...prev, [idx]: 'Copied — send to player B within ~1 min: ' + b64.slice(0,56) + '...' }));
    } catch (e: any) {
      setMatchErrors(prev => ({ ...prev, [idx]: e.message || String(e) }));
    }
  };

  const matchCoSignCoop = async (idx: number) => {
    const b64 = (coopPaste[idx] ?? '').trim();
    setMatchErrors(prev => ({ ...prev, [idx]: '' }));
    try {
      if (!wallet.connected || !wallet.provider) throw new Error('wallet not connected');
      if (!b64) throw new Error('paste the transaction from player A first');
      const conn = getConnection();
      const tx     = Transaction.from(Buffer.from(fromBase64(b64)));
      const signed = await wallet.provider.signTransaction(tx);
      const sig    = await conn.sendRawTransaction(signed.serialize());
      await conn.confirmTransaction(sig, 'confirmed');
      setCoopPaste(prev => ({ ...prev, [idx]: '' }));
      await fetchMatches();
    } catch (e: any) {
      setMatchErrors(prev => ({ ...prev, [idx]: e.message || String(e) }));
    }
  };

  const createMatch = async () => {
    setCreateError('');
    setCreateSuccess('');
    if (!wallet.connected || !wallet.publicKey) { setCreateError('Connect a wallet first.'); return; }
    if (!opponent.trim()) { setCreateError('Opponent wallet address is required.'); return; }
    let playerB: PublicKey;
    try { playerB = new PublicKey(opponent.trim()); }
    catch { setCreateError('Invalid opponent wallet address.'); return; }
    const stake = BigInt(Math.round(parseFloat(stakeSol) * 1e9));
    if (stake <= 0n) { setCreateError('Stake must be positive.'); return; }

    setCreateLoading(true);
    try {
      const conn  = getConnection();
      const matchKp = Keypair.generate();
      const rent    = await conn.getMinimumBalanceForRentExemption(MATCH_LEN);
      const ixs     = await buildCreateMatchIxs(
        wallet.publicKey, matchKp.publicKey, playerB,
        stake, BigInt(ticks), BigInt(slots), rent
      );
      const sig = await sendTx(ixs, [matchKp]);
      setCreateSuccess(`__LINK__${sig}`);
      setOpponent('');
    } catch (e: any) {
      setCreateError(e.message || String(e));
    } finally {
      setCreateLoading(false);
    }
  };

  const copyQuickStart = () => {
    const commands = [
      'git clone https://github.com/pruvnetwork/tickpruv && cd tickpruv',
      'cargo test -p arena --release',
      'cargo run -p arena-viewer',
    ].join('\n');
    navigator.clipboard.writeText(commands).catch(() => {});
  };

  const filteredMatches = onlyMine && wallet.publicKey
    ? matches.filter(m => m.playerA.toBase58() === wallet.publicKey!.toBase58() || m.playerB.toBase58() === wallet.publicKey!.toBase58())
    : matches;

  return (
    <div className="app">
      {/* HEADER */}
      <header className="site-header">
        <div className="header-inner">
          <a href="#" className="logo">
            <span className="logo-text">tickpruv</span>
            <span className="devnet-badge">devnet</span>
          </a>
          <nav className="header-nav">
            <Link href="/docs" className="header-nav-paper">Docs</Link>
            <a href="#" className="header-nav-console" onClick={e => { e.preventDefault(); openModal('console'); }}>Console</a>
            <a href="https://github.com/pruvnetwork/tickpruv" target="_blank" rel="noopener" aria-label="GitHub" style={{display:'flex',alignItems:'center'}}><GithubIcon /></a>
            <a href="https://x.com/pruvfun" target="_blank" rel="noopener" aria-label="X" style={{display:'flex',alignItems:'center'}}><XIcon /></a>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main>
        <div className="main-inner">

          {/* Hero */}
          <section className="hero">
            <div>
              <p className="hero-label">verifiable game engine · live on solana devnet</p>
              <h1>Real-money matches where <em>the chain is the referee.</em></h1>
              <p className="hero-sub">
                Every PvP wagering platform on Solana today trusts a server to report who won.
                tickpruv removes the reporter entirely: game logic compiles to SBF, runs off-chain at full speed,
                and any disputed tick is replayed by the L1 itself: the chain already executes SBF natively,
                so the final step of a dispute is just a program invocation.
              </p>
              <p className="hero-sub" style={{marginTop:'8px'}}>No oracle, no zkVM, no interpreter-in-a-contract.</p>
              <div className="cta-section" style={{marginTop:'24px'}}>
                <button className="btn-primary" onClick={() => openModal('console')}>
                  <div className="btn-primary-content">
                    <span className="material-symbols-outlined icon-fill">terminal</span>
                    Open the console
                  </div>
                  <div className="btn-primary-shimmer"></div>
                </button>
                <div className="cta-secondary-row">
                  <Link href="/docs" className="btn-secondary">
                    <span className="material-symbols-outlined" style={{fontSize:'18px'}}>description</span>
                    Docs
                  </Link>
                  <a href="https://github.com/pruvnetwork/tickpruv" target="_blank" rel="noopener" className="btn-secondary">
                    <GithubIcon />
                    View source
                  </a>
                </div>
              </div>
              <div style={{marginTop:'16px',display:'flex',justifyContent:'center'}}>
                <a href="https://pruv.fun" target="_blank" rel="noopener" className="pruv-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  Powered by PRUV
                </a>
              </div>
              <div style={{marginTop:'24px'}}>
                <p className="tagline-mono" style={{marginBottom:'14px',fontFamily:'var(--font-mono)',fontSize:'.65rem',letterSpacing:'.2em',textTransform:'uppercase',color:'var(--text-4)'}}>every dispute ends the same way: the chain replays it.</p>
                <div className="trust-card">
                  <div className="trust-col">
                    <span className="material-symbols-outlined trust-icon">lock</span>
                    <span className="trust-text">Stakes secured<br/>on-chain</span>
                  </div>
                  <div className="trust-sep"></div>
                  <div className="trust-col">
                    <span className="material-symbols-outlined trust-icon">gavel</span>
                    <span className="trust-text">No trusted reporter</span>
                  </div>
                  <div className="trust-sep"></div>
                  <div className="trust-col">
                    <span className="material-symbols-outlined trust-icon">speed</span>
                    <span className="trust-text">Native SBF replay</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Steps */}
          <section className="steps-section">
            <div className="steps-list">
              {[
                'Escrow: lock your stake in the wager program',
                'Play off-chain through the real agave runtime',
                'Prove or co-sign: two signatures or a checkpoint bond',
                'The chain decides: bisection, native replay, payout',
              ].map((text, i) => (
                <div className="step-item" key={i}>
                  <span className="step-num">0{i+1}</span>
                  <span className="step-text">{text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Why not X */}
          <section className="why-section">
            <p className="why-label">Why not an oracle or zkVM?</p>
            <div className="why-grid">
              <div className="why-card why-bad">
                <div className="why-card-top"><span className="why-badge bad">trusted reporter</span></div>
                <p className="why-approach">Oracle / server</p>
                <p className="why-detail">Operator reports who won. Works until it doesn&apos;t. No on-chain proof, no recourse.</p>
              </div>
              <div className="why-card why-bad">
                <div className="why-card-top"><span className="why-badge bad">~280k CU</span></div>
                <p className="why-approach">zkVM · SP1 Groth16</p>
                <p className="why-detail">Groth16 verify alone costs ~280k CU before you touch game state. 20× the tx budget.</p>
              </div>
              <div className="why-card why-bad">
                <div className="why-card-top"><span className="why-badge bad">~157k CU+</span></div>
                <p className="why-approach">Interpreter-in-contract</p>
                <p className="why-detail">80+ CU per emulated instruction, ~157k CU before memory proofs. Scales with game complexity.</p>
              </div>
              <div className="why-card why-good">
                <div className="why-card-top"><span className="why-badge good">~19k CU</span></div>
                <p className="why-approach">tickpruv</p>
                <p className="why-detail">The chain already runs SBF natively. Dispute = one program invocation. ~1.4% of a tx budget.</p>
              </div>
            </div>
          </section>

          {/* Demo */}
          <section className="demo-section">
            <div className="demo-window">
              <div className="demo-titlebar">
                <div className="demo-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <span className="demo-title">arena-viewer · 60 ticks/s · agave runtime</span>
              </div>
              <div className="demo-body">
                <Image src="/demo.gif" alt="tickpruv arena running live at 60 ticks/s through the real agave runtime" width={512} height={288} unoptimized />
              </div>
            </div>
            <p className="demo-caption">Every tick executed through the real agave runtime. State root in the HUD.</p>
          </section>

          {/* Quick start */}
          <section className="qs-section">
            <div className="qs-header">
              <span className="qs-title">Try it locally</span>
              <div className="qs-badges">
                <span className="qs-badge">Rust</span>
                <span className="qs-badge">Solana CLI</span>
                <span className="qs-badge">agave</span>
              </div>
            </div>
            <div className="qs-block">
              <div className="qs-titlebar">
                <span className="qs-shell-name">zsh</span>
                <button className="qs-copy-btn" onClick={copyQuickStart}>
                  <span className="material-symbols-outlined">content_copy</span>
                  copy
                </button>
              </div>
              <div className="qs-body">
                <div className="qs-line qs-comment"># clone &amp; build</div>
                <div className="qs-line"><span className="qs-prompt">$</span><span className="qs-cmd">git clone https://github.com/pruvnetwork/tickpruv &amp;&amp; cd tickpruv</span></div>
                <div className="qs-divider"></div>
                <div className="qs-line qs-comment"># run the test suite (real agave runtime)</div>
                <div className="qs-line"><span className="qs-prompt">$</span><span className="qs-cmd">cargo test -p arena --release</span></div>
                <div className="qs-divider"></div>
                <div className="qs-line qs-comment"># watch the arena tick live</div>
                <div className="qs-line"><span className="qs-prompt">$</span><span className="qs-cmd">cargo run -p arena-viewer</span></div>
              </div>
            </div>
          </section>

          {/* Deployed programs */}
          <section className="programs-section">
            <p className="programs-label">Deployed programs</p>
            {[
              { name: 'wager', desc: 'stake escrow, verdict CPI, payouts', addr: 'Cs1z5RKFzUNughgamPk3yA7jJhbMMXHNb1YXp2Mbuv4d' },
              { name: 'referee', desc: 'checkpoints, bisection, native replay', addr: 'Fq4ThqS2tFAWbcSce5pKqcEBB9k4XJxbsq6Mzpjh3yJ7' },
              { name: 'arena', desc: 'the game: tick, load-state, verdict', addr: 'DcMdSfBtccFMATGfaPWzx6hSEZpsfH4oy2V2t291eHyd' },
            ].map(p => (
              <a key={p.name} href={`https://explorer.solana.com/address/${p.addr}?cluster=devnet`} target="_blank" rel="noopener" className="program-row">
                <div>
                  <div className="program-name"><span className="program-live"></span>{p.name}</div>
                  <div className="program-desc">{p.desc}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'10px',flexShrink:0}}>
                  <span className="program-addr">{p.addr}</span>
                  <span className="program-arrow">↗</span>
                </div>
              </a>
            ))}
          </section>

          {/* Footer */}
          <footer style={{paddingTop:'24px',paddingBottom:'48px',display:'flex',flexDirection:'column',alignItems:'center',gap:'12px'}}>
            <div className="devnet-live">
              <div className="devnet-dot"></div>
              <span className="devnet-label">Solana Devnet</span>
            </div>
            <div className="social-pills">
              <div className="social-pill"><span className="material-symbols-outlined" style={{fontSize:'13px',color:'var(--g-indigo)'}}>balance</span>Apache-2.0</div>
              <div className="social-pill"><span className="material-symbols-outlined" style={{fontSize:'13px',color:'var(--g-blue)'}}>deployed_code</span>3 programs on devnet</div>
              <a href="https://github.com/pruvnetwork/tickpruv" target="_blank" rel="noopener" className="social-pill social-pill-link"><GithubIcon />GitHub</a>
              <a href="https://x.com/pruvfun" target="_blank" rel="noopener" className="social-pill social-pill-link"><XIcon />X</a>
            </div>
            <div style={{width:'40px',height:'1px',background:'var(--border)',margin:'4px 0'}}></div>
            <div className="footer-links">
              <Link href="/howto" className="footer-link">How it works</Link>
              <Link href="/terms" className="footer-link">Terms</Link>
              <Link href="/privacy" className="footer-link">Privacy</Link>
            </div>
            <p style={{fontFamily:'var(--font-mono)',fontSize:'.6rem',color:'var(--text-4)'}}>© 2026 TICKPRUV</p>
          </footer>

        </div>
      </main>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          <button className="nav-item" onClick={() => openModal('matches')}>
            <span className="material-symbols-outlined">gavel</span>
            <span className="nav-label nav-label-court">Court</span>
          </button>
          <div className="nav-create">
            <div className="nav-create-glow"></div>
            <button className="nav-create-btn" onClick={() => openModal('console')}>
              <span className="material-symbols-outlined icon-fill">add_circle</span>
            </button>
            <span className="nav-create-label">Create</span>
          </div>
          <button className="nav-item" onClick={() => openModal('wallet')}>
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span className="nav-label">Wallet</span>
          </button>
        </div>
      </nav>

      {/* MODAL: Console / Create Match */}
      {activeModal === 'console' && <div className="modal-backdrop open" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
        <div className="modal">
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'12px',marginBottom:'4px'}}>
            <h2 style={{marginBottom:0}}>Open a match</h2>
            <div style={{flexShrink:0}}>
              {wallet.connected ? (
                <div style={{display:'flex',alignItems:'center',gap:'7px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'999px',padding:'5px 12px',fontFamily:'var(--font-mono)',fontSize:'.68rem',color:'var(--text-2)',whiteSpace:'nowrap'}}>
                  <span style={{fontSize:'14px',lineHeight:1}}>{wallet.emoji}</span>{walletShort()}
                </div>
              ) : (
                <button onClick={() => { closeModal(); openModal('wallet'); }} style={{display:'flex',alignItems:'center',gap:'6px',background:'var(--bg-subtle)',border:'1px solid var(--border-md)',borderRadius:'999px',padding:'5px 12px',fontFamily:'var(--font-mono)',fontSize:'.68rem',color:'var(--text-3)',cursor:'pointer'}}>
                  <span className="material-symbols-outlined" style={{fontSize:'13px'}}>account_balance_wallet</span>Connect
                </button>
              )}
            </div>
          </div>
          <p className="modal-sub">Escrows your stake on devnet. Your opponent joins with theirs; the genesis claim is computed byte-identical to the engine&apos;s.</p>
          <a href="https://explorer.solana.com/address/Cs1z5RKFzUNughgamPk3yA7jJhbMMXHNb1YXp2Mbuv4d?cluster=devnet" target="_blank" rel="noopener"
             style={{display:'inline-flex',alignItems:'center',gap:'5px',fontFamily:'var(--font-mono)',fontSize:'.62rem',color:'var(--text-4)',textDecoration:'none',marginBottom:'16px'}}>
            <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--success)',flexShrink:0}}></span>
            live · wager program on devnet · Cs1z5RKF…
          </a>

          <div className="form-group">
            <label className="form-label">Opponent (player B)</label>
            <input type="text" className="form-input" value={opponent} onChange={e => setOpponent(e.target.value)} placeholder="opponent wallet address" />
          </div>
          <div className="modal-grid">
            <div className="form-group">
              <label className="form-label">Stake per side (SOL)</label>
              <div className="stake-row">
                <input type="number" className="form-input" value={stakeSol} onChange={e => setStakeSol(e.target.value)} min="0" step="0.001" />
                <div className="currency-badge">◎</div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Match length (ticks)</label>
              <input type="number" className="form-input" value={ticks} onChange={e => setTicks(e.target.value)} min="1" />
            </div>
            <div className="form-group" style={{gridColumn:'1/-1'}}>
              <label className="form-label">Settlement deadline (slots after join)</label>
              <input type="number" className="form-input" value={slots} onChange={e => setSlots(e.target.value)} min="1" />
            </div>
          </div>

          {createError && <div className="error-msg">{createError}</div>}
          {createSuccess && (
            <div className="success-msg">
              Match created ·{' '}
              <a href={EXPLORER_TX(createSuccess.replace('__LINK__',''))} target="_blank" rel="noopener" style={{color:'var(--g-blue)',textDecoration:'underline'}}>view on explorer ↗</a>
            </div>
          )}

          <div className="modal-actions">
            <button className="btn-modal-primary" onClick={createMatch} disabled={createLoading}>
              <span className="material-symbols-outlined" style={{fontSize:'16px'}}>rocket_launch</span>
              {createLoading ? 'Signing...' : 'Create match'}
            </button>
            <button className="btn-modal-cancel" onClick={closeModal}>Cancel</button>
          </div>
          <p style={{marginTop:'14px',fontSize:'.72rem',color: wallet.connected ? 'var(--success)' : 'var(--text-4)',fontFamily:'var(--font-mono)'}}>
            {wallet.connected ? `● ${wallet.name} connected · devnet only` : 'Connect wallet first · devnet only'}
          </p>
        </div>
      </div>}

      {/* MODAL: Matches */}
      {activeModal === 'matches' && <div className="modal-backdrop open" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
        <div className="modal" style={{maxWidth:'480px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px'}}>
            <h2 style={{marginBottom:0}}>
              Matches{' '}
              <span style={{fontFamily:'var(--font-mono)',fontSize:'.75rem',fontWeight:400,color:'var(--text-4)',marginLeft:'6px'}}>
                {matchesLoading ? '...' : `${filteredMatches.length} on-chain`}
              </span>
            </h2>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <label style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'.75rem',color:'var(--text-3)',cursor:'pointer'}}>
                <input type="checkbox" checked={onlyMine} onChange={e => setOnlyMine(e.target.checked)} style={{accentColor:'var(--g-blue)'}} />
                only mine
              </label>
              <button onClick={fetchMatches} style={{background:'none',border:'1px solid var(--border-md)',borderRadius:'999px',padding:'3px 10px',fontSize:'.72rem',color:'var(--text-2)',cursor:'pointer',fontFamily:'var(--font-sans)'}}>refresh</button>
            </div>
          </div>

          {wallet.connected ? (
            <div style={{marginBottom:'12px',display:'inline-flex',alignItems:'center',gap:'6px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'999px',padding:'4px 10px',fontFamily:'var(--font-mono)',fontSize:'.67rem',color:'var(--text-2)'}}>
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--success)',flexShrink:0}}></span>
              {wallet.emoji} {walletShort()} <span style={{color:'var(--text-4)'}}>· devnet</span>
            </div>
          ) : (
            <button onClick={() => { closeModal(); openModal('wallet'); }} style={{marginBottom:'12px',display:'flex',alignItems:'center',gap:'6px',background:'var(--bg-subtle)',border:'1px solid var(--border-md)',borderRadius:'999px',padding:'5px 12px',fontFamily:'var(--font-mono)',fontSize:'.68rem',color:'var(--text-3)',cursor:'pointer'}}>
              <span className="material-symbols-outlined" style={{fontSize:'13px'}}>account_balance_wallet</span>Connect
            </button>
          )}

          <div style={{display:'flex',flexDirection:'column',gap:'8px',maxHeight:'360px',overflowY:'auto'}}>
            {matchesLoading ? (
              <div style={{border:'1px dashed var(--border-md)',borderRadius:'14px',padding:'24px',textAlign:'center',fontSize:'.8rem',color:'var(--text-4)'}}>Loading...</div>
            ) : matchesError ? (
              <div style={{border:'1px dashed var(--border-md)',borderRadius:'14px',padding:'24px',textAlign:'center',fontSize:'.8rem',color:'var(--error)'}}>Failed to load: {matchesError}</div>
            ) : filteredMatches.length === 0 ? (
              <div style={{border:'1px dashed var(--border-md)',borderRadius:'14px',padding:'32px',textAlign:'center',fontSize:'.8rem',color:'var(--text-4)'}}>No match accounts yet. Open one from the console.</div>
            ) : filteredMatches.map((m, idx) => {
              const me      = wallet.publicKey?.toBase58();
              const isA     = !!(me && m.playerA.toBase58() === me);
              const isB     = !!(me && m.playerB.toBase58() === me);
              const expired = m.phase === 1 && BigInt(matchSlot) > m.deadline;
              return (
                <div key={m.pubkey.toBase58()} style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'14px 16px'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
                    <a href={EXPLORER_ADDR(m.pubkey.toBase58())} target="_blank" rel="noopener" style={{fontFamily:'var(--font-mono)',fontSize:'.8rem',fontWeight:600,color:'var(--g-orange)',textDecoration:'none'}}>{shortPk(m.pubkey)}</a>
                    <span style={{fontFamily:'var(--font-mono)',fontSize:'.62rem',padding:'2px 9px',borderRadius:'999px',...parseStyle(PHASE_STYLE[m.phase]??'')}}>{PHASE_NAME[m.phase]??'?'}{m.phase===2?' - '+(SIDE_NAME[m.winner]??'?'):''}</span>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
                    <MatchRow label="stake / side" val={lamportsToSol(m.stake) + ' SOL'} />
                    <MatchRow label="player A" val={shortPk(m.playerA) + (isA ? ' (you)' : '')} />
                    <MatchRow label="player B" val={m.playerB.toBase58() === ZERO_PK ? 'open' : shortPk(m.playerB) + (isB ? ' (you)' : '')} />
                    <MatchRow label="final tick" val={m.finalTick.toString()} />
                    {m.phase === 1 && <MatchRow label="deadline slot" val={m.deadline.toString() + (expired ? ' (expired)' : '')} />}
                  </div>
                  {matchErrors[idx] && <div style={{marginTop:'8px',fontSize:'.72rem',color:'var(--error)',fontFamily:'var(--font-mono)'}}>{matchErrors[idx]}</div>}
                  {/* Actions */}
                  {m.phase === 0 && isB && (
                    <div style={{marginTop:'10px'}}>
                      <button onClick={() => matchJoin(idx)} style={{background:'var(--text)',color:'#fff',border:'none',borderRadius:'999px',padding:'7px 14px',fontSize:'.75rem',fontWeight:600,cursor:'pointer',fontFamily:'var(--font-sans)'}}>join with {lamportsToSol(m.stake)} SOL</button>
                    </div>
                  )}
                  {m.phase === 0 && isA && (
                    <div style={{marginTop:'6px'}}>
                      <button onClick={() => matchCancel(idx)} style={{background:'none',border:'1px solid var(--border-md)',borderRadius:'999px',padding:'5px 14px',fontSize:'.75rem',color:'var(--text-2)',cursor:'pointer',fontFamily:'var(--font-sans)'}}>cancel &amp; refund</button>
                    </div>
                  )}
                  {expired && (
                    <div style={{marginTop:'6px'}}>
                      <button onClick={() => matchExpire(idx)} style={{background:'none',border:'1px solid var(--border-md)',borderRadius:'999px',padding:'5px 14px',fontSize:'.75rem',color:'var(--text-2)',cursor:'pointer',fontFamily:'var(--font-sans)'}}>expire &amp; refund both</button>
                    </div>
                  )}
                  {m.phase === 1 && (isA || isB) && (
                    <div style={{marginTop:'10px',background:'var(--bg-subtle)',borderRadius:'10px',padding:'12px 14px'}}>
                      <div style={{fontFamily:'var(--font-mono)',fontSize:'.6rem',letterSpacing:'.1em',color:'var(--text-4)',textTransform:'uppercase',marginBottom:'8px'}}>Cooperative settle (both signatures)</div>
                      {isA && (
                        <div>
                          <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap' as const}}>
                            <select value={winnersSelect[idx]??1} onChange={e => setWinnersSelect(p => ({...p,[idx]:parseInt(e.target.value)}))} style={{flex:1,background:'var(--bg-card)',border:'1px solid var(--border-md)',borderRadius:'8px',padding:'6px 10px',fontSize:'.8rem',fontFamily:'var(--font-sans)',color:'var(--text)',outline:'none',minWidth:'140px'}}>
                              <option value={1}>player A wins</option>
                              <option value={2}>player B wins</option>
                              <option value={0}>draw</option>
                            </select>
                            <button onClick={() => matchSignCoop(idx)} style={{background:'var(--text)',color:'#fff',border:'none',borderRadius:'999px',padding:'7px 14px',fontSize:'.75rem',fontWeight:600,cursor:'pointer',fontFamily:'var(--font-sans)',whiteSpace:'nowrap' as const}}>sign &amp; copy for player B</button>
                          </div>
                          {coopShare[idx] && <div style={{marginTop:'8px',fontFamily:'var(--font-mono)',fontSize:'.62rem',color:'var(--text-4)',wordBreak:'break-all' as const,lineHeight:1.5}}>{coopShare[idx]}</div>}
                        </div>
                      )}
                      {isB && (
                        <div style={{marginTop:'4px',display:'flex',flexDirection:'column' as const,gap:'8px'}}>
                          <textarea value={coopPaste[idx]??''} onChange={e => setCoopPaste(p => ({...p,[idx]:e.target.value}))} placeholder="paste player A's signed transaction (base64)" rows={2} style={{width:'100%',background:'var(--bg-card)',border:'1px solid var(--border-md)',borderRadius:'8px',padding:'8px 10px',fontFamily:'var(--font-mono)',fontSize:'.68rem',color:'var(--text)',outline:'none',resize:'none',boxSizing:'border-box' as const}} />
                          <button onClick={() => matchCoSignCoop(idx)} style={{alignSelf:'flex-start',background:'var(--text)',color:'#fff',border:'none',borderRadius:'999px',padding:'7px 14px',fontSize:'.75rem',fontWeight:600,cursor:'pointer',fontFamily:'var(--font-sans)'}}>co-sign &amp; submit</button>
                        </div>
                      )}
                      <p style={{marginTop:'8px',fontSize:'.65rem',color:'var(--text-4)',fontFamily:'var(--font-mono)',lineHeight:1.5}}>Contested settlement (referee proof + native replay): <code>cargo run -p devnet-match</code></p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{marginTop:'14px',display:'flex',gap:'8px'}}>
            <button className="btn-modal-primary" onClick={() => { closeModal(); openModal('console'); }}>
              <span className="material-symbols-outlined icon-fill" style={{fontSize:'16px'}}>add_circle</span>
              New match
            </button>
            <button className="btn-modal-cancel" onClick={closeModal}>Close</button>
          </div>
        </div>
      </div>}

      {/* MODAL: Wallet */}
      {activeModal === 'wallet' && <div className="modal-backdrop open" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
        <div className="modal">
          {wallet.connected ? (
            <>
              <h2>Wallet connected</h2>
              <p className="modal-sub">You are connected on devnet.</p>
              <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'14px',background:'var(--bg-subtle)',border:'1px solid var(--border)',borderRadius:'14px',padding:'14px 18px'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'var(--bg-card)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px'}}>{wallet.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:'var(--font-sans)',fontWeight:600,fontSize:'.875rem',color:'var(--text)'}}>{wallet.name}</div>
                    <div style={{fontFamily:'var(--font-mono)',fontSize:'.7rem',color:'var(--text-3)',marginTop:'2px'}}>{walletShort()}</div>
                  </div>
                  <span style={{width:'8px',height:'8px',borderRadius:'50%',background:'var(--success)',flexShrink:0}}></span>
                </div>
                <button onClick={disconnectWallet} style={{width:'100%',background:'none',border:'1px solid var(--border-md)',borderRadius:'14px',padding:'12px',fontFamily:'var(--font-sans)',fontSize:'.8rem',color:'var(--error)',cursor:'pointer'}}>
                  Disconnect
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>Connect Wallet</h2>
              <p className="modal-sub">Choose a Solana wallet to use tickpruv on devnet.</p>
              <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                {['Phantom','Solflare','Backpack'].map(name => (
                  <button key={name} onClick={() => connectWallet(name)} style={{display:'flex',alignItems:'center',gap:'14px',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'14px',padding:'14px 18px',cursor:'pointer',fontFamily:'inherit',width:'100%'}}>
                    <div style={{width:'36px',height:'36px',borderRadius:'10px',background:WALLET_GRAD[name],display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>{WALLET_EMOJI[name]}</div>
                    <div style={{flex:1,textAlign:'left'}}>
                      <div style={{fontFamily:'var(--font-sans)',fontWeight:600,fontSize:'.875rem',color:'var(--text)'}}>{name}</div>
                      <div style={{fontSize:'.72rem',color:'var(--text-3)',marginTop:'2px'}}>{WALLET_DESC[name]}</div>
                    </div>
                    <span className="material-symbols-outlined" style={{color:'var(--text-4)',fontSize:'18px'}}>chevron_right</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>}
    </div>
  );
}

function MatchRow({ label, val }: { label: string; val: string }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:'8px',fontSize:'.78rem'}}>
      <span style={{color:'var(--text-4)',fontFamily:'var(--font-mono)',fontSize:'.68rem',flexShrink:0}}>{label}</span>
      <span style={{color:'var(--text-2)',fontFamily:'var(--font-mono)',fontSize:'.7rem',textAlign:'right'}}>{val}</span>
    </div>
  );
}

function parseStyle(str: string): React.CSSProperties {
  const obj: Record<string, string> = {};
  str.split(';').forEach(part => {
    const [k, v] = part.split(':').map(s => s.trim());
    if (k && v) {
      const camel = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      obj[camel] = v;
    }
  });
  return obj as React.CSSProperties;
}
