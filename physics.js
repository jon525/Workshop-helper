/**
 * Simplified Physics - Average Deceleration Calculator
 */

const Physics = {
    kmhToMs: (kmh) => kmh / 3.6,

    calculateDecel: (v, t) => {
        if (v <= 0 || t <= 0) return null;
        const vMs = v / 3.6;
        const a_time = vMs / t;
        const g_force = a_time / 9.80665;

        return {
            a_time,
            g_force
        };
    }
};
