import Phaser from "phaser";
import { ImgButton } from "../ImageButton";
import * as Tone from "tone";
import { soundManager } from "../utils/sound";
import { RoomsManager } from "../../../scenes/Rooms/Rooms";

const silenceThreshold = 0.05;
const silenceDuration = 2000;
const maxRecordingTime = 20000;

let audioChunks: BlobPart[] = [];

export class LivingRoomMenu extends Phaser.GameObjects.Container {
    name: string = "LivingRoomMenu";

    microActivated: boolean = false;
    microImage: ImgButton;

    recording: boolean = false;
    cancelRecording: boolean = false;

    mic: Tone.UserMedia;
    pitchShift: Tone.PitchShift;
    dest: MediaStreamAudioDestinationNode;
    analyser: AnalyserNode;

    DataArray: Uint8Array<ArrayBuffer>;
    bufferLength: number;

    lastSoundTime: number;
    mediaRecorder: MediaRecorder;

    TalkingSound: Phaser.Sound.BaseSound | undefined;

    mute: boolean = false;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, scene.scale.height);

        scene.add.existing(this);

        const MenuSizer = scene.rexUI.add.sizer({
            width: scene.scale.width,
            height: 140,
            x: 0,
            y: 0,
            orientation: "horizontal",
            space: {
                top: 50,
                bottom: 20,
            },
        });

        const background = scene.add
            .rectangle(0, 0, 0, 0, 0x000, 0.5)
            .setDepth(2);

        MenuSizer.addBackground(background, { top: 70 });

        const microImage = new ImgButton(
            scene,
            () => {
                this.microActivated = !this.microActivated;

                if (!this.microActivated) {
                    microImage.setTint(0x808080);
                    this.mute = true;

                    if (
                        this.mediaRecorder &&
                        this.mediaRecorder.state === "recording"
                    ) {
                        this.mediaRecorder.stop();
                    }
                } else {
                    microImage.clearTint();
                    this.Start();
                    this.mute = false;
                }
            },
            "micro",
            0,
            0,
            65
        ).setDepth(3);

        this.microImage = microImage;

        MenuSizer.addSpace();
        MenuSizer.add(microImage);
        MenuSizer.addSpace();
        MenuSizer.setOrigin(0, 1);
        MenuSizer.layout();

        this.add(MenuSizer);
    }

    Stop() {
        this.microActivated = false;
        this.microImage.heartbeat(this.microActivated);

        this.cancelRecording = true;
        if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
            this.mediaRecorder.stop();
        }

        if (this.mic) {
            this.mic.close();
        }

        if (this.TalkingSound) {
            if (this.TalkingSound.isPlaying) this.TalkingSound.stop();
            this.TalkingSound.destroy();
            this.TalkingSound = undefined;
        }

        if (this.scene.sound.get("RecordingSound")) {
            const sfx = this.scene.sound.get("RecordingSound");
            if (sfx.isPlaying) sfx.stop();
            sfx.destroy();
        }

        if (this.scene.cache.audio.exists("RecordingSound")) {
            this.scene.cache.audio.remove("RecordingSound");
        }

        (this.scene as RoomsManager).character.Talking(false);
    }

    async Start() {
        if (Tone.context.state !== "running") {
            await Tone.start();
        }

        this.microImage.clearTint();
        this.mute = false;
        this.cancelRecording = false;
        this.mic = new Tone.UserMedia();
        await this.mic.open();

        this.pitchShift = new Tone.PitchShift({
            pitch: 8,
        });
        this.dest = this.mic.context.createMediaStreamDestination();

        this.mic.connect(this.pitchShift);
        this.pitchShift.connect(this.dest);

        this.analyser = Tone.context.createAnalyser();
        this.analyser.fftSize = 2048;

        this.pitchShift.connect(this.analyser);
        this.bufferLength = this.analyser.fftSize;
        this.DataArray = new Uint8Array(this.bufferLength);

        this.microActivated = true;
        this.lastSoundTime = Date.now();
    }

    update() {
        if (!this.microActivated || this.TalkingSound || this.mute) return;

        this.analyser.getByteTimeDomainData(this.DataArray);

        let sum = 0;
        for (let i = 0; i < this.bufferLength; i++) {
            const val = (this.DataArray[i] - 128) / 128;
            sum += val * val;
        }

        const volume = Math.sqrt(sum / this.bufferLength);

        if (volume >= silenceThreshold) {
            // Hay sonido
            this.lastSoundTime = Date.now();

            if (!this.recording) {
                this.StartRecording();
            }
        } else {
            // Hay silencio
            if (
                this.recording &&
                Date.now() - this.lastSoundTime > silenceDuration
            ) {
                if (
                    this.mediaRecorder &&
                    this.mediaRecorder.state === "recording"
                ) {
                    this.mediaRecorder.stop();
                }
            }
        }
    }

    async StartRecording() {
        if (this.recording || this.cancelRecording) return;

        this.recording = true;
        audioChunks = [];

        this.microImage.heartbeat(true);

        this.mediaRecorder = new MediaRecorder(this.dest.stream);

        const maxTime = this.scene.time.delayedCall(
            maxRecordingTime,
            () => {
                if (this.recording) {
                    this.mediaRecorder.stop();
                }
            },
            [],
            this
        );

        this.mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                audioChunks.push(e.data);
            }
        };

        this.mediaRecorder.onstop = () => {
            this.recording = false;
            this.mute = true;
            this.microImage.heartbeat(false);
            maxTime.destroy();

            const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
            const blobUrl = URL.createObjectURL(audioBlob);

            if (this.scene.cache.audio.exists("RecordingSound")) {
                this.scene.cache.audio.remove("RecordingSound");
            }

            this.scene.load.audio("RecordingSound", blobUrl);

            this.scene.load.on("complete", () => {
                if (this.cancelRecording) {
                    this.scene.cache.audio.remove("RecordingSound");
                    URL.revokeObjectURL(blobUrl);
                    return;
                }

                if (this.TalkingSound && this.TalkingSound.isPlaying) {
                    this.TalkingSound.stop();
                    this.TalkingSound.destroy();
                }

                this.TalkingSound = soundManager.play(
                    this.scene,
                    "RecordingSound",
                    () => {
                        this.scene.cache.audio.remove("RecordingSound");
                        URL.revokeObjectURL(blobUrl);
                        this.TalkingSound = undefined;
                        this.mute = false;
                        (this.scene as RoomsManager).character.Talking(false);
                    }
                );

                (this.scene as RoomsManager).character.Talking(true);
            });

            this.scene.load.start();
        };

        this.mediaRecorder.start();
    }
}
