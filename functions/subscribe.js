require('dotenv').config();
const { subscribe } = require('./mailerlite');
const { supabase } = require('./supabase');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { email, name, type, fields } = JSON.parse(event.body || '{}');
    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'email is required' }) };
    }
    const t = (type || 'customer').toLowerCase();
    // Map 'partner' to business group but tag role as 'partner'
    const groupId = (t === 'business' || t === 'partner') ? process.env.MAILERLITE_GROUP_ID_BUSINESS : process.env.MAILERLITE_GROUP_ID_CUSTOMER;
    if (!groupId) {
      return { statusCode: 500, body: JSON.stringify({ error: 'MailerLite group not configured' }) };
    }

    const mergedFields = { role: t, ...(fields || {}) };
    const result = await subscribe(email, name, groupId, mergedFields);

    // Persist in Supabase
    try {
      if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn('[subscribe] Supabase not configured, skipping DB persistence');
      } else if (t === 'partner') {
        // Upsert partner by email
        const upsertPayload = {
          email,
          name: name || null,
          phone: fields?.phone || null,
          channel: fields?.channel || null,
          audience: fields?.audience || null,
          notes: fields?.notes || null,
          status: 'applied',
          fields: mergedFields
        };
        const { error: upErr } = await supabase
          .from('partners')
          .upsert(upsertPayload, { onConflict: 'email' });
        if (upErr) console.error('[subscribe] partners upsert error', upErr.message || upErr);
      } else {
        // Insert a lead row
        const { error: leadErr } = await supabase
          .from('leads')
          .insert({ email, name: name || null, type: t, fields: mergedFields });
        if (leadErr) console.error('[subscribe] leads insert error', leadErr.message || leadErr);
      }
    } catch (dbErr) {
      console.error('[subscribe] Supabase persistence failed', dbErr.message || dbErr);
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, result }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Subscription failed' }) };
  }
};
