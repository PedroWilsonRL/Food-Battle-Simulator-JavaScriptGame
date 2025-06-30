const dialogBoxImage = new Image();
dialogBoxImage.src = 'assets/icons/dialog_box1.png';

const arrowImage = new Image();
arrowImage.src = 'assets/icons/arrow.png'; 

let dialogVisible = false;
let dialogPages = [];
let currentPageIndex = 0;
let maxCharsPerLine = 34;
let maxLines = 2;

let charIndex = 0;          
let typingSpeed = 40;      
let typingTimer = 0;        
let isTypingComplete = false; 

export function showDialog(text) {
    dialogPages = paginateText(text, maxCharsPerLine, maxLines);
    currentPageIndex = 0;
    charIndex = 0;
    typingTimer = 0;
    isTypingComplete = false;
    dialogVisible = true;
}

export function hideDialog() {
    dialogVisible = false;
    dialogPages = [];
    currentPageIndex = 0;
    charIndex = 0;
    typingTimer = 0;
    isTypingComplete = false;
}

export function advanceDialog() {
    if (!isTypingComplete) {
        charIndex = getCurrentPageText().length;
        isTypingComplete = true;
        return;
    }

    if (currentPageIndex < dialogPages.length - 1) {
        currentPageIndex++;
        charIndex = 0;
        typingTimer = 0;
        isTypingComplete = false;
    } else {
        hideDialog();
    }
}

export function isDialogVisible() {
    return dialogVisible;
}

export function updateDialog(deltaTime) {
    if (!dialogVisible || isTypingComplete) return;

    typingTimer += deltaTime;
    while (typingTimer > typingSpeed) {
        typingTimer -= typingSpeed;
        charIndex++;
        if (charIndex >= getCurrentPageText().length) {
            charIndex = getCurrentPageText().length;
            isTypingComplete = true;
            break;
        }
    }
}

function getCurrentPageText() {
    return dialogPages[currentPageIndex].join('\n');
}

export function drawDialog(ctx, canvasWidth, canvasHeight) {
    if (!dialogVisible) return;

    const dialogWidth = 700;
    const dialogHeight = 220;
    const dialogX = (canvasWidth - dialogWidth) / 2;
    const dialogY = canvasHeight - dialogHeight - 50;

    ctx.drawImage(dialogBoxImage, dialogX, dialogY, dialogWidth, dialogHeight);

    ctx.fillStyle = "#000";
    ctx.font = "58px Game Over";
    ctx.textBaseline = "top";

    const fullText = getCurrentPageText();
    const textToShow = fullText.substring(0, charIndex);

    const lines = textToShow.split('\n');
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], dialogX + 40, dialogY + 60 + i * 60);
    }

    if (currentPageIndex < dialogPages.length - 1 && isTypingComplete) {
        const arrowWidth = 24;
        const arrowHeight = 24;
        const arrowX = dialogX + dialogWidth - arrowWidth - 90;
        const arrowY = dialogY + dialogHeight - arrowHeight - 40;
        ctx.drawImage(arrowImage, arrowX, arrowY, arrowWidth, arrowHeight);
    }
}

function paginateText(text, maxCharsPerLine, maxLinesPerPage) {
    const words = text.split(' ');
    const pages = [];
    let currentPage = [];
    let currentLine = '';

    for (const word of words) {
        if ((currentLine + ' ' + word).trim().length > maxCharsPerLine) {
            currentPage.push(currentLine.trim());
            currentLine = word;

            if (currentPage.length === maxLinesPerPage) {
                pages.push(currentPage);
                currentPage = [];
            }
        } else {
            currentLine += ' ' + word;
        }
    }

    if (currentLine) currentPage.push(currentLine.trim());
    if (currentPage.length > 0) pages.push(currentPage);

    return pages;
}
