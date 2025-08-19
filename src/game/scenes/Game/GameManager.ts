import { Scene } from "phaser";
import { FoodsStats, FoodTypes, PouStates } from "../../PouState";
import { MainMenu } from "./MainMenu";
import { BarTypes } from "../../components/ui/rooms/StatusBar";

export class GameManager extends Scene {
    HungerTimer: Phaser.Time.TimerEvent;
    EnergyTimer: Phaser.Time.TimerEvent;
    HealthTimer: Phaser.Time.TimerEvent;

    SleepTimer: Phaser.Time.TimerEvent;
    GamesTimer: Phaser.Time.TimerEvent;

    FoodInventory: Map<FoodTypes, number> = new Map();

    constructor() {
        super("GameManager");
    }

    create() {
        const MainMenu = this.scene.get("MainMenu") as MainMenu;

        this.HungerTimer = this.time.addEvent({
            delay: 15000,
            loop: true,
            callback: () => {
                PouStates.hunger = Math.max(PouStates.hunger - 10, 0);
                if (MainMenu.StatusBar) {
                    MainMenu.StatusBar.SetStatus("Hunger", PouStates.hunger);
                }
            },
        });

        this.EnergyTimer = this.time.addEvent({
            delay: 20000,
            loop: true,
            callback: () => {
                PouStates.energy = Math.max(PouStates.energy - 10, 0);
                if (MainMenu.StatusBar) {
                    MainMenu.StatusBar.SetStatus("Energy", PouStates.energy);
                }
            },
        });

        this.HealthTimer = this.time.addEvent({
            delay: 30000,
            loop: true,
            callback: () => {
                const decremento =
                    PouStates.hunger <= 20 || PouStates.energy <= 20 ? 20 : 10;
                PouStates.health = Math.max(PouStates.health - decremento, 0);

                if (MainMenu.StatusBar) {
                    MainMenu.StatusBar.SetStatus("Health", PouStates.health);
                }
            },
        });

        this.GamesTimer = this.time.addEvent({
            delay: 30000,
            loop: true,
            callback: () => {
                PouStates.health = Math.min(PouStates.health + 20, 100);
                PouStates.energy = Math.max(PouStates.energy - 10, 0);

                if (MainMenu.StatusBar) {
                    MainMenu.StatusBar.SetStatus("Health", PouStates.health);
                    MainMenu.StatusBar.SetStatus("Energy", PouStates.energy);
                }
            },
        });

        this.SleepTimer = this.time.addEvent({
            delay: 10000,
            loop: true,
            callback: () => {
                PouStates.energy = Math.min(PouStates.energy + 10, 100);

                if (MainMenu.StatusBar) {
                    MainMenu.StatusBar.SetStatus("Energy", PouStates.energy);
                }

                if (PouStates.energy >= 100) {
                    this.SleepTimer.paused = true;
                    this.HungerTimer.paused = false;
                    this.EnergyTimer.paused = false;
                }
            },
        });

        let lowStatsTime = 0;
        const deathThreshold = 40;

        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (
                    PouStates.hunger <= 0 &&
                    PouStates.health <= 0 &&
                    PouStates.energy <= 0
                ) {
                    lowStatsTime++;

                    if (lowStatsTime >= deathThreshold) {
                        this.scene.manager.scenes.forEach(
                            (scene: Phaser.Scene) => {
                                this.scene.stop(scene.scene.key);
                            }
                        );

                        this.scene.start("GameOver");
                    }
                } else {
                    lowStatsTime = 0;
                }
            },
        });

        this.SleepTimer.paused = true;
        this.GamesTimer.paused = true;

        if (MainMenu.StatusBar) {
            MainMenu.StatusBar.SetStatus("Hunger", PouStates.hunger);
            MainMenu.StatusBar.SetStatus("Energy", PouStates.energy);
            MainMenu.StatusBar.SetStatus("Health", PouStates.health);
            MainMenu.StatusBar.SetStatus("Coins", PouStates.money);
        }
    }

    setSleeping(value: boolean) {
        if (this.EnergyTimer) {
            this.EnergyTimer.paused = value;
        }

        if (this.SleepTimer) {
            this.SleepTimer.paused = !value;
        }
    }

    SetInGame(value: boolean) {
        if (this.EnergyTimer) {
            this.EnergyTimer.paused = value;
        }

        if (this.HungerTimer) {
            this.HungerTimer.paused = value;
        }

        if (this.HealthTimer) {
            this.HealthTimer.paused = value;
        }

        if (this.GamesTimer) {
            this.GamesTimer.paused = !value;
        }
    }

    AddCoins(value: number) {
        PouStates.money += value;

        if (this.scene.get("MainMenu")) {
            const MainMenu = this.scene.get("MainMenu") as MainMenu;
            MainMenu.StatusBar.coinLabel.drawMoney(PouStates.money);
        }
    }

    RemoveCoins(value: number) {
        PouStates.money -= value;

        if (this.scene.get("MainMenu")) {
            const MainMenu = this.scene.get("MainMenu") as MainMenu;
            MainMenu.StatusBar.coinLabel.drawMoney(PouStates.money);
        }
    }

    BuyFood(Food: FoodTypes) {
        const FoodStats = FoodsStats[Food];

        if (PouStates.money >= FoodStats.price) {
            this.RemoveCoins(FoodStats.price);

            const FoodNumber = this.FoodInventory.get(Food) ?? 0;

            this.FoodInventory.set(Food, FoodNumber + 1);
        }
    }

    GetFoodInventory() {
        return Object.fromEntries(this.FoodInventory);
    }

    EatFood(Food: FoodTypes) {
        const FoodStats = FoodsStats[Food];

        if (Food == "red_de_pesca") {
            this.scene.manager.scenes.forEach((scene: Phaser.Scene) => {
                this.scene.stop(scene.scene.key);
            });

            this.scene.start("GameOver");
            return;
        }

        if (this.FoodInventory.get(Food)) {
            const RemainingFood = this.FoodInventory.get(Food) ?? 0;

            if (PouStates.hunger >= 100) return;
            FoodStats.hunger += FoodsStats[Food].hunger;

            this.AddStatus("Hunger", FoodStats.hunger);

            if (RemainingFood > 1) {
                this.FoodInventory.set(Food, RemainingFood - 1);
            } else {
                this.FoodInventory.delete(Food);
            }
        }
    }

    AddStatus(stat: BarTypes, value: number) {
        const MainMenu = this.scene.get("MainMenu") as MainMenu;

        const key = stat.toLowerCase() as keyof typeof PouStates;

        PouStates[key] = Math.min(PouStates[key] + value, 100);

        MainMenu.StatusBar.SetStatus(stat, PouStates[key]);
    }
}
