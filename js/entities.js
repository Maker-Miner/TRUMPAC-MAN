/**
 * Définition des entités du jeu (Pac-Man et les fantômes)
 */

// Classe de base pour les entités
class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.direction = RIGHT;
        this.nextDirection = null;
        this.speed = 0;
        this.gridX = Math.floor(x / CELL_SIZE);
        this.gridY = Math.floor(y / CELL_SIZE);
        this.targetX = this.x;
        this.targetY = this.y;
    }
    
    // Mise à jour de la position
    update(maze) {
        // Mettre à jour les coordonnées de la grille
        this.gridX = Math.floor(this.x / CELL_SIZE);
        this.gridY = Math.floor(this.y / CELL_SIZE);
        
        // Vérifier si l'entité est au centre d'une cellule
        const centerX = this.gridX * CELL_SIZE + CELL_SIZE / 2;
        const centerY = this.gridY * CELL_SIZE + CELL_SIZE / 2;
        const atCenterX = Math.abs(this.x - centerX) < this.speed;
        const atCenterY = Math.abs(this.y - centerY) < this.speed;
        
        // Si l'entité est au centre d'une cellule, elle peut changer de direction
        if (atCenterX && atCenterY) {
            // Centrer l'entité
            this.x = centerX;
            this.y = centerY;
            
            // Vérifier si la direction suivante est valide
            if (this.nextDirection !== null) {
                if (canMove(this.gridX, this.gridY, this.nextDirection, maze.layout)) {
                    this.direction = this.nextDirection;
                }
                this.nextDirection = null;
            }
            
            // Vérifier si la direction actuelle est valide
            if (!canMove(this.gridX, this.gridY, this.direction, maze.layout)) {
                // Si la direction actuelle n'est pas valide, arrêter l'entité
                return;
            }
        }
        
        // Déplacer l'entité dans la direction actuelle
        switch (this.direction) {
            case UP:
                this.y -= this.speed;
                break;
            case RIGHT:
                this.x += this.speed;
                break;
            case DOWN:
                this.y += this.speed;
                break;
            case LEFT:
                this.x -= this.speed;
                break;
        }
        
        // Gestion des tunnels (téléportation d'un côté à l'autre)
        if (this.x < 0) {
            this.x = maze.width * CELL_SIZE - this.speed;
        } else if (this.x >= maze.width * CELL_SIZE) {
            this.x = 0;
        }
    }
    
    // Dessiner l'entité
    draw(ctx) {
        // À implémenter dans les classes dérivées
    }
}

// Classe pour Pac-Man
class PacMan extends Entity {
    constructor(x, y) {
        super(x, y);
        this.speed = PACMAN_SPEED;
        this.mouthOpen = true;
        this.mouthAngle = 0;
        this.animationCounter = 0;
        this.lives = 3;
        this.score = 0;
        this.powerMode = false;
        this.powerModeTimer = null;
        
        // Chargement des sprites
        this.spriteOpen = new Image();
        this.spriteOpen.src = SPRITE_PACMAN_OPEN;
        
        this.spriteClosed = new Image();
        this.spriteClosed.src = SPRITE_PACMAN_CLOSED;
    }
    
    // Mise à jour de Pac-Man
    update(maze, ghosts, game) {
        super.update(maze);
        
        // Animation de la bouche
        this.animationCounter++;
        if (this.animationCounter >= 10) {
            this.mouthOpen = !this.mouthOpen;
            this.animationCounter = 0;
        }
        
        // Vérifier les collisions avec les pellets
        const pellet = maze.checkPellet(this.x, this.y);
        if (pellet) {
            this.score += pellet.points;
            
            // Si c'est une power pellet, activer le mode power
            if (pellet.type === POWER_PELLET) {
                this.activatePowerMode(game);
            }
        }
        
        // Vérifier les collisions avec les fantômes
        for (const ghost of ghosts) {
            if (checkCollision(this, ghost)) {
                if (ghost.frightened) {
                    // Manger le fantôme
                    ghost.eaten = true;
                    this.score += GHOST_POINTS;
                    playSound('eatGhostSound');
                } else if (!ghost.eaten) {
                    // Perdre une vie
                    this.die();
                    return;
                }
            }
        }
    }
    
    // Dessiner Pac-Man
    draw(ctx) {
        ctx.save();
        
        // Rotation en fonction de la direction
        ctx.translate(this.x, this.y);
        
        switch (this.direction) {
            case UP:
                ctx.rotate(-Math.PI / 2);
                break;
            case RIGHT:
                // Pas de rotation nécessaire
                break;
            case DOWN:
                ctx.rotate(Math.PI / 2);
                break;
            case LEFT:
                ctx.rotate(Math.PI);
                break;
        }
        
        // Dessiner le sprite approprié
        const sprite = this.mouthOpen ? this.spriteOpen : this.spriteClosed;
        
        // Appliquer une animation de chomp
        const scale = 1 + 0.1 * Math.sin(this.animationCounter * 0.5);
        ctx.scale(scale, scale);
        
        // Dessiner le sprite
        ctx.drawImage(
            sprite,
            -CELL_SIZE / 2,
            -CELL_SIZE / 2,
            CELL_SIZE,
            CELL_SIZE
        );
        
        ctx.restore();
    }
    
    // Activer le mode power
    activatePowerMode(game) {
        this.powerMode = true;
        
        // Réinitialiser le timer si déjà actif
        if (this.powerModeTimer) {
            clearTimeout(this.powerModeTimer);
        }
        
        // Définir un timer pour désactiver le mode power
        this.powerModeTimer = setTimeout(() => {
            this.powerMode = false;
            this.powerModeTimer = null;
        }, game.powerPelletDuration);
    }
    
    // Perdre une vie
    die() {
        this.lives--;
        playSound('deathSound');
        
        // Réinitialiser le mode power
        this.powerMode = false;
        if (this.powerModeTimer) {
            clearTimeout(this.powerModeTimer);
            this.powerModeTimer = null;
        }
    }
    
    // Réinitialiser Pac-Man
    reset(position) {
        this.x = position.x * CELL_SIZE + CELL_SIZE / 2;
        this.y = position.y * CELL_SIZE + CELL_SIZE / 2;
        this.direction = RIGHT;
        this.nextDirection = null;
        this.mouthOpen = true;
        this.animationCounter = 0;
    }
}

// Classe pour les fantômes
class Ghost extends Entity {
    constructor(x, y, color, personality) {
        super(x, y);
        this.speed = GHOST_SPEED;
        this.color = color;
        this.personality = personality;
        this.frightened = false;
        this.frightenedTimer = null;
        this.eaten = false;
        this.eatenTimer = null;
        this.scatterMode = true;
        this.scatterTimer = null;
        this.targetCell = { x: 0, y: 0 };
        
        // Chargement des sprites
        this.spriteNormal = new Image();
        this.spriteNormal.src = SPRITE_GHOST_NORMAL;
        
        this.spriteFrightened = new Image();
        this.spriteFrightened.src = SPRITE_GHOST_FRIGHTENED;
        
        // Définir le timer pour alterner entre les modes scatter et chase
        this.startScatterChaseTimer();
    }
    
    // Mise à jour du fantôme
    update(maze, pacman) {
        // Si le fantôme a été mangé, le renvoyer à la maison
        if (this.eaten) {
            // Calculer le chemin vers la maison
            const home = { x: 13.5 * CELL_SIZE, y: 14 * CELL_SIZE };
            
            // Déplacer rapidement vers la maison
            const dx = home.x - this.x;
            const dy = home.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.speed) {
                // Arrivé à la maison
                this.x = home.x;
                this.y = home.y;
                this.gridX = Math.floor(this.x / CELL_SIZE);
                this.gridY = Math.floor(this.y / CELL_SIZE);
                this.eaten = false;
                this.frightened = false;
                
                // Attendre un peu avant de ressortir
                setTimeout(() => {
                    this.direction = UP;
                }, 2000);
            } else {
                // Se déplacer vers la maison
                this.x += (dx / distance) * this.speed * 2;
                this.y += (dy / distance) * this.speed * 2;
                
                // Mettre à jour les coordonnées de la grille
                this.gridX = Math.floor(this.x / CELL_SIZE);
                this.gridY = Math.floor(this.y / CELL_SIZE);
            }
            
            return;
        }
        
        // Déterminer la cellule cible en fonction du mode et de la personnalité
        this.updateTargetCell(pacman, maze);
        
        // Si le fantôme est à un carrefour, choisir la meilleure direction
        const centerX = this.gridX * CELL_SIZE + CELL_SIZE / 2;
        const centerY = this.gridY * CELL_SIZE + CELL_SIZE / 2;
        const atCenter = Math.abs(this.x - centerX) < this.speed && Math.abs(this.y - centerY) < this.speed;
        
        if (atCenter) {
            // Centrer le fantôme
            this.x = centerX;
            this.y = centerY;
            
            // Obtenir les directions possibles
            let possibleDirections = getPossibleDirections(this.gridX, this.gridY, maze.layout);
            
            // Les fantômes ne peuvent pas faire demi-tour sauf s'ils sont effrayés
            if (!this.frightened && possibleDirections.length > 1) {
                const oppositeDir = getOppositeDirection(this.direction);
                possibleDirections = possibleDirections.filter(dir => dir !== oppositeDir);
            }
            
            if (possibleDirections.length > 0) {
                if (this.frightened) {
                    // En mode effrayé, choisir une direction aléatoire
                    this.direction = getRandomDirection(possibleDirections);
                } else {
                    // Choisir la direction qui rapproche le plus de la cible
                    let bestDirection = possibleDirections[0];
                    let bestDistance = Infinity;
                    
                    for (const dir of possibleDirections) {
                        const nextCell = getCellInFront(this.gridX, this.gridY, dir);
                        const distance = Math.pow(nextCell.x - this.targetCell.x, 2) + 
                                        Math.pow(nextCell.y - this.targetCell.y, 2);
                        
                        if (distance < bestDistance) {
                            bestDistance = distance;
                            bestDirection = dir;
                        }
                    }
                    
                    this.direction = bestDirection;
                }
            }
        }
        
        // Mettre à jour la vitesse en fonction du mode
        this.speed = this.frightened ? GHOST_FRIGHTENED_SPEED : GHOST_SPEED;
        
        // Déplacer le fantôme
        super.update(maze);
    }
    
    // Dessiner le fantôme
    draw(ctx) {
        ctx.save();
        
        if (this.eaten) {
            // Fantôme mangé (yeux seulement)
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.x - 5, this.y - 5, 3, 0, Math.PI * 2);
            ctx.arc(this.x + 5, this.y - 5, 3, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.frightened) {
            let sprite = this.spriteFrightened;
            
            // Faire clignoter le fantôme lorsque le mode effrayé est sur le point de se terminer
            if (this.frightenedTimer && Date.now() - this.frightenedTimer > game.powerPelletDuration - 2000) {
                if (Math.floor(Date.now() / 200) % 2 === 0) {
                    sprite = this.spriteNormal;
                }
            }
            
            // Dessiner le sprite effrayé sans modification
            ctx.drawImage(
                sprite,
                this.x - CELL_SIZE / 2,
                this.y - CELL_SIZE / 2,
                CELL_SIZE,
                CELL_SIZE
            );
        } else {
            // Fantôme normal - sans coloration
            ctx.drawImage(
                this.spriteNormal,
                this.x - CELL_SIZE / 2,
                this.y - CELL_SIZE / 2,
                CELL_SIZE,
                CELL_SIZE
            );
        }
        
        ctx.restore();
    }
    
    // Mettre à jour la cellule cible en fonction du mode et de la personnalité
    updateTargetCell(pacman, maze) {
        if (this.scatterMode) {
            // En mode scatter, chaque fantôme vise un coin différent
            switch (this.personality) {
                case 'blinky': // Rouge - coin supérieur droit
                    this.targetCell = { x: maze.width - 2, y: 1 };
                    break;
                case 'pinky': // Rose - coin supérieur gauche
                    this.targetCell = { x: 1, y: 1 };
                    break;
                case 'inky': // Cyan - coin inférieur droit
                    this.targetCell = { x: maze.width - 2, y: maze.height - 2 };
                    break;
                case 'clyde': // Orange - coin inférieur gauche
                    this.targetCell = { x: 1, y: maze.height - 2 };
                    break;
            }
        } else {
            // En mode chase, chaque fantôme a sa propre stratégie
            switch (this.personality) {
                case 'blinky': // Rouge - vise directement Pac-Man
                    this.targetCell = { x: pacman.gridX, y: pacman.gridY };
                    break;
                case 'pinky': // Rose - vise 4 cases devant Pac-Man
                    let targetX = pacman.gridX;
                    let targetY = pacman.gridY;
                    
                    // Calculer la position 4 cases devant Pac-Man
                    switch (pacman.direction) {
                        case UP:
                            targetY -= 4;
                            break;
                        case RIGHT:
                            targetX += 4;
                            break;
                        case DOWN:
                            targetY += 4;
                            break;
                        case LEFT:
                            targetX -= 4;
                            break;
                    }
                    
                    this.targetCell = { x: targetX, y: targetY };
                    break;
                case 'inky': // Cyan - position complexe basée sur Blinky et Pac-Man
                    // Trouver la position 2 cases devant Pac-Man
                    let pivotX = pacman.gridX;
                    let pivotY = pacman.gridY;
                    
                    switch (pacman.direction) {
                        case UP:
                            pivotY -= 2;
                            break;
                        case RIGHT:
                            pivotX += 2;
                            break;
                        case DOWN:
                            pivotY += 2;
                            break;
                        case LEFT:
                            pivotX -= 2;
                            break;
                    }
                    
                    // Calculer le vecteur de Blinky à ce point
                    const blinkyX = Math.floor(this.x / CELL_SIZE);
                    const blinkyY = Math.floor(this.y / CELL_SIZE);
                    
                    // Doubler ce vecteur
                    this.targetCell = {
                        x: pivotX + (pivotX - blinkyX),
                        y: pivotY + (pivotY - blinkyY)
                    };
                    break;
                case 'clyde': // Orange - alterne entre viser Pac-Man et son coin
                    const distToPacman = Math.sqrt(
                        Math.pow(pacman.gridX - this.gridX, 2) + 
                        Math.pow(pacman.gridY - this.gridY, 2)
                    );
                    
                    // Si Clyde est à plus de 8 cases de Pac-Man, il le vise
                    // Sinon, il vise son coin
                    if (distToPacman > 8) {
                        this.targetCell = { x: pacman.gridX, y: pacman.gridY };
                    } else {
                        this.targetCell = { x: 1, y: maze.height - 2 };
                    }
                    break;
            }
        }
    }
    
    // Effrayer le fantôme
    frighten(game) {
        if (!this.eaten) {
            this.frightened = true;
            
            // Réinitialiser le timer si déjà actif
            if (this.frightenedTimer) {
                clearTimeout(this.frightenedTimer);
            }
            
            // Définir un timer pour désactiver le mode effrayé
            this.frightenedTimer = setTimeout(() => {
                this.frightened = false;
                this.frightenedTimer = null;
            }, game.powerPelletDuration);
            
            // Faire demi-tour
            this.direction = getOppositeDirection(this.direction);
        }
    }
    
    // Démarrer le timer pour alterner entre les modes scatter et chase
    startScatterChaseTimer() {
        // Commencer en mode scatter pendant 7 secondes
        this.scatterMode = true;
        
        // Alterner entre scatter (7s) et chase (20s)
        setTimeout(() => {
            this.scatterMode = false;
            
            setTimeout(() => {
                this.scatterMode = true;
                
                setTimeout(() => {
                    this.scatterMode = false;
                    
                    setTimeout(() => {
                        this.scatterMode = true;
                        
                        setTimeout(() => {
                            this.scatterMode = false;
                        }, 5000);
                    }, 20000);
                }, 5000);
            }, 20000);
        }, 7000);
    }
    
    // Réinitialiser le fantôme
    reset(position) {
        this.x = position.x * CELL_SIZE + CELL_SIZE / 2;
        this.y = position.y * CELL_SIZE + CELL_SIZE / 2;
        this.gridX = position.x;
        this.gridY = position.y;
        this.direction = UP;
        this.nextDirection = null;
        this.frightened = false;
        this.eaten = false;
        
        if (this.frightenedTimer) {
            clearTimeout(this.frightenedTimer);
            this.frightenedTimer = null;
        }
        
        if (this.eatenTimer) {
            clearTimeout(this.eatenTimer);
            this.eatenTimer = null;
        }
    }
}
