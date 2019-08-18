class Game {
  constructor() {
    //create and shuffle the cards
    this.deck = new Deck();
    this.deck.cards = shuffle(this.deck.cards);
      // this.deck.cards[0].value = 1;

      // this.deck.cards[1].value = 3;
      // this.deck.cards[2].value = 2;
      
      // this.deck.cards[3].value = 6;
      // this.deck.cards[4].value = 5;
      // this.deck.cards[5].value = 4;
      
      // this.deck.cards[6].value = 10;
      // this.deck.cards[7].value = 9;
      // this.deck.cards[8].value = 8;
      // this.deck.cards[9].value = 7;
      
      // this.deck.cards[10].value = 13;
      // this.deck.cards[11].value = 12;
      // this.deck.cards[12].value = 11;
      // this.deck.cards[13].value = 2;
      // this.deck.cards[14].value = 1;

      // this.deck.cards[15].value = 8;
      // this.deck.cards[16].value = 7;
      // this.deck.cards[17].value = 6;
      // this.deck.cards[18].value = 5;
      // this.deck.cards[19].value = 4;
      // this.deck.cards[20].value = 3;

      // this.deck.cards[21].value = 13;
      // this.deck.cards[22].value = 12;
      // this.deck.cards[23].value = 11;
      // this.deck.cards[24].value = 10;
      // this.deck.cards[25].value = 9;
      // this.deck.cards[26].value = 2;
      // this.deck.cards[27].value = 1;

  



    this.deckIndex = -1;

    this.piles = new Array(4);
    for (let i = 0; i < this.piles.length; i++) {
      this.piles[i] = [];
    }
    this.boards = new Array(7);
    for (let i = 0; i < this.boards.length; i++) {
      this.boards[i] = [];
    }
    this.beforeWin = 0;
  }

  distribute() {
    for (let i = 0; i < this.boards.length; i++) {
      for (let hiddenCard = 0; hiddenCard < i; hiddenCard++) {
        this.boards[i].push(this.deck.cards.shift());
        this.beforeWin++;
      }
      let topCard = this.deck.cards.shift();
      topCard.turn();
      this.boards[i].push(topCard);
    }
  }

  nextCard() {
    this.deckIndex++;
    if (this.deckIndex === this.deck.cards.length) {
      for (let c of this.deck.cards) {
        c.turn();
      }
      this.deckIndex = -1;
    } else {
      this.deck.cards[this.deckIndex].turn();
    }
  }

  show() {
    // PILES
    for (let i = 0; i < this.piles.length; i++) {
      let lastCard = this.piles[i].length - 1;
      let empty = new Card(-1, -1);
      empty.setPosition(i * (cardWitdh + 20) + 20, 10);
      empty.show();
      if (lastCard >= 0) {
        if (lastCard > 0) {
          let c = this.piles[i][lastCard - 1];
          c.setPosition(i * (cardWitdh + 20) + 20, 10);
          if (!c.selected) c.show();
        }
        let c = this.piles[i][lastCard];
        c.setPosition(i * (cardWitdh + 20) + 20, 10);
        if (!c.selected) c.show();
      }
    }

    // BOARDS
    for (let i = this.boards.length - 1; i >= 0; i--) {
      let offset_right = this.boards.length - i;
      let empty = new Card(-1, -1);
      empty.setPosition(
        window.innerWidth - (cardWitdh + 20) * offset_right,
        UpBand
      );
      empty.show();
      for (let c = 0; c < this.boards[i].length; c++) {
        let ca = this.boards[i][c];
        ca.setPosition(
          window.innerWidth - (cardWitdh + 20) * offset_right,
          UpBand + c * offsetCards
        );
        if (!ca.selected) ca.show();
      }
    }

    // DECK
    if (this.deckIndex >= 0) {
      if (this.deckIndex > 0) {
        let hidden = this.deck.cards[this.deckIndex - 1];
        hidden.setPosition(window.innerWidth - (cardWitdh + 20) * 2, 10);
        if (!hidden.selected) hidden.show();
      }
      let c = this.deck.cards[this.deckIndex];
      c.setPosition(window.innerWidth - (cardWitdh + 20) * 2, 10);
      if (!c.selected) c.show();
    }
    if (this.deckIndex + 1 < this.deck.cards.length) {
      let c = this.deck.cards[this.deckIndex + 1];
      c.setPosition(window.innerWidth - (cardWitdh + 20) * 1, 10);
      if (!c.selected) c.show();
    }
  }
}
