import CodeSnippet from "./codePart";

export default function FlappyBirdExplained() {
    const s1 = `import { GameStats } from "../../components/minigames/GameStats";
import { soundManager } from "../../components/ui/utils/sound";
import { GameManager } from "../Game/GameManager";
import { MainMenu } from "../Game/MainMenu";

export default class FlappyBird extends Phaser.Scene {`;

    const s2 = `    PipeGroup: Phaser.Physics.Arcade.Group;
    Pipes: Phaser.Physics.Arcade.Sprite[][] = [];

    CoinsGroup: Phaser.Physics.Arcade.Group;
    ScoreGroup: Phaser.Physics.Arcade.Group;

    SpaceBTWeenPipes: number;
    Gap: number;

    PipesVelocityX: number;
    LastTopY: number;

    coins: number;
    score: number;`;

    const s3 = `    constructor() {
        super("FlappyBird");
    }`;

    const s4 = `    create() {
        this.Pipes = [];

        this.SpaceBTWeenPipes = 300;
        this.Gap = 150;

        this.PipesVelocityX = 100;
        this.LastTopY = this.scale.height / 2;

        this.coins = 0;
        this.score = 0;

        const MainMenu = this.scene.get("MainMenu") as MainMenu;
        const GameManager = this.scene.get("GameManager") as GameManager;

        const BackgroundSound = soundManager.playBackground(this, "GameOst");

        const Background = this.add.image(0, 0, "FlappyBirdBackground");
        // Background.setDisplaySize(this.scale.width, this.scale.height);
        Background.setOrigin(0, 0);
        Background.setDepth(0);`;

    const s5 = `        const Char = this.physics.add
            .sprite(10, this.scale.height / 2, "SwimmingCharacter")
            .setDisplaySize(100, 100)
            .setOrigin(0, 0.5)
            .setDepth(3);

        const GameStatus = new GameStats(this);

        GameStatus.setDepth(5);
        Char.body.setSize(300, 150);
        this.input.on("pointerdown", () => {
            Char.setVelocityY(-200);
        });

        GameManager.SetInGame(true);
        MainMenu.StatusBar.EnablePause(true);

        Char.play("Swim");`;

    const s6 = `        this.events.on("shutdown", () => {
            const MainMenu = this.scene.get("MainMenu") as MainMenu;
            MainMenu.StatusBar.EnablePause(false);
            GameManager.SetInGame(false);

            this.sound.stopAll();
            this.input.removeAllListeners();
        });

        this.events.on("pause", () => {
            BackgroundSound.pause();

            this.sound.getAllPlaying().forEach((sound) => {
                if (sound.key !== "ButtonClick") sound.pause();
            });
        });

        this.events.on("resume", () => {
            this.sound.resumeAll();
        });`;

    const s7 = `        this.PipeGroup = this.physics.add.group({
            velocityX: -this.PipesVelocityX,
            allowGravity: false,
            immovable: true,
        });

        this.ScoreGroup = this.physics.add.group({
            velocityX: -this.PipesVelocityX,
            allowGravity: false,
            immovable: true,
        });

        this.CoinsGroup = this.physics.add.group({
            velocityX: -this.PipesVelocityX,
            allowGravity: false,
            immovable: true,
        });

        const Ground = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height,
            this.scale.width,
            20,
            0x000000
        );

        this.physics.add.existing(Ground, true);`;

    const s8 = `        this.physics.add.overlap(Char, this.CoinsGroup, (_, objB) => {
            objB.destroy();

            this.coins++;
            this.score++;

            GameStatus.AddMoney(this.coins);
            soundManager.play(this, "CoinPicked");

            this.increaseDifficulty();
        });

        this.physics.add.overlap(Char, this.ScoreGroup, (_, objB) => {
            objB.destroy();

            this.score++;

            GameStatus.SetScore(this.score);
            soundManager.play(this, "PipeScore");

            this.increaseDifficulty();
        });

        this.physics.add.collider(Char, Ground, () => {
            this.scene.start("GameOverMiniGame", {
                score: this.score,
                coins: this.coins,
                scene: this,
            });
            this.physics.pause();
        });

        this.physics.add.collider(Char, this.PipeGroup, () => {
            this.scene.start("GameOverMiniGame", {
                score: this.score,
                coins: this.coins,
                scene: this,
            });
            this.physics.pause();
        });`;

    const s9 = `    InitPipes() {
        const X = 300;

        for (let i = 0; i < 5; i++) {
            this.CreatePipe(X + i * this.SpaceBTWeenPipes);
        }
    }`;

    const s10 = `    update() {
        if (this.Pipes.length === 0) return;

        const firstPipePieces = this.Pipes[0];
        const firstPiece = firstPipePieces[0];

        if (firstPiece.x + firstPiece.displayWidth < 0) {
            firstPipePieces.forEach((pipe) => pipe.destroy());
            this.Pipes.shift();

            const lastPipePieces = this.Pipes[this.Pipes.length - 1];
            const lastPiece = lastPipePieces[0];
            const newX = lastPiece.x + this.SpaceBTWeenPipes;

            this.CreatePipe(newX);
        }
    }`;

    const s11 = `    CreatePipe(X: number) {
        const margin = 600;
        const MaxTopY = this.scale.height - this.Gap - margin;
        const MinTopY = margin;

        const changeLimit = Phaser.Math.Between(50, 400);

        let newTopY = Phaser.Math.Between(
            Math.max(MinTopY, this.LastTopY - changeLimit),
            Math.min(MaxTopY, this.LastTopY + changeLimit)
        );

        this.LastTopY = newTopY;

        const TopY = newTopY - 33;

        const BottomY = TopY + this.Gap + 33;

        const AllPipesPieces = [];

        const CoinChance = Phaser.Math.Between(0, 100);`;

    const s12 = `        //Spawning Top SquarePipe
        for (let i = 0; i < 30; i++) {
            const PipeY = i == 0 ? TopY : TopY - 33 * i;

            if (PipeY < -50) break;
            const SquarePipe = this.physics.add
                .sprite(0, 0, i == 0 ? "PipeHead" : "PipeBody")
                .setDisplaySize(33, 33)
                .setFlipY(true)
                .setDepth(4);
            SquarePipe.setOrigin(0, 0);
            SquarePipe.setPosition(X, PipeY);
            SquarePipe.setImmovable(true);
            SquarePipe.body.allowGravity = false;

            AllPipesPieces.push(SquarePipe);
        }`;

    const s13 = `        // Spawning Bottom SquarePipe
        for (let i = 0; i < 30; i++) {
            const PipeY = i === 0 ? BottomY : BottomY + 33 * i;

            if (PipeY > this.scale.height + 50) break;
            const SquarePipe = this.physics.add
                .sprite(0, 0, i == 0 ? "PipeHead" : "PipeBody")
                .setDisplaySize(33, 33)
                .setDepth(4);

            SquarePipe.setOrigin(0, 0);
            SquarePipe.setPosition(X, PipeY);
            SquarePipe.setImmovable(true);
            SquarePipe.body.allowGravity = false;

            AllPipesPieces.push(SquarePipe);
        }`;

    const s14 = `        if (CoinChance <= 30) {
            const coinX = X + 33 / 2;
            const coinY = TopY + this.Gap / 2 + 33;

            const Coin = this.physics.add
                .sprite(coinX, coinY, "coin")
                .setDisplaySize(33, 33)
                .setOrigin(0.5)
                .setDepth(4);

            this.CoinsGroup.add(Coin);
        }

        const ScoreCollider = this.add
            .rectangle(X + 33, TopY + 33, 10, this.Gap, 0x000000, 0)
            .setOrigin(0, 0);

        this.physics.add.existing(ScoreCollider);
        this.ScoreGroup.add(ScoreCollider);

        AllPipesPieces.forEach((Pipe) => {
            this.PipeGroup.add(Pipe);
        });

        this.Pipes.push(AllPipesPieces);
    }`;

    const s15 = `    increaseDifficulty() {
        if (this.PipesVelocityX < 400) {
            this.PipesVelocityX += 2;
            this.PipeGroup.setVelocityX(-this.PipesVelocityX);
            this.ScoreGroup.setVelocityX(-this.PipesVelocityX);
            this.CoinsGroup.setVelocityX(-this.PipesVelocityX);
        }

        if (this.Gap > 70) {
            this.Gap -= 2;
        }
    }
}`;

    return (
        <section>
            <h2 className="text-5xl font-bold mb-6">Flappy Bird</h2>

            <p className="text-xl mb-6">
                Esta es una explicación clara del archivo{" "}
                <code>FlappyBird.ts</code>, dividida en secciones y mostrando
                solo los fragmentos relevantes. Solo se explicará este minijuego
                , si intentáramos cubrir todo el proyecto sería demasiado
                extenso.
            </p>

            <h3 className="text-3xl font-semibold mt-6">
                1) Imports y declaración de la escena
            </h3>
            <div className="my-6">
                <CodeSnippet code={s1} name="imports + class" />
            </div>
            <p className="text-lg my-6">
                Aquí importamos utilidades externas (sonidos, UI y otras
                escenas) y declaramos la clase que representa la escena del
                juego. Una escena es como una pantalla donde ocurre todo lo del
                minijuego.
            </p>

            <h3 className="text-3xl font-semibold mt-6">
                2) Propiedades de la clase (estado)
            </h3>
            <div className="my-6">
                <CodeSnippet code={s2} name="propiedades" />
            </div>
            <p className="text-lg my-6">
                Estas líneas declaran las variables que usa la escena durante la
                ejecución: grupos de objetos (tuberías, monedas), parámetros de
                diseño (distancia entre tuberías, separación/gap), velocidad, y
                el puntaje. Piensa en esto como las cajas donde guardamos la
                información del juego.
            </p>

            <h3 className="text-3xl font-semibold mt-6">3) Constructor</h3>
            <div className="my-6">
                <CodeSnippet code={s3} name="constructor" />
            </div>
            <p className="text-lg my-6">
                El constructor simplemente le dice a Phaser el nombre de la
                escena: <code>"FlappyBird"</code>. Phaser usará ese nombre para
                iniciar y controlar la escena.
            </p>

            <h3 className="text-3xl font-semibold mt-6">
                4) Inicio de la escena — variables y fondo
            </h3>
            <div className="my-6">
                <CodeSnippet code={s4} name="create() — init y background" />
            </div>
            <p className="text-lg my-6">
                En el <code>create()</code> inicializamos valores (distancias,
                velocidad, puntaje) y obtenemos referencias a las escenas
                globales (<code>MainMenu</code> y <code>GameManager</code>).
                También se reproduce el sonido de fondo y se agrega la imagen de
                fondo del minijuego.
            </p>

            <h3 className="text-3xl font-semibold mt-6">
                5) El personaje y controles (Char)
            </h3>
            <div className="my-6">
                <CodeSnippet code={s5} name="create() — personaje y input" />
            </div>
            <p className="text-lg my-6">
                Aquí se crea el personaje (<code>Char</code>) como un sprite con
                física: la gravedad lo hará caer. Cada vez que el usuario toca
                la pantalla o da clic, el pájaro recibe una velocidad negativa
                en Y (<code>setVelocityY(-200)</code>), lo que hace que "salte".
                También se carga la UI de estado (<code>GameStats</code>) y se
                reproduce una animación llamada <code>"Swim"</code>.
            </p>

            <h3 className="text-3xl font-semibold mt-6">
                6) Eventos: shutdown / pause / resume
            </h3>
            <div className="my-6">
                <CodeSnippet code={s6} name="create() — eventos" />
            </div>
            <p className="text-lg my-6">
                Estos manejadores cuidan el comportamiento cuando la escena se
                detiene o pausa: - <strong>shutdown</strong>: limpia listeners y
                detiene sonidos. - <strong>pause</strong>: pausa sonidos
                (excepto clicks de botones). - <strong>resume</strong>: reanuda
                sonidos. Esto evita que sonidos sigan reproduciéndose si el
                juego cambia de pantalla.
            </p>

            <h3 className="text-3xl font-semibold mt-6">
                7) Grupos y suelo (colisiones)
            </h3>
            <div className="my-6">
                <CodeSnippet code={s7} name="create() — grupos y ground" />
            </div>
            <p className="text-lg my-6">
                Se crean grupos físicos para las tuberías, puntos de score y
                monedas. Los grupos permiten asignar una velocidad uniforme a
                todos los objetos que pertenezcan a ellos. También se crea un
                rectángulo que actúa como suelo y se convierte en un cuerpo
                físico inmóvil: si el pájaro toca el suelo, el juego terminará.
            </p>

            <h3 className="text-3xl font-semibold mt-6">
                8) Overlaps y colliders — lógica de puntaje y muerte
            </h3>
            <div className="my-6">
                <CodeSnippet code={s8} name="create() — overlaps y colliders" />
            </div>
            <p className="text-lg my-6">
                - <strong>overlap con CoinsGroup</strong>: cuando el personaje
                entra en contacto con una moneda, la moneda se destruye, se suma
                al contador de monedas/puntos y se reproduce un sonido. -{" "}
                <strong>overlap con ScoreGroup</strong>: al pasar por el hueco
                (collider invisible) se suma 1 punto. -{" "}
                <strong>collider con Ground o PipeGroup</strong>: si choca, se
                lanza la escena de Game Over y se pausa la física. En resumen:
                hay objetos que dan puntos (overlap) y objetos que causan el fin
                del juego (collider).
            </p>

            {/* Sección 9 */}
            <h3 className="text-3xl font-semibold mt-6">
                9) InitPipes() — creación inicial de tuberías
            </h3>
            <div className="my-6">
                <CodeSnippet code={s9} name="InitPipes()" />
            </div>
            <p className="text-lg my-6">
                Esta función crea 5 columnas de tuberías iniciales, espaciadas
                según
                <code>SpaceBTWeenPipes</code>. Llama a <code>CreatePipe</code>{" "}
                para generar cada una.
            </p>

            <h3 className="text-3xl font-semibold mt-6">
                10) update() — reciclado de tuberías
            </h3>
            <div className="my-6">
                <CodeSnippet code={s10} name="update()" />
            </div>
            <p className="text-lg my-6">
                En cada frame, la función <code>update()</code> verifica si la
                primera columna de tuberías ya salió por la izquierda de la
                pantalla. Si salió: 1) destruye esa columna, 2) la elimina del
                arreglo <code>this.Pipes</code>, 3) calcula la posición X para
                la nueva columna (usando la última existente) y 4) genera una
                nueva columna con <code>CreatePipe</code>. Esto crea la
                sensación de un flujo infinito de obstáculos sin crear tuberías
                infinitas.
            </p>

            <h3 className="text-3xl font-semibold mt-6">
                11) CreatePipe() — cálculos iniciales
            </h3>
            <div className="my-6">
                <CodeSnippet code={s11} name="CreatePipe() — cálculos" />
            </div>
            <p className="text-lg my-6">
                Al crear una columna de tuberías se calcula una posición
                vertical para la parte superior (<code>newTopY</code>) usando un
                límite de cambio aleatorio. Se usa <code>LastTopY</code> para
                evitar cambios bruscos en la altura entre columnas consecutivas.
                También se define el <em>TopY</em>, el <em>BottomY</em> (usando{" "}
                <code>Gap</code>) y un arreglo para acumular todas las piezas
                que forman la columna (<code>AllPipesPieces</code>).
            </p>

            {/* Sección 12 */}
            <h3 className="text-3xl font-semibold mt-6">
                12) CreatePipe() — generación de la parte superior
            </h3>
            <div className="my-6">
                <CodeSnippet code={s12} name="CreatePipe() — top pipes" />
            </div>
            <p className="text-lg my-6">
                Este bucle crea las piezas que forman la tubería superior
                (cabeza + cuerpo en piezas de 33px). Se posicionan de arriba
                hacia abajo (usando <code>PipeY</code>) hasta que salen fuera de
                la pantalla. Cada pieza es un sprite físico inmóvil y sin
                gravedad.
            </p>

            <h3 className="text-3xl font-semibold mt-6">
                13) CreatePipe() — generación de la parte inferior
            </h3>
            <div className="my-6">
                <CodeSnippet code={s13} name="CreatePipe() — bottom pipes" />
            </div>
            <p className="text-lg my-6">
                El mismo procedimiento que en la parte superior, pero esta vez
                para la tubería inferior: piezas que van desde el borde del
                hueco hacia abajo hasta fuera de la pantalla.
            </p>

            {/* Sección 14 */}
            <h3 className="text-3xl font-semibold mt-6">
                14) CreatePipe() — moneda y collider de score
            </h3>
            <div className="my-6">
                <CodeSnippet
                    code={s14}
                    name="CreatePipe() — coin & score collider"
                />
            </div>
            <p className="text-lg my-6">
                - Se decide aleatoriamente (30% de probabilidad) si aparece una
                moneda en el hueco; si aparece se añade a{" "}
                <code>CoinsGroup</code>. - Se crea un rectángulo invisible (
                <code>ScoreCollider</code>) que ocupa el hueco vertical. Cuando
                el pájaro lo atraviesa ocurre el overlap que suma un punto (eso
                lo configuramos en la sección 8). - Finalmente, todas las piezas
                se agregan a <code>PipeGroup</code> y la columna completa se
                guarda en
                <code>this.Pipes</code> para su gestión.
            </p>

            <h3 className="text-3xl font-semibold mt-6">
                15) increaseDifficulty() — la curva de dificultad
            </h3>
            <div className="my-6">
                <CodeSnippet code={s15} name="increaseDifficulty()" />
            </div>
            <p className="text-lg my-6">
                Cada vez que se recoge una moneda o se pasa por un hueco, se
                llama a esta función para hacer el juego un poco más difícil: -
                Aumenta la velocidad de desplazamiento de las tuberías (hasta un
                máximo), - Reduce el tamaño del hueco (<code>Gap</code>) hasta
                un límite mínimo. Así el juego se vuelve progresivamente más
                desafiante.
            </p>

            <br />
        </section>
    );
}
