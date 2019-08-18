COLOR = ["SPADE", "TILE", "CLOVER", "HEART"];
// impaire = red
// pair = black
const cardWitdh = 120;
const cardHeight = 200;

class Card {
  constructor(v, c) {
    this.x = 0;
    this.y = 0;
    this.value = v;
    this.color = c;
    this.color % 2 === 0 ? (this.c = "#000") : (this.c = "#f00");
    this.visible = false;
    this.selected = false;
  }

  turn() {
    this.visible = !this.visible;
  }

  clone() {
    let clo = new Card(this.value, this.color);
    clo.c = this.c;
    clo.visible = this.visible;
    return clo;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  getValueTxt(v){
    let res;
    switch(v){
      case 1:
        res="A";
        break;
      case 11:
        res = "V";
        break;
      case 12:
        res = "D";
        break;
      case 13:
        res = "R";
        break;
      default:
        res=v;
    }
    return res;
  }

  getColorImg(c){
    let res;

    switch(c){
      case "SPADE":
        res=spadeImg;
        break;
      case "TILE":
        res=tileImg;
        break;
      case "HEART":
        res=heartImg;
        break;
      case "CLOVER":
        res=cloverImg;
        break;
    }
    return res;
  }

  show() {
    push();
    if (this.value > 0) {
      if (this.visible) {
        fill("#fff");
        rect(this.x, this.y, cardWitdh, cardHeight,5);
        push();
        textSize(20);
        fill(this.c);
        let v = this.getValueTxt(this.value);
        text(v, this.x + 10, this.y + 25);
        let i = this.getColorImg(COLOR[this.color]);
        image(i, this.x + 30, this.y+8,20,20);
        image(i, this.x +cardWitdh/4 , this.y + cardHeight/3,cardWitdh/2,cardWitdh/2);
        pop();
      } else {
        //fill("#0f0");
        //rect(this.x, this.y, cardWitdh, cardHeight);
        image(backImg,this.x,this.y,cardWitdh,cardHeight);
      }
    } else {
      image(backImg,this.x,this.y,cardWitdh,cardHeight);
      fill("#999d");
      rect(this.x, this.y, cardWitdh, cardHeight,5);
    }
    pop();
  }
}
