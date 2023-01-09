const User = require('../Models/User');
const PokerTable = require('./PokerTable');
lobby = {};
lobby.pokerTables = [];
lobby.waitingUsers = [];
higestID = 0;
lobby.CreateUser = (userName) => {


    let currentUser = new User();
    currentUser.UserID = higestID +1;
    currentUser.Saldo = 10000;
    currentUser.UserName = userName;

     //set higest ID
     higestID = currentUser.UserID;

     //add user to poker table
     lobby.AddToPokerTable(currentUser);

}


lobby.AddToPokerTable = (user) => {

    if (lobby.pokerTables.length > 0) {
       
        //add user to first poker table with available seat
        for (let i = 0; i < lobby.pokerTables.length; i++) {
            const pokerTable = lobby.pokerTables[i];

            if (pokerTable.users.length < 9) {

                
                console.log("user: ", user);
                pokerTable.users.push(user);
                return;
            }
           

        }

         //if  no available seats, create new poker table & add user to it
         lobby.CreatePokerTable(user);
         console.log("adding new poker table");

    }
    else {
        console.log("user: ", user);
        lobby.CreatePokerTable(user);
    }

    

}

lobby.CreatePokerTable = (user) => {

    //create user class
    let currentUser = user


    let pokerTable = new PokerTable();
    pokerTable.users.push(currentUser);
    lobby.pokerTables.push(pokerTable);

   
}




module.exports = lobby;
//module.exports = { pokerTables, waitingUsers};
