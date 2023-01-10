class PrivateRuleManager {

  FACES = [];
  SUITS = [];
  highestHands = [];
  highest = 0;
  lowest = 0;
  kicker = 0;

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
      userTempcards = pokerTable.users[i].PocketCards;

      //console.log("pokerTable collectivecards: ", pokerTable.collectiveCards);

      userTempcards.push(...pokerTable.collectiveCards);
      //console.log("userTempcards: ", userTempcards);
      let userData = {
        tempHands: userTempcards,
        cardResult: { handName: "", handValue: 0, shift: 0, high: 0, low: 0, kick: 0 },
      };
      playerHands.push(userData);

      // console.log("user hands: ", userData.tempHands); //DEBUG
    }

    for (let i = 0; i < playerHands.length; i++) {
      // console.log("temp hands: ", playerHands[i].tempHands);
      let result = this.AnalyzeHand(playerHands[i].tempHands);
      playerHands[i].cardResult = result;

      // console.log("cardresult: ", playerHands[i].cardResult);
    }


    //----------------------------------------------------
    //step one, go through all players and return an array containing the users with the highest hand value 0-10
    //----------------------------------------------------


    this.highestHands.push(playerHands[0]);

    for (let i = 0; i < playerHands.length; i++) {
      for (let j = 0; j < this.highestHands.length; j++) {
        if (
          i == 0 &&
          playerHands[i].cardResult.handValue ==
          this.highestHands[j].cardResult.handValue
        ) {
          // console.log("replacing first straight");
          this.highestHands = [];
          this.highestHands.push(playerHands[i]);

          //console.log(this.highestHands.length);
        } else if (
          i != 0 &&
          playerHands[i].cardResult.handValue ==
          this.highestHands[j].cardResult.handValue
        ) {
          if (playerHands[i].tempHands != this.highestHands[j].tempHands) {
            //  console.log("adding straight");
            this.highestHands.push(playerHands[i]);
          }
          j++;
          //console.log(this.highestHands.length);
        } else if (
          playerHands[i].cardResult.handValue >
          this.highestHands[j].cardResult.handValue
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
    // console.log(" temphands: ", this.highestHands.length);
    console.log("PlayerHands: ", playerHands);
    console.log("-------------------------------------------------------------");
    console.log("Highest hand: ", this.highestHands);

    //console.log("highLowCounter: " + this.CountShifted(this.playerHands));

    this.FindHighestHand();
  };


  //----------------------------------------------------
  //step two, iterate new array and check if more than one user has same value card.
  //----------------------------------------------------
  FindHighestHand = () => {
    for (let i = 0; i < this.highestHands.length; i++) {


    }

  }



  //----------------------------------------------------
  // step 3 use shift to sort which user has the best cards.
  //----------------------------------------------------

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
    console.log("suits: " + suits);
    let ace = hand[0];
    let splittedAce = ace.split("");
    let indexNumber = suits.findIndex((element) => element == splittedAce[1]);
    console.log("splitted index: ", indexNumber);
    console.log("splitted value: ", splittedAce[1]);
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
          console.log("we got a flush!");
          suitType = suitCounts[i][0];

          //console.log("suiteType: ", suitType);

          //console.log("SuitCountInFlushCalculator: ",suitCounts[i][0]);
          console.log("suitcounts: ", suitCounts);
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

        console.log("Resetting counter ", currentValue);
      }
      // let previousValue = shifted[i-1];
      if (nextValue == currentValue + 1) {
        counter++;

        console.log("Counting! ", currentValue);
      }
    }

    let highestStraight = false;
    if (shifted[6] == 12 && shifted[0] == 0 && counter >= 4) {
      highestStraight = true;
      //then straight
      console.log("highest Straight!");
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
      console.log("Acesuit type: ", aceSuiteType);
      console.log("suit type: ", suitType);
      console.log("original suits: ", this.SUITS);
      aceSuiteTypeLetter = this.SUITS[aceSuiteType];
      console.log(
        "-------------------------------This is the type of the ace",
        aceSuiteTypeLetter
      );
      if (this.SUITS[suitType] == aceSuiteTypeLetter) {
        sameAceTypeAsFlush = true;
        console.log("ace type is same as flush: ", sameAceTypeAsFlush);
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

    // finally, if index 0 has value 1 and  the distance is less than 5 straight is true.
    console.log("groups: ", groups);

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
    // console.log("groups: ", groups);

    console.log("shifted[0]: ", shifted[0]);
    console.log("shifted[1]: ", shifted[1]);
    console.log("shifted[2]: ", shifted[2]);
    console.log("shifted[3]: ", shifted[3]);
    console.log("shifted[4]: ", shifted[4]);
    console.log("shifted[5]: ", shifted[5]);
    console.log("shifted[6]: ", shifted[6]);
    console.log(
      "-----------------------------------------------------------------------------------"
    );

    //analysing hand, returns string with hand title
    let result =
      straight && flush && highestStraight && sameAceTypeAsFlush
        ? { handName: "Royal-straight-flush", handValue: 10, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker }
        : straight && flush && !sameAceTypeAsFlush && !isFlushOnly
          ? { handName: "straight-flush", handValue: 9, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker }
          : groups[0] === 4
            ? { handName: "four-of-a-kind", handValue: 8, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker }
            : groups[0] === 3 && groups[1] === 2
              ? { handName: "full-house", handValue: 7, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker }
              : flush && isFlushOnly
                ? { handName: "flush", handValue: 6, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker }
                : straight || highestStraight
                  ? { handName: "straight", handValue: 5, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker }
                  : groups[0] === 3
                    ? { handName: "three-of-a-kind", handValue: 4, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker }
                    : groups[0] === 2 && groups[1] === 2
                      ? { handName: "two-pair", handValue: 3, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker }
                      : groups[0] === 2
                        ? { handName: "one-pair", handValue: 2, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker }
                        : { handName: "high-card", handValue: 1, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker };

    // console.log(result);
    return result;

  };
  // //Counting groups in shifted to count instance of each 
  // CountShifted = () => {
  //   let count = { key: 0, value: 0 };
  //   for (const index of shifted) {
  //     count[index] = count[index] ? count[index] + 1 : 1;
  //   }
  //   return count;
  // }


  AddHighLowKick = (playerHand) => {
    if (shifted[0] == 0) {
      this.kicker = 0;
    }
    if (groups[0] == 2 && groups[1] < 2) {
      for (let i = 0; i < this.CountShifted.length; i++) {
        if (this.CountShifted[i] == 2) {
          highest =0;
       }

      }
      highest == 0;
    }
    if (groups[0] == 2 && groups[1] == 2) {

    }
  }






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


