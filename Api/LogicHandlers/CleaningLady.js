//const PokerTable = require("./PokerTable").PokerTable;
class privateCleaningLady {

  lobby = require('../LogicHandlers/Lobby').Lobby;

  //move users to waiting list in lobby
  MoveUserToWaitingUsers = (currentUser) => {


    let lobbySingleton = this.lobby.GetInstance();

    
    console.log("user: " + currentUser);
    let index = lobbySingleton.pokerTables[tableID].users.findIndex(user => user.userID == currentUser.userID);
      let user =  lobbySingleton.pokerTables[tableID].users.splice(index, 1);
        console.log(user);
        //insert user into lobby
        lobbySingleton.waitingUsers.push(user);
        
        //break out of loop
       // index = lobbySingleton.pokerTables.length;

      // if (lobbySingleton.pokerTables[currentUser.tableID].users.find(({ userID }) => userID === currentUserID)) {
      //   let user = lobbySingleton.pokerTables[tableID].users.find(({ userID }) => userID === currentUserID);

      //   console.log("user: " + user);
      //   lobbySingleton.pokerTables[tableID].users.splice(index, 1);
        
      //   //insert user into lobby
      //   lobbySingleton.waitingUsers.push(user);
        
      //   //break out of loop
      //   index = lobbySingleton.pokerTables.length;
        
      // }
    
   
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


