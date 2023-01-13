//const PokerTable = require("./PokerTable").PokerTable;
class privateCleaningLady {

  lobby = require('../LogicHandlers/Lobby').Lobby;

  //move users to waiting list in lobby
  MoveUserToWaitingUsers = (currentUser) => {

    let index = this.lobby.GetInstance().pokerTables[currentUser.tableID].users.findIndex((user) => user.userID == currentUser.userID);
    let user = this.lobby.GetInstance().pokerTables[currentUser.tableID].users.splice(index, 1);
    //console.log(user);
    
    //insert user into lobby
    this.lobby.GetInstance().waitingUsers.push(user);

    //check if poker table has no users, then remove the table
    console.log("user length: ",this.lobby.GetInstance().pokerTables[currentUser.tableID].users.length)
    if(this.lobby.GetInstance().pokerTables[currentUser.tableID].users.length == 0)
    {
      this.lobby.GetInstance().pokerTables.splice(currentUser.tableID,1);
      console.log("table removed");
    }

    console.log("waiting list ", this.lobby.GetInstance().waitingUsers.length);
   // console.log("user list ", this.lobby.GetInstance().pokerTables[0].users.length);

  };
  
}

class CleaningLady {


  constructor() {
    throw new Error('Use CleaningLady.getInstance()');
  }
  static GetInstance() {
    if (!CleaningLady.instance) {
      CleaningLady.instance = new privateCleaningLady();
    }
    return CleaningLady.instance;
  }


}


module.exports = { CleaningLady: CleaningLady };


