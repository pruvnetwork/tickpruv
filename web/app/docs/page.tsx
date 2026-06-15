'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

const GithubIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);
const XIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function PaperPage() {
  useEffect(() => {
    const sections = document.querySelectorAll('[id]');
    const sideLinks = document.querySelectorAll<HTMLAnchorElement>('.sidebar-link[data-section]');
    const tocLinks  = document.querySelectorAll<HTMLAnchorElement>('.toc-link[data-toc]');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          sideLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
          tocLinks.forEach(l => l.classList.toggle('active', l.dataset.toc === id));
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const toggleSidebar = () => {
    document.getElementById('sidebar')?.classList.toggle('open');
    document.getElementById('sidebar-overlay')?.classList.toggle('open');
  };

  const copyCode = (text: string, btn: HTMLButtonElement) => {
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = 'copied';
      (btn.style as any).color = 'rgba(90,112,82,.9)';
      setTimeout(() => { btn.textContent = 'copy'; (btn.style as any).color = ''; }, 2000);
    });
  };

  return (
    <>
      <header className="site-header site-header-fixed">
        <div className="header-inner">
          <Link href="/" className="logo">
            <span className="logo-text">tickpruv</span>
            <span className="devnet-badge">devnet</span>
          </Link>
          <nav className="header-nav">
            <Link href="/docs">Docs</Link>
            <Link href="/" className="header-nav-console">Console</Link>
            <a href="https://github.com/nzengi/tickpruv" target="_blank" rel="noopener" aria-label="GitHub" style={{display:'flex',alignItems:'center'}}><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg></a>
            <a href="https://x.com/pruvfun" target="_blank" rel="noopener" aria-label="X" style={{display:'flex',alignItems:'center'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
          </nav>
        </div>
      </header>

      <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle navigation">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <div className="sidebar-overlay" id="sidebar-overlay" onClick={toggleSidebar}></div>

      <div className="docs-shell">
        <aside className="sidebar" id="sidebar">
          <div className="sidebar-top">
            <Link href="/" className="sidebar-back">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              ← home
            </Link>
            <div className="sidebar-brand">tickpruv</div>
            <div className="sidebar-doc-label">technical paper</div>
            <div className="sidebar-divider"></div>
          </div>
          <nav className="sidebar-nav">
            <div className="sidebar-section-label" style={{marginBottom:'8px'}}>00 // OVERVIEW</div>
            <a href="#abstract" className="sidebar-link active" data-section="abstract"><span className="sidebar-link-num">·</span>Abstract</a>
            <div className="sidebar-section-label" style={{marginTop:'16px',marginBottom:'8px'}}>01 // DESIGN</div>
            <a href="#s1" className="sidebar-link" data-section="s1"><span className="sidebar-link-num">01</span>The problem</a>
            <a href="#s2" className="sidebar-link" data-section="s2"><span className="sidebar-link-num">02</span>Deterministic tick programs</a>
            <a href="#s3" className="sidebar-link" data-section="s3"><span className="sidebar-link-num">03</span>State roots &amp; input chain</a>
            <a href="#s4" className="sidebar-link" data-section="s4"><span className="sidebar-link-num">04</span>Referee &amp; bisection</a>
            <a href="#s5" className="sidebar-link" data-section="s5"><span className="sidebar-link-num">05</span>Wager layer</a>
            <div className="sidebar-section-label" style={{marginTop:'16px',marginBottom:'8px'}}>02 // RESULTS</div>
            <a href="#s6" className="sidebar-link" data-section="s6"><span className="sidebar-link-num">06</span>Measured results</a>
            <a href="#s7" className="sidebar-link" data-section="s7"><span className="sidebar-link-num">07</span>Security &amp; known gaps</a>
            <a href="#s8" className="sidebar-link" data-section="s8"><span className="sidebar-link-num">08</span>Beyond games</a>
            <div className="sidebar-section-label" style={{marginTop:'16px',marginBottom:'8px'}}>A // ARTIFACTS</div>
            <a href="#appendix" className="sidebar-link" data-section="appendix"><span className="sidebar-link-num">A</span>Deployed programs</a>
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-version">v0.1.0 // june 2026</div>
            <div className="sidebar-footer-links">
              <a href="https://github.com/nzengi/tickpruv" target="_blank" rel="noopener" className="sidebar-footer-link"><GithubIcon />GitHub</a>
              <a href="https://x.com/pruvfun" target="_blank" rel="noopener" className="sidebar-footer-link"><XIcon />X</a>
            </div>
          </div>
        </aside>

        <main className="docs-main">
          <div className="docs-content">
            <div className="breadcrumb">
              <Link href="/">tickpruv</Link>
              <span className="breadcrumb-sep">/</span>
              <span>technical paper</span>
            </div>

            <p className="paper-eyebrow">technical paper · june 2026 · devnet prototype</p>
            <h1 className="paper-title">
              Native re-execution as a fraud proof:<br />
              <em>trustless settlement of real-time games on Solana</em>
            </h1>
            <p className="paper-meta">tickpruv: verifiable game engine &amp; stake escrow</p>
            <p className="paper-source" style={{marginTop:'6px'}}>
              <a href="https://github.com/nzengi/tickpruv" target="_blank" rel="noopener">Source repository ↗</a>.
              All figures reproduce from the repo against Solana devnet.
            </p>

            <div className="sec-divider"></div>

            <div className="prose">
              <h2 id="abstract"><span className="sec-num">·</span>Abstract</h2>
              <p>Real-time games cannot run on a blockchain, 60 Hz tick rates and sub-millisecond input latency are incompatible with global consensus. So every "play for money" product on Solana today runs the game on a server and asks the chain to believe the server&apos;s result. We describe a system that keeps the game off-chain at full speed but makes its outcome <strong>objectively enforceable</strong>: game logic is compiled once to SBF, executed off-chain inside the real Solana program runtime, and committed to with Merkle state roots. In a dispute, an interactive bisection narrows disagreement to a single tick, and that tick is re-executed <em>natively by the L1 itself</em>, the same SBF bytecode, as an ordinary program invocation. On top of this we build a stake escrow in which two players wager real funds on a match and no server, oracle, or counterparty is ever trusted with the pot. The complete fraud proof costs ~19k compute units (about 1.4% of one transaction&apos;s budget); a full adversarial settlement, lie, challenge, bisection, native replay, payout, completed in 20 transactions over 47 seconds on devnet.</p>

              <div className="sec-divider"></div>

              <h2 id="s1"><span className="sec-num">01 //</span>The problem</h2>
              <p>A two-player wager has a simple shape: both sides lock a stake, a game produces a winner, the winner takes the pot. The hard part is the middle. Whoever reports the result can steal the pot, so the reporter must be trusted, and on Solana today that reporter is always a backend server, sometimes dressed up as an oracle or a multisig. The result is custodial risk wearing a decentralization costume.</p>
              <p>There are three known ways out, and two of them do not work for real-time games:</p>
              <div className="gap-cards">
                <div className="gap-card"><div className="gap-term">Run the game on-chain</div><p className="gap-desc">Fine for chess and turn-based games; impossible for anything with a tick rate. Block times and fees rule out 60 updates per second, and inputs would leak to the mempool.</p></div>
                <div className="gap-card"><div className="gap-term">Prove execution with a zkVM</div><p className="gap-desc">Proving costs are orders of magnitude above real-time budgets, and verification is not cheap either: a single SP1 Groth16 verification costs ~280k CU on Solana, more than an entire transaction&apos;s default budget, before proving a single tick.</p></div>
                <div className="gap-card"><div className="gap-term">Optimistic verification with fraud proofs</div><p className="gap-desc">Commit to execution, allow challenges, re-execute only the disputed step. This is the rollup playbook, but rollups must build an interpreter or zk circuit for their VM because their L1 cannot execute their state transition natively.</p></div>
              </div>
              <div className="callout callout-info">
                <p>The observation behind tickpruv: on Solana, the L1 already executes the exact VM the game runs in. If game logic is SBF bytecode, the chain can re-execute any disputed tick as a plain CPI, no interpreter-in-a-contract (we measured one: 80+ CU per emulated instruction, so an interpreted tick starts at ~157k CU before memory proofs), no proving infrastructure. The fraud proof is the program itself.</p>
              </div>

              <h2 id="s2"><span className="sec-num">02 //</span>Deterministic tick programs</h2>
              <p>Everything rests on bit-exact replay, so the game kernel is deliberately austere. A game is a pure state transition:</p>
              <div className="code-block">
                <div className="code-header">
                  <span className="code-lang">rust</span>
                  <button className="code-copy" onClick={e => copyCode("state' = tick(state, inputs, tick_index)", e.currentTarget)}>copy</button>
                </div>
                <div className="code-body"><pre><code>{"state' = tick(state, inputs, tick_index)"}</code></pre></div>
              </div>
              <p>written in <code>no_std</code> Rust with no floats, no heap, no clock, no host entropy (<code>crates/tick-core</code>). Numerics are Q32.32 fixed point; randomness, if a game wants it, is a seeded xorshift64* whose seed is part of the state. The same crate compiles to both native code and SBF, and the test suite pins them to each other: a thousand ticks of randomized input produce bit-identical state in both builds, and a frozen golden hash catches semantic drift.</p>
              <p>The reference game (<code>games/arena</code>) is a small physics arena, eight balls, impulse inputs, wall bounces, friction, chosen to exercise the pipeline, not to be fun. One arena tick costs at most ~2,000 CU under the real runtime, and the off-chain engine pushes ~17k ticks/s through the full pipeline on one core, room for hundreds of simultaneous 60 Hz sessions.</p>

              <h2 id="s3"><span className="sec-num">03 //</span>Commitments: state roots and the input chain</h2>
              <p>The engine (<code>crates/runtime</code>) drives the SBF build through the actual agave program runtime (via mollusk) and periodically emits checkpoints. A checkpoint commits to two things:</p>
              <div className="path-cards">
                <div className="path-card" style={{borderTop:'3px solid var(--g-blue)'}}>
                  <div className="path-card-label" style={{color:'var(--g-blue)'}}>Commitment 1</div>
                  <div className="path-card-title">State root</div>
                  <p className="path-card-desc">The game state is split into 32-byte chunks and folded into a binary SHA-256 Merkle tree with domain-separated leaf/node/root tags; the state length is committed at the root so zero-padding cannot be confused with content. Root computation costs ~11 CU/byte on-chain, so even an 8 KB game state keeps verification under 15% of a transaction budget.</p>
                </div>
                <div className="path-card" style={{borderTop:'3px solid var(--g-purple)'}}>
                  <div className="path-card-label" style={{color:'var(--g-purple)'}}>Commitment 2</div>
                  <div className="path-card-title">Input chain</div>
                  <p className="path-card-desc">A rolling hash <code>{"chain' = H(tag, chain, inputs_t)"}</code> over the input log. A state root alone does not pin down <em>which inputs</em> produced it; without the chain, a dishonest asserter could invent a convenient input log at replay time.</p>
                </div>
              </div>
              <p>A claim is therefore 64 bytes (state root plus input chain), and the claim at tick 0 (the <em>genesis claim</em>) is computable by anyone, including this website, which derives it in the browser byte-for-byte when opening a match.</p>

              <h2 id="s4"><span className="sec-num">04 //</span>The referee: bisection to a single tick</h2>
              <p>The referee program (<code>programs/referee</code>) runs the optimistic game. An operator asserts a checkpoint at some tick with a bond. If nobody objects within the challenge window, it finalizes. If a challenger bonds and disagrees, the two parties play an interactive bisection: the operator publishes the claim at the midpoint of the disputed range, the challenger says &quot;agree below / disagree above&quot; (or vice versa), and the range halves. After log₂(n) rounds the disagreement is exactly one tick wide.</p>
              <p>That tick is then settled by the chain itself, in one transaction:</p>
              <ol>
                <li>the submitted pre-state must hash to the agreed lower claim,</li>
                <li>the submitted inputs must extend the lower input chain to the asserted upper chain,</li>
                <li>a scratch account is seeded with the pre-state via CPI into the game program,</li>
                <li>the game program executes the tick <strong>natively</strong>, the same SBF the operator ran off-chain,</li>
                <li>the resulting state root either matches the asserted claim or it does not. Winner takes both bonds.</li>
              </ol>
              <p>Anyone may submit the replay; the outcome is decided by execution, not by who called it. One deliberate asymmetry: if the disputed tick cannot execute at all, the replay transaction can never land and the challenger wins by timeout, the burden of proof sits with the asserter. The complete one-step proof lands at <strong>~19k CU</strong>.</p>

              <h2 id="s5"><span className="sec-num">05 //</span>The wager layer: escrow without a reporter</h2>
              <p><code>programs/wager</code> turns the referee into money. A match account pins both players, the game program, the stake, the final tick, a settlement deadline, and the genesis claim. Player A escrows a stake to open; player B matches it to join. Settlement has two paths:</p>
              <div className="path-cards">
                <div className="path-card cooperative">
                  <div className="path-card-label">Path 1 · happy path</div>
                  <div className="path-card-title">Cooperative</div>
                  <p className="path-card-desc">Both players sign the result byte; the pot pays out instantly. This is the expected path for nearly every match, the trustless machinery below is what makes refusing to sign pointless.</p>
                </div>
                <div className="path-card proven">
                  <div className="path-card-label">Path 2 · dispute path</div>
                  <div className="path-card-title">Proven</div>
                  <p className="path-card-desc">Either player runs a referee session, asserts the final checkpoint, and survives the challenge window. The wager program asks <em>the game program itself</em> who won: a <code>Verdict</code> CPI over the proven state returns draw/first/second as return data. Any tick game that exposes LoadState/Verdict settles through the same escrow unchanged.</p>
                </div>
              </div>
              <h3>Per-player session slots</h3>
              <p>Each player binds their <em>own</em> referee session to the match, and can only ever rebind their own slot. This closes a real griefing lane: with a single shared slot, a cheater could rebind a fresh virgin session right before the honest player&apos;s settlement transaction lands, invalidating it forever. With per-player slots a player can only sabotage their own path to settlement; the opponent&apos;s proof stands.</p>
              <h3>Punishment and payout are separate concerns</h3>
              <p>When a cheater&apos;s assertion is destroyed in a dispute, they lose their <em>bond</em> to the challenger, but the <em>pot</em> still goes to whoever actually won the game, as named by the verdict over the true final state. Lying about a match you genuinely won costs you the bond and nothing else; lying about a match you lost costs you the bond and the match. Incentives stay aligned in both directions.</p>
              <h3>Liveness</h3>
              <p>Funds cannot deadlock. An unjoined match is cancellable by its creator; a live match that nobody manages to settle refunds both sides after the deadline.</p>

              <div className="sec-divider"></div>

              <h2 id="s6"><span className="sec-num">06 //</span>Measured results</h2>
              <p>Prototype windows are deliberately short (64-slot challenge window, 150-slot move deadline) to make devnet runs watchable; mainnet values would be hours. Everything below is from confirmed devnet transactions or the real agave runtime:</p>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Quantity</th><th>Measured</th></tr></thead>
                  <tbody>
                    <tr><td>One arena tick (real runtime)</td><td>≤ ~2,000 CU</td></tr>
                    <tr><td>Complete one-step fraud proof</td><td>~19k CU (~1.4% of a tx budget)</td></tr>
                    <tr><td>Trustless settle instruction</td><td>~13k CU</td></tr>
                    <tr><td>Interpreted re-execution (comparison)</td><td>80+ CU / instruction; ~157k CU per tick</td></tr>
                    <tr><td>SP1 Groth16 verify (comparison)</td><td>~280k CU</td></tr>
                    <tr><td>Honest match, end to end on devnet</td><td>6 tx / ~31 s / 65k lamports</td></tr>
                    <tr><td>Adversarial match on devnet</td><td>20 tx / ~47 s; lie cornered to ticks 20→21</td></tr>
                    <tr><td>State root cost</td><td>~11 CU/byte, linear</td></tr>
                    <tr><td>Engine throughput</td><td>~17k ticks/s per core</td></tr>
                  </tbody>
                </table>
              </div>
              <p>The adversarial run is worth reading on an explorer: the <a href="https://explorer.solana.com/tx/3NHghoFCePjdaV9fWgMAyeFuTUz252xYee5K43q1DYP2VwpmWyE6heSHmFq1pgpLnnwyytGaeLmvixXPBARrwVBU?cluster=devnet" target="_blank" rel="noopener">native replay transaction ↗</a> is the cluster re-executing the disputed tick and convicting the cheater, and the <a href="https://explorer.solana.com/tx/66RatuBWpAkJDBYi5JXWiTaNiMsDDxufBAguFueMG2wej1utwU6LXbxzg1qJaKDyhV3XxyhmGXZGFNzU6FNp8hn7?cluster=devnet" target="_blank" rel="noopener">settlement transaction ↗</a> is the escrow paying the true winner through the game&apos;s own verdict. Both times the cluster&apos;s replay matched the locally computed trace bit for bit.</p>

              <h2 id="s7"><span className="sec-num">07 //</span>Security model and known gaps</h2>
              <p>This is an early prototype. The honest list:</p>
              <div className="gap-cards">
                <div className="gap-card"><div className="gap-term">Input authenticity</div><p className="gap-desc">The input chain pins <em>which</em> inputs were committed, not <em>who</em> produced them. A session operator could attribute invented inputs to the opponent. The fix, player-signed input entries verified inside the tick function, is the next layer.</p></div>
                <div className="gap-card"><div className="gap-term">Single challenger per session</div><p className="gap-desc">The referee resolves one dispute per assertion; a resolved session is dead. The per-player slot design absorbs this for wagers, but a production referee wants multi-challenger sessions.</p></div>
                <div className="gap-card"><div className="gap-term">Optimistic liveness</div><p className="gap-desc">A player who never watches the chain can be cheated by an unchallenged false finalization, inherent to optimistic systems; watchtowers are the standard mitigation.</p></div>
                <div className="gap-card"><div className="gap-term">Prototype parameters</div><p className="gap-desc">Devnet windows are minutes, not hours, and the cooperative-settle handoff rides a ~60 s blockhash window. Durable nonces remove that limit.</p></div>
              </div>

              <h2 id="s8"><span className="sec-num">08 //</span>Why this matters beyond games</h2>
              <p>The deeper claim is about the substrate: any deterministic computation expressible as an SBF program with byte-array state can be run off-chain at native speed and held accountable by the chain at ~19k CU per dispute, with zero proving overhead in the happy path. Real-time games are the most demanding instance, tick rates, adversarial counterparties, money on the line, which is exactly why they make a good proof. Order matching, simulations, multi-step agent workflows: anything with a pure state transition fits the same mold.</p>
              <div className="callout callout-info">
                <p>The chain is not a computer you run things on. It is a court you never have to visit, but whose verdicts are mechanical.</p>
              </div>

              <div className="sec-divider"></div>

              <h2 id="appendix"><span className="sec-num">A //</span>Deployed artifacts</h2>
              <p style={{marginBottom:'12px'}}>All three programs are live on Solana devnet.</p>
              <div className="code-block" style={{marginBottom:'20px'}}>
                <div className="code-header"><span className="code-lang">zsh</span></div>
                <div className="code-body"><pre><code><span style={{color:'#9d97a4'}}># honest run</span>{'\n'}cargo run -p devnet-match --release{'\n\n'}<span style={{color:'#9d97a4'}}># adversarial run</span>{'\n'}cargo run -p devnet-match --release -- --cheat</code></pre></div>
              </div>

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
                  <div className="program-addr">{p.addr}</div>
                  <span className="program-arrow">↗</span>
                </a>
              ))}
            </div>

            <footer className="page-footer">
              <div className="footer-pills">
                <span className="footer-pill">Apache-2.0</span>
                <span className="footer-pill">Early WIP · devnet only</span>
                <a href="https://github.com/nzengi/tickpruv" target="_blank" rel="noopener" className="footer-pill"><GithubIcon />GitHub</a>
                <a href="https://x.com/pruvfun" target="_blank" rel="noopener" className="footer-pill"><XIcon />X</a>
              </div>
              <div className="footer-divider"></div>
              <div className="footer-nav">
                <Link href="/howto" className="footer-nav-link">How it works</Link>
                <Link href="/terms" className="footer-nav-link">Terms</Link>
                <Link href="/privacy" className="footer-nav-link">Privacy</Link>
              </div>
              <p className="footer-copy">© 2026 TICKPRUV</p>
            </footer>
          </div>
        </main>

        <aside className="toc-panel">
          <p className="toc-heading">On this page</p>
          <nav className="toc-list">
            {[
              ['abstract','Abstract'],['s1','The problem'],['s2','Deterministic ticks'],
              ['s3','State roots & input chain'],['s4','Referee & bisection'],['s5','Wager layer'],
              ['s6','Measured results'],['s7','Security & gaps'],['s8','Beyond games'],['appendix','Deployed programs'],
            ].map(([id, label]) => (
              <a key={id} href={`#${id}`} className="toc-link" data-toc={id}>{label}</a>
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
}
