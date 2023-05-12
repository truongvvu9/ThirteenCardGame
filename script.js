//game classes model
class Card {
    constructor(rank, suit, value) {    //rank is a String, suit is a String and value is a Number
        this.rank = rank;
        this.suit = suit;
        this.value = value;
    }
}

class Deck {
    constructor() {
        this.stringArray = new Array(); //strings that correspond to card images files
        this.cardsArray = this.populateDeck(); //returns array of Card objects
        this.totalCards = this.cardsArray.length;

    }

    repopulateDeckAndString() {
        this.cardsArray = this.populateDeck();
    }

    populateDeck() { //adds 52 cards to array of Cards and returns array of Cards and add card string names 
        const cardsArray = new Array();
        let value = 0;
        this.stringArray = [];
        for (let i = 3; i <= 15; i++) {
            let rankStr = String(i);
            if (i > 10) {
                switch (i) {
                    case 11:
                        rankStr = 'jack';
                        break;
                    case 12:
                        rankStr = 'queen';
                        break;
                    case 13:
                        rankStr = 'king';
                        break;
                    case 14:
                        rankStr = 'ace';
                        break;
                    case 15:
                        rankStr = 'two';
                        break;
                }
            }
            for (let x = 1; x <= 4; x++) {
                value++;
                let suit = '';
                switch (x) {
                    case 1:
                        suit = 'spades';
                        break;
                    case 2:
                        suit = 'cloves';
                        break;
                    case 3:
                        suit = 'diamonds';
                        break;
                    case 4:
                        suit = 'hearts';
                        break;
                }

                cardsArray.push(new Card(rankStr, suit, value));
                this.stringArray.push(String(i) + suit);

            }
        }
        return cardsArray;
    }

    shuffle() { //shuffle cards in deck randomly
        const posOrNeg = function () {
            if (Math.trunc(Math.random() * 2) + 1 === 1) {
                return -1;
            } else {
                return 1;
            }
        }
        this.cardsArray.sort(posOrNeg);
    }
    removeCard() { //removes top card from cardsArray and returns the removed card
        return this.cardsArray.shift();
    }
    cardsLeft() {
        this.totalCards = this.cardsArray.length;
        return this.totalCards;
    }
}

class Hand {
    constructor() {
        this.cardsArray = []; //array of Card objects
        this.type = '' //String. Type of hand (ex: singles, doubles, combo)
    }
    addCard(card) { //adds card object
        this.cardsArray.push(card);

    }
    removeCard(card) { //removes a specific card from the cards array
        const newCardArray = new Array();
        for (let i = 0; i < this.cardsArray.length; i++) {
            if (this.cardsArray[i] === card) {
                continue;
            }
            newCardArray.push(this.cardsArray[i]);
        }
        this.cardsArray = [];
        for (let i = 0; i < newCardArray.length; i++) {
            this.cardsArray.push(newCardArray[i]);

        }
    }

    sortCards() {
        this.cardsArray.sort((cardOne, cardTwo) => cardOne.value - cardTwo.value);
    }

}

class Player {
    constructor(type, name) {
        this.hand = new Hand();
        this.lead = false;
        this.type = type; //string
        this.name = name; //string
        this.canClickNew = false;
        this.played = false;
        this.pass = false;
        this.finished = false;
        this.firstPlay = false;
        this.facedownCardsList = [];
        this.lastPlayedHandArray = [];
        this.singles = [];
        this.doublesArray = []; //2d array
        this.triplesArray = []; //2d array
        this.fourOfKindArray = []; //2d array
        this.comboArray = []; //2d array
        this.chopperComboArray = []; //2d array
        this.possibleMoves = []; //2d array
    }
    resetAllFields() {
        this.hand = new Hand();
        this.lead = false;
        this.played = false;
        this.pass = false;
        this.canClickNew = false;
        this.facedownCardsList = [];
        this.finished = false;
        this.lastPlayedHandArray = [];
        this.singles = [];
        this.doublesArray = []; //2d array
        this.triplesArray = []; //2d array
        this.fourOfKindArray = []; //2d array
        this.comboArray = []; //2d array
        this.chopperComboArray = []; //2d array
        this.possibleMoves = []; //2d array

    }

    addFacedownCards(facedownImgElementsNodeList) { //only for bots
        this.facedownCardsList = facedownImgElementsNodeList;
    }

    removePlayingHandFromHand() {
        for (let i = 0; i < this.playingHand.cardsArray.length; i++) {
            this.hand.removeCard(this.playingHand.cardsArray[i]);
        }

    }
    playThreeOfSpades() {
        let tempThreeOfSpadesArray = [];
        for (let i = 0; i < this.hand.cardsArray.length; i++) {
            if (this.hand.cardsArray[i].value === 1) {
                tempThreeOfSpadesArray.push(this.hand.cardsArray[i]);
                break;
            }
        }
        this.lastPlayedHandArray = Array.from(tempThreeOfSpadesArray);
        this.hand.cardsArray = this.subtractPlayingHandFromHand(this.lastPlayedHandArray, this.hand.cardsArray);
        this.updateFaceDownCardsRender();
        return Array.from(this.lastPlayedHandArray);

    }
    resetArrayFields() {
        this.singles = [];
        this.doublesArray = [];
        this.triplesArray = [];
        this.fourOfKindArray = [];
        this.comboArray = [];
        this.chopperComboArray = [];
        this.choppersArray = [];
        this.possibleMoves = [];

    }
    computePossibleMoves() {
        this.resetArrayFields();
        //compute for singles
        for (let i = 0; i < this.hand.cardsArray.length; i++) {
            let tempArr = [];
            tempArr.push(this.hand.cardsArray[i]);
            this.singles.push(tempArr);
        }
        //computer for doubles
        for (let i = 0; i < this.hand.cardsArray.length - 1; i++) {
            let firstCardRank = convertRankToNumber(this.hand.cardsArray[i].rank);
            let secondCardRank = convertRankToNumber(this.hand.cardsArray[i + 1].rank);
            if (firstCardRank === secondCardRank) {
                let tempArray = [];
                tempArray.push(this.hand.cardsArray[i]);
                tempArray.push(this.hand.cardsArray[i + 1]);
                this.doublesArray.push(tempArray);
            }
        }
        //compute for triples
        for (let i = 0; i < this.hand.cardsArray.length - 2; i += 3) {
            if (this.hand.cardsArray[i].rank === this.hand.cardsArray[i + 1].rank && this.hand.cardsArray[i + 1].rank === this.hand.cardsArray[i + 2].rank) {
                let tempArray = [];
                tempArray.push(this.hand.cardsArray[i]);
                tempArray.push(this.hand.cardsArray[i + 1]);
                tempArray.push(this.hand.cardsArray[i + 2]);
                this.triplesArray.push(tempArray);
            } else {
                i -= 2;
            }
        }
        //compute for four of kind
        for (let i = 0; i < this.hand.cardsArray.length - 3; i += 4) {
            if (this.hand.cardsArray[i].rank === this.hand.cardsArray[i + 1].rank && this.hand.cardsArray[i + 1].rank === this.hand.cardsArray[i + 2].rank && this.hand.cardsArray[i + 2].rank === this.hand.cardsArray[i + 3].rank) {
                let tempArray = [];
                tempArray.push(this.hand.cardsArray[i]);
                tempArray.push(this.hand.cardsArray[i + 1]);
                tempArray.push(this.hand.cardsArray[i + 2]);
                tempArray.push(this.hand.cardsArray[i + 3]);
                this.fourOfKindArray.push(tempArray);
            } else {
                i -= 3;
            }
        }
        //compute for combo
        let start = 0;
        let potentialArray = [];
        for (let i = 0; i < this.hand.cardsArray.length - 1; i++) {
            let firstCardRank = convertRankToNumber(this.hand.cardsArray[i].rank);
            let secondCardRank = convertRankToNumber(this.hand.cardsArray[i + 1].rank);
            if (firstCardRank === 15 || secondCardRank === 15) {
                break;
            }
            if (firstCardRank + 1 === secondCardRank || firstCardRank === secondCardRank) {
                if (i === start && i < this.hand.cardsArray.length - 2) {
                    potentialArray.push(this.hand.cardsArray[i]);
                    potentialArray.push(this.hand.cardsArray[i + 1]);

                } else {
                    potentialArray.push(this.hand.cardsArray[i + 1]);
                    if (i === this.hand.cardsArray.length - 2 && potentialArray.length > 2) {
                        if (this.checkConsecutive(potentialArray)) {
                            this.comboArray.push(potentialArray);
                            potentialArray = [];
                        }

                    }
                }
            } else {
                start = i + 1;
                if (potentialArray.length > 2) {
                    if (this.checkConsecutive(potentialArray)) {
                        this.comboArray.push(potentialArray);
                    }
                }
                potentialArray = [];
            }

        }

        let duplicates = [];
        for (let i = 0; i < this.comboArray.length; i++) {
            let start = 0;
            for (let x = 0; x < this.comboArray[i].length - 1; x++) {
                let firstCardRank = convertRankToNumber(this.comboArray[i][x].rank);
                let secondCardRank = convertRankToNumber(this.comboArray[i][x + 1].rank);
                if (firstCardRank === secondCardRank) {
                    if (x === start) {
                        duplicates.push(this.comboArray[i][x]);
                        duplicates.push(this.comboArray[i][x + 1]);
                    } else {
                        duplicates.push(this.comboArray[i][x + 1]);
                    }

                } else {
                    start = x + 1;
                }

            }
        }

        let tempComboArray = [];
        for (let i = 0; i < this.comboArray.length; i++) { //chooses the first cards in a combo
            let tempComboArrayRank = [];
            let tempArray = [];
            for (let x = 0; x < this.comboArray[i].length; x++) {
                let rank = convertRankToNumber(this.comboArray[i][x].rank);
                if (!tempComboArrayRank.includes(rank)) {
                    tempArray.push(this.comboArray[i][x]);
                    tempComboArrayRank.push(rank);
                }

            }
            tempComboArray.push(tempArray);
        }

        //change last card in combo to the strongest suit
        this.changeLastCardInComboToStrongest(tempComboArray, duplicates);

        //copy elements from tempComboArray to permComboArray
        let permComboArray = Array.from(tempComboArray);

        //break up the tempComboArray into smaller combos and add it to permComboArray
        for (let i = 0; i < tempComboArray.length; i++) {
            let tempArr = [];
            if (tempComboArray[i].length > 3) {
                for (let x = 3; x <= tempComboArray[i].length - 1; x++) {
                    for (let a = 0; a < (tempComboArray[i].length - x) + 1; a++) {
                        let counter = 0;
                        for (let b = a; b < tempComboArray[i].length; b++) {
                            tempArr.push(tempComboArray[i][b]);
                            counter++;
                            if (counter === x) {
                                break;
                            }
                        }
                        let tempArrayHolder = [];
                        tempArrayHolder.push(tempArr);
                        this.changeLastCardInComboToStrongest(tempArrayHolder, duplicates);
                        permComboArray.push(tempArrayHolder[0]);
                        tempArr = [];

                    }
                }
            }
        }

        //set this.comboArray to permComboArray
        this.comboArray = Array.from(permComboArray);

        //compute for chopper combo
        let rankArray = [];
        let rankSet = new Set();
        let tempConsecutiveSet = new Set();
        let tempConsecutivesArr = [];
        if (this.doublesArray.length >= 3) {
            for (let i = 0; i < this.doublesArray.length; i++) {
                rankSet.add(convertRankToNumber(this.doublesArray[i][0].rank));
            }
            rankArray = Array.from(rankSet);
            for (let i = 0; i < rankArray.length - 1; i++) {
                if (rankArray[i] === 15 || rankArray[i + 1] === 15) {
                    break;
                }
                if (rankArray[i] + 1 !== rankArray[i + 1]) {
                    if (tempConsecutiveSet.size < 3) {
                        tempConsecutiveSet = new Set();
                    } else {
                        tempConsecutivesArr.push(Array.from(tempConsecutiveSet));
                        tempConsecutiveSet = new Set();

                    }
                    continue;
                }
                tempConsecutiveSet.add(rankArray[i]);
                tempConsecutiveSet.add(rankArray[i + 1]);
                if (i === rankArray.length - 1) {
                    tempConsecutivesArr.push(Array.from(tempConsecutiveSet));
                }
            }
            if (tempConsecutivesArr.length > 0) {
                let tempChopperComboArray = [];
                for (let i = 0; i < tempConsecutivesArr.length; i++) {
                    for (let x = 0; x < tempConsecutivesArr[i].length; x++) {
                        for (let a = 0; a < this.doublesArray.length; a++) {
                            if (convertRankToNumber(this.doublesArray[a][0].rank) === tempConsecutivesArr[i][x]) {
                                tempChopperComboArray.push(this.doublesArray[a]);

                            }
                        }

                    }

                }
                this.chopperComboArray = Array.from(tempChopperComboArray);
            }

        }

        //add all moves to this.possibleMoves array
        //add singles
        this.addToPossibleMoves(this.singles, this.possibleMoves);
        //add doubles
        this.addToPossibleMoves(this.doublesArray, this.possibleMoves);
        //add triples
        this.addToPossibleMoves(this.triplesArray, this.possibleMoves);
        //add fourOfKind
        this.addToPossibleMoves(this.fourOfKindArray, this.possibleMoves);
        //add combo
        this.addToPossibleMoves(this.comboArray, this.possibleMoves);
        //add chopper combo
        this.addToPossibleMoves(this.chopperComboArray, this.possibleMoves);
    }

    computePossibleMovesToLastHand(handArray) { //compute possible moves in response to the last hand played
        this.computePossibleMoves();
        this.possibleMoves = [];
        let cardValue = 0;

        switch (determinePlayingHandType(handArray)) {
            case 'single':
                if (this.singles.length > 0) {
                    cardValue = handArray[0].value;
                    for (let i = 0; i < this.singles.length; i++) {
                        if (this.singles[i][0].value > cardValue) {
                            this.possibleMoves.push(this.singles[i]);
                        }
                    }
                }
                //add choppers as possible move if the card is a 2
                if (handArray[0].rank === 'two' && this.chopperComboArray.length > 0 || this.fourOfKindArray.length > 0) {
                    for (let i = 0; i < this.chopperComboArray.length; i++) {
                        this.possibleMoves.push(this.chopperComboArray[i]);
                    }
                    for (let i = 0; i < this.fourOfKindArray.length; i++) {
                        this.possibleMoves.push(this.fourOfKindArray[i]);
                    }

                }
                break;
            case 'double':
                if (this.doublesArray.length > 0) {
                    cardValue = handArray[1].value;
                    for (let i = 0; i < this.doublesArray.length; i++) {
                        if (this.doublesArray[i][1].value > cardValue) {
                            this.possibleMoves.push(this.doublesArray[i]);
                        }
                    }
                }
                break;
            case 'triple':
                if (this.triplesArray.length > 0) {
                    cardValue = handArray[2].value;
                    for (let i = 0; i < this.triplesArray.length; i++) {
                        if (this.triplesArray[i][2].value > cardValue) {
                            this.possibleMoves.push(this.triplesArray[i]);
                        }
                    }
                }
                break;
            case 'fourOfKind':
                if (this.fourOfKindArray.length > 0) {
                    cardValue = handArray[3].value;
                    for (let i = 0; i < this.fourOfKindArray.length; i++) {
                        if (this.fourOfKindArray[i][3].value > cardValue) {
                            this.possibleMoves.push(this.fourOfKindArray[i]);
                        }
                    }
                }
                break;
            case 'combo':
                if (this.comboArray.length > 0) {
                    let comboLength = handArray.length;
                    let lastCardValue = handArray[handArray.length - 1].value;
                    for (let i = 0; i < this.comboArray.length; i++) {
                        if (this.comboArray[i].length === comboLength && this.comboArray[i][this.comboArray[i].length - 1].value > lastCardValue) {
                            this.possibleMoves.push(this.comboArray[i]);
                        }
                    }
                }
                break;
            case 'chopper combo':
                if (this.chopperComboArray.length > 0) {
                    let comboLength = handArray.length;
                    let lastCardValue = handArray[handArray.length - 1].value;
                    for (let i = 0; i < this.chopperComboArray.length; i++) {
                        if (this.chopperComboArray[i].length === comboLength && this.chopperComboArray[i][this.chopperComboArray[i].length - 1].value > lastCardValue) {
                            this.possibleMoves.push(this.chopperComboArray[i]);
                        }
                    }

                }
                if (this.fourOfKindArray.length > 0) {
                    for (let i = 0; i < this.fourOfKindArray.length; i++) {
                        this.possibleMoves.push(this.fourOfKindArray[i]);
                    }
                }
                break;
        }
    }

    addToPossibleMoves(array, possibleMovesArray) {
        for (let i = 0; i < array.length; i++) {
            possibleMovesArray.push(array[i]);
        }
    }
    checkConsecutive(potentialArray) {
        let tempSet = new Set();
        for (let x = 0; x < potentialArray.length; x++) {
            tempSet.add(potentialArray[x].rank);
        }
        let tempArray = Array.from(tempSet);
        let isConsecutive = true;
        if (tempArray.length > 2) {
            for (let x = 0; x < tempArray.length - 1; x++) {
                let firstRank = convertRankToNumber(tempArray[x]);
                let secondRank = convertRankToNumber(tempArray[x + 1]);
                if (firstRank + 1 !== secondRank) {
                    isConsecutive = false;
                    break;
                }
            }
        } else {
            isConsecutive = false;
        }
        return isConsecutive;
    }
    changeLastCardInComboToStrongest(tempComboArray, duplicates) { //changes array in place
        for (let i = 0; i < tempComboArray.length; i++) {
            if (duplicates.includes(tempComboArray[i][tempComboArray[i].length - 1])) {
                for (let x = duplicates.length - 1; x >= 0; x--) {
                    if (duplicates[x].rank === tempComboArray[i][tempComboArray[i].length - 1].rank) {
                        tempComboArray[i][tempComboArray[i].length - 1] = duplicates[x];
                        break;
                    }
                }
            }
        }
    }

    countTrashCards(handCardsArray) {
        let numberOfTrashCards = 0;
        for (let i = 0; i < this.hand.cardsArray.length; i++) {
            if (this.checkIfCardBelongsToGroup(handCardsArray[i], this.doublesArray)) {
                continue;
            }
            if (this.checkIfCardBelongsToGroup(handCardsArray[i], this.triplesArray)) {
                continue;
            }
            if (this.checkIfCardBelongsToGroup(handCardsArray[i], this.fourOfKindArray)) {
                continue;
            }
            if (this.checkIfCardBelongsToGroup(handCardsArray[i], this.comboArray)) {
                continue;
            }
            if (this.checkIfCardBelongsToGroup(handCardsArray[i], this.chopperComboArray)) {
                continue;
            }
            numberOfTrashCards++;
        }
        return numberOfTrashCards;
    }

    checkIfCardBelongsToGroup(card, groupArray) {
        for (let i = 0; i < groupArray.length; i++) {
            if (groupArray[i].includes(card)) {
                return true;
            }
        }
        return false;

    }

    subtractPlayingHandFromHand(playingHandArr, handArr) { //returns a new hand cards array
        let newHandArr = [];
        for (let i = 0; i < handArr.length; i++) {
            if (!playingHandArr.includes(handArr[i])) {
                newHandArr.push(handArr[i]);
            }
        }
        return newHandArr;
    }


    playBestHandFreely() { //only for evy and lyle. chooses the hand with the least amount of trash cards
        this.computePossibleMoves();
        this.lastPlayedHandArray = this.findMoveWithHighestNumberOfCards();
        this.hand.cardsArray = this.subtractPlayingHandFromHand(this.lastPlayedHandArray, this.hand.cardsArray);
        this.updateFaceDownCardsRender();
        return Array.from(this.lastPlayedHandArray);

    }

    findMostEfficientPossibleMove() { //finds most efficient possible move out of the list of possible moves
        let possibleMovesToNumOfTrashCardMap = new Map();
        let minTrashCard = 100;
        let greatestLengthOfPossibleMove = 0;
        for (let i = 0; i < this.possibleMoves.length; i++) {
            let numOfTrashCards = this.countTrashCards(this.subtractPlayingHandFromHand(this.possibleMoves[i], this.hand.cardsArray));
            if (numOfTrashCards <= minTrashCard) {
                minTrashCard = numOfTrashCards;
                possibleMovesToNumOfTrashCardMap.set(this.possibleMoves[i], numOfTrashCards);
                if (this.possibleMoves[i].length >= greatestLengthOfPossibleMove) {
                    greatestLengthOfPossibleMove = this.possibleMoves[i].length;
                }
            }

        }
        //finds and returns the possible move that leaves the lowest trash cards but gets rid of the highest amount of cards from the hand
        for (const [key, value] of possibleMovesToNumOfTrashCardMap) {
            if (key.length === greatestLengthOfPossibleMove && value === minTrashCard) {
                return key;
            }
        }
    }

    findMoveWithHighestNumberOfCards() { //finds move with highest amount of cards. doesn't take into account efficiency of move
        let possibleMovesToNumOfTrashCardMap = new Map();
        let greatestLengthOfPossibleMove = 0;
        let moveWithHighestAmountOfCards = [];
        for (let i = 0; i < this.possibleMoves.length; i++) {
            if (this.possibleMoves[i].length > greatestLengthOfPossibleMove) {
                greatestLengthOfPossibleMove = this.possibleMoves[i].length;
                moveWithHighestAmountOfCards = this.possibleMoves[i];
            }

        }
        return moveWithHighestAmountOfCards;
    }


    playBestHand(handPlayArr) { //only for evy and lyle
        this.computePossibleMovesToLastHand(handPlayArr); //updates this.possibleMoves
        if (this.possibleMoves.length > 0) { //if there are possible moves that can beat the last hand
            this.lastPlayedHandArray = this.findMostEfficientPossibleMove();
            this.hand.cardsArray = this.subtractPlayingHandFromHand(this.lastPlayedHandArray, this.hand.cardsArray);
        } else { //if there are no possible moves that can beat the last hand
            this.lastPlayedHandArray = []; //clear lastPlayedHandArray 
        }

        this.updateFaceDownCardsRender();
        return Array.from(this.lastPlayedHandArray);
    }

    updateFaceDownCardsRender() { //removes the bot's face down cards. corresponds to bot's hand. only for bots
        if (this.facedownCardsList.length > 0 && this.lastPlayedHandArray.length > 0) {
            let count = 0;
            for (let i = this.facedownCardsList.length - 1; i >= 0; i--) {
                if (this.facedownCardsList[i].classList.contains('added')) {
                    this.facedownCardsList[i].classList.remove('added');
                    count++;
                }
                if (count === this.lastPlayedHandArray.length) {
                    break;
                }
            }
            for (let i = 0; i < this.facedownCardsList.length; i++) {
                if (!this.facedownCardsList[i].classList.contains('added')) {
                    this.facedownCardsList[i].src = 'blank.png';
                }
            }
        }

    }
    resetFaceDownCards() {
        for (let i = 0; i < this.facedownCardsList.length; i++) {
            this.facedownCardsList[i].src = 'facedown.png';
        }
    }
}
class Dealer {
    dealAll(playerOne, playerTwo, playerThree, playerFour, deck) { //takes in Player objects and a Deck object
        const playerArray = [playerOne, playerTwo, playerThree, playerFour];
        while (deck.cardsLeft() > 0) {
            for (let i = 0; i < playerArray.length; i++) {
                playerArray[i].hand.addCard(deck.removeCard());
            }
        }
        //sort the bots cards
        playerTwo.hand.sortCards();
        playerThree.hand.sortCards();
        playerFour.hand.sortCards();
    }
}
class SelectedIndexes { //change this into an array and delete this part of the code
    constructor() {
        this.selectedIndexesList = new Array(); //array of Numbers that represent card indexes that have been selected
    }
    add(indexNumber) {
        this.selectedIndexesList.push(indexNumber);

    }
    remove(indexNumber) {
        let newIndexesList = new Array();
        for (let i = 0; i < this.selectedIndexesList.length; i++) {
            if (this.selectedIndexesList[i] === indexNumber) {
                continue;
            }
            newIndexesList.push(this.selectedIndexesList[i]);
        }
        this.selectedIndexesList = new Array();
        for (let i = 0; i < newIndexesList.length; i++) {
            this.selectedIndexesList.push(newIndexesList[i]);
        }
    }
    clear() {
        this.selectedIndexesList = new Array();
    }
}

const convertRankToNumber = function (rank) { //rank is a String
    let rankNumber = 0;
    switch (rank) {
        case 'jack':
            rankNumber = 11;
            break;
        case 'queen':
            rankNumber = 12;
            break;
        case 'king':
            rankNumber = 13;
            break;
        case 'ace':
            rankNumber = 14;
            break;
        case 'two':
            rankNumber = 15;
            break;
        default:
            rankNumber = Number(rank);
    }
    return rankNumber;
}



//controller (performs validation)
const checkRoundStart = function () { //checks all player's hand to see if it has already been dealt
    if (deck.cardsArray.length === 0) {
        return false;
    }
    return true;
}

const checkValidPlay = function (lastHandPlayedArr, currentHandPlayedArr) { //when player a hand in response to another hand being played
    let lastHandString = determinePlayingHandType(lastHandPlayedArr); //string
    let currentHandString = determinePlayingHandType(currentHandPlayedArr); //string
    if (lastHandPlayedArr.length === 0) {
        return true;
    }
    if (checkIfTwoHandsAreSame(lastHandPlayedArr, playerPreviousHandArray)) {
        resetPassesForAllPlayers(botListArray);
        return true;
    }
    if (lastHandString !== currentHandString) {
        //check if the last hand is a 2 and current hand is a chopper
        if (lastHandString === 'single' && lastHandPlayedArr[0].rank === 'two' && currentHandString === 'chopper combo' || currentHandString === 'fourOfKind') {
            return true;
        } else if (lastHandString === 'chopper combo' && currentHandString === 'fourOfKind') {
            return true;
        }
        return false;
    }
    if (lastHandPlayedArr.length !== currentHandPlayedArr.length) {
        return false;
    }
    if (lastHandPlayedArr[lastHandPlayedArr.length - 1].value > currentHandPlayedArr[currentHandPlayedArr.length - 1].value) {
        return false;
    }
    return true;
}

const checkIfTwoHandsAreSame = function (firstHandArr, secondHandArr) { //self explanatory
    if (firstHandArr.length === secondHandArr.length && determinePlayingHandType(firstHandArr) === determinePlayingHandType(secondHandArr) && firstHandArr[firstHandArr.length - 1].value === secondHandArr[secondHandArr.length - 1].value) {
        return true;
    }
    return false;
}

const canSort = function () { //check player's hand to see if player has 13 cards and to see if cards are already sorted before allowing sorting
    if (playerOne.hand.cardsArray.length === 0 || alreadySorted) {
        return false;
    }
    return true;
}

const canPlay = function (playingHandArray) { //check if player's playing hand is valid
    if (!playerOne.firstPlay) {
        sortPlayingHandArray();
        let play = determinePlayingHandType(playingHandArray);
        if (playingHandArray.length > 0 && play !== 'invalid') {
            return true;
        }
        return false;

    } else {
        if (determinePlayingHandType(playingHandArray) === 'single' && playingHandArray[0].value === 1) {
            playerOne.firstPlay = false;
            return true;
        }
        return false;
    }

}

//DOM manipulation (view)
const deal = function () {
    if (checkRoundStart()) {
        dealer.dealAll(playerOne, evy, rinzler, lyle, deck);
        roundStart = false;
        renderCardDeal();
        let botPlayersElementList = document.querySelectorAll('.Bot');
        if (gameRound === 1) {
            let index = findPlayerWithThreeOfSpades(playerListArray);
            playRound(index, botPlayersElementList, botListArray, firstPlay);
        } else {
            firstPlay = false;
            let winnerPlayerName = finishedPlayersList[0].name;
            let index = -1;
            for (let i = 0; i < playerListArray.length; i++) {
                if (playerListArray[i].name === winnerPlayerName) {
                    index = i;
                    break;

                }
            }
            finishedPlayersList = [];
            playRound(index, botPlayersElementList, botListArray, firstPlay);

        }

    } else {
        alert('Cards have already been dealt. Please wait until a new game.');
    }
}

const sort = async function () { //sorts player's cards in ascending order
    if (canSort()) {
        playerOne.hand.sortCards();
        clearCards();
        await new Promise(resolve => setTimeout(resolve, 3000));
        renderCardDeal();
        alreadySorted = true;
    } else {
        alert('You either already sorted your cards or cards have not been dealt yet.');
    }
}

const pause = async function () {
    await new Promise(resolve => setTimeout(resolve, 5000)); //pause thread for 5000 milliseconds
}
const resetPlayerCards = function () {
    for (let i = 0; i < playerCards.length; i++) {
        playerCards[i].src = 'blank.png';
    }
}

const newGameFunction = function () {
    if (playerOne.canClickNew) {
        gameOver = false;
        gameRound++;
        playerCardsRemoveEventListener(renderIndexesEventListenerList);
        resetPlayerCards();
        resetUsedCards();
        playerCards = document.querySelectorAll('.playerCards');
        deck.repopulateDeckAndString();
        cardsToCardImagesMap = new Map(); //map card objects to strings for rendering card images
        for (let i = 0; i < deck.cardsArray.length; i++) {
            cardsToCardImagesMap.set(deck.cardsArray[i], deck.stringArray[i]);
        }
        evyCards = document.querySelectorAll('.evyCards');
        for (let i = 0; i < evyCards.length; i++) {
            evyCards[i].classList.add('added');
        }
        rinzlerCards = document.querySelectorAll('.rinzlerCards');
        for (let i = 0; i < rinzlerCards.length; i++) {
            rinzlerCards[i].classList.add('added');
        }
        lyleCards = document.querySelectorAll('.lyleCards');
        for (let i = 0; i < lyleCards.length; i++) {
            lyleCards[i].classList.add('added');
        }
        playerOne.resetAllFields();
        evy.resetAllFields();
        rinzler.resetAllFields();
        lyle.resetAllFields();
        deck.shuffle();
        alreadySorted = false;
        evy.addFacedownCards(evyCards);
        evy.resetFaceDownCards();
        rinzler.addFacedownCards(rinzlerCards);
        rinzler.resetFaceDownCards();
        lyle.addFacedownCards(lyleCards);
        lyle.resetFaceDownCards();
        botListArray = [playerOne, evy, rinzler, lyle];
        playingHandArray.length = 0;
        renderIndexesEventListenerList = [0, 12];
        playerCardsIndexesToPlayerHandIndexMap = new Map();
        lastHandPlayedArray.length = 0;
        playerPreviousHandArray.length = 0;
        playerTurn = false;
        for (let i = 0; i < 13; i++) {
            playerCardsIndexesToPlayerHandIndexMap.set(i, i);
        }
        selectedIndexesList = new SelectedIndexes(); //holds the indexes of the cards that have been selected
        eventListenersArray = []; //holds references to event listeners that have been added
        dealButton = document.querySelector('.deal');
        sortButton = document.querySelector('.sortCards');
        playButton = document.querySelector('.playCards');
        passButton = document.querySelector('.pass');
        usedCards = document.querySelectorAll('.usedCards');
        newButton = document.querySelector('.newGame');

        playerCardsAddEventListener(renderIndexesEventListenerList);


        //reset finished HTML elements
        for (let i = 0; i < finishedImgElements.length; i++) {
            finishedImgElements[i].src = 'blank.png';
            if (finishedImgElements[i].classList.contains('evy')) {
                finishedImgElements[i].classList.remove('evy');
            } else if (finishedImgElements[i].classList.contains('rinzler')) {
                finishedImgElements[i].classList.remove('rinzler');
            } else if (finishedImgElements[i].classList.contains('lyle')) {
                finishedImgElements[i].classList.remove('lyle');
            } else {
                finishedImgElements[i].classList.remove('player');
            }
        }

        rankToPicturesMap = new Map();
        rankToPicturesMap.set(1, finishedImgElements[0]);
        rankToPicturesMap.set(2, finishedImgElements[1]);
        rankToPicturesMap.set(3, finishedImgElements[2]);
        rankToPicturesMap.set(4, finishedImgElements[3]);

    } else {
        alert('You can only click new when the current game is finished.')
    }
}

const play = function (index) {
    if (canPlay(playingHandArray) && checkValidPlay(lastHandPlayedArray, playingHandArray) && playerTurn && !gameOver) {
        sortPlayingHandArray(); //sorts playing hand
        resetUsedCards(); //clears played card images from screen
        renderHand(); //renders new played card images onto screen
        renderRemoveSelectedPlayedCard(); //clears player's selected cards from hand/screen
        removePlayingCardsFromHand(playingHandArray, playerOne.hand); //removes played cards from player's hand
        clearPlayerCards(); //clears player hand card images from screen
        playerCardsRemoveEventListener(renderIndexesEventListenerList); //removes event listeners from corresponding playerCards img elements and from eventListenersArray array
        renderPlayerCards(); //updates the renderIndexesEventListener array and playerCardIndexesToPlayerHandIndexMap
        playerCardsAddEventListener(renderIndexesEventListenerList); //adds back the event listeners to the corresponding updated img elements
        lastHandPlayedArray = Array.from(playingHandArray);
        playerPreviousHandArray = Array.from(playingHandArray);
        playingHandArray.length = 0;
        playerOne.played = true;
        playerTurn = false;
    } else {
        alert('You cannot play that hand.');
    }

}
const pass = function () { //pass player's turn
    if (!playerOne.firstPlay && playerTurn && !checkRoundStart() && !checkIfTwoHandsAreSame(lastHandPlayedArray, playerPreviousHandArray)) {
        playerOne.played = true;
        playerOne.pass = true;
        playerPreviousHandArray = [];

    } else {
        alert('You cannot pass because it is either not your turn, the cards have not been dealt, it is your turn to go anything hand you like, or you have the 3 of spades.');
    }
}
const removePlayingCardsFromHand = function (playingCardsArray, hand) {
    for (let i = 0; i < playingCardsArray.length; i++) {
        hand.removeCard(playingCardsArray[i]);
    }

}

const determinePlayingHandType = function (playingHandArray) { //returns a string
    let type = '';
    if (playingHandArray.length === 1) {
        type = 'single';
        return type;
    } else if (playingHandArray.length === 2 && playingHandArray[0].rank === playingHandArray[1].rank) {
        type = 'double';
        return type;
    } else if (playingHandArray.length === 3 && playingHandArray[0].rank === playingHandArray[1].rank && playingHandArray[1].rank === playingHandArray[2].rank) {
        type = 'triple';
        return type;
    } else if (playingHandArray.length === 4 && playingHandArray[0].rank === playingHandArray[1].rank && playingHandArray[1].rank === playingHandArray[2].rank && playingHandArray[2].rank === playingHandArray[3].rank) {
        type = 'fourOfKind';
        return type;
    }
    //check for combo 
    if (type === '' && playingHandArray.length > 2) {
        let isCombo = true;
        for (let i = 0; i < playingHandArray.length - 1; i++) {
            let firstElementRank = convertRankToNumber(playingHandArray[i].rank);
            let secondElementRank = convertRankToNumber(playingHandArray[i + 1].rank);

            if (firstElementRank + 1 !== secondElementRank || playingHandArray[i].rank === 'two' || playingHandArray[i + 1].rank === 'two') {
                isCombo = false;
                break;
            }
        }

        if (isCombo) {
            type = 'combo';
            return type;
        }
    }
    //check for chopper combo
    if (type === '' && playingHandArray.length > 4 && playingHandArray.length % 2 === 0) {
        let isChopperCombo = true;
        for (let i = 0; i <= playingHandArray.length - 2; i += 2) {
            let firstElementRank = convertRankToNumber(playingHandArray[i].rank);
            let secondElementRank = convertRankToNumber(playingHandArray[i + 1].rank);
            let thirdElementRank = 0;
            if (i !== playingHandArray.length - 2) {
                thirdElementRank = convertRankToNumber(playingHandArray[i + 2].rank);
            }

            if (playingHandArray[i].rank === 'two' || playingHandArray[i + 1].rank === 'two' || thirdElementRank === 15) {
                isChopperCombo = false;
                break;
            }

            if (i === playingHandArray.length - 2) {
                if (firstElementRank !== secondElementRank) {
                    isChopperCombo = false;
                }
                break;
            }
            if (firstElementRank + 1 !== thirdElementRank || firstElementRank !== secondElementRank) {
                isChopperCombo = false;
                break;
            }
        }
        if (isChopperCombo) {
            type = 'chopper combo';
            return type;
        }
    }
    //check if invalid 
    if (type === '') {
        type = 'invalid';
        return type;
    }
}

const resetUsedCards = function () {
    for (let i = 0; i < usedCards.length; i++) {
        usedCards[i].src = 'blank.png';
    }
}
const selectCard = function (index) {
    if (!playerCards[index].classList.contains('selected')) {
        playingHandArray.push(playerOne.hand.cardsArray[playerCardsIndexesToPlayerHandIndexMap.get(index)]);
        renderYellowHighLight(index);
        selectedIndexesList.selectedIndexesList.push(index);
    } else {
        removeFromPlayingHandArray(playerOne.hand.cardsArray[playerCardsIndexesToPlayerHandIndexMap.get(index)]);
        removeYellowHighLight(index);
        selectedIndexesList.remove(index);
    }

}
const removeFromPlayingHandArray = function (card) {
    let tempArray = [];
    for (let i = 0; i < playingHandArray.length; i++) {
        if (playingHandArray[i] === card) {
            continue;
        }
        tempArray.push(playingHandArray[i]);
    }
    playingHandArray = [];
    for (let i = 0; i < tempArray.length; i++) {
        playingHandArray.push(tempArray[i]);
    }

}

const resetPassesForAllPlayers = function (playerListArr) {
    for (let i = 0; i < playerListArr.length; i++) {
        if (playerListArr[i].pass === true) {
            playerListArr[i].pass = false;
        }
    }

}

const sortPlayingHandArray = function () {
    playingHandArray.sort((cardOne, cardTwo) => cardOne.value - cardTwo.value);
}


const renderHand = function () { //render played cards on the middle of the screen
    renderCardsEvenly(usedCards, playingHandArray);
}

const renderBotHand = function () {
    resetUsedCards();
    renderCardsEvenly(usedCards, lastHandPlayedArray);
}

const renderCardsEvenly = function (cardsArray, handArray) {
    let cardCount = cardsArray.length - handArray.length;
    let index = 0;
    while (true) {
        if (index === cardCount || index > cardCount) {
            break;
        }
        index++;
        cardCount--;
    }
    for (let i = index; i < index + handArray.length; i++) {
        cardsArray[i].src = cardsToCardImagesMap.get(handArray[i - index]) + '.png';
    }
    let lastIndex = (index + handArray.length) - 1;
    return [index, lastIndex];


}

const renderYellowHighLight = function (index) { //puts a yellow border around selected card
    if (!playerCards[index].classList.contains('selected')) {
        playerCards[index].classList.add('selected');
    }
}
const removeYellowHighLight = function (index) { //removes yellow border around selected card
    if (playerCards[index].classList.contains('selected')) {
        playerCards[index].classList.remove('selected');
    }
}


const renderCardDeal = async function () { //render player's card images on the screen
    for (let i = 0; i < playerOne.hand.cardsArray.length; i++) {
        playerCards[i].src = cardsToCardImagesMap.get(playerOne.hand.cardsArray[i]) + '.png';
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

const clearPlayerCards = function () {
    for (let i = 0; i < playerCards.length; i++) {
        playerCards[i].src = 'blank.png';
    }
}

const renderPlayerCards = function () {
    renderIndexesEventListenerList = renderCardsEvenly(playerCards, playerOne.hand.cardsArray);
    let tempMap = new Map();
    let count = 0;
    for (let i = renderIndexesEventListenerList[0]; i <= renderIndexesEventListenerList[1]; i++) {
        tempMap.set(i, count);
        count++;
    }
    playerCardsIndexesToPlayerHandIndexMap = new Map([...tempMap]); //update playerCardsIndexesToPlayerHandIndexMap

}

const clearCards = async function () { //clear card images on the screen
    for (let i = 0; i < playerCards.length; i++) {
        playerCards[i].src = 'blank.png';
        await new Promise(resolve => setTimeout(resolve, 200)); //pause thread for 200 milliseconds

    }
}
const renderRemoveSelectedPlayedCard = function () { //removes played cards and yellow highlightsfrom the screen
    for (let i = 0; i < selectedIndexesList.selectedIndexesList.length; i++) {
        playerCards[selectedIndexesList.selectedIndexesList[i]].src = 'blank.png';
        removeYellowHighLight(selectedIndexesList.selectedIndexesList[i]);
    }
    selectedIndexesList.selectedIndexesList.length = 0;


}

const waitForPlayerToPlay = function (player) { //pauses thread without blocking and waits until player plays a card
    return new Promise(resolve => {
        const intervalId = setInterval(() => {
            if (player.played) {
                clearInterval(intervalId);
                resolve();
                player.played = false;
            }
        }, 100);
    })
}

//game objects
let deck = new Deck();
let cardsToCardImagesMap = new Map(); //map card objects to strings for rendering card images
for (let i = 0; i < deck.cardsArray.length; i++) {
    cardsToCardImagesMap.set(deck.cardsArray[i], deck.stringArray[i]);
}
let evyCards = document.querySelectorAll('.evyCards');
for (let i = 0; i < evyCards.length; i++) {
    evyCards[i].classList.add('added');
}
let rinzlerCards = document.querySelectorAll('.rinzlerCards');
for (let i = 0; i < rinzlerCards.length; i++) {
    rinzlerCards[i].classList.add('added');
}
let lyleCards = document.querySelectorAll('.lyleCards');
for (let i = 0; i < lyleCards.length; i++) {
    lyleCards[i].classList.add('added');
}
deck.shuffle();
let alreadySorted = false;
let dealer = new Dealer();
let playerOne = new Player('human', 'player');
let evy = new Player('bot', 'evy');
evy.addFacedownCards(evyCards);

let rinzler = new Player('bot', 'rinzler');
rinzler.addFacedownCards(rinzlerCards);
let lyle = new Player('bot', 'lyle');
lyle.addFacedownCards(lyleCards);
let playerListArray = [playerOne, evy, rinzler, lyle];
let botListArray = [evy, rinzler, lyle];
let playingHandArray = [];
let renderIndexesEventListenerList = [0, 12];
let playerCardsIndexesToPlayerHandIndexMap = new Map();
let lastHandPlayedArray = [];
let playerPreviousHandArray = [];
let playerTurn = false;
let gameOver = false;
let gameRound = 1;
let firstPlay = true;

for (let i = 0; i < 13; i++) {
    playerCardsIndexesToPlayerHandIndexMap.set(i, i);
}
let selectedIndexesList = new SelectedIndexes(); //holds the indexes of the cards that have been selected
let eventListenersArray = []; //holds references to event listeners that have been added
let dealButton = document.querySelector('.deal');
let sortButton = document.querySelector('.sortCards');
let playButton = document.querySelector('.playCards');
let passButton = document.querySelector('.pass');
let playerCards = document.querySelectorAll('.playerCards');
let usedCards = document.querySelectorAll('.usedCards');
let newButton = document.querySelector('.newGame');
//event listeners for buttons
dealButton.addEventListener('click', deal);
sortButton.addEventListener('click', sort);
playButton.addEventListener('click', play);
passButton.addEventListener('click', pass);
newButton.addEventListener('click', newGameFunction);
//event listeners for card images
const playerCardsAddEventListener = function (array) {
    eventListenersArray = [];
    for (let i = array[0]; i <= array[1]; i++) {
        let tempEventListener = selectCard.bind(null, i);
        playerCards[i].addEventListener('click', tempEventListener);
        eventListenersArray.push(tempEventListener);
    }
}
const playerCardsRemoveEventListener = function (array) {
    for (let i = array[0]; i <= array[1]; i++) {
        playerCards[i].removeEventListener('click', eventListenersArray[0]);
        eventListenersArray.shift();
    }

}
playerCardsAddEventListener(renderIndexesEventListenerList);
const checkIfFinished = function (player) { //checks if player finished hand
    if (player.hand.cardsArray.length === 0) {
        return true;
    }
    return false;

}
const findPlayerWithThreeOfSpades = function (playerArray) { //returns index of player that has the lowest 3 (number)
    for (let i = 0; i < playerArray.length; i++) {
        for (let x = 0; x < playerArray[i].hand.cardsArray.length; x++) {
            if (playerArray[i].hand.cardsArray[x].value === 1) {
                if (playerArray[i].name === 'player') {
                    playerArray[i].firstPlay = true;
                }
                return i;
            }
        }

    }

}
let finishedPlayersList = [];
const finishedImgElements = document.querySelectorAll('.finished');
let rankToPicturesMap = new Map();
rankToPicturesMap.set(1, finishedImgElements[0]);
rankToPicturesMap.set(2, finishedImgElements[1]);
rankToPicturesMap.set(3, finishedImgElements[2]);
rankToPicturesMap.set(4, finishedImgElements[3]);
const playRound = async function (turn, botPlayersElementList, botListArray, firstPlay) {
    let botPlayerToElementListMap = new Map();
    if (botListArray.length > 3) {
        botListArray.shift();
    }
    for (let i = 0; i < botListArray.length; i++) {
        botPlayerToElementListMap.set(botListArray[i], botPlayersElementList[i]);
    }
    let previousPlayerElement = null;
    botListArray.unshift(playerOne);
    for (let i = turn; i < botListArray.length; i++) {
        if (botListArray[i].pass === true || botListArray[i].finished === true) { //skip player if player already passed in the current round
            if (botListArray[i].finished === true) {
                //if no other player could go then reset all passes to false
                if (checkIfTwoHandsAreSame(lastHandPlayedArray, botListArray[i].lastPlayedHandArray)) {
                    resetPassesForAllPlayers(botListArray);
                    lastHandPlayedArray = []; //reset the last hand so  the next player can play anything
                }
            }

            if (i === botListArray.length - 1) { //if its the last element, go back to beginning element
                i = -1;
            }
            continue;
        }
        if (botListArray[i].type === 'bot') {
            playerTurn = false;
            if (previousPlayerElement !== null) {
                previousPlayerElement.classList.remove('selectedPlayer');
            }
            botPlayerToElementListMap.get(botListArray[i]).classList.add('selectedPlayer');
            if (firstPlay) { //if its the first play, bot has to play a three of spades
                firstPlay = false;
                await new Promise(resolve => setTimeout(resolve, 1200));
                previousPlayerElement = botPlayerToElementListMap.get(botListArray[i]);
                lastHandPlayedArray = Array.from(botListArray[i].playThreeOfSpades());
                renderBotHand();
                botListArray[i].played = true;
                await waitForPlayerToPlay(botListArray[i]);
                await new Promise(resolve => setTimeout(resolve, 1200));
                if (i === botListArray.length - 1) { //reset the index to 0 so it doesnt end the loop
                    i = -1;
                }
                continue;
            }
            if (finishedPlayersList.length === 3) { //check if game is done
                playerOne.canClickNew = true;
                finishedPlayersList.push(botListArray[i]);
                rankToPicturesMap.get(finishedPlayersList.length).src = finishedPlayersList.length + '.png'; //render pic
                rankToPicturesMap.get(finishedPlayersList.length).classList.add(botListArray[i].name); //position pic
                botPlayerToElementListMap.get(botListArray[i]).classList.remove('selectedPlayer');
                gameOver = true;
                break;

            }
            await new Promise(resolve => setTimeout(resolve, 1200));
            previousPlayerElement = botPlayerToElementListMap.get(botListArray[i]);
            if (lastHandPlayedArray.length > 0) {
                if (checkIfTwoHandsAreSame(lastHandPlayedArray, botListArray[i].lastPlayedHandArray)) { //if everyone else passes
                    resetPassesForAllPlayers(botListArray); //reset pass to false becaues this is a new round
                    lastHandPlayedArray = Array.from(botListArray[i].playBestHandFreely()); //play anything
                    renderBotHand();
                    if (checkIfFinished(botListArray[i])) { //check if bot finished the hand
                        botListArray[i].finished = true;
                        finishedPlayersList.push(botListArray[i]);
                        rankToPicturesMap.get(finishedPlayersList.length).src = finishedPlayersList.length + '.png'; //render pic
                        rankToPicturesMap.get(finishedPlayersList.length).classList.add(botListArray[i].name); //position pic
                    }
                } else {
                    let move = botListArray[i].playBestHand(lastHandPlayedArray);
                    if (move.length > 0) {

                        lastHandPlayedArray = Array.from(move);
                        renderBotHand();
                        if (checkIfFinished(botListArray[i])) { //check if bot finished the hand
                            botListArray[i].finished = true;
                            finishedPlayersList.push(botListArray[i]);
                            rankToPicturesMap.get(finishedPlayersList.length).src = finishedPlayersList.length + '.png'; //render pic
                            rankToPicturesMap.get(finishedPlayersList.length).classList.add(botListArray[i].name); //position pic
                        }
                    } else {
                        botListArray[i].pass = true;
                    }
                }
            } else {
                lastHandPlayedArray = botListArray[i].playBestHandFreely();
                renderBotHand();
                if (checkIfFinished(botListArray[i])) { //check if bot finished the hand
                    botListArray[i].finished = true;
                    finishedPlayersList.push(botListArray[i]);
                    rankToPicturesMap.get(finishedPlayersList.length).src = finishedPlayersList.length + '.png'; //render pic
                    rankToPicturesMap.get(finishedPlayersList.length).classList.add(botListArray[i].name); //position pic
                }
            }
            botListArray[i].played = true;
            await waitForPlayerToPlay(botListArray[i]);
            await new Promise(resolve => setTimeout(resolve, 1200));
        } else {
            playerTurn = true;
            if (previousPlayerElement !== null) {
                previousPlayerElement.classList.remove('selectedPlayer');
            }
            if (finishedPlayersList.length === 3) { //check if game is done
                playerOne.canClickNew = true;
                finishedPlayersList.push(botListArray[i]);
                rankToPicturesMap.get(finishedPlayersList.length).src = finishedPlayersList.length + '.png'; //render pic
                rankToPicturesMap.get(finishedPlayersList.length).classList.add(botListArray[i].name); //position pic
                gameOver = true;
                break;

            }

            await waitForPlayerToPlay(botListArray[i]);
            firstPlay = false;
            if (checkIfFinished(botListArray[i])) { //check if bot finished the hand
                botListArray[i].finished = true;
                playerTurn = false;
                botListArray[i].lastPlayedHandArray = playerPreviousHandArray;
                finishedPlayersList.push(botListArray[i]);
                rankToPicturesMap.get(finishedPlayersList.length).src = finishedPlayersList.length + '.png'; //render pic
                rankToPicturesMap.get(finishedPlayersList.length).classList.add(botListArray[i].name); //position pic
            }


        }
        if (i === botListArray.length - 1) {
            i = -1;
        }


    }



}































