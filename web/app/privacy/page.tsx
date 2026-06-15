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

export default function PrivacyPage() {
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
    { id: 's01', label: 'Overview' },
    { id: 's02', label: 'Information we collect' },
    { id: 's03', label: 'How we use your data' },
    { id: 's04', label: 'Public information' },
    { id: 's05', label: 'Data sharing' },
    { id: 's06', label: 'Security' },
    { id: 's07', label: 'Cookies & tracking' },
    { id: 's08', label: 'Your rights' },
    { id: 's09', label: 'Data retention' },
    { id: 's10', label: 'Children' },
    { id: 's11', label: 'Changes' },
    { id: 's12', label: 'Contact' },
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
            <div className="sidebar-doc-label">privacy policy</div>
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
              <a href="https://github.com/nzengi/tickpruv" target="_blank" rel="noopener" className="sidebar-footer-link">
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
              <span>privacy policy</span>
            </div>

            <p className="paper-eyebrow">Legal · June 2026</p>
            <h1 className="paper-title">Privacy Policy</h1>
            <p className="paper-meta">Last updated: June 2026</p>

            <div className="sec-divider"></div>

            <div className="prose">
              <h2 id="s01"><span className="sec-num">01 //</span>Overview</h2>
              <p>tickpruv respects your privacy. This policy explains what data we collect, how we use it, and what choices you have. Because tickpruv is a protocol built on a public blockchain, some information is inherently public by design.</p>

              <h2 id="s02"><span className="sec-num">02 //</span>Information we collect</h2>
              <h3>Wallet information</h3>
              <ul>
                <li>Your public wallet address when you connect.</li>
                <li>On-chain transaction history related to matches you create or join.</li>
                <li>We do <strong>not</strong> collect or store private keys or seed phrases.</li>
              </ul>
              <h3>Usage data</h3>
              <ul>
                <li>Matches created, joined, and settled.</li>
                <li>Disputes opened and their outcomes.</li>
                <li>Pages visited and actions taken in the interface.</li>
              </ul>
              <h3>Technical data</h3>
              <ul>
                <li>Browser type and version.</li>
                <li>IP address (used for abuse prevention, not linked to identity).</li>
                <li>Error logs and performance metrics.</li>
              </ul>
              <div className="callout callout-info">
                <div><div className="callout-label">Note</div>tickpruv does not require account registration. No email address, name, or personal profile is collected.</div>
              </div>

              <h2 id="s03"><span className="sec-num">03 //</span>How we use your data</h2>
              <p>We use collected data to:</p>
              <ul>
                <li>Operate the interface and display match state.</li>
                <li>Detect and prevent abuse, fraud, and protocol exploits.</li>
                <li>Improve performance and user experience.</li>
                <li>Comply with applicable legal obligations.</li>
              </ul>
              <p>We do not use your data for advertising or sell it to third parties.</p>

              <h2 id="s04"><span className="sec-num">04 //</span>Public information</h2>
              <p>All on-chain activity is public by the nature of Solana. This includes:</p>
              <ul>
                <li>Your wallet address as match creator or participant.</li>
                <li>Stake amounts, match parameters, and settlement transactions.</li>
                <li>State root assertions and dispute outcomes.</li>
              </ul>
              <p>Do not use a wallet address you wish to keep private for match activity.</p>

              <h2 id="s05"><span className="sec-num">05 //</span>Data sharing</h2>
              <p>We do <strong>not</strong> sell your personal data. Data may be shared only in the following circumstances:</p>
              <ul>
                <li><strong>Legal compliance:</strong> if required by law, court order, or governmental authority.</li>
                <li><strong>Fraud prevention:</strong> with security partners to investigate abuse.</li>
                <li><strong>Service providers:</strong> hosting and infrastructure providers who process data on our behalf under strict confidentiality terms.</li>
              </ul>

              <h2 id="s06"><span className="sec-num">06 //</span>Security</h2>
              <p>We use reasonable technical and organizational measures to protect data. However, no system is 100% secure. Blockchain activity is public by nature and cannot be made private after the fact.</p>
              <p>You are responsible for securing your own wallet and private keys. tickpruv cannot recover lost wallets or reverse on-chain transactions.</p>

              <h2 id="s07"><span className="sec-num">07 //</span>Cookies &amp; tracking</h2>
              <p>The interface may use cookies or local storage for:</p>
              <ul>
                <li>Remembering your wallet connection preference.</li>
                <li>Session state (e.g., open modals, filter settings).</li>
                <li>Anonymous usage analytics to improve the product.</li>
              </ul>
              <p>No cross-site tracking or advertising cookies are used. You can clear browser storage at any time without losing on-chain match state.</p>

              <h2 id="s08"><span className="sec-num">08 //</span>Your rights</h2>
              <p>Depending on your jurisdiction, you may have the right to:</p>
              <ul>
                <li>Request access to data we hold about you.</li>
                <li>Request deletion of off-chain data we store.</li>
                <li>Opt out of analytics tracking.</li>
              </ul>
              <p>Note that on-chain data (Solana transactions) cannot be deleted, as it is part of a permanent public ledger. Contact us at <a href="https://x.com/pruvfun" target="_blank" rel="noopener">@pruvfun</a> to exercise any of the above rights.</p>

              <h2 id="s09"><span className="sec-num">09 //</span>Data retention</h2>
              <p>We retain off-chain usage data only as long as necessary to operate the service and meet legal obligations. Blockchain data is permanent and outside our control.</p>
              <p>If you stop using the interface, off-chain data associated with your session may be deleted after 12 months of inactivity.</p>

              <h2 id="s10"><span className="sec-num">10 //</span>Children</h2>
              <p>tickpruv is not intended for users under the age of 18. We do not knowingly collect data from minors. If you believe a minor has used the protocol, contact us and we will take appropriate action with respect to any off-chain data.</p>

              <h2 id="s11"><span className="sec-num">11 //</span>Changes</h2>
              <p>We may update this policy at any time. The &quot;Last updated&quot; date at the top reflects the most recent revision. Continued use of the interface after changes are posted constitutes acceptance of the updated policy.</p>
              <p>Significant changes will be announced on <a href="https://x.com/pruvfun" target="_blank" rel="noopener">@pruvfun</a> on X.</p>

              <h2 id="s12"><span className="sec-num">12 //</span>Contact</h2>
              <p>For privacy questions or requests:</p>
              <ul>
                <li>X: <a href="https://x.com/pruvfun" target="_blank" rel="noopener">@pruvfun</a></li>
                <li>GitHub: <a href="https://github.com/nzengi/tickpruv" target="_blank" rel="noopener">github.com/nzengi/tickpruv</a></li>
              </ul>
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
                <Link href="/docs" className="footer-nav-link">Docs</Link>
                <Link href="/terms" className="footer-nav-link">Terms</Link>
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
