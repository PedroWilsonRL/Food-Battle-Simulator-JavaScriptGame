import { cityMiniMapImage, cityMapImage } from './map.js';
import { items, getInventoryItems } from './item.js'; 

const menuImage = new Image();
menuImage.src = 'assets/menu/menu.png';

export let menuVisible = false; 
let selectedIndex = 0;
let showingWallet = false;
let showingMapFullscreen = false;
let showingBag = false;

const options = [
    'BAG',
    'MAP',
    'MONEY WALLET',
    'EXIT'
];

let playerMoney = 1500;
let isMapAvailable = false;

function closeMenu() {
    menuVisible = false;
    showingWallet = false;
    showingMapFullscreen = false;
    showingBag = false;
    selectedIndex = 0; 
}

export function toggleMenu() { 
    if (menuVisible) {
        closeMenu();
    } else {
        menuVisible = true;
        showingWallet = false;
        showingMapFullscreen = false;
        showingBag = false;
        selectedIndex = 0; 
    }
}

function getVisibleMainOptions() {
    return options.filter(isOptionAvailable);
}

export function moveSelectionUp() {
    if (!menuVisible || showingWallet || showingMapFullscreen || showingBag) return;

    const visibleOptions = getVisibleMainOptions();
    if (visibleOptions.length > 0) {
        selectedIndex = (selectedIndex - 1 + visibleOptions.length) % visibleOptions.length;
    }
}

export function moveSelectionDown() {
    if (!menuVisible || showingWallet || showingMapFullscreen || showingBag) return;

    const visibleOptions = getVisibleMainOptions();
    if (visibleOptions.length > 0) {
        selectedIndex = (selectedIndex + 1) % visibleOptions.length;
    }
}

function isOptionAvailable(option) {
    if (option === 'MAP' && !isMapAvailable) return false;
    return true;
}

function getSelectedOption() {
    const visibleOptions = getVisibleMainOptions();
    return visibleOptions[selectedIndex] || null;
}

export function handleMenuAction() { 
    if (!menuVisible) return;

    if (showingWallet || showingMapFullscreen || showingBag) {

        return;
    }

    const selected = getSelectedOption();

    if (selected === 'MONEY WALLET') {
        showingWallet = true;
        showingBag = false;
        showingMapFullscreen = false;
    } else if (selected === 'BAG') {
        
        Object.values(items).forEach(item => {
            item.quantity = 20;
        });

        showingBag = true;
        showingWallet = false;
        showingMapFullscreen = false;
    } else if (selected === 'MAP' && isMapAvailable) {
        showingMapFullscreen = true;
        showingWallet = false;
        showingBag = false;
    } else if (selected === 'EXIT') {
        closeMenu();
    }
}

export function handleBackInWalletOrMap() { 
    if (showingWallet || showingMapFullscreen || showingBag) {
        console.log('Voltando para o menu principal');
        showingWallet = false;
        showingMapFullscreen = false;
        showingBag = false;
        menuVisible = true; 
        selectedIndex = 0; 
    } else if (menuVisible) {
       
        closeMenu();
    }
}

export function isBagVisible() { 
    return showingBag;
}

export function drawMenu(ctx, canvasWidth, canvasHeight) { 
    if (!menuVisible) return;

    let menuWidth = 400;
    let menuHeight = 300;
    let x = (canvasWidth - menuWidth) / 1;
    let y = (canvasHeight - menuHeight) / 3.5;

    if (showingMapFullscreen) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        const padding = 40;
        const mapWidth = canvasWidth - padding * 2;
        const mapHeight = canvasHeight - padding * 3 - 60;

        ctx.drawImage(cityMiniMapImage, padding, padding, mapWidth, mapHeight);

        ctx.fillStyle = 'white';
        ctx.font = '36px Game Over';
        ctx.textAlign = 'center';
        ctx.fillText('Press X to go back', canvasWidth / 2, canvasHeight - 40);
        ctx.textAlign = 'start'; 
        return; 
    }

    ctx.drawImage(menuImage, x, y, menuWidth, menuHeight);

    if (showingWallet) {
        ctx.fillStyle = 'black';
        ctx.font = '70px Game Over';
        ctx.textAlign = 'left';
        ctx.fillText('Money: $' + playerMoney, x + 90, y + 120);
        ctx.font = '40px Game Over';
        ctx.fillText('Press X to go back', x + 90, y + 170);
    }

    else if (showingBag) {
    ctx.fillStyle = 'black';
    ctx.font = '50px Game Over';
    ctx.textAlign = 'center';
    ctx.fillText('Inventory:', x + menuWidth / 2, y + 60);

    const invItems = getInventoryItems();

    if (invItems.length === 0) {
        ctx.font = '58px Game Over';
        ctx.fillText('Bag is empty.', x + menuWidth / 2, y + 130);
    } else {
        const itemSize = 40;
        const spacingY = 50;
        ctx.font = '36px Game Over';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';

        const leftColumnX = x + menuWidth / 2 - 150;
        const rightColumnX = x + menuWidth / 2 + 20;
        const startY = y + 110;

        invItems.forEach((item, index) => {
            let posX, posY;

            if (index < 4) {
                posX = leftColumnX;
                posY = startY + index * spacingY;
            } else if (index < 7) {
                posX = rightColumnX;
                posY = startY + (index - 4) * spacingY;
            } else {
                return;
            }

            if (item.image && item.image.complete) {
                ctx.drawImage(item.image, posX, posY - itemSize / 2, itemSize, itemSize);
            }
            ctx.fillText(`x${item.quantity}`, posX + itemSize + 10, posY);
        });
    }

    ctx.font = '40px Game Over';
    ctx.textAlign = 'center';
    ctx.fillText('Press X to go back', x + menuWidth / 2, y + menuHeight - 40);
}

    else {
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';

        const visibleOptions = getVisibleMainOptions();
        const textX = x + 130;
        let textY = y + 90;
        const lineHeight = 40;

        visibleOptions.forEach((option, i) => {
            if (i === selectedIndex) {
                ctx.font = '24px Game Over';
                ctx.fillStyle = 'black';
                ctx.fillText('▶', textX - 40, textY);

                ctx.font = '60px Game Over';
                ctx.fillText(option, textX, textY);
            } else {
                ctx.font = '60px Game Over';
                ctx.fillStyle = 'black';
                ctx.fillText(option, textX, textY);
            }
            textY += lineHeight;
        });
    }
}


export function setMapAvailable(value) { 
    isMapAvailable = value;
    if (!isMapAvailable) {
        const visibleOptions = getVisibleMainOptions();
        if (visibleOptions[selectedIndex] === 'MAP') {
            selectedIndex = 0; 
        }
    }
}

