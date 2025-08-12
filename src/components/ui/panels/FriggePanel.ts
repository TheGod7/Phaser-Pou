import Phaser from "phaser";
import { GameManager } from "../../../game/scenes/Game/GameManager";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import { ImgButton } from "../ImageButton";
import { MainMenu } from "../../../game/scenes/Game/MainMenu";
import GridSizer from "phaser3-rex-plugins/templates/ui/gridsizer/GridSizer";
import { Foods, FoodsStats, FoodTypes } from "../../../game/PouState";
import { ImgButtonLabel } from "../ImageButtonWithLabel";
import { RoomsManager } from "../../../game/scenes/Rooms/Rooms";
import { kitchenMenu } from "../rooms/KitchenBottomMenu";

export class FridgePanel extends Sizer {
    private Items: Map<FoodTypes, ImgButtonLabel> = new Map();
    private GameManagerScene: GameManager;
    private Hitbox: Phaser.GameObjects.Rectangle;
    private GridSizer: GridSizer;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 80, {
            width: scene.scale.width,
            height: scene.scale.height - 80,
            orientation: "vertical",
        });

        this.addBackground(
            scene.add.rectangle(0, 0, 0, 0, 0xffffff, 0.8).setInteractive()
        );

        this.GameManagerScene = scene.scene.get("GameManager") as GameManager;

        const Header = scene.rexUI.add.sizer({
            width: scene.scale.width,
            height: 50,
            space: {
                top: 30,
                bottom: 20,
            },
            orientation: "horizontal",
        });

        const HeaderText = scene.rexUI.add
            .label({
                width: 200,
                height: 50,
                text: scene.add
                    .text(0, 15, "Refri", {
                        stroke: "#000000",
                        strokeThickness: 8,
                        fontSize: "50px",
                        fontFamily: "Cookies",
                        align: "center",
                    })
                    .setDepth(3),
            })
            .layout();

        const CloseButton = new ImgButton(
            scene,
            () => {
                (this.scene as MainMenu).PanelManager.DeleteCurrentPanel();
            },
            "close",
            0,
            0,
            60,
            0
        ).setDepth(3);

        Header.addSpace(3);
        Header.add(HeaderText, { align: "center-top" });
        Header.addSpace();
        Header.add(CloseButton, { align: "center-top" });
        Header.addSpace();
        Header.setOrigin(0.5, 0);
        Header.setInteractive();
        Header.layout();

        this.GridSizer = scene.rexUI.add.gridSizer({
            width: scene.scale.width,
            height: scene.scale.height - 80,
            x: 0,
            y: 0,
            column: 5,
            row: 10,
            columnProportions: 1,
            rowProportions: 1,
            space: {
                column: 4,
                row: 4,
                left: 20,
                right: 20,
            },
        });

        for (let i = 0; i < Foods.length; i++) {
            const Food = Foods[i];

            const Item = new ImgButtonLabel(
                scene,
                () => {
                    (this.scene as MainMenu).PanelManager.DeleteCurrentPanel();

                    const RoomsScene = scene.scene.get("Rooms") as RoomsManager;

                    if (RoomsScene.scene.isActive()) {
                        const KitchenBottomMenu = RoomsScene.children.getByName(
                            "KitchenBottomMenu"
                        ) as kitchenMenu;

                        KitchenBottomMenu.SetCurrentFood(Food);
                    }
                },
                Food
            );

            Item.setVisible(false);
            this.GridSizer.add(Item);

            this.Items.set(Food, Item);
        }

        this.GridSizer.layout();

        this.add(Header);
        this.add(this.GridSizer);
        this.setOrigin(0, 0);
        this.layout();

        this.Hitbox = scene.add
            .rectangle(
                0,
                80,
                scene.scale.width,
                scene.scale.height - 80,
                0x000000,
                0
            )
            .setOrigin(0, 0)
            .setVisible(false)
            .setToBack();
        this.Hitbox.setInteractive();
    }

    Start() {
        this.Hitbox.setVisible(true);
        const Inventory = this.GameManagerScene.GetFoodInventory();
        
        for (const key in FoodsStats) {
            const Food = this.Items.get(key as FoodTypes);

            if (Food) {
                Food.setVisible(false);
            }
        }
        this.GridSizer.removeAll();
        for (const key in Inventory) {
            const Food = key as FoodTypes;
            const FoodNumber = Inventory[Food];

            const FoodItem = this.Items.get(Food);
            if (FoodNumber > 0 && FoodItem) {
                FoodItem.setDepth(10);
                FoodItem.SetValue("x" + FoodNumber);
                FoodItem.setVisible(true);

                this.GridSizer.add(FoodItem);
            }
        }

        this.GridSizer.layout();
        this.layout();
    }

    Stop() {
        this.Hitbox.setVisible(false);
    }
}
