//imports
const User = require("../Models/User").User;
const PokerTable = require("../LogicHandlers/PokerTable").PokerTable;

class PrivateLobby {
  pokerTables = [];
  waitingUsers = [];
  higestID = 0;
  CreateUser = (userName) => {
    let currentUser = new User();
    currentUser.userID = this.higestID + 1;
    currentUser.saldo = 10000;
    currentUser.userName = userName;
    currentUser.bet = 0;
    currentUser.state = " ";

    //set higest ID
    this.higestID = currentUser.userID;

    //add user to poker table
    this.AddToPokerTable(currentUser);
  };

  AddToPokerTable = (user) => {
    if (this.pokerTables.length > 0) {
      //add user to first poker table with available seat
      for (let i = 0; i < this.pokerTables.length; i++) {
        if (this.pokerTables[i].users.length < 9) {
          user.tableID = i;
          this.pokerTables[i].users.push(user);
          this.pokerTables[i].waitingTimer = 5;
          return;
        }
      }

      //if  no available seats, create new poker table & add user to it
      this.CreatePokerTable(user);
      console.log("adding new poker table");
    } else {
      // console.log("user: ", user);
      this.CreatePokerTable(user);
    }
  };

  //create new pokertable
  CreatePokerTable = (user) => {
    //create user class
    let currentUser = user;
    let pokerTableID = this.pokerTables.length;
    currentUser.tableID = pokerTableID;
    let pokerTable = new PokerTable();
    pokerTable.users.push(currentUser);
    this.pokerTables.push(pokerTable);
    
    //run game
    pokerTable.RunGame();
  };
}

//exported pbulic singleton class
class Lobby {
  constructor() {
    throw new Error("Use Lobby.getInstance()");
  }
  static GetInstance() {
    if (!Lobby.instance) {
      Lobby.instance = new PrivateLobby();
    }
    return Lobby.instance;
  }
}

module.exports = { Lobby: Lobby };
