require('dotenv').config();
const fetch = require('node-fetch');

const MAILERLITE_API_BASE = 'https://api.mailerlite.com/api/v2';

async function subscribe(email, name, groupId, fields = {}) {
  if (!process.env.MAILERLITE_API_KEY) {
    throw new Error('MAILERLITE_API_KEY not configured');
  }
  if (!email || !groupId) {
    throw new Error('email and groupId are required');
  }

  const body = {
    email,
    name,
    resubscribe: true,
    fields: {
      source: 'website',
      ...fields,
    },
  };

  const resp = await fetch(`${MAILERLITE_API_BASE}/groups/${groupId}/subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`MailerLite subscribe failed: ${resp.status} ${text}`);
  }

  return resp.json();
}

module.exports = { subscribe };
