import {Entity} from './entity.js';

export class Anchor extends Entity {
    constructor(gamePanel, x, y, jumpDistance, idx) {
        super(); // Call the parent Entity constructor
        this.gp = gamePanel;
        this.enemyIdx = idx;

        // Initialize the starting positions
        this.startX = x;
        this.startY = y;
        this.worldX = this.startX;
        this.worldY = this.startY;

        this.speed = 2;
        this.alive = true;
        this.onGround = false;

        // Set the hitbox
        this.hitBoxDefaultX = this.gp.tileSize / 3;
        this.hitBoxDefaultY = 0;

        this.jumpDistance = jumpDistance; // The fixed horizontal distance the enemy jumps each time
        this.jumpStrength = -10;
        this.jumpCooldown = 60;

        this.directionX = "left";
        this.directionY = "down";
        // Initialize the hitbox
        this.hitBox = {
            x: this.hitBoxDefaultX,
            y: this.hitBoxDefaultY,
            width: this.gp.tileSize / 4,
            height: this.gp.tileSize
        };

        this.getEnemyImage("normal");

    }

    getEnemyImage(effect) {
        this.left1 = new Image();
        this.left2 = new Image();
        this.right1 = new Image();
        this.right2 = new Image();

        this.left1.src = `assets/enemy/anchor_${effect}_left1.png`;
        this.left2.src = `assets/enemy/anchor_${effect}_left2.png`;
        this.right1.src = `assets/enemy/anchor_${effect}_right1.png`;
        this.right2.src = `assets/enemy/anchor_${effect}_right2.png`;

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
        // Update the cooldown timer
        if (this.jumpCooldown > 0) {
            this.jumpCooldown--; // Decrease cooldown each frame
        }
    
        const canJumpRight = this.directionX === "right" && (this.worldX + this.jumpDistance < (this.gp.maxWorldCol - 1) * this.gp.tileSize);
        const canJumpLeft = this.directionX === "left" && (this.worldX - this.jumpDistance > 0);
        const canJump = (canJumpRight || canJumpLeft) && this.jumpCooldown === 0; // Allow jump only if cooldown is over
    
        // If the enemy is defeated, remove it and place a shoe
        if (!this.alive) {
            this.gp.aSetter.removeNpc(this.enemyIdx);
            this.gp.aSetter.placeShoe(this.worldX, this.worldY);
            return;
        }
    
        // Adjust speed based on game phase for vertical movement
        if (this.gp.getGamePhase() === this.gp.GamePhase.THREE) {
            this.speed = 4;
        } else if (this.gp.getGamePhase() === this.gp.GamePhase.TWO) {
            this.speed = 3;
        } else if (this.gp.getGamePhase() === this.gp.GamePhase.ONE) {
            this.speed = 2;
        }
    
        // Reset collision flags
        this.collisionOnY = false;
        this.gp.cChecker.checkVerticalCollision(this);

        // Check if the enemy can jump
        if (canJump) {
            // Check if the enemy is on the ground and can start a jump
            if (this.onGround) {
                // Predict the new position after the jump based on direction and jumpDistance
                this.targetX = this.directionX === "left" ? this.worldX - this.jumpDistance : this.worldX + this.jumpDistance;
    
                // Only jump if the future position is within bounds
                if (this.targetX >= 0 && this.targetX < (this.gp.maxWorldCol - 1) * this.gp.tileSize) {
                    // Reverse direction after setting target for the jump, but only if cooldown is 0
                    if (this.directionX === "left") {
                        this.directionX = "right";
                    } else if (this.directionX === "right") {
                        this.directionX = "left";
                    }
    
                    // Initiate the jump
                    this.velocityY = this.jumpStrength;
                    this.jumping = true; // Mark that the enemy is in a jump
                    this.onGround = false;
                    // Set the jumpCooldown to prevent immediate direction switching
                    this.jumpCooldown = 60; // Adjust this value to control cooldown duration (e.g., 60 frames)
                }
            }
        }
    
        // Horizontal movement: Move towards the targetX gradually during the jump
        if (this.jumping) {
            // If moving left
            if (this.worldX > this.targetX) {
                this.worldX -= this.speed;
                if (this.worldX < this.targetX) {
                    this.worldX = this.targetX; // Stop exactly at the target
                }
            }
            // If moving right
            else if (this.worldX < this.targetX) {
                this.worldX += this.speed;
                if (this.worldX > this.targetX) {
                    this.worldX = this.targetX; // Stop exactly at the target
                }
            }
    
            // Check if we've reached the targetX
            if (this.worldX === this.targetX) {
                this.jumping = false; // Stop jumping once the target is reached
            }
        }
    
        // Vertical movement: Update worldY based on velocityY (jumping/falling)
        if (!this.onGround) {
            this.directionY = this.velocityY < 0 ? "up" : "down";
            this.worldY += this.velocityY;
            this.velocityY += this.gravity;
        }

    }    
    
    
    draw(ctx) {
        let image = null;
        switch (this.directionX) {
            case "right":
                image = this.directionY === "up" ? this.left2 : this.left1;
                
                break;
            case "left":
                image = this.spriteNum === "up" ? this.right2 : this.right1;
                break;
            default:
                image = this.right1;  // Default to right
                break;
        }

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
