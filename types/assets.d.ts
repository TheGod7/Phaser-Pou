interface BaseAsset {
    key: string;
    type: AssetsTypes;
}

interface ImageAsset extends BaseAsset {
    type: "Image";
    image: string;
}

interface SpriteSheetAsset extends BaseAsset {
    type: "SpriteSheet";
    image: string;
    frameConfig: {
        frameWidth: number;
        frameHeight: number;
    };
}

interface AnimationAsset extends BaseAsset {
    type: "Animation";
    key: string;
    spriteSheet: string;
    frameRate?: number;
    loop?: boolean;
    frameNumber: {
        start: number;
        end: number;
    };
}

interface AudioAsset extends BaseAsset {
    type: "Audio";
    key: string;
    audio: string;
}

type AssetsTypes = "Image" | "SpriteSheet" | "Audio" | "Video" | "Animation";

type AssetsElement =
    | ImageAsset
    | SpriteSheetAsset
    | AnimationAsset
    | AudioAsset;
