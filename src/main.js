let game;
let cardsFocused = [],
  anchor_dX,
  anchor_dY,
  anchor_col,
  anchor_pile;

let offsetCards = 30;

let UpBand = cardHeight + 50;

let tileImg, heartImg, cloverImg, spadeImg, backImg, backgroundImg;

let sentToPile;

let cheat_finish;

let animation;

function setup() {
  cnv = createCanvas(window.innerWidth, window.innerHeight);
  game = new Game();
  game.distribute();
  print(game);
  cnv.doubleClicked(doubleClick);
  tileImg = loadImage("../media/TILE.png");
  heartImg = loadImage("../media/HEART.png");
  cloverImg = loadImage("../media/CLOVER.png");
  spadeImg = loadImage("../media/SPADE.png");
  backImg = loadImage("../media/dos_de_carte_maraad.png");
  backgroundImg = loadImage("../media/background.png");

  cheat_finish = false;
  sentToPile = true;
  game.nextCard();
}

function draw() {
  //frameRate(2);
  background(51);
  image(backgroundImg,0,0,window.innerWidth, window.innerHeight);
  game.show();
  moveCardFocused();
  if (game.beforeWin <= 0 || cheat_finish) {
    print("WIN");
    finishHim();
  }
  animate();
}

function keyPressed(e) {
  switch (e.key) {
    case "f":
      cheat_finish = !cheat_finish;
      break;

    case "a":
      calcMidPositions(10, 20, 40, 20, 1);
      break;
  }
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function animate() {
  if (animation) {
    print(animation);
    let index = animation.index;
    for(let i=0 ; i<animation.cards.length ; i++){
      let x = animation.pos.x[index];
      let y = animation.pos.y[index];
      animation.cards[i].setPosition(x, y+offsetCards*i);
      animation.cards[i].show();
    }
    animation.index++;
    if (animation.index === animation.pos.x.length) {
      animation = undefined;
    }
  }
}

function setAnimation(c, x, y) {
  animation = { cards: c, pos: { x: x, y: y }, index: 0 };
}

function calcMidPositions(x1, y1, x2, y2) {
  let newXs = [],
    newYs = [];
  let n = floor(dist(x1,y1,x2,y2)/80);
  const dx = x2 - x1;
  const dy = y2 - y1;
  for (let i = 0; i < n; i++) {
    newXs.push(x1 + (dx / (n + 1)) * i + dx / (n + 1));
    newYs.push(y1 + (dy / (n + 1)) * i + dy / (n + 1));
  }
  //print(newXs,newYs);
  return { x: newXs, y: newYs };
}

function moveCardFocused() {
  // print(cardsFocused);
  if (cardsFocused.length > 0) {
    for (let i = 0; i < cardsFocused.length; i++) {
      let c = cardsFocused[i];
      c.selected = true;
      c.setPosition(mouseX - anchor_dX, mouseY - anchor_dY + offsetCards * i);
      c.show();
    }
  }
}

function clickOnDeck() {
  if (
    mouseX >= window.innerWidth - (cardWitdh + 20) * 1 &&
    mouseY <= cardHeight + 10
  )
    return true;
  else return false;
}

function clickOnFreeCard() {
  if (
    mouseX >= window.innerWidth - (cardWitdh + 20) * 2 &&
    mouseX <= window.innerWidth - (cardWitdh + 20) * 1 &&
    mouseY < cardHeight + 10
  )
    return true;
  else return false;
}

function clickOnBoard() {
  if (mouseY >= UpBand) return true;
  else return false;
}

function clickOnPiles() {
  if (mouseX <= 20 + (cardWitdh + 20) * 4 && mouseY <= cardHeight + 10)
    return true;
  else return false;
}

function doubleClick() {
  //TOP
  if (clickOnFreeCard()) {
    if (sendToPile(game.deck.cards[game.deckIndex])) {
      game.deck.cards.splice(game.deckIndex, 1);
      game.deckIndex--;
    } else if (sendToBoard([game.deck.cards[game.deckIndex]])) {
      game.deck.cards.splice(game.deckIndex, 1);
      game.deckIndex--;
    }
  }

  if (clickOnPiles()) {
    let p = getPile(mouseX, mouseY);
    if (p >= 0) {
      let pile = game.piles[p];
      if (pile.length > 0) {
        if (sendToBoard([pile[pile.length - 1]])) {
          pile.pop();
        }
      }
    }
  }

  // BOARD
  if (clickOnBoard()) {
    let pos = getBoard(mouseX, mouseY);
    if (pos.col >= 0) {
      let col = game.boards[pos.col];
      let cards = getAllCardsbelow(pos.card, pos.col);
      print(cards);
      if (cards.length === 1 && cards[0] && sendToPile(cards[0])) {
        col.pop();
        if (col.length > 0 && !col[col.length - 1].visible) {
          col[col.length - 1].turn();
          game.beforeWin--;
        }
        return;
      } else if (cards[0]) {
        let test = sendToBoard(cards);
        print(test);
        if (test) {
          print("yes");
          for (let i = 0; i < cards.length; i++) {
            print("pop");
            col.pop();
          }
          if (col.length > 0 && !col[col.length - 1].visible) {
            col[col.length - 1].turn();
            game.beforeWin--;
          }
          return;
        }
      }
    }
  }
}

function getAllCardsbelow(card, col) {
  let res = [];
  if (col >= 0) {
    for (let i = card; i < game.boards[col].length; i++) {
      res.push(game.boards[col][i]);
    }
  }
  return res;
}

function sendToPile(card, pile) {
  if (pile >= 0) {
    let p = game.piles[pile];
    if (
      (p.length === 0 && card.value === 1) ||
      (card.value - p.length - 1 === 0 && card.color === p[p.length - 1].color)
    ) {
      //ANIM
      p.push(card.clone());

      let pos = calcMidPositions(card.x, card.y, pile*(cardWitdh+20)+20, 10);
      setAnimation([card.clone()], pos.x, pos.y);
      //---

      return true;
    }
    return false;
  }
  for (let p of game.piles) {
    if (
      (p.length === 0 && card.value === 1) ||
      (card.value - p.length - 1 === 0 && card.color === p[p.length - 1].color)
    ) {
      p.push(card.clone());
      let pos = calcMidPositions(card.x, card.y, game.piles.indexOf(p)*(cardWitdh+20)+20, 10);
      setAnimation([card.clone()], pos.x, pos.y);
      return true;
    }
  }
  return false;
}

function sendToBoard(cards, board) {
  if (board >= 0) {
    let b = game.boards[board];
    if (
      (b.length === 0 && cards[0].value === 13) ||
      (b.length > 0 &&
        b[b.length - 1].value === cards[0].value + 1 &&
        b[b.length - 1].c !== cards[0].c)
    ) {
      let offset_right = game.boards.length - game.boards.indexOf(b);
      let pos = calcMidPositions(cards[0].x, cards[0].y, window.innerWidth - (cardWitdh + 20) * offset_right,  UpBand + b.length * offsetCards);
      setAnimation([cards], pos.x, pos.y);
      for (let c of cards) {
        b.push(c.clone());
      }
      return true;
    }
    return false;
  }
  for (let b of game.boards) {
    if (
      (b.length === 0 && cards[0].value === 13) ||
      (b.length > 0 &&
        b[b.length - 1].value === cards[0].value + 1 &&
        b[b.length - 1].c !== cards[0].c)
    ) {
      let offset_right = game.boards.length - game.boards.indexOf(b);
      let pos = calcMidPositions(cards[0].x, cards[0].y, window.innerWidth - (cardWitdh + 20) * offset_right,  UpBand + b.length * offsetCards);
      setAnimation(cards, pos.x, pos.y);
      let clones = [];
      for (let c of cards) {
        b.push(c.clone());
        clones.push(c.clone());
      }
      return true;
    }
  }
  return false;
}

function getBoard(x, y) {
  let dx = window.innerWidth - 10 - x;
  let dy = y - UpBand;

  let card = floor(dy / offsetCards);
  let col = game.boards.length - 1 - floor(dx / (cardWitdh + 20));
  if (col < 0 || col >= game.boards.length || dy <= 0) {
    print("out of boards");
    return { col: undefined, card: undefined };
  } else if (y > game.boards[col].length * offsetCards + UpBand) {
    card = game.boards[col].length - 1;
  }
  return { col: col, card: card };
}

function getPile(x, y) {
  let p = floor((mouseX - 10) / (cardWitdh + 20));
  if (p >= 0 || p <= 4) return p;
  else return undefined;
}

function mousePressed() {
  //TOP
  if (clickOnDeck()) game.nextCard();

  if (clickOnFreeCard()) {
    if (game.deckIndex >= 0) {
      cardsFocused[0] = game.deck.cards[game.deckIndex];
      anchor_dX = mouseX - cardsFocused[0].x;
      anchor_dY = mouseY - cardsFocused[0].y;
      anchor_col = -1;
    }
  }

  if (clickOnPiles()) {
    let p = getPile(mouseX, mouseY);
    if (p >= 0) {
      let pile = game.piles[p];
      if (pile.length > 0) {
        cardsFocused[0] = pile[pile.length - 1];
        anchor_dX = mouseX - cardsFocused[0].x;
        anchor_dY = mouseY - cardsFocused[0].y;
        anchor_col = -1;
        anchor_pile = p;
      }
    }
  }

  // BOARD
  if (clickOnBoard()) {
    let pos = getBoard(mouseX, mouseY);
    if (pos.col >= 0) {
      let col = game.boards[pos.col];
      let card = pos.card;
      if (col.length > 0 && card < col.length && col[card].visible) {
        for (let i = card; i < col.length; i++) {
          cardsFocused.push(col[i]);
        }
        anchor_dX = mouseX - cardsFocused[0].x;
        anchor_dY = mouseY - cardsFocused[0].y;
        anchor_col = pos.col;
      }
    }
  }
}

function finishHim() {
  let fromBoard = false;
  let fromDeck = false;

  for (let b of game.boards) {
    if (b.length > 0) {
      if (sendToPile(b[b.length - 1])) {
        b.pop();
        if (b.length > 0 && !b[b.length - 1].visible) {
          b[b.length - 1].turn();
        }
        fromBoard = true;
      }
    }
  }

  if (!fromBoard) {
    game.deckIndex < 0 ? game.nextCard() : null;
    if (
      game.deck.cards.length > 0 &&
      sendToPile(game.deck.cards[game.deckIndex])
    ) {
      game.deck.cards.splice(game.deckIndex, 1);
      game.deckIndex--;
      fromDeck = true;
    }
  }

  if (!fromDeck && !fromBoard) {
    game.nextCard();
  }
}

function mouseReleased() {
  if (cardsFocused.length > 0) {
    let target = getBoard(mouseX, mouseY);
    let targetPile = getPile(mouseX, mouseY);
    print(anchor_pile);
    if (target.col >= 0 && clickOnBoard()) {
      if (anchor_col !== target.col && sendToBoard(cardsFocused, target.col)) {
        if (anchor_col >= 0) {
          let col = game.boards[anchor_col];
          for (let i = 0; i < cardsFocused.length; i++) {
            col.pop();
          }
          if (col.length > 0 && !col[col.length - 1].visible) {
            col[col.length - 1].turn();
            game.beforeWin--;
          }
        } else if (anchor_pile >= 0) {
          game.piles[anchor_pile].pop();
        } else {
          game.deck.cards.splice(game.deckIndex, 1);
          game.deckIndex--;
        }
      }
    } else if (targetPile >= 0 && clickOnPiles()) {
      if (
        cardsFocused.length === 1 &&
        anchor_pile === undefined &&
        sendToPile(cardsFocused[0], targetPile)
      ) {
        if (anchor_col >= 0) {
          let col = game.boards[anchor_col];
          col.pop();
          if (col.length > 0 && !col[col.length - 1].visible) {
            col[col.length - 1].turn();
            game.beforeWin--;
          }
        } else {
          game.deck.cards.splice(game.deckIndex, 1);
          game.deckIndex--;
        }
      }
    }
    for (let c of cardsFocused) {
      c.selected = false;
    }
    cardsFocused = [];
    anchor_dX = undefined;
    anchor_dY = undefined;
    anchor_col = undefined;
    anchor_pile = undefined;
  }
}
