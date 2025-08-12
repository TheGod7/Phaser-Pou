import Phaser from "phaser";

import { VolumeSlider } from "../settings/Volume";
import { ButtonText } from "../TextButton";
import { soundManager } from "../utils/sound";
import { ImgButton } from "../ImageButton";
import { MainMenu } from "../../../game/scenes/Game/MainMenu";
import { PouConfig } from "../../../game/PouState";

export class InGameSettings extends Phaser.GameObjects.Container {
    VolumeSlider: VolumeSlider;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        scene.add.existing(this);

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
                    .text(0, 15, "Config", {
                        stroke: "#000000",
                        strokeThickness: 8,
                        fontSize: "50px",
                        fontFamily: "Cookies",
                        align: "center",
                    })
                    .setDepth(3),
            })
            .layout();

        const Back = new ImgButton(
            scene,
            () => {
                (this.scene as MainMenu).OpenMenu("Pause");
            },
            "Arrows",
            0,
            0,
            60,
            0
        ).setDepth(3);

        Header.addSpace();
        Header.add(Back, { align: "center-top" });
        Header.addSpace(2);
        Header.add(HeaderText, { align: "center-top" });
        Header.addSpace(5);
        Header.setOrigin(0.5, 0);
        Header.setInteractive();
        Header.layout();

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

        this.VolumeSlider.setDepth(3);
        FullScreen.setDepth(3);
        const emptySpace = scene.rexUI.add.label({
            width: scene.scale.width,
            height: 70,
            adjustTextFontSize: true,
        });

        panelSizer.add(this.VolumeSlider);
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
