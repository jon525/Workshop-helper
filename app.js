/**
 * Workshop Helper - Core Application Logic
 * Focusing on Twist Test and Brake Test.
 */

const app = {
    // Current active view
    currentView: 'home',

    /**
     * Navigation & View Management
     */
    showView(viewId) {
        if (this.currentView === viewId) return;

        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            const label = item.querySelector('.nav-label').textContent.toLowerCase();
            const target = viewId === 'home' ? 'dashboard' : viewId.replace('decel', 'brake').replace('twist', 'twist');

            if (label.includes(target) || (viewId === 'home' && label.includes('dashboard'))) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Toggle views with a small delay for smoother feel if needed
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.remove('hidden');
        }

        this.currentView = viewId;
        window.scrollTo(0, 0);
    },

    /**
     * TWIST TEST LOGIC
     */
    initTwistTest() {
        const wsEl = document.getElementById('twist-ws');
        const wlEl = document.getElementById('twist-wl');
        const resText = document.getElementById('twist-val');
        const statusBadge = document.getElementById('twist-status');

        const calculate = () => {
            const ws = parseFloat(wsEl.value);
            const wl = parseFloat(wlEl.value);

            if (isNaN(ws) || isNaN(wl) || ws <= 0) {
                resText.innerText = '0.00';
                statusBadge.innerText = 'STABLE';
                statusBadge.style.background = 'var(--accent-teal)';
                return;
            }

            // Formula: ((Ws - Wl) / Ws) * 100
            const deviation = ((ws - wl) / ws) * 100;
            const absDev = Math.abs(deviation);

            resText.innerText = absDev.toFixed(2);

            // Visual Status Feedback
            if (absDev > 5) {
                statusBadge.innerText = 'CRITICAL';
                statusBadge.style.background = 'var(--accent-error)';
            } else if (absDev > 2) {
                statusBadge.innerText = 'WARNING';
                statusBadge.style.background = 'var(--accent-warn)';
                statusBadge.style.color = '#000';
            } else {
                statusBadge.innerText = 'STABLE';
                statusBadge.style.background = 'var(--accent-teal)';
                statusBadge.style.color = '#fff';
            }
        };

        [wsEl, wlEl].forEach(el => {
            el.addEventListener('input', calculate);
        });
    },

    /**
     * App Initialization
     */
    init() {
        // Initialize View components
        if (typeof DecelUI !== 'undefined') {
            DecelUI.init();
        }

        this.initTwistTest();

        // Initial setup
        console.log("Workshop Helper Pro Initialized");
    }
};

// Start the app
document.addEventListener('DOMContentLoaded', () => app.init());
