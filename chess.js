var boardArray = [
    ['R','N','B','Q','K','B','N','R'],
    ['P','P','P','P','P','P','P','P'],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ',' ',' ',' '],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
];

var blackKingCastle = true;
var blackQueenCastle = true;
var whiteKingCastle = true;
var whiteQueenCastle = true;
var movingPlayer = 'white';
var otherPlayer = 'black';
var selectedPiece = '';
var selectedMoves = [];
var eligiblePassants = [];
var moveHistory = [];

///////////////////////////////
// Create the visual board HTML
///////////////////////////////

function createVisualBoard() {
    for (var i = 1; i < 9; i++) {
        var newRow = document.createElement('div');
        newRow.setAttribute('class','row');
        newRow.setAttribute('id',`row${i}`);
        var board = document.getElementById('board');
        board.appendChild(newRow);
        for (var j = 1; j < 9; j++) {
            var cellID = `r${i}c${j}`;
            var newCell = document.createElement('div');
            newCell.setAttribute('class','cell');
            newCell.setAttribute('id',cellID);
            newRow.appendChild(newCell);
            newCell.onclick = function() {
                clickCell(this.id);
            }
            blankifyCellbyCoord([i,j]);
            newCell.innerHTML = boardArray[i-1][j-1];
            if (i < 3) {
                newCell.style.color = 'black';
            } else if (i > 6) {
                newCell.style.color = 'white';
            }
        }
    }
}

/////////////////////////
// Function Time ! ! ! //
/////////////////////////

function clickCell(cellID) {
    var cell = document.getElementById(cellID);
    if (window.selectedPiece !== '') {
        if (window.selectedMoves.includes(cellID)) { // if the move is legitimate:
            var movingPiece = cell.innerHTML;
            castleLogic(cellID, movingPlayer, movingPiece);
            var moveTag = `${movingPiece}${selectedPiece}${cellID}`;
            window.moveHistory.push(moveTag);
            movePiece(window.selectedPiece, cellID);
            // checkCheck
            if (checkCheck(movingPlayer)) {
                movePiece(cellID, window.selectedPiece);
            }
            else {
                [movingPlayer, otherPlayer] = [otherPlayer, movingPlayer];
            }
        }
        for (var i = 0; i < window.selectedMoves.length; i++) {
            blankifyCellbyID(window.selectedMoves[i]);
        }
        window.selectedPiece = '';
        window.selectedMoves = [];
    } else if (cell.innerHTML !== ' ' && cell.style.color === movingPlayer) {
        window.selectedPiece = cellID;
        window.selectedMoves = genMoves(cellID);
        for (var i = 0; i < window.selectedMoves.length; i++) {
            document.getElementById(window.selectedMoves[i]).style.borderColor = 'red';
        }
    }
}

function coord2cellID([cellR,cellC]) {
    return `r${cellR}c${cellC}`;
}

function cellID2coord(cellID) {
    return [Number(cellID[1]),Number(cellID[3])];
}

function blankifyCellbyID(cellID) {
    var [cellR, cellC] = cellID2coord(cellID);
    var cellColor = '';
    if ((cellR + cellC) % 2 === 0) {
        cellColor = 'rgb(209, 180, 49)';
    } else {
        cellColor = 'rgb(1, 78, 27)';
    }
    document.getElementById(cellID).style.backgroundColor = cellColor;
    document.getElementById(cellID).style.borderColor = cellColor;
}

function blankifyCellbyCoord([cellR,cellC]) {
    var cellID = coord2cellID([cellR,cellC]);
    var cellColor = '';
    if ((cellR + cellC) % 2 === 0) {
        cellColor = 'rgb(209, 180, 49)';
    } else {
        cellColor = 'rgb(1, 78, 27)';
    }
    document.getElementById(cellID).style.backgroundColor = cellColor;
    document.getElementById(cellID).style.borderColor = cellColor;
}

function movePiece(id1, id2) {
    var location = document.getElementById(id1);
    var destination = document.getElementById(id2);
    destination.style.color = location.style.color;
    destination.innerHTML = location.innerHTML;
    location.innerHTML = ' ';
}

function gendMoves(cellID, d, maxd, player = movingPlayer, other = otherPlayer) {
    moves = [];
    nextCoord = cellID2coord(cellID);
    while (maxd > 0) {
        nextCoord = [nextCoord[0] + d[0], nextCoord[1] + d[1]];
        if (nextCoord[0] > 0 && nextCoord[0] < 9 && nextCoord[1] > 0 && nextCoord[1] < 9) {
            var nextCoordID = coord2cellID(nextCoord);
            if (document.getElementById(nextCoordID).innerHTML === ' ') {
                moves.push(nextCoordID);
                maxd--;
                continue;
            } else if (document.getElementById(nextCoordID).style.color === other) {
                moves.push(nextCoordID);
            }
        } 
        maxd = 0;
    }
    return moves;
}

function genPawnMoves(cellID) {
    [cellR, cellC] = cellID2coord(cellID);
    var moves = []
    var direction = 0;
    var firstMove = false;
    if (movingPlayer === 'black') {
        direction = 1;
        firstMove = (cellR === 2);
    } else {
        direction = -1;
        firstMove = (cellR === 7);
    }
    var forwardMove = `r${cellR + direction}c${cellC}`;
    if (document.getElementById(forwardMove).innerHTML === ' ') {
        moves.push(forwardMove);
        if (firstMove) {
            var firstForwardMove = `r${cellR + direction * 2}c${cellC}`;
            if (document.getElementById(firstForwardMove).innerHTML === ' ') {
                moves.push(firstForwardMove);
            }
        }
    }
    var queensideEdge = (cellC - 1) === 0;
    var kingsideEdge = (cellC + 1) === 9;
    if (!queensideEdge) {
        var queensideMove = `r${cellR + direction}c${cellC - 1}`;
        var queensideMoveOccupant = document.getElementById(queensideMove);
        if (queensideMoveOccupant.innerHTML !== ' ' && queensideMoveOccupant.style.color === otherPlayer) {
            moves.push(queensideMove);
        }
    }
    if (!kingsideEdge) {
        var kingsideMove = `r${cellR + direction}c${cellC + 1}`;
        var kingsideMoveOccupant = document.getElementById(kingsideMove);
        if (kingsideMoveOccupant.innerHTML !== ' ' && kingsideMoveOccupant.style.color === otherPlayer) {
            moves.push(kingsideMove);
        }
    }
    return moves;
}

function checkCheck(inputPlayer) { // checking if inputPlayer is in check and returning
    var inputOther = inputPlayer === 'white' ? 'black' : 'white';
    for (var i = 1; i < 9; i++) {
        for (var j = 1; j < 9; j++) {
            var potentialKingID = coord2cellID([i,j]);
            var potentialKing = document.getElementById(potentialKingID);
            if (potentialKing.innerHTML === 'K') {
                if (potentialKing.style.color === inputPlayer) {
                    var kingID = potentialKingID;
                    var kingCoords = [i,j];
                    [i,j] = [9,9];
                }
            }
        }
    }

    var rookThreatds = [[1,0],[0,1],[-1,0],[0,-1]];
    var bishopThreatds = [[1,1],[1,-1],[-1,1],[-1,-1]];
    var knightThreatds = [[1,2],[-1,2],[1,-2],[-1,-2],[2,1],[-2,1],[2,-1],[-2,-1]];
    var pawnThreatds = inputPlayer === 'white' ? [[-1,-1],[-1,1]] : [[1,-1],[1,1]];

    for (var i = 0; i < bishopThreatds.length; i++) {
        var bishopThreat = gendMoves(kingID, bishopThreatds[i], 7, inputPlayer, inputOther);
        if (bishopThreat.length !== 0) {
            var threatID = bishopThreat[bishopThreat.length - 1];
            var threat = document.getElementById(threatID);
            if (threat.style.color === inputOther) {
                if(['Q','B'].includes(threat.innerHTML)) {
                    return true;
                }
            }
        }
    }
    for (var i = 0; i < rookThreatds.length; i++) {
        var rookThreat = gendMoves(kingID, rookThreatds[i], 7, inputPlayer, inputOther);
        if (rookThreat.length !== 0) {
            var threatID = rookThreat[rookThreat.length - 1];
            var threat = document.getElementById(threatID);
            if (threat.style.color === inputOther) {
                if(['Q','R'].includes(threat.innerHTML)) {
                    return true;
                }
            }
        }
    }
    for (var i = 0; i < knightThreatds.length; i++) {
        var knightThreat = gendMoves(kingID, knightThreatds[i], 1, inputPlayer, inputOther);
        if (knightThreat.length !== 0) {
            var threatID = knightThreat[knightThreat.length - 1];
            var threat = document.getElementById(threatID);
            if (threat.style.color === inputOther) {
                if(threat.innerHTML === 'N') {
                    return true;
                }
            }
        }
    }
    for (var i = 0; i < pawnThreatds.length; i++) {
        var pawnThreat = gendMoves(kingID, pawnThreatds[i], 1, inputPlayer, inputOther);
        if (pawnThreat.length !== 0) {
            var threatID = pawnThreat[pawnThreat.length - 1];
            var threat = document.getElementById(threatID);
            if (threat.style.color === inputOther) {
                if(threat.innerHTML === 'P') {
                    return true;
                }
            }
        }
    }
    return false;
}




function genMoves(cellID, piece = document.getElementById(cellID).innerHTML) {
    var ds = [];
    var maxd = 1;
    var moves = [];
    if (piece === 'P') {
        moves = genPawnMoves(cellID);
    } else {
        switch (piece) {
            case ' ':
                break;
            case 'P':
                break;
            case 'R':
                ds.push([1,0],[0,1],[-1,0],[0,-1]);
                maxd = 7;
                break;
            case 'B':
                ds.push([1,1],[1,-1],[-1,1],[-1,-1]);
                maxd = 7;
                break;
            case 'N':
                ds.push([1,2],[-1,2],[1,-2],[-1,-2],[2,1],[-2,1],[2,-1],[-2,-1]);
                break;
            case 'Q':
                ds.push([1,0],[0,1],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1])
                maxd = 7;
                break;
            case 'K':
                ds.push([1,0],[0,1],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1])
                break;
        }
        for (var i = 0; i < ds.length; i++) {
            var newMoves = gendMoves(cellID, ds[i], maxd);
            for (var j = 0; j < newMoves.length; j++) {
                moves.push(newMoves[j]);
            }
        }
    }
    if (piece === 'K') {
        var holdMoves = moves;
        moves = [];
        for (var i = 0; i < holdMoves.length; i++) {
            var potentialHeldMove = document.getElementById(holdMoves[i]);
            var potentialHeldMoveColor = potentialHeldMove.style.color;
            var potentialHeldMovePiece = potentialHeldMove.innerHTML;
            movePiece(cellID, holdMoves[i]);
            if (!checkCheck(movingPlayer)) {
                moves.push(holdMoves[i]);
            }
            movePiece(holdMoves[i], cellID);
            potentialHeldMove.style.color = potentialHeldMoveColor;
            potentialHeldMove.innerHTML = potentialHeldMovePiece;
        }
    }
    return moves;
}

function castleLogic(cellID,movingPlayer,movingPiece) {
    if (movingPiece === 'K') {
        if (movingPlayer === 'white') {
            whiteKingCastle = false;
            whiteQueenCastle = false;
        } else {
            blackKingCastle = false;
            blackQueenCastle = false;
        }
    } else if (movingPiece === 'R') {
        if (movingPlayer === 'white') {
            if (cellID === 'r8c1') {
                whiteQueenCastle = false;
            } else if (cellID === 'r8c8') {
                whiteKingCastle = false;
            }
        } else {
            if (cellID === 'r1c1') {
                blackQueenCastle = false;
            } else if (cellID === 'r1c8') {
                blackKingCastle = false;
            }
        }
    }
}








/////////////////////
// actually run stuff
/////////////////////

createVisualBoard();
//movePiece('r8c1','r2c5');
console.log(checkCheck('black'));
// console.log(genMoves('r8c2'));