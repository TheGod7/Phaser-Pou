import MemoryMatch from "../../scenes/MiniGame/MemoryMatch";

export class MemoryMatchCard extends Phaser.GameObjects.Container {
    isFront = false;
    isFlipping = false;

    FrontContainer: Phaser.GameObjects.Container;
    BackCardImage: Phaser.GameObjects.Image;

    constructor(
        scene: MemoryMatch,
        x: number,
        y: number,
        Size: number,
        Texture: string,
        callback: () => void
    ) {
        super(scene, x, y);

        scene.add.existing(this);

        this.setSize(Size, Size);
        this.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, Size, Size),
            Phaser.Geom.Rectangle.Contains
        );

        const FrontContainer = scene.add.container(0, 0);
        FrontContainer.setSize(Size, Size);
        FrontContainer.setVisible(false);

        const FrontImage = scene.add
            .image(0, 0, "FrontCard")
            .setOrigin(0.5, 0.5)
            .setDisplaySize(Size, Size);

        const FrontTexture = scene.add
            .image(0, 0, Texture)
            .setOrigin(0.5, 0.5)
            .setDisplaySize(Size - Size / 5, Size - Size / 5);

        FrontContainer.add([FrontImage, FrontTexture]);

        this.FrontContainer = FrontContainer;

        const BackCardImage = scene.add
            .image(0, 0, "BackCard")
            .setOrigin(0.5, 0.5)
            .setDisplaySize(Size, Size);

        this.BackCardImage = BackCardImage;

        this.on("pointerdown", () => {
            callback();
        });

        this.add([FrontContainer, BackCardImage]);
    }

    flip(duration = 300) {
        if (this.isFlipping) return;
        this.isFlipping = true;
        this.isFront = !this.isFront;

        const half = Math.round(duration / 2);

        this.scene.tweens.add({
            targets: this,
            scaleX: 0.01,
            scaleY: 0.92,
            duration: half,
            ease: "Cubic.easeIn",
            onComplete: () => {
                this.FrontContainer.setVisible(this.isFront);
                this.BackCardImage.setVisible(!this.isFront);

                this.scene.tweens.add({
                    targets: this,
                    scaleX: 1,
                    scaleY: 1,
                    duration: half,
                    ease: "Cubic.easeOut",
                    onComplete: () => {
                        this.isFlipping = false;
                    },
                });
            },
        });
    }
}
