'use client';

import { useEffect } from 'react';
import Link from 'next/link';

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

export default function HowtoPage() {
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

  const sections = [
    { id: 's01', label: 'Creating a match' },
    { id: 's02', label: 'Joining' },
    { id: 's03', label: 'Playing off-chain' },
    { id: 's04', label: 'Claiming victory' },
    { id: 's05', label: 'Going to court' },
    { id: 's06', label: 'How bisection works' },
    { id: 's07', label: 'Nobody claims' },
    { id: 's08', label: 'Timings' },
    { id: 's09', label: 'Fees & costs' },
  ];

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
            <div className="sidebar-doc-label">how it works</div>
            <div className="sidebar-divider"></div>
          </div>
          <nav className="sidebar-nav">
            {sections.map(({ id, label }, i) => (
              <a key={id} className="sidebar-link" href={`#${id}`} data-section={id}>
                <span className="sidebar-link-num">0{i+1}</span>{label}
              </a>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-version">tickpruv · devnet · Apache-2.0</div>
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
              <span>how it works</span>
            </div>

            <p className="paper-eyebrow">guide · devnet prototype</p>
            <h1 className="paper-title">How a match settles <em>without trust</em></h1>
            <p className="paper-meta">tickpruv · step-by-step walkthrough</p>

            <div className="sec-divider"></div>

            <div className="prose">
              <h2 id="s01"><span className="sec-num">01 //</span>Creating a match</h2>
              <p>Open the console, connect your Solana wallet, and fill in the match parameters. When you click <strong>Create match</strong>, the wager program locks your stake on devnet. No server holds the funds; it is an on-chain escrow account.</p>
              <ol>
                <li>Open the <strong>Console</strong> from the header or the + button in the bottom nav.</li>
                <li>Connect your Solana wallet (Phantom, Solflare, or Backpack).</li>
                <li>Enter your opponent&apos;s wallet address in the <strong>Opponent (player B)</strong> field.</li>
                <li>Set the <strong>stake per side</strong> (SOL), <strong>match length</strong> in ticks, and <strong>settlement deadline</strong> in slots after join.</li>
                <li>Click <strong>Create match</strong>. Your stake is escrowed by the wager program.</li>
                <li>Share the match address with your opponent so they can join.</li>
              </ol>
              <div className="callout callout-info">
                <p>The match account pins the game program, the genesis state commitment, and the final tick count. These cannot be changed after creation.</p>
              </div>

              <h2 id="s02"><span className="sec-num">02 //</span>Joining</h2>
              <p>Your opponent created a match and shared the address with you. Joining locks your stake and makes the match live; gameplay can begin immediately after.</p>
              <ol>
                <li>Open <strong>Court</strong> from the bottom nav.</li>
                <li>Find the match by its on-chain address, or check <strong>only mine</strong> to filter matches that include your wallet.</li>
                <li>Click <strong>Join</strong>. Your stake (equal to the opener&apos;s) is escrowed by the wager program.</li>
                <li>The match is now live. The settlement clock starts: both players have until the deadline to settle.</li>
              </ol>
              <div className="callout callout-info">
                <p>The stake you lock must exactly match the amount set by the match creator. Partial stakes are rejected.</p>
              </div>

              <h2 id="s03"><span className="sec-num">03 //</span>Playing off-chain</h2>
              <p>The game runs entirely off-chain through the real <strong>Agave runtime</strong>, the same virtual machine that Solana validators use. Neither player needs to send transactions while playing. Speed is unconstrained.</p>
              <ul>
                <li>Game logic is compiled to <strong>SBF</strong> (Solana Bytecode Format), the same bytecode the chain executes natively.</li>
                <li>At every checkpoint, a <strong>state root</strong> (Merkle hash of the full game state) is committed.</li>
                <li>Every player input is recorded in an <strong>input chain</strong> so any tick can be replayed deterministically.</li>
                <li>Neither player can forge a state root without owning the inputs that produce it.</li>
              </ul>
              <div className="callout callout-info">
                <p>Throughput is ~17,000 ticks per second through the full runtime pipeline. A 32-tick match completes in under 2 milliseconds of compute time.</p>
              </div>

              <h2 id="s04"><span className="sec-num">04 //</span>Claiming victory</h2>
              <p>If both players agree on the outcome, two signatures settle the match instantly. This is the fast path: no dispute, no delay, minimal fees.</p>
              <ol>
                <li>The match reaches its final tick.</li>
                <li>Both players sign the final state root off-chain.</li>
                <li>Either player submits the co-signed settlement transaction.</li>
                <li>The wager program verifies both signatures and sends the full pot to the winner.</li>
              </ol>
              <div className="callout callout-info">
                <p>An honest match settles in ~6 transactions over ~31 seconds on devnet, costing ~65,000 lamports in fees.</p>
              </div>

              <h2 id="s05"><span className="sec-num">05 //</span>Going to court</h2>
              <p>If one player disputes the result, either player can open a <strong>proven settle</strong>: assert the final checkpoint with a bond and survive a challenge window. The chain arbitrates without any third party.</p>
              <ol>
                <li>The asserting player submits the final state root along with a <strong>bond</strong> (an extra stake that they lose if proven wrong).</li>
                <li>The <strong>challenge window</strong> opens. The opponent has a fixed number of slots to respond.</li>
                <li>If the window expires unchallenged, the assertion is accepted and the asserter collects the pot.</li>
                <li>If the opponent challenges, <strong>bisection</strong> begins to find the exact disputed tick.</li>
              </ol>
              <ul>
                <li>Either player can assert; whoever moves first sets the initial claim.</li>
                <li>A false assertion is provably punished by losing the bond.</li>
                <li>A valid challenge that the asserter cannot answer also wins the pot.</li>
              </ul>

              <h2 id="s06"><span className="sec-num">06 //</span>How bisection works</h2>
              <p>Bisection is an interactive binary-search protocol. Each round halves the disputed range until a single tick is isolated. That tick is then re-executed <strong>natively by the Solana cluster</strong>, the exact same SBF bytecode, as an ordinary program invocation.</p>
              <ol>
                <li>The challenger identifies the first checkpoint where their state root diverges from the asserter&apos;s.</li>
                <li>The protocol bisects the range: each round halves the search space.</li>
                <li>After log₂(ticks) rounds, a single disputed tick is isolated.</li>
                <li>The referee program submits that one tick as a normal Solana transaction.</li>
                <li>Agave executes it natively. The output is the ground truth: no oracle, no zkVM.</li>
                <li>The game program returns <code>draw</code> / <code>first</code> / <code>second</code> as return data. Payout follows immediately.</li>
              </ol>
              <div className="callout callout-info">
                <p>One fraud-proof step costs ~19k compute units, about 1.4% of a single transaction&apos;s budget. A full adversarial settlement completes in ~20 transactions over ~47 seconds on devnet.</p>
              </div>

              <h2 id="s07"><span className="sec-num">07 //</span>Nobody claims</h2>
              <p>If neither player settles before the <strong>settlement deadline</strong>, the match enters an expired state. At that point, either player can call the wager program to reclaim their original stake. The pot is split and returned; no winner is declared.</p>
              <ul>
                <li>Expired matches are visible in Court under the <strong>expired</strong> filter.</li>
                <li>No penalty is applied for an expired match, only the on-chain transaction fee for the reclaim call.</li>
                <li>The deadline is set in <strong>slots after join</strong> at match creation and cannot be changed.</li>
              </ul>
              <div className="callout callout-info">
                <p>If your opponent goes silent, you can still assert your result unilaterally and win the pot by surviving the unchallenged window. You do not need to let it expire.</p>
              </div>

              <h2 id="s08"><span className="sec-num">08 //</span>Timings</h2>
              <p>All timings below are from real devnet transactions and the Agave runtime. They will vary slightly with network load.</p>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Metric</th><th>Value</th><th>Notes</th></tr></thead>
                  <tbody>
                    <tr><td>1 arena tick</td><td>~2,000 CU</td><td>Under the real Agave runtime</td></tr>
                    <tr><td>Engine throughput</td><td>~17,000 ticks/s</td><td>Full runtime pipeline</td></tr>
                    <tr><td>Honest settlement</td><td>~6 tx / ~31 s</td><td>Both players co-sign</td></tr>
                    <tr><td>Full adversarial</td><td>~20 tx / ~47 s</td><td>Cheater bisected &amp; paid out</td></tr>
                    <tr><td>Challenge window</td><td>Configurable</td><td>Set in slots at match creation</td></tr>
                    <tr><td>Settlement deadline</td><td>Configurable</td><td>Slots after player B joins</td></tr>
                  </tbody>
                </table>
              </div>

              <h2 id="s09"><span className="sec-num">09 //</span>Fees &amp; costs</h2>
              <p>All figures come from confirmed devnet transactions. Mainnet fees follow the same CU model.</p>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Operation</th><th>Cost</th></tr></thead>
                  <tbody>
                    <tr><td>One fraud-proof step</td><td>~19k CU (~1.4% of tx budget)</td></tr>
                    <tr><td>Trustless settle (root check + verdict CPI + payout)</td><td>~13k CU</td></tr>
                    <tr><td>Honest match, end to end</td><td>~65,000 lamports in fees</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="sec-divider"></div>

              <h2 id="programs" style={{marginTop:0}}><span className="sec-num">A //</span>Deployed programs</h2>
              <p style={{marginBottom:'12px'}}>All three programs are live on Solana devnet.</p>
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
                <Link href="/docs" className="footer-nav-link">Docs</Link>
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
            {sections.map(({ id, label }) => (
              <a key={id} className="toc-link" href={`#${id}`} data-toc={id}>{label}</a>
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
}
