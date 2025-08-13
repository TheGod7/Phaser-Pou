import Phaser from "phaser";
import BadgeLabel from "phaser3-rex-plugins/templates/ui/badgelabel/BadgeLabel";
import Label from "phaser3-rex-plugins/templates/ui/label/Label";

export class CoinLabel extends BadgeLabel {
    constructor(scene: Phaser.Scene, x: number, y: number, size: number = 80) {
        super(scene, {
            x: x,
            y: y,
            width: size,
            height: size,
            background: scene.add.image(0, 0, "CoinPlusSign").setDepth(1),
            rightBottom: scene.rexUI.add
                .label({
                    text: scene.add.text(0, 0, "100", {
                        stroke: "#000000",
                        strokeThickness: 8,
                        fontSize: "80px",
                        fontFamily: "Cookies",
                        align: "center",
                    }),

                    space: {
                        top: 10,
                    },
                    width: size / 2,
                    height: size / 2,
                    adjustTextFontSize: true,
                })
                .setDepth(2)
                .layout(),
        });

        this.layout();
    }

    drawMoney(money: number) {
        function formatNumber(n: number): string {
            if (n >= 1_000_000_000)
                return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
            if (n >= 1_000_000)
                return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
            if (n >= 1_000)
                return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
            return n.toString();
        }

        const coinLabel = this.getElement("rightBottom") as Label;

        coinLabel.setText(formatNumber(money));

        coinLabel.layout();
        this.layout();
    }
}
