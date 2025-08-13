import Phaser from "phaser";
import FoodDrop from "../../../scenes/MiniGame/FoodDrop";
import { FoodsStats, FoodTypes } from "../../../PouState";
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

export class FoodDropCharacter extends Phaser.GameObjects.Container {
    public Character: Phaser.GameObjects.Sprite;
    public CharWithEyes: Phaser.GameObjects.Sprite;
    private maxDistance = 4;
    private Smoothing = 0.1;
    private ObjectsInTarget: Set<Phaser.GameObjects.Sprite> = new Set();

    private MouthOpen: boolean = false;

    leftEye: Eyes;
    rightEye: Eyes;

    constructor(
        scene: FoodDrop,
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
            .sprite(0, 0, "CharacterWithoutEyes", 0)
            .setOrigin(0.5, 1)
            .setDisplaySize(width, height)
            .setVisible(false);

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

        const Mouth = scene.add
            .rectangle(0, -110, 50, 30, 0x000000, 0)
            .setDepth(3);

        scene.physics.add.existing(Mouth);

        if (Mouth.body) {
            (Mouth.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
            (Mouth.body as Phaser.Physics.Arcade.Body).setImmovable(true);
        }

        this.CharWithEyes.on("animationcomplete", () => {
            this.CharWithEyes.setVisible(false);
            this.Character.setVisible(true);
            this.leftEye.image.setVisible(true);
            this.rightEye.image.setVisible(true);

            this.Character.play("MouthClose");
            this.MouthOpen = false;
        });

        scene.physics.add.collider(
            scene.Group["Foods"],
            Mouth,
            (objA, objB: any) => {
                const Food: FoodTypes | "coin" = objB.getData("Food");

                objB.destroy();

                this.Character.setVisible(false);
                this.leftEye.image.setVisible(false);
                this.rightEye.image.setVisible(false);

                this.CharWithEyes.setVisible(true);

                if (Food === "coin") {
                    soundManager.play(scene, "EatSound", undefined);
                    this.CharWithEyes.play("eat", true);
                    this.CharWithEyes.chain("eat2");

                    scene.addCoin();
                    return;
                }

                if (FoodsStats[Food] && FoodsStats[Food].hunger < 0) {
                    soundManager.play(scene, "NoSound", undefined);
                    this.CharWithEyes.play("NoEat", true);
                    this.CharWithEyes.chain("NoEat2");
                    scene.LostHearth();
                } else {
                    soundManager.play(scene, "EatSound", undefined);
                    this.CharWithEyes.play("eat", true);
                    this.CharWithEyes.chain("eat2");
                    scene.addScore();
                }
            }
        );

        this.add([this.Character, LeftEye, RightEye, this.CharWithEyes, Mouth]);
    }

    update(): void {
        this.removeOldTarget();
        this.EyesAndMouthUpdate();

        if (this.ObjectsInTarget.size > 0) {
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

    private resetTarget(): void {
        for (let i = 0; i < 2; i++) {
            const eye = i === 0 ? this.leftEye : this.rightEye;
            eye.targetX = eye.initialPosX;
            eye.targetY = eye.initialPosY;
        }
    }

    setTarget(object: any) {
        this.ObjectsInTarget.add(object);
    }

    async removeOldTarget() {
        if (this.ObjectsInTarget.size > 0) {
            const toDelete = [];

            for (const object of this.ObjectsInTarget) {
                if (!this.scene.children.exists(object)) {
                    toDelete.push(object);
                }
            }

            for (const object of toDelete) {
                this.ObjectsInTarget.delete(object);
            }
        }
    }

    getClosestTarget(Distance: number) {
        if (this.ObjectsInTarget.size === 0) return null;

        let closest = null;
        let minDistance = Distance;

        for (const object of this.ObjectsInTarget) {
            const worldX = object.x;
            const worldY = object.y;

            const distance = Phaser.Math.Distance.Between(
                this.x,
                this.y,
                worldX,
                worldY
            );

            if (distance < minDistance) {
                minDistance = distance;
                closest = object;
            }
        }

        return closest;
    }

    EyesAndMouthUpdate() {
        const FoodClosest = this.getClosestTarget(400);
        const AllClosest = this.getClosestTarget(Infinity);

        if (AllClosest) {
            this.updateTarget(AllClosest);
        }

        if (FoodClosest) {
            if (!this.MouthOpen) {
                this.Character.play("MouthOpen");
                this.MouthOpen = true;
            }
        } else {
            if (this.MouthOpen) {
                this.Character.play("MouthClose");
                this.MouthOpen = false;
            }
        }
    }
}
