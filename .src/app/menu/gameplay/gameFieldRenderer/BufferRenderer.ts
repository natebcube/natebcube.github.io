import * as PIXI from 'pixi.js';
import AnimatedGameSprite from "./AnimatedGameSprite";
import { gamePieceColors, gamePieceTypes } from '../../../enums/enums';
import { viewport } from '../../../config';
import SpriteUtils from '../../../utils/SpriteUtils';

/**
 * Render renders the upcoming game pieces using PIXI.js
 */
export default class BufferRenderer extends PIXI.Container {

    textures: any = {};
    sprites: AnimatedGameSprite[][];
    rows;
    cols;
    rowsOffset;
    blockSize;

    constructor(rows, cols, blockSize) {
        super();

        this.rows = rows;
        this.cols = cols;
        this.blockSize = blockSize;

        this.textures.background =  [SpriteUtils.getTexture('gridBackground')];

        this.textures.gem1 = [SpriteUtils.getTexture('gem1')];
        this.textures.gem2 = [SpriteUtils.getTexture('gem2')];
        this.textures.gem3 = [SpriteUtils.getTexture('gem3')];
        this.textures.gem4 = [SpriteUtils.getTexture('gem4')];
        this.textures.star1 = [SpriteUtils.getTexture('star1')];
        this.textures.star2 = [SpriteUtils.getTexture('star2')];
        this.textures.star3 = [SpriteUtils.getTexture('star3')];
        this.textures.star4 = [SpriteUtils.getTexture('star4')];
        this.textures.trash1 = [SpriteUtils.getTexture('trash1')];
        this.textures.trash2 = [SpriteUtils.getTexture('trash2')];
        this.textures.trash3 = [SpriteUtils.getTexture('trash3')];
        this.textures.trash4 = [SpriteUtils.getTexture('trash4')];


        this.sprites = [];

        for (let i = 0; i < this.rows; ++i) {
            let row = [];
            for (let j = 0; j < this.cols; ++j) {

                let sprite = new AnimatedGameSprite(this.textures.background);

                sprite.x = j * this.blockSize;
                sprite.y = i * this.blockSize;
                sprite.blockColor = gamePieceColors.none;
                sprite.scale.set(viewport.gemScale);
                sprite.alpha = 0;
                row.push(sprite);
                this.addChild(sprite);
            }
            this.sprites.push(row);
        }
        // console.log(this.sprites);

        this.setBoardBackground();

    }

    private setBoardBackground() {
        const background = new PIXI.Graphics();
        // background.lineStyle(3, 0xa06a0, 1);
        background.beginFill(0x573A8A, 0.35);
        background.drawRoundedRect(0, 0, this.blockSize * this.cols, this.blockSize * this.rows, 10);
        background.endFill();
        background.pivot.set(0.5)
        background.width = this.blockSize * this.cols;
        background.height = this.blockSize * this.rows;
        background.scale.x = 1 / this.scale.x;
        background.scale.y = 1 / this.scale.y;
        this.addChildAt(background, 0);
    }   

    
    updateColor(row, col, color, type) {
        if (row < 0) return;

        let sprite = this.sprites[row][col];

        //if there are no changes in the board, do nothing
        if (
            sprite.blockColor === color
            // && sprite.blockTimer === timer
            && sprite.blockType === type
        ) {

            return;
        }

        sprite.blockColor = color;

        // if (type === gamePieceTypes.trash)
        //     sprite.updateBlockTimerDisplay(timer);
        // else
        sprite.blockTimerDisplay.alpha = 0;


        switch (color) {
            case gamePieceColors.none:
                sprite.textures = this.textures.background;
                sprite.alpha = 0;
                break;
            case gamePieceColors.gem1:
                // sprite.blockTimerDisplay.alpha = 0;
                if (type === gamePieceTypes.gem)
                    sprite.textures = this.textures.gem1;
                if (type === gamePieceTypes.star)
                    sprite.textures = this.textures.star1;
                if (type === gamePieceTypes.trash) {
                    sprite.blockTimerDisplay.alpha = 1;
                    sprite.textures = this.textures.trash1;
                }
                sprite.alpha = 1;
                break;
            case gamePieceColors.gem2:
                // sprite.blockTimerDisplay.alpha = 0;
                if (type === gamePieceTypes.gem)
                    sprite.textures = this.textures.gem2;
                if (type === gamePieceTypes.star)
                    sprite.textures = this.textures.star2;
                if (type === gamePieceTypes.trash) {
                    sprite.blockTimerDisplay.alpha = 1;
                    sprite.textures = this.textures.trash2;
                }
                sprite.alpha = 1;
                break;
            case gamePieceColors.gem3:
                // sprite.blockTimerDisplay.alpha = 0;
                if (type === gamePieceTypes.gem)
                    sprite.textures = this.textures.gem3;
                if (type === gamePieceTypes.star)
                    sprite.textures = this.textures.star3;
                if (type === gamePieceTypes.trash) {
                    sprite.blockTimerDisplay.alpha = 1;
                    sprite.textures = this.textures.trash3;
                }
                sprite.alpha = 1;
                break;
            case gamePieceColors.gem4:
                // sprite.blockTimerDisplay.alpha = 0;
                if (type === gamePieceTypes.gem)
                    sprite.textures = this.textures.gem4;
                if (type === gamePieceTypes.star)
                    sprite.textures = this.textures.star4;
                if (type === gamePieceTypes.trash) {
                    sprite.blockTimerDisplay.alpha = 1;
                    sprite.textures = this.textures.trash4;
                }
                sprite.alpha = 1;
                break;

            default:
                // sprite.blockTimerDisplay.alpha = 0;
                sprite.textures = this.textures.gem1;
                sprite.alpha = 0;

                break;
        }




    }


    updateFromBoard(board) {
        // for (let i = 0; i < this.rows; ++i) {
        for (let j = 0; j < this.cols; ++j) {
            let gridCell = board[j];
            // console.log("HERE ! :");
            // console.log(gridCell);
            // console.log(board);
            this.updateColor(0, j, gridCell[0], gridCell[1]);
        }
        // }
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