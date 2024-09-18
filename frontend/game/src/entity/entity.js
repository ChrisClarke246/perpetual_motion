export class Entity {
    constructor() {
        // Position in the game world
        this.worldX = 0;
        this.worldY = 0;
        this.speed = 0;

        // Jumping and gravity
        this.velocityY = 0;
        this.maxFallSpeed = 10;  // Terminal velocity (maximum fall speed)
        this.gravity = 0.5;      // Gravity force
        this.jumpStrength = -10; // Jump force (negative because up is negative in 2D)
        this.onGround = false;   // To check if the entity is on the ground

        // Image resources (loaded elsewhere, can be replaced with actual image paths)
        this.left1 = new Image();
        this.left2 = new Image();
        this.right1 = new Image();
        this.right2 = new Image();

        this.directionX = "left";
        this.directionY = "down";

        // For sprite animation
        this.spriteCounter = 0;
        this.spriteNum = 1;

        // Hitbox (for collision detection)
        this.hitBox = { x: 0, y: 0, width: 0, height: 0 }; // Use a JavaScript object for hitbox
        this.hitBoxDefaultX = 0;
        this.hitBoxDefaultY = 0;

        this.collisionOnX = false;
        this.collisionOnY = false;
        this.alive = true;
    }

    // Draw the entity on the canvas
    draw(ctx) {
        // Choose the image based on the entity's direction (you can change this as needed)
        let image;
        if (this.directionX === "left") {
            image = this.spriteNum === 1 ? this.left1 : this.left2;
        } else {
            image = this.spriteNum === 1 ? this.right1 : this.right2;
        }

        // Draw the image on the canvas at the entity's world position
        ctx.drawImage(image, this.worldX, this.worldY);
    }

    // Update the entity's position and state
    update() {
        // Overwrite in subclasses for specific behavior
    }
}
