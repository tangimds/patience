class Deck{
  constructor(){
    this.cards = [];
    for(let c = 0 ; c<4 ; c++){
      for(let v = 1 ; v<14 ; v++){
        this.cards.push(new Card(v,c));
      }
    }
  }
}