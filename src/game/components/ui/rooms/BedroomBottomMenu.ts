import Phaser from "phaser";
import { GameManager } from "../../../scenes/Game/GameManager";
import { ImgButton } from "../ImageButton";
import { RoomsManager } from "../../../scenes/Rooms/Rooms";

export class BedroomBottomMenu extends Phaser.GameObjects.Container {
    name: string = "BedroomBottomMenu";
    GameManagerScene: GameManager;
    sleeping: boolean = false;
    background: Phaser.GameObjects.Rectangle;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, scene.scale.height);
        scene.add.existing(this);

        const GameManager = scene.scene.get("GameManager") as GameManager;
        this.GameManagerScene = GameManager;

        const MenuSizer = scene.rexUI.add.sizer({
            width: scene.scale.width,
            height: 140,
            x: 0,
            y: 0,
            orientation: "horizontal",
            space: {
                top: 50,
                bottom: 20,
            },
        });

        const background = scene.add
            .rectangle(0, 0, 0, 0, 0x000, 0.5)
            .setDepth(2);

        MenuSizer.addBackground(background, { top: 70 });

        const BedButton = new ImgButton(
            scene,
            () => {
                this.sleeping = !this.sleeping;
                GameManager.setSleeping(this.sleeping);
                this.background.setVisible(this.sleeping);
                (scene as RoomsManager).character.Sleep(this.sleeping);
            },
            "Lamp",
            0,
            0,
            65
        ).setDepth(3);

        this.background = scene.add
            .rectangle(
                0,
                0,
                scene.scale.width,
                scene.scale.height,
                0x000000,
                0.5
            )
            .setOrigin(0, 0);

        this.background.setVisible(false);
        this.background.setDepth(1);
        MenuSizer.addSpace();
        MenuSizer.add(BedButton);
        MenuSizer.addSpace();
        MenuSizer.setOrigin(0, 1);
        MenuSizer.layout();

        this.add(MenuSizer);
    }

    Stop() {
        this.sleeping = false;
        this.background.setVisible(this.sleeping);
        this.GameManagerScene.setSleeping(this.sleeping);
        (this.scene as RoomsManager).character.Sleep(this.sleeping);
    }
}
