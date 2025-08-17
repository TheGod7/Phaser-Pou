import Phaser, { Game } from "phaser";
import { PouStates } from "../../../PouState";
import { soundManager } from "../utils/sound";

interface Eyes {
    width: number;
    height: number;
    frame: number;
    image: Phaser.GameObjects.Image;
    initialPosX: number;
    initialPosY: number;
    targetX: number;
    targetY: number;
}

export class Character extends Phaser.GameObjects.Container {
    public Character: Phaser.GameObjects.Sprite;
    public CharWithEyes: Phaser.GameObjects.Sprite;

    private SleepAnim: boolean = false;
    private talkingAnim: boolean = false;

    private maxDistance = 10;
    private Smoothing = 0.1;
    private ObjectsInTarget:
        | Phaser.GameObjects.GameObject
        | Phaser.Input.Pointer
        | undefined;

    leftEye: Eyes;
    rightEye: Eyes;

    constructor(
        scene: Phaser.Scene,
        width: number = 600,
        height: number = 600,
        x: number,
        y: number
    ) {
        super(scene, x, y);
        scene.add.existing(this);

        this.Character = scene.add
            .sprite(0, 0, "CharacterWithoutEyes", 0)
            .setOrigin(0.5, 1)
            .setDisplaySize(width, height)
            .setVisible(true);

        this.CharWithEyes = scene.add
            .sprite(-3, -22, "CharacterAnimationSpriteSheet", 0)
            .setOrigin(0.5, 1)
            .setDisplaySize(width, height)
            .setVisible(false);

        this.Character.play("test");
        const k = 7 / 60;
        const EyesSizeY = k * height;
        const EyesSizeX = k * width;

        const X = 1 / 10;
        const Y = 3 / 5;

        const EyePosX = X * width;
        const EyePosY = Y * height;

        const LeftEye = scene.add
            .image(-EyePosX, -EyePosY, "CharacterEyes", 0)
            .setOrigin(0.5, 1)
            .setDisplaySize(EyesSizeX, EyesSizeY)
            .setVisible(true);

        const RightEye = scene.add
            .image(EyePosX, -EyePosY, "CharacterEyes", 0)
            .setOrigin(0.5, 1)
            .setDisplaySize(EyesSizeX, EyesSizeY)
            .setVisible(true);

        this.leftEye = {
            width: EyesSizeX,
            height: EyesSizeY,
            frame: 0,
            image: LeftEye,
            initialPosX: LeftEye.x,
            initialPosY: LeftEye.y,
            targetX: LeftEye.x,
            targetY: LeftEye.y,
        };

        this.rightEye = {
            width: EyesSizeX,
            height: EyesSizeY,
            frame: 1,
            image: RightEye,
            initialPosX: RightEye.x,
            initialPosY: RightEye.y,
            targetX: RightEye.x,
            targetY: RightEye.y,
        };

        const dropZoneEnter = scene.add
            .zone(scene.scale.width / 2, scene.scale.height / 2 + 80, 300, 300)
            .setRectangleDropZone(300, 300);
        dropZoneEnter.setInteractive();

        const dropZoneMouth = scene.add
            .zone(scene.scale.width / 2, scene.scale.height / 2 + 80, 100, 100)
            .setRectangleDropZone(100, 100);
        dropZoneMouth.setInteractive();

        dropZoneEnter.name = "dropZoneEnter";
        dropZoneMouth.name = "dropZone";

        let inDropzone = false;
        let inDropzone2 = false;
        let mouthOpen = false;

        scene.input.on(
            "dragenter",
            (
                pointer: Phaser.Input.Pointer,
                game: Phaser.GameObjects.GameObject,
                dropZone: Phaser.GameObjects.GameObject
            ) => {
                if (
                    dropZone.name === "dropZoneEnter" ||
                    dropZone.name === "dropZone"
                ) {
                    if (game.name != "FoodItem") return;
                    if (dropZone.name === "dropZoneEnter") {
                        inDropzone = true;
                    } else if (dropZone.name === "dropZone") {
                        inDropzone2 = true;
                    }

                    if (!mouthOpen) {
                        this.Character.play(
                            {
                                key: "MouthOpen",
                                frameRate: 10,
                            },
                            true
                        );
                        mouthOpen = true;
                    }
                }
            }
        );

        scene.input.on(
            "dragleave",
            (
                pointer: Phaser.Input.Pointer,
                game: Phaser.GameObjects.GameObject,
                dropZone: Phaser.GameObjects.GameObject
            ) => {
                if (
                    dropZone.name === "dropZoneEnter" ||
                    dropZone.name === "dropZone"
                ) {
                    if (game.name != "FoodItem") return;
                    if (dropZone.name === "dropZoneEnter") {
                        inDropzone = false;
                    } else if (dropZone.name === "dropZone") {
                        inDropzone2 = false;
                    }

                    scene.time.delayedCall(10, () => {
                        if (!inDropzone && !inDropzone2 && mouthOpen) {
                            this.Character.play(
                                {
                                    key: "MouthClose",
                                    frameRate: 10,
                                },
                                true
                            );
                            mouthOpen = false;
                        }
                    });
                }
            }
        );

        scene.input.on(
            "drop",
            (
                pointer: Phaser.Input.Pointer,
                game: Phaser.GameObjects.GameObject,
                dropZone: Phaser.GameObjects.GameObject
            ) => {
                if (dropZone.name === "dropZoneEnter") {
                    if (game.name != "FoodItem") return;
                    this.Character.play(
                        {
                            key: "MouthClose",
                            frameRate: 10,
                        },
                        true
                    );
                }

                if (dropZone.name === "dropZone") {
                    if (game.name != "FoodItem") return;
                    this.Character.setVisible(false);
                    this.leftEye.image.setVisible(false);
                    this.rightEye.image.setVisible(false);
                    this.CharWithEyes.setVisible(true);
                    this.CharWithEyes.setFrame(19);

                    if (PouStates.hunger >= 100) {
                        soundManager.play(scene, "NoSound");
                        this.CharWithEyes.play("NoEat");
                        this.CharWithEyes.chain(["NoEat2"]);

                        this.CharWithEyes.once(
                            "animationcomplete-NoEat2",
                            () => {
                                this.CharWithEyes.setFrame(19);
                                this.CharWithEyes.setVisible(false);
                                this.Character.setVisible(true);
                                this.resetTarget();
                                this.leftEye.image.setVisible(true);
                                this.rightEye.image.setVisible(true);
                                if (mouthOpen) {
                                    this.Character.setFrame(0);
                                    mouthOpen = false;
                                }
                            }
                        );
                    } else {
                        soundManager.play(scene, "EatSound");
                        this.CharWithEyes.play("eat");
                        this.CharWithEyes.chain(["eat2"]);

                        this.CharWithEyes.once("animationcomplete-eat2", () => {
                            this.CharWithEyes.setFrame(19);
                            this.CharWithEyes.setVisible(false);
                            this.resetTarget();
                            this.Character.setVisible(true);
                            this.leftEye.image.setVisible(true);
                            this.rightEye.image.setVisible(true);

                            if (mouthOpen) {
                                this.Character.setFrame(0);
                                mouthOpen = false;
                            }
                        });
                    }
                }
            }
        );

        const CursorZone = scene.add.zone(0, 100, width, height + 200);
        CursorZone.setOrigin(0.5, 1);
        CursorZone.setInteractive();
        this.setToTop();

        // const debug = scene.add.graphics();

        // debug.lineStyle(1, 0xffffff, 0);
        // debug.strokeRect(
        //     CursorZone.x - CursorZone.width / 2,
        //     CursorZone.y - CursorZone.height,
        //     CursorZone.width,
        //     CursorZone.height
        // );

        scene.input.on("gameout", () => {
            const pointer = scene.input.activePointer;
            if (this.ObjectsInTarget && this.ObjectsInTarget != pointer) return;

            this.ObjectsInTarget = undefined;

            // debug.clear();
            // debug.lineStyle(1, 0xffffff);
            // debug.strokeRect(
            //     CursorZone.x - CursorZone.width / 2,
            //     CursorZone.y - CursorZone.height,
            //     CursorZone.width,
            //     CursorZone.height
            // );
        });

        scene.input.on("gameover", () => {
            const pointer = scene.input.activePointer;

            if (this.ObjectsInTarget) return;

            this.ObjectsInTarget = pointer;

            // debug.clear();
            // debug.lineStyle(1, 0x00ff00);
            // debug.strokeRect(
            //     CursorZone.x - CursorZone.width / 2,
            //     CursorZone.y - CursorZone.height,
            //     CursorZone.width,
            //     CursorZone.height
            // );
        });

        CursorZone.on("pointerover", (pointer: Phaser.Input.Pointer) => {
            if (this.ObjectsInTarget) return;

            this.ObjectsInTarget = pointer;

            // debug.clear();
            // debug.lineStyle(1, 0x00ff00);
            // debug.strokeRect(
            //     CursorZone.x - CursorZone.width / 2,
            //     CursorZone.y - CursorZone.height,
            //     CursorZone.width,
            //     CursorZone.height
            // );
        });

        CursorZone.on("pointerout", (pointer: Phaser.Input.Pointer) => {
            if (this.ObjectsInTarget && this.ObjectsInTarget != pointer) return;

            this.ObjectsInTarget = undefined;
            // debug.clear();
            // debug.lineStyle(1, 0xffffff);
            // debug.strokeRect(
            //     CursorZone.x - CursorZone.width / 2,
            //     CursorZone.y - CursorZone.height,
            //     CursorZone.width,
            //     CursorZone.height
            // );
        });

        const loopChain = ["SleepLoop", "SleepLoop2"];

        let loopIndex = 0;
        this.CharWithEyes.on("animationcomplete-SleepEnd", () => {
            if (this.SleepAnim) return;
            this.Character.setVisible(true);
            this.leftEye.image.setVisible(true);
            this.rightEye.image.setVisible(true);
            this.CharWithEyes.setVisible(false);
            this.CharWithEyes.setFrame(19);
        });

        this.CharWithEyes.on(
            "animationcomplete",
            (anim: Phaser.Animations.Animation) => {
                if (!this.SleepAnim) return;

                if (loopChain.includes(anim.key)) {
                    loopIndex = (loopIndex + 1) % loopChain.length;
                    this.scene.time.delayedCall(300, () => {
                        if (!this.SleepAnim) return;
                        this.CharWithEyes.play(loopChain[loopIndex]);
                    });
                }
            }
        );

        const loopChain2 = ["MouthOpen2", "MouthClose2"];
        let loopIndex2 = 0;

        this.Character.on(
            "animationcomplete",
            (anim: Phaser.Animations.Animation) => {
                if (loopChain2.includes(anim.key)) {
                    if (!this.talkingAnim) {
                        loopIndex2 = 0;
                        if (anim.key === "MouthOpen2") {
                            this.Character.play({
                                key: "MouthClose",
                                duration: 100,
                            });
                        }
                        return;
                    }

                    loopIndex2 = (loopIndex2 + 1) % loopChain2.length;

                    if (!this.talkingAnim) {
                        if (
                            this.Character.anims.currentAnim?.key ===
                            "MouthOpen"
                        ) {
                            this.Character.play({
                                key: "MouthClose2",
                                duration: 100,
                            });
                        }
                        return;
                    }

                    this.Character.play({
                        key: loopChain2[loopIndex2],
                        duration: 100,
                    });
                }
            }
        );

        this.add([
            this.Character,
            LeftEye,
            RightEye,
            this.CharWithEyes,
            CursorZone,
            // debug,
        ]);
    }

    update(): void {
        if (this.ObjectsInTarget) {
            this.updateTarget(this.ObjectsInTarget);
        } else {
            this.resetTarget();
        }

        for (let i = 0; i < 2; i++) {
            const eye = i === 0 ? this.leftEye : this.rightEye;

            const newX = Phaser.Math.Linear(
                eye.image.x,
                eye.targetX,
                this.Smoothing
            );
            const newY = Phaser.Math.Linear(
                eye.image.y,
                eye.targetY,
                this.Smoothing
            );

            eye.image.setPosition(newX, newY);
        }
    }

    private updateTarget(object: any) {
        const local = new Phaser.Math.Vector2();
        this.getWorldTransformMatrix().applyInverse(object.x, object.y, local);
        const { x, y } = local;

        for (let i = 0; i < 2; i++) {
            const eye = i === 0 ? this.leftEye : this.rightEye;
            const { initialPosX: initialX, initialPosY: initialY } = eye;

            const dx = x - initialX;
            const dy = y - initialY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.maxDistance) {
                eye.targetX = x;
                eye.targetY = y;
            } else {
                const angle = Math.atan2(dy, dx);
                eye.targetX = initialX + Math.cos(angle) * this.maxDistance;
                eye.targetY = initialY + Math.sin(angle) * this.maxDistance;
            }
        }
    }

    resetTarget(): void {
        for (let i = 0; i < 2; i++) {
            const eye = i === 0 ? this.leftEye : this.rightEye;
            eye.targetX = eye.initialPosX;
            eye.targetY = eye.initialPosY;
        }
    }

    setTarget(object: any) {
        this.ObjectsInTarget = object;
    }

    deleteTarget() {
        this.ObjectsInTarget = undefined;
    }

    Sleep(boolean: boolean) {
        this.SleepAnim = boolean;

        if (this.SleepAnim) {
            this.Character.setVisible(false);
            this.leftEye.image.setVisible(false);
            this.rightEye.image.setVisible(false);
            this.CharWithEyes.setVisible(true);
            this.CharWithEyes.setFrame(19);

            this.SleepAnim = true;

            this.CharWithEyes.play("SleepStart", true);

            this.CharWithEyes.once("animationcomplete-SleepStart", () => {
                if (!this.SleepAnim) return;
                this.CharWithEyes.play("SleepLoop");
            });
        } else {
            this.CharWithEyes.play("SleepEnd", true);
        }
    }

    Talking(state: boolean) {
        this.talkingAnim = state;

        if (this.talkingAnim) {
            this.Character.play(
                {
                    key: "MouthOpen2",
                },
                true
            );
        }
    }
}
