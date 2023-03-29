import BaseGamePiece from "./GamePieceBase";
import GamePieceComponent from "./GamePieceComponent";


export default class GamePiece extends BaseGamePiece {

    rotationAmount;
    private shapeRotationMatrix = [
        [[0, 1], [1, 1]],
        [[1, 0], [1, 1]],
        [[2, 1], [1, 1]],
        [[1, 2], [1, 1]]
    ];



    constructor(pieceColor1, pieceType1, pieceColor2, pieceType2) {

        super();

        this.gamePieceComponent = [new GamePieceComponent(pieceColor1, pieceType1, 0), new GamePieceComponent(pieceColor2, pieceType2, 0)]

        // this.pieceType = [pieceType1, pieceType2];
        // this.pieceColor = [pieceColor1, pieceColor2];
        this.rotationAmount = 0;
        this.currentPieceShape = this.shapeRotationMatrix[0];
        // left top of shape 4x4 grid
        this.row = 0;
        this.col = 0;
    }

    rotate() {
        this.rotationAmount = (this.rotationAmount + 1) % 4;
        this.currentPieceShape = this.shapeRotationMatrix[this.rotationAmount];
    }

    getShapeRotationMatrixLenght() {
        return this.shapeRotationMatrix.length;
    }

    getRotationShape(amount) {
        const rotation = (amount + 1) % 4;
        return this.shapeRotationMatrix[rotation];
    }

    /**
     * Return absolute (real on-grid position) positions of the gems,
     * without changing current position.
     * Additional arguments are used to modify returned positions and simulate movement.
    * @param   {Number} shiftRow = 0     shifts row position
    * @param   {Number} shiftCol = 0     shifts column position
    * @param   {Boolean} rotate = false  use next shape rotation
    * @returns {Array} list of block positions, each being a two element list [row, col]
    */
    absolutePos(shiftRow = 0, shiftCol = 0, rotate = false) {
        let shape = rotate ? this.shapeRotationMatrix[(this.rotationAmount + 1) % 4] : this.currentPieceShape;
        return shape.map(pos => [this.row + shiftRow + pos[0],
        this.col + shiftCol + pos[1]]);
    }
}