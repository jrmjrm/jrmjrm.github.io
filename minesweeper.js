function genMapHTML(map) {
    height = map.length;
    width = map[0].length;
    for (var row = 0; row < height; row++) {
        $('.gridContainer').append('<div id="row' + row + '" class="row"></div>');
        for (var column = 0; column < width; column++) {
            var tileClass = map[row][column];
            if (tileClass === 0) {
                var tileValue = "";
                var tileStatus = 'hidden'; // could be 'revealed'
            } else {
                var tileValue = tileClass;
                var tileStatus = 'hidden';
            }
            $('#row' + row).append('<div id="R' + row + 'C' + column +'" class="cell ' + tileStatus + '"></div>'); // no tile value
        }
    }
}

function genMines(height, width, mineCount) { // returns a list of unique coordinates of mineCount length
    var mineCoordsPool = [];
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            mineCoordsPool.push([x,y]);
        }
    }
    var mineCoords = [];
    for (var i = 0; i < mineCount; i++) {
        var randomNumber = Math.floor((Math.random() * mineCoordsPool.length) + 1) - 1;
        randomCoord = (mineCoordsPool.splice(randomNumber, 1))['0'];
        mineCoords.push(randomCoord);
    }
    return mineCoords;
}

function genCoords(mineCoords) { // returns a list of coordinates [y,x] for every mine or tile next to a mine
    coords = []
    for (var i = 0; i < mineCoords.length; i++) {
        for (var x = -1; x < 2; x++) {
            for (var y = -1; y < 2; y++) {
                coords.push([mineCoords[i][0] + x, mineCoords[i][1] + y]);
            }
        }
    }
    return coords;
}

function genBlankMap(height, width) { // returns a height x width array of 0's
    var map = []
    for (var y = 0; y < height; y++) {
        map.push([]);
        for (var x = 0; x < width; x++) {
            map[y].push(0);
        }
    }
    return map
}

function genMap(height, width, mineCount) { // returns a height x width array with mineCount mines, tile counts, and blanks
    var map = genBlankMap(height, width);
    var mineCoords = genMines(height, width, mineCount);
    var numCoords = genCoords(mineCoords);
    for (var i = 0; i < numCoords.length; i++) {
        xCoord = numCoords[i][0];
        yCoord = numCoords[i][1];
        if (xCoord >= 0 && yCoord >= 0 && xCoord < width && yCoord < height) {
            map[yCoord][xCoord] += 1;
        }
    }
    for (var i = 0; i < mineCoords.length; i++) {
        mineXCoord = mineCoords[i][0];
        mineYCoord = mineCoords[i][1];
        map[mineYCoord][mineXCoord] = 'M';
    }
    return map;
}

function countInArray(array, what) { // returns the count of appearances of what in array
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === what) {
            count++;
        }
    }
    return count;
}

var mapHeight = prompt("height?");
var mapWidth = prompt("width?");
var mapMineCount = prompt("number of mines?");
var map = genMap(mapHeight, mapWidth, mapMineCount);
genMapHTML(map);

$('.cell').mouseover(function() {
    $('#' + this.id).css("border-color","white");
});

$('.cell').mouseout(function() {
    $('#' + this.id).css("border-color","rgb(100, 100, 100)");
});

function cellReveal(cellID) { // reveals hidden cell with given ID
    var cLocation = cellID.indexOf("C");
    var cellY =  Number(cellID.slice(1, cLocation));
    var cellX = Number(cellID.slice(cLocation + 1));
    var cellValue = map[cellY][cellX];
    newClass = 'tc' + cellValue;
    $('#' + cellID).addClass(newClass);
    $('#' + cellID).removeClass('hidden').addClass('revealed');
    if (cellValue != 0) {
        $('#' + cellID).text(cellValue);
    }
}

function cellMark(cellID) { // toggles a '?' on cell with given ID (only if hidden)
    var cellText = $('#' + cellID).text();
    var isHidden = $('#' + cellID).hasClass('hidden');
    if (cellText === '' && isHidden) {
        $('#' + cellID).text('?');
    } else if (cellText === '?') {
        $('#' + cellID).text('');
    }
}

function floodReveal(r, c, h, w) { // recursive function that reveals nearby qualifying cells
    var validCoord = (r >= 0 && c >= 00 && r < h && c < w)
    if (validCoord) {
        var cellID = 'R' + r + 'C' + c;
        if ($('#' + cellID).hasClass('hidden')) {
            cellReveal(cellID);
            if (map[r][c] === 0) {
                for (var i = -1; i < 2; i++) {
                    for (var j = -1; j < 2; j++) {
                        if (!(j === 0 && i === 0)) {
                            floodReveal(i + r, j + c, h, w);
                        }
                    }
                }
            }
        }
    }
}

function hasWon() {
    var goalCount = mapHeight * mapWidth;
    var count = 0;
    for (var i = 0; i < mapHeight; i++) {
        for (var j = 0; j < mapWidth; j++) {
            var cellID = 'R' + i + 'C' + j;
            var isHidden = $('#' + cellID).hasClass('hidden');
            var isMine = (map[i][j] === 'M');
            if (isHidden ? isMine : !isMine) {
                count += 1
            }
        }
    }
    console.log([count, goalCount]);
    if (count === goalCount) {
        $('#hasWon').text('You won!!');
        $('#hasWon').css('color','white');
    }
}

$('.cell.hidden').mousedown( function(event) {
    var cellID = this.id;
    var cLocation = cellID.indexOf("C");
    var cellY =  Number(cellID.slice(1, cLocation));
    var cellX = Number(cellID.slice(cLocation + 1));
    mapHeight = map.length;
    mapWidth = map[0].length;
    switch (event.which) {
        case 1:
            console.log('left mouse button');
            floodReveal(cellY, cellX, mapHeight, mapWidth);
            break;
        case 2:
            console.log('middle mouse button');
            break;
        case 3:
            console.log('right mouse button');
            cellMark(cellID);
    }
    hasWon();
});

$('.cell').bind('contextmenu', function(e) {
    e.preventDefault();
    return false;
});