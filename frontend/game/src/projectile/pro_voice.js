import { SuperProjectile } from './super_projectile.js';

export class Pro_Voice extends SuperProjectile {
    constructor(gamepanel, x, y, idx) {
        super(gamepanel, x, y, idx);
        this.name = "Voice";  // Set the name to "Bottle"
        this.image = new Image();  // Create a new Image object
        this.image.src = 'assets/projectiles/voice.png';  // Set the image source (update this path to where the donut image is located)
        
        this.hitBox = { x: 12, y: 12, width: 24, height: 24 };  // Rectangle hitbox with default size
        this.hitBoxDefaultX = 0;    // Default X position for the hitbox
        this.hitBoxDefaultY = 0;    // Default Y position for the hitbox

        this.incrementX = (this.targetX - this.worldX) / this.speedX;
        this.incrementY = (this.targetY - this.worldY) / this.speedY;
    }

    update(){

        if (this.worldX + this.incrementX < (this.gp.maxWorldCol - 1) * this.gp.tileSize
            &&
            this.worldX + this.incrementX > 0
        ){
            this.worldX += this.incrementX;
        }
        else{
            this.gp.aSetter.removeprojectile(this.idx);
        }

        if (this.worldY + this.incrementY < (this.gp.maxWorldRow - 1) * this.gp.tileSize
        &&
            this.worldY + this.incrementY > 0
        ){
            this.worldY += this.incrementY;
        }
        else{
            this.gp.aSetter.removeprojectile(this.idx);
        }   

    }
}