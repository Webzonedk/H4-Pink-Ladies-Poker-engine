class PrivateRuleManager {

  FACES = [];
  SUITS = [];
  highestHands = [];
  highest = 0;
  lowest = 0;
  kicker = 0;
  shifts = [];
  counts = [];

  constructor() {
    this.FACES = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "j",
      "q",
      "k",
      "a",
    ];
    this.SUITS = ["H", "D", "C", "S"];
  }

  CompareHands = (pokerTable) => {
    //temporary array of cards from
    let playerHands = [];
    //  console.log("pokertable: ", pokerTable);

    //Adding playerhands to temp array
    for (let i = 0; i < pokerTable.users.length; i++) {
      let userTempcards = [];
      userTempcards = pokerTable.users[i].pocketCards;

      //console.log("pokerTable collectivecards: ", pokerTable.collectiveCards);

      userTempcards.push(...pokerTable.collectiveCards);
      //console.log("userTempcards: ", userTempcards);
      let userData = {
        tempHand: userTempcards,
        cardResult: { handName: "", handValue: 0, shift: [], high: 0, low: 0, kick: 0, shifts: [], counts: [] },
      };
      playerHands.push(userData);

      // console.log("user hands: ", userData.tempHand); //DEBUG
    }

    for (let i = 0; i < playerHands.length; i++) {
      // console.log("temp hands: ", playerHands[i].tempHand);
      let result = this.AnalyzeHand(playerHands[i].tempHand);
      playerHands[i].cardResult = result;

      // console.log("cardresult: ", playerHands[i].cardResult);
    }


    //----------------------------------------------------
    //step one, go through all players and return an array containing the users with the highest hand value 0-10
    //----------------------------------------------------
    //adding the first hand to the array, as it will be the highest hand in the beginneng
    this.highestHands.push(playerHands[0]);

    for (let i = 0; i < playerHands.length; i++) {
      for (let j = 0; j < this.highestHands.length; j++) {
        if (
          i == 0 && playerHands[i].cardResult.handValue == this.highestHands[j].cardResult.handValue
        ) {
          // console.log("replacing first higestHand");
          this.highestHands = [];
          this.highestHands.push(playerHands[i]);

          //console.log(this.highestHands.length);
        } else if (i != 0 && playerHands[i].cardResult.handValue == this.highestHands[j].cardResult.handValue
        ) {
          if (playerHands[i].tempHand != this.highestHands[j].tempHand) {
            //  console.log("adding adding highest hand with same value");
            this.highestHands.push(playerHands[i]);
          }
          j++;
          //console.log(this.highestHands.length);
        } else if (
          playerHands[i].cardResult.handValue > this.highestHands[j].cardResult.handValue
        ) {
          //  console.log("this is larger: ", playerHands[i].cardResult.handValue);
          //  console.log("replacing");
          this.highestHands = [];
          this.highestHands.push(playerHands[i]);

          // console.log(this.highestHands.length);
        }
      }
    }

    // console.log("highest hands", this.highestHands);
    // console.log(" temphand: ", this.highestHands.length);


    //console.log("PlayerHands: ", playerHands);
    console.log("Highest hand: ", this.highestHands);
    console.log("-------------------------------------------------------------");

    //console.log("highLowCounter: " + this.CountShifted(this.playerHands));

    this.FindHighestHand(this.highestHands);
  };


  //----------------------------------------------------
  //step two, iterate new array and check if more than one user has same value card.
  // step 3 use shift to sort which user has the best cards.
  //----------------------------------------------------
  FindHighestHand = (highestHands) => {
    let winnerHands = [];
    let realWinnerHands = [];
    // let _highestHands = highestHands;
    for (let i = 0; i < highestHands.length; i++) {
      let shiftCount = this.CountShifted(highestHands[i].cardResult.shift);
      highestHands[i].cardResult.shifts = shiftCount[0]
      highestHands[i].cardResult.counts = shiftCount[1]

      // console.log("shift in FindHighestHand: ", shiftCount[0]); //DEBUG
      // console.log("Counts in FindHighestHand: ", shiftCount[1]); //DEBUG

      // console.log("highestHands shifts in FindHighestHand: ", highestHands[i].cardResult.shifts); //DEBUG
      // console.log("highestHands counts in FindHighestHand: ", highestHands[i].cardResult.counts); //DEBUG

      // console.log("highestHands shifts in FindHighestHand 0: ", highestHands[i].shifts[0]); //DEBUG
      // console.log("highestHands counts in FindHighestHand 0: ", highestHands[i].counts[0]); //DEBUG



      switch (highestHands[i].cardResult.handValue) {

        case 1: //Highest card
          if (i == 0) {
            winnerHands.push(highestHands[i]);
            console.log("winnerhands 1 length: ", winnerHands.length);
          }
          else if(highestHands[i].cardResult.shifts[0] == 0 && winnerHands.cardResult.shifts[0] == 0){
            winnerHands.push(highestHands[i]);
            console.log("winnerhands 2 length: ", winnerHands.length);
          }
          else if (highestHands[i].cardResult.shifts[0] == 0 && winnerHands.cardResult.shifts[0] != 0) {
            winnerHands = [];
            winnerHands.push(highestHands[i]);
            console.log("winnerhands 3 length: ", winnerHands.length);
          }
          else {
            for (let j = 0; j < winnerHands.length; j++) {
              console.log("highestHands: ", highestHands[i]);
              console.log("winnerhands length: ", winnerHands[j]);
              console.log("winnerhands: ", winnerHands[j].cardResult);
              console.log("winnerhands cardResult: ", winnerHands[j].cardResult);
              console.log("winnerhands shifts: ", winnerHands[j].cardResult.shifts);
              console.log("winnerhands shifts length: ", winnerHands[j].cardResult.shifts.length);

              for (let k = 0; k < highestHands[i].cardResult.shifts.length; k++) {

                console.log("counting: ", k);
                if (highestHands[i].cardResult.shifts[winnerHands[winnerHands.length-1].cardResult.shifts.length - (k + 1)]
                  > winnerHands[j].cardResult.shifts[winnerHands[winnerHands.length-1].cardResult.shifts.length - (k + 1)]) {
                  winnerHands = [];
                  winnerHands.push(highestHands[i + 1]);
                  k=highestHands[i].cardResult.shifts.length;
                  //console.log("highest hand was higher than winnerhand: ");
                }
                else if (highestHands[i].cardResult.shifts[highestHands[i].cardResult.shifts.length - (k + 1)]
                  == winnerHands[winnerHands.length-1].cardResult.shifts[winnerHands[winnerHands.length-1].cardResult.shifts.length - (k + 1)]) {
                  winnerHands.push(highestHands[i + 1]);
                  k=highestHands[i].cardResult.shifts.length;
                  //console.log("winnerHands was equal: ");
                }
                // console.log("winnerHands shifts.length-j+1: ", winnerHands[j].shifts[winnerHands[i].shifts.length - (k + 1)]);
                // console.log("highestHands shifts.length-j+1: ", highestHands[i + 1].shifts[winnerHands[i].shifts.length - (k + 1)]);
              }
            }
            // console.log("winnerHands length: ", winnerHands.length);
          }
          break;

        case 2: //one pair - Comparing witch pair is highest
          if (i == 0) {
            winnerHands.push(highestHands[i]);
          }
          // find pair ito compair in both highestHands and winnerHands
          else {
            let winnerHandsHighestPair;
            let highestHandsHighestPair;
            for (let j = 0; j < winnerHands[winnerHands.length - 1].shifts.length; j++) {
              if (winnerHands[winnerHands.length - 1].counts[winnerHands[j].counts.length - (j + 1)] == 2) {
                winnerHandsHighestPair = winnerHands[winnerHands.length - 1].shifts[winnerHands[j].shifts.length - (j + 1)]
              }
            }
            for (let j = 0; j < highestHands[i].shifts.length; j++) {
              if (highestHands[i].counts[highestHands[i].counts.length - (j + 1)] == 2) {
                highestHandsHighestPair = highestHands[i].shifts[highestHands[i].shifts.length - (j + 1)]
              }
            }
            //if highest card is higher than winnerCard or highestHand has pair of ace and winnercard doesnt have pair ace
            if ((highestHandsHighestPair > winnerHandsHighestPair || highestHandsHighestPair == 0)
              && winnerHandsHighestPair != 0) {
              winnerHands = [];
              winnerHands.push(highestHands[i]);
              //console.log("winnerHands was smaller: ");
            }
            //If highest hand is equal to winnerhands or both has aces
            else if ((highestHandsHighestPair == 0 && winnerHandsHighestPair == 0)
              || (highestHandsHighestPair == winnerHandsHighestPair)) {
              winnerHands.push(highestHands[i]);
              //console.log("winnerHands was equal: ");
            }
          }

          break;

        case 3: //two-pair
          if (i == 0) {
            winnerHands.push(highestHands[i]);
          }
          else {
            let winnerHandsHighestPairs = [];
            let highestHandsHighestPairs = [];
            for (let j = 0; j < winnerHands[winnerHands.length - 1].shifts.length; j++) {
              if (winnerHands[winnerHands.length - 1].counts[j] == 2) {
                winnerHandsHighestPairs.push(winnerHands[winnerHands.length - 1].shifts[j]);
              }
            }
            for (let j = 0; j < highestHands[i].shifts.length; j++) {
              if (highestHands[i].counts[j] == 2) {
                highestHandsHighestPairs.push(highestHands[i].shifts[j]);
              }
            }
            //if ace on hand
            if (highestHandsHighestPairs[0] == 0 && winnerHandsHighestPairs[0] != 0) {
              winnerHands = [];
              winnerHands.push(highestHands[i]);
            }
            //if aces both places
            else if (highestHandsHighestPairs[0] == 0 && winnerHandsHighestPairs[0] == 0) {
              if (highestHandsHighestPairs[1] > winnerHandsHighestPairs[1]) {
                winnerHands = [];
                winnerHands.push(highestHands[i]);
              }
              else if (highestHandsHighestPairs[1] == winnerHandsHighestPairs[1]) {
                winnerHands.push(highestHands[i]);
              }
            }
            //
            else if (highestHandsHighestPairs[1] > winnerHandsHighestPairs[1]
              && winnerHandsHighestPairs[0] != 0) {
              winnerHands = [];
              winnerHands.push(highestHands[i]);
            }
            else if (highestHandsHighestPairs[1] == winnerHandsHighestPairs[1]
              && winnerHandsHighestPairs[0] != 0) {
              if (highestHandsHighestPairs[0] > winnerHandsHighestPairs[0]) {
                winnerHands = [];
                winnerHands.push(highestHands[i]);
              }
              else if (highestHandsHighestPairs[0] == winnerHandsHighestPairs[0]) {
                winnerHands.push(highestHands[i]);
              }
            }
          }
          break;

        case 4: //three-of-a-kind
          if (i == 0) {
            winnerHands.push(highestHands[i]);
          }
          // find pair ito compair in both highestHands and winnerHands
          else {
            let winnerHandsHighestPair;
            let highestHandsHighestPair;
            for (let j = 0; j < winnerHands[winnerHands.length - 1].shifts.length; j++) {
              if (winnerHands[winnerHands.length - 1].counts[winnerHands[j].counts.length - (j + 1)] == 3) {
                winnerHandsHighestPair = winnerHands[winnerHands.length - 1].shifts[winnerHands[j].shifts.length - (j + 1)]
              }
            }
            for (let j = 0; j < highestHands[i].shifts.length; j++) {
              if (highestHands[i].counts[highestHands[i].counts.length - (j + 1)] == 3) {
                highestHandsHighestPair = highestHands[i].shifts[highestHands[i].shifts.length - (j + 1)]
              }
            }
            //if highest card is higher than winnerCard or highestHand has pair of ace and winnercard doesnt have pair ace
            if ((highestHandsHighestPair > winnerHandsHighestPair || highestHandsHighestPair == 0)
              && winnerHandsHighestPair != 0) {
              winnerHands = [];
              winnerHands.push(highestHands[i]);
              //console.log("winnerHands was smaller: ");
            }
            //If highest hand is equal to winnerhands or both has aces
            else if ((highestHandsHighestPair == 0 && winnerHandsHighestPair == 0)
              || (highestHandsHighestPair == winnerHandsHighestPair)) {
              winnerHands.push(highestHands[i]);
              //console.log("winnerHands was equal: ");
            }
          }
          break;
        case 5: //straight
          if (i == 0) {
            winnerHands.push(highestHands[i]);
          }
          // checking if ace high
          if (highestHands[i].shifts[0] == 0 && winnerHands[i].shifts[0] == 0) {
            for (let j = 0; j < highestHands[i].shifts.length; j++) {
              if (highestHands[i].shifts[highestHands[i].shifts.length - 1] = 12) {

              }
              winnerHands.push(highestHands[i]);
            }
          }
          break;
        case 6: //flush

          break;
        case 7: //full-house
          if (i == 0) {
            winnerHands.push(highestHands[i]);
          }

          else {
            let winnerHandsHighestPair;
            let winnerHandsLowThree;
            let highestHandsHighestPair;
            let highestHandsLowThree;
            //finding the pair and triple in winnerHands
            for (let j = 0; j < winnerHands[winnerHands.length - 1].shifts.length; j++) {
              if (winnerHands[winnerHands.length - 1].counts[j] == 2) {
                winnerHandsHighestPair = winnerHands[winnerHands.length - 1].shifts[j];
              }
            }
            for (let j = 0; j < winnerHands[winnerHands.length - 1].shifts.length; j++) {
              if (winnerHands[winnerHands.length - 1].counts[j] == 3) {
                winnerHandsLowThree = winnerHands[winnerHands.length - 1].shifts[j];
              }
            }
            //finding the pair and triple in highestHands
            for (let j = 0; j < highestHands[i].shifts.length; j++) {
              if (highestHands[i].counts[j] == 2) {
                highestHandsHighestPair = highestHands[i].shifts[j];
              }
            }
            for (let j = 0; j < highestHands[i].shifts.length; j++) {
              if (highestHands[i].counts[j] == 3) {
                highestHandsLowThree = highestHands[i].shifts[j];
              }
            }
            //if ace as high pair
            if (highestHandsHighestPair == 0 && winnerHandsHighestPair != 0) {
              winnerHands = [];
              winnerHands.push(highestHands[i]);
            }
            //if aces both places? Check low three.
            else if (highestHandsHighestPair == 0 && winnerHandsHighestPair == 0) {
              if (highestHandsLowThree > winnerHandsLowThree) {
                winnerHands = [];
                winnerHands.push(highestHands[i]);
              }
            }
            //if no aces in highpair?
            else if (highestHandsHighestPair > winnerHandsHighestPair
              && winnerHandsHighestPair != 0) {
              winnerHands = [];
              winnerHands.push(highestHands[i]);
            }
            //if same high pair, check low
            else if (highestHandsHighestPair == winnerHandsHighestPair
              && winnerHandsHighestPair != 0) {
              if (highestHandsLowThree > winnerHandsLowThree) {
                winnerHands = [];
                winnerHands.push(highestHands[i]);
              }
            }
          }
          break;
        case 8: //four-of-a-kind
          if (i == 0) {
            winnerHands.push(highestHands[i]);
          }
          // find pair ito compair in both highestHands and winnerHands
          else {
            let winnerHandsHighestPair;
            let highestHandsHighestPair;
            for (let j = 0; j < winnerHands[winnerHands.length - 1].shifts.length; j++) {
              if (winnerHands[winnerHands.length - 1].counts[winnerHands[j].counts.length - (j + 1)] == 4) {
                winnerHandsHighestPair = winnerHands[winnerHands.length - 1].shifts[winnerHands[j].shifts.length - (j + 1)]
              }
            }
            for (let j = 0; j < highestHands[i].shifts.length; j++) {
              if (highestHands[i].counts[highestHands[i].counts.length - (j + 1)] == 4) {
                highestHandsHighestPair = highestHands[i].shifts[highestHands[i].shifts.length - (j + 1)]
              }
            }
            //if highest card is higher than winnerCard or highestHand has pair of ace and winnercard doesnt have pair ace
            if ((highestHandsHighestPair > winnerHandsHighestPair || highestHandsHighestPair == 0)
              && winnerHandsHighestPair != 0) {
              winnerHands = [];
              winnerHands.push(highestHands[i]);
              //console.log("winnerHands was smaller: ");
            }
            //If highest hand is equal to winnerhands or both has aces
            else if ((highestHandsHighestPair == 0 && winnerHandsHighestPair == 0)
              || (highestHandsHighestPair == winnerHandsHighestPair)) {
              winnerHands.push(highestHands[i]);
              //console.log("winnerHands was equal: ");
            }
          }
          break;
        case 9: //stright flush

          break;
        default://Royal stright flush
          winnerHands.push(highestHands[i]);
          break;
      }

    }



    //Comparing highest hands in winner hands where kicker is 1 card
    realWinnerHands = [...winnerHands]
    for (let i = 1; i < winnerHands.length; i++) {
      for (let j = 0; j < array.length; j++) {
        if (winnerHands[i].counts[j] = 1) {
          if (i == 0) {
            realWinnerHands.push(winnerHands[i]);
          }
          else if (winnerHands[i].shifts[0] == 0 && realWinnerHands[realWinnerHands.length - 1].shifts[0] != 0) {
            realWinnerHands = [];
            realWinnerHands.push(winnerHands[i]);
          }



        }

      }
      if (winnerHands[i].shifts[0] == 0 && realWinnerHands[realWinnerHands.length - 1].shifts[0] == 0) {

        for (let j = 0; j < winnerHands[i].shifts.length; j++) {
          if (winnerHands[i].shifts[winnerHands[i].shifts.length - (j + 1)]
            > realWinnerHands[realWinnerHands.length - 1].shifts[winnerHands[i].shifts.length - (j + 1)]) {
            realWinnerHands = [];
            realWinnerHands.push(winnerHands[i]);
            j = winnerHands[i].shifts.length;
          }
          else if (winnerHands[i].shifts[winnerHands[i].shifts.length - (j + 1)]
            == realWinnerHands[realWinnerHands.length - 1].shifts[winnerHands[i].shifts.length - (j + 1)]) {
            realWinnerHands.push(winnerHands[i]);
            j = winnerHands[i].shifts.length;
          }
        }
      }
    }
    console.log("all winnerHands: ", winnerHands);
    //console.log("all realWinnerHands: ", realWinnerHands);
    // console.log("winnerHands shifts: ", winnerHands[0].shifts);
  }








  //----------------------------------------------------
  //step 4 return the users with the highest card value and highest shift.
  //----------------------------------------------------

  AnalyzeHand = (hand) => {
    console.log("Analyzing ------------------------------- Analyzing");
    let faces = hand.map((card) => this.FACES.indexOf(card.slice(0, -1)));
    let suits = hand.map((card) => this.SUITS.indexOf(card.slice(-1)));

    //-------------------------------------------------
    //Method to check if first card is an ace
    //-------------------------------------------------
    function AceSplitter(suits) {
      // console.log("suits: " + suits);
      let ace = hand[0];
      let splittedAce = ace.split("");
      let indexNumber = suits.findIndex((element) => element == splittedAce[1]);
      // console.log("splitted index: ", indexNumber);
      // console.log("splitted value: ", splittedAce[1]);
      return indexNumber;
    };
    //-------------------------------------------------
    //-------------------------------------------------




    //------------------------------------------------
    //Flush Calculator
    //------------------------------------------------
    let suitType;
    let suitCounts;
    let flush = flushCalculator();
    function flushCalculator() {
      let uniqueSuits = [...new Set(suits)];
      suitCounts = uniqueSuits.map((suitValue) => [
        suitValue,
        suits.filter((suit) => suit === suitValue).length,
      ]);
      for (let i = 0; i < suitCounts.length; i++) {
        if (suitCounts[i][1] >= 5) {
          //console.log("we got a flush!");
          suitType = suitCounts[i][0];

          //console.log("suiteType: ", suitType);

          //console.log("SuitCountInFlushCalculator: ",suitCounts[i][0]);
          // console.log("suitcounts: ", suitCounts);
          return true;
        }
      }

      return false;
    }
    //------------------------------------------------
    //------------------------------------------------

    //Counting grouped cards of same faces. Creates a shallow copy of FACES array and grouping by value, from index 0
    let groups = this.FACES.map((face, i) => faces.filter((j) => i === j).length).sort(
      (x, y) => y - x
    );



    //calculating straight by first calculating the remainder of the value + 1 divided by 13.
    let shifted = faces.map((x) => (x + 1) % 13);
    let shiftedFlusher = faces.map((x) => (x + 1) % 13);
    // console.log("shifted flusher ", shiftedFlusher); //DEBUG


    //-------------------------------------------------
    //Straight calculator
    //-------------------------------------------------
    shifted.sort(function (a, b) {
      return a - b;
    });
    //console.log("ascending order: ", shifted);

    let counter = 0;
    for (let i = 0; i < shifted.length; i++) {
      let currentValue = shifted[i];
      let nextValue = shifted[i + 1];
      //console.log("current value ", currentValue);
      if (i + 1 == shifted.length) {
        nextValue = shifted[i] + 1;
      }
      //resetting counter if value is not following each other
      if (nextValue > currentValue + 1) {
        counter = 0;

        //console.log("Resetting counter ", currentValue); //DEBUG
      }
      if (nextValue == currentValue + 1) {
        counter++;

        //console.log("Counting! ", currentValue);
      }
    }

    let highestStraight = false;
    if (shifted[6] == 12 && shifted[0] == 0 && counter >= 4) {
      highestStraight = true;
      //then straight
      //console.log("highest Straight!");
      //console.log("counter: ", counter);
    }

    // let straight = groups[0] === 1 && distance < 5;
    let straight = false;
    straight = (groups[0] > 0 && counter >= 5) || (groups[0] > 0 && highestStraight);
    let aceSuiteTypeLetter;
    //check if Ace has same type as flush
    let sameAceTypeAsFlush = false;
    let aceSuiteType;
    if (highestStraight) {
      aceSuiteType = AceSplitter(this.SUITS);
      // console.log("Acesuit type: ", aceSuiteType);
      // console.log("suit type: ", suitType);
      // console.log("original suits: ", this.SUITS);
      aceSuiteTypeLetter = this.SUITS[aceSuiteType];
      // console.log("-------------------------------This is the type of the ace", aceSuiteTypeLetter);
      if (this.SUITS[suitType] == aceSuiteTypeLetter) {
        sameAceTypeAsFlush = true;
        // console.log("ace type is same as flush: ", sameAceTypeAsFlush);
      }
    }

    //-------------------------------------------------
    //-------------------------------------------------

    //-------------------------------------------------
    //Anti Straight Flush calculator
    //-------------------------------------------------
    let isFlushOnly = false;
    if (counter >= 4) {
      if (flush) {
        let flushSuit;
        for (let i = 0; i < suitCounts.length; i++) {
          if (suitCounts[i][1] >= 5) {
            flushSuit = suitCounts[i][0];
          }
        }

        let suitLetter = this.SUITS[flushSuit];
        // console.log("suitLetter: ", suitLetter); //DEBUG
        let shallowCards = [];
        for (let i = 0; i < hand.length; i++) {
          let card = hand[i].split("");

          let cardObject = {
            shifted: shiftedFlusher[i],
            cardSuit: card[card.length - 1],
          };
          shallowCards.push(cardObject);
        }

        tempArray = [];
        for (let index = 0; index < shallowCards.length; index++) {
          if (shallowCards[index].cardSuit == suitLetter) {
            tempArray.push(shallowCards[index].shifted);
          }
        }

        // console.log("temp array length: ", tempArray.length); //DEBUG
        // console.log("TempArray: before sorting: ", tempArray); //DEBUG

        //Sorting the array ascending
        tempArray.sort(function (a, b) {
          return a - b;
        });

        // console.log("TempArray: ascending order: ", tempArray); //DEBUG

        let counter1 = 0;
        for (let i = 0; i < tempArray.length; i++) {
          let currentValue = tempArray[i];
          let nextValue = tempArray[i + 1];

          if (i + 1 == tempArray.length) {
            nextValue = tempArray[i] + 1;
          }

          if (nextValue == currentValue + 1) {
            counter1++;
          }
        }
        // console.log("shallowCardsCounter: ", counter1); //DEBUG


        if ((counter1 == 4 && !sameAceTypeAsFlush) || counter1 < 4) {
          isFlushOnly = true;
        }
      }
    }



    //-------------------------------------------------
    //-------------------------------------------------


    //-------------------------------------------------
    //Logging
    //-------------------------------------------------


    //console.log("groups: ", groups);

    console.log(
      "is it straight: ",
      straight +
      ", flush: " +
      flush +
      ", is ace same: " +
      sameAceTypeAsFlush +
      ", higest straight: " +
      highestStraight +
      ", isFlushOnly: " +
      isFlushOnly
    );

    // console.log("shifted[0]: ", shifted[0]);
    // console.log("shifted[1]: ", shifted[1]);
    // console.log("shifted[2]: ", shifted[2]);
    // console.log("shifted[3]: ", shifted[3]);
    // console.log("shifted[4]: ", shifted[4]);
    // console.log("shifted[5]: ", shifted[5]);
    // console.log("shifted[6]: ", shifted[6]);
    console.log(
      "-----------------------------------------------------------------------------------"
      //-------------------------------------------------
      //-------------------------------------------------
    );

    //analysing hand, returns string with hand title
    let result =
      straight && flush && highestStraight && sameAceTypeAsFlush
        ? { handName: "Royal-straight-flush", handValue: 10, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts }
        : straight && flush && !sameAceTypeAsFlush && !isFlushOnly
          ? { handName: "straight-flush", handValue: 9, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts }
          : groups[0] === 4
            ? { handName: "four-of-a-kind", handValue: 8, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts }
            : groups[0] === 3 && groups[1] === 2
              ? { handName: "full-house", handValue: 7, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts }
              : flush && isFlushOnly
                ? { handName: "flush", handValue: 6, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts }
                : straight || highestStraight
                  ? { handName: "straight", handValue: 5, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts }
                  : groups[0] === 3
                    ? { handName: "three-of-a-kind", handValue: 4, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts }
                    : groups[0] === 2 && groups[1] === 2
                      ? { handName: "two-pair", handValue: 3, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts }
                      : groups[0] === 2
                        ? { handName: "one-pair", handValue: 2, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts }
                        : { handName: "high-card", handValue: 1, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts };

    // console.log("result: ",result);
    return result;

  };
  //Counting groups in shifted to count instance of each faces
  CountShifted = (shifted) => {
    this.shifts = [];
    this.counts = [];
    let previousIndex = 0;
    for (let index of shifted) {
      if (index !== previousIndex) {
        this.shifts.push(index);
        this.counts.push(1);
        previousIndex = index;
        // console.log("previousIndex: ",previousIndex); //DEBUG
        // console.log("index: ",index); //DEBUG
      }
      else {
        this.counts[this.counts.length - 1]++;
        previousIndex = index;
      }
    }
    // console.log("CountShifted Shifts: ", shifted); //DEBUG
    console.log("CountShifted-counts: ", this.shifts, this.counts); //DEBUG

    return [this.shifts, this.counts];//Fields
  }



  // //---------------------------------------------------------
  // //Notimplemented yet
  // AddHighLowKick = (playerHand) => {
  //   if (shifted[0] == 0) {
  //     this.kicker = 0;
  //   }
  //   if (groups[0] == 2 && groups[1] < 2) {
  //     for (let i = 0; i < this.CountShifted.length; i++) {
  //       if (this.CountShifted[i] == 2) {
  //         highest = 0;
  //       }

  //     }
  //     highest == 0;
  //   }
  //   if (groups[0] == 2 && groups[1] == 2) {

  //   }
  // }
  // //---------------------------------------------------------






}
class RuleManager {


  constructor() {
    throw new Error('Use RuleManager.getInstance()');
  }
  static GetInstance() {
    if (!RuleManager.instance) {
      RuleManager.instance = new PrivateRuleManager();
    }
    return RuleManager.instance;
  }


}



// for(hand of testHands) console.log(hand + ": " + analyzeHand(hand));

module.exports = { RuleManager };


