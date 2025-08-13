import Phaser from "phaser";

import { VolumeSlider } from "../settings/Volume";
import { ButtonText } from "../TextButton";
import { RoomsManager } from "../../../scenes/Rooms/Rooms";
import { soundManager } from "../utils/sound";
import { PouConfig } from "../../../PouState";

export class SettingsPanel extends Phaser.GameObjects.Container {
    VolumeSlider: VolumeSlider;
    BackgroundBtn: ButtonText;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        scene.add.existing(this);

        const Header = scene.rexUI.add
            .label({
                width: scene.scale.width,
                height: 70,
                text: scene.add
                    .text(0, 15, "Configuracion", {
                        stroke: "#000000",
                        strokeThickness: 8,
                        fontSize: "50px",
                        fontFamily: "Cookies",
                        align: "center",
                    })
                    .setDepth(3),
                space: {
                    top: 30,
                },
                align: "center",
            })
            .layout();

        const panelSizer = scene.rexUI.add.sizer({
            width: scene.scale.width,
            height: scene.scale.height - 80,
            orientation: "vertical",
            space: {
                top: 50,
                bottom: 20,
            },
        });

        this.VolumeSlider = new VolumeSlider(
            scene,
            0,
            0,
            scene.scale.width - 150,
            60,
            (value: number) => {
                soundManager.setVolume(value * 100);
            }
        );

        this.BackgroundBtn = new ButtonText(scene, {
            x: 0,
            y: 0,
            width: 250,
            height: 80,
            text: "Cambiar Fondo",
            backgroundColor: 0xff9900,
            textColor: "#ffffff",
            fontSize: 30,
            Callback: () => {
                const RoomsScene = scene.scene.get("Rooms") as RoomsManager;
                RoomsScene.NextBackground();
            },
            Cooldown: 100,
        });

        const FullScreen = new ButtonText(scene, {
            x: 0,
            y: 0,
            width: 250,
            height: 80,
            text: "Pantalla completa",
            backgroundColor: 0xff9900,
            textColor: "#ffffff",
            fontSize: 30,
            Callback: () => {
                if (scene.scale.isFullscreen) {
                    scene.scale.stopFullscreen();
                } else {
                    scene.scale.startFullscreen();
                }
            },
            Cooldown: 100,
        });

        this.BackgroundBtn.setDepth(3);
        this.VolumeSlider.setDepth(3);

        FullScreen.setDepth(3);
        const emptySpace = scene.rexUI.add.label({
            width: scene.scale.width,
            height: 70,
            adjustTextFontSize: true,
        });

        panelSizer.add(this.VolumeSlider);
        panelSizer.add(emptySpace);
        panelSizer.add(this.BackgroundBtn, {
            align: "center-bottom",
        });
        panelSizer.add(emptySpace);
        panelSizer.add(FullScreen, {
            align: "center-bottom",
        });
        panelSizer.setOrigin(0.5, 0);
        panelSizer.layout();

        const Panel = scene.rexUI.add.scrollablePanel({
            width: scene.scale.width,
            height: scene.scale.height - 80,
            x: 0,
            y: 80,
            background: scene.add
                .rectangle(0, 0, 0, 0, 0xffffff, 0.8)
                .setDepth(2),

            header: Header,
            panel: {
                child: panelSizer,
            },
            scroller: {
                threshold: 100000,
            },
        });

        Panel.setOrigin(0, 0);
        Panel.layout();

        const rectangle = scene.add
            .rectangle(
                0,
                80,
                scene.scale.width,
                scene.scale.height - 80,
                0x000000,
                0
            )
            .setOrigin(0, 0);

        rectangle.setInteractive();
        this.add(rectangle);
        this.add(Panel);
    }

    Start() {
        this.VolumeSlider.setPercentage(PouConfig.volume);
    }
    update(): void {
        this.VolumeSlider.slider.update();
    }
}
