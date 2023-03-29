import { gamePieceTypes, gamePieceColors } from "../../../enums/enums";
import GamePieceComponent from "./GamePieceComponent";


export default class BaseGamePiece {

    public row: number;
    public col: number;
    public gamePieceComponent: GamePieceComponent[];
    public currentPieceShape: number[][];


    /**
     * Return absolute (real on-grid position) positions of the gems,
     * without changing current position.
     * Additional arguments are used to modify returned positions and simulate movement.
    * @param   {Number} shiftRow = 0     shifts row position
    * @param   {Number} shiftCol = 0     shifts column position
    * @param   {Boolean} rotate = false  use next shape rotation
    * @returns {Array} list of block positions, each being a two element list [row, col]
    */
    public absolutePos(shiftRow = 0, shiftCol = 0, rotate = false) 
    {
        return [];
    }

}