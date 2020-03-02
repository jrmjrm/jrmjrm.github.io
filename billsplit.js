var names = [];
var totalBasis = 0;
var tip = 0;
var tax = 0;
var rowCounter = 0;

Number.prototype.round = function(places) {
    return +(Math.round(this + "e+" + places)  + "e-" + places);
}

function getId() {
    return this.event.target.id;
}

function allocate() {
    var total = totalBasis + tip + tax;
    for (var i = 0; i < names.length; i++) {
        var share = Number($('#' + names[i] + 'Amount').text()) / totalBasis;
        var alloc = (share * total).round(2);
        $('#' + names[i] + 'Alloc').text(alloc);
    }
}

$('#newNameButton').click(function () {
    var newName = prompt("enter new name:");
    var newAmount = Number(prompt("enter amount spent:"));
    var rowID = 'row' + rowCounter;
    var nameCellID =  newName + 'Cell';
    var nameButtonID =  newName + 'Button';
    var amountCellID =  newName + 'Amount';
    var allocCellID =  newName + 'Alloc';

    $('#contentContainer').append('<div id="' + rowID + '" class="rowContainer"></div>');
    $('#' + rowID).append('<div id="' + nameCellID + '" class="rowCell"></div>');
    $('#' + rowID).append('<div id="' + amountCellID + '" class="rowCell"></div>');
    $('#' + rowID).append('<div id="' + allocCellID + '" class="rowCell"></div>');
    $('#' + nameCellID).append('<button id="' + nameButtonID +'">' + newName + '</button>');
    $('#' + amountCellID).text(newAmount);
    $('#' + allocCellID).text(0);
    totalBasis += newAmount;
    rowCounter++;
    names.push(newName);
    allocate();
});

$('#taxButton').click(function() {
    tax = Number(prompt("enter tax amount:"));
    allocate();
});

$('#tipButton').click(function() {
    tip = Number(prompt("enter tip amount:"));
    allocate();
});

$('#contentContainer').click('button', function() {
    var buttonID = getId();
    var amountCellID = buttonID.substring(0,buttonID.length - 6) + 'Amount';
    console.log(amountCellID);
    var additionalAmount = Number(prompt("enter additional amount:"));
    totalBasis += additionalAmount;
    var initialAmount = Number($('#' + amountCellID).text());
    $('#' + amountCellID).text(initialAmount + additionalAmount);
    allocate();
});