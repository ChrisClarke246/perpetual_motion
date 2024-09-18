export class UI {
    constructor(gamePanel) {
        this.gp = gamePanel;

        // Define fonts (in Canvas, font sizes are defined in pixels)
        this.headerFont = "36px Arial";
        this.smallScoreFont = "20px Arial";
        this.bigScoreFont = "48px Arial";

        // Load the title image
        this.titleImage = new Image();
        this.titleImage.src = "assets/ui/title.png";  // Path to your title image
        this.titleImage.onload = () => {
            // Optionally handle when the image is loaded (for example, logging)
            //console.log("Title image loaded.");
        };
    }

    drawSmallScore(ctx) {
        const scoreX = Math.floor(this.gp.screenWidth * 0.02);
        const scoreY = Math.floor(this.gp.screenHeight * 0.08);
        
        const text = "Score: " + this.gp.player.score;

        ctx.font = this.smallScoreFont;
        ctx.fillStyle = "white";
        ctx.fillText(text, scoreX, scoreY);  // Use fillText to draw text
    }

    displayScore(ctx) {
        // Set background color to black
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.gp.screenWidth, this.gp.screenHeight);  // Fill the entire screen

        // Set font and color for the header
        ctx.font = this.headerFont;
        ctx.fillStyle = "yellow";

        // Display the header text
        const headerText = "Motion The Cruise 2024. Dec 28. Get Dey.";
        const headerX = this.gp.screenWidth / 2 - ctx.measureText(headerText).width / 2;
        ctx.fillText(headerText, headerX, this.gp.screenHeight / 4);  // Header at 1/4th of the screen height

        // Set font and color for the score
        ctx.font = this.bigScoreFont;
        ctx.fillStyle = "white";

        // Display the score text in the middle of the screen
        const scoreText = "Score: " + this.gp.player.score;
        const scoreX = this.gp.screenWidth / 2 - ctx.measureText(scoreText).width / 2;
        const scoreY = this.gp.screenHeight / 2;  // Middle of the screen
        ctx.fillText(scoreText, scoreX, scoreY);
    }

    displayTitleScreen(ctx) {
        // Draw the title background image
        ctx.drawImage(this.titleImage, 0, 0, this.gp.screenWidth, this.gp.screenHeight);  // Draw image to fill screen

        // Set font and color for the game title
        ctx.font = this.headerFont;
        ctx.fillStyle = "yellow";

        // Display the title text
        const titleText = "Perpetual Motion";
        const titleX = this.gp.screenWidth / 2 - ctx.measureText(titleText).width / 2;
        const titleY = this.gp.screenHeight / 6;  // Position title about 1/6 down the screen
        ctx.fillText(titleText, titleX, titleY);

        // Set font and color for the subtitle
        const subtitleText = "Dec 28. Get Dey.";
        ctx.font = this.smallScoreFont;
        const subtitleX = this.gp.screenWidth / 2 - ctx.measureText(subtitleText).width / 2;
        const subtitleY = titleY + 50;  // Place it just below the title
        ctx.fillText(subtitleText, subtitleX, subtitleY);

        // Set font and color for the start prompt
        const startPrompt = "<Press ENTER to Start>";
        ctx.font = this.smallScoreFont;
        const promptX = this.gp.screenWidth / 2 - ctx.measureText(startPrompt).width / 2;
        const promptY = 5 * (this.gp.screenHeight / 6);  // Position near the bottom center
        ctx.fillStyle = "yellow";
        ctx.fillText(startPrompt, promptX, promptY);
    }
}
