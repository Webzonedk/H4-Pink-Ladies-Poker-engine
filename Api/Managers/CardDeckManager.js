class PrivateCardDeckManager {
  cardValues = [];
  cardSuits = [];
  cardDeck = [];
  mixedCardDeck = [];

  constructor() {
    this.cardValues = [
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
    this.cardSuits = ["H", "D", "C", "S"];

  };
  //Factory to create, mix, and returning a new card deck when called.
  NewCardDeck = () => {
    for (let i = 0; i < this.cardSuits.length; i++) {
      for (let j = 0; j < this.cardValues.length; j++) {
        this.cardDeck.push(this.cardValues[j].concat(this.cardSuits[i]));
      }
    }

    console.log("cardDeck: " + this.cardDeck);

    for (let i = 0; i < 52; i++) {
      let selectedCard = getRandomCardFromCardDeck(this.cardDeck.length);
      this.mixedCardDeck.push(this.cardDeck[selectedCard]);
      this.cardDeck.splice(selectedCard, 1);
    }

    // local function to get random number within cardDeck length
    function getRandomCardFromCardDeck(max) {
      return Math.floor(Math.random() * max);
    };

    return this.mixedCardDeck;
  };

};

class CardDeckManager {


  constructor() {
    throw new Error('Use cardDeckManager.getInstance()');
  };
  static GetInstance() {
    if (!PrivateCardDeckManager.instance) {
      PrivateCardDeckManager.instance = new PrivateCardDeckManager();
    }
    return PrivateCardDeckManager.instance;
  };


};

module.exports = { CardDeckManager: CardDeckManager };

