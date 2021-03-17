//if ur here i KNOW ur cheating!👀👀👀

const game = {
    saturation: 30,
    light: 50,
    variance: 375,
    correctSelection: 'selection1',
    points: -1,
    hasEnded: false,
    advanceTurn: function() {
        if (this.points === 10) {
            this.win();
        } else {
            this.points++;
            this.variance = Math.round(this.variance * .8);
            const correctSelectionNum = randomNumber(1,8);
            this.correctSelection = `selection${correctSelectionNum}`;
            genNewColorSet(this.variance, correctSelectionNum);
            //console.log(this.variance, this.correctSelection);
            document.getElementById('emptySelection').innerHTML = this.points;
        }
    },
    lose: function() {
        this.hasEnded = true;
        document.getElementById('emptySelection').innerHTML = 'You Lose!';
    },
    win: function() {
        this.hasEnded = true;
        document.getElementById('emptySelection').innerHTML = 'You Win!';
    }
}

const changeColor = (elementID, color) => { document.getElementById(elementID).style.backgroundColor = color };

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const newAnswerColor = (baseHue, variance) => randomNumber(baseHue-variance,baseHue+variance);

const convertToHSLA = (hue) => `hsla(${hue},${game.saturation}%,${game.light}%,1)`

const genNewColorSet = (variance, correctSelection) => {
    const baseHue = newAnswerColor(180,180);
    changeColor(`primaryColor`,convertToHSLA(baseHue));
    for (let i = 1; i < 9; i++) {
        if (i === correctSelection) {
            changeColor(`selection${i}`,convertToHSLA(baseHue));
        } else {
            const incorrectSelection = newAnswerColor(baseHue, variance);
            if (incorrectSelection === baseHue) {
                i--;
                continue;
            }
            changeColor(`selection${i}`,convertToHSLA(incorrectSelection));
        }
    }
}

const clickSelection = (selectionID) => {
    //console.log(selectionID);
    if (!game.hasEnded) {
        if (selectionID === game.correctSelection) {
        game.advanceTurn();
        } else {
            game.lose();
        }
    }
}

game.advanceTurn();
