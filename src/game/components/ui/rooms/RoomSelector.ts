import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import { ImgButton } from "../ImageButton";
import { RoomsManager } from "../../../scenes/Rooms/Rooms";
import Label from "phaser3-rex-plugins/templates/ui/label/Label";

enum Rooms {
    Dormitorio = 0,
    Cocina = 1,
    Sala = 2,
    Juegos = 3,
}

export class RoomSelector extends Sizer {
    name = "RoomSelector";

    leftButton: ImgButton;
    rightButton: ImgButton;
    text: Label;

    constructor(scene: RoomsManager) {
        super(scene, scene.scale.width / 2, 80, {
            width: scene.scale.width,
            height: 80,
            space: {
                left: 20,
                right: 20,
            },
            orientation: "horizontal",
        });

        this.leftButton = new ImgButton(
            scene,
            () => {
                scene.prevRoom();
                this.text.setText(Rooms[scene.CurrentRoom]);
                this.text.layout();
            },
            "Arrows",
            0,
            0,
            70,
            0
        );

        this.rightButton = new ImgButton(
            scene,
            () => {
                scene.nextRoom();
                this.text.setText(Rooms[scene.CurrentRoom]);
                this.text.layout();
            },
            "Arrows",
            0,
            0,
            70,
            1
        );

        this.text = scene.rexUI.add.label({
            x: 0,
            y: 0,
            width: 290,
            height: 60,
            text: scene.add.text(0, 0, Rooms[scene.CurrentRoom], {
                stroke: "#000000",
                strokeThickness: 8,
                fontSize: "50px",
                fontFamily: "Cookies",
                align: "center",
            }),
            adjustTextFontSize: true,
        });

        this.text.layout();

        this.addMultiple([this.leftButton, this.text, this.rightButton]);
        this.setOrigin(0.5, 0);
        this.layout();
    }
}
