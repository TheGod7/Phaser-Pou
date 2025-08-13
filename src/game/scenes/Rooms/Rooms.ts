import { Scene } from "phaser";
import { BackgroundRooms } from "../../components/ui/rooms/Background";
import { Character } from "../../components/ui/character/Character";
import { RoomSelector } from "../../components/ui/rooms/RoomSelector";
import { kitchenMenu } from "../../components/ui/rooms/KitchenBottomMenu";
import { BedroomBottomMenu } from "../../components/ui/rooms/BedroomBottomMenu";
import { LivingRoomMenu } from "../../components/ui/rooms/LivingroomBottomMenu";
import { GameRoomBottomMenu } from "../../components/ui/rooms/GameRoomBottomMenu";

export class RoomsManager extends Scene {
    CurrentRoom: number = 0;

    Background: BackgroundRooms;
    character: Character;
    RoomSelector: RoomSelector;

    currentBackground: number = 0;
    backgrounds: string[] = ["RoomBackground1", "RoomBackground2"];

    KitchenRoomMenu: kitchenMenu;
    BedroomRoomMenu: BedroomBottomMenu;
    LivingRoomMenu: LivingRoomMenu;
    GameRoomMenu: GameRoomBottomMenu;

    RoomMenu: any[];

    constructor() {
        super("Rooms");
    }

    init(data: any) {
        this.CurrentRoom = data.room;
    }

    create() {
        this.events.on("shutdown", () => {
            this.input.removeAllListeners();
        });
        // this.scene.start("GameOver");

        // this.scale.setGameSize(462, 978);

        // this.game.scale.on("orientationchange", function (orientation) {
        //     if (orientation === Phaser.Scale.PORTRAIT) {
        //         console.log("portrait");
        //         orientation = Phaser.Scale.LANDSCAPE;
        //     } else if (orientation === Phaser.Scale.LANDSCAPE) {
        //         console.log("landscape");
        //     }
        // });

        this.Background = new BackgroundRooms(this, this.CurrentRoom);
        this.Background.setTexture(this.backgrounds[this.currentBackground]);

        this.input.keyboard?.on("keydown-F2", () => {
            this.scene.start("GameOver");
        });

        this.character = new Character(
            this,
            this.scale.width,
            this.scale.width,
            this.scale.width / 2,
            this.scale.height / 2 + this.scale.width / 2 + 100
        );

        this.RoomSelector = new RoomSelector(this).setDepth(3);

        this.KitchenRoomMenu = new kitchenMenu(this).setDepth(3);
        this.BedroomRoomMenu = new BedroomBottomMenu(this).setDepth(3);
        this.LivingRoomMenu = new LivingRoomMenu(this).setDepth(3);
        this.GameRoomMenu = new GameRoomBottomMenu(this).setDepth(3);

        this.KitchenRoomMenu.setVisible(false);
        this.BedroomRoomMenu.setVisible(false);
        this.LivingRoomMenu.setVisible(false);
        this.GameRoomMenu.setVisible(false);
        this.GameRoomMenu.setToTop();

        this.RoomMenu = [
            this.BedroomRoomMenu,
            this.KitchenRoomMenu,
            this.LivingRoomMenu,
            this.GameRoomMenu,
        ];

        this.RoomMenu[this.CurrentRoom].setVisible(true);
    }

    nextRoom() {
        this.RoomMenu[this.CurrentRoom].setVisible(false);

        if (this.RoomMenu[this.CurrentRoom].Stop) {
            this.RoomMenu[this.CurrentRoom].Stop();
        }
        this.CurrentRoom++;

        if (this.CurrentRoom > 3) {
            this.CurrentRoom = 0;

            if (this.RoomMenu[this.CurrentRoom].Start) {
                this.RoomMenu[this.CurrentRoom].Start();
            }
            this.RoomMenu[this.CurrentRoom].setVisible(true);

            this.Background.MoveBackground(this, this.CurrentRoom);
        } else {
            if (this.RoomMenu[this.CurrentRoom].Start) {
                this.RoomMenu[this.CurrentRoom].Start();
            }
            this.RoomMenu[this.CurrentRoom].setVisible(true);

            this.Background.MoveBackground(this, this.CurrentRoom);
        }
    }

    prevRoom() {
        this.RoomMenu[this.CurrentRoom].setVisible(false);

        if (this.RoomMenu[this.CurrentRoom].Stop) {
            this.RoomMenu[this.CurrentRoom].Stop();
        }
        this.CurrentRoom--;

        if (this.CurrentRoom < 0) {
            this.CurrentRoom = 3;
            if (this.RoomMenu[this.CurrentRoom].Start) {
                this.RoomMenu[this.CurrentRoom].Start();
            }
            this.RoomMenu[this.CurrentRoom].setVisible(true);

            this.Background.MoveBackground(this, this.CurrentRoom);
        } else {
            if (this.RoomMenu[this.CurrentRoom].Start) {
                this.RoomMenu[this.CurrentRoom].Start();
            }
            this.RoomMenu[this.CurrentRoom].setVisible(true);

            this.Background.MoveBackground(this, this.CurrentRoom);
        }
    }

    update(): void {
        this.character.update();
        if (this.RoomMenu[this.CurrentRoom].update)
            this.RoomMenu[this.CurrentRoom].update();
    }

    NextBackground() {
        this.currentBackground++;
        if (this.currentBackground > 1) {
            this.currentBackground = 0;
        }

        this.Background.setTexture(this.backgrounds[this.currentBackground]);
    }
}
