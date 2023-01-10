//imports
const User = require("../Models/User").User;
const PokerTable = require('../LogicHandlers/PokerTable').PokerTable;


class PrivateLobby {



    pokerTables = [];
    waitingUsers = [];
    higestID = 0;
    CreateUser = (userName) => {


        let currentUser = new User();
        currentUser.UserID = this.higestID + 1;
        currentUser.Saldo = 10000;
        currentUser.UserName = userName;

        //set higest ID
        this.higestID = currentUser.UserID;

        //add user to poker table
        this.AddToPokerTable(currentUser);

    }


    AddToPokerTable = (user) => {

        if (this.pokerTables.length > 0) {

            //add user to first poker table with available seat
            for (let i = 0; i < this.pokerTables.length; i++) {
                const pokerTable = this.pokerTables[i];

                if (pokerTable.users.length < 9) {


                    console.log("user: ", user);
                    pokerTable.users.push(user);
                    return;
                }


            }

            //if  no available seats, create new poker table & add user to it
            this.CreatePokerTable(user);
            console.log("adding new poker table");

        }
        else {
            console.log("user: ", user);
            this.CreatePokerTable(user);
        }



    }

    CreatePokerTable = (user) => {

        //create user class
        let currentUser = user


        let pokerTable = new PokerTable();
        pokerTable.users.push(currentUser);
        this.pokerTables.push(pokerTable);


    }

}
class Lobby {


    constructor() {
        throw new Error('Use Lobby.getInstance()');
    }
    static GetInstance() {
        if (!Lobby.instance) {
            Lobby.instance = new PrivateLobby();
        }
        return Lobby.instance;
    }


}

module.exports = { Lobby };
