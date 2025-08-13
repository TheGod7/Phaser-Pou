import Phaser from "phaser";
import { ImgButton } from "../ImageButton";
import { MainMenu } from "../../../scenes/Game/MainMenu";
import { KitchenMiddleSpace } from "./KitchenMIddleSpace";
import { GameManager } from "../../../scenes/Game/GameManager";
import { FoodTypes } from "../../../PouState";

export class kitchenMenu extends Phaser.GameObjects.Container {
    name: string = "KitchenBottomMenu";

    private GameManagerScene: GameManager;
    private currentFood: FoodTypes;
    private middleSpace: KitchenMiddleSpace;
    private NoFood: boolean = false;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, scene.scale.height);
        scene.add.existing(this);

        const GameManager = scene.scene.get("GameManager") as GameManager;
        this.GameManagerScene = GameManager;

        const Inventory = GameManager.GetFoodInventory();

        const InventoryKeys = Object.keys(Inventory);

        const MainMenu = scene.scene.get("MainMenu") as MainMenu;

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

        const fridgeButton = new ImgButton(
            scene,
            () => {
                MainMenu.OpenMenu("Fridge");
            },
            "fridge",
            0,
            0,
            65
        );
        fridgeButton.setScale(fridgeButton.scale);
        fridgeButton.setDepth(3);

        const shopButton = new ImgButton(
            scene,
            () => {
                MainMenu.OpenMenu("Shop");
            },
            "shop",
            0,
            0,
            65
        );
        shopButton.setScale(fridgeButton.scale);
        shopButton.setDepth(3);

        const MiddleSpace = new KitchenMiddleSpace(
            scene,
            "pulpo",
            () => {
                const Inventory = GameManager.GetFoodInventory();

                const InventoryArray = Object.entries(Inventory);
                const FoodIndex =
                    InventoryArray.findIndex(
                        ([key]) => key === this.currentFood
                    ) ?? 0;
                let newIndex = FoodIndex - 1;

                if (newIndex < 0) {
                    newIndex = InventoryArray.length - 1;
                }

                const [FoodName, FoodNumber] = InventoryArray[newIndex];

                this.currentFood = FoodName as FoodTypes;
                MiddleSpace.SetTexture(FoodName);

                if (FoodNumber > 1) {
                    MiddleSpace.SetValue("x" + FoodNumber.toString());
                } else {
                    MiddleSpace.SetValue("");
                }
            },
            () => {
                const Inventory = GameManager.GetFoodInventory();

                const InventoryArray = Object.entries(Inventory);
                const FoodIndex =
                    InventoryArray.findIndex(
                        ([key]) => key === this.currentFood
                    ) ?? 0;
                let newIndex = FoodIndex + 1;

                if (newIndex >= InventoryArray.length) {
                    newIndex = 0;
                }

                const [FoodName, FoodNumber] = InventoryArray[newIndex];

                this.currentFood = FoodName as FoodTypes;
                MiddleSpace.SetTexture(FoodName);

                if (FoodNumber > 1) {
                    MiddleSpace.SetValue("x" + FoodNumber.toString());
                } else {
                    MiddleSpace.SetValue("");
                }
            },
            () => {
                GameManager.EatFood(this.currentFood);

                const Inventory = GameManager.GetFoodInventory();

                const InventoryArray = Object.entries(Inventory);
                const currentFoodIndex = InventoryArray.findIndex(
                    ([key]) => key === this.currentFood
                );

                let newIndex = currentFoodIndex;

                if (currentFoodIndex < 0) {
                    if (InventoryArray.length > 0) {
                        newIndex = 0;
                    }
                }

                if (InventoryArray.length > 0) {
                    const [FoodName, FoodNumber] = InventoryArray[newIndex];

                    this.currentFood = FoodName as FoodTypes;
                    MiddleSpace.SetTexture(FoodName);
                    MiddleSpace.ShowArrows(InventoryArray.length > 1);

                    if (FoodNumber > 1) {
                        MiddleSpace.SetValue("x" + FoodNumber.toString());
                    } else {
                        MiddleSpace.SetValue("");
                    }
                } else {
                    MiddleSpace.setVisible(false);
                    this.NoFood = true;
                }
            }
        ).setDepth(4);

        this.middleSpace = MiddleSpace;

        if (InventoryKeys.length > 0) {
            const [FoodName, FoodNumber] = Object.entries(Inventory)[0];

            this.currentFood = FoodName as FoodTypes;
            MiddleSpace.SetTexture(FoodName);
            if (FoodNumber > 1) {
                MiddleSpace.SetValue("x" + FoodNumber.toString());
            } else {
                MiddleSpace.SetValue("");
            }

            if (InventoryKeys.length > 1) {
                MiddleSpace.ShowArrows(true);
            }
        } else {
            MiddleSpace.setVisible(false);

            this.NoFood = true;
        }

        MenuSizer.addBackground(background, { top: 70 });

        MenuSizer.addSpace();
        MenuSizer.add(fridgeButton);
        MenuSizer.addSpace(3);
        MenuSizer.add(MiddleSpace);
        MenuSizer.addSpace(3);
        MenuSizer.add(shopButton);
        MenuSizer.addSpace();

        MenuSizer.setOrigin(0, 1);
        MenuSizer.layout();

        this.add(MenuSizer);
    }

    SetCurrentFood(Food: FoodTypes) {
        this.currentFood = Food;

        const Inventory = this.GameManagerScene.GetFoodInventory();
        const InventoryArray = Object.entries(Inventory);
        const FoodIndex = InventoryArray.findIndex(
            ([key]) => key === this.currentFood
        );

        const [FoodName, FoodNumber] = InventoryArray[FoodIndex];

        this.middleSpace.SetTexture(FoodName);

        if (FoodNumber > 1) {
            this.middleSpace.SetValue("x" + FoodNumber.toString());
        } else {
            this.middleSpace.SetValue("");
        }

        return;
    }

    UpdateFood(Food: FoodTypes) {
        if (this.currentFood === Food) {
            const Inventory = this.GameManagerScene.GetFoodInventory();

            const InventoryArray = Object.entries(Inventory);
            const FoodIndex = InventoryArray.findIndex(
                ([key]) => key === this.currentFood
            );

            const [FoodName, FoodNumber] = InventoryArray[FoodIndex];

            this.currentFood = FoodName as FoodTypes;
            this.middleSpace.SetTexture(FoodName);

            if (FoodNumber > 1) {
                this.middleSpace.SetValue("x" + FoodNumber.toString());
            } else {
                this.middleSpace.SetValue("");
            }
        }

        if (this.NoFood) {
            const Inventory = this.GameManagerScene.GetFoodInventory();
            this.middleSpace.setVisible(true);

            const InventoryArray = Object.entries(Inventory);

            if (InventoryArray.length == 0) return;

            const newIndex = 0;

            const [FoodName, FoodNumber] = InventoryArray[newIndex];

            this.currentFood = FoodName as FoodTypes;
            this.middleSpace.SetTexture(FoodName);

            if (FoodNumber > 1) {
                this.middleSpace.SetValue("x" + FoodNumber.toString());
            } else {
                this.middleSpace.SetValue("");
            }

            this.currentFood = FoodName as FoodTypes;

            this.middleSpace.ShowArrows(InventoryArray.length > 1);
            this.NoFood = false;
        } else {
            const Inventory = this.GameManagerScene.GetFoodInventory();

            const InventoryArray = Object.entries(Inventory);

            this.middleSpace.ShowArrows(InventoryArray.length > 1);
        }
        return;
    }
}
