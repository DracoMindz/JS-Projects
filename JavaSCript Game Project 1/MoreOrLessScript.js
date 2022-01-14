
//game script//

var gameOver = false; // used to check if the game is Over false or true//
// creating objects to use with the score and cards//
var dealer = new Object();
var you = new Object();
setStartValues(); //function sets start values. Values can be changed.//

//card variables//
var arr = [];
var cardBaseOffset = 5;
var currentCard = 1;
/*var addLessFlag = false;*/

//cards inserted as innerHTML to mainContent container//
var innerHTMLCards = "";
for (var i = 0, length = 14; i < length; i++) {
  textString = "<img id='card" + (i + 1) + "'"
  + " src='./MoreLessAssets/cardDeck1.png' width='2140px' height='1281px' class='card' />";
  innerHTMLCards += textString
}
document.getElementById("mainContent").innerHTML += innerHTMLCards;

function newGame() {
  gameOver = false;
  currentCard = 1;
  setStartValues();
  shuffleCards();

  document.getElementById("dealerScore").innerHTML = "-";
  document.getElementById("youScore").innerHTML = "0";
  document.getElementById("dealStatus").innerHTML = "More, Less or Hold";
  var cardDeck = document.getElementsByClassName("card");
  for (var i = 0, length = cardDeck.length; i < length; i++) {
    cardDeck[i].style.visibility = "hidden";
    cardDeck[i].style.marginTop = "0px";
    cardDeck[i].style.marginLeft = "0px";
    cardDeck[i].style.objectPosition = "0 0";
  }
  getCard(1);
  getCard(0);
  getCard(1);
  getCard(0);
}

function addMore() {
  getCard(1);
  if (you.totalScore > 21 || you.totalScore < 0) {
    document.getElementById("dealStatus").innerHTML = "you bust";
    endGame();
    return;
  }
  getCard(0);
  if (dealer.totalScore > 21 || dealer.totalScore < 0) {
    document.getElementById("dealStatus").innerHTML = "dealer busts";
    showHole();
    endGame();
    return;
  }
}
/* working on this section. Objective: subtract card value from total */
function addLess() {
  getCard(1);
  if (you.totalScore > 21 || you.totalScore < 0) {
    document.getElementById("dealStatus").innerHTML = "you bust";
    endGame();
    return;
  }
  getCard(0);
  if (dealer.totalScore > 21 || dealer.totalScore < 0) {
    document.getElementById("dealStatus").innerHTML = "dealer busts";
    showHole();
    endGame();
    return;
  }
  addLessFlag = true;
}

function getTotals() {
  switch (true) {
    case (dealer.totalScore > 21 || dealer.totalScore < 0):
      document.getElementById("dealStatus").innerHTML = "dealer busts";
      dealer.bust = true;
      gameOver = true;
      break;
    case (you.totalScore > 21 || you.totalScore < 0):
      document.getElementById("dealStatus").innerHTML = "you bust";
      you.bust = true;
      gameOver = true;
      break;
    case ((dealer.totalScore < 22) && (dealer.totalScore < you.totalScore)):
      document.getElementById("dealStatus").innerHTML = "dealer wins";
      break;
    case ((you.totalScore < 22) && (you.totalScore < dealer.totalScore)):
      document.getElementById("dealStatus").innerHTML = "you win";
      break;
    case (dealer.totalScore == you.totalScore):
      document.getElementById("dealStatus").innerHTML = "tie game";
      break;
    case (currentCard > 12):
      document.getElementById("dealStatus").innerHTML = "draw";
      break;
    default:
      document.getElementById("dealStatus").innerHTML = "X";    // should not show
  }
}

function showHole () {
  var image = document.getElementById("card2");
  image.src = "./MoreLessAssets/cardDeck1.png"
  displayCard(0, image, dealer.offset, dealer.suit, true);
}

function stand() {
  endGame();
  getTotals();
}

function endGame() {
  while (dealer.totalScore < 15 && !gameOver) {
    getCard(0);
  }
  gameOver = true;
  document.getElementById("dealerScore").innerHTML = dealer.totalScore;
  document.getElementById("youScore").innerHTML = you.totalScore;
  showHole();
}

function getCard(player) {
  if (gameOver) return;
  if (player == 0) {
    if (dealer.hold) {
      return;
    }
    var topMargin = 23;
    var leftMargin = dealer.margin;
  } else {
    if (you.hold || you.bust) {
      return;
    }
    var topMargin = 490;
    var leftMargin = you.margin;
  }

  var image = document.getElementById("card" + currentCard);
  image.style.marginTop = topMargin + "px";
  image.style.marginLeft = leftMargin + "px";

  var cardVal = (arr[currentCard] % 13);
  var offset = cardBaseOffset + (cardVal * 168);
  var suit = arr[currentCard] % 4;

  if (image.id == "card2") {
    dealer.cardVal = cardVal;
    dealer.offset = offset;
    dealer.suit = suit;
    image.src = "./MoreLessAssets/cardBack1.png";
  }

  displayCard(player, image, offset, suit, false);
  currentCard++;
  image.style.visibility = "visible"



  score(player, cardVal);
  addAces(player);
  if (player == 0 && dealer.totalScore < 7 && dealer.totalScore <= 0) {
    dealer.hold = true;
    document.getElementById("dealStatus").innerHTML = "dealer holds";
  }
  if (player == 0 && (you.totalScore < 0 || you.totalScore > 21)) {
    document.getElementById("dealStatus").innerHTML = "you bust";
    you.bust = true;
    gameOver = true;
  }
  document.getElementById("youScore").innerHTML = you.totalScore;
}
/* for the addMore */
function addAces(player) {
  var cardsScore = 0;
  var numAces = 0;
  if (player == 0) {
    var totalScore = dealer.score;
    numAces = dealer.aces;
  } else {
    var totalScore = you.score;
    numAces = you.aces;
  }
  if (numAces > 0) {
    for (var i = 0, length = numAces; i < length; i++) {
      if ((totalScore + 11) > 0 && (totalScore + 11) < 22)
        totalScore = totalScore + 11;
      else
        totalScore = totalScore + 1;
    }
  }
  if (player == 0) {
    dealer.totalScore = totalScore;
  } else {
    you.totalScore = totalScore;
  }
}

/* Visual Placement of the cards. Depends on the size of the decks*/
function displayCard(player, image, offset, suit, hole) {
  switch(suit) {
    case 0:
      vertPos = -5;
      break;
    case 1:
      vertPos = -245;
      break;
    case 2:
      vertPos = -490;
      break;
    case 3:
      vertPos = -730;
      break;
  }
  var position = (-offset + "px") + " " + (vertPos + "px");   // 1st = h, 2nd = v
  console.log(position);

  if (!hole && image.id != "card2")
    image.style.objectPosition = position;
  if (hole)
    image.style.objectPosition = position;

/*space between cards set*/
  if (player == 0)
    dealer.margin += 175;
  else
    you.margin += 205;
}

/* Score calculates the totalScore for each player*/
function score(player, cardVal) {
  var card = (cardVal % 13) + 1;
  var ace = 0;
  switch(true) {
    case (card > 10):
      var cardValue = 10;
      break;
    case (card == 1):
      var cardValue = 0;
      ace = 1;
      break;
    default:
      var cardValue = card;
      break
  }
  if (player == 0) {
    dealer.score = dealer.score + cardValue;
    dealer.aces = dealer.aces + ace;
  } else {
    you.score = you.score + cardValue;
    you.aces = you.aces + ace;

  }
  console.log(cardValue);

}

/* calculating the card value of face card = 10, other cards equal num value on card*/
function doMath(input) {
  var card = (input % 13) + 1;
  if (card > 10)
    return 10;
  else
    return card;
}

function setStartValues() {
  dealer.margin = 30;
  dealer.score = 0;
  dealer.totalScore = 0;
  dealer.aces = 0;
  dealer.hold = false;
  dealer.bust = false;
  dealer.cardVal = 0;
  dealer.offset = 0;
  dealer.suit = -1;

  you.margin = 30;
  you.score = 0;
  you.totalScore = 0;
  you.aces = 0;
  you.hold = false;
  you.bust = false;
}

function shuffleCards() {
  arr = [];
  var starting = 1;
  while(starting < 53){
    arr.push(starting++);
  }
  shuffle(arr);
}


function shuffle(array) {
  // stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
