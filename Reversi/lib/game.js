let readline = require("readline");
let Piece = require("./piece.js");
let Board = require("./board.js");

function Game () {
  this.board = new Board();
  this.turn = "black";
};

Game.prototype._flipTurn = function () {
  this.turn = (this.turn == "black") ? "white" : "black";
};

let rlInterface;

Game.prototype.play = function () {
  rlInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  this.runLoop(function () {
    rlInterface.close();
    rlInterface = null;
  });
};

Game.prototype.playTurn = function (callback) {
  this.board.print();
  rlInterface.question(
    this.turn + ", where do you want to move?",
    handleResponse.bind(this)
  );

  function handleResponse(answer) {
    let pos = JSON.parse(answer);
    if (!this.board.validMove(pos, this.turn)) {
      console.log("Invalid move!");
      this.playTurn(callback);
      return;
    }

    this.board.placePiece(pos, this.turn);
    this._flipTurn();
    callback();
  }
};

Game.prototype.runLoop = function (overCallback) {
  if (this.board.isOver()) {
    console.log("The game is over!");
    overCallback();
  } else if (!this.board.hasMove(this.turn)) {
    console.log(this.turn + " has no move!");
    this._flipTurn();
    this.runLoop();
  } else {
    this.playTurn(this.runLoop.bind(this, overCallback));
  }
};

module.exports = Game;
