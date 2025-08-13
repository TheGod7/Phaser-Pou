import Phaser from "phaser";

import { ButtonText } from "../TextButton";
import { ImgButton } from "../ImageButton";
import { Foods, FoodsStats, FoodTypes, PouStates } from "../../../PouState";
import { GameManager } from "../../../scenes/Game/GameManager";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import { soundManager } from "../utils/sound";
import { MainMenu } from "../../../scenes/Game/MainMenu";
import { RoomsManager } from "../../../scenes/Rooms/Rooms";
import { kitchenMenu } from "../rooms/KitchenBottomMenu";

export class ShopPanel extends ScrollablePanel {
    private Items: Sizer[];
    private GameManagerScene: GameManager;
    private EventEmitter: Phaser.Events.EventEmitter;
    constructor(scene: Phaser.Scene) {
        const Buttons: Sizer[] = [];
        const EventEmitter = new Phaser.Events.EventEmitter();
        const GameManagerScene = scene.scene.get("GameManager") as GameManager;

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
                    .text(0, 15, "Tienda", {
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

        //Shop Items

        const PannelSizer = scene.rexUI.add.sizer({
            width: scene.scale.width,
            orientation: "vertical",
        });

        for (let i = 0; i < Foods.length; i++) {
            const Food = Foods[i];
            const FoodStats = FoodsStats[Food];

            const Item = scene.rexUI.add.sizer({
                width: scene.scale.width,
                height: 100,
                space: {
                    top: 20,
                    bottom: 20,
                },
                orientation: "horizontal",
                name: Food,
            });

            const ItemImage = scene.add
                .image(0, 0, Food)
                .setDisplaySize(100, 100);

            const ItemInfo = scene.rexUI.add.sizer({
                width: 100,
                height: 100,
                space: {
                    top: 20,
                    bottom: 20,
                },
                orientation: "vertical",
            });

            const ItemName = scene.rexUI.add
                .label({
                    width: 100,
                    height: 25,
                    text: scene.add
                        .text(0, 15, Food.replace(/_/g, " "), {
                            stroke: "#000000",
                            strokeThickness: 8,
                            fontSize: "25px",
                            fontFamily: "Cookies",
                            align: "center",
                        })
                        .setDepth(3),
                })
                .layout();

            const ItemHunger = scene.rexUI.add
                .label({
                    width: 100,
                    height: 20,
                    icon: scene.add.image(0, 0, "hunger"),
                    text: scene.add
                        .text(
                            0,
                            15,
                            FoodStats.hunger > 0
                                ? "+" + FoodStats.hunger
                                : "" + FoodStats.hunger,
                            {
                                fontSize: "20px",
                                stroke: "#ffffff",
                                strokeThickness: 4,
                                color: "#000000",
                                fontFamily: "Cookies",
                                align: "center",
                            }
                        )
                        .setDepth(3),
                    space: {
                        iconLeft: 10,
                    },
                })
                .layout();

            ItemInfo.add(ItemName, { align: "left" });
            ItemInfo.add(ItemHunger, { align: "left" });
            ItemInfo.setOrigin(0.5, 0);
            ItemInfo.layout();

            const ItemButtonSizer = scene.rexUI.add.sizer({
                width: 100,
                height: 100,
                orientation: "vertical",
            });

            const ItemCoin = scene.rexUI.add
                .label({
                    width: 100,
                    height: 20,
                    icon: scene.add.image(0, 0, "coin").setDisplaySize(20, 20),
                    text: scene.add
                        .text(0, 15, "" + FoodStats.price, {
                            fontSize: "20px",
                            stroke: "#ffffff",
                            strokeThickness: 4,
                            color: "#000000",
                            fontFamily: "Cookies",
                            align: "center",
                        })
                        .setDepth(3),
                    space: {
                        iconLeft: 10,
                        bottom: 10,
                    },
                })
                .layout();

            const ItemButton = new ButtonText(scene, {
                x: 0,
                y: 0,
                width: 100,
                height: 50,
                text:
                    PouStates.money >= FoodStats.price
                        ? "Comprar"
                        : "No Alcanza",
                backgroundColor:
                    PouStates.money >= FoodStats.price ? 0xff9900 : 0xff0000,
                textColor: "#ffffff",
                fontSize: 15,
                radius: 5,
                Callback: () => {
                    EventEmitter.emit("BuyItem", Food, Item);
                },
                Cooldown: 500,
            });

            Item.setData("Buttons", ItemButton);

            Buttons.push(Item);

            ItemButtonSizer.add(ItemCoin, { align: "right" });
            ItemButtonSizer.add(ItemButton, { align: "right" });
            ItemButtonSizer.setOrigin(0.5, 0);
            ItemButtonSizer.layout();

            const emptySpace = scene.add.rectangle(0, 0, 50, 0, 0x000000, 0.5);

            Item.add(ItemImage);
            Item.add(ItemInfo);
            Item.addSpace();
            Item.add(ItemButtonSizer);
            Item.add(emptySpace);
            Item.setOrigin(0.5, 0);
            Item.layout();

            PannelSizer.add(Item);
        }

        PannelSizer.setDepth(2);
        PannelSizer.setOrigin(0, 0);
        PannelSizer.layout();

        super(scene, {
            width: scene.scale.width,
            height: scene.scale.height - 80,
            x: 0,
            y: 80,
            background: scene.add.rectangle(0, 0, 0, 0, 0xffffff, 0.8),
            header: Header,
            panel: {
                child: PannelSizer,
                mask: true,
            },
        });

        this.setOrigin(0, 0);
        this.layout();

        this.Items = Buttons;
        this.EventEmitter = EventEmitter;
        this.GameManagerScene = GameManagerScene;

        this.EventEmitter.on("BuyItem", (Food: FoodTypes) => {
            const FoodStats = FoodsStats[Food];

            if (PouStates.money >= FoodStats.price) {
                this.GameManagerScene.BuyFood(Food);
                soundManager.play(scene, "buy");

                const RoomsScene = scene.scene.get("Rooms") as RoomsManager;

                if (RoomsScene.scene.isActive()) {
                    const KitchenBottomMenu = RoomsScene.children.getByName(
                        "KitchenBottomMenu"
                    ) as kitchenMenu;

                    KitchenBottomMenu.UpdateFood(Food);
                }
            } else {
                soundManager.play(scene, "wrong");
            }
            this.UpdateAllButtons();
        });
    }

    UpdateAllButtons() {
        for (let i = 0; i < this.Items.length; i++) {
            const Item = this.Items[i];
            const ItemButton = Item.getData("Buttons") as ButtonText;

            const FoodStats = FoodsStats[Item.name as FoodTypes];

            ItemButton.setText(
                PouStates.money >= FoodStats.price ? "Comprar" : "No Alcanza"
            );
            ItemButton.setBackgroundColor(
                PouStates.money >= FoodStats.price ? 0xff9900 : 0xff0000
            );
        }
    }

    Start() {
        this.UpdateAllButtons();
    }
}
