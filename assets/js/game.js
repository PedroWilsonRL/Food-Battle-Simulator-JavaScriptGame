import {
    TILE_SIZE,
    FRAME_WIDTH,
    FRAME_HEIGHT,
    DRAW_WIDTH,
    DRAW_HEIGHT,
    DIRECTIONS,
    FRAME_SEQUENCE,
    keys,
    player,
    playerStatus,
    camera
} from './player.js';

import {
    mapImage,
    upperImage,
    secondMapImage,
    secondUpperImage,
    cityMapImage,
    cityUpperImage,
    cityMiniMapImage,
    teleportPoints,
    collisionTilesRestaurante
} from './map.js';

import {
    menuVisible,
    toggleMenu,
    moveSelectionUp,
    moveSelectionDown,
    drawMenu,
    handleMenuAction,
    handleBackInWalletOrMap,
    setMapAvailable
} from './menu.js';

import {
    npcImage,
    FRAME_WIDTH as NPC_FRAME_WIDTH,
    FRAME_HEIGHT as NPC_FRAME_HEIGHT,
    DRAW_WIDTH as NPC_DRAW_WIDTH,
    DRAW_HEIGHT as NPC_DRAW_HEIGHT,
    FRAME_SEQUENCE as NPC_FRAME_SEQUENCE
} from './npc.js';

import {
    showDialog,
    hideDialog,
    isDialogVisible,
    drawDialog,
    advanceDialog,
    updateDialog   
} from './dialogbox.js';



import { getNpcsForMap } from './map.js';

const dialogBoxImage = new Image();
dialogBoxImage.src = 'assets/icons/dialog_box1.png'; 


const GAME_WIDTH = 880;
const GAME_HEIGHT = 700;

const canvas = document.getElementById('canvas1');
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

camera.centerOffsetX = (canvas.width / 2) - (DRAW_WIDTH / 2);
camera.centerOffsetY = (canvas.height / 2) - (DRAW_HEIGHT / 2);

const playerImage = new Image();
playerImage.src = 'assets/characters/player.png';

const headImage = new Image();
headImage.src = 'assets/icons/player_icon.png';

const shadowImage = new Image();
shadowImage.src = 'assets/characters/shadow.png';

let dialogVisible = false;
let dialogText = "";


let frameTimer = 0;
let frameIndex = 0;

let currentMap = {
    map: mapImage,
    upper: upperImage
};

let isTeleporting = false;
let flashAlpha = 0;
let flashSpeed = 0.06;
let teleportCallback = null;

window.addEventListener('keydown', e => {
    keys[e.key] = true;

    if (menuVisible) {
        if (e.key === 'ArrowUp') {
            moveSelectionUp();
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            moveSelectionDown();
            e.preventDefault();
        } else if (e.key === 'z' || e.key === 'Z') {
            handleMenuAction();
            e.preventDefault();
        } else if (e.key === 'x' || e.key === 'X') {
            handleBackInWalletOrMap();
            e.preventDefault();
        }
        return;
    }

    if (isDialogVisible()) {
        if (e.key === 'z' || e.key === 'Z' || e.key === 'x' || e.key === 'X') {
            advanceDialog();
            e.preventDefault();
        }
        return;
    }

    if (e.key === 'Enter') {
        toggleMenu();
        e.preventDefault();
        return;
    }

    if (e.key === 'z' || e.key === 'Z') {
    const npcs = getNpcsForMap(currentMap.map);
    for (const npc of npcs) {
        if (isPlayerNearNpc(npc)) {

            if (npc.originalDir === undefined) {
                npc.originalDir = npc.dir;
            }
          
            npc.dir = getDirectionFacingPlayer(npc, player);

            if (npc.name === "Cozinheiro") {
                showDialog("You inherited this restaurant from your mother. Right? She was the best cook in town! I hope you live up to her name.");
            } else if (npc.name === "Cozinheiro 2") {
                showDialog("You're the heir, right? This is no joke! Take this business seriously because many depend on this job!");
            }
            e.preventDefault();
            return;
        }
    }
}


});


window.addEventListener('keyup', e => keys[e.key] = false);

function getDirectionFacingPlayer(npc, player) {
    const dx = player.x - npc.x;
    const dy = player.y - npc.y;

    if (Math.abs(dx) > Math.abs(dy)) {
        
        if (dx > 0) {
            return DIRECTIONS.RIGHT; 
        } else {
            return DIRECTIONS.LEFT;  
        }
    } else {
       
        if (dy > 0) {
            return DIRECTIONS.DOWN; 
        } else {
            return DIRECTIONS.UP;   
        }
    }
}


function isPlayerNearNpc(npc) {
    const dx = Math.abs(player.x - npc.x);
    const dy = Math.abs(player.y - npc.y);
    return (dx + dy) === 1;
}

function isTileBlocked(x, y) {
    if (currentMap.map !== mapImage) return false;
    return collisionTilesRestaurante.some(tile => tile.x === x && tile.y === y);
}

function isNpcBlocking(x, y) {
    const npcs = getNpcsForMap(currentMap.map);
    return npcs.some(npc => npc.x === x && npc.y === y);
}

function tryStartMove() {
    if (player.moving || isTeleporting || menuVisible || isDialogVisible()) return;

    let dx = 0;
    let dy = 0;

    const mapPixelWidth = currentMap.map.width;
    const mapPixelHeight = currentMap.map.height;

    if (keys['ArrowUp'] && player.y * TILE_SIZE > 0) {
        dy = -1;
        player.dir = DIRECTIONS.UP;
    } else if (keys['ArrowDown'] && (player.y + 1) * TILE_SIZE < mapPixelHeight) {
        dy = 1;
        player.dir = DIRECTIONS.DOWN;
    } else if (keys['ArrowLeft'] && player.x * TILE_SIZE > 0) {
        dx = -1;
        player.dir = DIRECTIONS.LEFT;
    } else if (keys['ArrowRight'] && (player.x + 1) * TILE_SIZE < mapPixelWidth) {
        dx = 1;
        player.dir = DIRECTIONS.RIGHT;
    }

    const newX = player.x + dx;
    const newY = player.y + dy;

    if (dx !== 0 || dy !== 0) {
        if (isTileBlocked(newX, newY)) return;
        if (isNpcBlocking(newX, newY)) return;

        player.startX = player.x;
        player.startY = player.y;
        player.x = newX;
        player.y = newY;
        player.targetX = newX;
        player.targetY = newY;
        player.moving = true;
        player.moveProgress = 0;
        frameIndex = 1;
    }
}


    function startTeleport(newMap, newUpper, newX, newY) {
    if (isTeleporting) return;
    isTeleporting = true;
    flashAlpha = 0;
    teleportCallback = () => {
        currentMap.map = newMap;
        currentMap.upper = newUpper;
        player.x = newX;
        player.y = newY;
        player.targetX = newX;
        player.targetY = newY;
        player.pixelX = newX * TILE_SIZE;
        player.pixelY = newY * TILE_SIZE;

        camera.x = player.pixelX - camera.centerOffsetX;
        camera.y = player.pixelY - camera.centerOffsetY;

        if (currentMap.map === cityMapImage) {
            setMapAvailable(true);
        } else {
            setMapAvailable(false);
        }
    };
    }

    function checkTeleport() {
    if (currentMap.map === mapImage) {
        for (const tp of teleportPoints.restauranteToCozinha) {
            if (player.x === tp.x && player.y === tp.y && !isTeleporting) {
                startTeleport(secondMapImage, secondUpperImage, 18, 30);
                return;
            }
        }
        for (const tp of teleportPoints.restauranteToCidade) {
            if (player.x === tp.x && player.y === tp.y && !isTeleporting) {
                startTeleport(cityMapImage, cityUpperImage, 2, 8);
                return;
            }
        }
    }

    if (currentMap.map === secondMapImage) {
        for (const tp of teleportPoints.cozinhaToRestaurante) {
            if (player.x === tp.x && player.y === tp.y && !isTeleporting) {
                startTeleport(mapImage, upperImage, 27, 13);
                return;
            }
        }
    }

    if (currentMap.map === cityMapImage) {
        for (const tp of teleportPoints.cidadeToRestaurante) {
            if (player.x === tp.x && player.y === tp.y && !isTeleporting) {
                startTeleport(mapImage, upperImage, 13, 37);
                return;
            }
        }
    }
}

let wasDialogVisible = false; 

function update(deltaTime) {
    updateDialog(deltaTime);
    tryStartMove();

    if (player.moving) {
        player.moveProgress += deltaTime;
        const t = Math.min(player.moveProgress / player.moveDuration, 1);
        player.pixelX = (1 - t) * player.startX * TILE_SIZE + t * player.targetX * TILE_SIZE;
        player.pixelY = (1 - t) * player.startY * TILE_SIZE + t * player.targetY * TILE_SIZE;

        const frameInterval = 230;
        frameTimer += deltaTime;
        if (frameTimer > frameInterval) {
            frameIndex = 1 + (frameIndex % 3);
            frameTimer = 0;
        }

        if (t === 1) {
            player.pixelX = player.targetX * TILE_SIZE;
            player.pixelY = player.targetY * TILE_SIZE;
            player.moving = false;
            frameIndex = 0;
        }
    } else {
        frameIndex = 0;
    }

    checkTeleport();

    if (isTeleporting) {
        if (flashAlpha < 1 && teleportCallback) {
            flashAlpha += flashSpeed;
            if (flashAlpha >= 1) {
                flashAlpha = 1;
                teleportCallback();
                teleportCallback = null;
            }
        } else if (flashAlpha > 0) {
            flashAlpha -= flashSpeed;
            if (flashAlpha <= 0) {
                flashAlpha = 0;
                isTeleporting = false;
            }
        }
    }

    if (wasDialogVisible && !isDialogVisible()) {
        const npcs = getNpcsForMap(currentMap.map);
        for (const npc of npcs) {
            if (npc.originalDir !== undefined) {
                npc.dir = npc.originalDir;
                delete npc.originalDir;
            }
        }
    }
    wasDialogVisible = isDialogVisible();

    const mapPixelWidth = currentMap.map.width;
    const mapPixelHeight = currentMap.map.height;
    let targetCameraX = player.pixelX - camera.centerOffsetX;
    let targetCameraY = player.pixelY - camera.centerOffsetY;

    camera.x = Math.max(0, Math.min(targetCameraX, mapPixelWidth - canvas.width));
    camera.y = Math.max(0, Math.min(targetCameraY, mapPixelHeight - canvas.height));
}


function drawPlayerStatusHUD() {
    const boxX = 10;
    const boxY = 10;
    const boxWidth = 200;
    const boxHeight = 60;

    ctx.fillStyle = '#000';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.globalAlpha = 1;

    const headSize = 40;
    ctx.drawImage(headImage, boxX + 5, boxY + 5, headSize, headSize);

    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(playerStatus.name, boxX + headSize + 10, boxY + 20);

    const barX = boxX + headSize + 10;
    const barY = boxY + 30;
    const barWidth = 120;
    const barHeight = 10;
    const hpPercent = playerStatus.hp / playerStatus.maxHp;

    ctx.fillStyle = '#444';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.fillStyle = '#e00';
    ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(barX, barY, barWidth, barHeight);
}

function draw() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.drawImage(currentMap.map, -camera.x, -camera.y);

    const npcs = getNpcsForMap(currentMap.map);
    for (const npc of npcs) {
        const npcOffsetX = (TILE_SIZE - NPC_DRAW_WIDTH) / 2;
        const npcOffsetY = (TILE_SIZE - NPC_DRAW_HEIGHT) / 2;

        const npcFrameX = 0;
        const npcFrameY = npc.dir;

        ctx.drawImage(
            shadowImage,
            npc.pixelX + npcOffsetX - camera.x + (NPC_DRAW_WIDTH - 45) / 1.4,
            npc.pixelY + npcOffsetY - camera.y + (NPC_DRAW_HEIGHT - 20) / 1.9 + 30,
            45,
            20
        );

        ctx.drawImage(
            npcImage,
            npcFrameX * NPC_FRAME_WIDTH,
            npcFrameY * NPC_FRAME_HEIGHT,
            NPC_FRAME_WIDTH,
            NPC_FRAME_HEIGHT,
            npc.pixelX - camera.x + npcOffsetX,
            npc.pixelY - camera.y + npcOffsetY,
            NPC_DRAW_WIDTH,
            NPC_DRAW_HEIGHT
        );
    }

    const frameX = FRAME_SEQUENCE[player.dir][frameIndex];
    const frameY = player.dir;
    const offsetX = (TILE_SIZE - DRAW_WIDTH) / 2;
    const offsetY = (TILE_SIZE - DRAW_HEIGHT) / 2;

    ctx.drawImage(
        shadowImage,
        player.pixelX + offsetX - camera.x + (DRAW_WIDTH - 45) / 1.4,
        player.pixelY + offsetY - camera.y + (DRAW_HEIGHT - 20) / 1.9 + 30,
        45,
        20
    );

    ctx.drawImage(
        playerImage,
        frameX * FRAME_WIDTH,
        frameY * FRAME_HEIGHT,
        FRAME_WIDTH,
        FRAME_HEIGHT,
        player.pixelX + offsetX - camera.x,
        player.pixelY + offsetY - camera.y,
        DRAW_WIDTH,
        DRAW_HEIGHT
    );

    ctx.drawImage(currentMap.upper, -camera.x, -camera.y);

    drawPlayerStatusHUD();

    if (isTeleporting) {
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    drawMenu(ctx, GAME_WIDTH, GAME_HEIGHT);

    if (currentMap.map === cityMapImage) {
        const miniMapWidth = 170;
        const miniMapHeight = 170;
        const margin = 20;
        const miniMapX = GAME_WIDTH - miniMapWidth - margin;
        const miniMapY = margin;

        ctx.fillStyle = 'white';
        ctx.fillRect(miniMapX - 2, miniMapY - 2, miniMapWidth + 4, miniMapHeight + 4);
        ctx.drawImage(cityMiniMapImage, miniMapX, miniMapY, miniMapWidth, miniMapHeight);
    }

    drawDialog(ctx, GAME_WIDTH, GAME_HEIGHT);
}




let lastTime = 0;
function gameLoop(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    update(deltaTime);
    draw();
    requestAnimationFrame(gameLoop);
}

let assetsLoaded = 0;
function checkAssetsLoaded() {
    assetsLoaded++;
    if (assetsLoaded === 9) {
        camera.x = player.pixelX - camera.centerOffsetX;
        camera.y = player.pixelY - camera.centerOffsetY;

        if (currentMap.map === cityMapImage) {
            setMapAvailable(true);
        } else {
            setMapAvailable(false);
        }

        requestAnimationFrame(gameLoop);
    }
}

shadowImage.onload = checkAssetsLoaded;
playerImage.onload = checkAssetsLoaded;
mapImage.onload = checkAssetsLoaded;
upperImage.onload = checkAssetsLoaded;
headImage.onload = checkAssetsLoaded;
secondMapImage.onload = checkAssetsLoaded;
secondUpperImage.onload = checkAssetsLoaded;
cityMapImage.onload = checkAssetsLoaded;
cityUpperImage.onload = checkAssetsLoaded;
