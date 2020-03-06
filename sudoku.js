/*
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

var sudokuGrid2 = [
    [8,0,0,7,1,5,0,0,4],
    [0,0,5,3,0,6,7,0,0],
    [3,0,6,4,0,8,9,0,1],
    [0,6,0,0,5,0,0,4,0],
    [0,0,0,8,0,7,0,0,0],
    [0,5,0,0,4,0,0,9,0],
    [6,0,9,5,0,3,4,0,2],
    [0,0,4,9,0,2,5,0,0],
    [5,0,0,1,6,4,0,0,9]
]

var sudokuGrid2Solved = [
    [8,9,2,7,1,5,6,3,4],
    [4,1,5,3,9,6,7,2,8],
    [3,7,6,4,2,8,9,5,1],
    [7,6,8,2,5,9,1,4,3],
    [9,4,1,8,3,7,2,6,5],
    [2,5,3,6,4,1,8,9,7],
    [6,8,9,5,7,3,4,1,2],
    [0,3,4,9,8,2,5,7,6],
    [5,2,7,1,6,4,3,8,9]
]

 sudokuGrid = sudokuGrid1;
*/

for (var i = 0; i < 3; i++) {
    outerRowID = 'outerRow' + i;
    $('#gridContainer').append('<div id="' + outerRowID + '" class="row"></div>');
    for (var j = 0; j < 3; j++) {
        var boxID = 'box' + String(i) + String(j);
        $('#' + outerRowID).append('<div id="' + boxID +'" class="box"></div>');
        for (var k = 0; k < 3; k++) {
            var innerRowID = 'innerRow' + String(i) + String(j) + String(k);
            $('#' + boxID).append('<div id="' + innerRowID + '" class="row"></div>');
            for (var l = 0; l < 3; l++) {
                var cellID = 'cell' + String(i) + String(j) + String(k) + String(l);
                $('#' + innerRowID).append('<div id="' + cellID + '" class="cell"></div>');
                var rowNumber = i * 3 + k;
                var columnNumber = j * 3 + l;
                var buttonID = 'rc' + String(rowNumber) + String(columnNumber);
                var tileState = 'emptyTile';
                var buttonText = sudokuGrid[rowNumber][columnNumber];
                if (buttonText != 0) {
                    tileState = 'fixedTile';
                } else {
                    buttonText = "";
                }
                $('#' + cellID).append('<button id="' + buttonID + '" class="' + tileState + '">' + buttonText + '</button>');
            }
        }
    }
}

$('.emptyTile').click( function() {
    var buttonID = this.id;
    var buttonRow = Number(buttonID.substring(2,3));
    var buttonColumn = Number(buttonID.substring(3,4));
    sudokuGrid[buttonRow][buttonColumn] += 1;
    sudokuGrid[buttonRow][buttonColumn] %= 10;
    var buttonText = this.innerHTML;
    if (buttonText === "") {
        this.innerHTML = 1;
    } else if (buttonText < 9) {
        this.innerHTML = Number(this.innerHTML) + 1;
    } else {
        this.innerHTML = "";
    }
    hasWon();
});

function hasWon() {
    var columns = [[],[],[],[],[],[],[],[],[]]
    var rows = [[],[],[],[],[],[],[],[],[]]
    var boxes = [[],[],[],[],[],[],[],[],[]]
    var correct = [1,2,3,4,5,6,7,8,9]
    for (var i = 0; i < 3; i++) { // outer row
        for (var j = 0; j < 3; j++) { // outer column
            for (var k = 0; k < 3; k++) { // inner row
                for (var l = 0; l < 3; l++) { // inner column
                    var x = 3*j + l;
                    var y = 3*i + k;
                    var n = sudokuGrid[y][x];
                    columns[x].push(n);
                    rows[y].push(n);
                    boxes[3*i + j].push(n);
                }
            }
        }
    }
    var incorrectCounter = 0;
    for (var i = 0; i < 9; i++) {
        columns[i].sort();
        rows[i].sort();
        boxes[i].sort();
        for (var j = 1; j < 10; j++) {
            if (columns[i][j-1] != j) {
                incorrectCounter += 1;
            }
            if (rows[i][j-1] != j) {
                incorrectCounter += 1;
            }
            if (boxes[i][j-1] != j) {
                incorrectCounter += 1;
            }
        }
    }
    if (incorrectCounter === 0) {
        $('#gameState').text("You won!");
    }
}