import React from "react";
import ReactDOM from "react-dom/client";
import GameApp from "../components/pages/GameApp.tsx";

import "../../public/style.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <GameApp />
    </React.StrictMode>
);
