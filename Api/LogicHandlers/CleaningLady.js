//const PokerTable = require("./PokerTable").PokerTable;
class privateCleaningLady {

  lobby = require('../LogicHandlers/Lobby').Lobby;

  //move users to waiting list in lobby
  MoveUserToWaitingUsers = (currentUserID) => {


    let lobbySingleton = this.lobby.GetInstance();

    for (let index = 0; index < lobbySingleton.pokerTables.length; index++) {
      if (lobbySingleton.pokerTables[index].users.find(({ userID }) => userID === currentUserID)) {
        let user = lobbySingleton.pokerTables[index].users.find(({ userID }) => userID === 1);
        lobbySingleton.pokerTables[index].users.splice(index, 1);
        
        //insert user into lobby
        lobbySingleton.waitingUsers.push(user);
        
        //break out of loop
        index = lobbySingleton.pokerTables.length;
        
      }
    }
   
    console.log("waiting list ", lobbySingleton.waitingUsers.length);
    console.log("user list ", lobbySingleton.pokerTables[0].users.length);

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


