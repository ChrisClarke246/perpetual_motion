export class SuperObject {
    constructor() {
        this.image = null;          // Will hold an instance of Image
        this.name = "";             // Name of the object
        this.collision = false;     // Default collision value
        this.worldX = 0;            // X coordinate in the world
        this.worldY = 0;            // Y coordinate in the world
        this.hitBox = { x: 0, y: 0, width: 48, height: 48 };  // Rectangle hitbox with default size
        this.hitBoxDefaultX = 0;    // Default X position for the hitbox
        this.hitBoxDefaultY = 0;    // Default Y position for the hitbox
    }

    draw(ctx, gp, idx) {
        const screenX = this.worldX - gp.player.worldX + gp.player.screenX;
        const screenY = this.worldY - gp.player.worldY + gp.player.screenY;

        // Draw the object only if it's within the visible screen area
        if (screenX + gp.tileSize > 0 && screenX < gp.screenWidth &&
            screenY + gp.tileSize > 0 && screenY < gp.screenHeight) {
            ctx.drawImage(this.image, screenX, screenY, gp.tileSize, gp.tileSize);
        } 
        // If the object is behind or out of visible bounds, remove it
        else if (screenX + gp.tileSize < 0 || screenY + gp.tileSize < 0 || screenY > gp.screenHeight) {
            gp.aSetter.removeObj(idx);
        }
    }
}
