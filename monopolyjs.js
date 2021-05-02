// outline
// separation of game logic from the visual board
// 2-8 players
// setting for free parking
// limited or unlimited house/hotel pieces

// underyling objects:
// - player
// -- with a hand array for chance/community chest, bank account, property cards
// -- jail status, doubles status, solvency method
// - chance/community chest decks
// -- method for initial shuffle, drawing from top, placing in hand or on bottom
// - chance/community chest cards
// -- each has a text component and then effect when drawn
// - property cards
// -- each has a [name] and textual information about the property
// -- each has underlying numbers and costs, mortgage price, etc. for use by game logic
// - house/hotel pieces in a pile with toggleabble limited quantities
// -- methods for adding/subtracting pieces as they are built/removed
// - board
// -- records visual information
// -- player locations, property ownership, state of construction
// -- is updated by various decisions by players and all methods altering visuals go here
// - overarching game object
// -- determines order of turns
// -- rolls dice
// -- free parking if toggled

// other random notes
// - separate js files for content (cards/effects/etc.) vs gameplay?
// - important method to determine ownership of related cards
// -- ie, how many railroads does this player own, how many green props, etc.
// - each square should have a unique sequential id number


/// BOARD INFO

class PropertyCard {
    constructor(name, cardType, owner='unowned', isMortgaged=false) {
        this.name = name;
        this.cardType = cardType;
        this.owner = owner;
    }
}

class StandardPropertyCard extends PropertyCard {
    constructor(name, cardType, propertyColor, price, ) {
        super(name, cardType);
        this.cardColor = propertyColor;
    }
}


const board = {
    0: 'Go',
    1: 'Mediterranean Avenue',
    2: 'Community Chest',
    3: 'Baltic Avenue',
    4: 'Income Tax'
}


/// functions

// returns corresponding key in an object given the value
const getKey = (obj, value) => Object.keys(obj).find(key => obj[key] === value);


