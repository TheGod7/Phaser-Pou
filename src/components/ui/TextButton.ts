import Phaser from "phaser";
import { simpleButtonAnim } from "./utils/SimpleButtonAnim";
import RoundRectangle from "phaser3-rex-plugins/plugins/roundrectangle";
import Label from "phaser3-rex-plugins/templates/ui/label/Label";

interface ButtonTextConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    backgroundColor?: number;
    textColor?: string | number;
    fontSize?: number;
    radius?: number;
    Callback: () => void;
    Cooldown?: number;
}

export class ButtonText extends Phaser.GameObjects.Container {
    background: RoundRectangle;
    label: Label;

    constructor(scene: Phaser.Scene, config: ButtonTextConfig) {
        super(scene, config.x, config.y);
        scene.add.existing(this);

        const {
            width,
            height,
            text,
            backgroundColor = 0x000000,
            textColor = "#ffffff",
            fontSize = 32,
            radius = 20,
            Callback,
            Cooldown,
        } = config;

        this.background = scene.rexUI.add.roundRectangle({
            width,
            height,
            color: backgroundColor,
            strokeColor: 0x000000,
            strokeWidth: 4,
            radius,
        });

        const textObject = scene.add
            .text(0, 0, text, {
                color:
                    typeof textColor === "number"
                        ? Phaser.Display.Color.IntegerToColor(textColor).rgba
                        : textColor,
                fontSize: `${fontSize}px`,
                fontFamily: "cookies",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5);

        this.label = scene.rexUI.add.label({
            width,
            height,
            background: undefined,
            text: textObject,
            align: "center",
        });

        this.add(this.background);
        this.add(this.label);

        this.setSize(width, height);
        this.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, width, height),
            Phaser.Geom.Rectangle.Contains
        );

        simpleButtonAnim(scene, this as any, Callback, Cooldown);
    }

    setText(newText: string) {
        this.label.setText(newText);
        this.label.layout();
    }

    setBackgroundColor(color: number) {
        this.background.setFillStyle(color);
    }

    SetEnable(value: boolean) {
        this.scene.tweens.killTweensOf(this);
        if (value) {
            this.setInteractive();
            this.active = true;
        } else {
            this.disableInteractive();
            this.active = false;
        }
    }
}
