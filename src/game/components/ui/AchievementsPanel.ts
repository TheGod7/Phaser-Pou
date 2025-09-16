import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";

export class AchievementsPanel extends Sizer {
    AchievementsImage: any;
    AchievementsText: any;

    constructor(scene: Phaser.Scene) {
        super(scene, {
            width: 250,
            height: 100,
            x: scene.scale.width - 20,
            y: 170,
            orientation: "horizontal",
        });

        const backgroundColor = scene.add.rexRoundRectangleCanvas(
            0,
            0,
            250,
            100,
            10,
            0x000000,
            0xffffff,
            2,
            0x000000
        );

        this.setOrigin(1, 0);

        this.AchievementsImage = scene.add
            .image(0, 0, "Achievements", 0)
            .setDisplaySize(80, 80);

        this.AchievementsText = scene.add
            .text(0, 0, "Psicopata", {
                fontFamily: "Cookies",
                fontSize: "20px",
                color: "#ffffff",
                align: "center",
            })
            .setOrigin(0.5, 0.5);

        this.add(this.AchievementsImage, {
            padding: {
                left: 10,
            },
        });

        this.add(this.AchievementsText, {
            padding: {
                left: 5,
            },
        });

        this.addBackground(backgroundColor);
        this.layout();
    }

    ShowAchievements(name: String) {
        this.AchievementsImage.setTexture(name).setDisplaySize(80, 80);
        this.AchievementsText.setText(name);

        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 200,
            ease: "Linear",
            onComplete: () => {
                this.scene.time.delayedCall(500, () => {
                    this.scene.tweens.add({
                        targets: this,
                        alpha: 0,
                        duration: 500,
                        ease: "Linear",
                    });
                });
            },
        });
    }
}
