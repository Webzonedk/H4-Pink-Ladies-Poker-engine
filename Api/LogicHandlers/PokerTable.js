//const CleaningLady = require('./CleaningLady');
class PokerTable {


     users = [];
     bets = [];
     collectiveCards = [];
     cardDeck = [];
     dealer;

     constructor(){
        
     }

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

              //  CleaningLady.MoveUserToWaitingUsers(users[index].userID);
            }

        }
    }

     LeavePokerTable = (userID) => {


    }
//this is a test

};

module.exports = {PokerTable: PokerTable};