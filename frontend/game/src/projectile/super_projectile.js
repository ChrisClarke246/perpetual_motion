export class SuperProjectile {
    constructor(gamepanel, x, y, idx) {
        this.idx = idx;
        this.image = null;          // Will hold an instance of Image
        this.name = "";             // Name of the object
        this.collision = false;     // Default collision value
        this.worldX = x;            // X coordinate in the world
        this.worldY = y;            // Y coordinate in the world
        this.hitBox = { x: 12, y: 12, width: 24, height: 24 };  // Rectangle hitbox with default size
        this.hitBoxDefaultX = 0;    // Default X position for the hitbox
        this.hitBoxDefaultY = 0;    // Default Y position for the hitbox
        
        this.gp = gamepanel;


        this.gradient = (this.gp.player.worldY - this.worldY) / (this.gp.player.worldY - this.worldY)
        // frames is number of frames to reach target
        this.targetX = this.gp.player.worldX;
        this.speedX = 60;

        this.targetY = this.gp.player.worldY;
        this.speedY = 60;

        this.incrementX = 0;
        this.incrementY = 0;
    }

    draw(ctx) {
        const screenX = this.worldX - this.gp.player.worldX + this.gp.player.screenX;
        const screenY = this.worldY - this.gp.player.worldY + this.gp.player.screenY;

        // Draw the object only if it's within the visible screen area
        if (screenX + this.gp.tileSize > 0 && screenX < this.gp.screenWidth &&
            screenY + this.gp.tileSize > 0 && screenY < this.gp.screenHeight) {
            ctx.drawImage(this.image, screenX, screenY, this.gp.tileSize, this.gp.tileSize);
        } 
        // If the object is behind or out of visible bounds, remove it
        else if (screenX + this.gp.tileSize < 0 || screenY + this.gp.tileSize < 0 || screenY > this.gp.screenHeight) {
            this.gp.aSetter.removeprojectile(this.idx);
        }
    }

    update() {
        // Overwrite in subclasses for specific behavior
    }
}
