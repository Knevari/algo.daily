/**
 * AlgoDaily Sound System
 * Uses Web Audio API to generate procedural sound effects
 * This avoids the need for external asset files while keeping the app lightweight
 */

class SoundSystem {
    private ctx: AudioContext | null = null;
    private isMuted: boolean = false;

    constructor() {
        if (typeof window !== "undefined") {
            // Initialize on first user interaction to handle autoplay policies
            window.addEventListener("click", () => this.init(), { once: true });
        }
    }

    private init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx?.state === "suspended") {
            this.ctx.resume();
        }
    }

    public setMuted(muted: boolean) {
        this.isMuted = muted;
    }

    private createOscillator(freq: number, type: OscillatorType = "sine"): OscillatorNode | null {
        if (!this.ctx || this.isMuted) return null;
        const osc = this.ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        return osc;
    }

    private createGain(): GainNode | null {
        if (!this.ctx) return null;
        return this.ctx.createGain();
    }

    /**
     * Play a cheerful "Success" chime (Ascending major triad)
     */
    public playSuccess() {
        this.init();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, i) => {
            const osc = this.createOscillator(freq, "triangle");
            const gain = this.createGain();
            if (!osc || !gain) return;

            osc.connect(gain);
            gain.connect(this.ctx!.destination);

            const startTime = now + (i * 0.1);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

            osc.start(startTime);
            osc.stop(startTime + 0.4);
        });
    }

    /**
     * Play a "Level Up" fanfare (Faster arpeggio)
     */
    public playLevelUp() {
        this.init();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        // C Major Arpeggio Sweep
        const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];

        freqs.forEach((freq, i) => {
            const osc = this.createOscillator(freq, "square");
            const gain = this.createGain();
            if (!osc || !gain) return;

            // Filter for 8-bit coin sound feel
            const filter = this.ctx!.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.value = 2000;

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx!.destination);

            const startTime = now + (i * 0.08);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.05, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

            osc.start(startTime);
            osc.stop(startTime + 0.3);
        });
    }

    /**
     * Play a "Confetti" pop sound
     */
    public playPop() {
        this.init();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.createOscillator(400 + Math.random() * 200, "sine");
        const gain = this.createGain();

        if (!osc || !gain) return;

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        // Pitch drop for "pop" effect
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    /**
     * Play a subtle "Click" for UI interactions
     */
    public playClick() {
        this.init();
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.createOscillator(800, "sine");
        const gain = this.createGain();

        if (!osc || !gain) return;

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.start(now);
        osc.stop(now + 0.05);
    }
}

// Export singleton
export const sounds = new SoundSystem();
