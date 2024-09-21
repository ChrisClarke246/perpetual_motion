import {OBJ_Bottle} from './../object/obj_bottle.js';
import {OBJ_Shoe} from './../object/obj_shoe.js';
import {OBJ_Donut} from './../object/obj_donut.js';
import { OBJ_Smell } from '../object/obj_smell.js';

import { Shark } from '../entity/shark.js';
import { Bird } from '../entity/bird.js';
import { Enemy } from '../entity/enemy.js';
import { Anchor } from '../entity/anchor.js';
import { Smelly } from '../entity/smelly.js';

import { Pro_Voice } from '../projectile/pro_voice.js';
import { Singer } from '../entity/singer.js';

export class AssetSetter {
    constructor(gamePanel) {
        this.gp = gamePanel;
    }

    // SET ASSETS

    setObject() {
        // Fill object and NPC queues with available indices
        for (let i = 0; i < this.gp.maxNumObjects; i++) {
            this.gp.freeObjectIdx.push(i);  // Add index to the queue
        }
        for (let i = 0; i < this.gp.maxNumNpcs; i++) {
            this.gp.freeNpcIdx.push(i);  // Add index to the queue
        }
        for (let i = 0; i < this.gp.maxProjectiles; i++) {
            this.gp.freeProjectileIdx.push(i);  // Add index to the queue
        }
    }


    // OBJECTS

    placeSmell(x, y) {
        if (this.gp.freeObjectIdx.length === 0) {
            return;  // No free slots available
        }

        // Get the first free index
        const index = this.gp.freeObjectIdx.shift();  // Get and remove the first free index
        this.gp.obj[index] = new OBJ_Smell();
        this.gp.obj[index].worldX = x;
        this.gp.obj[index].worldY = y;
        this.gp.obj[index].collision = false;
    }

    placeBottle(x, y) {
        if (this.gp.freeObjectIdx.length === 0) {
            return;  // No free slots available
        }

        // Get the first free index
        const index = this.gp.freeObjectIdx.shift();  // Get and remove the first free index
        this.gp.obj[index] = new OBJ_Bottle();
        this.gp.obj[index].worldX = x;
        this.gp.obj[index].worldY = y;
        this.gp.obj[index].collision = false;
    }

    placeDonut(x, y) {
        if (this.gp.freeObjectIdx.length === 0) {
            return;  // No free slots available
        }

        // Get the first free index
        const index = this.gp.freeObjectIdx.shift();  // Get and remove the first free index
        this.gp.obj[index] = new OBJ_Donut();
        this.gp.obj[index].worldX = x;
        this.gp.obj[index].worldY = y;
        this.gp.obj[index].collision = false;
    }

    placeShoe(x, y) {
        if (this.gp.freeObjectIdx.length === 0) {
            return;  // No free slots available
        }

        // Get the first free index
        const index = this.gp.freeObjectIdx.shift();  // Get and remove the first free index
        this.gp.obj[index] = new OBJ_Shoe();
        this.gp.obj[index].worldX = x;
        this.gp.obj[index].worldY = y;
        this.gp.obj[index].collision = false;
    }

    removeObj(idx) {
        if (this.gp.obj[idx] !== null) {
            this.gp.obj[idx] = null;  // Remove the object
            this.gp.freeObjectIdx.push(idx);  // Return the index to the queue
        }
    }



    // ENEMIES

    placeEnemy(x, y) {
        if (this.gp.freeNpcIdx.length === 0) {
            return;  // No free slots available
        }

        const index = this.gp.freeNpcIdx.shift();  // Get and remove the first free index
        this.gp.npcs[index] = new Enemy(this.gp, x, y, index);
    }

    placeShark(x, y) {
        if (this.gp.freeNpcIdx.length === 0) {
            return;  // No free slots available
        }
		
		//console.log(`Player at ${this.gp.player.worldX},${this.gp.player.worldY}. Spawning Shark at ${x},${y}`);
        const index = this.gp.freeNpcIdx.shift();  // Get and remove the first free index
        this.gp.npcs[index] = new Shark(this.gp, x, y, index);
    }

    placeBird(x, y, flightDistance) {
        if (this.gp.freeNpcIdx.length === 0) {
            return;  // No free slots available
        }

        const index = this.gp.freeNpcIdx.shift();  // Get and remove the first free index
        this.gp.npcs[index] = new Bird(this.gp, x, y, flightDistance, index);
    }

    placeAnchor(x, y, jumpDistance) {
        if (this.gp.freeNpcIdx.length === 0) {
            return;  // No free slots available
        }

        const index = this.gp.freeNpcIdx.shift();  // Get and remove the first free index
        this.gp.npcs[index] = new Anchor(this.gp, x, y, jumpDistance, index);
    }

    placeSmelly(x, y) {
        if (this.gp.freeNpcIdx.length === 0) {
            return;  // No free slots available
        }

        const index = this.gp.freeNpcIdx.shift();  // Get and remove the first free index
        this.gp.npcs[index] = new Smelly(this.gp, x, y, index);
    }

    placeSinger(x, y) {
        if (this.gp.freeNpcIdx.length === 0) {
            return;  // No free slots available
        }

        const index = this.gp.freeNpcIdx.shift();  // Get and remove the first free index
        this.gp.npcs[index] = new Singer(this.gp, x, y, index);
    }

    removeNpc(idx) {
        if (this.gp.npcs[idx] !== null) {
            this.gp.npcs[idx] = null;  // Remove the NPC
            this.gp.freeNpcIdx.push(idx);  // Return the index to the queue
        }
    }



    // Projectiles
    placeVoice(x, y) {
        
        if (this.gp.freeProjectileIdx.length === 0) {
            return;  // No free slots available
        }


        const index = this.gp.freeProjectileIdx.shift();  // Get and remove the first free index
        this.gp.pros[index] = new Pro_Voice(this.gp, x, y, index);
    }

    removeprojectile(idx) {
        if (this.gp.pros[idx] !== null) {
            this.gp.pros[idx] = null;  // Remove the NPC
            this.gp.freeProjectileIdx.push(idx);  // Return the index to the queue
        }
    }


    // RESET ASSETS

    resetAssets() {
        // Clear all objects and NPCs from the game panel
        for (let i = 0; i < this.gp.maxNumObjects; i++) {
            this.gp.obj[i] = null;  // Remove all objects
        }

        for (let i = 0; i < this.gp.maxNumNpcs; i++) {
            this.gp.npcs[i] = null;  // Remove all NPCs
        }

        // Clear the free index queues
        this.gp.freeObjectIdx.length = 0;
        this.gp.freeNpcIdx.length = 0;

        // Refill the queues with all possible indices
        for (let i = 0; i < this.gp.maxNumObjects; i++) {
            this.gp.freeObjectIdx.push(i);  // Add all object slots back to the queue
        }

        for (let i = 0; i < this.gp.maxNumNpcs; i++) {
            this.gp.freeNpcIdx.push(i);  // Add all NPC slots back to the queue
        }
    }
}
