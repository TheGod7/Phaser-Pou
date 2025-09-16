import { Scene } from "phaser";
import { StatusBar } from "../../components/ui/rooms/StatusBar";

import { SettingsPanel } from "../../components/ui/panels/SettingsPanel";
import { PanelManager } from "../../components/ui/utils/PanelManager";
import { ShopPanel } from "../../components/ui/panels/ShopPanel";
import { FridgePanel } from "../../components/ui/panels/FriggePanel";
import { GamePanel } from "../../components/ui/panels/GamePanel";
import { PausePanel } from "../../components/ui/panels/PausePanel";
import { InGameSettings } from "../../components/ui/panels/InGameSettingsPanel";
import { AchievementsPanel } from "../../components/ui/AchievementsPanel";
import { AchievementsAllPanel } from "../../components/ui/panels/AllArchievementsPanel";

export type MenuTypes =
    | "Shop"
    | "Fridge"
    | "Game"
    | "Settings"
    | "Settings2"
    | "Pause"
    | "AllAchievements";
export class MainMenu extends Scene {
    StatusBar: StatusBar;
    PanelManager: PanelManager;

    ShopPanel: ShopPanel;
    FridgePanel: FridgePanel;
    SettingsPanel: SettingsPanel;
    GamePanel: GamePanel;
    PausePanel: PausePanel;
    SettingsPanel2: InGameSettings;
    AchievementsPanel: AchievementsPanel;
    allAchievementsPanel: AchievementsAllPanel;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.StatusBar = new StatusBar(this);
        this.AchievementsPanel = new AchievementsPanel(this);
        this.AchievementsPanel.setAlpha(0);

        this.allAchievementsPanel = new AchievementsAllPanel(this);
        this.allAchievementsPanel.setVisible(false);

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

        this.AchievementsPanel.setToTop();
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
            case "AllAchievements":
                this.PanelManager.setPanel(this.allAchievementsPanel);
                break;
        }
    }

    gameOver() {
        this.StatusBar.setVisible(false);
        this.ShopPanel.setVisible(false);
        this.FridgePanel.setVisible(false);
        this.GamePanel.setVisible(false);
        this.SettingsPanel.setVisible(false);
        this.SettingsPanel2.setVisible(false);
        this.PausePanel.setVisible(false);
        this.allAchievementsPanel.setVisible(false);

        this.AchievementsPanel.setToTop();
    }
}
