import { gamePieceTypes, gamePieceColors, RectPart } from "../../../enums/enums";


export default class GamePieceComponent {

    public rectPart: RectPart;
    public pieceType: gamePieceTypes;
    public pieceColor: gamePieceColors;
    public rectId: number = -1;
    public timer = 0;
    public canMove:boolean = false; // es usado unicamente para cuando hace parte de un rectagulo    
    public fusionGem: boolean = false; // Denotes a gem being part of a group of fusion Gems
    
    /**
     * @param pieceColor 
     * @param pieceType 
     * @param timer 
     */
    constructor(pieceColor: gamePieceColors, pieceType: gamePieceTypes, timer: number) 
    {
        this.pieceType = pieceType;
        this.pieceColor = pieceColor;
        this.timer = timer;
        this.rectId = -1;
        this.canMove = false;
        this.fusionGem = false;
    }

    decreaseTimer(amount) 
    {
        this.timer -= amount;
        if (this.timer <= 0) {
            this.clearTimer()
        }
    }

    increaseTimer(amount) 
    {
        this.timer += amount;
    }

    clearTimer() 
    {
        this.timer = 0;
        this.pieceType = gamePieceTypes.gem;
    }

}
