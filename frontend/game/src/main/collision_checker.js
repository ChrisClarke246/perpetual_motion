export class CollisionChecker {
    constructor(gamePanel) {
        this.gp = gamePanel;
    }

    checkHorizontalCollision(entity) {
        const entityLeftWorldX = entity.worldX + entity.hitBox.x;
        const entityRightWorldX = entity.worldX + entity.hitBox.x + entity.hitBox.width;
        const entityTopWorldY = entity.worldY + entity.hitBox.y;
        const entityBottomWorldY = entity.worldY + entity.hitBox.y + entity.hitBox.height;

        const entityTopRow = Math.floor(entityTopWorldY / this.gp.tileSize);
        const entityBottomRow = Math.floor(entityBottomWorldY / this.gp.tileSize);

        let tileNum1;

        // Check left collision
        if (entity.directionX === "left") {
            const newEntityLeftCol = Math.floor((entityLeftWorldX - entity.speed) / this.gp.tileSize);
            for (let row = entityTopRow; row <= entityBottomRow; row++) {
                tileNum1 = this.gp.tileM.mapTileNum[newEntityLeftCol][row];
                if (this.gp.tileM.tile[tileNum1].collision) {
                    entity.collisionOnX = true;
                    return;  // Stop further checks if collision detected
                }
                if (!this.gp.tileM.tile[tileNum1].safe) {
					//console.log(`left collision with tile ${tileNum1} killed player`);
                    entity.alive = false;
                }
            }
        }

        // Check right collision
        if (entity.directionX === "right") {
            const newEntityRightCol = Math.floor((entityRightWorldX + entity.speed) / this.gp.tileSize);
            for (let row = entityTopRow; row <= entityBottomRow; row++) {
                tileNum1 = this.gp.tileM.mapTileNum[newEntityRightCol][row];
                if (this.gp.tileM.tile[tileNum1].collision) {
                    entity.collisionOnX = true;
                    return;  // Stop further checks if collision detected
                }
                if (!this.gp.tileM.tile[tileNum1].safe) {
					//console.log(`right collision with tile ${tileNum1} killed player`);
                    entity.alive = false;
                }
            }
        }
    }

    checkVerticalCollision(entity) {
        const entityLeftWorldX = entity.worldX + entity.hitBox.x;
        const entityRightWorldX = entity.worldX + entity.hitBox.x + entity.hitBox.width;
        const entityTopWorldY = entity.worldY + entity.hitBox.y;
        const entityBottomWorldY = entity.worldY + entity.hitBox.y + entity.hitBox.height;

        const entityLeftCol = Math.floor(entityLeftWorldX / this.gp.tileSize);
        const entityRightCol = Math.floor(entityRightWorldX / this.gp.tileSize);

        let tileNum1;

        // Check upward collision
        if (entity.directionY === "up") {
            const newEntityTopRow = Math.floor((entityTopWorldY - Math.abs(entity.velocityY)) / this.gp.tileSize);

            if (newEntityTopRow < 0) {
                entity.collisionOnY = true;
                entity.velocityY = 0;  // grvity will move you down
                return;
            }

            for (let col = entityLeftCol; col <= entityRightCol; col++) {
                tileNum1 = this.gp.tileM.mapTileNum[col][newEntityTopRow];
                if (this.gp.tileM.tile[tileNum1].collision) {
                    entity.collisionOnY = true;
                    entity.velocityY = 0;  // Stop upward movement
                    return;
                }
                if (!this.gp.tileM.tile[tileNum1].safe) {
					//console.log(`up collision with tile ${tileNum1} killed player`);
                    entity.alive = false;
                }
            }
        }

        // Check downward collision
        if (entity.directionY === "down") {
            const newEntityBottomRow = Math.floor((entityBottomWorldY + Math.abs(entity.velocityY)) / this.gp.tileSize);
            for (let col = entityLeftCol; col <= entityRightCol; col++) {
                tileNum1 = this.gp.tileM.mapTileNum[col][newEntityBottomRow];
                if (this.gp.tileM.tile[tileNum1].collision) {
                    entity.collisionOnY = true;
                    entity.onGround = true;  // Player is grounded
                    entity.velocityY = 0;    // Stop downward movement
                    return;
                }
                if (!this.gp.tileM.tile[tileNum1].safe) {
					//console.log(`down collision with tile ${tileNum1} killed player`);
                    entity.alive = false;
                }
            }
            // If no collision is found, the player is not on the ground
            entity.onGround = false;
        }
    }

    checkObject(entity, isPlayer) {
        let objCollision = false;

        for (let i = 0; i < this.gp.obj.length; i++) {
            if (!this.gp.obj[i]) continue;

            // Entity's hitbox
            let entityHitBoxLeftWorldX = entity.worldX + entity.hitBox.x;
            let entityHitBoxTopWorldY = entity.worldY + entity.hitBox.y;
            let entityHitBoxRightWorldX = entity.worldX + entity.hitBox.x + entity.hitBox.width;
            let entityHitBoxBottomWorldY = entity.worldY + entity.hitBox.y + entity.hitBox.height;

            // Object's hitbox
            const objectHitBoxLeftWorldX = this.gp.obj[i].worldX + this.gp.obj[i].hitBox.x;
            const objectHitBoxTopWorldY = this.gp.obj[i].worldY + this.gp.obj[i].hitBox.y;
            const objectHitBoxRightWorldX = this.gp.obj[i].worldX + this.gp.obj[i].hitBox.x + this.gp.obj[i].hitBox.width;
            const objectHitBoxBottomWorldY = this.gp.obj[i].worldY + this.gp.obj[i].hitBox.y + this.gp.obj[i].hitBox.height;

            // Check horizontal movement
            switch (entity.directionX) {
                case "left":
                    entityHitBoxLeftWorldX -= entity.speed;
                    entityHitBoxRightWorldX -= entity.speed;
                    break;
                case "right":
                    entityHitBoxLeftWorldX += entity.speed;
                    entityHitBoxRightWorldX += entity.speed;
                    break;
            }

            if (entityHitBoxLeftWorldX < objectHitBoxRightWorldX &&
                entityHitBoxRightWorldX > objectHitBoxLeftWorldX &&
                entityHitBoxTopWorldY < objectHitBoxBottomWorldY &&
                entityHitBoxBottomWorldY > objectHitBoxTopWorldY) {
                objCollision = true;
                if (this.gp.obj[i].collision) {
                    entity.collisionOnX = true;
                }
            }

            // Check vertical movement
            const entityVelocityY = entity.velocityY;

            entityHitBoxTopWorldY += entityVelocityY;
            entityHitBoxBottomWorldY += entityVelocityY;

            if (entityHitBoxLeftWorldX < objectHitBoxRightWorldX &&
                entityHitBoxRightWorldX > objectHitBoxLeftWorldX &&
                entityHitBoxTopWorldY < objectHitBoxBottomWorldY &&
                entityHitBoxBottomWorldY > objectHitBoxTopWorldY) {
                objCollision = true;
                if (this.gp.obj[i].collision) {
                    entity.collisionOnY = true;
                    entity.onGround = entity.directionY === "down";
                }
            }

            // If there is any collision, return the index of the object
            if (objCollision) {
                return i;
            }
        }

        return this.gp.obj.length;  // Return this when no collision is found
    }

    checkPlayerEnemyCollision(player, enemy) {
        // Player's hitbox
        let playerHitBoxLeftWorldX = player.worldX + player.hitBox.x;
        let playerHitBoxTopWorldY = player.worldY + player.hitBox.y;
        let playerHitBoxRightWorldX = player.worldX + player.hitBox.x + player.hitBox.width;
        let playerHitBoxBottomWorldY = player.worldY + player.hitBox.y + player.hitBox.height;

        // Enemy's hitbox
        const verticalOffset = this.gp.tileSize / 4; // Easier to defeat enemies
        const enemyHitBoxLeftWorldX = enemy.worldX + enemy.hitBox.x;
        const enemyHitBoxTopWorldY = enemy.worldY + enemy.hitBox.y + verticalOffset;
        const enemyHitBoxRightWorldX = enemy.worldX + enemy.hitBox.x + enemy.hitBox.width;
        const enemyHitBoxBottomWorldY = enemy.worldY + enemy.hitBox.y + enemy.hitBox.height;

        // Adjust player's horizontal hitbox based on direction
        switch (player.directionX) {
            case "left":
                playerHitBoxLeftWorldX -= player.speed;
                playerHitBoxRightWorldX -= player.speed;
                break;
            case "right":
                playerHitBoxLeftWorldX += player.speed;
                playerHitBoxRightWorldX += player.speed;
                break;
        }

        // Check for horizontal overlap
        if (playerHitBoxLeftWorldX < enemyHitBoxRightWorldX &&
            playerHitBoxRightWorldX > enemyHitBoxLeftWorldX &&
            playerHitBoxTopWorldY < enemyHitBoxBottomWorldY &&
            playerHitBoxBottomWorldY > enemyHitBoxTopWorldY) {
            if (player.effect === "Donut") {
                enemy.alive = false;
            } else {
                player.alive = false;  // Player dies from horizontal collision with enemy
            }
        }

        // Adjust player's vertical hitbox based on velocity
        const playerVelocityY = player.velocityY;
        playerHitBoxTopWorldY += playerVelocityY;
        playerHitBoxBottomWorldY += playerVelocityY;

        if (playerHitBoxLeftWorldX < enemyHitBoxRightWorldX &&
            playerHitBoxRightWorldX > enemyHitBoxLeftWorldX &&
            playerHitBoxTopWorldY < enemyHitBoxBottomWorldY &&
            playerHitBoxBottomWorldY > enemyHitBoxTopWorldY) {
            // If player is falling onto the enemy
            if (player.velocityY > 0 && playerHitBoxBottomWorldY <= enemyHitBoxTopWorldY + player.maxFallSpeed) {
                enemy.alive = false;  // Player defeats the enemy
                player.onGround = false;  // Jump after defeating the enemy
                player.velocityY = player.jumpStrength;  // Boost the player up
            } else if (player.velocityY < 0 && playerHitBoxTopWorldY >= enemyHitBoxBottomWorldY + Math.abs(player.jumpStrength)) {
                if (player.effect === "Donut") {
                    enemy.alive = false;
                } else {
                    player.alive = false;  // Player dies from collision with enemy
                }
            }
        }
    }

    checkPlayerProjectileCollision(player, projectile) {
        // Player's hitbox
        let playerHitBoxLeftWorldX = player.worldX + player.hitBox.x;
        let playerHitBoxTopWorldY = player.worldY + player.hitBox.y;
        let playerHitBoxRightWorldX = player.worldX + player.hitBox.x + player.hitBox.width;
        let playerHitBoxBottomWorldY = player.worldY + player.hitBox.y + player.hitBox.height;
    
        // Projectile's hitbox
        let projectileHitBoxLeftWorldX = projectile.worldX + projectile.hitBox.x;
        let projectileHitBoxTopWorldY = projectile.worldY + projectile.hitBox.y;
        let projectileHitBoxRightWorldX = projectile.worldX + projectile.hitBox.x + projectile.hitBox.width;
        let projectileHitBoxBottomWorldY = projectile.worldY + projectile.hitBox.y + projectile.hitBox.height;
    
        // Adjust player's horizontal hitbox based on direction
        switch (player.directionX) {
            case "left":
                playerHitBoxLeftWorldX -= player.speed;
                playerHitBoxRightWorldX -= player.speed;
                break;
            case "right":
                playerHitBoxLeftWorldX += player.speed;
                playerHitBoxRightWorldX += player.speed;
                break;
        }
    
        // Adjust projectile's hitbox based on its movement
        projectileHitBoxLeftWorldX += projectile.incrementX;
        projectileHitBoxTopWorldY += projectile.incrementY;
        projectileHitBoxRightWorldX += projectile.incrementX;
        projectileHitBoxBottomWorldY += projectile.incrementY;
    
        // Check for overlap between player and projectile hitboxes (both horizontal and vertical)
        if (playerHitBoxLeftWorldX < projectileHitBoxRightWorldX &&
            playerHitBoxRightWorldX > projectileHitBoxLeftWorldX &&
            playerHitBoxTopWorldY < projectileHitBoxBottomWorldY &&
            playerHitBoxBottomWorldY > projectileHitBoxTopWorldY) {
            if (player.effect != "Donut") {
                player.alive = false;  // Player dies from collision with projectile
            }
        }
    }
    
}
