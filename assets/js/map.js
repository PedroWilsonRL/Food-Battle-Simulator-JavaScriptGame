import { npc, npc2 } from './npc.js';

const mapImage = new Image();
mapImage.src = 'assets/maps/restaurant_map.png';

const upperImage = new Image();
upperImage.src = 'assets/maps/restaurant_map upper.png';

const secondMapImage = new Image();
secondMapImage.src = 'assets/maps/room_map.png';

const secondUpperImage = new Image();
secondUpperImage.src = 'assets/maps/room_map upper.png';

const cityMapImage = new Image();
cityMapImage.src = 'assets/maps/city_map.png';

const cityUpperImage = new Image();
cityUpperImage.src = 'assets/maps/city_map upper.png';

const cityMiniMapImage = new Image();
cityMiniMapImage.src = 'assets/maps/minimap.png'; 


const teleportPoints = {
    restauranteToCozinha: [
        { x: 26, y: 12 },
        { x: 27, y: 12 },
        { x: 28, y: 12 },
    ],
    cozinhaToRestaurante: [
        { x: 18, y: 31 },
        { x: 19, y: 31 },
    ],
    restauranteToCidade: [
        { x: 12, y: 39 },
        { x: 13, y: 39 },
        { x: 14, y: 39 },
    ],
    cidadeToRestaurante: [
        { x: 2, y: 7 },
    ],
};

const collisionTilesRestaurante = [
    { x: 2, y: 25 }, { x: 3, y: 25 }, { x: 4, y: 25 }, { x: 5, y: 25 }, { x: 6, y: 25 }, 
    { x: 7, y: 25 }, { x: 8, y: 25 },  { x: 9, y: 25 }, { x: 10, y: 25 }, { x: 11, y: 25 }, 
    { x: 15, y: 25 }, { x: 16, y: 25 }, { x: 17, y: 25 }, { x: 18, y: 25 }, { x: 19, y: 25 }, 
    { x: 20, y: 25 }, { x: 21, y: 25 }, { x: 22, y: 25 }, { x: 23, y: 25 }, { x: 24, y: 25 },
    { x: 2, y: 10 }, { x: 2, y: 11 }, { x: 2, y: 12 }, { x: 2, y: 13 }, { x: 2, y: 14 }, 
    { x: 2, y: 15 }, { x: 2, y: 16 }, { x: 2, y: 17 }, { x: 2, y: 18 }, { x: 2, y: 19 }, 
    { x: 2, y: 20 }, { x: 2, y: 21 }, { x: 2, y: 22 }, { x: 2, y: 23 }, { x: 2, y: 24 }, 
    { x: 2, y: 25 }, { x: 2, y: 26 }, { x: 2, y: 27 }, { x: 2, y: 28 }, { x: 2, y: 29 },
    { x: 2, y: 30 }, { x: 2, y: 31 }, { x: 2, y: 32 }, { x: 2, y: 33 }, { x: 2, y: 34 }, 
    { x: 2, y: 35 }, { x: 2, y: 36 }, { x: 2, y: 37 }, { x: 2, y: 38 }, { x: 3, y: 38 }, 
    { x: 4, y: 38 }, { x: 5, y: 38 }, { x: 6, y: 38 }, { x: 7, y: 38 }, { x: 8, y: 38 }, 
    { x: 9, y: 38 }, { x: 10, y: 38 }, { x: 16, y: 38 }, { x: 17, y: 38 }, { x: 18, y: 38 },
    { x: 19, y: 38 }, { x: 20, y: 38 }, { x: 21, y: 38 }, { x: 22, y: 38 }, { x: 23, y: 38 }, 
    { x: 24, y: 38 }, { x: 25, y: 38 }, { x: 25, y: 37 }, { x: 23, y: 36 }, { x: 24, y: 35 }, 
    { x: 25, y: 34 }, { x: 25, y: 33 }, { x: 23, y: 32 }, { x: 24, y: 31 }, { x: 25, y: 30 }, 
    { x: 25, y: 29 }, { x: 23, y: 28 }, { x: 24, y: 27 }, { x: 25, y: 26 }, { x: 25, y: 25 },
    { x: 23, y: 24 }, { x: 24, y: 23 }, { x: 25, y: 22 }, { x: 25, y: 21 },{ x: 25, y: 21 }, 
    { x: 26, y: 21 }, { x: 27, y: 21 }, { x: 28, y: 21 }, { x: 29, y: 21 }, { x: 30, y: 21 },
    { x: 30, y: 20 }, { x: 30, y: 19 }, { x: 30, y: 18 }, { x: 30, y: 17 }, { x: 30, y: 16 },
    { x: 30, y: 15 }, { x: 30, y: 14 }, { x: 30, y: 13 }, { x: 30, y: 12 }, { x: 30, y: 11 },
    { x: 24, y: 17 }, { x: 24, y: 16 }, { x: 24, y: 15 }, { x: 24, y: 14 }, { x: 24, y: 13 },
    { x: 24, y: 12 }, { x: 23, y: 12 }, { x: 22, y: 12 }, { x: 21, y: 12 }, { x: 20, y: 12 },
    { x: 19, y: 12 }, { x: 18, y: 12 }, { x: 17, y: 12 }, { x: 16, y: 12 }, { x: 15, y: 12 },
    { x: 14, y: 12 }, { x: 13, y: 12 }, { x: 12, y: 12 }, { x: 11, y: 12 }, { x: 10, y: 12 },
    { x: 9, y: 12 }, { x: 8, y: 12 }, { x: 7, y: 12 }, { x: 6, y: 12 }, { x: 5, y: 12 },
    { x: 4, y: 12 }, { x: 3, y: 12 }, { x: 11, y: 17 }, { x: 12, y: 17 }, { x: 13, y: 17 }, 
    { x: 14, y: 17 }, { x: 15, y: 17 }, { x: 15, y: 18 }, { x: 15, y: 19 }, { x: 15, y: 20 }, 
    { x: 14, y: 20 }, { x: 13, y: 20 }, { x: 12, y: 20 }, { x: 11, y: 20 }, { x: 11, y: 19 },
    { x: 11, y: 18 }, { x: 11, y: 17 }, { x: 10, y: 18 }, { x: 11, y: 18 }, { x: 16, y: 18 }, 
    { x: 17, y: 18 }, { x: 11, y: 27 }, { x: 10, y: 27 }, { x: 9, y: 27 }, { x: 8, y: 27 }, 
    { x: 7, y: 27 }, { x: 6, y: 27 }, { x: 5, y: 27 }, { x: 4, y: 27 }, { x: 3, y: 27 }, 
    { x: 17, y: 26 }, { x: 18, y: 26 }, { x: 19, y: 26 }, { x: 20, y: 26 }, { x: 21, y: 26 },  
    { x: 18, y: 31 }, { x: 19, y: 31 }, { x: 20, y: 31 }, { x: 18, y: 32 }, { x: 19, y: 32 }, 
    { x: 20, y: 32 }, { x: 18, y: 35 }, { x: 19, y: 35 }, { x: 20, y: 35 }, { x: 18, y: 36 }, 
    { x: 19, y: 36 }, { x: 20, y: 36 }, { x: 6, y: 36 }, { x: 7, y: 36 }, { x: 8, y: 36 }, 
    { x: 6, y: 35 }, { x: 7, y: 35 }, { x: 8, y: 35 }, { x: 6, y: 32 }, { x: 7, y: 32 }, 
    { x: 8, y: 32 }, { x: 6, y: 31 }, { x: 7, y: 31 }, { x: 8, y: 31 }, 
   
];

const npcsRestaurante = [npc, npc2];
const npcsCozinha = [];
const npcsCidade = [];

export const getNpcsForMap = (map) => {
    if (map === mapImage) return npcsRestaurante;
    if (map === secondMapImage) return npcsCozinha;
    if (map === cityMapImage) return npcsCidade;
    return [];
};

export {
    mapImage,
    upperImage,
    secondMapImage,
    secondUpperImage,
    cityMapImage,
    cityUpperImage,
    cityMiniMapImage,
    teleportPoints,
    collisionTilesRestaurante
};

