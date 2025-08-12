import Phaser from "phaser";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";

import { ButtonText } from "../TextButton";
import { MainMenu } from "../../../game/scenes/Game/MainMenu";
import { MiniGames } from "../../../game/PouState";

export class PausePanel extends Sizer {
    private Hitbox: Phaser.GameObjects.Rectangle;

    constructor(scene: MainMenu) {
        super(scene, 0, 80, {
            width: scene.scale.width,
            height: scene.scale.height - 80,
            orientation: "vertical",
        });

        this.addBackground(
            scene.add.rectangle(0, 0, 0, 0, 0xffffff, 0.8).setInteractive()
        );

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
                width: scene.scale.width,
                height: 50,
                text: scene.add
                    .text(0, 15, "Pausa", {
                        stroke: "#000000",
                        strokeThickness: 8,
                        fontSize: "50px",
                        fontFamily: "Cookies",
                        align: "center",
                    })
                    .setDepth(3),
                align: "center",
            })
            .layout();

        // const CloseButton = new ImgButton(
        //     scene,
        //     () => {
        //         (this.scene as MainMenu).PanelManager.DeleteCurrentPanel();
        //     },
        //     "close",
        //     0,
        //     0,
        //     60,
        //     0
        // ).setDepth(3);

        Header.addSpace();
        Header.add(HeaderText, { align: "center" });
        Header.addSpace();
        // Header.add(CloseButton, { align: "center-top" });
        // Header.addSpace();
        Header.setOrigin(0.5, 0);
        Header.setInteractive();
        Header.layout();

        const SettingsButton = new ButtonText(scene, {
            x: 0,
            y: 0,
            width: 250,
            height: 80,
            text: "Configuracion",
            backgroundColor: 0x757575,
            textColor: "#ffffff",
            fontSize: 30,
            Callback: () => {
                scene.OpenMenu("Settings2");
            },
            Cooldown: 100,
        });

        const RetryButton = new ButtonText(scene, {
            x: 0,
            y: 0,
            width: 250,
            height: 80,
            text: "Reiniciar",
            backgroundColor: 0xff6f00,
            textColor: "#ffffff",
            fontSize: 30,
            Callback: () => {
                scene.PanelManager.DeleteCurrentPanel();

                scene.scene.manager.scenes.forEach((s) => {
                    if (
                        MiniGames.includes(s.scene.key) &&
                        (s.scene.isActive() || s.scene.isPaused())
                    ) {
                        s.scene.restart();
                    }
                });
            },
            Cooldown: 100,
        });

        const BackButton = new ButtonText(scene, {
            x: 0,
            y: 0,
            width: 250,
            height: 80,
            text: "Regresar",
            backgroundColor: 0x1565c0,
            textColor: "#ffffff",
            fontSize: 30,
            Callback: () => {
                scene.PanelManager.DeleteCurrentPanel();

                scene.scene.manager.scenes.forEach((s) => {
                    if (
                        MiniGames.includes(s.scene.key) &&
                        (s.scene.isActive() || s.scene.isPaused())
                    ) {
                        s.scene.stop();
                    }
                });

                scene.scene.launch("Rooms", {
                    room: 3,
                });
            },
            Cooldown: 100,
        });

        this.add(Header);

        this.addSpace(10);
        this.add(RetryButton);
        this.addSpace();
        this.add(BackButton);
        this.addSpace();
        this.add(SettingsButton);
        this.addSpace(10);

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
