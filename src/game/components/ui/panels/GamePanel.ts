import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import { ImgButton } from "../ImageButton";
import { MainMenu } from "../../../scenes/Game/MainMenu";
import { ButtonText } from "../TextButton";
import { RoomsManager } from "../../../scenes/Rooms/Rooms";

const GamesICo = ["FoodDrop", "FlappyBird", "MemoryMatch"];

const GameName = ["Foca Comelona", "Flappy Foca", "Memoria Foca"];
const GameDescription = [
    "Atrapa los pescados, evita la basura",
    "juega a el juego original de la flappy foca",

    "Encuntra todos los pares para ganar",
];

export class GamePanel extends Sizer {
    private Hitbox: Phaser.GameObjects.Rectangle;

    constructor(scene: Phaser.Scene) {
        super(scene, {
            width: scene.scale.width,
            height: scene.scale.height - 80,
            x: 0,
            y: 80,
            orientation: "vertical",
        });

        const Header = scene.rexUI.add.sizer({
            width: scene.scale.width,
            height: 50,
            space: {
                top: 30,
                bottom: 20,
            },
            orientation: "horizontal",
        });

        const HeaderText = scene.rexUI.add
            .label({
                width: 200,
                height: 50,
                text: scene.add
                    .text(0, 15, "Minijuegos", {
                        stroke: "#000000",
                        strokeThickness: 8,
                        fontSize: "50px",
                        fontFamily: "Cookies",
                        align: "center",
                    })
                    .setDepth(3),
            })
            .layout();

        const CloseButton = new ImgButton(
            scene,
            () => {
                (this.scene as MainMenu).PanelManager.DeleteCurrentPanel();
            },
            "close",
            0,
            0,
            60,
            0
        ).setDepth(3);

        Header.addSpace(3);
        Header.add(HeaderText, { align: "center-top" });
        Header.addSpace();
        Header.add(CloseButton, { align: "center-top" });
        Header.addSpace();
        Header.setOrigin(0.5, 0);
        Header.setInteractive();
        Header.layout();

        const PanelSizer = scene.rexUI.add.sizer({
            width: scene.scale.width,
            orientation: "vertical",
        });

        for (let i = 0; i < GamesICo.length; i++) {
            const Game = GamesICo[i];

            const GameSizer = scene.rexUI.add.sizer({
                width: scene.scale.width,
                height: 100,
                space: {
                    top: 20,
                    bottom: 20,
                    left: 10,
                    right: 10,
                },
                orientation: "horizontal",
            });

            const GameSizerInfo = scene.rexUI.add.sizer({
                width: 100,
                height: 100,
                orientation: "vertical",
                space: {
                    left: 10,
                    right: 10,
                },
            });

            const GameButton = new ButtonText(scene, {
                height: 50,
                width: 100,
                x: 0,
                y: 0,
                text: "Jugar",
                backgroundColor: 0xff9900,
                textColor: "#ffffff",
                fontSize: 15,
                radius: 5,
                Callback: () => {
                    (this.scene as MainMenu).PanelManager.DeleteCurrentPanel();

                    const roomScene = this.scene.scene.get(
                        "Rooms"
                    ) as RoomsManager;

                    if (roomScene.scene.isActive()) {
                        roomScene.scene.stop();
                    }

                    this.scene.scene.launch(GamesICo[i]);
                },
            });

            const GameImage = scene.add
                .image(0, 0, Game)
                .setDisplaySize(100, 100);

            const Name = scene.rexUI.add
                .label({
                    width: 100,
                    height: 25,
                    text: scene.add
                        .text(0, 15, GameName[i], {
                            stroke: "#000000",
                            strokeThickness: 8,
                            fontSize: "25px",
                            fontFamily: "Cookies",
                            align: "center",
                        })
                        .setDepth(3),
                })
                .layout();

            const Description = scene.rexUI.add
                .label({
                    width: 220,
                    height: 25,
                    text: scene.add
                        .text(0, 15, GameDescription[i], {
                            fontSize: "20px",
                            color: "#000000",
                            wordWrap: {
                                width: 240,
                                useAdvancedWrap: true,
                            },
                            fontFamily: "Cookies",
                            align: "left",
                        })

                        .setDepth(3),
                    space: {
                        top: 10,
                    },
                })
                .layout();

            GameSizerInfo.add(Name);
            GameSizerInfo.add(Description);
            GameSizerInfo.setOrigin(0.5, 0);
            GameSizerInfo.layout();

            GameSizer.addSpace();
            GameSizer.add(GameImage);
            GameSizer.add(GameSizerInfo);
            GameSizer.add(GameButton);
            GameSizer.addSpace();

            GameSizerInfo.setOrigin(0.5, 0);
            GameSizerInfo.layout();

            PanelSizer.add(GameSizer);
        }

        PanelSizer.setOrigin(0, 0);
        PanelSizer.layout();

        this.addBackground(
            scene.add.rectangle(0, 0, 0, 0, 0xffffff, 0.8).setDepth(1)
        );
        this.add(Header.setDepth(3));
        this.add(PanelSizer.setDepth(3));
        this.setOrigin(0, 0);
        this.layout();

        this.Hitbox = scene.add
            .rectangle(
                0,
                80,
                scene.scale.width,
                scene.scale.height - 80,
                0x000000,
                0
            )
            .setOrigin(0, 0)
            .setVisible(false)
            .setToBack();
        this.Hitbox.setInteractive();
    }

    Start() {
        this.Hitbox.setVisible(true);
    }

    Stop() {
        this.Hitbox.setVisible(false);
    }
}
