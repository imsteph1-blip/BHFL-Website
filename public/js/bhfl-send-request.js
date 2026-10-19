/**
 * Connects the Request Care page's "Send my request" button to email.
 *
 * The booking page calls window.BHFL_SEND_REQUEST and waits for it. If it
 * resolves, the client sees the thank-you screen. If it throws, the page says
 * the request could not be sent and gives the phone number, so a request is
 * never quietly lost.
 *
 * This file holds no secrets. It posts to /api/send-request, which runs on
 * Vercel's servers where the email key lives.
 */
window.BHFL_SEND_REQUEST = async function sendRequest(payload) {
  const response = await fetch('/api/send-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let reason = `The server replied ${response.status}`;
    try {
      const body = await response.json();
      if (body && body.error) reason = body.error;
    } catch {
      // No readable reply. The status on its own is enough to go on.
    }
    throw new Error(reason);
  }

  return response.json();
};
