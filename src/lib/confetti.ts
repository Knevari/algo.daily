import confetti from "canvas-confetti";

/**
 * Fire a confetti celebration animation
 */
export function celebrateCompletion() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const colors = ["#ff6b35", "#8b5cf6", "#22c55e", "#eab308"];

    const randomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min;

    (function frame() {
        confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            colors,
        });
        confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            colors,
        });

        if (Date.now() < animationEnd) {
            requestAnimationFrame(frame);
        }
    })();
}

/**
 * Fire a single burst confetti for problem completion
 */
export function celebrateProblem() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ff6b35", "#8b5cf6", "#22c55e"],
    });
}

/**
 * Fire a big celebration for daily streak completion
 */
export function celebrateStreak() {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
        colors: ["#ff6b35", "#ff8c5a", "#fbbf24"],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
        });
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}

/**
 * Fire a special star-filled celebration for milestones (e.g. 7-day streak)
 */
export function celebrateMilestone() {
    const defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ['star'] as confetti.Shape[],
        colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8']
    };

    function shoot() {
        confetti({
            ...defaults,
            particleCount: 40,
            scalar: 1.2,
            shapes: ['star']
        });

        confetti({
            ...defaults,
            particleCount: 10,
            scalar: 0.75,
            shapes: ['circle']
        });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
}
