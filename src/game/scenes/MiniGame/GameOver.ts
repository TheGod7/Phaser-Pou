import { Scene } from "phaser";
import { EventBus } from "../../EventBus";
import { ButtonText } from "../../components/ui/TextButton";
import { GameManager } from "../Game/GameManager";
import { soundManager } from "../../components/ui/utils/sound";

export class GameOverMiniGame extends Scene {
    score: number = 0;
    coins: number = 0;
    gameScene: Scene;
    constructor() {
        super("GameOverMiniGame");
    }

    init(data: any) {
        this.score = data.score;
        this.coins = data.coins;
        this.gameScene = data.scene;
    }

    create() {
        const gameManager = this.scene.get("GameManager") as GameManager;
        soundManager.play(this, "gameOver");

        gameManager.AddCoins(this.coins);
        const deathBackground = this.add.image(0, 0, "deathBackground");
        deathBackground.setOrigin(0, 0);
        deathBackground.setDepth(0);
        deathBackground.setDisplaySize(this.scale.width, this.scale.height);

        const AllSizer = this.rexUI.add
            .sizer({
                width: this.scale.width,
                height: this.scale.height,
                y: 200,
                orientation: "vertical",
                space: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10,
                },
            })
            .setOrigin(0, 0);

        const InfoSizer = this.rexUI.add
            .sizer({
                width: this.scale.width,
                height: 50,

                orientation: "horizontal",
                space: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10,
                },
            })
            .setOrigin(0, 0);

        const ScoreText = this.add.text(0, 0, this.score + "", {
            fontSize: "30px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
            fontFamily: "Cookies",
        });

        const MoneyScore = this.rexUI.add.label({
            icon: this.add
                .image(0, 0, "coin")
                .setOrigin(0.5, 0.5)
                .setDisplaySize(35, 35),
            text: this.add.text(0, 0, this.coins + "", {
                fontSize: "30px",
                color: "#ffffff",
                stroke: "#000000",
                fixedWidth: 65,
                strokeThickness: 8,
                fontFamily: "Cookies",
            }),
        });

        InfoSizer.addSpace();
        InfoSizer.add(MoneyScore);
        InfoSizer.addSpace();
        InfoSizer.add(ScoreText);
        InfoSizer.addSpace();

        InfoSizer.layout();

        const RetryButton = new ButtonText(this, {
            height: 50,
            width: 200,
            x: 0,
            y: 0,
            text: "Reintentar",
            backgroundColor: 0xff9900,
            textColor: "#ffffff",
            fontSize: 15,
            radius: 5,
            Callback: () => {
                this.scene.start(this.gameScene.scene.key);
            },
        });

        const BackButton = new ButtonText(this, {
            height: 50,
            width: 200,
            x: 0,
            y: 0,
            text: "Salir",
            backgroundColor: 0xff99f0,
            textColor: "#ffffff",
            fontSize: 15,
            radius: 5,
            Callback: () => {
                this.scene.start("Rooms");
            },
        });

        AllSizer.add(InfoSizer);
        AllSizer.add(RetryButton, {
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            },
        });
        AllSizer.add(BackButton, {
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            },
        });
        AllSizer.layout();
        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {}
}
