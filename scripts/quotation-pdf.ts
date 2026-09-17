/* Quotation PDF generator for Shortlet Connect */
import fs from 'fs';
import puppeteer from 'puppeteer';

const today = new Date();
const dateStr = today.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' });

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Quotation - Shortlet Connect</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 11px; color:#222; margin:32px; }
    h1 { text-align:center; font-size:22px; margin:0 0 4px; }
    h2.subtitle { text-align:center; font-size:13px; font-weight:normal; font-style:italic; margin:0 0 18px; }
    h3 { font-size:13px; margin:18px 0 6px; }
    table { width:100%; border-collapse:collapse; margin-bottom:14px; }
    th, td { border:1px solid #ccc; padding:6px 8px; vertical-align:top; }
    th { background:#f5f5f5; text-align:left; }
    tr.section-header th { background:#e0e0e0; }
    ul { margin:6px 0 14px 18px; padding:0; }
    .small-note { font-size:10px; color:#555; }
    .signatures { margin-top:32px; }
    .sig-line { margin:18px 0; }
  </style>
</head>
<body>
  <h1>QUOTATION</h1>
  <h2 class="subtitle">Shortlet Apartment Management Web Application</h2>

  <table>
    <tr><th style="width:30%">Date</th><td>${dateStr}</td></tr>
    <tr><th>Prepared By</th><td>Adjeh Dominic Efeoghene</td></tr>
    <tr><th>Email</th><td>dominicadjeh@gmail.com</td></tr>
    <tr><th>Phone</th><td>08158389029</td></tr>
    <tr><th>Recipient</th><td>Osaka apartments</td></tr>
  </table>

  <h3>1. Summary</h3>
  <p>The Shortlet Connect application is near completion. Core functions already work: apartments can be added and managed, bookings are tracked automatically, and image handling will be upgraded. This quotation covers final polishing, deployment readiness and handover.</p>

  <h3>2. Core Features Working</h3>
  <table>
    <tr><td>Apartments: create / edit / archive</td><td>Management: pricing, status, availability</td></tr>
    <tr><td>Automatic booking tracking</td><td>Admin dashboard basics</td></tr>
    <tr><td>Initial image handling (upgrade planned)</td><td>User/session handling (to refine)</td></tr>
  </table>

  <h3>3. Finalization Scope</h3>
  <table>
    <tr><th style="width:28%">Item</th><th>Description</th></tr>
    <tr><td>Image Storage Upgrade</td><td>Integrate reliable cloud storage; optimize uploads; secure access (signed URLs).</td></tr>
    <tr><td>Booking Refinements</td><td>Prevent conflicts; validate edge cases (overlaps, cancellations).</td></tr>
    <tr><td>Performance & UX</td><td>Improve responsiveness, accessibility and polish key flows.</td></tr>
    <tr><td>Security Hardening</td><td>Strengthen authentication, permissions and data validation.</td></tr>
    <tr><td>Deployment & Handover</td><td>Production build, environment setup, one training walkthrough (up to 2 hours).</td></tr>
    <tr><td>Documentation</td><td>Setup guide, runbook, feature index, quick reference.</td></tr>
  </table>

  <h3>4. Deliverables</h3>
  <ul>
    <li>Production-ready codebase</li>
    <li>Cloud image storage integration</li>
    <li>Security & validation improvements</li>
    <li>Deployment + environment documentation</li>
    <li>Training / handover session</li>
    <li>14-day post-handover bug fix grace</li>
  </ul>

  <h3>5. Timeline (Estimated)</h3>
  <table>
    <tr><th style="width:30%">Phase</th><th>Summary</th></tr>
    <tr><td>Week 1</td><td>Audit & start image storage integration</td></tr>
    <tr><td>Week 2</td><td>Finish image storage; booking & security fixes</td></tr>
    <tr><td>Week 3</td><td>UX/accessibility polish; documentation drafting</td></tr>
    <tr><td>Week 4</td><td>Final QA; deployment; training session</td></tr>
    <tr><td><strong>Total</strong></td><td><strong>Approx. 3–4 weeks (feedback dependent)</strong></td></tr>
  </table>

  <h3>6. Pricing (Fixed One-Time)</h3>
  <table>
    <tr><th style=\"width:40%\">Item</th><th>Details</th></tr>
    <tr><td>Total Fee</td><td><strong>₦1,500,000</strong> (one-time)</td></tr>
    <tr><td>Includes</td><td>Scope items, training session, 14-day bug fix grace.</td></tr>
    <tr><td>Excludes</td><td>Future new features, third-party service costs (e.g., hosting/domain renewals, premium services), ongoing maintenance beyond grace.</td></tr>
  </table>

  <h3>6.1 Cost Breakdown (How the Total Adds Up)</h3>
  <table>
    <tr><th style=\"width:35%\">Item</th><th>Description</th><th style=\"width:20%\">Cost (₦)</th></tr>
    <tr><td>Finalization & Feature Completion</td><td>Wrap up pending work, stabilize core flows (apartments, bookings), resolve edge cases and regressions.</td><td>550,000</td></tr>
    <tr><td>Image Storage Integration</td><td>Configure Firebase Storage, secure upload pipeline, responsive image handling, access rules & testing.</td><td>200,000</td></tr>
    <tr><td>Security Hardening & Validation</td><td>Strengthen auth/session flows, role/permission checks, server/client validation alignment.</td><td>150,000</td></tr>
    <tr><td>Performance & UX Polish</td><td>Optimize perceived performance, accessibility pass, simplify key interactions, minor UI refinements.</td><td>150,000</td></tr>
    <tr><td>Documentation & Handover</td><td>Setup guide, runbook, feature index; 1 training/walkthrough session (up to 2 hours).</td><td>100,000</td></tr>
    <tr><td>Deployment & Environment Setup</td><td>Production build optimization, environment configuration, release checklist, basic monitoring hooks.</td><td>100,000</td></tr>
    <tr><td>Hosting & Domain Procurement + Setup (Service)</td><td>I will handle the domain purchase and hosting onboarding (DNS, SSL, redirects). Third‑party charges for the domain/hosting are billed at actual cost to Osaka apartments; this line covers my procurement and setup service.</td><td>100,000</td></tr>
    <tr><td>Project Management, QA & Contingency</td><td>Structured testing, issue triage, buffer for minor scope clarifications without change requests.</td><td>150,000</td></tr>
    <tr><th colspan=\"2\" style=\"text-align:right\">Total</th><th>1,500,000</th></tr>
  </table>

  <h3>6.2 Payment Terms</h3>
  <table>
    <tr><th style=\"width:40%\">Milestone</th><th>Amount</th></tr>
    <tr><td>On Acceptance</td><td>60% — ₦900,000</td></tr>
    <tr><td>On Final Delivery & Handover</td><td>40% — ₦600,000</td></tr>
  </table>

  <h3>7. Assumptions</h3>
  <ul>
    <li>Backend endpoints are stable (only minor tweaks).</li>
    <li>Feedback returned within 24–48 hours.</li>
    <li>Client provides hosting/cloud accounts & image service keys.</li>
    <li>No major architecture rewrites needed.</li>
  </ul>

  <h3>8. Acceptance</h3>
  <p>To proceed: approve this quotation, confirm payment schedule, and provide required access (repository, staging environment, keys). Valid for 15 days from the date above.</p>
  <p class=\"small-note\"><strong>Remark:</strong> My goal is to ensure Osaka apartments has a reliable, secure, and easy‑to‑use platform that supports your day‑to‑day operations and growth. I appreciate the opportunity to partner with you on this phase and look forward to building a long‑term working relationship, iterating together as your needs evolve.</p>

  <h3>Contact</h3>
  <table>
    <tr><th style="width:30%">Developer</th><td>Adjeh Dominic Efeoghene</td></tr>
    <tr><th>Email</th><td>dominicadjeh@gmail.com</td></tr>
    <tr><th>Phone</th><td>08158389029</td></tr>
  </table>

  <div class="signatures">
    <div class="sig-line">Client Signature: ______________________    Date: __________</div>
    <div class="sig-line">Developer Signature: ___________________  Date: __________</div>
  </div>
</body>
</html>`;

async function generate() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.emulateMediaType('screen');
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } });
  const outPath = 'Quotation_Sweet_Homes.pdf';
  fs.writeFileSync(outPath, pdfBuffer);
  await browser.close();
  console.log(`Generated PDF: ${outPath}`);
}

generate().catch(err => {
  console.error('Failed to generate quotation PDF:', err);
  process.exit(1);
});
