/**
 * Classe principale du jeu
 */
class Game {
    constructor() {
        // Récupérer le canvas et son contexte
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Initialiser les dimensions du canvas
        this.resize();
        
        // Créer le labyrinthe
        this.maze = new Maze();
        this.maze.initialize();
        
        // Créer Pac-Man
        const pacmanPos = this.maze.pacmanStartPosition;
        this.pacman = new PacMan(
            pacmanPos.x * CELL_SIZE + CELL_SIZE / 2,
            pacmanPos.y * CELL_SIZE + CELL_SIZE / 2
        );
        
        // Créer les fantômes
        this.ghosts = [];
        const personalities = ['blinky', 'pinky', 'inky', 'clyde'];
        
        for (let i = 0; i < 4; i++) {
            const ghostPos = this.maze.ghostStartPositions[i];
            const ghost = new Ghost(
                ghostPos.x * CELL_SIZE + CELL_SIZE / 2,
                ghostPos.y * CELL_SIZE + CELL_SIZE / 2,
                GHOST_COLORS[i],
                personalities[i]
            );
            this.ghosts.push(ghost);
        }
        
        // État du jeu
        this.state = GAME_IDLE;
        this.level = 1;
        this.frame = 0;
        this.paused = false;
        
        // Durée du mode power (initialisée avec la constante)
        this.powerPelletDuration = POWER_PELLET_DURATION;
        
        // Éléments d'interface
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.levelElement = document.getElementById('level');
        this.finalScoreElement = document.getElementById('finalScore');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.startScreen = document.getElementById('startScreen');
        
        // Écouteurs d'événements
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('resize', this.resize.bind(this));
        document.getElementById('restartButton').addEventListener('click', this.restart.bind(this));
        document.getElementById('startButton').addEventListener('click', this.start.bind(this));
        
        // Afficher l'écran de démarrage
        this.showStartScreen();
    }
    
    // Redimensionner le canvas
    resize() {
        // Calculer la taille optimale pour le canvas
        const containerWidth = document.querySelector('.game-container').clientWidth;
        const containerHeight = window.innerHeight * 0.7;
        
        // Définir la taille du canvas
        this.canvas.width = 28 * CELL_SIZE;
        this.canvas.height = 31 * CELL_SIZE;
        
        // Adapter l'échelle du canvas pour qu'il s'adapte à la taille du conteneur
        const scaleX = containerWidth / this.canvas.width;
        const scaleY = containerHeight / this.canvas.height;
        const scale = Math.min(scaleX, scaleY);
        
        // Appliquer l'échelle via CSS
    }
    
    // Démarrer le jeu
    start() {
        this.state = GAME_PLAYING;
        this.startScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        
        // Jouer le son de démarrage
        playSound('startGameSound');
        
        // Démarrer la boucle de jeu
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));
        
        // Mettre à jour l'affichage des vies
        this.updateLivesDisplay();
    }
    
    // Redémarrer le jeu
    restart() {
        // Réinitialiser le jeu
        this.level = 1;
        this.pacman.lives = 3;
        this.pacman.score = 0;
        
        // Réinitialiser le labyrinthe
        this.maze = new Maze();
        this.maze.initialize();
        
        // Réinitialiser les positions
        this.resetPositions();
        
        // Démarrer le jeu
        this.start();
    }
    
    // Afficher l'écran de démarrage
    showStartScreen() {
        this.startScreen.classList.remove('hidden');
        this.gameOverScreen.classList.add('hidden');
    }
    
    // Afficher l'écran de game over
    showGameOverScreen() {
        this.gameOverScreen.classList.remove('hidden');
        this.finalScoreElement.textContent = this.pacman.score;
    }
    
    // Mettre à jour l'affichage des vies
    updateLivesDisplay() {
        // Effacer l'affichage des vies
        this.livesElement.innerHTML = '';
        
        // Ajouter une icône pour chaque vie
        for (let i = 0; i < this.pacman.lives; i++) {
            const lifeIcon = document.createElement('img');
            lifeIcon.src = SPRITE_PACMAN_OPEN;
            lifeIcon.alt = 'Vie';
            lifeIcon.width = 20;
            lifeIcon.height = 20;
            this.livesElement.appendChild(lifeIcon);
        }
    }
    
    // Gérer les entrées clavier
    handleKeyDown(event) {
        if (this.state !== GAME_PLAYING) return;
        
        switch (event.key) {
            case 'ArrowUp':
                this.pacman.nextDirection = UP;
                event.preventDefault();
                break;
            case 'ArrowRight':
                this.pacman.nextDirection = RIGHT;
                event.preventDefault();
                break;
            case 'ArrowDown':
                this.pacman.nextDirection = DOWN;
                event.preventDefault();
                break;
            case 'ArrowLeft':
                this.pacman.nextDirection = LEFT;
                event.preventDefault();
                break;
            case 'p':
            case 'P':
                this.togglePause();
                break;
        }
    }
    
    // Mettre en pause / reprendre le jeu
    togglePause() {
        this.paused = !this.paused;
    }
    
    // Boucle principale du jeu
    gameLoop(timestamp) {
        // Calculer le delta time
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Si le jeu est en pause, ne pas mettre à jour
        if (this.paused || this.state !== GAME_PLAYING) {
            requestAnimationFrame(this.gameLoop.bind(this));
            return;
        }
        
        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Mettre à jour le compteur de frames
        this.frame++;
        
        // Mettre à jour les entités
        this.update();
        
        // Dessiner les éléments du jeu
        this.draw();
        
        // Mettre à jour l'affichage du score
        this.scoreElement.textContent = this.pacman.score;
        
        // Vérifier si le niveau est terminé
        if (this.maze.isComplete()) {
            this.levelComplete();
        }
        
        // Vérifier si le jeu est terminé
        if (this.pacman.lives <= 0) {
            this.gameOver();
            return;
        }
        
        // Continuer la boucle de jeu
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    // Mettre à jour les entités
    update() {
        // Mettre à jour Pac-Man
        this.pacman.update(this.maze, this.ghosts, this);
        
        // Mettre à jour les fantômes
        for (const ghost of this.ghosts) {
            ghost.update(this.maze, this.pacman);
            
            // Si Pac-Man est en mode power, effrayer les fantômes
            if (this.pacman.powerMode && !ghost.frightened && !ghost.eaten) {
                ghost.frighten(this);
            }
        }
    }
    
    // Dessiner les éléments du jeu
    draw() {
        // Dessiner le labyrinthe
        this.maze.draw(this.ctx, this.frame);
        
        // Dessiner les fantômes
        for (const ghost of this.ghosts) {
            ghost.draw(this.ctx);
        }
        
        // Dessiner Pac-Man
        this.pacman.draw(this.ctx);
    }
    
    // Gérer la fin d'un niveau
    levelComplete() {
        // Augmenter le niveau
        this.level++;
        
        // Mettre à jour l'affichage du niveau
        this.levelElement.textContent = this.level;
        
        // Réinitialiser le labyrinthe
        this.maze = new Maze();
        this.maze.initialize();
        this.maze.reset();
        
        // Réinitialiser les positions
        this.resetPositions();
        
        // Augmenter la difficulté
        this.increaseDifficulty();
    }
    
    // Augmenter la difficulté en fonction du niveau
    increaseDifficulty() {
        // Limiter le niveau de difficulté à 10
        const difficultyLevel = Math.min(this.level - 1, 9);
        const difficulty = DIFFICULTY_LEVELS[difficultyLevel];
        
        // Appliquer la difficulté aux fantômes
        for (const ghost of this.ghosts) {
            ghost.speed = difficulty.ghostSpeed;
        }
        
        // Mettre à jour la durée du mode power (utiliser la variable d'instance)
        this.powerPelletDuration = difficulty.frightDuration;
    }
    
    // Réinitialiser les positions après une mort
    resetPositions() {
        // Réinitialiser Pac-Man
        this.pacman.reset(this.maze.pacmanStartPosition);
        
        // Réinitialiser les fantômes
        for (let i = 0; i < this.ghosts.length; i++) {
            this.ghosts[i].reset(this.maze.ghostStartPositions[i]);
        }
        
        // Mettre à jour l'affichage des vies
        this.updateLivesDisplay();
    }
    
    // Gérer la mort de Pac-Man
    handlePacManDeath() {
        // Attendre un peu avant de réinitialiser les positions
        setTimeout(() => {
            this.resetPositions();
        }, 1000);
    }
    
    // Gérer la fin du jeu
    gameOver() {
        this.state = GAME_OVER;
        this.showGameOverScreen();
    }
}
