/**
 * UI Controller for Brake Test (Deceleration Calculator)
 * 
 * Focus: Only time-based formula (a = v / t).
 */

const DecelUI = {
    init() {
        this.cacheDOM();
        this.attachEvents();
    },

    cacheDOM() {
        this.vInput = document.getElementById('decel-v');
        this.tInput = document.getElementById('decel-t');

        this.resTime = document.getElementById('res-a-time');
        this.resGForce = document.getElementById('res-g-force');
    },

    attachEvents() {
        if (!this.vInput || !this.tInput) return;

        [this.vInput, this.tInput].forEach(el => {
            el.addEventListener('input', () => this.calculate());
        });
    },

    calculate() {
        const vKmh = parseFloat(this.vInput.value);
        const t = parseFloat(this.tInput.value);

        if (isNaN(vKmh) || isNaN(t) || t <= 0 || vKmh <= 0) {
            this.clearResults();
            return;
        }

        // Logic using our simplified physics module
        const result = Physics.calculateDecel(vKmh, t);

        if (!result) {
            this.clearResults();
            return;
        }

        // Update Results with Formatting
        this.resTime.innerText = result.a_time.toFixed(2);
        this.resGForce.innerText = `${result.g_force.toFixed(3)} G`;
    },

    clearResults() {
        if (this.resTime) this.resTime.innerText = "0.00";
        if (this.resGForce) this.resGForce.innerText = "0.000 G";
    }
};
