import { SuperObject } from './super_object.js';

export class OBJ_BeachBall extends SuperObject {
    constructor() {
        super();
        this.name = "BeachBall";  // Set the name to "BeachBall"
        this.image = new Image();  // Create a new Image object
        this.image.src = 'assets/objects/beach_ball.png';  // Set the image source (make sure to update the path)
    }
}
