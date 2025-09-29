import { supabase } from './config/supabase.js';

// Renders a small inline login UI
function renderLoginUI(message = 'Please log in to continue') {
  let container = document.getElementById('auth-login-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'auth-login-container';
    container.style.maxWidth = '480px';
    container.style.margin = '40px auto';
    container.style.padding = '24px';
    container.style.border = '1px solid rgba(255,255,255,0.15)';
    container.style.borderRadius = '12px';
    container.style.background = 'var(--card-bg, rgba(0,0,0,0.35))';
    document.body.prepend(container);
  }

  container.innerHTML = `
    <h2 style="margin-top:0">Account Login</h2>
    <p style="opacity:.8">${message}</p>
    <form id="magicLinkForm">
      <label for="auth-email">Email</label>
      <input id="auth-email" type="email" required style="display:block;width:100%;margin:8px 0 12px;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:inherit" />
      <button id="magicLinkButton" class="btn btn-primary" type="submit">Send Magic Link</button>
      <div id="auth-feedback" style="margin-top:12px;display:none"></div>
    </form>
  `;

  const form = container.querySelector('#magicLinkForm');
  const emailInput = container.querySelector('#auth-email');
  const button = container.querySelector('#magicLinkButton');
  const feedback = container.querySelector('#auth-feedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      button.disabled = true;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      feedback.style.display = 'none';

      const email = emailInput.value.trim();
      if (!email) throw new Error('Email is required');

      const redirectTo = `${window.location.origin}${window.location.pathname}`;
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
      if (error) throw error;

      feedback.style.display = 'block';
      feedback.style.color = '#4ade80';
      feedback.textContent = 'Check your email for the login link.';
    } catch (err) {
      feedback.style.display = 'block';
      feedback.style.color = '#ef4444';
      feedback.textContent = err.message || 'Failed to send link.';
    } finally {
      button.disabled = false;
      button.innerHTML = 'Send Magic Link';
    }
  });
}

export async function requireSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) return session;
  renderLoginUI();

  // Listen for auth state changes; when signed in, reload to hydrate UI
  supabase.auth.onAuthStateChange((_event, sess) => {
    if (sess) window.location.reload();
  });
  return null;
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = '/';
}
