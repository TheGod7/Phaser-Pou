import { Scene } from "phaser";
import UI from "./../../assets/ico.assets";
import food from "./../../assets/food.assets";
import Backgrounds from "./../../assets/bacgrounds.assets";
import Char from "./../../assets/character.assets";
import Game from "./../../assets/game.assets";
import { simpleButtonAnim } from "../../components/ui/utils/SimpleButtonAnim";

export class Preloader extends Scene {
    page: number;
    FullLoaded: boolean;

    constructor() {
        super("Preloader");

        this.page = 1;
        this.FullLoaded = false;
    }

    init() {
        const Bg = this.add.image(0, 0, "Page" + this.page).setToBack();
        Bg.setDisplaySize(this.scale.width, this.scale.height);
        Bg.setOrigin(0, 0);

        const LoadingImage = this.add.image(0, 0, "Loading");

        LoadingImage.setDisplaySize(40, 40);
        LoadingImage.setOrigin(0.5, 0.5);
        LoadingImage.setPosition(
            this.scale.width - 10 - 20,
            this.scale.height - 10 - 20
        );

        const LoadingText = this.rexUI.add
            .label({
                height: 50,
                text: this.add.text(
                    this.scale.width - 10,
                    this.scale.height - 20,
                    "Skip",
                    {
                        font: "30px Cookies",
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 8,
                        align: "center",
                    }
                ),
                x: this.scale.width - 10,
                y: this.scale.height - 20,
            })
            .setOrigin(1, 1)
            .layout()
            .setVisible(false);

        simpleButtonAnim(
            this,
            LoadingText,
            () => {
                this.scene.launch("MainMenu");
                this.scene.launch("GameManager");
                this.scene.launch("Rooms", { room: 1 });
                this.scene.bringToTop("MainMenu");
                this.scene.stop();
            },
            100
        );

        const LoadingAnimation = this.tweens.add({
            targets: LoadingImage,
            angle: 360,
            duration: 1000,
            repeat: -1,
            onRepeat: () => {
                if (this.FullLoaded) {
                    LoadingImage.destroy();
                    LoadingText.setVisible(true);
                }
            },
        });

        Bg.setInteractive();

        Bg.on("pointerdown", () => {
            if (!this.scale.isFullscreen) {
                this.scale.startFullscreen();
                return;
            }
            this.page++;

            if (this.page >= 9) {
                if (this.FullLoaded) {
                    this.scene.launch("MainMenu");
                    this.scene.launch("GameManager");
                    this.scene.launch("Rooms", { room: 1 });
                    this.scene.bringToTop("MainMenu");
                    this.scene.stop();
                } else {
                    Bg.destroy();
                    LoadingImage.destroy();
                    LoadingText.destroy();

                    const Loading = this.add.image(0, 0, "Loading");
                    Loading.setDisplaySize(100, 100)
                        .setOrigin(0.5, 0.5)
                        .setPosition(
                            this.scale.width / 2 - 50,
                            this.scale.height / 2 - 50
                        );
                    Loading.setTint(0xffffff);

                    const loadingAnim = this.tweens.add({
                        targets: Loading,
                        angle: 360,
                        duration: 1000,
                        repeat: -1,
                        onRepeat: () => {
                            if (this.FullLoaded) {
                                Loading.destroy();
                                this.scene.launch("MainMenu");
                                this.scene.launch("GameManager");
                                this.scene.launch("Rooms", { room: 1 });
                                this.scene.bringToTop("MainMenu");
                                this.scene.stop();
                            }
                        },
                    });
                }
            } else {
                Bg.setTexture("Page" + this.page);
            }
        });
    }

    preload() {
        [UI, food, Backgrounds, Char, Game].forEach((list) =>
            LoadAssets(this, list)
        );
    }

    create() {
        LoadAnimation(this, Char);

        this.FullLoaded = true;
    }
}

export function LoadAssets(scene: Scene, assets: AssetsElement[]) {
    assets.forEach((asset) => {
        switch (asset.type) {
            case "Image":
                scene.load.image(asset.key, asset.image);
                break;
            case "SpriteSheet":
                scene.load.spritesheet(
                    asset.key,
                    asset.image,
                    asset.frameConfig
                );
                break;
            case "Audio":
                scene.load.audio(asset.key, asset.audio);
                break;
        }
    });
}

export function LoadAnimation(scene: Scene, assets: AssetsElement[]) {
    assets
        .filter((a) => a.type === "Animation")
        .forEach((asset) => {
            const frames = scene.anims.generateFrameNumbers(asset.spriteSheet, {
                start: asset.frameNumber.start,
                end: asset.frameNumber.end,
            });

            scene.anims.create({
                key: asset.key,
                frames,
                repeat: asset.loop ? -1 : 0,
                frameRate: asset.frameRate || 24,
            });
        });
}

