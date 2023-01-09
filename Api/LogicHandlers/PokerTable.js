const CleaningLady = require('./CleaningLady');
class PokerTable {


     users = [];
     bets = [];
     collectiveCards = [];
     cardDeck = [];
     dealer;


     AddRoles = () => {


    }

     DealPocketCards = () => {


    }

     UpdateUserState = (action, value) => {


    }

   

     SetCurrentUser = () => {


    }

     VerifyOrKickPlayer = () => {

        for (let index = 0; index < users.length; index++) {

            //kick player
            if (users[index].Saldo === 0) {

                CleaningLady.MoveUserToWaitingUsers(users[index].userID);
            }

        }
    }

     LeavePokerTable = (userID) => {


    }

};

//module.exports = PokerTable;