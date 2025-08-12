import { Scene } from "phaser";
import { StatusBar } from "../../../components/ui/rooms/StatusBar";

import { SettingsPanel } from "../../../components/ui/panels/SettingsPanel";
import { PanelManager } from "../../../components/ui/utils/PanelManager";
import { ShopPanel } from "../../../components/ui/panels/ShopPanel";
import { FridgePanel } from "../../../components/ui/panels/FriggePanel";
import { GamePanel } from "../../../components/ui/panels/GamePanel";
import { PausePanel } from "../../../components/ui/panels/PausePanel";
import { InGameSettings } from "../../../components/ui/panels/InGameSettingsPanel";

export type MenuTypes =
    | "Shop"
    | "Fridge"
    | "Game"
    | "Settings"
    | "Settings2"
    | "Pause";
export class MainMenu extends Scene {
    StatusBar: StatusBar;
    PanelManager: PanelManager;

    ShopPanel: ShopPanel;
    FridgePanel: FridgePanel;
    SettingsPanel: SettingsPanel;
    GamePanel: GamePanel;
    PausePanel: PausePanel;
    SettingsPanel2: InGameSettings;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.StatusBar = new StatusBar(this);

        this.SettingsPanel = new SettingsPanel(this);
        this.SettingsPanel.setVisible(false);
        this.ShopPanel = new ShopPanel(this);
        this.ShopPanel.setVisible(false);
        this.FridgePanel = new FridgePanel(this);
        this.FridgePanel.setVisible(false);
        this.GamePanel = new GamePanel(this);
        this.GamePanel.setVisible(false);

        this.PausePanel = new PausePanel(this);
        this.PausePanel.setVisible(false);
        this.SettingsPanel2 = new InGameSettings(this);
        this.SettingsPanel2.setVisible(false);

        this.PanelManager = new PanelManager();
    }

    update() {
        this.SettingsPanel.update();
    }

    OpenMenu(Menu: MenuTypes) {
        switch (Menu) {
            case "Shop":
                this.PanelManager.setPanel(this.ShopPanel);
                break;
            case "Fridge":
                this.PanelManager.setPanel(this.FridgePanel);
                break;
            case "Game":
                this.PanelManager.setPanel(this.GamePanel);
                break;
            case "Settings":
                this.PanelManager.setPanel(this.SettingsPanel);
                break;
            case "Pause":
                this.PanelManager.setPanel(this.PausePanel);
                break;
            case "Settings2":
                this.PanelManager.setPanel(this.SettingsPanel2);
                break;
        }
    }
}

