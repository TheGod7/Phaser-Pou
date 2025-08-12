import Phaser from "phaser";
import { PouConfig } from "../../../game/PouState";

export class BackgroundRooms extends Phaser.GameObjects.Image {
    constructor(scene: Phaser.Scene, Room: number) {
        super(scene, 0, 0, PouConfig.Background);
        this.setOrigin(0, 0);
        this.setDisplaySize(1847, scene.game.scale.height);
        this.setX(scene.game.scale.width * -Room);
        this.setToBack();

        scene.add.existing(this);
    }

    MoveBackground(scene: Phaser.Scene, frame: number) {
        scene.tweens.add({
            targets: this,
            y: 0,
            x: scene.game.scale.width * -frame,
            duration: 500,
            ease: "Power2",
        });
    }
}
