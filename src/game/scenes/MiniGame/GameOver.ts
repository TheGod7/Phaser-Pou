import { Scene } from "phaser";
import { EventBus } from "../../EventBus";

export class GameOverMiniGame extends Scene {
    score: number = 0;
    coins: number = 0;

    constructor() {
        super("GameOverMiniGame");
    }

    init(data: any) {
        this.score = data.score;
        this.coins = data.coins;
    }

    create() {
        // const GameManager = this.scene.get("GameManager") as GameManager;
        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {}
}
