export const PouStates = {
    health: 100,
    hunger: 100,
    energy: 100,
    money: 99999,
};

export type Backgrounds = "RoomBackground1" | "RoomBackground2";

interface config {
    Background: Backgrounds;
    volume: number;
}

export const PouConfig: config = {
    volume: 100,
    Background: "RoomBackground1",
};

export interface FoodsStatsInterface {
    price: number;
    hunger: number;
}

export const MiniGames = ["FoodDrop", "FlappyBird", "MemoryMatch"];

export type FoodTypes =
    | "pulpo"
    | "red_de_pesca"
    | "cangrejo"
    | "cangrejo_negro"
    | "camaron"
    | "pescado"
    | "plastico"
    | "langosta"
    | "anguila";

export const FoodsStats: Record<FoodTypes, FoodsStatsInterface> = {
    pulpo: {
        price: 10,
        hunger: 15,
    },

    pescado: {
        price: 10,
        hunger: 20,
    },
    anguila: {
        price: 10,
        hunger: 20,
    },
    langosta: {
        price: 10,
        hunger: 10,
    },
    camaron: {
        price: 10,
        hunger: 10,
    },
    cangrejo: {
        price: 10,
        hunger: 15,
    },
    cangrejo_negro: {
        price: 10,
        hunger: 15,
    },
    plastico: {
        price: 15,
        hunger: -20,
    },
    red_de_pesca: {
        price: 666,
        hunger: -666,
    },
};

export const Foods: FoodTypes[] = [
    "pulpo",
    "red_de_pesca",
    "cangrejo",
    "cangrejo_negro",
    "camaron",
    "pescado",
    "plastico",
    "langosta",
    "anguila",
];
