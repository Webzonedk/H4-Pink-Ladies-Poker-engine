cardDeckManager = {};

const cardValues = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "j",
  "q",
  "k",
  "a",
];
//Hearts, Diamonds, Clubs, Spades
const cardSuits = ["H", "D", "C", "S"];

let cardDeck = [];
let mixedCardDeck = [];

cardDeckManager.NewCardDeck = () => {
  for (let i = 0; i < cardSuits.length; i++) {
    for (let j = 0; j < cardValues.length; j++) {
      cardDeck.push(cardValues[j].concat(cardSuits[i]));
    }
  }

  console.log("cardDeck: " + cardDeck);

  for (let i = 0; i < 52; i++) {
    let selectedCard = getRandomCardFromCardDeck(cardDeck.length);
    mixedCardDeck.push(cardDeck[selectedCard]);
    cardDeck.splice(selectedCard,1);
    console.log(selectedCard);
    console.log("cardDeck: "+cardDeck);
  }
  console.log("carddeck length: ", cardDeck.length);
  console.log("mixedCardDeck: " + mixedCardDeck);

  // local function to get random number within cardDeck length
  function getRandomCardFromCardDeck(max) {
    return Math.floor(Math.random() * max);
  };

  return mixedCardDeck;
};

module.exports = cardDeckManager;
