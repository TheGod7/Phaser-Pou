export default [
    {
        key: "CharacterEyes",
        type: "SpriteSheet",
        image: "/assets/ui/character/eyes.png",
        frameConfig: {
            frameWidth: 122,
            frameHeight: 122,
        },
    },
    {
        key: "CharacterAnimationSpriteSheet",
        type: "SpriteSheet",
        image: "/assets/ui/character/CharacterAnim.png",
        frameConfig: {
            frameWidth: 1024,
            frameHeight: 1024,
        },
    },
    {
        key: "CharacterWithoutEyes",
        type: "SpriteSheet",
        image: "/assets/ui/character/CharacterWithoutEyes.png",
        frameConfig: {
            frameWidth: 1024,
            frameHeight: 1024,
        },
    },
    {
        key: "SwimmingCharacter",
        type: "SpriteSheet",
        image: "/assets/ui/character/SwimmingCharacter.png",
        frameConfig: {
            frameWidth: 400,
            frameHeight: 400,
        },
    },
    {
        key: "Swim",
        type: "Animation",
        spriteSheet: "SwimmingCharacter",
        frameNumber: {
            start: 0,
            end: 14,
        },
        frameRate: 10,
        loop: true,
    },
    {
        key: "MouthOpen",
        type: "Animation",
        spriteSheet: "CharacterWithoutEyes",
        frameNumber: {
            start: 0,
            end: 3,
        },
    },
    {
        key: "MouthClose",
        type: "Animation",
        spriteSheet: "CharacterWithoutEyes",
        frameRate: 30,

        frameNumber: {
            start: 3,
            end: 0,
        },
    },
    {
        key: "MouthOpen2",
        type: "Animation",
        spriteSheet: "CharacterWithoutEyes",
        frameNumber: {
            start: 0,
            end: 3,
        },
    },
    {
        key: "MouthClose2",
        type: "Animation",
        spriteSheet: "CharacterWithoutEyes",
        frameRate: 30,
        frameNumber: {
            start: 3,
            end: 0,
        },
    },
    {
        key: "eat",
        type: "Animation",
        spriteSheet: "CharacterAnimationSpriteSheet",
        frameNumber: {
            start: 18,
            end: 31,
        },
    },
    {
        key: "eat2",
        type: "Animation",
        spriteSheet: "CharacterAnimationSpriteSheet",
        frameNumber: {
            start: 31,
            end: 18,
        },
    },
    {
        key: "NoEat",
        type: "Animation",
        spriteSheet: "CharacterAnimationSpriteSheet",
        frameNumber: {
            start: 54,
            end: 70,
        },
    },
    {
        key: "SleepStart",
        type: "Animation",
        spriteSheet: "CharacterAnimationSpriteSheet",
        frameRate: 7,
        frameNumber: {
            start: 73,
            end: 86,
        },
    },
    {
        key: "SleepEnd",
        type: "Animation",
        spriteSheet: "CharacterAnimationSpriteSheet",
        frameRate: 9,
        frameNumber: {
            start: 86,
            end: 73,
        },
    },
    {
        key: "SleepLoop",
        type: "Animation",
        spriteSheet: "CharacterAnimationSpriteSheet",
        frameRate: 5,
        frameNumber: {
            start: 86,
            end: 78,
        },
    },
    {
        key: "SleepLoop2",
        type: "Animation",
        spriteSheet: "CharacterAnimationSpriteSheet",
        frameRate: 5,
        frameNumber: {
            start: 79,
            end: 86,
        },
    },
    {
        key: "NoEat2",
        type: "Animation",
        spriteSheet: "CharacterAnimationSpriteSheet",
        frameNumber: {
            start: 70,
            end: 54,
        },
    },
    {
        type: "Audio",
        key: "EatSound",
        audio: "/public/assets/sfx/character/eat.wav",
    },

    {
        type: "Audio",
        key: "NoSound",
        audio: "/public/assets/sfx/character/no.wav",
    },
] as AssetsElement[];
