import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import { ImgButton } from "../ImageButton";
import { simpleButtonAnim } from "../utils/SimpleButtonAnim";
import Label from "phaser3-rex-plugins/templates/ui/label/Label";

export class KitchenMiddleSpace extends Sizer {
    GhostImage: Phaser.GameObjects.Image;
    Image: Phaser.GameObjects.Image;

    constructor(
        scene: Phaser.Scene,
        TextureKey: string,

        LeftArrow: () => void,
        RightArrow: () => void,
        DropCallback: () => void
    ) {
        super(scene, 0, 0, {
            width: 180,
            height: 65,
            orientation: "horizontal",
        });

        const leftArrow = new ImgButton(
            scene,
            () => {
                LeftArrow();
            },
            "Arrows2",
            0,
            0,
            45,
            0
        );

        const rightArrow = new ImgButton(
            scene,
            () => {
                RightArrow();
            },
            "Arrows2",
            0,
            0,
            45,
            1
        );

        rightArrow.name = "rightArrow";
        leftArrow.name = "leftArrow";

        const FoodImage = scene.add.image(0, 0, TextureKey);
        this.Image = FoodImage;

        const FoodButton = scene.rexUI.add
            .label({
                width: 75,
                height: 75,
                background: FoodImage,
                action: scene.add
                    .text(0, 15, "x0", {
                        stroke: "#000000",
                        strokeThickness: 8,
                        fontSize: "15px",
                        fontFamily: "Cookies",
                        align: "left",
                    })

                    .setDepth(3),

                space: {
                    actionTop: 50,
                },
            })
            .setDepth(10000);
        FoodButton.name = "FoodItem";

        FoodButton.setInteractive();
        scene.input.setDraggable(FoodButton);

        const FoodGhotImage = scene.add
            .image(0, 0, TextureKey)
            .setDisplaySize(75, 75)
            .setVisible(false)
            .setDepth(4);

        this.GhostImage = FoodGhotImage;

        scene.input.on(
            "drop",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: Phaser.GameObjects.GameObject,
                dropZone: Phaser.GameObjects.GameObject
            ) => {
                if (
                    gameObject.name == "FoodItem" &&
                    dropZone.name == "dropZone"
                ) {
                    this.GhostImage.setVisible(false);
                    DropCallback();
                }
            }
        );
        scene.input.on(
            "drag",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: Phaser.GameObjects.GameObject
            ) => {
                if (gameObject === FoodButton) {
                    FoodGhotImage.setPosition(pointer.x, pointer.y);
                }
            }
        );

        scene.input.on(
            "dragend",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: Phaser.GameObjects.GameObject
            ) => {
                if (gameObject === FoodButton) {
                    if (!this.visible) return;
                    FoodGhotImage.setVisible(false);
                    FoodGhotImage.setPosition(pointer.x, pointer.y);
                    FoodImage.setVisible(true);
                }
            }
        );

        scene.input.on(
            "dragstart",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: Phaser.GameObjects.GameObject
            ) => {
                if (gameObject === FoodButton) {
                    FoodGhotImage.setVisible(true);
                    FoodGhotImage.setPosition(pointer.x, pointer.y);
                    FoodImage.setVisible(false);
                }
            }
        );

        simpleButtonAnim(scene, FoodButton, () => {});
        this.add(leftArrow);
        this.addSpace();
        this.add(FoodButton);
        this.addSpace();
        this.add(rightArrow);
        this.setOrigin(0, 0);

        this.setOrigin(0, 0);
        this.layout();
    }

    ShowArrows(show: boolean) {
        const leftArrow = this.getByName("leftArrow") as ImgButton;
        const rightArrow = this.getByName("rightArrow") as ImgButton;

        leftArrow.setVisible(show);
        rightArrow.setVisible(show);
    }

    SetValue(newText: string) {
        const FoodButton = this.getByName("FoodItem") as Label;
        const Text = FoodButton.getElement("action") as Phaser.GameObjects.Text;

        Text.setText(newText);
        this.layout();
    }

    SetTexture(textureKey: string) {
        const FoodButton = this.getByName("FoodItem") as Label;
        const FoodImage = FoodButton.getElement(
            "background"
        ) as Phaser.GameObjects.Image;
        this.GhostImage.setTexture(textureKey);
        this.GhostImage.setDisplaySize(75, 75);

        FoodImage.setTexture(textureKey);
        this.layout();
    }
}
