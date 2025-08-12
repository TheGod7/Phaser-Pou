import Label from "phaser3-rex-plugins/templates/ui/label/Label";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";

export class GameStats extends Sizer {
    name: string = "GameStats";

    ScoreText: Phaser.GameObjects.Text;
    MoneyLabel: Label;

    HearthsSizer: Sizer;
    HearthsArray: Phaser.GameObjects.Image[];
    TotalHearths: number;

    constructor(scene: Phaser.Scene, hearts?: number) {
        const width = scene.scale.width;
        super(scene, {
            width: width,
            orientation: "vertical",
            y: 80,
            x: 20,
            space: {
                top: 10,
                bottom: 10,
            },
        });

        if (hearts) {
            this.HearthsSizer = scene.rexUI.add.sizer({
                width: scene.scale.width,
                height: 50,
                orientation: "horizontal",
            });

            this.HearthsArray = [];

            for (let i = 0; i < hearts; i++) {
                const emptySpace = scene.add.rectangle(
                    0,
                    0,
                    5,
                    10,
                    0x000000,
                    0
                );

                const heart = scene.add
                    .image(0, 0, "Hearth")
                    .setOrigin(0.5, 0.5)
                    .setDisplaySize(50, 50)
                    .setVisible(true);

                this.HearthsArray.unshift(heart);

                this.HearthsSizer.add(heart);
                this.HearthsSizer.add(emptySpace);
            }

            this.TotalHearths = hearts;

            this.add(this.HearthsSizer);
        }

        const InfoSizer = scene.rexUI.add.sizer({
            width: width,
            height: 50,
            orientation: "horizontal",
        });

        const ScoreText = scene.add.text(0, 0, "000", {
            fontSize: "30px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
            fontFamily: "Cookies",
        });

        const MoneyScore = scene.rexUI.add.label({
            icon: scene.add
                .image(0, 0, "coin")
                .setOrigin(0.5, 0.5)
                .setDisplaySize(35, 35),
            text: scene.add.text(0, 0, "00", {
                fontSize: "30px",
                color: "#ffffff",
                stroke: "#000000",
                fixedWidth: 65,
                strokeThickness: 8,
                fontFamily: "Cookies",
            }),
        });

        this.MoneyLabel = MoneyScore;
        this.ScoreText = ScoreText;

        const emptySpace = scene.add.rectangle(0, 0, 5, 10, 0x000000, 0);

        InfoSizer.add(MoneyScore);
        InfoSizer.add(emptySpace);
        InfoSizer.add(ScoreText);
        this.add(InfoSizer);
        this.setOrigin(0, 0);
        this.layout();
    }

    SetScore(score: number) {
        if (score < 1000) {
            this.ScoreText.setText(String(score).padStart(3, "0"));
        } else {
            this.ScoreText.setText("999+");
        }
    }

    AddMoney(money: number) {
        if (money < 100) {
            this.MoneyLabel.setText(String(money).padStart(2, "0"));
        } else {
            this.MoneyLabel.setText("99+");
        }
    }

    SetHearths(hearts: number) {
        for (let i = 0; i < this.HearthsArray.length; i++) {
            const heart = this.HearthsArray[i];

            if (i < hearts) {
                heart.setTexture("Hearth");
            } else {
                heart.setTexture("EmptyHearth");
            }
        }
    }
}
