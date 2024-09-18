// main.js
import { GamePanel } from './game.js'; // Path to the file where GamePanel is defined

// Once the window loads, set up the game
window.onload = function () {
    // Get the canvas element from the HTML
    const canvas = document.getElementById('gameCanvas');

    // Initialize the game panel (this replaces JFrame and panel setup in Java)
    const gamePanel = new GamePanel(canvas);

    // Set up the game (equivalent to gamePanel.setUpGame())
    gamePanel.setUpGame();

    // Start the game loop (equivalent to gamePanel.startGameThread())
    gamePanel.startGameLoop();
};
