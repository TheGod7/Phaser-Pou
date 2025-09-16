import { ButtonText } from "../components/ui/TextButton";
import { soundManager } from "../components/ui/utils/sound";
import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class GameOver extends Scene {
    constructor() {
        super("GameOver");
    }

    create() {
        this.add
            .image(0, 0, "deathBackground")
            .setDisplaySize(this.scale.width, this.scale.height)
            .setOrigin(0, 0);

        soundManager.play(this, "gameOver");

        new ButtonText(this, {
            height: 50,
            width: 200,
            x: this.scale.width / 2,
            y: this.scale.height / 2,
            text: "Reintentar",
            backgroundColor: 0xff9900,
            textColor: "#ffffff",
            fontSize: 15,
            radius: 5,
            Callback: () => {
                window.location.reload();
            },
        });

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {}
}
