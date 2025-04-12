/**
 * Définition et gestion du labyrinthe
 */

class Maze {
    constructor() {
        // Définition du labyrinthe
        // 0 = vide, 1 = mur, 2 = pellet, 3 = power pellet
        this.layout = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
            [1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3, 1],
            [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
            [1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0,],
            [0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
            [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
            [1, 3, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 3, 1],
            [1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1],
            [1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1],
            [1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
            [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
        
        this.width = this.layout[0].length;
        this.height = this.layout.length;
        
        // Compteur de pellets
        this.totalPellets = 0;
        this.remainingPellets = 0;
        
        // Compter le nombre total de pellets
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.layout[y][x] === PELLET || this.layout[y][x] === POWER_PELLET) {
                    this.totalPellets++;
                }
            }
        }
        
        this.remainingPellets = this.totalPellets;
        
        // Position du fruit
        this.fruitPosition = { x: 13, y: 17 };
        this.fruitActive = false;
        this.fruitTimer = null;
        
        // Positions de départ
        this.pacmanStartPosition = { x: 14, y: 23 };
        this.ghostStartPositions = [
            { x: 13, y: 14 }, // Blinky (rouge)
            { x: 14, y: 14 }, // Pinky (rose)
            { x: 13, y: 15 }, // Inky (cyan)
            { x: 14, y: 15 }  // Clyde (orange)
        ];
    }
    
    // Réinitialise le labyrinthe pour un nouveau niveau
    reset() {
        // Réinitialiser les pellets
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // Si c'est un emplacement vide qui devrait contenir une pellet
                if (this.layout[y][x] === EMPTY && this.originalLayout[y][x] === PELLET) {
                    this.layout[y][x] = PELLET;
                }
                // Si c'est un emplacement vide qui devrait contenir une power pellet
                else if (this.layout[y][x] === EMPTY && this.originalLayout[y][x] === POWER_PELLET) {
                    this.layout[y][x] = POWER_PELLET;
                }
            }
        }
        
        this.remainingPellets = this.totalPellets;
        this.fruitActive = false;
        
        if (this.fruitTimer) {
            clearTimeout(this.fruitTimer);
            this.fruitTimer = null;
        }
    }
    
    // Initialise le labyrinthe
    initialize() {
        // Sauvegarde de la disposition originale
        this.originalLayout = JSON.parse(JSON.stringify(this.layout));
        
        // Charger l'image de la pièce
        this.coinImage = new Image();
        this.coinImage.src = 'images/coin.png';
    }
    
    // Dessine le labyrinthe
    draw(ctx, frame) {
        const wallColor = getComputedStyle(document.documentElement).getPropertyValue('--wall-color').trim();
        const wallGlow = getComputedStyle(document.documentElement).getPropertyValue('--wall-glow').trim();
        const pelletColor = getComputedStyle(document.documentElement).getPropertyValue('--pellet-color').trim();
        
        // Dessiner le fond du labyrinthe
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--maze-color').trim();
        ctx.fillRect(0, 0, this.width * CELL_SIZE, this.height * CELL_SIZE);
        
        // Dessiner les murs, pellets et power pellets
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.layout[y][x];
                const pixelX = x * CELL_SIZE;
                const pixelY = y * CELL_SIZE;
                
                if (cell === WALL) {
                    // Dessiner un mur avec effet néon
                    drawNeonRect(
                        ctx, 
                        pixelX, 
                        pixelY, 
                        CELL_SIZE, 
                        CELL_SIZE, 
                        wallColor, 
                        wallGlow
                    );
                    
                    // Remplir le mur
                    ctx.fillStyle = wallColor;
                    ctx.fillRect(
                        pixelX + 2, 
                        pixelY + 2, 
                        CELL_SIZE - 4, 
                        CELL_SIZE - 4
                    );
                } 
                else if (cell === PELLET) {
                    // Dessiner une pièce (coin) à la place de la pellet
                    if (this.coinImage && this.coinImage.complete) {
                        // Taille de la pièce (même taille que Pac-Man)
                        const coinSize = CELL_SIZE * 0.8;
                        
                        // Dessiner l'image de la pièce
                        ctx.drawImage(
                            this.coinImage,
                            pixelX + (CELL_SIZE - coinSize) / 2,
                            pixelY + (CELL_SIZE - coinSize) / 2,
                            coinSize,
                            coinSize
                        );
                    } else {
                        // Fallback si l'image n'est pas chargée
                        ctx.beginPath();
                        ctx.fillStyle = pelletColor;
                        ctx.arc(
                            pixelX + CELL_SIZE / 2, 
                            pixelY + CELL_SIZE / 2, 
                            CELL_SIZE / 10, 
                            0, 
                            Math.PI * 2
                        );
                        ctx.fill();
                    }
                } 
                else if (cell === POWER_PELLET) {
                    // Dessiner une power pellet avec animation
                    animatePowerPellet(
                        ctx, 
                        pixelX + CELL_SIZE / 2, 
                        pixelY + CELL_SIZE / 2, 
                        CELL_SIZE / 4, 
                        frame
                    );
                }
                else if (cell === FRUIT && this.fruitActive) {
                    // Dessiner le fruit (cerise)
                    ctx.beginPath();
                    ctx.fillStyle = '#ff0000';
                    ctx.arc(
                        pixelX + CELL_SIZE / 2, 
                        pixelY + CELL_SIZE / 2, 
                        CELL_SIZE / 3, 
                        0, 
                        Math.PI * 2
                    );
                    ctx.fill();
                    
                    // Tige
                    ctx.beginPath();
                    ctx.strokeStyle = '#00aa00';
                    ctx.lineWidth = 2;
                    ctx.moveTo(pixelX + CELL_SIZE / 2, pixelY + CELL_SIZE / 2 - CELL_SIZE / 3);
                    ctx.lineTo(pixelX + CELL_SIZE / 2 + CELL_SIZE / 4, pixelY + CELL_SIZE / 2 - CELL_SIZE / 2);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Vérifie si Pac-Man peut manger une pellet à une position donnée
    checkPellet(x, y) {
        const gridPos = pixelToGrid(x, y);
        
        // Vérifier si la position est dans les limites du labyrinthe
        if (gridPos.x < 0 || gridPos.y < 0 || gridPos.y >= this.height || gridPos.x >= this.width) {
            return null;
        }
        
        const cell = this.layout[gridPos.y][gridPos.x];
        
        if (cell === PELLET) {
            // Manger une pellet normale
            this.layout[gridPos.y][gridPos.x] = EMPTY;
            this.remainingPellets--;
            
            // Jouer le son
            playSound('pelletSound');
            
            // Vérifier si on doit faire apparaître un fruit
            this.checkFruitSpawn();
            
            return { type: PELLET, points: PELLET_POINTS };
        } 
        else if (cell === POWER_PELLET) {
            // Manger une power pellet
            this.layout[gridPos.y][gridPos.x] = EMPTY;
            this.remainingPellets--;
            
            // Jouer le son
            playSound('powerPelletSound');
            
            // Vérifier si on doit faire apparaître un fruit
            this.checkFruitSpawn();
            
            return { type: POWER_PELLET, points: POWER_PELLET_POINTS };
        }
        else if (cell === FRUIT && this.fruitActive) {
            // Manger un fruit
            this.layout[gridPos.y][gridPos.x] = EMPTY;
            this.fruitActive = false;
            
            // Annuler le timer du fruit
            if (this.fruitTimer) {
                clearTimeout(this.fruitTimer);
                this.fruitTimer = null;
            }
            
            // Jouer le son
            playSound('fruitSound');
            
            return { type: FRUIT, points: FRUIT_POINTS };
        }
        
        return null;
    }
    
    // Vérifie si toutes les pellets ont été mangées
    isComplete() {
        return this.remainingPellets === 0;
    }
    
    // Fait apparaître un fruit
    spawnFruit() {
        if (!this.fruitActive) {
            this.layout[this.fruitPosition.y][this.fruitPosition.x] = FRUIT;
            this.fruitActive = true;
            
            // Définir un timer pour faire disparaître le fruit
            this.fruitTimer = setTimeout(() => {
                if (this.fruitActive) {
                    this.layout[this.fruitPosition.y][this.fruitPosition.x] = EMPTY;
                    this.fruitActive = false;
                }
                this.fruitTimer = null;
            }, FRUIT_DURATION);
        }
    }
    
    // Vérifie si on doit faire apparaître un fruit
    checkFruitSpawn() {
        // Faire apparaître un fruit lorsque 70 pellets ont été mangées, puis à 170
        const pelletsEaten = this.totalPellets - this.remainingPellets;
        if ((pelletsEaten === 70 || pelletsEaten === 170) && !this.fruitActive) {
            this.spawnFruit();
        }
    }
}
