import { GameStats } from "../../components/minigames/GameStats";
import { soundManager } from "../../components/ui/utils/sound";
import { GameManager } from "../Game/GameManager";
import { MainMenu } from "../Game/MainMenu";
// 52x320
export default class FlappyBird extends Phaser.Scene {
    PipeGroup: Phaser.Physics.Arcade.Group;
    Pipes: Phaser.Physics.Arcade.Sprite[][] = [];

    CoinsGroup: Phaser.Physics.Arcade.Group;
    ScoreGroup: Phaser.Physics.Arcade.Group;

    SpaceBTWeenPipes: number;
    Gap: number;

    PipesVelocityX: number;
    LastTopY: number;

    coins: number;
    score: number;

    constructor() {
        super("FlappyBird");
    }

    create() {
        this.Pipes = [];

        this.SpaceBTWeenPipes = 300;
        this.Gap = 150;

        this.PipesVelocityX = 100;
        this.LastTopY = this.scale.height / 2;

        this.coins = 0;
        this.score = 0;

        const MainMenu = this.scene.get("MainMenu") as MainMenu;
        const GameManager = this.scene.get("GameManager") as GameManager;

        const BackgroundSound = soundManager.playBackground(this, "GameOst");

        const Background = this.add.image(0, 0, "FlappyBirdBackground");
        // Background.setDisplaySize(this.scale.width, this.scale.height);
        Background.setOrigin(0, 0);
        Background.setDepth(0);

        const Char = this.physics.add
            .sprite(10, this.scale.height / 2, "SwimmingCharacter")
            .setDisplaySize(100, 100)
            .setOrigin(0, 0.5)
            .setDepth(3);

        const GameStatus = new GameStats(this);

        GameStatus.setDepth(5);
        Char.body.setSize(300, 150);
        this.input.on("pointerdown", () => {
            Char.setVelocityY(-200);
        });

        GameManager.SetInGame(true);
        MainMenu.StatusBar.EnablePause(true);

        Char.play("Swim");

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

        this.PipeGroup = this.physics.add.group({
            velocityX: -this.PipesVelocityX,
            allowGravity: false,
            immovable: true,
        });

        this.ScoreGroup = this.physics.add.group({
            velocityX: -this.PipesVelocityX,
            allowGravity: false,
            immovable: true,
        });

        this.CoinsGroup = this.physics.add.group({
            velocityX: -this.PipesVelocityX,
            allowGravity: false,
            immovable: true,
        });

        const Ground = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height,
            this.scale.width,
            20,
            0x000000
        );

        this.physics.add.existing(Ground, true);

        this.physics.add.overlap(Char, this.CoinsGroup, (_, objB) => {
            objB.destroy();

            this.coins++;
            this.score++;

            GameStatus.AddMoney(this.coins);
            soundManager.play(this, "CoinPicked");

            this.increaseDifficulty();
        });

        this.physics.add.overlap(Char, this.ScoreGroup, (_, objB) => {
            objB.destroy();

            this.score++;

            GameStatus.SetScore(this.score);
            soundManager.play(this, "PipeScore");

            this.increaseDifficulty();
        });

        this.physics.add.collider(Char, Ground, () => {
            this.physics.pause();
        });

        this.physics.add.collider(Char, this.PipeGroup, () => {
            this.physics.pause();
        });

        this.InitPipes();
    }

    InitPipes() {
        const X = 300;

        for (let i = 0; i < 5; i++) {
            this.CreatePipe(X + i * this.SpaceBTWeenPipes);
        }
    }

    update() {
        if (this.Pipes.length === 0) return;

        const firstPipePieces = this.Pipes[0];
        const firstPiece = firstPipePieces[0];

        if (firstPiece.x + firstPiece.displayWidth < 0) {
            firstPipePieces.forEach((pipe) => pipe.destroy());
            this.Pipes.shift();

            const lastPipePieces = this.Pipes[this.Pipes.length - 1];
            const lastPiece = lastPipePieces[0];
            const newX = lastPiece.x + this.SpaceBTWeenPipes;

            this.CreatePipe(newX);
        }
    }

    CreatePipe(X: number) {
        const margin = 600;
        const MaxTopY = this.scale.height - this.Gap - margin;
        const MinTopY = margin;

        const changeLimit = Phaser.Math.Between(50, 400);

        let newTopY = Phaser.Math.Between(
            Math.max(MinTopY, this.LastTopY - changeLimit),
            Math.min(MaxTopY, this.LastTopY + changeLimit)
        );

        this.LastTopY = newTopY;

        const TopY = newTopY - 33;

        const BottomY = TopY + this.Gap + 33;

        const AllPipesPieces = [];

        const CoinChance = Phaser.Math.Between(0, 100);
        //Spawning Top SquarePipe
        for (let i = 0; i < 30; i++) {
            const PipeY = i == 0 ? TopY : TopY - 33 * i;

            if (PipeY < -50) break;
            const SquarePipe = this.physics.add
                .sprite(0, 0, i == 0 ? "PipeHead" : "PipeBody")
                .setDisplaySize(33, 33)
                .setFlipY(true)
                .setDepth(4);
            SquarePipe.setOrigin(0, 0);
            SquarePipe.setPosition(X, PipeY);
            SquarePipe.setImmovable(true);
            SquarePipe.body.allowGravity = false;

            AllPipesPieces.push(SquarePipe);
        }

        // Spawning Bottom SquarePipe
        for (let i = 0; i < 30; i++) {
            const PipeY = i === 0 ? BottomY : BottomY + 33 * i;

            if (PipeY > this.scale.height + 50) break;
            const SquarePipe = this.physics.add
                .sprite(0, 0, i == 0 ? "PipeHead" : "PipeBody")
                .setDisplaySize(33, 33)
                .setDepth(4);

            SquarePipe.setOrigin(0, 0);
            SquarePipe.setPosition(X, PipeY);
            SquarePipe.setImmovable(true);
            SquarePipe.body.allowGravity = false;

            AllPipesPieces.push(SquarePipe);
        }

        if (CoinChance <= 30) {
            const coinX = X + 33 / 2;
            const coinY = TopY + this.Gap / 2 + 33;

            const Coin = this.physics.add
                .sprite(coinX, coinY, "coin")
                .setDisplaySize(33, 33)
                .setOrigin(0.5)
                .setDepth(4);

            this.CoinsGroup.add(Coin);
        }

        const ScoreCollider = this.add
            .rectangle(X + 33, TopY + 33, 10, this.Gap, 0x000000, 0)
            .setOrigin(0, 0);

        this.physics.add.existing(ScoreCollider);
        this.ScoreGroup.add(ScoreCollider);

        AllPipesPieces.forEach((Pipe) => {
            this.PipeGroup.add(Pipe);
        });

        this.Pipes.push(AllPipesPieces);
    }

    increaseDifficulty() {
        if (this.PipesVelocityX < 400) {
            this.PipesVelocityX += 2;
            this.PipeGroup.setVelocityX(-this.PipesVelocityX);
            this.ScoreGroup.setVelocityX(-this.PipesVelocityX);
            this.CoinsGroup.setVelocityX(-this.PipesVelocityX);
        }

        if (this.Gap > 70) {
            this.Gap -= 2;
        }
    }
}
