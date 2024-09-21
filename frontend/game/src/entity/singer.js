import {Entity} from './entity.js';

export class Singer extends Entity {
    constructor(gamePanel, x, y, idx) {
        super(); // Call the parent Entity constructor
        this.gp = gamePanel;
        this.enemyIdx = idx;

        // Initialize the starting positions
        this.startX = x;
        this.startY = y;
        this.worldX = this.startX;
        this.worldY = this.startY;

        this.alive = true;
        this.onGround = false;

        this.sing = true;
        this.singCooldown = 60 * 3;
        this.timer = 0;
        this.range = 10;

        // Set the hitbox
        this.hitBoxDefaultX = this.gp.tileSize / 3;
        this.hitBoxDefaultY = 0;

        // Initialize the hitbox
        this.hitBox = {
            x: this.hitBoxDefaultX,
            y: this.hitBoxDefaultY,
            width: this.gp.tileSize / 4,
            height: this.gp.tileSize
        };

        this.getEnemyImage("normal");
        this.image = this.left1;
    }

    getEnemyImage(effect) {
        this.left1 = new Image();
        this.left2 = new Image();
        this.right1 = new Image();
        this.right2 = new Image();

        this.left1.src = `assets/enemy/singer_${effect}_left1.png`;
        this.left2.src = `assets/enemy/singer_${effect}_left2.png`;
        this.right1.src = `assets/enemy/singer_${effect}_right1.png`;
        this.right2.src = `assets/enemy/singer_${effect}_right2.png`;

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
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, this.gp.tileSize, this.gp.tileSize);
        return placeholder;
    }

    update() {
        if (this.gp.getGamePhase() === this.gp.GamePhase.THREE) {
	        this.range = 13;
	    } else if (this.gp.getGamePhase() === this.gp.GamePhase.TWO) {
	        this.range = 12;
	    } else if (this.gp.getGamePhase() === this.gp.GamePhase.ONE) {
	        this.range = 11;
	    }
        // Increment the timer
        if (this.timer > 0 && this.timer < this.singCooldown) {
            this.timer++;
        } else {
            this.timer = 1;  // Reset the timer after cooldown
            this.sing = true;  // Reset the singing flag for the next cycle
        }
    
        // Determine the direction based on player position
        if (this.gp.player.worldX < this.worldX) {
            this.directionX = "left";
        } else {
            this.directionX = "right";
        }
    
        // Place voice when the timer is near the end of the cooldown
        if (this.timer > this.singCooldown - 10 && this.sing) {
            // only shoot if the player is in range
            if ((Math.abs(this.worldX - this.gp.player.worldX)) < (this.range * this.gp.tileSize))
            this.gp.aSetter.placeVoice(this.worldX, this.worldY - (this.gp.tileSize / 2));
            this.sing = false;  // Prevent repeated voice placement until the next cycle
        }
    
        // Change the enemy's appearance based on the timer
        if (this.timer > this.singCooldown / 2) {
            switch (this.directionX) {
                case "left":
                    this.image = this.left2;
                    break;
                case "right":
                    this.image = this.right2;
                    break;
                default:
                    this.image = this.left2;
            }
        } else {
            switch (this.directionX) {
                case "left":
                    this.image = this.left1;
                    break;
                case "right":
                    this.image = this.right1;
                    break;
                default:
                    this.image = this.left1;
            }
        }
    }
    

    draw(ctx) {
        let image = this.image;

        // Calculate screen position based on player's position
        const screenX = this.worldX - this.gp.player.worldX + this.gp.player.screenX;
        const screenY = this.worldY - this.gp.player.worldY + this.gp.player.screenY;

        // Only draw the enemy if it is within the visible screen area
        if (
            screenX + this.gp.tileSize > 0 &&
            screenX < this.gp.screenWidth &&
            screenY + this.gp.tileSize > 0 &&
            screenY < this.gp.screenHeight
        ) {
            ctx.drawImage(image, screenX, screenY, this.gp.tileSize, this.gp.tileSize);
        } else if (screenX + this.gp.tileSize < 0) {
            this.gp.aSetter.removeNpc(this.enemyIdx);
        }
    }
}