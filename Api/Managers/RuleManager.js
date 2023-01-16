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
      //console.log("pokertable: ", pokerTable);
    
    //console.log("pokerTable.users[i]",pokerTable.users[i]);
    //Adding playerhands to temp array
    for (let i = 0; i < pokerTable.users.length; i++) {
      console.log("pokerTable.users[i]",pokerTable.users[i].userID);
      let userTempcards = [];
      let userIDs=[];
      userTempcards = pokerTable.users[i].pocketCards;
      
      //console.log("pokerTable collectivecards: ", pokerTable.collectiveCards);
      
      userTempcards.push(...pokerTable.collectiveCards);
      //console.log("userTempcards: ", userTempcards);
      let userData = {
        tempHand: userTempcards,
        cardResult: { userID: pokerTable.users[i].userID ,handName:  "", handValue: 0, shift: [], high: 0, low: 0, kick: 0, shifts: [], counts: [], sortedFaces: [], sortedSuits: [], suitType: 0 },
      };
      playerHands.push(userData);

      // console.log("user hands: ", userData.tempHand); //DEBUG
    }

    //  console.log("playerHands.length: ", playerHands.length);
    for (let i = 0; i < playerHands.length; i++) {
      // console.log("temp hands: ", playerHands[i].tempHand);
      let result = this.AnalyzeHand(playerHands[i].tempHand, playerHands[i].cardResult.userID );
      playerHands[i].cardResult = result;

      //console.log("cardresult: ", playerHands[i].cardResult);
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

   return this.FindHighestHand(this.highestHands);
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
            //console.log("i: ", i);
            winnerHands.push(highestHands[i]);
            // console.log("winnerhands 1 length: ", winnerHands.length); //DEBUG
          }
          else if (highestHands[i].cardResult.shifts[0] == 0 && winnerHands[winnerHands.length - 1].cardResult.shifts[0] == 0) {
            winnerHands.push(highestHands[i]);
            // console.log("winnerhands 2 length: ", winnerHands.length); //DEBUG
          }
          else if (highestHands[i].cardResult.shifts[0] == 0 && winnerHands[winnerHands.length - 1].cardResult.shifts[0] != 0) {
            winnerHands = [];
            winnerHands.push(highestHands[i]);
            //console.log("winnerhands 3 length: ", winnerHands.length); //DEBUG
          }
          else {

            // console.log("highestHands: ", highestHands[i]);
            // console.log("winnerhands length: ", winnerHands.length);
            // console.log("winnerhands: ", winnerHands[winnerHands.length-1].cardResult);
            // console.log("winnerhands cardResult: ", winnerHands[winnerHands.length-1].cardResult);
            // console.log("winnerhands shifts: ", winnerHands[winnerHands.length-1].cardResult.shifts);
            // console.log("winnerhands shifts length: ", winnerHands[winnerHands.length-1].cardResult.shifts.length);

            for (let j = 0; j < highestHands[i].cardResult.shifts.length; j++) {

              console.log("counting: ", j);
              if (highestHands[i].cardResult.shifts[highestHands[i].cardResult.shifts.length - (j + 1)]
                > winnerHands[winnerHands.length - 1].cardResult.shifts.length - (j + 1)) {
                console.log("highestHands shifts: ", highestHands[i].cardResult.shifts);
                console.log("winnerhands shifts: ", winnerHands[winnerHands.length - 1].cardResult.shifts);
                winnerHands = [];
                winnerHands.push(highestHands[i]);
                j = highestHands[i].cardResult.shifts.length;
                //console.log("highest hand was higher than winnerhand: ");
              }
              else if (highestHands[i].cardResult.shifts[highestHands[i].cardResult.shifts.length - (j + 1)]
                == winnerHands[winnerHands.length - 1].cardResult.shifts.length - (j + 1)) {
                winnerHands.push(highestHands[i]);
                j = highestHands[i].cardResult.shifts.length;
                //console.log("winnerHands was equal: ");
              }
              // console.log("winnerHands shifts.length-j+1: ", winnerHands[j].shifts[winnerHands[i].shifts.length - (k + 1)]);
              // console.log("highestHands shifts.length-j+1: ", highestHands[i + 1].shifts[winnerHands[i].shifts.length - (k + 1)]);
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
            // console.log("highestHands: ", highestHands[i]);
            // console.log("winnerhands length: ", winnerHands.length);
            // console.log("winnerhands: ", winnerHands[winnerHands.length-1].cardResult);
            // console.log("winnerhands cardResult: ", winnerHands[winnerHands.length-1].cardResult);
            // console.log("winnerhands shifts: ", winnerHands[winnerHands.length-1].cardResult.shifts);
            // console.log("winnerhands shifts length: ", winnerHands[winnerHands.length-1].cardResult.shifts.length);
            for (let j = 0; j < winnerHands[winnerHands.length - 1].cardResult.shifts.length; j++) {
              if (winnerHands[winnerHands.length - 1].cardResult.counts[j] == 2) {
                winnerHandsHighestPair = winnerHands[winnerHands.length - 1].cardResult.shifts[j];
              }
            }
            for (let j = 0; j < highestHands[i].cardResult.shifts.length; j++) {
              if (highestHands[i].cardResult.counts[j] == 2) {
                highestHandsHighestPair = highestHands[i].cardResult.shifts[j];
              }
            }
            // console.log("winnerHandsHighestPair: ", winnerHandsHighestPair); //DEBUG
            // console.log("highestHandsHighestPair: ", highestHandsHighestPair); //DEBUG
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
            for (let j = 0; j < winnerHands[winnerHands.length - 1].cardResult.shifts.length; j++) {
              if (winnerHands[winnerHands.length - 1].cardResult.counts[j] == 2) {
                winnerHandsHighestPairs.push(winnerHands[winnerHands.length - 1].cardResult.shifts[j]);
              }
            }
            for (let j = 0; j < highestHands[i].cardResult.shifts.length; j++) {
              if (highestHands[i].cardResult.counts[j] == 2) {
                highestHandsHighestPairs.push(highestHands[i].cardResult.shifts[j]);
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
            for (let j = 0; j < winnerHands[winnerHands.length - 1].cardResult.shifts.length; j++) {
              if (winnerHands[winnerHands.length - 1].cardResult.counts[j] == 3) {
                winnerHandsHighestPair = winnerHands[winnerHands.length - 1].cardResult.shifts[j];
              }
            }
            for (let j = 0; j < highestHands[i].cardResult.shifts.length; j++) {
              if (highestHands[i].cardResult.counts[j] == 3) {
                highestHandsHighestPair = highestHands[i].cardResult.shifts[j];
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
          let highestHandShiftsArrays = [];
          let highestHandStraightKicker;
          let winnerHandShiftsArrays = [];
          let winnerHandStraightKicker;
          if (i == 0) {
            winnerHands.push(highestHands[i]);
          }
          else {


            //Checking highestHands for highest card in straight and afterwards
            // organizing the rest of the straight in an array to compare
            for (let j = 0; j < highestHands[i].cardResult.shifts.length; j++) {
              if (highestHandShiftsArrays.length == 0) {
                highestHandShiftsArrays.push(highestHands[i].cardResult.shifts[j]);
              }
              else if (highestHandShiftsArrays.length < 4
                && highestHands[i].cardResult.shifts[j]
                > highestHandShiftsArrays[highestHandShiftsArrays.length - 1] + 1) {
                highestHandShiftsArrays = [];
                highestHandShiftsArrays.push(highestHands[i].cardResult.shifts[j]);
              }
              else if (highestHands[i].cardResult.shifts[j]
                == highestHandShiftsArrays[highestHandShiftsArrays.length - 1] + 1) {
                highestHandShiftsArrays.push(highestHands[i].cardResult.shifts[j]);
              }
            }
            //Checking winnerhands for highest card in straight and afterwards
            // organizing the rest of the straight in an array to compare
            for (let j = 0; j < winnerHands[i].cardResult.shifts.length; j++) {
              if (winnerHandShiftsArrays.length == 0) {
                winnerHandShiftsArrays.push(winnerHands[i].cardResult.shifts[j]);
              }
              else if (winnerHandShiftsArrays.length < 4
                && winnerHands[i].cardResult.shifts[j]
                > winnerHandShiftsArrays[winnerHandShiftsArrays.length - 1] + 1) {
                winnerHandShiftsArrays = [];
                winnerHandShiftsArrays.push(winnerHands[i].cardResult.shifts[j]);
              }
              else if (winnerHands[i].cardResult.shifts[j]
                == winnerHandShiftsArrays[winnerHandShiftsArrays.length - 1] + 1) {
                winnerHandShiftsArrays.push(winnerHands[i].cardResult.shifts[j]);
              }
            }
            //Checking if highestHandShiftsArrays contains highest straihght
            if (highestHands[0] == 0 && highestHandShiftsArrays[highestHandShiftsArrays.length - 1] == 12) {
              highestHandStraightKicker = 13;
            }
            else {
              highestHandStraightKicker = highestHandShiftsArrays[highestHandShiftsArrays.length - 1];
            }

            //Checking if winnerHandShiftsArrays contains highest straihght
            if (winnerHands[0] == 0 && winnerHandShiftsArrays[winnerHandShiftsArrays.length - 1] == 12) {
              winnerHandStraightKicker = 13;
            }
            else {
              winnerHandStraightKicker = winnerHandShiftsArrays[winnerHandShiftsArrays.length - 1];
            }
            //Comparing the arrays to find the highest straight
            if (highestHandStraightKicker > winnerHandStraightKicker) {
              winnerHands = [];
              winnerHands.push(highestHands[i]);
            }
            else if (highestHandStraightKicker == winnerHandStraightKicker) {
              winnerHands.push(highestHands[i]);
            }
          }



          break;
        case 6: //flush
          if (i == 0) {
            winnerHands.push(highestHands[i]);
          }
          else {
            let highestHandsFlushFacesArray = [];
            let winnerHandsFlushFacesArray = [];
            let counting = 0;
            //Counting faces and adding them to array
            for (let j = 0; j < highestHands[i].cardResult.sortedFaces.length; j++) {
              if (highestHands[i].cardResult.sortedSuits[j]
                == highestHands[i].cardResult.suitType) {
                highestHandsFlushFacesArray.push(highestHands[i].cardResult.sortedFaces[j]);
              }
            }
            for (let j = 0; j < winnerHands[winnerHands.length - 1].cardResult.sortedFaces.length; j++) {
              if (winnerHands[winnerHands.length - 1].cardResult.sortedSuits[j]
                == winnerHands[winnerHands.length - 1].cardResult.suitType) {
                winnerHandsFlushFacesArray.push(winnerHands[winnerHands.length - 1].cardResult.sortedFaces[j]);
              }
            }
            // console.log("highestHands.cardResult.shifts: ", highestHands[i].cardResult.sortedFaces);
            // console.log("highestHandsFlushFacesArray: ", highestHandsFlushFacesArray);
            // console.log("winnerHandsFlushFacesArray: ", winnerHandsFlushFacesArray);


            // checking arrays if the highest hands has a higher or equal flush than current winnerhand,
            // and changing or adding more hands if nessesary.
            if (highestHandsFlushFacesArray[0] == 0 && winnerHandsFlushFacesArray[0] == 0) {
              for (let j = 0; j < winnerHandsFlushFacesArray.length; j++) {
                if (highestHandsFlushFacesArray[highestHandsFlushFacesArray.length - (1 + j)]
                  > winnerHandsFlushFacesArray[winnerHandsFlushFacesArray.length - (1 + j)]) {
                  winnerHands = [];
                  winnerHands.push(highestHands[i]);
                }
                else if (highestHandsFlushFacesArray[highestHandsFlushFacesArray.length - (1 + j)]
                  == winnerHandsFlushFacesArray[winnerHandsFlushFacesArray.length - (1 + j)]) {
                  counting++;
                  if (counting == 4) {
                    winnerHands.push(highestHands[i]);
                  }
                }
              }
            }
            else if (highestHandsFlushFacesArray[0] == 0 && winnerHandsFlushFacesArray[0] != 0) {
              winnerHands = [];
              winnerHands.push(highestHands[i]);
            }
            else {
              for (let j = 0; j < winnerHandsFlushFacesArray.length; j++) {
                if (highestHandsFlushFacesArray[highestHandsFlushFacesArray.length - (1 + j)]
                  > winnerHandsFlushFacesArray[winnerHandsFlushFacesArray.length - (1 + j)]) {
                  winnerHands = [];
                  winnerHands.push(highestHands[i]);
                }
                else if (highestHandsFlushFacesArray[highestHandsFlushFacesArray.length - (1 + j)]
                  == winnerHandsFlushFacesArray[winnerHandsFlushFacesArray.length - (1 + j)]) {
                  counting++;
                  if (counting == 5) {
                    winnerHands.push(highestHands[i]);
                  }
                }
              }
            }
          }

          break;
        case 7: //full-house
          if (i == 0) {
            winnerHands.push(highestHands[i]);
          }

          else {
            let winnerHandsHighestPairs = [];
            let winnerHandsLowThrees = [];
            let highestHandsHighestPairs = [];
            let highestHandsLowThrees = [];
            //finding the pair and triple in winnerHands
            for (let j = 0; j < winnerHands[winnerHands.length - 1].cardResult.shifts.length; j++) {
              if (winnerHands[winnerHands.length - 1].cardResult.counts[j] == 2) {
                winnerHandsHighestPairs.push(winnerHands[winnerHands.length - 1].cardResult.shifts[j]);
              }
            }
            for (let j = 0; j < winnerHands[winnerHands.length - 1].cardResult.shifts.length; j++) {
              if (winnerHands[winnerHands.length - 1].cardResult.counts[j] == 3) {
                winnerHandsLowThrees.push(winnerHands[winnerHands.length - 1].cardResult.shifts[j]);
              }
            }
            //finding the pair and triple in highestHands
            for (let j = 0; j < highestHands[i].cardResult.shifts.length; j++) {
              if (highestHands[i].cardResult.counts[j] == 2) {
                highestHandsHighestPairs.push(highestHands[i].cardResult.shifts[j]);
              }
            }
            for (let j = 0; j < highestHands[i].cardResult.shifts.length; j++) {
              if (highestHands[i].cardResult.counts[j] == 3) {
                highestHandsLowThrees.push(highestHands[i].cardResult.shifts[j]);
              }
            }
            //if ace as high pair
            if (highestHandsHighestPairs[0] == 0 && winnerHandsHighestPairs[0] != 0) {
              winnerHands = [];
              winnerHands.push(highestHands[i]);
            }
            //if aces both places? Check low three.
            else if (highestHandsHighestPairs[0] == 0 && winnerHandsHighestPairs[0] == 0) {
              if (highestHandsLowThrees[highestHandsLowThrees.length - 1] > winnerHandsLowThrees[winnerHandsLowThrees.length - 1]) {
                winnerHands = [];
                winnerHands.push(highestHands[i]);
              }
            }
            //if no aces in highpair?
            else if (highestHandsHighestPairs[highestHandsHighestPairs.length - 1] > winnerHandsHighestPairs[winnerHandsHighestPairs.length - 1]
              && winnerHandsHighestPairs[0] != 0) {
              winnerHands = [];
              winnerHands.push(highestHands[i]);
            }
            //if same high pair, check low
            else if (highestHandsHighestPairs[highestHandsHighestPairs.length - 1] == winnerHandsHighestPairs[winnerHandsHighestPairs.length - 1]
              && winnerHandsHighestPairs[0] != 0) {
              if (highestHandsLowThrees[highestHandsLowThrees.length - 1] > winnerHandsLowThrees[winnerHandsLowThrees.length - 1]) {
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
            let winnerHandsFour;
            let highestHandsFour;
            for (let j = 0; j < winnerHands[winnerHands.length - 1].cardResult.shifts.length; j++) {
              if (winnerHands[winnerHands.length - 1].cardResult.counts[j] == 4) {
                winnerHandsFour = winnerHands[winnerHands.length - 1].cardResult.shifts[j];
              }
            }
            for (let j = 0; j < highestHands[i].cardResult.shifts.length; j++) {
              if (highestHands[i].cardResult.counts[j] == 4) {
                highestHandsFour = highestHands[i].cardResult.shifts[j];
              }
            }
            //if highest card is higher than winnerCard or highestHand has pair of ace and winnercard doesnt have pair ace
            if ((highestHandsFour > winnerHandsFour || highestHandsFour == 0)
              && winnerHandsFour != 0) {
              winnerHands = [];
              winnerHands.push(highestHands[i]);
              //console.log("winnerHands was smaller: ");
            }
            //If highest hand is equal to winnerhands or both has aces
            else if ((highestHandsFour == 0 && winnerHandsFour == 0)
              || (highestHandsFour == winnerHandsFour)) {
              winnerHands.push(highestHands[i]);
              //console.log("winnerHands was equal: ");
            }
          }
          break;
        case 9: //straight flush
          let highestHandsFlushFacesArray = [];
          let winnerHandsFlushFacesArray = [];
          let highestHandsStrightFlushArray = [];
          let winnerHandsStraightFlushArray = [];
          let highestHandsStrightFlushKicker;
          let winnerHandsStraightFlushKicker;
          let counting = 0;
          if (i == 0) {
            winnerHands.push(highestHands[i]);
            console.log("i: ", i);
          }
          else {
            console.log("i: ", i);
            //Counting faces and adding them to array
            for (let j = 0; j < highestHands[i].cardResult.sortedFaces.length; j++) {
              if (highestHands[i].cardResult.sortedSuits[j]
                == highestHands[i].cardResult.suitType) {
                highestHandsFlushFacesArray.push(highestHands[i].cardResult.sortedFaces[j]);
              }
            }
            for (let j = 0; j < winnerHands[winnerHands.length - 1].cardResult.sortedFaces.length; j++) {
              if (winnerHands[winnerHands.length - 1].cardResult.sortedSuits[j]
                == winnerHands[winnerHands.length - 1].cardResult.suitType) {
                winnerHandsFlushFacesArray.push(winnerHands[winnerHands.length - 1].cardResult.sortedFaces[j]);
              }
            }
            console.log("highestHands[i].cardResult.sortedFaces: ", highestHands[i].cardResult.sortedFaces);
            console.log("highestHands[i].cardResult.sortedSuits: ", highestHands[i].cardResult.sortedSuits);
            console.log("highestHandsFlushFacesArray: ", highestHandsFlushFacesArray.length);
            console.log("winnerHandsFlushFacesArray: ", winnerHandsFlushFacesArray.length);

            //Checking highestHandsFlushFacesArray for highest card in straight and afterwards
            // organizing the rest of the straight in an array to compare
            for (let j = 0; j < highestHandsFlushFacesArray.length; j++) {
              if (highestHandsStrightFlushArray.length == 0) {
                highestHandsStrightFlushArray.push(highestHandsFlushFacesArray[j]);
              }
              else if (highestHandsStrightFlushArray.length < 4
                && highestHandsFlushFacesArray[j]
                > highestHandsStrightFlushArray[highestHandsStrightFlushArray.length - 1] + 1) {
                highestHandsStrightFlushArray = [];
                highestHandsStrightFlushArray.push(highestHandsFlushFacesArray[j]);
              }
              else if (highestHandsFlushFacesArray[j]
                == highestHandsStrightFlushArray[highestHandsStrightFlushArray.length - 1] + 1) {
                highestHandsStrightFlushArray.push(highestHandsFlushFacesArray[j]);
              }
            }

            //Checking winnerhands for highest card in straight and afterwards
            // organizing the rest of the straight in an array to compare
            for (let j = 0; j < winnerHandsFlushFacesArray.length; j++) {
              if (winnerHandsStraightFlushArray.length == 0) {
                winnerHandsStraightFlushArray.push(winnerHandsFlushFacesArray[j]);
              }
              else if (winnerHandsStraightFlushArray.length < 4
                && winnerHandsFlushFacesArray[j]
                > winnerHandsStraightFlushArray[winnerHandsStraightFlushArray.length - 1] + 1) {
                winnerHandsStraightFlushArray = [];
                winnerHandsStraightFlushArray.push(winnerHandsFlushFacesArray[j]);
              }
              else if (winnerHandsFlushFacesArray[j]
                == winnerHandsStraightFlushArray[winnerHandsStraightFlushArray.length - 1] + 1) {
                winnerHandsStraightFlushArray.push(winnerHandsFlushFacesArray[j]);
              }
            }
          }
          // console.log("highestHands[i].cardResult.sortedFaces: ", highestHands[i].cardResult.sortedFaces);
          // console.log("highestHandsFlushFacesArray: ", highestHandsFlushFacesArray);
          // console.log("winnerHandsFlushFacesArray: ", winnerHandsFlushFacesArray);
          console.log("highestHandsStrightFlushArray: ", highestHandsStrightFlushArray);
          console.log("winnerHandsStraightFlushArray: ", winnerHandsStraightFlushArray);
          console.log("highestHandsStrightFlushKicker: ", highestHandsStrightFlushKicker);
          console.log("winnerHandsStraightFlushKicker: ", winnerHandsStraightFlushKicker);

          //Checking if highestHandsStrightFlushArray contains highest straihght
          if (highestHands[0] == 0 && highestHandsStrightFlushArray[highestHandsStrightFlushArray.length - 1] == 12) {
            highestHandsStrightFlushKicker = 13;
          }
          else {
            highestHandsStrightFlushKicker = highestHandsStrightFlushArray[highestHandsStrightFlushArray.length - 1];
          }

          //Checking if winnerHandsStraightFlushArray contains highest straihght
          if (winnerHands[0] == 0 && winnerHandsStraightFlushArray[winnerHandsStraightFlushArray.length - 1] == 12) {
            winnerHandsStraightFlushKicker = 13;
          }
          else {
            winnerHandsStraightFlushKicker = winnerHandsStraightFlushArray[winnerHandsStraightFlushArray.length - 1];
          }
          //Comparing the arrays to find the highest straight
          if (highestHandsStrightFlushKicker > winnerHandsStraightFlushKicker) {
            winnerHands = [];
            winnerHands.push(highestHands[i]);
          }
          else if (highestHandsStrightFlushKicker == winnerHandsStraightFlushKicker) {
            winnerHands.push(highestHands[i]);
          }



          break;

        default://Royal stright flush
          winnerHands.push(highestHands[i]);
          break;
      }

    }


    console.log("all winnerHands: ", winnerHands);
    //console.log("all realWinnerHands: ", realWinnerHands);
    // console.log("winnerHands shifts: ", winnerHands[0].shifts);
    return winnerHands;
  }








//-------------------------------------------------------------------------------------
//This is the first analyzer, only to decide wich hands each player has. It will be compared afterwards in top of code
//-------------------------------------------------------------------------------------
  AnalyzeHand = (hand, userID) => {
    // console.log("Analyzing ------------------------------- Analyzing"); //DEBUG
    let faces = hand.map((card) => this.FACES.indexOf(card.slice(0, -1)));
    let suits = hand.map((card) => this.SUITS.indexOf(card.slice(-1)));
    // console.log("faces: ", faces);
     console.log("Suits: ", suits);



    //sort faces and suit to combined array
    let tempFaces = [];
    let tempSuits = [];
    let sortedFaces = [];
    let sortedSuits = [];

    for (let i = 0; i < faces.length; i++) {
      let tempFaceModulus = (faces[i] + 1) % 13
      tempFaces.push(tempFaceModulus);
      tempSuits.push(suits[i]);
    }
    for (let i = 0; i < 13; i++) {

      for (let j = 0; j < tempFaces.length; j++) {
        if (tempFaces[j] == i) {
          sortedFaces.push(tempFaces[j]);
          sortedSuits.push(tempSuits[j]);
        }
      }

    }

    console.log("sortedFaces: ", sortedFaces);
    console.log("sortedSuits: ", sortedSuits);
    
    
    //------------------------------------------------
    //straight flush calculator
    //------------------------------------------------
    let straightFlush = false;
    let sfArray = [];
    let Array0 = [];
    let Array1 = [];
    let Array2 = [];
    let Array3 = [];
    let sfCounter = 0;
    let lastCount;
    let sfSuit=0;

    for (let i = 0; i < sortedFaces.length; i++) {
       if (sortedSuits[i]==0) {
        Array0.push(sortedFaces[i]);
        if (Array0.length>=5) {
          sfSuit=Array0;
        }
      }
      else if(sortedSuits[i]==1){
        Array1.push(sortedFaces[i]);
        if (Array1.length>=5) {
          sfSuit=Array1;
        }
      }
      else if(sortedSuits[i]==2){
        Array2.push(sortedFaces[i]);
        if (Array2.length>=5) {
          sfSuit=Array2;
        }
      }
      else if(sortedSuits[i]==2){
        Array2.push(sortedFaces[i]);
        if (Array3.length>=5) {
          sfSuit=Array3;
        }
      }
    }
    console.log("sfSuit: ", sfSuit);

    for (let i = 0; i < sfSuit.length; i++) {
      if (i==0) {
        sfCounter++
        lastCount=sfSuit[i] //Just to remember last face
      }
      else if (sfSuit[i] == sfSuit[i - 1] + 1) {
        sfCounter++
        lastCount=sfSuit[i] //Just to remember last face
      }
      else if(sfSuit[i] != sfSuit[i - 1] + 1 && sfCounter <2){
        sfCounter=0;
        sfCounter++
      }
      
      console.log("sfCounter: ", sfCounter);
      console.log("lastCount: ", lastCount);
    }
    if (sfCounter >=5) {
      straightFlush=true;
    }
    
    // sfArray.push(sortedFaces[sortedFaces.length - 1]);
    // for (let i = 0; i < sortedFaces.length - 1; i++) {
    //   if (sortedFaces[i] == sortedFaces[i + 1] - 1 && sortedSuits[i] == sortedSuits[i + 1]) {
    //     sfCounter++
    //     lastCount=sortedFaces[i] //Just to remember last face
    //   }
    //   if(sortedFaces[i]==lastCount+1 && sortedSuits[i] == sortedSuits[i + 1]){
    //     sfCounter++
    //   }
    //   else if ((sortedFaces[i] != sortedFaces[i + 1] - 1 || sortedSuits[i] != sortedSuits[i + 1]) && sfCounter <= 2) {
    //     sfCounter = 0;
    //     sfCounter++
    //   }
    //   else if ((sortedFaces[i] != sortedFaces[i + 1] - 1 || sortedSuits[i] != sortedSuits[i + 1]) && sfCounter >= 2) {
    //     sfCounter = sfCounter;
    //   }
    //   if (sfCounter >= 5) {
    //     if (sortedFaces[sortedFaces.length - 1] == 12) {
    //       if (sortedFaces[0] != 0) {
    //         straightFlush = true;
    //       }
    //       else { straightFlush = false; }
    //     }
    //     else {
    //       straightFlush = true;

    //     }
        
    //     console.log("sfSuit: ", sfSuit);
    //     console.log("sfArray: ", sfArray);
    //   }

    // }
    console.log("straightFlush: ", straightFlush);





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

          console.log("suitType: ", suitType);

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
    //console.log("shifted flusher ", shiftedFlusher); //DEBUG


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
    let aceSuitTypeLetter;
    //check if Ace has same type as flush
    let sameAceTypeAsFlush = false;
    let aceSuitType;
    if (highestStraight) {
      aceSuitType = AceSplitter(this.SUITS);
      //  console.log("Acesuit type: ", aceSuitType);
      //  console.log("suit type: ", suitType);
      //  console.log("original suits: ", this.SUITS);
      aceSuitTypeLetter = this.SUITS[aceSuitType];
      // console.log("-------------------------------This is the type of the ace", aceSuitTypeLetter);
      if (this.SUITS[suitType] == aceSuitTypeLetter) {
        sameAceTypeAsFlush = true;
        console.log("ace type is same as flush: ", sameAceTypeAsFlush);
      }
    }

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




    //-------------------------------------------------
    //-------------------------------------------------

    //-------------------------------------------------
    //Anti Straight Flush calculator
    //-------------------------------------------------
    //console.log("counter: ", counter);
    let isFlushOnly = false;
    let possibleRoyalStraightFlush = false
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
        //  console.log("cardObject: ", cardObject); //DEBUG
          shallowCards.push(cardObject);
        }
        console.log("shallowCards: ", shallowCards); //DEBUG

        let tempArray = [];
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

        if (tempArray[tempArray.lenght - 1] == 12) {
          possibleRoyalStraightFlush = true;
        }
        console.log("TempArray: ascending order: ", tempArray); //DEBUG
        console.log("possibleRoyalStraightFlush: ", possibleRoyalStraightFlush); //DEBUG

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
        console.log("shallowCardsCounter: ", counter1); //DEBUG


        if ((counter1 == 4 && !sameAceTypeAsFlush) || counter1 < 4) {
          isFlushOnly = true;

        }
        console.log("isFlushOnly: ", isFlushOnly); //DEBUG
      }
    }



    //-------------------------------------------------
    //-------------------------------------------------


    //-------------------------------------------------
    //Logging
    //-------------------------------------------------


    //console.log("groups: ", groups);

    // console.log(
    //   "is it straight: ",
    //   straight +
    //   ", flush: " +
    //   flush +
    //   ", is ace same: " +
    //   sameAceTypeAsFlush +
    //   ", higest straight: " +
    //   highestStraight +
    //   ", isFlushOnly: " +
    //   isFlushOnly
    // );

    // console.log("shifted[0]: ", shifted[0]);
    // console.log("shifted[1]: ", shifted[1]);
    // console.log("shifted[2]: ", shifted[2]);
    // console.log("shifted[3]: ", shifted[3]);
    // console.log("shifted[4]: ", shifted[4]);
    // console.log("shifted[5]: ", shifted[5]);
    // console.log("shifted[6]: ", shifted[6]);
    // console.log( "-----------------------------------------------------------------------------------"
    //   //-------------------------------------------------
    //   //-------------------------------------------------
    // );

    //analysing hand, returns string with hand title
    let result =
      straight && flush && highestStraight && sameAceTypeAsFlush
        ? { userID: userID, handName: "Royal-straight-flush", handValue: 10, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts, sortedFaces: sortedFaces, sortedSuits: sortedSuits }
        : flush && straightFlush
          ? { userID: userID, handName: "straight-flush", handValue: 9, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts, sortedFaces: sortedFaces, sortedSuits: sortedSuits, suitType: suitType }
          : groups[0] === 4
            ? { userID: userID, handName: "four-of-a-kind", handValue: 8, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts, sortedFaces: sortedFaces, sortedSuits: sortedSuits }
            : groups[0] === 3 && groups[1] === 2
              ? { userID: userID, handName: "full-house", handValue: 7, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts, sortedFaces: sortedFaces, sortedSuits: sortedSuits }
              : flush
                ? { userID: userID, handName: "flush", handValue: 6, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts, sortedFaces: sortedFaces, sortedSuits: sortedSuits, suitType: suitType }
                : straight || highestStraight
                  ? { userID: userID, handName: "straight", handValue: 5, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts, sortedFaces: sortedFaces, sortedSuits: sortedSuits }
                  : groups[0] === 3
                    ? { userID: userID, handName: "three-of-a-kind", handValue: 4, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts, sortedFaces: sortedFaces, sortedSuits: sortedSuits }
                    : groups[0] === 2 && groups[1] === 2
                      ? { userID: userID, handName: "two-pair", handValue: 3, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts, sortedFaces: sortedFaces, sortedSuits: sortedSuits }
                      : groups[0] === 2
                        ? { userID: userID, handName: "one-pair", handValue: 2, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts, sortedFaces: sortedFaces, sortedSuits: sortedSuits }
                        : { userID: userID, handName: "high-card", handValue: 1, shift: shifted, high: this.highest, low: this.lowest, kick: this.kicker, shifts: this.shifts, counts: this.counts, sortedFaces: sortedFaces, sortedSuits: sortedSuits };

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
    console.log("Count Shifts: ", this.shifts); //DEBUG
    console.log("Count counts: ", this.counts); //DEBUG

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


