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

export const keys = {};

export let frameTimer = 0;
export let frameIndex = 0;

const startPixelX = 13 * TILE_SIZE;
const startPixelY = 31 * TILE_SIZE;

export const player = {
    dir: DIRECTIONS.DOWN,
    moving: false,
    moveProgress: 0,
    moveDuration: 140,
    x: startPixelX / TILE_SIZE,
    y: startPixelY / TILE_SIZE,
    startX: startPixelX / TILE_SIZE,
    startY: startPixelY / TILE_SIZE,
    targetX: startPixelX / TILE_SIZE,
    targetY: startPixelY / TILE_SIZE,
    pixelX: startPixelX,
    pixelY: startPixelY,
};

export const playerStatus = {
    name: 'Pedrinho 8-bit',
    hp: 75,
    maxHp: 100,
};

export const camera = {
    x: 0,
    y: 0,
    centerOffsetX: 0, 
    centerOffsetY: 0,
};
