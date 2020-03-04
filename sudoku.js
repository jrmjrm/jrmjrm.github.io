var sudokuGrid1 = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
]

var sudokuGrid = sudokuGrid1;

var gridRow = []

for (var i = 0; i < 9; i++) {
    gridRow.push([i,i,i,i,i,i,i,i,i]);
}

var gridColumn = []

for (var i = 0; i < 9; i++) {
    gridColumn.push([]);
    for (var j = 0; j < 9; j++) {
        gridColumn[i].push(j);
    }
}

var gridBox = []

for (var i = 0; i < 9; i += 3) {
    for (j = 0; j < 3; j++) {
        gridBox.push([i,i,i,i+1,i+1,i+1,i+2,i+2,i+2]);
    }
}

for (var i = 0; i < 9; i++) {
    $('#gridContainer').append('<div id="row' + i + '" class="row"></div>');
    for (var j = 0; j < 9; j++) {
        var cellRow = gridRow[i][j];
        var cellColumn = gridColumn[i][j];
        var cellBox = gridBox[i][j];
        $('#row' + i).append('<div id="r' + cellRow + 'c' + cellColumn +'b' + cellBox +'" class="cell r' + cellRow + ' c' + cellColumn + ' b' + cellBox + '"></div>');
        var cellNumber = sudokuGrid[i][j];
        var buttonID = 'button' + String(cellRow) + String(cellColumn) + String(cellBox);
        console.log(cellNumber);
        if (cellNumber === 0) {
            $('#r' + cellRow + 'c' + cellColumn + 'b' + cellBox).append('<button id="' + buttonID + '" class="emptyTile"></button>');
        } else{
            $('#r' + cellRow + 'c' + cellColumn + 'b' + cellBox).append('<button id="' + buttonID + '" class="fixedTile">' + sudokuGrid[i][j] + '</button>');
        }
    }
}

$('.emptyTile').click( function() {
    var buttonText = this.innerHTML;
    if (buttonText === "") {
        this.innerHTML = 1;
    } else if (buttonText < 9) {
        this.innerHTML = Number(this.innerHTML) + 1;
    } else {
        this.innerHTML = "";
    }
});