export class Sound {
    constructor() {
        // Store multiple sound file URLs
        this.soundURLs = [];
        this.soundURLs[0] = "assets/sounds/world_music.wav"; // Example path for the sound file

        this.audio = null; // This will hold the current Audio object
    }

    // Set the sound file based on the index
    setFile(i) {
        try {
            this.audio = new Audio(this.soundURLs[i]);
        } catch (e) {
            //console.error("Error loading sound file:", e);
        }
    }

    // Play the sound
    play() {
        if (this.audio) {
            this.audio.play();
        }
    }

    // Loop the sound continuously
    loop() {
        if (this.audio) {
            this.audio.loop = true; // Set loop attribute to true
            this.audio.play();
        }
    }

    // Stop the sound
    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0; // Reset the sound to the start
        }
    }
}
