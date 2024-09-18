import {Entity} from './entity.js';

export class Bird extends Entity {
    constructor(gamePanel, x, y, flightDistance, idx) {
        super(); // Call parent Entity constructor
        this.gp = gamePanel;

        this.enemyIdx = idx;

        // Initialize the starting positions
        this.startX = x;
        this.startY = y;
        this.worldX = this.startX;
        this.worldY = this.startY;
        this.jumpStrength = -20;
        this.directionX = "left";
        this.flightDistance = flightDistance;

        this.speed = 4;
        this.alive = true;
        this.onGround = false;

        // Set the hitbox
        this.hitBoxDefaultX = 3 * (this.gp.tileSize / 4);
        this.hitBoxDefaultY = this.gp.tileSize / 3;
        this.hitBox = {
            x: this.hitBoxDefaultX,
            y: this.hitBoxDefaultY,
            width: this.gp.tileSize / 6,
            height: this.gp.tileSize / 4
        };

        this.getBirdImage("normal");
    }

    getBirdImage(effect) {
        this.left1 = new Image();
        this.left2 = new Image();
        this.right1 = new Image();
        this.right2 = new Image();

        this.left1.src = `assets/enemy/bird_normal_left1.png`;  // Adjust path as necessary
        this.left2.src = `assets/enemy/bird_normal_left2.png`;
        this.right1.src = `assets/enemy/bird_normal_right1.png`;
        this.right2.src = `assets/enemy/bird_normal_right2.png`;

        // Fallback if images fail to load
        this.left1.onerror = () => this.getPlaceholderImage();
        this.left2.onerror = () => this.getPlaceholderImage();
        this.right1.onerror = () => this.getPlaceholderImage();
        this.right2.onerror = () => this.getPlaceholderImage();
    }

    getPlaceholderImage() {
        const placeholder = document.createElement("canvas");
        placeholder.width = 32;
        placeholder.height = 32;
        const ctx = placeholder.getContext("2d");
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, this.gp.tileSize, this.gp.tileSize);
        return placeholder;
    }

    update() {
        // If the bird is not alive, remove it from the game
        if (!this.alive) {
            this.gp.aSetter.removeNpc(this.enemyIdx);
            return;  // Exit update if bird is dead
        }

        // Adjust speed based on game phase
        if (this.gp.getGamePhase() === this.gp.GamePhase.THREE) {
            this.speed = 7;
        } else if (this.gp.getGamePhase() === this.gp.GamePhase.TWO) {
            this.speed = 6;
        } else if (this.gp.getGamePhase() === this.gp.GamePhase.ONE) {
            this.speed = 5;
        }

        // Handle horizontal movement based on direction
        if (this.directionX === "left") {
            if (this.worldX - this.speed > this.startX - this.flightDistance) {
                this.worldX -= this.speed;  // Move left
            } else {
                this.directionX = "right";  // Switch direction at boundary
            }
        } else if (this.directionX === "right") {
            if (this.worldX + this.speed < this.startX + this.flightDistance &&
                this.worldX + this.speed < (this.gp.maxWorldCol - 1) * this.gp.tileSize) {
                this.worldX += this.speed;  // Move right
            } else {
                this.directionX = "left";  // Switch direction at boundary
            }
        }

        // Update sprite animation
        this.spriteCounter++;
        if (this.spriteCounter > 30) {
            this.spriteNum = (this.spriteNum + 1) % 2;  // Switch between two sprites
            this.spriteCounter = 0;
        }
    }

    draw(ctx) {
        let image = null;

        // Determine which image to use based on direction and sprite number
        if (this.directionX === "left") {
            image = this.spriteNum === 1 ? this.left2 : this.left1;
        } else if (this.directionX === "right") {
            image = this.spriteNum === 1 ? this.right2 : this.right1;
        }

        // Calculate screen position relative to player
        const screenX = this.worldX - this.gp.player.worldX + this.gp.player.screenX;
        const screenY = this.worldY - this.gp.player.worldY + this.gp.player.screenY;

        // Draw the bird only if it's within the visible screen area
        if (screenX + this.gp.tileSize > 0 && screenX < this.gp.screenWidth &&
            screenY + this.gp.tileSize > 0 && screenY < this.gp.screenHeight) {
            ctx.drawImage(image, screenX, screenY, this.gp.tileSize, this.gp.tileSize);
        } else if (screenX + this.gp.tileSize < 0 || screenY + this.gp.tileSize < 0 || screenY > this.gp.screenHeight) {
            this.gp.aSetter.removeNpc(this.enemyIdx);  // Remove the bird if it's out of bounds
        }
    }
}
