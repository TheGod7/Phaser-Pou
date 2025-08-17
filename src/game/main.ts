import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/Game/MainMenu";

import { Preloader } from "./scenes/Game/Preloader";
import { GameManager } from "./scenes/Game/GameManager";
import BBCodeTextPlugin from "phaser3-rex-plugins/plugins/bbcodetext-plugin.js";

import RoundRectanglePlugin from "phaser3-rex-plugins/plugins/roundrectanglecanvas-plugin.js";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import RoundRectangleProgressPlugin from "phaser3-rex-plugins/plugins/roundrectangleprogress-plugin.js";
import { RoomsManager } from "./scenes/Rooms/Rooms";
import SliderPlugin from "phaser3-rex-plugins/plugins/slider-plugin.js";
import FoodDrop from "./scenes/MiniGame/FoodDrop";
import FlappyBird from "./scenes/MiniGame/FlappyBird";
import { Boot } from "./scenes/Game/Boot";
import MemoryMatch from "./scenes/MiniGame/MemoryMatch";
//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 462,
    height: 978,
    parent: "game-container",
    // backgroundColor: ,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        fullscreenTarget: "game-container",
    },

    scene: [
        Boot,
        Preloader,
        GameManager,
        MainMenu,
        RoomsManager,
        FlappyBird,
        FoodDrop,
        MemoryMatch,
        GameOver,
    ],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300, x: 0 },
            debug: false,
        },
    },
    plugins: {
        scene: [
            {
                key: "rexUI",
                plugin: RexUIPlugin,
                mapping: "rexUI",
            },
        ],
        global: [
            {
                key: "rexRoundRectangleCanvasPlugin",
                plugin: RoundRectanglePlugin,
                start: true,
            },
            {
                key: "rexSlider",
                plugin: SliderPlugin,
                start: true,
            },
            {
                key: "rexRoundRectangleProgressPlugin",
                plugin: RoundRectangleProgressPlugin,
                start: true,
            },
            {
                key: "rexBBCodeTextPlugin",
                plugin: BBCodeTextPlugin,
                start: true,
            },
            // ...

            // ...
        ],
    },
};

// export default async function StartGame(parent: string): Promise<Phaser.Game> {
//     await document.fonts.load('16px "Cookies"');
//     await document.fonts.ready;

//     return new Phaser.Game({
//         ...config,
//         parent,
//     });
// }

const StartGame = (parent: string) => {
    return new Phaser.Game({ ...config, parent });
};

export default StartGame;
