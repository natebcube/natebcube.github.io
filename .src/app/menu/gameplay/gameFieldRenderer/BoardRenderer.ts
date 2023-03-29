import * as PIXI from 'pixi.js';
import AnimatedGameSprite from './AnimatedGameSprite';
import { gamePieceColors, gamePieceTypes, characterGemTints, RectPart } from '../../../enums/enums';
import BaseGamePiece from '../GamePiece/GamePieceBase';
import SpriteUtils from '../../../utils/SpriteUtils';

/**
 * Render board and avtive pieces using PIXI.js
 */
export default class BoardRenderer extends PIXI.Container {

    rows;
    cols;
    rowsOffset;
    blockSize;
    textures: any = {};
    sprites: AnimatedGameSprite[][];
    private game:any;
    private posX:number;
    private posY:number;

    /**
     * Initialize renderer
     * @param {Number} rows       Number of visible rows
     * @param {Number} cols       Number of visible columns
     * @param {Number} rowsOffset Number of rows in model to skip from rendering
     * @param {Number} blockSize  Target block size
     */
    constructor(game, rows:number, cols:number, rowsOffset:number, blockSize:number) 
    {
        super();
        this.game = game;
        this.rows = rows;
        this.cols = cols;       
        this.rowsOffset = rowsOffset;
        this.blockSize = blockSize;

        this.textures.background = [SpriteUtils.getTexture('gridBackground')];
        this.textures.objective = [SpriteUtils.getTexture('gridBackground')];
        this.textures.objective1 = [SpriteUtils.getTexture('gridBackground')];
        this.textures.objective2 = [SpriteUtils.getTexture('gridBackground')];
        this.textures.objective3 = [SpriteUtils.getTexture('gridBackground')];
        this.textures.objective4 = [SpriteUtils.getTexture('gridBackground')];
        this.textures.gem1 = [SpriteUtils.getTexture('gem1')];
        this.textures.gem2 = [SpriteUtils.getTexture('gem2')];
        this.textures.gem3 = [SpriteUtils.getTexture('gem3')];
        this.textures.gem4 = [SpriteUtils.getTexture('gem4')];
        this.textures.fusionGem1 = [SpriteUtils.getTexture('fusionGem1')];
        this.textures.fusionGem2 = [SpriteUtils.getTexture('fusionGem2')];
        this.textures.fusionGem3 = [SpriteUtils.getTexture('fusionGem3')];
        this.textures.fusionGem4 = [SpriteUtils.getTexture('fusionGem4')];
        this.textures.gemR = [SpriteUtils.getTexture('gemR')];
        this.textures.gemN = [SpriteUtils.getTexture('gemN')];
        this.textures.star1 = [SpriteUtils.getTexture('star1')];
        this.textures.star2 = [SpriteUtils.getTexture('star2')];
        this.textures.star3 = [SpriteUtils.getTexture('star3')];
        this.textures.star4 = [SpriteUtils.getTexture('star4')];
        this.textures.trash1 = [SpriteUtils.getTexture('trash1')];
        this.textures.trash2 = [SpriteUtils.getTexture('trash2')];
        this.textures.trash3 = [SpriteUtils.getTexture('trash3')];
        this.textures.trash4 = [SpriteUtils.getTexture('trash4')];
        
        this.setBoardBackground();
        this.sprites = [];

        for (let i = 0; i < this.rows; i++) {
            let row = [];
            for (let j = 0; j < this.cols; j++) {
                var spr = SpriteUtils.createSprite('gemN', 0, 0);
                spr.scale.set(0.5);
                spr.position.set(j * this.blockSize, i * this.blockSize);
                this.addChild(spr);

                let sprite = new AnimatedGameSprite(this.textures.background);

                sprite.x = j * this.blockSize;
                sprite.y = i * this.blockSize;
                sprite.blockColor = gamePieceColors.none;
                sprite.alpha = 0;
                sprite.scale.set(0.5);
                //sprite.textures = this.textures.gemN;
                row.push(sprite);
                this.addChild(sprite);

                
            }
            this.sprites.push(row);
        }
        // console.log(this.sprites);

        

    }

    private setBoardBackground() 
    {
        const background = new PIXI.Graphics();
        background.lineStyle(20, 0xFFFFFF, 1);
        background.beginFill(0x000000, 0);
        background.drawRoundedRect(0, 0, this.blockSize * this.cols, this.blockSize * this.rows, 5);
        background.endFill();
        background.pivot.set(0.5);
        //background.width = this.blockSize * this.cols;
        //background.height = this.blockSize * this.rows + 50;
        background.scale.x = 1 / this.scale.x;
        background.scale.y = 1 / this.scale.y;
        this.addChild(background);
    }
    
    /**
     * Resetea cada sprite para que sea normal
     */
    resetPartOfFusion()
    {
        for (let r = 0; r < this.rows; r++) {           
            for (let c = 0; c < this.cols; c++) 
            {
                var sprite = this.sprites[r][c];
                sprite.partOfFusion = false;  
            }
        }
    }
    
    UpdateSpriteFusionGem(row:number, col:number, rectPart:number)
    {   
        var sprite = this.sprites[row][col];          
        sprite.partOfFusion = true;                
        sprite.rectPart = rectPart;        
    }
    
    updateColor(row, col, color, type, timer) {
        
        if (row < 0) return;

        let sprite = this.sprites[row][col];

        //if there are no changes on the board, do nothing
        if (
            sprite.blockColor === color
            && sprite.blockTimer === timer
            && sprite.blockType === type
        ) {
            // console.log("no changes");
            return;
        }

        sprite.blockColor = color;

        if (type === gamePieceTypes.trash)
            sprite.updateBlockTimerDisplay(timer);
        else
            sprite.blockTimerDisplay.alpha = 0;


        switch (color) {
            case gamePieceColors.none:
                sprite.textures = this.textures.background;
                sprite.tint = 0xffffff;
                sprite.partOfFusion = false;
                if (type === gamePieceTypes.objective) {
                    sprite.textures = this.textures.objective;
                }

                sprite.alpha = 0;
                break;
            case gamePieceColors.gem1:
                // sprite.blockTimerDisplay.alpha = 0;
                if(sprite.partOfFusion)
                {
                    sprite.textures = this.getFusionGemsPartSprite(gamePieceColors.gem1, sprite.rectPart);
                }else{
                    if (type === gamePieceTypes.gem)
                        sprite.textures = this.textures.gem1;
                    if (type === gamePieceTypes.star)
                        sprite.textures = this.textures.star1;
                    if (type === gamePieceTypes.objective) {
                        sprite.textures = this.textures.objective1;
                    }
                    if (type === gamePieceTypes.trash) {
                        sprite.blockTimerDisplay.alpha = 1;
                        sprite.textures = this.textures.trash1;
                    }
                }
                
                sprite.alpha = 1;
                break;
            case gamePieceColors.gem2:
                // sprite.blockTimerDisplay.alpha = 0;
                if(sprite.partOfFusion)
                {
                    sprite.textures = this.getFusionGemsPartSprite(gamePieceColors.gem2, sprite.rectPart);
                }else{
                    if (type === gamePieceTypes.gem)
                        sprite.textures = this.textures.gem2;
                    if (type === gamePieceTypes.star)
                        sprite.textures = this.textures.star2;
                    if (type === gamePieceTypes.objective) {
                        sprite.textures = this.textures.objective2;
                    }
                    if (type === gamePieceTypes.trash) {
                        sprite.blockTimerDisplay.alpha = 1;
                        sprite.textures = this.textures.trash2;
                    }
                }
                sprite.alpha = 1;
                break;
            case gamePieceColors.gem3:
                // sprite.blockTimerDisplay.alpha = 0;
                if(sprite.partOfFusion)
                {
                    sprite.textures = this.getFusionGemsPartSprite(gamePieceColors.gem3, sprite.rectPart);
                }else{
                    if (type === gamePieceTypes.gem)
                        sprite.textures = this.textures.gem3;
                    if (type === gamePieceTypes.star)
                        sprite.textures = this.textures.star3;
                    if (type === gamePieceTypes.objective) {
                        sprite.textures = this.textures.objective3;
                    }
                    if (type === gamePieceTypes.trash) {
                        sprite.blockTimerDisplay.alpha = 1;
                        sprite.textures = this.textures.trash3;
                    }
                }
                sprite.alpha = 1;
                break;
            case gamePieceColors.gem4:
                // sprite.blockTimerDisplay.alpha = 0;
                if(sprite.partOfFusion)
                {                                      
                    sprite.textures = this.getFusionGemsPartSprite(gamePieceColors.gem4, sprite.rectPart);
                }else{
                    if (type === gamePieceTypes.gem)
                        sprite.textures = this.textures.gem4;
                    if (type === gamePieceTypes.star)
                        sprite.textures = this.textures.star4;
                    if (type === gamePieceTypes.objective) {
                        sprite.textures = this.textures.objective4;
                    }
                    if (type === gamePieceTypes.trash) {
                        sprite.blockTimerDisplay.alpha = 1;
                        sprite.textures = this.textures.trash4;
                    }
                }
                sprite.alpha = 1;
                break;
            case gamePieceColors.gemR:
                // sprite.blockTimerDisplay.alpha = 0;
                if (type === gamePieceTypes.gem)
                    sprite.textures = this.textures.gemR;
                if (type === gamePieceTypes.star)
                    sprite.textures = this.textures.gemR;
                if (type === gamePieceTypes.objective) {
                    sprite.textures = this.textures.gemR;
                }
                sprite.alpha = sprite.partOfFusion ? 0.5 : 1;
                break;

            default:
                // sprite.blockTimerDisplay.alpha = 0;
                sprite.textures = this.textures.gem1;
                sprite.alpha = 0;

                break;
        }
    }

    getFusionGemsPartSprite(gemId:number, rectPart: number):PIXI.Texture[]
    {
        let suffix:string;
        //console.log("gemId: "+gemId+" -- rectPart: "+rectPart);
        
        switch(rectPart)
        {
            case RectPart.UP:
                suffix = 'up';
                break;
            case RectPart.UP_LEFT:
                suffix = 'up_left';
                break;
            case RectPart.UP_RIGHT:
                suffix = 'up_right';
                break;
            case RectPart.DOWN:
                suffix = 'down';
                break;
            case RectPart.DOWN_LEFT:
                suffix = 'down_left';
                break;
            case RectPart.DOWN_RIGHT:
                suffix = 'down_right';
                break;
            case RectPart.CENTER:
                suffix = 'center';
                break;
            case RectPart.LEFT:                
                suffix = 'left';
                break;
            case RectPart.RIGHT:
                suffix = 'right';
                break;
            default:
                console.error("No se encontro gemId: "+gemId+" -- rectPart: "+rectPart);
        }

        return [ SpriteUtils.getTexture('gem' + gemId + '_' + suffix) ];
    }

    updateFromBoard(board) {
        for (let i = 0; i < this.rows; ++i) {
            for (let j = 0; j < this.cols; ++j) {
                let gridCell = board.get(i + this.rowsOffset, j);
                this.updateColor(i, j, gridCell.pieceColor, gridCell.pieceType, gridCell.timer);
            }
        }
    }

    updateFromGamePiece(gamePiece: BaseGamePiece) {
        if (gamePiece) {

            gamePiece.absolutePos().forEach((pos, index) => {
                this.updateColor(pos[0] - this.rowsOffset, pos[1], gamePiece.gamePieceComponent[index].pieceColor, gamePiece.gamePieceComponent[index].pieceType, gamePiece.gamePieceComponent[index].timer);
            });
        }
    }


    dimGamePieces(gemsToClean, timer) {

        let result = false;

        if (gemsToClean.length > 0) {


            gemsToClean.forEach((pos, index) => {

                let tint = 0X000000;

                if (this.sprites[pos[0]][pos[1]].blockColor == gamePieceColors.gem1) {
                    tint = characterGemTints.pearl;
                }
                if (this.sprites[pos[0]][pos[1]].blockColor == gamePieceColors.gem2) {
                    tint = characterGemTints.steven;
                }
                if (this.sprites[pos[0]][pos[1]].blockColor == gamePieceColors.gem3) {
                    tint = characterGemTints.garnet;
                }
                if (this.sprites[pos[0]][pos[1]].blockColor == gamePieceColors.gem4) {
                    tint = characterGemTints.amethyst;
                }

                this.sprites[pos[0]][pos[1]].tint = tint;
                this.sprites[pos[0]][pos[1]].alpha = timer;
                this.sprites[pos[0]][pos[1]].rectPart = -1;
                this.sprites[pos[0]][pos[1]].partOfFusion = false;

                if (index === gemsToClean.length - 1) {
                    if ((timer -= 0.1) <= 0) {
                        result = true;
                    }
                }
            });
        }

        return result;

    }

    //----- Animation Functions
    setUpAnimationFrames(sequence) {
        const animationTextures = [];
        let i;
        for (i = 0; i < sequence.length; i++) {
            const texture = PIXI.Texture.from(sequence[i]);
            animationTextures.push(texture);
        }
        return animationTextures;
    }
}
