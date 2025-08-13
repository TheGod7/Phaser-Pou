import { SpawnFoodZone } from "../../components/minigames/FoodSpawner";
import { GameStats } from "../../components/minigames/GameStats";
import { FoodDropCharacter } from "../../components/ui/character/FoodDropCharacter";
import { soundManager } from "../../components/ui/utils/sound";
import { GameManager } from "../Game/GameManager";
import { MainMenu } from "../Game/MainMenu";

export default class FoodDrop extends Phaser.Scene {
    char: FoodDropCharacter;
    spawnZone: SpawnFoodZone;
    GameStats: GameStats;

    coins: number = 0;
    hearts: number = 3;
    score: number = 0;

    Group: {
        [key: string]: Phaser.Physics.Arcade.Group;
    };
    constructor() {
        super("FoodDrop");
    }

    create() {
        this.score = 0;
        this.hearts = 3;
        this.coins = 0;

        const MainMenu = this.scene.get("MainMenu") as MainMenu;
        const GameManager = this.scene.get("GameManager") as GameManager;

        const BackgroundSound = soundManager.playBackground(this, "GameOst");

        GameManager.SetInGame(true);

        MainMenu.StatusBar.EnablePause(true);

        const background = this.add
            .image(0, 0, "FoodDropBackground")
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height)
            .setToBack();

        background.setInteractive();
        this.input.setDraggable(background);

        this.GameStats = new GameStats(this, 3);
        this.GameStats.SetHearths(this.hearts);
        this.GameStats.SetScore(this.score);
        this.GameStats.AddMoney(this.coins);

        this.Group = {};
        this.Group["Foods"] = this.physics.add.group();

        this.char = new FoodDropCharacter(
            this,
            200,
            200,
            this.scale.width / 2,
            this.scale.height
        );

        this.spawnZone = new SpawnFoodZone(this);

        this.input.on("dragstart", (pointer: Phaser.Input.Pointer) => {
            this.char.setPosition(pointer.x, this.scale.height);
        });

        this.input.on("drag", (pointer: Phaser.Input.Pointer) => {
            this.char.setPosition(pointer.x, this.scale.height);
        });

        this.events.on("shutdown", () => {
            const MainMenu = this.scene.get("MainMenu") as MainMenu;
            MainMenu.StatusBar.EnablePause(false);
            GameManager.SetInGame(false);

            this.sound.stopAll();
            this.input.removeAllListeners();
        });

        this.events.on("pause", () => {
            BackgroundSound.pause();

            this.sound.getAllPlaying().forEach((sound) => {
                if (sound.key !== "ButtonClick") sound.pause();
            });
        });

        this.events.on("resume", () => {
            this.sound.resumeAll();
        });
    }

    update(time: number, delta: number): void {
        this.char.update();
        this.spawnZone.update(time, delta, this);
    }

    addCoin() {
        this.coins++;
        this.score += 5;
        this.GameStats.AddMoney(this.coins);

        this.increaseDifficulty();

        this.GameStats.SetScore(this.score);
    }

    addScore() {
        this.score += 1;

        this.increaseDifficulty();

        this.GameStats.SetScore(this.score);
    }

    LostHearth() {
        this.hearts--;

        this.GameStats.SetHearths(this.hearts);

        if (this.hearts <= 0) {
        }
    }

    increaseDifficulty() {
        const step = Math.floor(this.score / 20);

        const rawGravity = 300 + Math.pow(step + 1, 1.8);
        const rawTime = 1200 * Math.pow(0.975, step);

        const gravity = Math.min(rawGravity, 1500);
        const time = Math.max(rawTime, 200);

        this.spawnZone.setFallTime(gravity);
        this.spawnZone.setTime(time);
    }
}
