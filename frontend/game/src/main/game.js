// game.js
import {UI} from './ui.js';
import {KeyHandler} from './key_handler.js';
import {Sound} from './sound.js';
import {TileManager} from './../tile/tile_manager.js';
import {CollisionChecker} from './collision_checker.js';
import {AssetSetter} from './asset_setter.js';
import {Player} from './../entity/player.js';

export class GamePanel {
    constructor(ctx) {
		this.ctx = ctx;
		//console.log("GamePanel created");
        // Screen Settings
        this.originalTileSize = 16;
        this.scale = 3;
        this.tileSize = this.originalTileSize * this.scale; // 48x48 tile size
        this.groundRow = 6;
		this.groundHeight = this.tileSize * this.groundRow;
        this.maxScreenCol = 16;
        this.maxScreenRow = 12;
        this.screenWidth = this.tileSize * this.maxScreenCol; // 768 pixels
        this.screenHeight = this.tileSize * this.maxScreenRow; // 576 pixels

        // GAME STATE
        this.GameState = {
            TITLE: 'TITLE',
            PLAYING: 'PLAYING',
            GAME_OVER: 'GAME_OVER',
            SHOW_SCORE: 'SHOW_SCORE'
        };
        this.gameState = this.GameState.TITLE; // Start with the Title state

        // GAME PHASE
        this.GamePhase = {
            ONE: 'ONE',
            TWO: 'TWO',
            THREE: 'THREE'
        };
        this.gamePhase = this.GamePhase.ONE;
		
		this.scoreSentToReact = false;
		
        // WORLD SETTINGS
        this.originalMaxWorldCol = 61;
        this.maxWorldRow = 18;
        this.maxWorldCol = this.originalMaxWorldCol;
        this.worldColOffset = 0;

        this.timer = 0; // nanoseconds equivalent in JavaScript
        this.FPS = 60;

        // Initialize other components
        this.ui = new UI(this);
        this.tileM = new TileManager(this);
		//console.log("TileManager created");
        this.keyH = new KeyHandler();  // We will handle input using JS events
        this.music = new Sound();
        this.soundEffect = new Sound();
        this.cChecker = new CollisionChecker(this);
        this.aSetter = new AssetSetter(this);
        this.player = new Player(this, this.keyH);

        this.maxNumObjects = 10;
        this.obj = new Array(this.maxNumObjects); // Array of objects
        this.freeObjectIdx = [];

        this.maxNumNpcs = 5;
        this.npcs = new Array(this.maxNumNpcs); // Array of NPCs
        this.freeNpcIdx = [];

		this.maxProjectiles = 2;
		this.pros = new Array(this.maxProjectiles);
		this.freeProjectileIdx = [];

        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
    }
	
	getGamePhase() {
        return this.gamePhase;
    }
	
    setGamePhase(newPhase) {
        this.gamePhase = newPhase;
    }
	
	getGameState() {
	        return this.gameState;
	    }
		
    setGameState(newState) {
        this.gameState = newState;
    }

    setUpGame() {
        this.aSetter.setObject();
		// this.setGameState(this.gameState.TITLE);
		// this.setGamePhase(this.gamePhase.ONE);
        // this.playMusic(0);  // Optional music playing
    }

	startGameLoop() {
	    const drawInterval = 1000 / this.FPS;  // Time per frame in milliseconds
	    let lastTime = performance.now();
	    let delta = 0;
	    let scoreTimer = 0;  // Score timer for the SHOW_SCORE state

	    const gameLoop = (currentTime) => {
	        const elapsedTime = currentTime - lastTime;
	        delta += elapsedTime / drawInterval;
	        lastTime = currentTime;

	        if (delta >= 1) {
	            switch (this.gameState) {
	                case this.GameState.TITLE:
	                    this.render();  // Just render the title screen
	                    if (this.keyH.enterPressed) {  // Switch to playing when Enter is pressed
	                        this.gameState = this.GameState.PLAYING;
	                    }
	                    break;

	                case this.GameState.PLAYING:
	                    this.update();  // Update game logic
	                    this.render();  // Render the game
	                    break;

	                case this.GameState.SHOW_SCORE:
	                    this.render();  // Render the score screen
	                    scoreTimer++;
						this.sendScoreToReact(); // Send score to React when game state is SHOW_SCORE

	                    if (scoreTimer > this.FPS * 5) {  // Show the score screen for 5 seconds
	                        scoreTimer = 0;
	                        this.restartGame();  // Restart game after 5 seconds
	                        this.gameState = this.GameState.TITLE;  // Return to title screen
	                    }
	                    break;

	                default:
	                    this.update();
	                    this.render();
	                    break;
	            }
	            delta--;
	        }

	        requestAnimationFrame(gameLoop);  // Continue the game loop
	    };

	    requestAnimationFrame(gameLoop);
	}

	update() {
	    // Only update the game logic if the game state is PLAYING
	    if (this.gameState === this.GameState.PLAYING) {
	        // Update player
	        this.player.update();

	        // Update NPCs
	        for (let i = 0; i < this.npcs.length; i++) {
	            if (this.npcs[i] != null) {
	                this.npcs[i].update();
	            }
	        }

			for (let i = 0; i < this.pros.length; i++) {
	            if (this.pros[i] != null) {
	                this.pros[i].update();
	            }
	        }

	        // Update tile map
	        this.tileM.updateMap();
	    }
	}

	render() {
	    this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);  // Clear the screen

	    switch (this.gameState) {
	        case this.GameState.TITLE:
	            this.ui.displayTitleScreen(this.ctx);
	            break;

			case this.GameState.PLAYING:
				let gradient;
				switch (this.gamePhase) {
					case this.GamePhase.ONE: // Bright daylight sky
						gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
						gradient.addColorStop(0, '#87CEEB'); // Sky blue (top of the sky)
						gradient.addColorStop(0.5, '#B0E0E6'); // Light blue in the middle
						gradient.addColorStop(1, '#E0FFFF'); // Almost white-blue at the horizon
						this.ctx.fillStyle = gradient;
						break;
			
					case this.GamePhase.TWO: // Sunset with orange and red hues
						gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
						gradient.addColorStop(0, '#ff9966'); // Orange top
						gradient.addColorStop(1, '#ff5e62'); // Reddish bottom
						this.ctx.fillStyle = gradient;
						break;
			
					case this.GamePhase.THREE: // Twilight/dusk transitioning to dark
						gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
						gradient.addColorStop(0, '#2c3e50'); // Dusk blue
						gradient.addColorStop(1, '#000000'); // Night black
						this.ctx.fillStyle = gradient;
						break;
				}

				// Draw the sky background by filling the entire canvas
				this.ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
				
	            // Draw game elements when playing
	            this.tileM.draw(this.ctx);

	            for (let i = 0; i < this.obj.length; i++) {
	                if (this.obj[i] != null) {
	                    this.obj[i].draw(this.ctx, this, i);
	                }
	            }

	            for (let i = 0; i < this.npcs.length; i++) {
	                if (this.npcs[i] != null) {
	                    this.npcs[i].draw(this.ctx);
	                }
	            }

				for (let i = 0; i < this.pros.length; i++) {
	                if (this.pros[i] != null) {
	                    this.pros[i].draw(this.ctx);
	                }
	            }

	            this.player.draw(this.ctx);
	            this.ui.drawSmallScore(this.ctx);
	            break;

	        case this.GameState.SHOW_SCORE:
	            this.ui.displayScore(this.ctx);
	            break;
	    }
	}


    playMusic(track) {
        this.music.setFile(track);
        this.music.play();
        this.music.loop();
    }

    stopMusic() {
        this.music.stop();
    }

    playSoundEffect(effect) {
        this.soundEffect.setFile(effect);
        this.soundEffect.play();
    }

    restartGame() {
		this.scoreSentToReact = false;
        this.maxWorldCol = this.originalMaxWorldCol;
        this.worldColOffset = 0; // number of columns removed in infinite scroll

        this.setGamePhase(this.GamePhase.ONE);
        this.aSetter.resetAssets();
        this.tileM.resetMap();
        this.timer = 0;
        this.player.setDefaultValues();
    }

	sendScoreToReact() {
		if (!this.scoreSentToReact && typeof window.updateReactScore === 'function') {
		  window.updateReactScore(this.player.score); // Pass score to React
		  this.scoreSentToReact = true;
		}
	}
}
