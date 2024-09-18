import { SuperObject } from './super_object.js';

export class OBJ_Donut extends SuperObject {
    constructor() {
        super();
        this.name = "Donut";  // Set the name to "Donut"
        this.image = new Image();  // Create a new Image object
        this.image.src = 'assets/objects/donut.png';  // Set the image source (update this path to where the donut image is located)
    }
}
