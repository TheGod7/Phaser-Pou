// import { ImgButton } from "../../components/ui/ImageButton";
import { ImgButton } from "../../components/ui/ImageButton";
import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class GameOver extends Scene {
    constructor() {
        super("GameOver");
    }

    create() {
        // this.game.scale.setGameSize(978, 462);
        // this.tweens.add({
        //     targets: this.cameras.main,
        //     rotation: Phaser.Math.DegToRad(90), // Rota la cámara si quieres efecto visual
        //     duration: 500,
        //     onComplete: () => {
        //         this.game.scale.setGameSize(978, 462);
        //         this.game.scale.resize(window.innerWidth, window.innerHeight);
        //     },
        // });

        // new ImgButton(
        //     this,
        //     () => {
        //         this.scale.startFullscreen();
        //     },
        //     "asda",
        //     this.scale.width / 2,
        //     this.scale.height / 2,
        //     this.scale.width,
        //     this.scale.height
        // );
        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {}
}

