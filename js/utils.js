/**
 * Fonctions utilitaires pour le jeu
 */

// Convertit les coordonnées de la grille en coordonnées du canvas
function gridToPixel(gridX, gridY) {
    return {
        x: gridX * CELL_SIZE,
        y: gridY * CELL_SIZE
    };
}

// Convertit les coordonnées du canvas en coordonnées de la grille
function pixelToGrid(pixelX, pixelY) {
    return {
        x: Math.floor(pixelX / CELL_SIZE),
        y: Math.floor(pixelY / CELL_SIZE)
    };
}

// Vérifie si deux objets sont en collision
function checkCollision(obj1, obj2, threshold = CELL_SIZE / 2) {
    const distance = Math.sqrt(
        Math.pow(obj1.x - obj2.x, 2) + 
        Math.pow(obj1.y - obj2.y, 2)
    );
    return distance < threshold;
}

// Calcule la distance entre deux points
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Vérifie si une position est valide dans le labyrinthe
function isValidPosition(x, y, maze) {
    // Vérifie si la position est dans les limites du labyrinthe
    if (x < 0 || y < 0 || y >= maze.length || x >= maze[0].length) {
        return false;
    }
    
    // Vérifie si la position n'est pas un mur
    return maze[y][x] !== WALL;
}

// Calcule la direction opposée
function getOppositeDirection(direction) {
    switch (direction) {
        case UP: return DOWN;
        case DOWN: return UP;
        case LEFT: return RIGHT;
        case RIGHT: return LEFT;
        default: return direction;
    }
}

// Obtient les coordonnées de la cellule devant dans une direction donnée
function getCellInFront(x, y, direction) {
    switch (direction) {
        case UP: return { x, y: y - 1 };
        case DOWN: return { x, y: y + 1 };
        case LEFT: return { x: x - 1, y };
        case RIGHT: return { x: x + 1, y };
        default: return { x, y };
    }
}

// Vérifie si un mouvement est possible dans une direction donnée
function canMove(x, y, direction, maze) {
    const cell = getCellInFront(x, y, direction);
    return isValidPosition(cell.x, cell.y, maze);
}

// Obtient les directions possibles à partir d'une position
function getPossibleDirections(x, y, maze) {
    const directions = [];
    
    if (canMove(x, y, UP, maze)) directions.push(UP);
    if (canMove(x, y, RIGHT, maze)) directions.push(RIGHT);
    if (canMove(x, y, DOWN, maze)) directions.push(DOWN);
    if (canMove(x, y, LEFT, maze)) directions.push(LEFT);
    
    return directions;
}

// Choisit une direction aléatoire parmi les directions possibles
function getRandomDirection(possibleDirections) {
    if (possibleDirections.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * possibleDirections.length);
    return possibleDirections[randomIndex];
}

// Applique un filtre de couleur à une image
function applyColorFilter(ctx, img, color) {
    // Dessine l'image originale sur un canvas temporaire
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    
    // Dessine l'image sur le canvas temporaire
    tempCtx.drawImage(img, 0, 0);
    
    // Récupère les données de l'image
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;
    
    // Applique le filtre de couleur
    for (let i = 0; i < data.length; i += 4) {
        // Si le pixel n'est pas transparent
        if (data[i + 3] > 0) {
            // Conserve l'alpha et applique la teinte
            data[i] = (data[i] * color.r) / 255;
            data[i + 1] = (data[i + 1] * color.g) / 255;
            data[i + 2] = (data[i + 2] * color.b) / 255;
        }
    }
    
    // Remet les données modifiées sur le canvas temporaire
    tempCtx.putImageData(imageData, 0, 0);
    
    return tempCanvas;
}

// Joue un son avec gestion des erreurs
function playSound(soundId) {
    try {
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Erreur de lecture audio:", e));
        }
    } catch (e) {
        console.log("Erreur lors de la lecture du son:", e);
    }
}

// Anime un clignotement pour les power pellets
function animatePowerPellet(ctx, x, y, radius, frame) {
    const pulseScale = 0.8 + 0.2 * Math.sin(frame * 0.1);
    const glowRadius = radius * pulseScale;
    
    // Dessine le halo lumineux
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius * 2);
    gradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 153, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 153, 0, 0)');
    
    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(x, y, glowRadius * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Dessine la power pellet
    ctx.beginPath();
    ctx.fillStyle = '#ffcc00';
    ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
    ctx.fill();
}

// Fonction pour dessiner un texte avec effet néon
function drawNeonText(ctx, text, x, y, fontSize, color, glowColor) {
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Dessine le halo lumineux
    ctx.shadowBlur = 10;
    ctx.shadowColor = glowColor;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    
    // Réinitialise l'ombre
    ctx.shadowBlur = 0;
}

// Fonction pour dessiner un rectangle avec effet néon
function drawNeonRect(ctx, x, y, width, height, color, glowColor) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = glowColor;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    
    // Réinitialise l'ombre
    ctx.shadowBlur = 0;
}
