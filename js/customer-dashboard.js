import { CUSTOMER_TIERS } from './config/membership-tiers.js';
import { requireSession, signOut } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    const session = await requireSession();
    if (!session) return;

    // Wire logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); signOut(); });

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
        name: session.user?.user_metadata?.full_name || '',
        email: session.user?.email || '',
        planId: (session.user?.user_metadata?.planId || 'vip'),
    };

    if (!currentUser || !currentUser.planId) {
        document.body.innerHTML = '<h1>Error: No user data found. Please log in.</h1>';
        return;
    }

    // Determine plan from CUSTOMER_TIERS by planId
    const plan = CUSTOMER_TIERS[currentUser.planId.toUpperCase()];

    if (!plan) {
        document.getElementById('customer-plan').textContent = 'Unknown';
    } else {
        document.getElementById('customer-plan').textContent = plan.name;
    }

    document.getElementById('customer-name').textContent = currentUser.name || '—';
    document.getElementById('customer-email').textContent = currentUser.email || '—';

    // Render VIP perks if available
    const perksCard = document.getElementById('perks-card');
    const perksList = document.getElementById('perks-list');
    if (plan && Array.isArray(plan.perks) && plan.perks.length > 0) {
        perksCard.style.display = 'block';
        perksList.innerHTML = plan.perks.map(perk => `<li><i class="fas fa-star"></i>${perk}</li>`).join('');
    }
});
