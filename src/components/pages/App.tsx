import ProjectStructure from "../ProjectStructure";
import FlappyBirdDoc from "../MinigameExplain";
import { MobileRedirectSimple } from "../mobileRedirect";

function App() {
    return (
        <div className="w-full h-min-screen  text-white lg:p-40  sm:p-20 p-10 select-none">
            <MobileRedirectSimple to="/game.html" />
            <h1 className="text-6xl font-bold">Foca pou</h1>

            <section className="mt-10 bg-gray-950/30 rounded-3xl p-10 h-fu">
                <p className="text-2xl">
                    Este es un juego inspirado en <strong>Pou</strong>, donde
                    cuidarás una mascota virtual que interactúa con distintas
                    habitaciones.
                    <br />
                    <br />
                    Este proyecto fue desarrollado usando{" "}
                    <code className="text-orange-500">Phaser 3</code> y{" "}
                    <code className="text-purple-600">Vite</code>.
                    <br />
                    <br />
                    <strong className="text-orange-500">Phaser 3</strong> es un
                    basado en JavaScript que utiliza HTML5 para renderizar,
                    aprovechando tecnologías como <em>Canvas</em> y{" "}
                    <em>WebGL</em> para ofrecer animaciones fluidas y
                    experiencias interactivas en el navegador.
                    <br />
                    <br />
                    <strong className="text-purple-600">Vite</strong> es un web
                    que permite crear aplicaciones rápidas y eficientes usando
                    JavaScript o TypeScript. En este ejemplo utilizamos React
                    junto con TypeScript, un superconjunto de JavaScript que
                    agrega tipos estáticos a variables y funciones, haciendo el
                    código más seguro, escalable y fácil de mantener.
                    <br />
                    <br />
                </p>

                <br />
                <br />
                <ProjectStructure />
                <FlappyBirdDoc />
            </section>
        </div>
    );
}

export default App;
