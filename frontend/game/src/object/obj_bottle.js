import { SuperObject } from './super_object.js';

export class OBJ_Bottle extends SuperObject {
    constructor() {
        super();
        this.name = "Bottle";  // Set the name to "Bottle"
        this.image = new Image();  // Create a new Image object
        this.image.src = 'assets/objects/bottle.png';  // Set the image source (update this path to where the donut image is located)
    }
}
