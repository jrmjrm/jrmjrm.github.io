var numberA = 0;
var numberB = 0;
var isNumberA = true;
var operatorButton = '+';

function getId() {
    return this.event.target.id;
}

function result(inputString) {
    $('#result').text(inputString);
}

result(numberA);

function setNumber(inputNumber) {
    if (isNumberA) {
        numberA = inputNumber;
    } else {
        numberB = inputNumber;
    }
}

function getNumber(inputNumber) {
    if (isNumberA) {
        return numberA;
    } else {
        return numberB;
    }
}

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}


function calculate() {
    ans = 0;
    switch (operatorButton) {
        case '/':
            ans = numberA / numberB;
            break;
        case '*':
            ans = numberA * numberB;
            break;
        case '-':
            ans = numberA - numberB;
            break;
        case '+':
            ans = numberA + numberB;
            break;
        case '%':
            ans = numberA % numberB;
            break;
    }
    numberA = ans;
    isNumberA = true;
    numberB = 0;
    result(numberA);
}



function buildNumber(inputNumber, buttonClick) {
    switch (buttonClick) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            if (isNumberA) {
                numberA = Number(String(getNumber()) + buttonClick);
            } else {
                numberB = Number(String(getNumber()) + buttonClick);
            }
            result(getNumber());
            break;
        case '.':
            var strNum = String(getNumber());
            if (!strNum.includes(".")) {
                setNumber(getNumber() / 10);
            }
            result(getNumber());
            break;
        case 'backspace':
            if (String(getNumber()).length > 1) {
                var strNum = String(getNumber());
                strNum = strNum.substring(0, strNum.length - 1);
                var numNum = Number(strNum);
                setNumber(numNum);
            } else {
                setNumber(0);
            }
            result(getNumber());
            break;
        case 'CE':
            isNumberA = true;
            numberA = 0;
            numberB = 0;
            result(0);
            break;
        case 'C':
            setNumber(0);
            result(0);
            break;
        case '/':
        case '*':
        case '-':
        case '+':
        case '%':
            operatorButton = buttonClick;
            isNumberA = !isNumberA;
            break;
        case 'sqrt':
            setNumber(getNumber()**.5);
            result(getNumber());
            break;
        case '1/x':
            setNumber(1/getNumber());
            result(getNumber());
            break;
        case '=':
            if (!isNumberA) {
                calculate();
            }
            break;
        }
}

$('button').click( function() {
    var buttonID = getId();
    buildNumber(getNumber(), buttonID)
});
