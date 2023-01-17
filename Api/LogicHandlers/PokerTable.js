const User = require("../Models/User").User;
class PokerTable {
  CleaningLady = require("../LogicHandlers/CleaningLady").CleaningLady;
  CardDeckManager = require("../Managers/CardDeckManager").CardDeckManager;
  Encryption = require("../LogicHandlers/Encryption").Encryption;
  RuleManager = require("../Managers/RuleManager").RuleManager;

  users = [];
  bets = [];
  collectiveCards = [];
  cardDeck = [];
  winners = [];
  dealer;
  smallBlind;
  bigBlind;
  currentBet;
  totalBet;
  totalPot;
  currentUser;
  round;
  waitingTimer;
  gameRunning;
  currentHandNumber;

  constructor() {
    this.dealer = 0;
    this.smallBlind = 0;
    this.bigBlind = 0;
    this.currentBet = 0;
    this.totalBet = 0;
    this.totalPot = 0;
    this.currentUser = 0;
    this.round = 0;
    this.waitingTimer = 10;
    this.gameRunning = true;
  }

  //run the entire game loop
  RunGame = () => {

    //send snapshot
    
    let snapshot = this.CreateSnapshot();
    this.Encryption.GetInstance().EncryptAES(snapshot);

    //observing how many users has attended, and reset timer when new user arrive
    if (this.waitingTimer > 0) {
      //evaluate if enough players is present to start the game
      let aboveOne = false;
      let checkUserTimer = setInterval(() => {
        if (this.users.length >= 2) {
          aboveOne = true;
        } else {
          aboveOne = false;
        }

        //stop checkUserTimer when countdown is zero
        if (this.waitingTimer <= 0) {
          console.log("kill");
          this.ClearCurrentInterval(checkUserTimer);
        }
      }, 100 / 15);

      //count down if players are above 1 & this is the game loop
      let CountdownTimer = setInterval(() => {
        if (aboveOne) {
          this.waitingTimer -= 1;
          console.log(this.waitingTimer);

          //start the game when countdown timer is zero
          if (this.waitingTimer <= 0) {
            //this.waitingTimer = 10;
            this.ClearCurrentInterval(CountdownTimer);

            //create new card deck
            this.cardDeck = this.CardDeckManager.GetInstance().NewCardDeck();

            //add roles to users
            this.AddRoles();

            //deal pocket cards
            this.DealPocketCards();
            this.round++;

            //send snapshot
            let snapshot = this.CreateSnapshot();
            this.Encryption.GetInstance().EncryptAES(snapshot);

            //activate check for players that no longer is playable
            // let kickLoop = setInterval(() => {
            //   this.VerifyOrKickPlayer();

            //   //stop kickLoop when users are below 2
            //   if (this.users.length < 2) {
            //     this.ClearCurrentInterval(kickLoop);
            //   }
            // }, 1000);

            if (this.round > 0) {
              //check when every player has had their turn
              // let roundIsDone = false;
              let playerChecker = setInterval(() => {
                //stop loop if one player remains
                if (this.users.length < 2) {
                  this.ClearCurrentInterval(playerChecker);
                  this.round = 4;
                }
                console.log("checking users----------------------------------------------")
                for (let i = 0; i < this.users.length; i++) {
                  console.log("username: " + this.users[i].userName + " index: " + i + " action: " + this.users[i].state);

                }
                //check if all users are done with their turn
                if (!this.users.find((user) => user.state == " ")) {
                  console.log("all done!");

                  //deal cards for next round
                  this.DealCards();

                  //send snapshot
                  let snapshot = this.CreateSnapshot();
                  this.Encryption.GetInstance().EncryptAES(snapshot);

                  //reset users
                  for (let i = 0; i < this.users.length; i++) {
                    this.users[i].state = " ";
                    this.users[i].bet = 0;
                  }

                  //set total pot
                  this.totalPot += this.totalBet;
                  this.totalBet = 0;

                  //set next round
                  this.round++;
                  console.log("Ready for next round: ", this.round);
                }

                //console.log("are they done? ", roundIsDone);

                //stop the round and analyze the hands
                if (this.round > 3) {
                  this.ClearCurrentInterval(playerChecker);
                  console.log(
                    "-------------------------------------------------------------------------------------------------------------------------------"
                  );
                  console.log("ready to analyze");

                  //compare all hands
                  this.winners = [];
                  let snapshot = this.CreateSnapshot();
                  let filteredUsers = snapshot.users.filter(
                    (user) => user.pocketCards.length > 1
                  );
                  snapshot.users = filteredUsers;
                  //  console.log(snapshot);
                  this.winners =
                    this.RuleManager.GetInstance().CompareHands(snapshot);

                  //distribute totalPot
                  let fractionPot = this.totalPot / this.winners.length;
                  for (let i = 0; i < this.winners.length; i++) {
                    let index = this.users.findIndex(
                      (user) => user.userID == this.winners[i].cardResult.userID
                    );
                    this.users[index].saldo += fractionPot;
                    console.log(
                      `user: ${this.users[index].userName} won with: ${this.winners[i].cardResult.handName}`
                    );
                    console.log("Index of user: ", index);
                    //console.log("user: ", this.users[index]);
                    console.log(
                      "-------------------------------------------------------------------------------------------------------------------------------"
                    );
                  }

                  //kick players with zero saldo
                  this.VerifyOrKickPlayer();

                  //reset game and start new game
                  this.ResetGame();
                  // this.RunGame();
                  this.gameRunning = false;
                }
              }, 500);

              //change turn every 5 second
              let turnChanger = setInterval(() => {
                console.log("turner is still running async");
                //stop game if players are less than two
                if (this.users.length < 2) {
                  this.ClearCurrentInterval(turnChanger);
                }

                //create new game if current game is done
                if (!this.gameRunning) {
                  this.currentHandNumber++;
                  this.ClearCurrentInterval(turnChanger);
                  this.RunGame();
                }

                //allow this code if there are users on the poker table
                if (this.users.length > 0) {
                  //if round 1 bet from big blind & small blind
                  if (this.round == 1) {
                    if (this.smallBlind == this.currentUser) {
                      this.users[this.currentUser].state = "bet";
                      this.users[this.currentUser].bet = 25;
                    } else if (this.bigBlind == this.currentUser) {
                      this.users[this.currentUser].state = "bet";
                      this.users[this.currentUser].bet = 50;
                    }
                  }

                  //set user interaction
                  let action = this.users[this.currentUser].state;
                  switch (action) {
                    case " ":
                      this.users[this.currentUser].state = "fold";
                      break;
                    case "fold":
                      this.users[this.currentUser].pocketCards = [];
                      break;
                    case "check":
                      break;
                    case "bet":
                      this.CalculateBet();
                      break;
                    case "call":
                      this.CalculateBet();
                      break;
                    case "raise":
                      this.CalculateBet();
                      break;
                    default:
                      break;
                  }

                  //next turn
                  this.SetCurrentUser();

                  //send snapshot
                  let snapshot = this.CreateSnapshot();
                  this.Encryption.GetInstance().EncryptAES(snapshot);

                  //stop after this round
                  if (this.round > 3) {
                    console.log("no more rounds");
                    this.ClearCurrentInterval(turnChanger);
                  }
                }
              }, 500);
            }
          }
        }
      }, 1000); //ensuring 10 seconds countdown
    }
  };

  //reset game
  ResetGame = () => {
    this.smallBlind = 0;
    this.bigBlind = 0;
    this.currentBet = 0;
    this.totalBet = 0;
    this.totalPot = 0;
    this.currentUser = 0;
    this.round = 0;
    this.waitingTimer = 5;
    this.bets = [];
    this.collectiveCards = [];
    this.cardDeck = [];
    this.winners = [];

    for (let i = 0; i < this.users.length; i++) {
      this.users[i].state = " ";
      this.users[i].bet = 0;
    }
  };

  //local helper method for calculating betting
  CalculateBet = () => {
    let bet = this.users[this.currentUser].bet;
    this.totalBet += bet;
    this.users[this.currentUser].saldo -= bet;
    this.currentBet = bet;
  };

  //create snapshot of pokertable
  CreateSnapshot = () => {
    let snapshot = {
      users: this.users,
      bets: this.bets,
      collectiveCards: this.collectiveCards,
      cardDeck: this.cardDeck,
      winners: this.winners,
      dealer: this.dealer,
      smallBlind: this.smallBlind,
      bigBlind: this.bigBlind,
      currentBet: this.currentBet,
      totalbet: this.totalBet,
      totalPot: this.totalPot,
      currentUser: this.currentUser,
      round: this.round,
    };
    return snapshot;
  };

  //clear current interval
  ClearCurrentInterval = (timer) => {
    clearInterval(timer);
  };

  //add poker roles at beginning of hand
  AddRoles = () => {
    //generate random number to select dealer
    if (this.round < 1) {
      if (this.currentHandNumber < 1) {
        this.dealer = Math.floor(Math.random() * this.users.length);
      } else {
        if (this.dealer < this.users.length) {
          this.dealer++;
        } else {
          this.dealer = 0;
        }
      }
    } else {
      this.dealer++;

      //reset dealer if index is larger than user array
      if (this.dealer >= this.users.length) {
        this.dealer = 0;
      }
    }
    console.log(
      "adding roles"
    );
    //small blind is dealer + 1
    this.smallBlind = this.dealer + 1;
    if (this.smallBlind == this.users.length) {
      this.smallBlind = 0;
    }

    //big blind is dealer + 2
    this.bigBlind = this.dealer + 2;
    if (this.bigBlind >= this.users.length) {
      this.bigBlind = this.smallBlind + 1;

      if (this.bigBlind == this.users.length) {
        this.bigBlind = 0;
      }
      if (this.bigBlind > this.users.length) {
        this.bigBlind = 1;
      }
    }

    //if users length == users length then set current user ti zero
    this.currentUser = this.bigBlind + 1;
    if (this.currentUser >= this.users.length) {
      this.currentUser = 0;
    }

    //if currentUser >this.users.length then currentuser = (currentUser-(this.users.length+1))

    if (this.currentUser > this.users.length) {
      this.currentUser = this.currentUser - (this.users.length + 1);
    }
    console.log(
      "this.dealer:-------------------------------------------- ",
      this.dealer
    );
    console.log(
      "this.smallBlind:---------------------------------------- ",
      this.smallBlind
    );
    console.log(
      "this.bigBlind:------------------------------------------ ",
      this.bigBlind
    );
    console.log(
      "this.currentUser:--------------------------------------- ",
      this.currentUser
    );
  };

  DealPocketCards = () => {
    for (let i = 0; i < this.users.length; i++) {
      let cards = this.cardDeck.splice(0, 2);
      this.users[i].pocketCards = cards;
    }
  };

  DealCards = () => {
    //round 1 add 3 cards to collective
    if (this.round == 1) {
      this.collectiveCards = this.cardDeck.splice(0, 3);
    } else if (this.round > 1) {
      // round 2 & 3 add 1 card to collective
      let card = this.cardDeck.splice(0, 1);
      this.collectiveCards.push(card[0]);
    }
  };

  UpdateUserState = (id, action, value) => {
    let index = this.users.findIndex((user) => user.userID == id);
    this.users[index].state = action;
    this.users[index].bet = value;
  };

  //Set next user index
  SetCurrentUser = () => {
    this.currentUser++;

    if (this.currentUser >= this.users.length) {
      this.currentUser = 0;
    }

    // console.log(this.users[this.currentUser]);
    //check if current user has folded
    if (this.users[this.currentUser].state == "fold") {



      //find next user not folded
      for (let i = this.currentUser; i < this.users.length; i++) {

        if (i < this.users.length - 1) {
          if (this.users[i + 1].state != "fold") {
            this.currentUser = i;

            i = this.users.length;
          }
        }
        else {

          if (this.users[0].state != "fold") {
            this.currentUser = i;

            i = this.users.length;
          }
        }


      }
    }
  };

  //check player saldo is above 0, else player is kicked from the pokertable
  VerifyOrKickPlayer = () => {
    let playerKicked = false;
    for (let index = 0; index < this.users.length; index++) {
      //kick player if saldo is zero
      if (this.users[index].saldo === 0) {
        this.CleaningLady.GetInstance().MoveUserToWaitingUsers(
          this.users[index]
        );
        playerKicked = true;
      }
    }

    //send snapshot of game state to clients
    if (playerKicked) {
      let snapshot = this.CreateSnapshot();
      this.Encryption.GetInstance().EncryptAES(snapshot);
    }
  };

  //user leaves the poker table & waits in the lobby
  LeavePokerTable = (currentUserID) => {
    console.log("user id: ", currentUserID);
    console.log("users ", this.users);
    let user = this.users.find((user) => user.userID == currentUserID);
    console.log("found user: ", user);
    this.CleaningLady.GetInstance().MoveUserToWaitingUsers(user);
  };
}

module.exports = { PokerTable: PokerTable };
