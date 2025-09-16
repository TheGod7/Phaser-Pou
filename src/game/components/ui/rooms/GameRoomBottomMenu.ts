import Phaser from "phaser";
import { ImgButton } from "../ImageButton";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import { RoomsManager } from "../../../scenes/Rooms/Rooms";
import { soundManager } from "../utils/sound";
import { MainMenu } from "../../../scenes/Game/MainMenu";

export class GameRoomBottomMenu extends Phaser.GameObjects.Container {
    name: string = "GameRoomBottomMenu";

    ball: Phaser.Physics.Arcade.Image;
    isDragging: boolean = false;

    originalPosition: any = { x: 0, y: 0 };

    menuSizer: Sizer;
    storedVelocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

    moving: boolean = false;
    constructor(scene: Phaser.Scene) {
        super(scene, 0, scene.scale.height);
        scene.add.existing(this);

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

        const MainMenu = scene.scene.get("MainMenu") as MainMenu;

        const Joystick = new ImgButton(
            scene,
            () => {
                MainMenu.OpenMenu("Game");
            },
            "Joystick",
            0,
            0,
            65
        ).setDepth(3);

        const AllAchievements = new ImgButton(
            scene,
            () => {
                MainMenu.OpenMenu("AllAchievements");
            },
            "Archievements",
            0,
            0,
            65
        ).setDepth(3);

        this.menuSizer = MenuSizer;

        this.ball = scene.physics.add
            .image(0, 0, "ball")
            .setDisplaySize(65, 65)
            .setOrigin(0.5)
            .setBounce(0.9)
            .setCollideWorldBounds(true, 1, 1, true)
            .setInteractive()
            .setDepth(3);

        const body = this.ball.body as Phaser.Physics.Arcade.Body;

        body.setAllowGravity(false);
        body.setDamping(true);
        body.setDrag(0.8);

        this.moving = false;
        scene.input.setDraggable(this.ball);

        this.isDragging = false;

        scene.input.on(
            "dragstart",
            (_pointer: Phaser.Input.Pointer, obj: any) => {
                if (obj === this.ball) {
                    this.isDragging = true;
                    this.moving = false;
                    body.setVelocity(0, 0);
                }
            }
        );

        scene.input.on(
            "drag",
            (
                _pointer: Phaser.Input.Pointer,
                obj: any,
                dragX: number,
                dragY: number
            ) => {
                if (obj === this.ball) {
                    obj.setPosition(dragX, dragY);
                }
            }
        );

        scene.input.on("dragend", (pointer: Phaser.Input.Pointer, obj: any) => {
            if (obj === this.ball) {
                this.isDragging = false;
                this.moving = true;

                let throwMultiplier = 6.5;
                if (scene.sys.game.device.os.desktop) {
                    // console.log("first");
                } else {
                    throwMultiplier = 18;
                    // console.log("second");
                }

                const vx = (pointer.velocity.x + 2) * throwMultiplier;
                const vy = (pointer.velocity.y + 2) * throwMultiplier;
                body.setVelocity(vx, vy);
            }
        });

        let pointerDownTime = 0;

        this.ball.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            pointerDownTime = pointer.downTime;
        });

        this.ball.on("pointerup", (pointer: Phaser.Input.Pointer) => {
            const isClick =
                !this.isDragging && pointer.upTime - pointerDownTime < 100;
            if (isClick) {
                this.ball.setVelocity(0, 0);

                this.moving = false;

                this.ball.setPosition(
                    this.originalPosition.x,
                    this.originalPosition.y
                );
                (this.scene as RoomsManager).character.deleteTarget();

                MenuSizer.layout();
            }
        });

        const Rectangle = scene.add
            .rectangle(0, 0, scene.scale.width, 80, 0x000000, 0)
            .setOrigin(0, 0);

        scene.physics.add.existing(Rectangle, true);
        scene.physics.add.collider(this.ball, Rectangle, () => {
            if (!this.moving) return;
            soundManager.play(scene, "BouncingBall", undefined, 5);
        });

        scene.physics.world.on(
            "worldbounds",
            (b: Phaser.Physics.Arcade.Body) => {
                if (b.gameObject === this.ball) {
                    if (!this.moving) return;
                    soundManager.play(scene, "BouncingBall", undefined, 5);
                }
            }
        );

        // MenuSizer.add(
        //     scene.add.rectangle(0, 0, 65, 65, 0x000000, 0).setDepth(2)
        // );

        // MenuSizer.add(
        //     scene.add.rectangle(0, 0, 65, 65, 0x000000, 0).setDepth(2)
        // );

        // MenuSizer.addSpace(10);
        // MenuSizer.add(AllAchievements);
        // MenuSizer.addSpace(3);
        // MenuSizer.add(this.ball);
        // MenuSizer.addSpace(3);
        // MenuSizer.add(Joystick);
        // MenuSizer.addSpace(10);
        // MenuSizer.setOrigin(0, 1);
        // MenuSizer.layout();

        MenuSizer.addBackground(background, { top: 70 });

        MenuSizer.addSpace();
        MenuSizer.add(AllAchievements);
        MenuSizer.addSpace(3);
        MenuSizer.add(this.ball);
        MenuSizer.addSpace(3);
        MenuSizer.add(Joystick);
        MenuSizer.addSpace();

        MenuSizer.setOrigin(0, 1);
        MenuSizer.layout();
        this.add(MenuSizer);
    }

    Stop() {
        const body = this.ball.body as Phaser.Physics.Arcade.Body;

        this.storedVelocity.copy(body.velocity);
        body.setVelocity(0, 0);
        body.moves = false;
        this.moving = false;
        (this.scene as RoomsManager).character.deleteTarget();
    }

    Start() {
        const body = this.ball.body as Phaser.Physics.Arcade.Body;

        body.moves = true;
        body.setVelocity(this.storedVelocity.x, this.storedVelocity.y);
        if (body.velocity.x !== 0 || body.velocity.y !== 0) {
            this.moving = true;
        } else {
            this.moving = false;
            (this.scene as RoomsManager).character.deleteTarget();
        }
    }
    update(): void {
        if (!this.isDragging && this.ball.body!.velocity.length() < 5) {
            this.ball.setVelocity(0, 0);
        }

        if (this.moving) {
            (this.scene as RoomsManager).character.setTarget({
                x: this.ball.body!.x,
                y: this.ball.body!.y,
            });
        }
    }
}
