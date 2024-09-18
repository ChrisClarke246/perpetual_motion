import {Entity} from './entity.js';

export class Player extends Entity {
    constructor(gamePanel, keyHandler) {
        super();  // Call the parent Entity constructor
        this.gp = gamePanel;
        this.keyH = keyHandler;
		        
        this.score = 0;

        this.startX = this.gp.tileSize * 14;
        this.startY = this.gp.groundHeight - (this.gp.tileSize / 2);
		
        // The player is drawn in the center of the screen
        this.screenX = (this.gp.screenWidth - this.gp.tileSize) / 2;
        this.screenY = (this.gp.screenHeight - this.gp.tileSize) / 2;

        // Camera boundaries (dead zone)
        this.cameraLeftBoundary = this.gp.screenWidth / 4;
        this.cameraRightBoundary = this.gp.screenWidth * 3 / 4;
        this.cameraTopBoundary = this.gp.screenHeight / 4;
        this.cameraBottomBoundary = this.gp.screenHeight * 3 / 4;

        // hitbox should be 8x16 starting in the middle
        this.hitBoxDefaultX = this.gp.tileSize / 3;
        this.hitBoxDefaultY = 0;

        this.hitBox = {
            x: this.hitBoxDefaultX,
            y: this.hitBoxDefaultY,
            width: this.gp.tileSize / 4,
            height: this.gp.tileSize
        };

        this.effectTime = 0;
        this.effect = "normal";
        
        this.setDefaultValues();
    }

    setDefaultValues() {
		this.velocityY = 0;
        this.worldX = this.startX;
        this.worldY = this.startY;
        this.speed = 5;
        this.jumpStrength = -11;
        this.directionX = "right";  // Default starting direction
        this.directionY = "down";
        this.onGround = false;
        this.alive = true;
        this.effect = "normal";
		this.effectTime = 0;
        this.getPlayerImage("normal");
    }

    getPlayerImage(effect) {
        this.left1 = new Image();
        this.left2 = new Image();
        this.right1 = new Image();
        this.right2 = new Image();
        this.left1.src = `assets/player/motion_man_${effect}_left1.png`;
        this.left2.src = `assets/player/motion_man_${effect}_left2.png`;
        this.right1.src = `assets/player/motion_man_${effect}_right1.png`;
        this.right2.src = `assets/player/motion_man_${effect}_right2.png`;

        // Handle image load failures by using a placeholder
        this.left1.onerror = this.getPlaceholderImage;
        this.left2.onerror = this.getPlaceholderImage;
        this.right1.onerror = this.getPlaceholderImage;
        this.right2.onerror = this.getPlaceholderImage;
    }

    getPlaceholderImage() {
        const placeholder = document.createElement("canvas");
        placeholder.width = 32;
        placeholder.height = 32;
        const ctx = placeholder.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, this.gp.tileSize, this.gp.tileSize);
        return placeholder;
    }

	update() {
	    if (this.gp.getGamePhase() === this.gp.GamePhase.THREE) {
	        this.speed = 8;
	    } else if (this.gp.getGamePhase() === this.gp.GamePhase.TWO) {
	        this.speed = 6;
	    } else if (this.gp.getGamePhase() === this.gp.GamePhase.ONE) {
	        this.speed = 5;
	    }

	    // Reset collision flags
	    this.collisionOnX = false;
	    this.collisionOnY = false;
	    let objIndex = this.gp.obj.length;

	    // Check for enemy collision (does not stop movement so no need to check both horizontal and vertical)
	    for (let i = 0; i < this.gp.maxNumNpcs; i++) {
	        if (this.gp.npcs[i] != null) {
	            this.gp.cChecker.checkPlayerEnemyCollision(this, this.gp.npcs[i]);
	        }
	    }

	    // Handle horizontal movement
	    if (this.keyH.leftPressed || this.keyH.rightPressed) {
	        if (this.keyH.leftPressed) {
	            this.directionX = "left";
	        }
	        if (this.keyH.rightPressed) {
	            this.directionX = "right";
	        }

	        // Check horizontal collisions
	        this.gp.cChecker.checkHorizontalCollision(this);
	        // Check horizontal object collisions before movement
	        objIndex = this.gp.cChecker.checkObject(this, true);

	        // Respawn if necessary
	        if (!this.alive) {
	            this.gp.gameState = this.gp.GameState.SHOW_SCORE;
	        }

	        if (!this.collisionOnX) {
	            if (this.directionX === "left") {
	                this.worldX -= this.speed;  // Move left
	            }
	            if (this.directionX === "right") {
	                this.worldX += this.speed;  // Move right
	            }
	        }
	    }

	    // Jumping mechanics
	    if (this.keyH.upPressed && this.onGround) {
	        this.velocityY = this.jumpStrength;  // Initiate jump
	        this.onGround = false;  // Player is no longer on the ground
	    }

	    // Apply gravity
	    this.velocityY += this.gravity;
	    if (this.velocityY > this.maxFallSpeed) {
	        this.velocityY = this.maxFallSpeed;  // Limit falling speed
	    }

	    // Determine vertical direction (up or down)
	    this.directionY = this.velocityY < 0 ? "up" : "down";

	    // Check vertical collisions
	    this.gp.cChecker.checkVerticalCollision(this);
	    // Check vertical object collisions before movement
	    objIndex = this.gp.cChecker.checkObject(this, true);

	    // Respawn if necessary
	    if (!this.alive) {
	        this.gp.gameState = this.gp.GameState.SHOW_SCORE;
	    }

	    if (!this.collisionOnY) {
	        this.worldY += this.velocityY;  // Move vertically if no collision
	    }

	    // Interact with the object
	    this.objectInteraction(objIndex);

	    // Animation frame update and effect management
	    if (this.keyH.leftPressed || this.keyH.rightPressed || this.keyH.upPressed) {
	        this.spriteCounter++;
	        if (this.spriteCounter > 20) {
	            this.spriteNum = (this.spriteNum + 1) % 2;
	            this.spriteCounter = 0;
	            this.handleEffects();
	        }
	    } else {
	        // Don't lose effect if idle
	        this.spriteNum = 0;  // Reset to idle if not moving
	    }

	    // Update score
	    this.handleScore();

	    // Camera handling
	    this.handleCamera();
	}


	objectInteraction(index) {
	    if (index === this.gp.obj.length) {
	        return;
	    }

	    switch (this.gp.obj[index].name) {
	        case "Bottle":
	            this.effect = "Drunk";
	            this.gp.aSetter.removeObj(index);

	            if (this.gp.getGamePhase() === this.gp.GamePhase.THREE) {
	                this.effectTime = 7;
	            } else if (this.gp.getGamePhase() === this.gp.GamePhase.TWO) {
	                this.effectTime = 8;
	            } else if (this.gp.getGamePhase() === this.gp.GamePhase.ONE) {
	                this.effectTime = 10;
	            }
	            break;

			case "Smell":
				this.effect = "Drunk";
				this.gp.aSetter.removeObj(index);

				if (this.gp.getGamePhase() === this.gp.GamePhase.THREE) {
					this.effectTime = 7;
				} else if (this.gp.getGamePhase() === this.gp.GamePhase.TWO) {
					this.effectTime = 8;
				} else if (this.gp.getGamePhase() === this.gp.GamePhase.ONE) {
					this.effectTime = 10;
				}
				break;

	        case "Shoe":
	            this.effect = "Speed";
	            this.gp.aSetter.removeObj(index);

	            // Increase player speed and change animation
	            if (this.gp.getGamePhase() === this.gp.GamePhase.THREE) {
	                this.speed = 10;
	            } else if (this.gp.getGamePhase() === this.gp.GamePhase.TWO) {
	                this.speed = 8;
	            } else if (this.gp.getGamePhase() === this.gp.GamePhase.ONE) {
	                this.speed = 7;
	            }

	            this.jumpStrength = -15;
	            this.effectTime = 10;  // Don't allow effect time to stack from previous power-up

	            // Play sound effect if needed (uncomment if you have a sound system)
	            // this.gp.playSoundEffect(index);

	            this.getPlayerImage("Speed");
	            break;

	        case "Donut":
	            this.effect = "Donut";
	            this.gp.aSetter.removeObj(index);

	            // Increase player speed and change animation
	            if (this.gp.getGamePhase() === this.gp.GamePhase.THREE) {
	                this.speed = 6;
	            } else if (this.gp.getGamePhase() === this.gp.GamePhase.TWO) {
	                this.speed = 5;
	            } else if (this.gp.getGamePhase() === this.gp.GamePhase.ONE) {
	                this.speed = 4;
	            }

	            this.jumpStrength = -11;
	            this.effectTime = 10;  // Don't allow effect time to stack from previous power-up

	            // Play sound effect if needed (uncomment if you have a sound system)
	            // this.gp.playSoundEffect(index);

	            this.getPlayerImage("big");
	            break;

	        default:
	            this.gp.aSetter.removeObj(index);
	            break;
	    }
	}

	handleEffects() {
	    if (this.effectTime > 0) {
	        this.effectTime--;

	        if (this.effectTime === 0) {
	            // Reset defaults when effect time runs out
	            this.effect = "normal";
	            this.speed = 4;
	            this.jumpStrength = -11;
	            this.getPlayerImage("normal");
	        }
	    }
	}
	

    handleScore() {
        this.score = Math.max(0, this.worldX - this.startX);
    }

    handleCamera() {
        // Adjust the camera based on player position
        if (this.worldX < this.gp.player.worldX - this.cameraLeftBoundary) {
            this.gp.player.worldX = this.worldX + this.cameraLeftBoundary;
        } else if (this.worldX > this.gp.player.worldX + this.cameraRightBoundary) {
            this.gp.player.worldX = this.worldX - this.cameraRightBoundary;
        }

        if (this.worldY < this.gp.player.worldY - this.cameraTopBoundary) {
            this.gp.player.worldY = this.worldY + this.cameraTopBoundary;
        } else if (this.worldY > this.gp.player.worldY + this.cameraBottomBoundary) {
            this.gp.player.worldY = this.worldY - this.cameraBottomBoundary;
        }
    }

    draw(ctx) {
        let imageToDraw;
        if (this.directionX === "left") {
            imageToDraw = this.spriteNum === 0 ? this.left1 : this.left2;
        } else if (this.directionX === "right") {
            imageToDraw = this.spriteNum === 0 ? this.right1 : this.right2;
        }

        // Draw the player at the fixed screen position
        ctx.drawImage(imageToDraw, this.screenX, this.screenY, this.gp.tileSize, this.gp.tileSize);
    }
}
