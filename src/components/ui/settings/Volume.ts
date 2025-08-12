import Label from "phaser3-rex-plugins/templates/ui/label/Label";
import { PouConfig } from "../../../game/PouState";
import { Slider } from "../Slider";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";

export class VolumeSlider extends Sizer {
    name = "VolumeSelector";
    slider: Slider;
    text: Label;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        OnSliderChange: (value: number) => void
    ) {
        super(scene, x, y, {
            width: width,
            height: height,
            space: {
                left: 20,
                right: 20,
            },
            orientation: "vertical",
        });

        const TextLabel = scene.rexUI.add
            .label({
                width: width,
                height: 40,
                align: "left",
                text: scene.add
                    .text(0, 15, "Volumen: " + PouConfig.volume + "%", {
                        stroke: "#000000",
                        strokeThickness: 8,
                        fontSize: "50px",
                        fontFamily: "Cookies",
                        align: "left",
                    })
                    .setDepth(3),

                space: {
                    bottom: 10,
                },
                adjustTextFontSize: true,
            })
            .layout()
            .setDepth(3);

        this.text = TextLabel;
        this.slider = new Slider(scene, 0, 0, width, 40, (value: number) => {
            TextLabel.setText("Volumen: " + (value * 100).toFixed(0) + "%");
            OnSliderChange(value);
        }).setDepth(2);

        this.slider.setPercentage(PouConfig.volume);

        this.add(TextLabel);
        this.addSpace(20);
        this.add(this.slider);

        this.setOrigin(0.5, 0);
        this.layout();
    }

    setPercentage(value: number) {
        const volume = value.toFixed(0);
        this.text.setText("Volumen: " + volume + "%");
        this.slider.setPercentage(value);
    }
}
