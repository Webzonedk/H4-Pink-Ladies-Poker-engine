const User = require("../Models/User").User;
class PokerTable {
    CleaningLady = require("../LogicHandlers/CleaningLady").CleaningLady;
    CardDeckManager = require("../Managers/CardDeckManager").CardDeckManager;
    Encryption = require("../LogicHandlers/Encryption").Encryption;
    RuleManager = require("../Managers/RuleManager").RuleManager;

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
    waitingTimer;

    constructor() {
        this.dealer = 0;
        this.smallBlind = 0;
        this.bigBlind = 0;
        this.currentBet = 0;
        this.totalBet = 0;
        this.totalPot = 0;
        this.currentUser = 0;
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
                } else {
                    aboveOne = false;
                }

                if (this.waitingTimer <= 0) {
                    console.log("kill");
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
                        this.waitingTimer = 5;
                        this.ClearCurrentInterval(CountdownTimer);


                        //create new card deck
                        this.cardDeck = this.CardDeckManager.GetInstance().NewCardDeck();
                        // console.log("carddeck: ", this.cardDeck);

                        //add roles to users
                        this.AddRoles();


                        //deal pocket cards
                        this.DealPocketCards();
                        this.round++;


                        //activate check for players that no longer is playable
                        // let kickLoop = setInterval(() => {
                        //     this.VerifyOrKickPlayer();

                        //     if (this.users.length < 2) {
                        //         this.ClearCurrentInterval(kickLoop);
                        //     }
                        // }, 1000);

                        if (this.round > 0) {
                            //check when every player has had their turn
                            let roundIsDone = false;
                            let playerChecker = setInterval(() => {

                                //kill loop if users has dropped belov 2
                                if (this.users.length < 2) {
                                    this.ClearCurrentInterval(playerChecker);
                                    this.GameReset();
                                    console.log("game reset");
                                    this.RunGame();
                                }

                                //check if all users are done with their turn
                                if (!this.users.find((user) => user.state == " ")) {
                                    console.log("all done!");

                                    //deal cards for next round
                                    this.DealCards();

                                    //send snapshot
                                    let snapshot = this.CreateSnapshot();
                                    this.Encryption.GetInstance().EncryptAES(snapshot);

                                    //reset users
                                    for (let i = 0; i < this.users.length; i++) {
                                        this.users[i].state = " ";
                                        this.users[i].bet = 0;
                                    }

                                    //set next round
                                    this.round++;

                                    //collect totalbet into total pot
                                    this.totalPot += this.totalBet;

                                    console.log("Ready for next round: ", this.round);

//comment
                                }

                                console.log("are they done? ", roundIsDone);
                                //stop the round and analyze the hands
                                if (this.round > 3) {
                                    this.ClearCurrentInterval(playerChecker);
                                    console.log("ready to analyze");

                                    //compare all hands
                                    let pokerTableSnapshot = this.CreateSnapshot();
                                    
                                    console.log("cards analyzed, everyone wins!");
                                    // this.RuleManager.GetInstance().CompareHands(pokerTableSnapshot);

                                    //kick players without saldo
                                    this.VerifyOrKickPlayer();
                                }

                            }, 1000);

                            //change turn every 5 second & 30 seconds in production
                            let turnChanger = setInterval(() => {
                                console.log("please do an action");

                                //clear loop if not enough players
                                if (this.users.length < 2) {
                                    this.ClearCurrentInterval(turnChanger);
                                }

                                //automatic set state if player does nothing
                                if (this.users[this.currentUser].state == " ") {
                                    this.users[this.currentUser].state = "fold";
                                }
                                else {
                                    //logic for player bet
                                    let action = this.users[this.currentUser].state;
                                    switch (action) {
                                        case "bet":
                                            let bet = this.users[this.currentUser].bet;
                                            this.totalBet = bet;
                                            this.users[this.currentUser].saldo -= bet;
                                            break;
                                        case "fold":
                                            this.users[this.currentUser].pocketCards = [];
                                            break;
                                        case "call":

                                            break;
                                        case "raise":

                                            break;
                                        default:
                                            break;
                                    }



                                    //logic for player raise
                                }




                                //next turn
                                this.SetCurrentUser();

                                //send snapshot
                                let snapshot = this.CreateSnapshot();
                                this.Encryption.GetInstance().EncryptAES(snapshot);

                                //stop after this round
                                if (this.round > 3) {
                                    console.log("no more rounds");
                                    this.ClearCurrentInterval(turnChanger);
                                }

                            }, 5000);
                        }


                    }
                }
            }, 250);

            console.log("stop");
        }

        //runs every round until winner is found
        //----------------------

        //check state and bet for next user, then wait a few seconds

        //clear user state when all users has done their bet

        //Deal new card to pokertable
        //----------------------

        //  }
    };

    //create snapshot of pokertable
    CreateSnapshot = () => {
        let snapshot = {
            users: this.users,
            bets: this.bets,
            collectiveCards: this.collectiveCards,
            cardDeck: this.cardDeck,
            dealer: this.dealer,
            smallBlind: this.smallBlind,
            bigBlind: this.bigBlind,
            currentBet: this.currentBet,
            totalbet: this.totalBet,
            totalPot: this.totalPot,
            currentUser: this.currentUser,
            round: this.round,
        };
        
        return snapshot;
    };

    //reset game
    GameReset = () => {
        this.bets = [];
        this.cardDeck = [];
        this.collectiveCards = [];
        this.dealer = 0;
        this.smallBlind = 0;
        this.bigBlind = 0;
        this.currentBet = 0;
        this.totalBet = 0;
        this.totalPot = 0;
        this.currentUser = 0;
        this.round = 0;
        this.waitingTimer = 5;
    }

    //clear current interval
    ClearCurrentInterval = (timer) => {
        clearInterval(timer);
    };

    //add poker roles at beginning of hand
    AddRoles = () => {
        //generate random number to select dealer
        if (this.round < 1) {
            this.dealer = Math.floor(Math.random() * this.users.length);
        } else {
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
        //round 1 add 3 cards to collective
        if (this.round == 1) {
            this.collectiveCards = this.cardDeck.splice(0, 3);
        } else if (this.round > 1) {
            // round 2 & 3 add 1 card to collective
            let card = this.cardDeck.splice(0, 1);
            this.collectiveCards.push(card[0]);
        }
    };

    UpdateUserState = (id, action, value) => {
        let index = this.users.findIndex((user) => user.userID == id);
        this.users[index].state = action;
        this.users[index].bet = value;

        console.log("user interacting: ", this.users[index]);
    };

    //Set next user index
    SetCurrentUser = () => {
        this.currentUser++;
        if (this.currentUser >= this.users.length) {
            this.currentUser = 0;
        }
    };

    //check player saldo is above 0, else player is kicked from the pokertable
    VerifyOrKickPlayer = () => {
        let playerKicked = false;
        for (let index = 0; index < this.users.length; index++) {
            //kick player if saldo is zero
            if (this.users[index].saldo === 0) {

                this.CleaningLady.GetInstance().MoveUserToWaitingUsers(
                    this.users[index]
                );
                playerKicked = true;
            }

        }
        console.log("players remaining: ", this.users.length);
        //send snapshot of game state to clients
        if (playerKicked) {
            let snapshot = this.CreateSnapshot();
            this.Encryption.GetInstance().EncryptAES(snapshot);
        }
    };

    //user leaves the poker table & waits in the lobby
    LeavePokerTable = (currentUserID) => {

        let user = this.users.find((user) => user.userID == currentUserID);
        this.CleaningLady.GetInstance().MoveUserToWaitingUsers(user);
    };
}

module.exports = { PokerTable: PokerTable };
