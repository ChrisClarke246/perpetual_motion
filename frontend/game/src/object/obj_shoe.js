import { SuperObject } from './super_object.js';

export class OBJ_Shoe extends SuperObject {
    constructor() {
        super();
        this.name = "Shoe";  // Set the name to "Shoe"
        this.image = new Image();  // Create a new Image object
        this.image.src = 'assets/objects/shoe.png';  // Set the image source (make sure to update the path)
    }
}
