import Phaser from "phaser";
import { simpleButtonAnim } from "./utils/SimpleButtonAnim";

export class ImgButton extends Phaser.GameObjects.Image {
    heartbeatTween: Phaser.Tweens.Tween;
    currentScale: number;
    constructor(
        scene: Phaser.Scene,
        callback: () => void,
        textureKey: string,
        x: number,
        y: number,
        size: number = 80,
        frame: number = 0
    ) {
        super(scene, x, y, textureKey, frame);
        this.setDisplaySize(size, size);
        scene.add.existing(this);
        this.scene = scene;

        this.currentScale = this.scale;
        this.setInteractive();

        simpleButtonAnim(scene, this, callback, 500);
    }

    SetEnable(value: boolean) {
        this.scene.tweens.killTweensOf(this);

        if (value) {
            this.setInteractive();
            this.active = true;
        } else {
            this.setInteractive(false);
            this.active = false;
        }
    }

    heartbeat(value: boolean) {
        if (value) {
            this.heartbeatTween = this.scene.tweens.add({
                targets: this,
                scale: this.scale * 1.2,
                alpha: 0.7,
                yoyo: true,
                repeat: -1,
                duration: 500,
                ease: "Sine.easeInOut",
            });
        } else {
            if (this.heartbeatTween) this.heartbeatTween.stop();
            this.setScale(this.currentScale);
        }
    }
}
