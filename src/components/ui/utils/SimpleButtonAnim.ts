import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import { soundManager } from "./sound";

export function simpleButtonAnim(
    scene: Phaser.Scene,
    button:
        | Phaser.GameObjects.Image
        | Phaser.GameObjects.Text
        | RexUIPlugin.Label,
    clicked: () => void,
    cooldown?: number
) {
    let onCooldown = false;
    const originalScale = button.scale;

    button.setInteractive();

    button.on("pointerover", () => {
        if (!button.active) return;
        scene.tweens.add({
            targets: button,
            scale: originalScale * 1.1,
            alpha: 0.8,
            duration: 200,
            ease: "Power2",
        });
    });

    button.on("pointerout", () => {
        if (!button.active) return;
        scene.tweens.add({
            targets: button,
            scale: originalScale,
            alpha: 1,
            duration: 200,
            ease: "Power2",
        });
    });

    button.on("pointerdown", () => {
        if (!button.active) return;
        scene.tweens.add({
            targets: button,
            scale: originalScale * 0.9,
            duration: 100,
            ease: "Power2",
            yoyo: true,
        });
    });

    button.on("pointerup", () => {
        if (!button.active || onCooldown) return;

        scene.tweens.add({
            targets: button,
            scale: originalScale,
            alpha: 1,
            duration: 100,
            ease: "Power2",
        });

        if (cooldown) {
            onCooldown = true;
            scene.time.addEvent({
                delay: cooldown,
                callback: () => {
                    onCooldown = false;
                },
                loop: false,
            });
        }

        clicked();
        soundManager.play(scene, "ButtonClick");
    });
}
