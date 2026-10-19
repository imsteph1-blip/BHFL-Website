/**
 * Receives a care request from the Request Care page and emails it out.
 *
 * This runs on Vercel's servers, not in the visitor's browser, which is the
 * only safe place for the email key. Nothing secret appears anywhere in the
 * website files.
 *
 * It sends two emails:
 *   1. The full request to Stephanie, with any flags at the very top.
 *   2. A short thank-you to the client with their care plan.
 *
 * Settings come from Vercel, under Settings > Environment Variables:
 *   RESEND_API_KEY   the key from resend.com                    (required)
 *   OWNER_EMAIL      where requests go, stephanie@hefirstloved.com
 *   FROM_EMAIL       the address the emails come from
 */

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'stephanie@hefirstloved.com';

/**
 * Who the emails come from.
 *
 * The default is Resend's own test sender, which works the moment you have a
 * key, with no domain setup at all. It can only deliver to the address the
 * Resend account was opened with, so Stephanie gets every request but the
 * client's thank-you copy will not go out yet.
 *
 * Once hefirstloved.com is verified in Resend, set FROM_EMAIL in Vercel to
 *   Because He First Loved <requests@hefirstloved.com>
 * and the client copy starts working too. Nothing else needs changing.
 */
const FROM_EMAIL = process.env.FROM_EMAIL || 'Because He First Loved <onboarding@resend.dev>';

const money = (n) =>
  (n < 0 ? '-$' : '$') + Math.abs(Math.round(n * 100) / 100).toLocaleString('en-US');

/** Keeps anything a client typed from being read as HTML. */
const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const prettyDate = (iso) => {
  if (!iso) return '';
  const [y, m, d] = String(iso).split('-').map(Number);
  if (!y) return esc(iso);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });
};

/** The estimate, as a simple table. */
function estimateTable(estimate) {
  const lines = (estimate.lines || [])
    .map(
      (l) => `<tr>
        <td style="padding:6px 12px 6px 0;vertical-align:top">
          <strong>${esc(l.label)}</strong>
          ${l.detail ? `<br><span style="color:#6b6651;font-size:13px">${esc(l.detail)}</span>` : ''}
        </td>
        <td style="padding:6px 0;text-align:right;white-space:nowrap">${money(l.amount)}</td>
      </tr>`
    )
    .join('');

  return `<table style="width:100%;border-collapse:collapse;font-size:15px">
    ${lines}
    <tr>
      <td style="padding:12px 0 0;border-top:1px solid #ddd"><strong>Estimated total</strong></td>
      <td style="padding:12px 0 0;border-top:1px solid #ddd;text-align:right">
        <strong>${money(estimate.total || 0)}</strong>
      </td>
    </tr>
  </table>`;
}

/** Every answer, laid out so nothing has to be hunted for. */
function ownerEmail(payload) {
  const { answers = {}, pets = [], estimate = {}, flags = [] } = payload;
  const c = answers.contact || {};

  const flagBlock = flags.length
    ? `<div style="background:#f6ebdc;border-left:4px solid #8a5a2b;padding:14px 18px;margin:0 0 24px">
         <strong style="color:#8a5a2b">Worth looking at</strong>
         <ul style="margin:8px 0 0;padding-left:20px">
           ${flags.map((f) => `<li>${esc(f)}</li>`).join('')}
         </ul>
       </div>`
    : '';

  const petBlock = pets.length
    ? `<h3 style="margin:24px 0 8px">Animals</h3>
       <ul style="margin:0;padding-left:20px">
         ${pets.map((p) => `<li>${esc(p.name || 'Unnamed')} &middot; ${esc(p.kind || '')}</li>`).join('')}
       </ul>`
    : '';

  return `<div style="font-family:system-ui,-apple-system,sans-serif;color:#3a3a34;max-width:640px">
    <h2 style="margin:0 0 4px">New care request</h2>
    <p style="margin:0 0 24px;color:#6b6651">
      ${esc(c.first || '')} ${esc(c.last || '')} &middot; ${esc(c.town || '')}
      &middot; ${prettyDate(answers.start)} to ${prettyDate(answers.end)}
    </p>

    ${flagBlock}

    <h3 style="margin:0 0 8px">Who to reply to</h3>
    <p style="margin:0 0 4px">
      <a href="mailto:${esc(c.email)}">${esc(c.email)}</a><br>
      <a href="tel:${esc(String(c.phone || '').replace(/[^0-9+]/g, ''))}">${esc(c.phone)}</a>
    </p>
    <p style="margin:0 0 24px;color:#6b6651">
      ${esc(c.street || 'No street address given')}<br>
      ${esc(c.town || '')} ${esc(answers.zip || '')}
    </p>

    ${petBlock}

    <h3 style="margin:24px 0 8px">Estimate</h3>
    ${estimateTable(estimate)}

    ${
      c.notes
        ? `<h3 style="margin:24px 0 8px">What they told us</h3>
           <p style="white-space:pre-wrap;margin:0">${esc(c.notes)}</p>`
        : ''
    }
    ${c.heard ? `<p style="margin:24px 0 0;color:#6b6651">Heard about us: ${esc(c.heard)}</p>` : ''}

    <hr style="margin:32px 0;border:0;border-top:1px solid #ddd">
    <details>
      <summary style="cursor:pointer;color:#6b6651">Every answer, in full</summary>
      <pre style="white-space:pre-wrap;font-size:12px;color:#6b6651">${esc(
        JSON.stringify(answers, null, 2)
      )}</pre>
    </details>
  </div>`;
}

/** The client's copy. Warm, short, with their plan attached below. */
function clientEmail(payload) {
  const { answers = {}, estimate = {} } = payload;
  const c = answers.contact || {};

  return `<div style="font-family:system-ui,-apple-system,sans-serif;color:#3a3a34;max-width:640px">
    <p>Hi ${esc(c.first || 'there')},</p>
    <p>Thank you. We'll be in touch within 24 hours.</p>
    <p>Here is the care plan you put together, so you have it:</p>

    <p style="color:#6b6651;margin:24px 0 8px">
      ${prettyDate(answers.start)} to ${prettyDate(answers.end)}
    </p>
    ${estimateTable(estimate)}

    <p style="color:#6b6651;font-size:14px;margin:24px 0 0">
      This is an estimate, not a bill. Nothing is booked yet, and there's no
      deposit to talk.
    </p>

    <p style="margin:32px 0 0">Stephanie &amp; Luke<br>
      <span style="color:#6b6651">Because He First Loved &middot; (208) 571-5555</span>
    </p>
  </div>`;
}

async function sendEmail(apiKey, message) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend replied ${response.status}: ${detail}`);
  }
  return response.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set in Vercel.');
    return res.status(500).json({ error: 'Email is not set up yet.' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const c = (payload && payload.answers && payload.answers.contact) || {};

    if (!c.email || !c.first) {
      return res.status(400).json({ error: 'That request looks incomplete.' });
    }

    const who = `${c.first || ''} ${c.last || ''}`.trim();
    const when = `${prettyDate(payload.answers.start)} to ${prettyDate(payload.answers.end)}`;

    // Stephanie's copy goes first. If this one fails the client is told the
    // request did not go through, which is the honest outcome.
    await sendEmail(apiKey, {
      from: FROM_EMAIL,
      to: [OWNER_EMAIL],
      reply_to: c.email,
      subject: `New care request: ${who}, ${c.town || ''}, ${when}`,
      html: ownerEmail(payload),
    });

    // The client's copy is a courtesy. If it fails, the request still counts
    // as received, so the failure is logged rather than shown to them.
    try {
      await sendEmail(apiKey, {
        from: FROM_EMAIL,
        to: [c.email],
        reply_to: OWNER_EMAIL,
        subject: 'Thank you from Because He First Loved',
        html: clientEmail(payload),
      });
    } catch (err) {
      // Expected until hefirstloved.com is verified in Resend: the test
      // sender can only deliver to the account owner. Stephanie's copy has
      // already gone, so the request still counts as received.
      console.error('Client copy did not send:', err.message);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Could not send the request:', err.message);
    return res.status(500).json({ error: 'Could not send the request.' });
  }
}
