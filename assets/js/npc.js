export const TILE_SIZE = 32;

export const FRAME_WIDTH = 280;
export const FRAME_HEIGHT = 390;
export const DRAW_WIDTH = 64;
export const DRAW_HEIGHT = 96;

export const DIRECTIONS = {
    DOWN: 0,
    RIGHT: 1,
    LEFT: 2,
    UP: 3,
};

export const FRAME_SEQUENCE = {
    [DIRECTIONS.DOWN]: [0, 1, 2, 3],
    [DIRECTIONS.RIGHT]: [0, 1, 2, 3],
    [DIRECTIONS.LEFT]: [0, 1, 2, 3],
    [DIRECTIONS.UP]: [0, 1, 2, 3],
};

export const npcImage = new Image();
npcImage.src = 'assets/characters/chef_npc.png'; 

export let frameTimer = 0;
export let frameIndex = 0;

const startX = 5;
const startY = 18;

export const npc = {
    name: "Cozinheiro",
    dir: DIRECTIONS.RIGHT,
    moving: false,
    moveProgress: 0,
    moveDuration: 160,
    x: startX,
    y: startY,
    startX: startX,
    startY: startY,
    targetX: startX,
    targetY: startY,
    pixelX: startX * TILE_SIZE,
    pixelY: startY * TILE_SIZE,
};

export const npc2 = {
    name: "Cozinheiro 2",
    dir: DIRECTIONS.UP,
    moving: false,
    moveProgress: 0,
    moveDuration: 160,
    x: 13, 
    y: 13,
    startX: 13,
    startY: 13,
    targetX: 13,
    targetY: 13,
    pixelX: 13 * TILE_SIZE,
    pixelY: 13 * TILE_SIZE,
};

