export class KeyHandler {
    constructor() {
        // Boolean variables to track key states
        this.upPressed = false;
        this.downPressed = false;
        this.leftPressed = false;
        this.rightPressed = false;
        this.enterPressed = false;

        // Bind key listeners
        this.bindListeners();
    }

    bindListeners() {
        // Listen for keydown and keyup events
        window.addEventListener('keydown', (e) => this.keyPressed(e));
        window.addEventListener('keyup', (e) => this.keyReleased(e));
    }

    keyPressed(e) {
        const code = e.code;  // 'ArrowUp', 'ArrowDown', 'ArrowLeft', etc.

        if (code === 'ArrowUp' || code === 'Space') {
            this.upPressed = true;
        }
        if (code === 'ArrowDown') {
            this.downPressed = true;
        }
        if (code === 'ArrowLeft') {
            this.leftPressed = true;
        }
        if (code === 'ArrowRight') {
            this.rightPressed = true;
        }
        if (code === 'Enter') {
            this.enterPressed = true;
        }
    }

    keyReleased(e) {
        const code = e.code;

        if (code === 'ArrowUp' || code === 'Space') {
            this.upPressed = false;
        }
        if (code === 'ArrowDown') {
            this.downPressed = false;
        }
        if (code === 'ArrowLeft') {
            this.leftPressed = false;
        }
        if (code === 'ArrowRight') {
            this.rightPressed = false;
        }
        if (code === 'Enter') {
            this.enterPressed = false;
        }
    }
}
