import Phaser from "phaser";
import generateID from "./utils/IDgenerator";

import RoundRectangleCanvas from "phaser3-rex-plugins/templates/ui/roundrectanglecanvas/RoundRectangleCanvas";
import RoundRectangleProgress from "phaser3-rex-plugins/plugins/roundrectangleprogress";

export class Slider extends Phaser.GameObjects.Container {
    Thumb: RoundRectangleCanvas;
    Track: RoundRectangleProgress;
    leftLimit: number;
    rightLimit: number;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        OnSliderChange: (value: number) => void
    ) {
        super(scene, x, y);
        scene.add.existing(this);

        const id = generateID();
        this.name = "Slider-" + id;

        const LimitZone = scene.add
            .rectangle(0, 0, width, height - 10, 0x000000)
            .setVisible(false);

        this.Track = scene.add.rexRoundRectangleProgress({
            x: 0,
            y: 0,
            width: width,
            height: height - 10,
            radius: 5,
            trackColor: 0x000000,
            barColor: 0x53ff4b,
            trackStrokeColor: 0x000000,
            easeValue: {
                duration: 0,
                ease: "Linear",
            },
            valuechangeCallback: function (
                _newValue,
                _oldValue,
                _roundRectangleProgress
            ) {},
        });

        this.Track.setToBack();

        this.Thumb = scene.add.rexRoundRectangleCanvas(
            0,
            0,
            height,
            height,
            {
                radius: 5,
            },
            0xffffff,
            0x000,
            2
        );

        this.Thumb.name = "Thumb-" + id;

        this.Thumb.setInteractive();
        scene.input.setDraggable(this.Thumb);

        const half = this.Thumb.width / 2 - 10;
        const leftlimit = -LimitZone.width / 2 + half;
        const rightlimit = LimitZone.width / 2 - half;

        this.leftLimit = leftlimit;
        this.rightLimit = rightlimit;

        scene.input.on(
            "drag",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: Phaser.GameObjects.GameObject
            ) => {
                if (gameObject.name === "Thumb-" + id) {
                    const local = pointer.x - this.x;

                    const clampedX = Phaser.Math.Clamp(
                        local,
                        leftlimit,
                        rightlimit
                    );

                    this.Track.easeValueTo(this.getPercentage());
                    OnSliderChange(this.getPercentage());
                    this.Thumb.x = clampedX;
                }
            }
        );

        this.setPercentage(100);
        this.add([LimitZone, this.Track, this.Thumb]);
    }

    getPercentage(): number {
        const trackWidth =
            (this.Thumb.x - this.leftLimit) /
            (this.rightLimit - this.leftLimit);
        return trackWidth;
    }

    setPercentage(value: number) {
        this.Thumb.x = Phaser.Math.Linear(
            this.leftLimit,
            this.rightLimit,
            Phaser.Math.Clamp(value / 100, 0, 1)
        );

        this.Track.easeValueTo(value / 100);
    }

    update(): void {
        this.Track.easeValueTo(this.getPercentage());
    }
}
