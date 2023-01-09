const Lobby = require("./Lobby");
const PokerTable = require("./PokerTable");
CleaningLady = {};

//move users to waiting list in lobby
CleaningLady.MoveUserToWaitingUsers = (userID) => {
  
  for (let index = 0; index < Lobby.pokerTables.length; index++) {
    if (
      Lobby.pokerTables[index].users.find(({ UserID }) => UserID === userID)
    ) {
      let user = Lobby.pokerTables[index].users.find(
        ({ UserID }) => UserID === 4
      );
      Lobby.pokerTables[index].users.splice(index, 1);

      //insert user into lobby
      Lobby.waitingUsers.push(user);

      //break out of loop
      index = Lobby.pokerTables.length;

    }
  }

  
};

module.exports = CleaningLady;

