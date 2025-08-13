import { useEffect, useState } from "react";
import { PhaserGame } from "../PhaserGame";

function App() {
    const [fontLoaded, setFontLoaded] = useState(false);

    const Font = async () => {
        await document.fonts.load("16px 'Cookies'");
        await document.fonts.ready;
    };

    useEffect(() => {
        if (!fontLoaded) {
            Font().then(() => {
                setFontLoaded(true);
            });
        }
    }, []);
    return <div id="app">{fontLoaded ? <PhaserGame /> : null}</div>;
}

export default App;
