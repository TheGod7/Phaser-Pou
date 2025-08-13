import { PouConfig } from "../../../PouState";

class SoundManager {
    private volume: number = 100;
    private Sounds: Record<string, Phaser.Sound.BaseSound> = {};

    constructor() {
        this.Sounds = {};
        this.volume = 100;
    }

    public setVolume(volume: number) {
        PouConfig.volume = volume;
        this.volume = volume;

        for (const sound in this.Sounds) {
            if ((this.Sounds[sound] as any)["Back"]) {
                (this.Sounds[sound] as any).setVolume(
                    (this.volume * 0.3) / 100
                );
            } else {
                (this.Sounds[sound] as any).setVolume(this.volume / 100);
            }
        }
    }

    public play(
        scene: Phaser.Scene,
        key: string,
        callback?: () => void,
        rate?: number
    ) {
        const sound = scene.sound.add(key);

        sound.play({
            volume: this.volume / 100,
        });

        if (rate) sound.setRate(rate);
        this.Sounds[key] = sound;

        sound.on("complete", () => {
            if (callback) callback();
            sound.destroy();
            delete this.Sounds[key];
        });

        return sound;
    }

    public playBackground(
        scene: Phaser.Scene,
        key: string,
        callback?: () => void
    ) {
        const sound = scene.sound.add(key);

        sound.play({
            loop: true,
            volume: (this.volume * 0.3) / 100,
        });

        this.Sounds[key] = sound;
        (this.Sounds[key] as any)["Back"] = true;
        sound.on("complete", () => {
            if (callback) callback();
            sound.destroy();
        });

        return sound;
    }
}

export const soundManager = new SoundManager();
