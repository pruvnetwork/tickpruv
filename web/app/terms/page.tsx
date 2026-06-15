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

export default function TermsPage() {
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
    { id: 's01', label: 'Introduction' },
    { id: 's02', label: 'What tickpruv does' },
    { id: 's03', label: 'User responsibility' },
    { id: 's04', label: 'Funds & wallets' },
    { id: 's05', label: 'Dispute resolution' },
    { id: 's06', label: 'Prohibited use' },
    { id: 's07', label: 'No gambling representation' },
    { id: 's08', label: 'Limitation of liability' },
    { id: 's09', label: 'Changes to terms' },
    { id: 's10', label: 'Contact' },
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
            <a href="https://github.com/pruvnetwork/tickpruv" target="_blank" rel="noopener" aria-label="GitHub" style={{display:'flex',alignItems:'center'}}><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg></a>
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
            <div className="sidebar-doc-label">terms of service</div>
            <div className="sidebar-divider"></div>
          </div>
          <nav className="sidebar-nav">
            {sections.map(({ id, label }, i) => (
              <a key={id} className="sidebar-link" href={`#${id}`} data-section={id}>
                <span className="sidebar-link-num">{String(i+1).padStart(2,'0')}</span>{label}
              </a>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-version">tickpruv · devnet · Apache-2.0</div>
            <div className="sidebar-footer-links">
              <a href="https://github.com/pruvnetwork/tickpruv" target="_blank" rel="noopener" className="sidebar-footer-link">
                <GithubIcon />GitHub
              </a>
              <a href="https://x.com/pruvfun" target="_blank" rel="noopener" className="sidebar-footer-link">
                <XIcon />X
              </a>
            </div>
          </div>
        </aside>

        <main className="docs-main">
          <div className="docs-content">
            <div className="breadcrumb">
              <Link href="/">tickpruv</Link>
              <span className="breadcrumb-sep">/</span>
              <span>terms of service</span>
            </div>

            <p className="paper-eyebrow">Legal · June 2026</p>
            <h1 className="paper-title">Terms of Service</h1>
            <p className="paper-meta">Last updated: June 2026</p>

            <div className="sec-divider"></div>

            <div className="prose">
              <h2 id="s01"><span className="sec-num">01 //</span>Introduction</h2>
              <p>Welcome to tickpruv, a trustless peer-to-peer wagering protocol built on Solana. By accessing or using this interface, you agree to be bound by these Terms of Service. If you do not agree, do not use the protocol.</p>
              <p>tickpruv is an early-stage project running exclusively on <strong>Solana devnet</strong>. No real funds are at risk on mainnet at this time. These terms apply to the devnet console and all associated interfaces.</p>

              <h2 id="s02"><span className="sec-num">02 //</span>What tickpruv does</h2>
              <p>tickpruv enables two players to wager on the outcome of a deterministic game without trusting each other or any third party. The protocol:</p>
              <ul>
                <li>Escrows stakes on-chain via the wager program.</li>
                <li>Records game state commitments (state roots and input chains) at checkpoints.</li>
                <li>Resolves disputes through an interactive bisection protocol, ending in native on-chain replay of the disputed tick.</li>
                <li>Distributes the pot to the winner as determined by the game program itself.</li>
              </ul>
              <p>tickpruv does not act as a bookmaker, does not custody user funds directly, and does not determine winners. All settlement logic runs on-chain and is fully auditable.</p>

              <h2 id="s03"><span className="sec-num">03 //</span>User responsibility</h2>
              <p>You are solely responsible for:</p>
              <ul>
                <li>The wallet you connect and all transactions you sign.</li>
                <li>The match parameters you set (stake, opponent address, tick count, deadline).</li>
                <li>Ensuring your game client produces correct, honest state commitments.</li>
                <li>Meeting settlement deadlines. Expired matches return stakes but declare no winner.</li>
              </ul>
              <p>Prohibited actions include submitting fraudulent state roots, attempting to exploit the bisection protocol, colluding with an opponent to manipulate outcomes, and any other form of on-chain fraud.</p>

              <h2 id="s04"><span className="sec-num">04 //</span>Funds &amp; wallets</h2>
              <p>When you create or join a match, your stake is locked in an on-chain escrow account controlled by the wager program. tickpruv does not hold or custody your funds at any point.</p>
              <ul>
                <li>Blockchain transactions are permanent and irreversible.</li>
                <li>tickpruv is not responsible for wallet loss, compromised private keys, or user errors.</li>
                <li>Finalized settlements cannot be reversed by any party.</li>
                <li>All transactions on devnet use test SOL and carry no real monetary value.</li>
              </ul>
              <div className="callout callout-warn">
                <div><div className="callout-label">Warning</div>Never share your private key or seed phrase. tickpruv will never ask for them.</div>
              </div>

              <h2 id="s05"><span className="sec-num">05 //</span>Dispute resolution</h2>
              <p>Disputes are resolved entirely on-chain through the bisection protocol, with no human arbitration, no community voting, and no admin override. The process:</p>
              <ul>
                <li>Either player may assert a final state root with a bond.</li>
                <li>The opponent has a challenge window (set at match creation) to dispute.</li>
                <li>If challenged, the protocol bisects the range to the exact divergent tick.</li>
                <li>That tick is re-executed natively by the Solana cluster. The result is final.</li>
              </ul>
              <p>All dispute outcomes are determined by the game program&apos;s own logic and are binding. There is no appeals process.</p>

              <h2 id="s06"><span className="sec-num">06 //</span>Prohibited use</h2>
              <p>You may not use tickpruv to:</p>
              <ul>
                <li>Submit false or fabricated state roots or input chains.</li>
                <li>Exploit bugs in the bisection or wager programs for unintended gain.</li>
                <li>Operate bots or automated scripts that manipulate match outcomes.</li>
                <li>Violate any applicable law or regulation in your jurisdiction.</li>
                <li>Launder funds or engage in any form of financial fraud.</li>
              </ul>
              <p>Violations may result in on-chain punishment (losing your bond) and permanent exclusion from the interface.</p>

              <h2 id="s07"><span className="sec-num">07 //</span>No gambling representation</h2>
              <p>tickpruv is a peer-to-peer skill wagering protocol, not a gambling platform. Outcomes are determined by deterministic game logic and cryptographic proofs, not chance. You are wagering on the result of a skill-based game that both parties have agreed to play under identical rules.</p>
              <p>It is your responsibility to understand the laws governing skill-based wagering in your jurisdiction before using this protocol.</p>

              <h2 id="s08"><span className="sec-num">08 //</span>Limitation of liability</h2>
              <p>tickpruv is provided <strong>&quot;as is&quot;</strong>, without warranty of any kind. This is an early-stage devnet project. We are not responsible for:</p>
              <ul>
                <li>Smart contract bugs or unexpected on-chain behavior.</li>
                <li>Financial losses arising from use of the protocol.</li>
                <li>Network outages, validator downtime, or Solana infrastructure failures.</li>
                <li>Incorrect game outcomes due to client-side bugs outside the on-chain programs.</li>
              </ul>
              <p>To the maximum extent permitted by law, the total liability of tickpruv contributors shall not exceed the amount of fees paid by you in connection with the specific match that gave rise to the claim.</p>

              <h2 id="s09"><span className="sec-num">09 //</span>Changes to terms</h2>
              <p>These terms may be updated at any time. The &quot;Last updated&quot; date at the top reflects the most recent revision. Continued use of the interface after changes are posted constitutes acceptance of the updated terms.</p>
              <p>For significant changes, notice will be posted on <a href="https://x.com/pruvfun" target="_blank" rel="noopener">@pruvfun</a> on X.</p>

              <h2 id="s10"><span className="sec-num">10 //</span>Contact</h2>
              <p>For questions about these terms, reach out via:</p>
              <ul>
                <li>X: <a href="https://x.com/pruvfun" target="_blank" rel="noopener">@pruvfun</a></li>
                <li>GitHub: <a href="https://github.com/pruvnetwork/tickpruv" target="_blank" rel="noopener">github.com/pruvnetwork/tickpruv</a></li>
              </ul>
            </div>

            <footer className="page-footer">
              <div className="footer-pills">
                <span className="footer-pill">Apache-2.0</span>
                <span className="footer-pill">Early WIP · devnet only</span>
                <a href="https://github.com/pruvnetwork/tickpruv" target="_blank" rel="noopener" className="footer-pill"><GithubIcon />GitHub</a>
                <a href="https://x.com/pruvfun" target="_blank" rel="noopener" className="footer-pill"><XIcon />X</a>
              </div>
              <div className="footer-divider"></div>
              <div className="footer-nav">
                <Link href="/howto" className="footer-nav-link">How it works</Link>
                <Link href="/docs" className="footer-nav-link">Docs</Link>
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
