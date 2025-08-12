import Phaser from "phaser";
import RoundRectangleProgress from "phaser3-rex-plugins/plugins/roundrectangleprogress";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import { CoinLabel } from "./CoinLabel";
import { ImgButton } from "../ImageButton";
import { PouStates } from "../../../game/PouState";
import { MainMenu } from "../../../game/scenes/Game/MainMenu";
enum StatusBarEnum {
    Energy = 0,
    Hunger = 1,
    Health = 2,
}

export type BarTypes = "Energy" | "Hunger" | "Health" | "Coins";

const Status = ["energy", "hunger", "health"];
export class StatusBar extends Sizer {
    name = "StatusBar";
    StatusBar: Map<BarTypes, RoundRectangleProgress> = new Map();
    coinLabel: CoinLabel;

    SettingsButton: ImgButton;
    SettingsButtonVisible: boolean = true;

    PauseButton: ImgButton;
    inPause: boolean = false;

    eventEmitter: Phaser.Events.EventEmitter;

    constructor(scene: MainMenu) {
        super(scene, scene.scale.width / 2, 0, {
            width: scene.scale.width,
            height: 80,
            space: {
                left: 20,
                right: 20,
            },
            orientation: "horizontal",
        });
        this.eventEmitter = new Phaser.Events.EventEmitter();
        const StatusSquareSize = 70;

        for (let i = 0; i < 3; i++) {
            const Bar = scene.add.rexRoundRectangleProgress({
                width: StatusSquareSize,
                height: StatusSquareSize,
                x: 0,
                y: 0,
                barColor: 0x53ff4b,
                radius: {
                    bl: 20,
                    br: 20,
                    tl: 25,
                    tr: 25,
                },
                rtl: true,
                orientation: 1,

                easeValue: {
                    duration: 500,
                    ease: "Linear",
                },
                valuechangeCallback: function (
                    _newValue,
                    _oldValue,
                    _roundRectangleProgress
                ) {},
            });

            Bar.setOrigin(0.5, 0.5);
            const BarName = Status[i];

            Bar.setValue(PouStates[BarName as keyof typeof PouStates] / 100);
            Bar.name = StatusBarEnum[i];

            this.StatusBar.set(StatusBarEnum[i] as BarTypes, Bar);
            const BarSprite = scene.add
                .sprite(0, 0, "StatusSquare", i)
                .setDisplaySize(StatusSquareSize, StatusSquareSize);

            const BarLabel = scene.rexUI.add.label({
                x: 0,
                y: 0,

                align: "center",
                width: StatusSquareSize,
                height: StatusSquareSize,
                icon: BarSprite,
            });

            BarLabel.addBackground(Bar, {
                top: 4,
                bottom: 2,
                left: 3,
                right: 3,
            });
            BarLabel.layout();
            this.add(BarLabel);

            Bar.easeValueTo(1);
        }

        this.addSpace(50);
        this.coinLabel = new CoinLabel(scene, 0, 0);
        this.add(this.coinLabel);

        const ScenesAllowed = ["MainMenu", "GameManager"];

        this.PauseButton = new ImgButton(
            scene,
            () => {
                this.inPause = !this.inPause;
                this.isPaused(this.inPause);

                scene.scene.manager.scenes.forEach((s) => {
                    const active = s.scene.isActive();

                    if (!ScenesAllowed.includes(s.scene.key)) {
                        if (active && this.inPause) {
                            s.scene.pause();
                        }

                        if (s.scene.isPaused() && !this.inPause) {
                            s.scene.resume();
                        }
                    }
                });

                if (this.inPause) {
                    scene.OpenMenu("Pause");
                } else {
                    scene.PanelManager.DeleteCurrentPanel();
                }
            },
            "ClosePause",
            0,
            0,
            StatusSquareSize
        ).setVisible(false);

        this.SettingsButton = new ImgButton(
            scene,
            () => {
                scene.OpenMenu("Settings");
            },
            "Settings",
            0,
            0,
            StatusSquareSize
        );

        this.PauseButton.name = "PauseButton";
        this.SettingsButton.name = "SettingsButton";

        this.add(this.SettingsButton);
        this.setOrigin(0.5, 0);
        this.layout();
    }

    SetStatus(stat: BarTypes, value: number) {
        const Bar = this.StatusBar.get(stat);

        if (Bar) {
            Bar.easeValueTo(value / 100);
        }

        if (stat === "Coins") {
            this.coinLabel.drawMoney(value);
        }
    }

    EnableSettings(value: boolean) {
        this.SettingsButtonVisible = value;

        if (this.inPause) {
            this.SettingsButton.setVisible(false);
            this.SettingsButton.setTexture("Settings");
            this.SettingsButton.SetEnable(false);

            if (this.getByName("SettingsButton")) {
                this.remove(this.SettingsButton);
            }
        } else {
            this.SettingsButton.setVisible(this.SettingsButtonVisible);
            this.SettingsButton.setTexture("Settings");
            this.SettingsButton.SetEnable(this.SettingsButtonVisible);

            if (
                this.SettingsButtonVisible &&
                !this.getByName("SettingsButton")
            ) {
                this.add(this.SettingsButton);
            }

            if (
                !this.SettingsButtonVisible &&
                this.getByName("SettingsButton")
            ) {
                this.remove(this.SettingsButton);
            }
        }
    }

    EnablePause(value: boolean) {
        this.inPause = false;

        if (value) {
            // Hide Settings Button
            this.SettingsButton.setVisible(false);
            this.SettingsButton.setTexture("Settings");
            this.SettingsButton.SetEnable(false);
            this.remove(this.SettingsButton);

            // Show Pause Button
            this.PauseButton.setVisible(true);
            this.PauseButton.setTexture("ClosePause", 1);
            this.PauseButton.SetEnable(true);
            this.add(this.PauseButton);
            this.layout();
        } else {
            this.SettingsButton.setVisible(this.SettingsButtonVisible);
            this.SettingsButton.setTexture("Settings");
            this.SettingsButton.SetEnable(this.SettingsButtonVisible);

            if (
                this.SettingsButtonVisible &&
                !this.getByName("SettingsButton")
            ) {
                this.add(this.SettingsButton);
            }

            if (
                !this.SettingsButtonVisible &&
                this.getByName("SettingsButton")
            ) {
                this.remove(this.SettingsButton);
            }

            //hide Pause Button
            this.PauseButton.setVisible(false);
            this.PauseButton.setTexture("ClosePause", 1);
            this.PauseButton.SetEnable(false);

            if (this.getByName("PauseButton")) {
                this.remove(this.PauseButton);
            }

            this.layout();
        }
    }

    isPaused(bool: boolean) {
        this.PauseButton.setTexture("ClosePause", bool ? 2 : 1);
    }

    Set(eventName: string, callback: (...args: any[]) => void) {
        this.eventEmitter.on(eventName, callback);
    }
}
