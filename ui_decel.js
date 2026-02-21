/**
 * UI Controller for Average Deceleration Calculator
 */

const DecelUI = {
    init() {
        this.cacheDOM();
        this.attachEvents();
    },

    cacheDOM() {
        this.vInput = document.getElementById('decel-v');
        this.sInput = document.getElementById('decel-s');
        this.tInput = document.getElementById('decel-t');

        this.resAvg = document.getElementById('res-a-avg');
        this.resTime = document.getElementById('res-a-time');
        this.resDist = document.getElementById('res-a-dist');
        this.resSImplied = document.getElementById('res-s-implied');
        this.resTImplied = document.getElementById('res-t-implied');

        this.warning = document.getElementById('decel-warning');
    },

    attachEvents() {
        [this.vInput, this.sInput, this.tInput].forEach(el => {
            el.addEventListener('input', () => this.calculate());
        });
    },

    calculate() {
        const vKmh = parseFloat(this.vInput.value) || 0;
        const s = parseFloat(this.sInput.value) || 0;
        const t = parseFloat(this.tInput.value) || 0;

        const v = Physics.kmhToMs(vKmh);
        const result = Physics.calculateDecel(v, s, t);

        if (!result) {
            this.clearResults();
            return;
        }

        // Main Displays
        this.resAvg.innerText = `${result.a_avg.toFixed(2)} m/s²`;
        this.resTime.innerText = `${result.a_time.toFixed(2)} m/s²`;
        this.resDist.innerText = `${result.a_dist.toFixed(2)} m/s²`;
        this.resSImplied.innerText = `${result.s_from_time.toFixed(2)} m`;
        this.resTImplied.innerText = `${result.t_from_dist.toFixed(2)} s`;

        // Warning Logic
        if (result.diff > 1) {
            this.warning.classList.remove('hidden');
        } else {
            this.warning.classList.add('hidden');
        }
    },

    clearResults() {
        this.resAvg.innerText = "-- m/s²";
        this.resTime.innerText = "--";
        this.resDist.innerText = "--";
        this.resSImplied.innerText = "--";
        this.resTImplied.innerText = "--";
        this.warning.classList.add('hidden');
    }
};
