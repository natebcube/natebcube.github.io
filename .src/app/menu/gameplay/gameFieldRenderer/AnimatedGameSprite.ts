import * as PIXI from 'pixi.js';
import { gamePieceColors, gamePieceTypes } from '../../../enums/enums';
import { playerScoreUITextStyle } from '../../../textStyles/textStyles';

export default class AnimatedGameSprite extends PIXI.AnimatedSprite {
    public blockColor: gamePieceColors;
    public blockType: gamePieceTypes;
    public partOfFusion: boolean = false;
    public blockTimer: number;
    public blockTimerDisplay: PIXI.Text; //Used to display the currect timer value for trash game pieces
    public rectPart:number = -1;
    
    constructor(textures: PIXI.Texture[]) {
        super(textures);
        this.blockTimer = 5;
        this.blockTimerDisplay = new PIXI.Text(this.blockTimer.toString(), playerScoreUITextStyle);
        this.addChild(this.blockTimerDisplay);

        if (this.blockType === gamePieceTypes.trash) {
            this.blockTimerDisplay.alpha = 1;
        }
        else {
            this.blockTimerDisplay.alpha = 0;
        }
    }

    public updateBlockTimerDisplay(amount) {
        // console.log("NEW TIMER IS !!!!!!!!!!!!!!")
        // console.log("NEW TIMER IS !!!!!!!!!!!!!!")
        // console.log("NEW TIMER IS !!!!!!!!!!!!!!")
        // console.log(amount)
        this.blockTimer = amount;
        // console.log(this.blockTimer)
        this.blockTimerDisplay.text = this.blockTimer.toString();
        // console.log(this.blockTimerDisplay.text)

        // this.blockTimerDisplay.alpha = 0;
        // this.blockTimerDisplay.alpha = 1;
    }

}
