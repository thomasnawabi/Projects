let Piece = require("./piece");

function _makeGrid() {
  const grid = [];

  for (let i = 0; i < 8; i++) {
    let row = new Array(8);
    grid.push(row);
  }

  grid[3][3] = new Piece("white");
  grid[3][4] = new Piece("black");
  grid[4][3] = new Piece("black");
  grid[4][4] = new Piece("white");

  return grid;
}

function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

Board.prototype.getPiece = function (pos) {
  if (!this.isValidPos(pos)) {
    throw new Error("Not valid pos!");
  }

  return this.grid[pos[0]][pos[1]];
};

Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length !== 0;
};

Board.prototype.isMine = function (pos, color) {
  const piece = this.getPiece(pos);
  return piece && piece.color === color;
};

Board.prototype.isOccupied = function (pos) {
  return !!this.getPiece(pos);
};

Board.prototype.isOver = function () {
  return !this.hasMove("black") && !this.hasMove("white");
};

Board.prototype.isValidPos = function (pos) {
  return (pos[0] >= 0 && pos[0] < 8) && (pos[1] >= 0 && pos[1] < 8);
};

function _positionsToFlip(board, pos, color, dir, piecesToFlip) {
  if (!piecesToFlip) {
    piecesToFlip = [];
  } else {
    piecesToFlip.push(pos);
  }

  let nextPos = [pos[0] + dir[0], pos[1] + dir[1]];

  if (!board.isValidPos(nextPos)) {
    return null;
  } else if (!board.isOccupied(nextPos)) {
    return null;
  } else if (board.isMine(nextPos, color)) {
    return piecesToFlip.length == 0 ? null : piecesToFlip;
  } else {
    return _positionsToFlip(board, nextPos, color, dir, piecesToFlip);
  }
}

Board.prototype.placePiece = function (pos, color) {
  if (!this.validMove(pos, color)) {
    throw new Error('Invalid move!');
  }

  let positionsToFlip = [];
  for (let dirIdx = 0; dirIdx < Board.DIRS.length; dirIdx++) {

    positionsToFlip = positionsToFlip.concat(
      _positionsToFlip(this, pos, color, Board.DIRS[dirIdx]) || []
    );
  }

  for (let posIdx = 0; posIdx < positionsToFlip.length; posIdx++) {
    this.getPiece(positionsToFlip[posIdx]).flip();
  }

  this.grid[pos[0]][pos[1]] = new Piece(color);
};

Board.prototype.print = function () {
  for (let i = 0; i < 8; i++) {
    let rowString = " " + i + " |";

    for (let j = 0; j < 8; j++) {
      let pos = [i, j];
      rowString +=
        (this.getPiece(pos) ? this.getPiece(pos).toString() : ".");
    }

    console.log(rowString);
  }
};

Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)) {
    return false;
  }

  for (let i = 0; i < Board.DIRS.length; i++) {
    const piecesToFlip =
      _positionsToFlip(this, pos, color, Board.DIRS[i]);
    if (piecesToFlip) {
      return true;
    }
  }

  return false;
};

Board.prototype.validMoves = function (color) {
  const validMovesList = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (this.validMove([i, j], color)) {
        validMovesList.push([i, j]);
      }
    }
  }

  return validMovesList;
};

module.exports = Board;
