const itemData = [
    { id: 'bread', name: 'Bread', imageSrc: 'assets/icons/bread.png' },
    { id: 'cheese', name: 'Cheese', imageSrc: 'assets/icons/cheese.png' },
    { id: 'hamburger', name: 'Hamburger', imageSrc: 'assets/icons/hamburger.png' },
    { id: 'lettuce', name: 'Lettuce', imageSrc: 'assets/icons/lettuce.png' },
    { id: 'meat', name: 'Meat', imageSrc: 'assets/icons/meat.png' },
    { id: 'peperoni', name: 'Peperoni', imageSrc: 'assets/icons/pepperoni.png' },
    { id: 'pizza_dough', name: 'Pizza Dough', imageSrc: 'assets/icons/pizza dough.png' },
    { id: 'pizza', name: 'Pizza', imageSrc: 'assets/items/pizza.png' },
    { id: 'tomato', name: 'Tomato', imageSrc: 'assets/items/tomato.png' }
];

const items = {};

itemData.forEach(({ id, name, imageSrc }) => {
    const image = new Image();
    image.src = imageSrc;

    items[id] = {
        id,
        name,
        image,
        quantity: 0 
    };
});

function addItem(itemId, amount = 1) {
    if (items[itemId]) {
        items[itemId].quantity += amount;
    }
}

function removeItem(itemId, amount = 1) {
    if (items[itemId]) {
        items[itemId].quantity = Math.max(0, items[itemId].quantity - amount);
    }
}

function getInventoryItems() {
    return Object.values(items).filter(item => item.quantity > 0);
}

export {
    items,
    addItem,
    removeItem,
    getInventoryItems
};
