/**
 * Simplified Physics - Average Deceleration Calculator
 */

const Physics = {
    kmhToMs: (kmh) => kmh / 3.6,

    calculateDecel: (v, s, t) => {
        if (v <= 0 || s <= 0 || t <= 0) return null;

        const a_time = v / t;
        const a_dist = Math.pow(v, 2) / (2 * s);
        const a_avg = (a_time + a_dist) / 2;

        const s_from_time = (v * t) / 2;
        const t_from_dist = (2 * s) / v;

        const diff = Math.abs(a_time - a_dist) / a_avg * 100;

        return {
            a_avg,
            a_time,
            a_dist,
            s_from_time,
            t_from_dist,
            diff
        };
    }
};
