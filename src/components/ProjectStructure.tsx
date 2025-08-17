import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

import CodeSnippet from "./codePart";

export default function ProjectStructure() {
    const code = `
📦 public/
 └── Imágenes, sprites y recursos públicos

📦 src/
 ├── 📂 components/
 │    └── 📂 pages/        → Páginas completas de la web
 │
 ├── 📂 game/
 │    ├── 📂 assets/       → Listado de assets e imágenes
 │    ├── 📂 components/   → UI y lógica del juego
 │    ├── 📂 scenes/       → Escenas del juego (pantallas/estados)
 │    ├── 📜 main.ts       → Configuración e inicio de Phaser
 │    └── 📜 PouState.ts   → Estadísticas y lógica de estado
 │
 ├── 📂 types/             → Definiciones TypeScript
 └── 📜 vite-env.d.ts
    `;

    const mainCode = `
    // --- Importación de todas las escenas ---
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/Game/MainMenu";
import { Preloader } from "./scenes/Game/Preloader";
import { GameManager } from "./scenes/Game/GameManager";
import { RoomsManager } from "./scenes/Rooms/Rooms";
import FoodDrop from "./scenes/MiniGame/FoodDrop";
import FlappyBird from "./scenes/MiniGame/FlappyBird";
import { Boot } from "./scenes/Game/Boot";
import MemoryMatch from "./scenes/MiniGame/MemoryMatch";

// --- Importación de plugins extra de Phaser ---
import BBCodeTextPlugin from "phaser3-rex-plugins/plugins/bbcodetext-plugin.js";
import RoundRectanglePlugin from "phaser3-rex-plugins/plugins/roundrectanglecanvas-plugin.js";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import RoundRectangleProgressPlugin from "phaser3-rex-plugins/plugins/roundrectangleprogress-plugin.js";
import SliderPlugin from "phaser3-rex-plugins/plugins/slider-plugin.js";

// --- Configuración global del juego ---
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,              // Detecta automáticamente WebGL o Canvas
    width: 462,                     // Ancho de la ventana de juego
    height: 978,                    // Alto de la ventana
    parent: "game-container",       // ID del contenedor HTML
    scale: {                        // Ajustes de escalado
        mode: Phaser.Scale.FIT,     // Ajusta el juego a la ventana manteniendo proporciones
        autoCenter: Phaser.Scale.CENTER_BOTH,
        fullscreenTarget: "game-container",
    },

    // Escenas que se ejecutarán (orden importa)
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

    // Motor de física Arcade
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300, x: 0 }, // Gravedad vertical
            debug: true,               // Muestra colisiones y límites
        },
    },

    // Plugins (globales y de escena)
    plugins: {
        scene: [
            { key: "rexUI", plugin: RexUIPlugin, mapping: "rexUI" },
        ],
        global: [
            { key: "rexRoundRectangleCanvasPlugin", plugin: RoundRectanglePlugin, start: true },
            { key: "rexSlider", plugin: SliderPlugin, start: true },
            { key: "rexRoundRectangleProgressPlugin", plugin: RoundRectangleProgressPlugin, start: true },
            { key: "rexBBCodeTextPlugin", plugin: BBCodeTextPlugin, start: true },
        ],
    },
};

// --- Función para iniciar el juego ---
const StartGame = (parent: string) => {
    return new Phaser.Game({ ...config, parent });
};

export default StartGame;

    `;

    const assetsCode = `
    export default [
    {
        image: "/assets/ui/game/GameIco1.png",
        key: "FoodDrop",
        type: "Image",
    },

    {
        image: "/assets/ui/game/GameIco2.png",
        key: "FlappyBird",
        type: "Image",
    },
    {
        image: "/assets/ui/game/GameIco3.png",
        key: "Nose",
        type: "Image",
    },
    {
        image: "/assets/ui/game/EmptyHearth.png",
        key: "EmptyHearth",
        type: "Image",
    },
    {
        image: "/assets/ui/game/Hearth.png",
        key: "Hearth",
        type: "Image",
    },
    {
        image: "/assets/ui/game/Pipe1.png",
        key: "PipeHead",
        type: "Image",
    },
    {
        image: "/assets/ui/game/Pipe2.png",
        key: "PipeBody",
        type: "Image",
    },
    {
        image: "/assets/ui/game/BackCard.png",
        key: "BackCard",
        type: "Image",
    },
    {
        image: "/assets/ui/game/FrontCard.png",
        key: "FrontCard",
        type: "Image",
    },

    {
        audio: "/assets/sfx/MiniGameOst.wav",
        key: "GameOst",
        type: "Audio",
    },
    {
        audio: "/assets/sfx/MiniGameOst2.wav",
        key: "GameOst2",
        type: "Audio",
    },

    {
        audio: "/assets/sfx/CoinPicked.wav",
        key: "CoinPicked",
        type: "Audio",
    },
    {
        audio: "/assets/sfx/PipeScore.wav",
        key: "PipeScore",
        type: "Audio",
    },
    {
        audio: "/assets/sfx/FailSound.wav",
        key: "Fail",
        type: "Audio",
    },
] as AssetsElement[];
`;

    const AssetsTypes = `
    // Tipo base común a todos los assets
interface BaseAsset {
    key: string;       // Clave única para referenciar el asset
    type: AssetsTypes; // Tipo de asset
}

// Imagen simple
interface ImageAsset extends BaseAsset {
    type: "Image";
    image: string; // Ruta del archivo
}

// SpriteSheet (hoja de sprites)
interface SpriteSheetAsset extends BaseAsset {
    type: "SpriteSheet";
    image: string;
    frameConfig: { frameWidth: number; frameHeight: number }; // Tamaño de cada frame
}

// Animación predefinida
interface AnimationAsset extends BaseAsset {
    type: "Animation";
    spriteSheet: string; // Clave del spritesheet a usar
    frameRate?: number;  // Velocidad opcional
    loop?: boolean;      // Si se repite indefinidamente
    frameNumber: { start: number; end: number };
}

// Audio
interface AudioAsset extends BaseAsset {
    type: "Audio";
    audio: string; // Ruta del archivo
}

// Tipos disponibles
type AssetsTypes = "Image" | "SpriteSheet" | "Audio" | "Video" | "Animation";

// Asset final que puede ser cualquiera de los anteriores
type AssetsElement =
    | ImageAsset
    | SpriteSheetAsset
    | AnimationAsset
    | AudioAsset;
`;

    const PreloadCode = `
    import { Scene } from "phaser";
import UI from "./../../assets/ico.assets";
import food from "./../../assets/food.assets";
import Backgrounds from "./../../assets/bacgrounds.assets";
import Char from "./../../assets/character.assets";
import Game from "./../../assets/game.assets";
import { simpleButtonAnim } from "../../components/ui/utils/SimpleButtonAnim";

// Clase que representa la escena de carga de recursos (Preloader)
export class Preloader extends Scene {
    page: number; // Página actual de la presentación/carga
    FullLoaded: boolean; // Indica si todos los assets han sido cargados

    constructor() {
        super("Preloader"); // Llama al constructor de Scene con el nombre de la escena

        this.page = 1; // Página inicial
        this.FullLoaded = false; // Aún no se han cargado todos los assets
    }

    init() {
        // Fondo inicial (imagen de la página actual)
        const Bg = this.add.image(0, 0, "Page" + this.page).setToBack();
        Bg.setDisplaySize(this.scale.width, this.scale.height); // Escala para ocupar toda la pantalla
        Bg.setOrigin(0, 0); // Origen en la esquina superior izquierda

        // Imagen de "Loading" (ícono de carga)
        const LoadingImage = this.add.image(0, 0, "Loading");
        LoadingImage.setDisplaySize(40, 40);
        LoadingImage.setOrigin(0.5, 0.5);
        LoadingImage.setPosition(
            this.scale.width - 10 - 20, // Posición en la esquina inferior derecha
            this.scale.height - 10 - 20
        );

        // Texto "Skip" con estilo y plugin rexUI (inicialmente oculto)
        const LoadingText = this.rexUI.add
            .label({
                height: 50,
                text: this.add.text(
                    this.scale.width - 10,
                    this.scale.height - 20,
                    "Skip",
                    {
                        font: "30px Cookies",
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 8,
                        align: "center",
                    }
                ),
                x: this.scale.width - 10,
                y: this.scale.height - 20,
            })
            .setOrigin(1, 1)
            .layout()
            .setVisible(false);

        // Animación de botón para "Skip"
        simpleButtonAnim(
            this,
            LoadingText,
            () => {
                // Si se pulsa "Skip", se lanzan las escenas principales
                this.scene.launch("MainMenu");
                this.scene.launch("GameManager");
                this.scene.launch("Rooms", { room: 1 });
                this.scene.bringToTop("MainMenu");
                this.scene.stop(); // Se detiene el Preloader
            },
            100
        );

        // Animación de rotación para el ícono de carga
        const LoadingAnimation = this.tweens.add({
            targets: LoadingImage,
            angle: 360, // Rotación completa
            duration: 1000, // 1 segundo
            repeat: -1, // Bucle infinito
            onRepeat: () => {
                // Si ya se cargó todo, se destruye el ícono y se muestra el botón "Skip"
                if (this.FullLoaded) {
                    LoadingImage.destroy();
                    LoadingText.setVisible(true);
                }
            },
        });

        // Permite que el fondo detecte clics/taps
        Bg.setInteractive();

        // Evento al hacer clic en el fondo
        Bg.on("pointerdown", () => {
            if (!this.scale.isFullscreen) {
                // Si no está en pantalla completa, la activa
                this.scale.startFullscreen();
                return;
            }
            this.page++; // Avanza a la siguiente página

            if (this.page >= 9) {
                // Si ya se pasó la última página
                if (this.FullLoaded) {
                    // Si todo está cargado, lanza el juego
                    this.scene.launch("MainMenu");
                    this.scene.launch("GameManager");
                    this.scene.launch("Rooms", { room: 1 });
                    this.scene.bringToTop("MainMenu");
                    this.scene.stop();
                } else {
                    // Si aún no se carga todo, muestra un indicador de carga
                    Bg.destroy();
                    LoadingImage.destroy();
                    LoadingText.destroy();

                    const Loading = this.add.image(0, 0, "Loading");
                    Loading.setDisplaySize(100, 100)
                        .setOrigin(0.5, 0.5)
                        .setPosition(
                            this.scale.width / 2 - 50,
                            this.scale.height / 2 - 50
                        );
                    Loading.setTint(0xffffff);

                    // Rotación del nuevo ícono de carga
                    const loadingAnim = this.tweens.add({
                        targets: Loading,
                        angle: 360,
                        duration: 1000,
                        repeat: -1,
                        onRepeat: () => {
                            if (this.FullLoaded) {
                                // Una vez cargado, inicia el juego
                                Loading.destroy();
                                this.scene.launch("MainMenu");
                                this.scene.launch("GameManager");
                                this.scene.launch("Rooms", { room: 1 });
                                this.scene.bringToTop("MainMenu");
                                this.scene.stop();
                            }
                        },
                    });
                }
            } else {
                // Cambia el fondo a la nueva página
                Bg.setTexture("Page" + this.page);
            }
        });
    }

    preload() {
        // Carga de todos los assets del juego
        [UI, food, Backgrounds, Char, Game].forEach((list) =>
            LoadAssets(this, list)
        );
    }

    create() {
        // Carga de animaciones del personaje
        LoadAnimation(this, Char);

        // Marca que ya se cargó todo
        this.FullLoaded = true;
    }
}

// Función para cargar assets según su tipo
export function LoadAssets(scene: Scene, assets: AssetsElement[]) {
    assets.forEach((asset) => {
        switch (asset.type) {
            case "Image":
                scene.load.image(asset.key, asset.image);
                break;
            case "SpriteSheet":
                scene.load.spritesheet(
                    asset.key,
                    asset.image,
                    asset.frameConfig
                );
                break;
            case "Audio":
                scene.load.audio(asset.key, asset.audio);
                break;
        }
    });
}

// Función para crear animaciones a partir de una lista de assets
export function LoadAnimation(scene: Scene, assets: AssetsElement[]) {
    assets
        .filter((a) => a.type === "Animation") // Filtra solo los que sean animaciones
        .forEach((asset) => {
            const frames = scene.anims.generateFrameNumbers(asset.spriteSheet, {
                start: asset.frameNumber.start,
                end: asset.frameNumber.end,
            });

            scene.anims.create({
                key: asset.key,
                frames,
                repeat: asset.loop ? -1 : 0,
                frameRate: asset.frameRate || 24,
            });
        });
}

    `;

    return (
        <section>
            <h2 className="text-5xl font-bold mb-6">Estructura del Proyecto</h2>
            <br />
            <br />
            <p className="text-2xl mb-6">
                El proyecto está dividido en carpetas para organizar el código y
                hacerlo más escalable y mantenible. A continuación, se detalla
                qué hace cada parte:
            </p>

            <SyntaxHighlighter
                language="plaintext"
                style={atomOneDark}
                showLineNumbers={false}
                customStyle={{
                    background: "transparent",
                    padding: "1rem",
                    fontSize: "1.1rem",
                    borderRadius: "1rem",
                }}
            >
                {code}
            </SyntaxHighlighter>

            <div className="mt-6 text-lg text-gray-300">
                <strong className="text-orange-400">Escenas:</strong> Son como
                pantallas o estados del juego. Ejemplo: menú, gameplay, tienda.
                En Phaser, cada escena tiene su propio ciclo de vida y lógica.
            </div>

            <div className="mt-6 text-lg text-gray-300">
                <strong className="text-orange-400">Assets:</strong> Son
                recursos que se utilizan en el juego, como imágenes, sonidos y
                música. Estos son cargados en tiempo de ejecución y se utilizan
                para crear objetos y animaciones en la pantalla.
            </div>

            <br />
            <br />

            <p className="text-2xl">
                Ahora procedere a ver el codigo de las partes mas esenciales y
                explicarlas de forma muy general. Empezando por el archivo
                main.ts que como ya dije se encarga de iniciar el juego y
                configurar Phaser.
            </p>
            <br />
            <br />
            <CodeSnippet code={mainCode} name="src/game/main.ts" />

            <br />
            <br />
            <p className="text-2xl">
                Como podemos ver, el codigo esta algo extendido, pero en un
                principio esta muy sencillo ya que este codigo lo unico que se
                encarga es de poner todas las scenas y iniciar el juego. Ahora
                procedere a ver el código de cada parte del proyecto. de forma
                muy general empezando por el archivo main.ts que como ya dije se
                encarga de iniciar el juego y configurar Phaser.
                <br />
                <br />
                Como puedes ver estamos tambien configuradon y sentendo un
                plugin llamado{" "}
                <a
                    href="https://phaser.io/news/2019/01/rexui-plugins"
                    className="text-orange-500"
                >
                    RexUI
                </a>{" "}
                el cual nos facilita a el momento de crear la ui y los
                componentes del juego
                <br />
                <br />
            </p>

            <div className="mt-6 text-lg text-gray-300">
                <strong className="text-orange-400">UI:</strong> Es la interfaz
                de usuario del juego, es donde se crean los componentes y los
                menus que se utilizan en el juego.
            </div>

            <br />
            <br />
            <p className="text-2xl">
                Ahora procedere a mostrar la scena la cual se encarga de cargar
                los assets y la forma en la que se enlistan dichos assets.
                primero mostrare la forma en la que se enlistan los Assets
            </p>
            <br />
            <br />

            <CodeSnippet
                code={assetsCode}
                name="src/game/assets/game.assets.ts"
            />

            <br />
            <br />
            <p className="text-2xl">
                Como podemos observar, el código es bastante sencillo: se trata
                de un arreglo que contiene objetos, donde cada uno representa un
                asset e indica su tipo, clave (<em>key</em>) y ruta (
                <em>path</em>).
                <br />
                <br />
                Para esto, utilizamos una interfaz, ya que TypeScript es un
                lenguaje tipado. Esto nos permite trabajar de forma más
                eficiente, obligándonos a seguir una estructura definida
                previamente y reduciendo errores. A continuación, mostraré el
                ejemplo:
            </p>
            <br />
            <br />
            <CodeSnippet code={AssetsTypes} name="types/assets.d.ts" />
            <br />
            <br />
            <p className="text-2xl">
                Gracias a esto, en la escena <strong>Preload</strong> únicamente
                tendríamos que cargar los assets para poder utilizarlos dentro
                del juego.
            </p>

            <br />
            <br />

            <CodeSnippet
                code={PreloadCode}
                name="src/game/scenes/Game/Preloader.ts"
            />
        </section>
    );
}
