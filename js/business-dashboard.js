import { BUSINESS_TIERS } from './config/membership-tiers.js';
import { requireSession, signOut } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Require an authenticated session; will render login UI if missing
    const session = await requireSession();
    if (!session) return;

    // Wire logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); signOut(); });

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
        // Fallback: basic info from session if localStorage missing
        name: session.user?.user_metadata?.full_name || '',
        email: session.user?.email || '',
        planId: (session.user?.user_metadata?.planId || 'growth'),
    };

    if (!currentUser || !currentUser.planId) {
        // If no user data is found, redirect to the homepage or a login page.
        // For now, we'll just show an error.
        document.body.innerHTML = '<h1>Error: No user data found. Please log in.</h1>';
        return;
    }

    const plan = BUSINESS_TIERS[currentUser.planId.toUpperCase()];

    if (!plan) {
        console.error('Could not find a valid plan for the user.');
        return;
    }

    // Populate Business Details
    document.getElementById('business-plan').textContent = plan.name;
    document.getElementById('business-name').textContent = currentUser.name;
    document.getElementById('business-email').textContent = currentUser.email;

    // Populate Perks
    const perksCard = document.getElementById('perks-card');
    const perksList = document.getElementById('perks-list');

    if (plan.perks && plan.perks.length > 0) {
        perksCard.style.display = 'block';
        perksList.innerHTML = plan.perks.map(perk => `<li><i class="fas fa-star"></i>${perk}</li>`).join('');
    }
});
