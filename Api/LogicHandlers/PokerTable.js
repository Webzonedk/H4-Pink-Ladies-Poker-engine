const User = require("../Models/User").User;
class PokerTable {
    CleaningLady = require("../LogicHandlers/CleaningLady").CleaningLady;
    CardDeckManager = require('../Managers/CardDeckManager').CardDeckManager;

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
    waitingTimer

    constructor() {
        this.dealer = 0;
        this.smallBlind = 0;
        this.bigBlind = 0;
        this.currentBet = 0;
        this.totalBet = 0;
        this.totalPot = 0;
        this.currentUser = -1;
        this.round = 0;
        this.waitingTimer = 5;
    }


    //run the Master loop
    RunGame = () => {


        //test observing how many users has attended, and reset timer when new user arrive
        if (this.waitingTimer > 0) {

            //check 
            let aboveOne = false;
            let checkUserTimer = setInterval(() => {
                if (this.users.length >= 2) {
                    aboveOne = true;
                }
                else {
                    aboveOne = false;
                }

                if (this.waitingTimer <= 0) {
                    console.log("kill")
                    this.ClearCurrentInterval(checkUserTimer);
                }

            }, 100 / 15);

            //count down if players are above 1
            let CountdownTimer = setInterval(() => {
                if (aboveOne) {
                    this.waitingTimer -= 1;
                    console.log(this.waitingTimer);

                    if (this.waitingTimer <= 0) {
                        console.log("stop countdown");
                        this.ClearCurrentInterval(CountdownTimer);

                        //run game loop
                        //create new card deck
                        this.cardDeck = this.CardDeckManager.GetInstance().NewCardDeck();
                       // console.log("carddeck: ", this.cardDeck);

                        //add roles
                        this.AddRoles();
                      //  console.log("small blind: ", this.smallBlind);
                      //  console.log("big blind: ", this.bigBlind);
                       // console.log("dealer ", this.dealer);

                        //deal pocket cards
                        this.DealPocketCards();
                        console.log("user pocket cards: ", this.users[0].pocketCards);
                        //-----------------------
                        
                        
                        //game begins
                        setTimeout(() => {
                            console.log("game is ready to begin!");
                        }, 5000);

                    }
                }
            }, 250)

            console.log("stop");


        }








        //runs every round until winner is found
        //----------------------

        //check state and bet for next user, then wait a few seconds

        //clear user state when all users has done their bet

        //Deal new card to pokertable
        //----------------------

        //  }
    }



    //clear current interval
    ClearCurrentInterval = (timer) => {

        clearInterval(timer);
    }

    //add poker roles at beginning of hand
    AddRoles = () => {

        //generate random number to select dealer
        if (this.round < 1) {
            this.dealer = Math.floor(Math.random() * this.users.length);
        }
        else {
            this.dealer++;

            //reset dealer if index is larger than user array
            if (this.dealer >= this.users.length) {
                this.dealer = 0;
            }
        }

        //small blind is dealer + 1
        this.smallBlind = this.dealer + 1;
        if (this.smallBlind == this.users.length) {
            this.smallBlind = 0;
        }

        //big blind is dealer + 2
        this.bigBlind = this.dealer + 2;
        if (this.bigBlind >= this.users.length) {
            this.bigBlind = this.smallBlind + 1;
        }

    };

    DealPocketCards = () => {
        for (let i = 0; i < this.users.length; i++) {
            let cards = this.cardDeck.splice(0, 2);
            this.users[i].pocketCards = cards;

        }
    };

    DealCards = () => {

        //round 0 2 pocket cards
        //round 1  3 cards
        // round 2 1 card
        //round 3 1 card
     };

    UpdateUserState = (action, value) => { };

    //Set next user index
    SetCurrentUser = () => {
        this.currentUser++;
        if (this.currentUser >= this.users.length) {
            this.currentUser = 0;
        }
    };

    //check player saldo is above 0, else player is kicked from the pokertable
    VerifyOrKickPlayer = () => {
        for (let index = 0; index < this.users.length; index++) {
            //kick player
            if (this.users[index].saldo === 0) {
                this.CleaningLady.GetInstance().MoveUserToWaitingUsers(
                    this.users[index].userID
                );
            }
        }
    };

    //user leaves the poker table & waits in the lobby
    LeavePokerTable = (currentUserID) => {
        this.CleaningLady.GetInstance().MoveUserToWaitingUsers(currentUserID);
    };

};

module.exports = { PokerTable: PokerTable };
