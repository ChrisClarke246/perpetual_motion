// main.js
import { GamePanel } from './game.js'; // Path to the file where GamePanel is defined

// Define the initializeGame function and attach it to the window object
window.initializeGame = function (canvasElement) {
    // Initialize the game panel
    const gamePanel = new GamePanel(canvasElement);

    // Set up the game (equivalent to gamePanel.setUpGame())
    gamePanel.setUpGame();

    // Start the game loop (equivalent to gamePanel.startGameThread())
    gamePanel.startGameLoop();
};

