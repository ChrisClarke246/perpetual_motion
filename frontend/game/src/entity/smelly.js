import {Entity} from './entity.js';

export class Smelly extends Entity {
    constructor(gamePanel, x, y, idx) {
        super(); // Call the parent Entity constructor
        this.gp = gamePanel;
        this.enemyIdx = idx;

        // Initialize the starting positions
        this.startX = x;
        this.startY = y;
        this.worldX = this.startX;
        this.worldY = this.startY;

        this.speed = 4;
        this.alive = true;
        this.onGround = false;
        this.jumpStrength = -15;
        this.coolDown = 60 * 2;
        this.timer = 0;


        this.smellidx1 = this.gp.maxNumObjects;
        this.smell1x = 0;

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
    }

    getEnemyImage(effect) {
        this.left1 = new Image();
        this.left2 = new Image();
        this.right1 = new Image();
        this.right2 = new Image();

        this.left1.src = `assets/enemy/Smelly_${effect}_left1.png`;
        this.left2.src = `assets/enemy/Smelly_${effect}_left2.png`;
        this.right1.src = `assets/enemy/Smelly_${effect}_right1.png`;
        this.right2.src = `assets/enemy/Smelly_${effect}_right2.png`;

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
        if (!this.alive) {
            this.gp.aSetter.removeNpc(this.enemyIdx);
            return;
        }
    
        // Adjust speed and jump strength based on game phase
        if (this.gp.getGamePhase() === this.gp.GamePhase.THREE) {
            this.speed = 5;
            this.jumpStrength = -14;
        } else if (this.gp.getGamePhase() === this.gp.GamePhase.TWO) {
            this.speed = 4;
            this.jumpStrength = -13;
        } else if (this.gp.getGamePhase() === this.gp.GamePhase.ONE) {
            this.speed = 4;
            this.jumpStrength = -15;
        }
    
        // Reset collision flags
        this.collisionOnX = false;
    
        // Check horizontal collisions
        this.gp.cChecker.checkHorizontalCollision(this);
    
        // Handle jumping behavior if a jump is in progress
        if (this.timer > 0 && this.timer < this.coolDown - 10) {
            // Jumping and falling logic
            if (!this.onGround) {
                this.worldY += this.velocityY;
                this.velocityY += this.gravity;
    
                // If the enemy has landed back at startY, reset state to walking
                if (this.worldY >= this.startY) {
                    this.worldY = this.startY;  // Reset to the startY position after the jump
                    //this.onGround = true;       // Mark that the enemy has landed
                    this.timer = 0;
                }
            }
            // console.log(`timer: ${this.timer}`);
        } else {
            if (this.collisionOnX) {
                if (this.timer === 0 && this.onGround) {
                    // Start timer and prepare to jump
                    this.timer = 1;                // Start timer for jump cooldown
                    this.velocityY = this.jumpStrength;  // Apply jump strength
                    this.onGround = false;         // Mark the enemy as off the ground (in the air)
                }
                else{ // if (this.timer === this.coolDown)
                    // switch direction and move a little to avoid further collision
                    this.onGround = true;
                    this.worldY = this.startY;
                    if (this.directionX === "left") {
                        this.directionX = "right";
                        this.worldX += this.speed;
                    } else if (this.directionX === "right") {
                        this.directionX = "left";
                        this.worldX -= this.speed;
                    }
                }
            } else {
                if (this.directionX === "left") {
                    if (this.worldX - this.speed > 0) {

                        this.placeStench();
                        
                        this.worldX -= this.speed;  // Move left
                    } else {
                        this.directionX = "right";  // Switch to right if hitting the left boundary
                    }
                } else if (this.directionX === "right") {
                    if (this.worldX + this.speed < (this.gp.maxWorldCol - 1) * this.gp.tileSize) {
                       
                        this.placeStench();

                        this.worldX += this.speed;  // Move right
                    } else {
                        this.directionX = "left";  // Switch to left if hitting the right boundary
                    }
                }
            }
    
            // Update sprite animation
            if (!this.collisionOnX) {
                this.spriteCounter++;
                if (this.spriteCounter > 30) {
                    this.spriteNum = (this.spriteNum + 1) % 2;
                    this.spriteCounter = 0;
                }
            } else {
                this.spriteNum = 0;  // Reset to idle if not moving
            }
        }
    }

    placeStench(){
        if (this.smellidx1 >= this.gp.maxNumObjects && this.gp.freeObjectIdx.length > 0){
            this.smellidx1 = this.gp.freeObjectIdx.shift();
            this.smell1x = this.worldX;
            this.gp.aSetter.placeSmell(this.smell1x, this.startY);
        }
        else{
            if (Math.abs(this.worldX - this.smell1x) >= 2 * this.gp.tileSize){
                this.gp.aSetter.removeObj(this.smellidx1)
                this.smellidx1 = this.gp.maxNumObjects
            }

        }
    }
        

    draw(ctx) {
        let image = null;
        switch (this.directionX) {
            case "left":
                image = this.spriteNum === 1 ? this.left2 : this.left1;
                break;
            case "right":
                image = this.spriteNum === 1 ? this.right2 : this.right1;
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