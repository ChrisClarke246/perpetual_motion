import { SuperObject } from './super_object.js';

export class OBJ_Smell extends SuperObject {
    constructor() {
        super();
        this.name = "Smell";  // Set the name to "Bottle"
        this.image = new Image();  // Create a new Image object
        this.image.src = 'assets/objects/Smell.png';  // Set the image source (update this path to where the donut image is located)
        
        this.hitBox = { x: 12, y: 12, width: 24, height: 24 };  // Rectangle hitbox with default size
        this.hitBoxDefaultX = 0;    // Default X position for the hitbox
        this.hitBoxDefaultY = 0;    // Default Y position for the hitbox
    
    }
}
