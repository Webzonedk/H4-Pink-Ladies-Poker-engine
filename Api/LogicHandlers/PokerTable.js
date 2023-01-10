const User = require("../Models/User").User;
class PokerTable {
  CleaningLady = require("../LogicHandlers/CleaningLady").CleaningLady;

  users = [];
  bets = [];
  collectiveCards = [];
  cardDeck = [];
  dealer;
  smallBlind;
  bigBlind;
  currentBet;
  totalBet;
  totalPot;
  currentUser;
  round;

  constructor() {
    this.dealer = 0;
    this.smallBlind = 0;
    this.bigBlind = 0;
    this.currentBet = 0;
    this.totalBet = 0;
    this.totalPot = 0;
    this.currentUser;
    this.round = 0;
  }

  //add poker roles at beginning of hand
  AddRoles = () => {
    
    //generate random number to select dealer
    if (this.round < 1) {
      this.dealer = Math.floor(Math.random() * this.users.length);
    }
    else
    {
        this.dealer + 1;

        //reset dealer if index is larger than user array
        if(this.dealer >= this.users.length)
        {
            this.dealer = 0;
        }
    }

    //small blind is dealer + 1
    this.smallBlind = dealer +1;

    //big blind is dealer + 2
    this.bigBlind = dealer +2;

  };

  DealPocketCards = () => {};

  DealCards = () => {};

  UpdateUserState = (action, value) => {};

  //Set next user index
  SetCurrentUser = () => {
    this.currentUser++;
    if (this.currentUser >= this.users.length) {
      this.currentUser = 0;
    }
  };

  //check player saldo is above 0, else player is kicked from the pokertable
  VerifyOrKickPlayer = () => {
    for (let index = 0; index < this.users.length; index++) {
      //kick player
      if (this.users[index].saldo === 0) {
        this.CleaningLady.GetInstance().MoveUserToWaitingUsers(
          this.users[index].userID
        );
      }
    }
  };

  //user leaves the poker table & waits in the lobby
  LeavePokerTable = (currentUserID) => {
    this.CleaningLady.GetInstance().MoveUserToWaitingUsers(currentUserID);
  };
}

module.exports = { PokerTable: PokerTable };
