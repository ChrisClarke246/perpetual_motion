export class TileManager {
    constructor(gp) {
        this.gp = gp;
        this.tile = [];
        this.mapTileNum = []; // Use dynamic list to store columns of the map

        this.chasingTimer = 0;
        this.lastChasingTile = 0;
        this.chasingDelay = 30; // Number of frames before sea moves forward
        this.increaseChaseRateAfter = 7; // seconds

        this.remainingColsForStruct = 0;
        this.OBSTACLES = [
            "ship", "ship", "ship", "ship", "ship", "ship", "ship", "ship", "ship", "ship", "ship", "ship", "ship",
            "hole", "hole", "hole", "hole", "hole", "hole", "hole", "hole", "hole", "hole",
            "box", "box", "box", "box", "box", "box", "box", "box", "box",
            "bridge", "bridge",
            "enemy"
        ];
        this.currentObstacle = null;
        this.prevObstacle = null;
		this.lastBridgeSize = 0;
		this.lasEnemySize = 0;

        // Power-ups and NPC spawn rates
        this.bottleSpawnRate = 40;
        this.donutSpawnRate = 50;
        this.shoeSpawnRate = 30;
        this.yarkbossSpawnRate = 5;
        this.sharkSpawnRate = 20;
        this.birdSpawnRate = 15;
		this.anchorSpawnRate = 25;
		this.smellySpawnRate = 5;

        this.random = Math.random;

        this.loadMap("assets/maps/motion_level_1.txt");
        this.getTileImage();
    }

	getTileImage() {
	    try {
	        this.tile[0] = { image: this.loadImage("assets/tiles/empty.png"), collision: false, safe: true };
	        this.tile[1] = { image: this.loadImage("assets/tiles/water1.png"), collision: false, safe: false };
	        this.tile[2] = { image: this.loadImage("assets/tiles/water2.png"), collision: true, safe: false };
	        this.tile[3] = { image: this.loadImage("assets/tiles/ship_tile.png"), collision: true, safe: true };
	        this.tile[4] = { image: this.loadImage("assets/tiles/ship_l_corner.png"), collision: true, safe: true };
	        this.tile[5] = { image: this.loadImage("assets/tiles/ship_l_corner_wave.png"), collision: true, safe: false };
	        this.tile[6] = { image: this.loadImage("assets/tiles/ship_l_corner_water.png"), collision: true, safe: false };
	        this.tile[7] = { image: this.loadImage("assets/tiles/ship_tile_wave.png"), collision: true, safe: false };
	        this.tile[8] = { image: this.loadImage("assets/tiles/ship_tile_water.png"), collision: true, safe: false };
	        this.tile[9] = { image: this.loadImage("assets/tiles/railing.png"), collision: false, safe: true };
	        this.tile[10] = { image: this.loadImage("assets/tiles/box.png"), collision: true, safe: true };
	        this.tile[11] = { image: this.loadImage("assets/tiles/sign.png"), collision: true, safe: true };
	        this.tile[12] = { image: this.loadImage("assets/tiles/pole.png"), collision: false, safe: true };
	        this.tile[13] = { image: this.loadImage("assets/tiles/steel_block.png"), collision: true, safe: true };
	    } catch (error) {
	        //console.error("Error loading tile images:", error);
	    }
	}


    loadImage(src) {
        const img = new Image();
        img.src = src;
        return img;
    }

    async loadMap(filepath) {
        try {
            const response = await fetch(filepath);
            const text = await response.text();
            const lines = text.split("\n");

            for (let col = 0; col < this.gp.maxWorldCol; col++) {
                this.mapTileNum[col] = new Array(this.gp.maxWorldRow).fill(0); // Initialize each column as an array of rows
            }

            let row = 0;

            while (row < this.gp.maxWorldRow) {
                const line = lines[row];
                const numbers = line.split(" ").map(Number);
                for (let col = 0; col < this.gp.maxWorldCol; col++) {
                    this.mapTileNum[col][row] = numbers[col];
                }
                row++;
            }
        } catch (error) {
            //console.error("Error loading map:", error);
        }
    }

    resetMap() {
		this.lastBridgeSize = 0;
		this.lasEnemySize = 0;
        this.mapTileNum = [];
        this.chasingTimer = 0;
        this.lastChasingTile = 0;
        this.chasingDelay = 30;
        this.currentObstacle = null;
        this.prevObstacle = null;
        this.remainingColsForStruct = 0;
        this.loadMap("assets/maps/motion_level_1.txt");
    }

    updateChasingTiles() {
        this.chasingTimer++;

        if (this.chasingTimer % this.chasingDelay !== 0) return;

        if (this.chasingTimer > 0 && this.chasingDelay > 10 && this.chasingTimer > 60 * this.increaseChaseRateAfter) {
            this.chasingDelay--;
            if (this.chasingDelay <= 10) this.gp.setGamePhase(this.gp.GamePhase.THREE);
            else if (this.chasingDelay <= 20) this.gp.setGamePhase(this.gp.GamePhase.TWO);
            else this.gp.setGamePhase(this.gp.GamePhase.ONE);

            this.chasingTimer = 0;
        }

        this.lastChasingTile++;
        for (let i = 0; i < this.gp.maxWorldRow; i++) {
			//console.log(`groundRow ${this.gp.groundRow}`)
            if (i > this.gp.groundRow + 1) {
                this.mapTileNum[this.lastChasingTile][i] = 2;
            } else if (i === this.gp.groundRow + 1) {
                this.mapTileNum[this.lastChasingTile][i] = 1;
            } else {
                this.mapTileNum[this.lastChasingTile][i] = 0;
            }
        }
    }

	updateMap() {
	    this.updateChasingTiles();

	    if (this.gp.getGamePhase() === this.gp.GamePhase.THREE) {
	        this.bottleSpawnRate = 25;
	        this.yarkbossSpawnRate = 2;
	        this.donutSpawnRate = 30;
	        this.sharkSpawnRate = 5;
	        this.shoeSpawnRate = 20;
	        this.birdSpawnRate = 3;
			this.anchorSpawnRate = 6;
			this.smellySpawnRate = 2;
	    } else if (this.gp.getGamePhase() === this.gp.GamePhase.TWO) {
	        this.bottleSpawnRate = 30;
	        this.yarkbossSpawnRate = 3;
	        this.donutSpawnRate = 40;
	        this.sharkSpawnRate = 10;
	        this.shoeSpawnRate = 25;
	        this.birdSpawnRate = 10;
			this.anchorSpawnRate = 12;
			this.smellySpawnRate = 3;
	    } else if (this.gp.getGamePhase() === this.gp.GamePhase.ONE) {
	        this.bottleSpawnRate = 35;
	        this.yarkbossSpawnRate = 5;
	        this.donutSpawnRate = 50;
	        this.sharkSpawnRate = 20;
	        this.shoeSpawnRate = 30;
	        this.birdSpawnRate = 15;
			this.anchorSpawnRate = 25;
			this.smellySpawnRate = 5;
	    }

	    // Check if the player is nearing the edge of the current map
	    const lastVisibleCol = Math.floor((this.gp.player.worldX + this.gp.screenWidth) / this.gp.tileSize);

	    // Add new columns if the player is near the end of the map
	    if (lastVisibleCol >= this.gp.maxWorldCol - this.gp.maxScreenCol) {
	        const newCol = new Array(this.gp.maxWorldRow);

	        if (this.remainingColsForStruct === 0) {
	            this.prevObstacle = this.currentObstacle;
	            const randomNumber = Math.floor(Math.random() * this.OBSTACLES.length);
	            this.currentObstacle = this.OBSTACLES[randomNumber];
	        }

	        let size = 0;
	        let height = 0;
	        switch (this.currentObstacle) {
	            case "ship":
	                this.remainingColsForStruct = this.makeShipCol(newCol);
	                break;

	            case "hole":
	                if (this.prevObstacle !== "hole") {
	                    size = this.remainingColsForStruct;
	                    if (size === 0) {
	                        size = Math.floor(Math.random() * 2) + 1; // Random size between 1 and 3
	                    }
	                    this.remainingColsForStruct = this.makeHole(size, newCol);
	                    break;
	                }

	            case "box":
	                if (this.prevObstacle !== "hole") {
	                    size = Math.floor(Math.random() * 1) + 1; // Random size between 1 and 2
	                    if (this.prevObstacle === "box") {
	                        size = Math.floor(Math.random() * 2) + 1;
	                    }
	                    this.remainingColsForStruct = this.makeBox(size, newCol);
	                    break;
	                }

	            case "enemy":
	                if (this.prevObstacle !== "hole") {
	                    if (this.remainingColsForStruct === 0) {
	                        size = Math.floor(Math.random() * 6) + 5; // Random size between 5 and 10
							this.lasEnemySize = size;
	                    } else {
	                        size = this.remainingColsForStruct;
	                    }

	                    if (this.remainingColsForStruct > 1) {
	                        this.makeShipCol(newCol);
	                        this.remainingColsForStruct--;
	                    } else {
	                        this.remainingColsForStruct = this.makeEnemyzone(size, newCol);
	                    }
	                    break;
	                }

	            case "bridge":
	                if (this.prevObstacle !== "hole") {
	                    if (this.prevObstacle === "box" || this.prevObstacle === "enemy") {
	                        height = 3;
	                    } else {
	                        height = 2;
	                    }

	                    if (this.remainingColsForStruct === 0) {
	                        size = Math.floor(Math.random() * 4) + 3; // Random size between 3 and 7
	                        if (size % 2 > 0) {
	                            size += 1;
	                        }
							this.lastBridgeSize = size;
	                    } else {
	                        size = this.remainingColsForStruct;
	                    }

	                    if (this.remainingColsForStruct > 1) {
	                        this.remainingColsForStruct = this.makeBridgeBody(size, height, newCol);
	                    } else {
	                        this.remainingColsForStruct = this.makeBridgeEdge(size, height, newCol);
	                    }
	                    break;
	                }

	            default:
	                this.currentObstacle = "ship";
	                this.makeShipCol(newCol);
	                break;
	        }

	        this.mapTileNum.push(newCol);
	        this.gp.maxWorldCol++;

	        // Add consumables after the new column has been added
	        if (this.currentObstacle === "box" && size > 0) {
	            const placePowerUp = Math.floor(Math.random() * this.bottleSpawnRate);
	            if (placePowerUp === 0) {
	                const x = (this.gp.maxWorldCol - 1) * this.gp.tileSize;
	                const y = (this.gp.groundRow - size - 1) * this.gp.tileSize; // on top of the boxes
	                this.gp.aSetter.placeBottle(x, y);
	            }
	        }

	        if (this.currentObstacle === "box" && size > 0) {
	            const placeEnemy = Math.floor(Math.random() * this.birdSpawnRate);
	            if (placeEnemy === 0) {
	                const x = (this.gp.maxWorldCol - 1) * this.gp.tileSize;
	                const y = (this.gp.groundRow - size - 3) * this.gp.tileSize; // on top of the boxes
	                const flightDistance = (Math.floor(Math.random() * 8) + 5) * this.gp.tileSize; // between 5 and 12
	                this.gp.aSetter.placeBird(x, y, flightDistance);
	            }
	        }

	        if (this.currentObstacle === "enemy" && this.remainingColsForStruct === 1) {
	            const placeEnemy = Math.floor(Math.random() * this.yarkbossSpawnRate);
				const placeSmelly = Math.floor(Math.random() * this.smellySpawnRate);
	            if (placeSmelly === 0) {
	                const x = (this.gp.maxWorldCol - 1) * this.gp.tileSize;
	                const y = (this.gp.groundRow * this.gp.tileSize) - (this.gp.tileSize / 2); // on the ground
					this.gp.aSetter.placeSmelly(x, y);
					let newX = x + this.gp.tileSize;
					let shipTiles = this.lasEnemySize -2;
					for (let i=0; i<shipTiles - 1;i++){
						if (i%2 == 0){
							newX -= (2 * this.gp.tileSize);
							this.gp.aSetter.placeSmell(newX, y);
						}
					}
	            }
				else if (placeEnemy === 0) {
	                const x = (this.gp.maxWorldCol - 1) * this.gp.tileSize;
	                const y = (this.gp.groundRow * this.gp.tileSize) - (this.gp.tileSize / 2); // slightly offset on the ground
	                this.gp.aSetter.placeEnemy(x, y);
	            }
	        }

	        if (this.currentObstacle === "hole" && this.remainingColsForStruct === 0) {
	            const placeEnemy = Math.floor(Math.random() * this.sharkSpawnRate);
	            if (placeEnemy === 0) {
	                const x = (this.gp.maxWorldCol - 1) * this.gp.tileSize; // slightly offset to the left
	                const y = (this.gp.groundRow + 2) * this.gp.tileSize; // water level
	                this.gp.aSetter.placeShark(x, y);
	            }
	        }

	        if (this.currentObstacle === "ship") {
	            const placePowerUp = Math.floor(Math.random() * this.donutSpawnRate);
	            if (placePowerUp === 0) {
	                const x = (this.gp.maxWorldCol - 1) * this.gp.tileSize;
	                const y = (this.gp.groundRow - 1) * this.gp.tileSize; // on top of the ground
	                this.gp.aSetter.placeDonut(x, y);
	            }
	        }

	        if (this.currentObstacle === "bridge" && height > 0 && this.remainingColsForStruct === 0) {
	            const placePowerUp = Math.floor(Math.random() * this.shoeSpawnRate);
				const placeAnchor = Math.floor(Math.random() * this.anchorSpawnRate);
	            if (placePowerUp === 0) {
	                const x = (this.gp.maxWorldCol - 1) * this.gp.tileSize;
	                const y = (this.gp.groundRow - height - 1) * this.gp.tileSize; // on top of the bridge
	                this.gp.aSetter.placeShoe(x, y);
	            }
				if (placeAnchor === 0) {
	                const x = (this.gp.maxWorldCol - 1) * this.gp.tileSize;
	                const y = (this.gp.groundRow - height - 1) * this.gp.tileSize; // on top of the bridge
					const jumpDistance = (this.lastBridgeSize + 1) * this.gp.tileSize;
					this.gp.aSetter.placeAnchor(x, y, jumpDistance);
	            }
	        }
	    }
	}

	makeShipCol(newCol) {
	    for (let i = 0; i < this.gp.maxWorldRow; i++) {
	        if (i < this.gp.groundRow) {
	            newCol[i] = 0;
	        } else if (i === this.gp.groundRow) {
	            newCol[i] = 9;
	        } else if (i === this.gp.groundRow + 1) {
	            newCol[i] = 3;
	        } else if (i === this.gp.groundRow + 2) {
	            newCol[i] = 7;
	        } else if (i > this.gp.groundRow + 2 && i < 11) {
	            newCol[i] = 8;
	        } else {
	            newCol[i] = 2;
	        }
	    }
	    return 0;
	}

	makeHole(size, newCol) {
	    for (let i = 0; i < this.gp.maxWorldRow; i++) {
	        if (i < this.gp.groundRow + 2) {
	            newCol[i] = 0;
	        } else if (i === this.gp.groundRow + 2) {
	            newCol[i] = 1;
	        } else {
	            newCol[i] = 2;
	        }
	    }
	    return size - 1;
	}

	makeBox(size, newCol) {
	    for (let i = 0; i < this.gp.maxWorldRow; i++) {
	        if (i < this.gp.groundRow - size) {
	            newCol[i] = 0;
	        } else if (i < this.gp.groundRow + 1) {
	            newCol[i] = 10;
	        } else if (i === this.gp.groundRow + 1) {
	            newCol[i] = 3;
	        } else if (i === this.gp.groundRow + 2) {
	            newCol[i] = 7;
	        } else if (i > this.gp.groundRow + 2 && i < 11) {
	            newCol[i] = 8;
	        } else {
	            newCol[i] = 2;
	        }
	    }
	    return 0;
	}

	makeEnemyzone(size, newCol) {
	    for (let i = 0; i < this.gp.maxWorldRow; i++) {
	        if (i < this.gp.groundRow) {
	            newCol[i] = 0;
	        } else if (i < this.gp.groundRow + 1) {
	            newCol[i] = 11;
	        } else if (i === this.gp.groundRow + 1) {
	            newCol[i] = 3;
	        } else if (i === this.gp.groundRow + 2) {
	            newCol[i] = 7;
	        } else if (i > this.gp.groundRow + 2 && i < 11) {
	            newCol[i] = 8;
	        } else {
	            newCol[i] = 2;
	        }
	    }
	    return size - 1;
	}

	makeBridgeEdge(size, height, newCol) {
	    for (let i = 0; i < this.gp.maxWorldRow; i++) {
	        if (i < this.gp.groundRow - height + 1) {
	            newCol[i] = 0;
	        } else if (i === this.gp.groundRow - height + 1) {
	            newCol[i] = 13;
	        } else if (i < this.gp.groundRow + 1) {
	            newCol[i] = 12;
	        } else if (i === this.gp.groundRow + 1) {
	            newCol[i] = 3;
	        } else if (i === this.gp.groundRow + 2) {
	            newCol[i] = 7;
	        } else if (i > this.gp.groundRow + 2 && i < 11) {
	            newCol[i] = 8;
	        } else {
	            newCol[i] = 2;
	        }
	    }
	    return size - 1;
	}

	makeBridgeBody(size, height, newCol) {
	    for (let i = 0; i < this.gp.maxWorldRow; i++) {
	        if (i === this.gp.groundRow - height + 1) {
	            newCol[i] = 13;
	        } else if (i < this.gp.groundRow + 2) {
	            newCol[i] = 0;
	        } else if (i === this.gp.groundRow + 2) {
	            newCol[i] = 1;
	        } else {
	            newCol[i] = 2;
	        }
	    }
	    return size - 1;
	}

    draw(ctx) {
        for (let worldCol = 0; worldCol < this.gp.maxWorldCol; worldCol++) {
            if (!this.mapTileNum[worldCol]) continue;
            const colArray = this.mapTileNum[worldCol];

            for (let worldRow = 0; worldRow < this.gp.maxWorldRow; worldRow++) {
                const tileNum = colArray[worldRow];
                if (tileNum < 0 || tileNum >= this.tile.length) continue;

                const worldX = worldCol * this.gp.tileSize;
                const worldY = worldRow * this.gp.tileSize;
                const screenX = worldX - this.gp.player.worldX + this.gp.player.screenX;
                const screenY = worldY - this.gp.player.worldY + this.gp.player.screenY;

                if (screenX + this.gp.tileSize > 0 && screenX < this.gp.screenWidth && screenY + this.gp.tileSize > 0 && screenY < this.gp.screenHeight) {
                    ctx.drawImage(this.tile[tileNum].image, screenX, screenY, this.gp.tileSize, this.gp.tileSize);
                }
            }
        }

        // "Drunk" effect
        if (this.gp.player.effect === "Drunk") {
            const visionRadius = 150;
            const centerX = this.gp.player.screenX + this.gp.tileSize / 2;
            const centerY = this.gp.player.screenY + this.gp.tileSize / 2;

            ctx.save();
            ctx.globalCompositeOperation = "destination-in";
            ctx.beginPath();
            ctx.arc(centerX, centerY, visionRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            ctx.save();
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            ctx.fillRect(0, 0, this.gp.screenWidth, this.gp.screenHeight);
            ctx.restore();
        }
    }
}
