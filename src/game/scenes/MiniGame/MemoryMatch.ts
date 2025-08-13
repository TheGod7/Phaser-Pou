import GridSizer from "phaser3-rex-plugins/templates/ui/gridsizer/GridSizer";
import { GameStats } from "../../components/minigames/GameStats";
import { MemoryMatchCard } from "../../components/minigames/MemoryMatchCard";
import { soundManager } from "../../components/ui/utils/sound";
import { Foods } from "../../PouState";
import { GameManager } from "../Game/GameManager";
import { MainMenu } from "../Game/MainMenu";
import RoundRectangleProgress from "phaser3-rex-plugins/plugins/roundrectangleprogress";

export default class MemoryMatch extends Phaser.Scene {
    coins: number;
    score: number;

    GameStats: GameStats;

    private CurrentCard?: MemoryMatchCard;
    private CurrentPairs: number;
    private Pairs: number;

    private MemoryGame: GridSizer;

    CurrentTime: number;
    TimeToPlay: number;

    ProgressBar: RoundRectangleProgress;

    private inDelay: boolean;

    constructor() {
        super("MemoryMatch");
    }

    create() {
        this.coins = 0;
        this.score = 0;

        this.CurrentPairs = 0;
        this.Pairs = 6;
        this.TimeToPlay = 14000;
        this.CurrentTime = 0;

        const MainMenu = this.scene.get("MainMenu") as MainMenu;
        const GameManager = this.scene.get("GameManager") as GameManager;
        this.add
            .rectangle(
                0,
                0,
                this.scale.width,
                this.scale.height,
                0xffffffff,
                0.5
            )
            .setOrigin(0, 0)
            .setDepth(0);

        const BackgroundSound = soundManager.playBackground(this, "GameOst2");

        const GameStatus = new GameStats(this);

        this.GameStats = GameStatus;

        GameManager.SetInGame(true);
        MainMenu.StatusBar.EnablePause(true);

        this.ProgressBar = this.add
            .rexRoundRectangleProgress({
                width: this.scale.width,
                height: 300,
                x: 0,
                y: 140,
                barColor: 0x53ff4b,
                trackColor: 0x000000,

                valuechangeCallback: function (
                    _newValue,
                    _oldValue,
                    _roundRectangleProgress
                ) {},
            })
            .setOrigin(0)
            .setValue(1);

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

        this.MemoryGame = this.HorizontalRectangle();
    }

    HorizontalRectangle() {
        const FoodArrayPairs = Foods.sort(() => 0.5 - Math.random()).slice(
            0,
            6
        );

        const ShuffleCards = ShuffleAndDuplicate(FoodArrayPairs);

        const VerticalRectangle = this.rexUI.add.gridSizer({
            width: this.scale.width,
            height: 154,
            column: 6,
            row: 2,
            x: this.scale.width / 2,
            y: this.scale.height / 2 + 200,
        });

        const CardsItem: MemoryMatchCard[] = [];

        this.inDelay = true;

        ShuffleCards.forEach((food, _) => {
            const Card = new MemoryMatchCard(this, 0, 0, 77, food, () => {
                if (this.inDelay) return;
                if (Card.isFlipping) return;
                if (Card.getData("InPair")) return;

                Card.flip();

                this.inDelay = true;

                if (!Card.isFront || Card === this.CurrentCard) {
                    this.CurrentCard = undefined;
                    this.inDelay = false;
                    return;
                }

                if (!this.CurrentCard) {
                    this.CurrentCard = Card;
                    this.inDelay = false;
                    return;
                }

                if (this.CurrentCard.getData("Food") === Card.getData("Food")) {
                    this.CurrentPairs++;

                    this.CurrentCard.setData("InPair", true);
                    Card.setData("InPair", true);

                    this.CurrentCard = undefined;

                    this.CurrentTime = Math.max(
                        0,
                        this.CurrentTime - this.TimeToPlay / 6
                    );
                    this.addScore();

                    if (this.Pairs == this.CurrentPairs) {
                        this.CurrentPairs = 0;
                        this.Pairs = 6;
                        // this.TimeToPlay = 14000;
                        this.CurrentTime = 0;

                        this.tweens.killTweensOf(
                            this.MemoryGame.getAllChildren()
                        );
                        this.MemoryGame.destroy();

                        this.MemoryGame = this.verticalRectangle();

                        this.addCoin();
                        this.ProgressBar.setValue(1);

                        return;
                    }
                    this.inDelay = false;
                    return;
                } else {
                    const otherCard = this.CurrentCard;
                    this.CurrentCard = undefined;

                    this.time.delayedCall(1000, () => {
                        Card.flip();
                        otherCard.flip();
                        this.inDelay = false;
                    });
                }
            });

            Card.setData("Food", food);
            Card.setData("InPair", false);
            CardsItem.push(Card);
            VerticalRectangle.add(Card);
        });

        const ShuffleCardsItem = ShuffleAndDuplicate(CardsItem);

        ShuffleCardsItem.forEach((Card, index) => {
            const delay = 50 * index;
            const waitTime = 1000;
            this.time.delayedCall(delay, () => {
                Card.flip();
                this.time.delayedCall(waitTime, () => {
                    Card.flip();
                });
            });

            this.time.delayedCall(delay + waitTime + 500, () => {
                if (Card.isFront) {
                    Card.flip();
                }

                if (index == ShuffleCardsItem.length - 1) {
                    this.inDelay = false;
                }
            });
        });

        VerticalRectangle.setOrigin(0.5);
        VerticalRectangle.layout();

        return VerticalRectangle;
    }

    verticalRectangle() {
        const FoodArrayPairs = Foods.sort(() => 0.5 - Math.random()).slice(
            0,
            6
        );

        const ShuffleCards = ShuffleAndDuplicate(FoodArrayPairs);

        const VerticalRectangle = this.rexUI.add.gridSizer({
            height: this.scale.width,
            width: 154,
            row: 6,
            column: 2,
            x: this.scale.width / 2,
            y: this.scale.height / 2 + 200,
        });

        const CardsItem: MemoryMatchCard[] = [];

        this.inDelay = true;

        ShuffleCards.forEach((food, _) => {
            const Card = new MemoryMatchCard(this, 0, 0, 77, food, () => {
                if (this.inDelay) return;
                if (Card.isFlipping) return;
                if (Card.getData("InPair")) return;

                Card.flip();

                this.inDelay = true;

                if (!Card.isFront || Card === this.CurrentCard) {
                    this.CurrentCard = undefined;
                    this.inDelay = false;
                    return;
                }

                if (!this.CurrentCard) {
                    this.CurrentCard = Card;
                    this.inDelay = false;
                    return;
                }

                if (this.CurrentCard.getData("Food") === Card.getData("Food")) {
                    this.CurrentPairs++;

                    this.CurrentCard.setData("InPair", true);
                    Card.setData("InPair", true);

                    this.CurrentCard = undefined;

                    this.CurrentTime = Math.max(
                        0,
                        this.CurrentTime - this.TimeToPlay / 6
                    );
                    this.addScore();

                    if (this.Pairs == this.CurrentPairs) {
                        this.CurrentPairs = 0;
                        this.Pairs = 6;

                        this.CurrentTime = 0;

                        this.tweens.killTweensOf(
                            this.MemoryGame.getAllChildren()
                        );
                        this.MemoryGame.destroy();

                        this.MemoryGame = this.HorizontalRectangle();

                        this.addCoin();
                        this.ProgressBar.setValue(1);
                        return;
                    }
                    this.inDelay = false;
                    return;
                } else {
                    const otherCard = this.CurrentCard;
                    this.CurrentCard = undefined;

                    this.time.delayedCall(1000, () => {
                        Card.flip();
                        otherCard.flip();
                        this.inDelay = false;
                    });
                }
            });

            Card.setData("Food", food);
            Card.setData("InPair", false);
            CardsItem.push(Card);
            VerticalRectangle.add(Card);
        });

        const ShuffleCardsItem = ShuffleAndDuplicate(CardsItem);

        ShuffleCardsItem.forEach((Card, index) => {
            const delay = 50 * index;
            const waitTime = 1000;
            this.time.delayedCall(delay, () => {
                Card.flip();
                this.time.delayedCall(waitTime, () => {
                    Card.flip();
                });
            });

            this.time.delayedCall(delay + waitTime + 500, () => {
                if (Card.isFront) {
                    Card.flip();
                }

                if (index == ShuffleCardsItem.length - 1) {
                    this.inDelay = false;
                }
            });
        });

        VerticalRectangle.setOrigin(0.5);
        VerticalRectangle.layout();

        return VerticalRectangle;
    }

    addScore() {
        this.score++;

        this.GameStats.SetScore(this.score);
    }

    addCoin() {
        this.coins++;
        this.score += 5;
        this.GameStats.AddMoney(this.coins);

        this.GameStats.SetScore(this.score);

        this.TimeToPlay = Math.max(5000, this.TimeToPlay - 500);
    }

    update(_: number, delta: number): void {
        if (this.inDelay) return;
        this.CurrentTime += delta;

        if (this.CurrentTime >= this.TimeToPlay) {
            this.inDelay = true;
        } else {
            this.ProgressBar.setValue(1 - this.CurrentTime / this.TimeToPlay);
        }
    }
}

function ShuffleAndDuplicate<T>(array: T[]): T[] {
    const newArray = [...array, ...array];

    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
}
