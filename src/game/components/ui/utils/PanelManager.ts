import { FridgePanel } from "../panels/FriggePanel";
import { GamePanel } from "../panels/GamePanel";
import { PausePanel } from "../panels/PausePanel";
import { ShopPanel } from "../panels/ShopPanel";

export class PanelManager {
    private currentPanel:
        | Phaser.GameObjects.Container
        | ShopPanel
        | GamePanel
        | FridgePanel
        | PausePanel
        | null;

    constructor() {}

    setPanel(
        panel:
            | Phaser.GameObjects.Container
            | ShopPanel
            | FridgePanel
            | GamePanel
            | PausePanel,
        data?: any
    ) {
        if (this.currentPanel) {
            this.currentPanel.setVisible(false);

            if ((this.currentPanel as any).Stop) {
                (this.currentPanel as any).Stop();
            }
        }

        if (this.currentPanel === panel) {
            this.DeleteCurrentPanel();
            return;
        }
        this.currentPanel = panel;
        this.currentPanel.setVisible(true);

        if ((this.currentPanel as any).Start) {
            (this.currentPanel as any).Start(data);
        }
    }

    DeleteCurrentPanel() {
        if (this.currentPanel) {
            this.currentPanel.setVisible(false);
            if ((this.currentPanel as any).Stop) {
                (this.currentPanel as any).Stop();
            }
            this.currentPanel = null;
        }
    }
}
