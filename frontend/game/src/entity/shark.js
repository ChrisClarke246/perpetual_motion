import {Entity} from './entity.js';

export class Shark extends Entity {
    constructor(gamePanel, x, y, idx) {
        super(); // Call the parent Entity constructor
        this.gp = gamePanel;

        this.enemyIdx = idx;

        // Initialize the starting positions
        this.startX = x;
        this.startY = y;
        this.worldX = this.startX;
        this.worldY = this.startY;
        this.jumpStrength = -20;
        this.directionY = "up";

        this.speed = 4;
        this.alive = true;
        this.onGround = false;

        // Set the hitbox
        this.hitBoxDefaultX = this.gp.tileSize / 3;
        this.hitBoxDefaultY = 0;
        this.holeWaterHeightY = this.gp.groundHeight + (2 * this.gp.tileSize);
        this.diveDepth = this.holeWaterHeightY + (2 * this.gp.tileSize); // dive 2 tiles below ground height

        // Initialize the hitbox
        this.hitBox = {
            x: this.hitBoxDefaultX,
            y: this.hitBoxDefaultY,
            width: this.gp.tileSize / 4,
            height: this.gp.tileSize
        };

        this.getSharkImage("normal");
    }

    getSharkImage(effect) {
        this.left1 = new Image();
        this.left2 = new Image();
        this.right1 = new Image();
        this.right2 = new Image();

        this.left1.src = `assets/enemy/shark_${effect}_left1.png`;
        this.left2.src = `assets/enemy/shark_${effect}_left2.png`;
        this.right1.src = `assets/enemy/shark_${effect}_right1.png`;
        this.right2.src = `assets/enemy/shark_${effect}_right2.png`;

        // Fallback if images fail to load
        this.left1.onerror = () => this.getPlaceholderImage();
        this.left2.onerror = () => this.getPlaceholderImage();
        this.right1.onerror = () => this.getPlaceholderImage();
        this.right2.onerror = () => this.getPlaceholderImage();
    }

    getPlaceholderImage() {
        const placeholder = document.createElement('canvas');
        placeholder.width = 32;
        placeholder.height = 32;
        const ctx = placeholder.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, this.gp.tileSize, this.gp.tileSize);
        return placeholder;
    }

    update() {
        // If the shark is dead, remove it from the game
        if (!this.alive) {
            this.gp.aSetter.removeNpc(this.enemyIdx);
            return;  // Exit update if shark is dead
        }

        // Adjust speed based on game phase
        if (this.gp.getGamePhase() === this.gp.GamePhase.THREE) {
            this.jumpStrength = -25;
        } else if (this.gp.getGamePhase() === this.gp.GamePhase.TWO) {
            this.jumpStrength = -23;
        } else if (this.gp.getGamePhase() === this.gp.GamePhase.ONE) {
            this.jumpStrength = -20;
        }

        // Handle diving and jumping logic
        if (this.velocityY > 0 && this.worldY >= this.diveDepth) {
            this.velocityY = this.jumpStrength;  // Jump back up
        } else {
            // Apply gravity when not jumping
            this.velocityY += this.gravity;
        }

        // Cap the falling speed
        if (this.velocityY > this.maxFallSpeed) {
            this.velocityY = this.maxFallSpeed;
        }

        // Set the vertical direction based on velocity
        this.directionY = (this.velocityY < 0) ? "up" : "down";

        // Move vertically
        this.worldY += this.velocityY;
		
        // Update sprite animation
        this.spriteCounter++;
        if (this.spriteCounter > 30) {
            this.spriteNum = (this.spriteNum + 1) % 2;  // Alternate between two sprites
            this.spriteCounter = 0;
        }
    }

    draw(ctx) {
        let image = null;

        // Determine which image to use based on direction
        if (this.directionY === "up") {
            image = this.spriteNum === 1 ? this.left2 : this.left1;
        } else if (this.directionY === "down") {
            image = this.spriteNum === 1 ? this.right2 : this.right1;
        }

        // Calculate screen position relative to the player
        const screenX = this.worldX - this.gp.player.worldX + this.gp.player.screenX;
        const screenY = this.worldY - this.gp.player.worldY + this.gp.player.screenY;

        const screenWaterHeightY = this.holeWaterHeightY - this.gp.player.worldY + this.gp.player.screenY;

        // Draw the shark if it's within the visible screen area and above the water level
        if (
            screenX + this.gp.tileSize > 0 &&
            screenX < this.gp.screenWidth &&
            screenY + this.gp.tileSize > 0 &&
            screenY <= screenWaterHeightY
        ) {
            ctx.drawImage(image, screenX, screenY, this.gp.tileSize, this.gp.tileSize);
        } else if (screenX + this.gp.tileSize < 0) {
            this.gp.aSetter.removeNpc(this.enemyIdx);  // Remove the shark if it is out of bounds
        }
    }
}
