const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const encryption = require("./LogicHandlers/Encryption");
const lobby = require('./LogicHandlers/Lobby');
//const pokerTable = require('./LogicHandlers/PokerTable');
const crypto = require("crypto"); //only for testing purposes
const RuleManager = require('./Managers/RuleManager');

//List to carry the carddeck.
let cardDeck = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


//create AES keys when api is starting, before anything else, to ensure that AES key and IV exists.
encryption.CreateAES();


// only for testing puposes.
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });

//Get AES keys
app.get('/api/GetAES', (req, res) => {

  const key = req.body.publicKey;
  console.log(publicKey);
  const encryptedData = encryption.EncryptRSA(publicKey);

  res.status(200).send(encryptedData);

});

//create new user
app.post('/api/CreateUser', (req, res) => {

  const encryptedUser = req.body.userName;

  const decryptedUser = encryption.DecryptAES(encryptedUser);
  lobby.CreateUser(decryptedUser);

  res.status(200).send("user created!");

});


//user interactions
app.post('/api/Useraction', (req, res) => {

  const encryptedUserAction = req.body.userAction;

  const decryptedUserAction = encryption.DecryptAES(encryptedUserAction);
  pokerTable.UpdateUserState(decryptedUserAction.action, decryptedUserAction.value);

  res.status(200).send("user interacting");

});

// play game again
app.post('/api/PlayAgain', (req, res) => {

  const encryptedUserID = req.body.userID;

  const decryptedUserID = encryption.DecryptAES(encryptedUserID);
  pokerTable.AddToPokerTable(decryptedUserID);

  res.status(200).send("replay!");

});

//leave poker table
app.post('/api/LeaveTable', (req, res) => {

  const encryptedUserID = req.body.userID;

  const decryptedUserID = encryption.DecryptAES(encryptedUserID);
  pokerTable.LeavePokerTable(decryptedUserID);

  res.status(200).send("replay!");

});

//Testing if there is connection
app.get('/api/test', (req, res) => {
  res.status(200).send("Der er hul igennem")
});

//test til 
app.get('/api/testCardDeck', (req, res) => {

  const cardDeckManager = require('./Managers/CardDeckManager');
  const mixedCardDeck = cardDeckManager.NewCardDeck();

  res.status(200).send(mixedCardDeck);
})

//test rulemanager
app.get('/api/ruleManagerTest', (req, res) => {

  const ruleManager = RuleManager.getInstance();
  const PokerTable = require('./LogicHandlers/PokerTable');
  const User = require('./Models/User');

  let hand8 = ["2H", "2D", "2C", "kD", "kD", "10D", "3C"];//full house
  let hand7 = ["2D", "3D", "4D", "5D", "8D", "10H", "kC"];//flush
  let hand6 = ["2D", "3D", "4D", "5D", "6D", "10D", "3C"];//straight flush
  let hand5 = ["2H", "3D", "4C", "5C", "6D", "10D", "3C"];//straight
  let hand4 = ["2H", "2D", "2C", "kC", "qD", "10D", "3C"];//three of a kind
  let hand3 = ["2H", "2D", "4C", "4D", "6D", "10D", "3C"];//two pairs
  let hand2 = ["2H", "3D", "4C", "5C", "8D", "10D", "10C"];//one pair
  let hand1 = ["2H", "3D", "aC", "5C", "8D", "10D", "kC"];//highest card



  let hand_8 = ["5D", "3C", "10C", "jC", "qC", "kC", "8H"];//flush
  let hand_7 = ["2D", "9C", "10C", "jC", "qC", "kC", "8H"];//straight flush
  let hand_6 = ["3H", "aD", "10C", "jC", "qC", "kC", "8H"];//straight
  let hand_5 = ["2H", "aH", "10C", "jC", "qC", "kC", "8H"];//straight
  let hand_4 = ["jH", "jD", "10C", "jC", "qC", "kC", "8H"];//three of a kind
  let hand_3 = ["jH", "qD", "10C", "jC", "qC", "kC", "8H"];//two pairs
  let hand_2 = ["2H", "kD", "10C", "jC", "qC", "kC", "8H"];//one pair
  let hand_1 = ["aH", "3D", "10C", "jC", "qC", "kC", "8H"];//highest card


  //let result = ruleManager.analyzeHand(hand_1);



  //-----------------------------------------------
  //Creating a testPokerTable object
  //-----------------------------------------------
  // testPocketCards=[["1x card"], ["1 x pair"], ["2 x pair"], ["3 x kind "], ["straight"], ["straight"]]
  testPocketCards = [["3D", "7H"], ["5S", "6S"], ["5D", "jS"], ["10D", "10S"], ["2S", "9S"], ["aD", "8D"]]; //With two straights high and low
  // testPocketCards=[["1x card"], ["1 x pair"], ["2 x pair"], ["3 x kind "], ["straight"], ["flush   "], ["full hou"], ["4 x kind  "], ["str flu"],["royal flu"]]
  //testPocketCards = [["3D", "7H"], ["4S", "6S"], ["4H", "jS"], ["5H", "10S"], ["2S", "9S"], ["aD", "8C"], ["jS", "jD"], ["10S", "10D"], ["aS", "9C"], ["aC", "4C"]] //with royal straight flush

  //testing compare hands
  let pokerTable = new PokerTable();

  //create test users
  for (let i = 0; i < 6; i++) {

    let user = new User();
    user.UserID = i;
    user.UserName = "user_" + i + 1;
    user.Saldo = 1000;
    user.PocketCards = testPocketCards[i]


    //add test users to poker table
    pokerTable.users.push(user);

  }
  // pokerTable.collectiveCards=["10C", "jC", "qC", "kC", "8H"];
  pokerTable.collectiveCards = ["10C", "jC", "qC", "kC", "5H"];

  //-----------------------------------------------
  //-----------------------------------------------

  let result = ruleManager.CompareHands(pokerTable);

  res.status(200).send(result);
});

//test cleaning lady
app.post('/api/cleaningLady', (req, res) => {

  const housekeeping = require('./LogicHandlers/CleaningLady');
  const PokerTable = require('./LogicHandlers/PokerTable');
  const User = require('./Models/User');
  let pokerTable = new PokerTable();

  //create test users
  for (let index = 0; index < 5; index++) {

    let user = new User();
    user.UserID = index;
    user.UserName = "user_" + index + 1;
    user.Saldo = 1000;
    if (index === 4) {
      user.Saldo = 0;
    }

    //add test users to poker table
    pokerTable.users.push(user);

  }

  //add poker table to lobby
  lobby.pokerTables.push(pokerTable);


  //find user with user id of 4
  let user = lobby.pokerTables[0].users.find(({ UserID }) => UserID === 4);
  console.log(user);
  //move user with userID 4 to waitinguser
  housekeeping.MoveUserToWaitingUsers(user.UserID);

});

// Create cardDeck Factory

// Mix cards with (random number. Not the normal random!)
// Add cards to stack.
//another test

// testing1
app.listen(port, () => {
  console.log(`port is listening ${port}`);
});