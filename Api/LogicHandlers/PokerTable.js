const CleaningLady = require('../LogicHandlers/CleaningLady').CleaningLady;
const User = require("../Models/User").User;
class PokerTable {



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

     constructor(){
        
     }

     AddRoles = () => {


    }

     DealPocketCards = () => {


    }

     UpdateUserState = (action, value) => {


    }

   

     SetCurrentUser = () => {

        this.currentUser++;
        if(this.currentUser >= this.users.length)
        {
            this.currentUser = 0;
        }
    }

     VerifyOrKickPlayer = () => {

        let Ladysingleton = CleaningLady.GetInstance();

        for (let index = 0; index < this.users.length; index++) {

            //kick player
            if (this.users[index].saldo === 0) {

                Ladysingleton.MoveUserToWaitingUsers(this.users[index].userID);
                
            }

        }

        
    }

     LeavePokerTable = (userID) => {


    }
//this is a test
//another test
};

module.exports = {PokerTable: PokerTable};