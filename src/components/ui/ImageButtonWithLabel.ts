import Phaser from "phaser";
import { simpleButtonAnim } from "./utils/SimpleButtonAnim";
import Label from "phaser3-rex-plugins/templates/ui/label/Label";

export class ImgButtonLabel extends Label {
    constructor(scene: Phaser.Scene, callback: () => void, textureKey: string) {
        super(scene, {
            background: scene.add.image(0, 0, textureKey),
            action: scene.add
                .text(0, 15, "x0", {
                    stroke: "#000000",
                    strokeThickness: 8,
                    fontSize: "15px",
                    fontFamily: "Cookies",
                    align: "left",
                })

                .setDepth(3),

            space: {
                actionTop: 50,
            },
        });

        this.setOrigin(0.5, 0.5);
        this.layout();

        simpleButtonAnim(scene, this as any, callback, 500);
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

    SetValue(newText: string) {
        const Text = this.getElement("action") as Phaser.GameObjects.Text;

        Text.setText(newText);
        this.layout();
    }
}
