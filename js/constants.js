// Constantes du jeu
const CELL_SIZE = 20; // Taille d'une cellule en pixels
const WALL = 1;
const EMPTY = 0;
const PELLET = 2;
const POWER_PELLET = 3;
const FRUIT = 4;

// Directions
const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

// États du jeu
const GAME_IDLE = 0;
const GAME_PLAYING = 1;
const GAME_PAUSED = 2;
const GAME_OVER = 3;

// Vitesses
const PACMAN_SPEED = 2; // Pixels par frame
const GHOST_SPEED = 1.75; // Pixels par frame
const GHOST_FRIGHTENED_SPEED = 1; // Pixels par frame

// Durées
const POWER_PELLET_DURATION = 8000; // Durée en millisecondes
const FRUIT_DURATION = 10000; // Durée d'apparition du fruit

// Points
const PELLET_POINTS = 1;
const POWER_PELLET_POINTS = 5;
const GHOST_POINTS = 20; // Points de base pour manger un fantôme
const FRUIT_POINTS = 10;

// Sprites
const SPRITE_PACMAN_OPEN = '/images/pacman_open.png';
const SPRITE_PACMAN_CLOSED = '/images/pacman_closed.png';
const SPRITE_GHOST_NORMAL = '/images/ghost_normal.png';
const SPRITE_GHOST_FRIGHTENED = '/images/ghost_frightened.png';
const SPRITE_COIN = '/images/coin.png';

// Couleurs des fantômes (pour les différencier)
const GHOST_COLORS = [
    { r: 255, g: 0, b: 0 },    // Rouge (Blinky)
    { r: 255, g: 184, b: 255 }, // Rose (Pinky)
    { r: 0, g: 255, b: 255 },   // Cyan (Inky)
    { r: 255, g: 184, b: 82 }   // Orange (Clyde)
];

// Niveaux de difficulté
const DIFFICULTY_LEVELS = [
    { ghostSpeed: 1.75, frightDuration: 8000 },  // Niveau 1
    { ghostSpeed: 2.00, frightDuration: 7000 },  // Niveau 2
    { ghostSpeed: 2.25, frightDuration: 6000 },  // Niveau 3
    { ghostSpeed: 2.50, frightDuration: 5000 },  // Niveau 4
    { ghostSpeed: 2.75, frightDuration: 4000 },  // Niveau 5
    { ghostSpeed: 3.00, frightDuration: 3000 },  // Niveau 6
    { ghostSpeed: 3.25, frightDuration: 2000 },  // Niveau 7
    { ghostSpeed: 3.50, frightDuration: 1000 },  // Niveau 8
    { ghostSpeed: 3.75, frightDuration: 500 },   // Niveau 9
    { ghostSpeed: 4.00, frightDuration: 0 }      // Niveau 10+
];
