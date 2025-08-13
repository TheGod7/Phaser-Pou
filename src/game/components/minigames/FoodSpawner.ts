import { FoodsStats, FoodTypes } from "../../PouState";
import FoodDrop from "../../scenes/MiniGame/FoodDrop";
import { soundManager } from "../ui/utils/sound";

const Foods = [
    "pulpo",
    "red_de_pesca",
    "cangrejo",
    "cangrejo_negro",
    "camaron",
    "pescado",
    "plastico",
    "langosta",
    "serpiente",
    "pulpo",
    "red_de_pesca",
    "cangrejo",
    "cangrejo_negro",
    "camaron",
    "pescado",
    "plastico",
    "langosta",
    "serpiente",
    "pulpo",
    "red_de_pesca",
    "cangrejo",
    "cangrejo_negro",
    "camaron",
    "pescado",
    "plastico",
    "langosta",
    "serpiente",
    "pulpo",
    "red_de_pesca",
    "cangrejo",
    "cangrejo_negro",
    "camaron",
    "pescado",
    "plastico",
    "langosta",
    "serpiente",
    "coin",
];
const debug = true;

export class SpawnFoodZone extends Phaser.GameObjects.Container {
    private SpawnerZone: Phaser.GameObjects.Rectangle;
    timeBetweenSpawns: number = 1000;
    private currentTime: number = 0;
    FallGravity: number = 300;
    constructor(scene: FoodDrop) {
        super(scene, 0, 0);

        this.SpawnerZone = scene.add.rectangle(
            scene.scale.width / 2,
            0,
            scene.scale.width - 100,
            10,
            0xff0000,
            debug ? 0.5 : 0
        );

        this.SpawnerZone.setOrigin(0.5, 0);

        const deathCollider = scene.add
            .rectangle(0, scene.scale.height - 10, scene.scale.width, 10)
            .setOrigin(0, 0);

        deathCollider.name = "deathCollider";

        scene.physics.add.existing(deathCollider, true);

        scene.physics.add.collider(
            scene.Group["Foods"],
            deathCollider,
            (_, ObjB: any) => {
                const Food: FoodTypes | "Coin" = ObjB.getData("Food");

                ObjB.destroy();

                if (Food === "Coin") {
                    return;
                }

                if (FoodsStats[Food] && FoodsStats[Food].hunger > 0) {
                    scene.LostHearth();
                    soundManager.play(scene, "Fail");
                }
            }
        );
    }

    public setTime(time: number) {
        this.timeBetweenSpawns = time;
    }

    public setFallTime(gravity: number) {
        this.FallGravity = gravity;
    }

    update(_: number, delta: number, scene: FoodDrop) {
        this.currentTime += delta;

        if (scene.Group["Foods"].getLength() >= 20) return;

        if (this.currentTime > this.timeBetweenSpawns) {
            this.currentTime = 0;

            const x = this.scene.scale.width / 2;
            const width = this.scene.scale.width - 100;
            const size = 60;

            const randomX = Phaser.Math.Between(
                x - width / 2 + size / 2,
                x + width / 2 - size / 2
            );

            const Food = Foods[Math.floor(Math.random() * Foods.length)];
            const FoodSprite = this.scene.physics.add
                .sprite(randomX, 0, Food, 0)
                .setOrigin(0.5, 0.5)
                .setDisplaySize(size, size)
                .setVisible(true);

            FoodSprite.setData("Food", Food);

            scene.char.setTarget(FoodSprite);
            scene.Group["Foods"].add(FoodSprite);
            FoodSprite.setVelocityY(this.FallGravity);
            FoodSprite.body.setAllowGravity(false);
        }
    }
}
