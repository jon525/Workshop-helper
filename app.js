/**
 * Workshop Helper - Core Logic
 */

const app = {
    // Views Management
    showView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById(viewId).classList.remove('hidden');
        window.scrollTo(0, 0);
    },

    // Initialization
    init() {
        this.initConverter();
        this.initTorqueCalc();
        DecelUI.init(); // Modular improved version
        this.initTwistTest();
        this.initNotes();
        console.log("Workshop Helper Initialized");
    },

    // UNIT CONVERTER
    initConverter() {
        const configs = [
            { id1: 'nm', id2: 'ftlb', factor: 0.73756, reverse: false },
            { id1: 'kpa', id2: 'psi', factor: 0.145038, reverse: false },
            { id1: 'mm', id2: 'in', factor: 0.0393701, reverse: false },
        ];

        configs.forEach(conf => {
            const el1 = document.getElementById(`${conf.id1}-input`);
            const el2 = document.getElementById(`${conf.id2}-input`);

            el1.addEventListener('input', () => {
                if (el1.value === '') el2.value = '';
                else el2.value = (parseFloat(el1.value) * conf.factor).toFixed(2);
            });

            el2.addEventListener('input', () => {
                if (el2.value === '') el1.value = '';
                else el1.value = (parseFloat(el2.value) / conf.factor).toFixed(2);
            });
        });

        // Temperature (Special Formula)
        const cIn = document.getElementById('c-input');
        const fIn = document.getElementById('f-input');

        cIn.addEventListener('input', () => {
            if (cIn.value === '') fIn.value = '';
            else fIn.value = ((parseFloat(cIn.value) * 9 / 5) + 32).toFixed(1);
        });

        fIn.addEventListener('input', () => {
            if (fIn.value === '') cIn.value = '';
            else cIn.value = ((parseFloat(fIn.value) - 32) * 5 / 9).toFixed(1);
        });
    },

    // TORQUE SPEC CALCULATOR
    initTorqueCalc() {
        const torqueTable = {
            'M6': {
                'coarse': { '8.8': 10, '10.9': 14, '12.9': 17 },
                'fine': { '8.8': 10, '10.9': 14, '12.9': 17 } // M6 Fine is rare/same
            },
            'M8': {
                'coarse': { '8.8': 25, '10.9': 35, '12.9': 41 },
                'fine': { '8.8': 27, '10.9': 38, '12.9': 44 }
            },
            'M10': {
                'coarse': { '8.8': 49, '10.9': 69, '12.9': 83 },
                'fine': { '8.8': 52, '10.9': 73, '12.9': 88 }
            },
            'M12': {
                'coarse': { '8.8': 85, '10.9': 120, '12.9': 145 },
                'fine': { '8.8': 95, '10.9': 135, '12.9': 160 }
            },
            'M14': {
                'coarse': { '8.8': 135, '10.9': 190, '12.9': 230 },
                'fine': { '8.8': 150, '10.9': 210, '12.9': 250 }
            },
            'M16': {
                'coarse': { '8.8': 210, '10.9': 295, '12.9': 355 },
                'fine': { '8.8': 225, '10.9': 315, '12.9': 380 }
            },
            'M18': {
                'coarse': { '8.8': 290, '10.9': 410, '12.9': 490 },
                'fine': { '8.8': 320, '10.9': 450, '12.9': 540 }
            },
            'M20': {
                'coarse': { '8.8': 410, '10.9': 580, '12.9': 690 },
                'fine': { '8.8': 450, '10.9': 640, '12.9': 760 }
            },
            'M22': {
                'coarse': { '8.8': 550, '10.9': 780, '12.9': 930 },
                'fine': { '8.8': 610, '10.9': 860, '12.9': 1030 }
            },
            'M24': {
                'coarse': { '8.8': 710, '10.9': 1000, '12.9': 1200 },
                'fine': { '8.8': 780, '10.9': 1100, '12.9': 1320 }
            }
        };

        const sizeEl = document.getElementById('bolt-size');
        const threadEl = document.getElementById('bolt-thread');
        const gradeEl = document.getElementById('bolt-grade');
        const resultEl = document.querySelector('#torque-result .res-val');
        const subResultEl = document.querySelector('#torque-result .res-sub');

        const calculate = () => {
            const size = sizeEl.value;
            const thread = threadEl.value;
            const grade = gradeEl.value;

            const spec = torqueTable[size][thread];
            const val = spec[grade];

            resultEl.innerText = `${val} Nm`;

            // Add descriptive sub-text
            const pitchInfo = {
                'M6': { coarse: '1.0', fine: '0.75' },
                'M8': { coarse: '1.25', fine: '1.0' },
                'M10': { coarse: '1.5', fine: '1.25' },
                'M12': { coarse: '1.75', fine: '1.25' },
                'M14': { coarse: '2.0', fine: '1.5' },
                'M16': { coarse: '2.0', fine: '1.5' },
                'M18': { coarse: '2.5', fine: '1.5' },
                'M20': { coarse: '2.5', fine: '1.5' },
                'M22': { coarse: '2.5', fine: '1.5' },
                'M24': { coarse: '3.0', fine: '2.0' }
            };

            const pitch = pitchInfo[size][thread];
            subResultEl.innerText = `${size} x ${pitch} - Grade ${grade}`;
        };

        [sizeEl, threadEl, gradeEl].forEach(el => el.addEventListener('input', calculate));

        // Initial calc
        calculate();
    },

    // TWIST TEST
    initTwistTest() {
        const wsEl = document.getElementById('twist-ws');
        const wlEl = document.getElementById('twist-wl');
        const resTwist = document.getElementById('twist-val');
        const mathCont = document.getElementById('twist-math-container');
        const mathEl = document.getElementById('twist-math');

        const calculate = () => {
            const ws = parseFloat(wsEl.value);
            const wl = parseFloat(wlEl.value);

            if (isNaN(ws) || isNaN(wl) || ws <= 0) {
                resTwist.innerText = '-- %';
                mathCont.classList.add('hidden');
                return;
            }

            const twist = ((ws - wl) / ws) * 100;
            resTwist.innerText = `${twist.toFixed(1)} %`;

            // Display raw math
            mathCont.classList.remove('hidden');
            mathEl.innerHTML = `
                ((${ws} - ${wl}) / ${ws}) &times; 100 = <b>${twist.toFixed(1)}%</b>
            `;
        };

        [wsEl, wlEl].forEach(el => el.addEventListener('input', calculate));
    },

    // JOB NOTES (Persistence)
    initNotes() {
        const notesArea = document.getElementById('notes-area');
        const status = document.getElementById('save-status');
        let saveTimeout;

        // Load
        const savedNotes = localStorage.getItem('workshop_notes');
        if (savedNotes) {
            notesArea.value = savedNotes;
        }

        // Save on input (debounced)
        notesArea.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            status.classList.remove('visible');

            saveTimeout = setTimeout(() => {
                localStorage.setItem('workshop_notes', notesArea.value);
                status.classList.add('visible');
                // Hide "Saved" after 2s
                setTimeout(() => status.classList.remove('visible'), 2000);
            }, 1000);
        });
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => app.init());
