import { Scene } from "phaser";
import { LoadAssets } from "./Preloader";
import BootAssets from "./../../assets/boot.assets";

export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        LoadAssets(this, BootAssets);
    }

    create() {
        this.scene.start("Preloader");
    }
}
