import GameScene from './GameScene';
import { gameCharacters } from '../enums/enums';
import SpriteUtils from '../utils/SpriteUtils';
import Characters from '../Characters';
import { dialogueText } from '../textStyles/textStyles';
import { gameOverButtonTextStyle } from '../textStyles/textStyles';
import { game, viewport } from '../config';
import Localization from '../controller/Localization';
import Debug from '../Debug';
import { GameApp } from '../app';

/**
 * Display Cutscene Screen, used for endings
 */
export default class DialogueScene extends GameScene {
    characterSprite: PIXI.Sprite;
    opponentSprite: PIXI.Sprite;
    characterText: PIXI.Text;
    opponentText: PIXI.Text;
    instructionText: PIXI.Text;
    private opponentDialogBackground: PIXI.Sprite;
    private characterDialogBackground: PIXI.Sprite;
    
    isPlayerSpeaking: boolean;
    currentDialogLine: number;
    totalDialogueLines: number;
    dialogPreffix: string;

    finalCallback: Function;
    onNext: Function;

    private sequentialDialog: boolean;
    private playerTypeWritingWords: Array<string>;
    private playerTypeWritingText: string;
    private playerTypeWritingCounter: number;
    private opponentTypeWritingWords: Array<string>;
    private opponentTypeWritingText: string;
    private opponentTypeWritingCounter: number;
    private dialogLines: any;
    private shownImage: PIXI.AnimatedSprite;

    constructor(game) {
        super(game, '', 'stage1BattleBG');
        this.game = game;
        this.playerTypeWritingText = '';
        this.playerTypeWritingWords = [];
        this.playerTypeWritingCounter = 0;
        this.opponentTypeWritingText = '';
        this.opponentTypeWritingWords = [];
        this.opponentTypeWritingCounter = 0;
        setTimeout(() => this.initLayout(), 0); // This has to be delayed in order for the container to be scaled correctly when there are children off view
        setInterval(() => this.nextType(), 100);
    }

    initLayout() {
        const gameWidth = viewport.width;
        const gameHeight = viewport.height;
        this.characterDialogBackground = this.addChild(SpriteUtils.createSprite('dialogueTextBackground', gameWidth, 140 - 50, { flip: true }));
        this.characterSprite = SpriteUtils.createSprite(Characters.getPortraitKey(gameCharacters.steven), 0, 564 -50, { yanchor: 'bottom' });
        this.characterText = SpriteUtils.createText('', 500, 170 - 50, dialogueText);

        this.opponentDialogBackground = this.addChild(SpriteUtils.createSprite('dialogueTextBackground', 0, 630 -50 ));
        this.opponentSprite = SpriteUtils.createSprite(Characters.getPortraitKey(gameCharacters.steven), gameWidth, 1058 -50, { yanchor: 'bottom', xanchor: 'left', flip: true });
        this.opponentText = SpriteUtils.createText('', 600, 660 - 50, dialogueText);

        this.shownImage = SpriteUtils.createAnimatedSprite('blank', gameWidth / 2, (gameHeight / 2)-10 , { xanchor: "center", yanchor: "top" });
        this.shownImage.animationSpeed = 0.02;
        this.shownImage.loop = true;
        
        if(this.game.isMobile)
        {
            this.instructionText =  SpriteUtils.createText('', this.shownImage.x+100 , this.shownImage.y + 280 ,gameOverButtonTextStyle);            
        }
        else
         this.instructionText =  SpriteUtils.createText('', this.shownImage.x + 100, this.shownImage.y + 280 ,gameOverButtonTextStyle);

        this.addChild(this.characterSprite);
        this.addChild(this.opponentSprite);
        this.addChild(this.characterText);
        this.addChild(this.opponentText);
        this.addChild(this.shownImage);
        this.addChild(this.instructionText);
        this.shownImage.visible = false;
        const nextArrow = SpriteUtils.createSprite('backArrow', gameWidth - 138, 106, { centered: true, flip: true, action: () => {
            this.onNext();
        }});
        this.opponentDialogBackground.visible = false;
        this.opponentSprite.visible = false;
        this.opponentText.visible = false;
        this.addChild(nextArrow);
    }

    enter(opts: {character: gameCharacters, opponent: gameCharacters, dialogue: any, stageNumber: number, defeated: boolean, cb: any }) {
        this.updateBackground(SpriteUtils.getTexture('stage' + opts.stageNumber + 'BattleBG'));
        SpriteUtils.swapTexture(this.characterSprite, Characters.getPortraitKey(opts.character));
        SpriteUtils.swapTexture(this.opponentSprite, Characters.getPortraitKey(opts.opponent));
        if (opts.dialogue.type == 'scripted') {
            this.sequentialDialog = false;
            this.dialogLines = opts.dialogue.script.map(line => {
                if (line.character == 'image') {
                    line.type = 'image';
                } else if (line.character == 'animation') {
                    line.type = 'animation';
                    line.animationPreffix = line.contentId.split(',')[0];
                    line.animationFrames = parseInt(line.contentId.split(',')[1], 10);
                } else if (line.character == 'responsiveAnimation') {
                    line.type = 'animation';
                    line.animationPreffix = line.contentId.split(',')[0];
                    line.animationFrames = parseInt(line.contentId.split(',')[1], 10);
                    if (this.game.isMobile) {
                        line.animationPreffix += 'touch-'
                    } else {
                        line.animationPreffix += 'keyboard-'
                    }
                }
                else if(line.character == 'instruction')
                {
                    line.type ='instruction';
                }
                else {
                    
                    line.type = 'text';
                    line.text = "tutorial_" + line.contentId;
                    line.isPlayer = line.character == Characters[opts.character].inGameSpriteKey;
                }
                return line;
            });
            this.totalDialogueLines = this.dialogLines.length;
            this.currentDialogLine = 0;
        } else {
            this.sequentialDialog = true;
            if (opts.dialogue.start == 'player') {
                this.isPlayerSpeaking = true;
            } else {
                this.isPlayerSpeaking = false;
            }
            this.totalDialogueLines = opts.dialogue.lines;
            this.dialogPreffix = opts.dialogue.preffix;
            this.currentDialogLine = 0;
        }
        
        this.characterText.text = '';
        this.opponentText.text = '';
        this.resetTypewriting();
        this.showNextDialogue();
        this.finalCallback = opts.cb;
    }

    resetTypewriting() {
        this.playerTypeWritingText = '';
        this.opponentTypeWritingText = '';
        this.playerTypeWritingWords = [];
        this.playerTypeWritingCounter = 0;
        this.opponentTypeWritingWords = [];
        this.opponentTypeWritingCounter = 0;
    }

    startTypewriting(forPlayer: boolean, text: string) {
        this.stopTypewriting(!forPlayer);
        if (forPlayer) {
            this.characterText.text = '';
            this.playerTypeWritingText = text;
            this.playerTypeWritingWords = text.split(' ');
            this.playerTypeWritingCounter = 0;
        } else {
            this.opponentText.text = '';
            this.opponentTypeWritingText = text;
            this.opponentTypeWritingWords = text.split(' ');
            this.opponentTypeWritingCounter = 0;
        }
    }

    stopTypewriting(forPlayer: boolean) {
        if (forPlayer) {
            this.characterText.text = this.playerTypeWritingText;
            this.playerTypeWritingCounter = this.playerTypeWritingWords.length;
        } else {
            this.opponentText.text = this.opponentTypeWritingText;
            this.opponentTypeWritingCounter = this.opponentTypeWritingWords.length;
        }
    }

    nextType() {
        if (this.playerTypeWritingCounter < this.playerTypeWritingWords.length) {
            this.characterText.text = this.characterText.text + this.playerTypeWritingWords[this.playerTypeWritingCounter] + ' ';
            this.playerTypeWritingCounter++;
        }
        if (this.opponentTypeWritingCounter < this.opponentTypeWritingWords.length) {
            this.opponentText.text = this.opponentText.text + this.opponentTypeWritingWords[this.opponentTypeWritingCounter] + ' ';
            this.opponentTypeWritingCounter++;
        }
    }

    showNextDialogue() {
        let dialogueLine;
        let playerSpeaking;
        if (this.sequentialDialog) {
            dialogueLine = this.dialogPreffix + (this.currentDialogLine + 1);
            playerSpeaking = this.isPlayerSpeaking;
        } else {
            const dialogLine = this.dialogLines[this.currentDialogLine];
            if (dialogLine.type == 'image') {
                SpriteUtils.setSingleTexture(this.shownImage, dialogLine.contentId);
            } else if (dialogLine.type == 'animation') {
                SpriteUtils.setTextures(this.shownImage, dialogLine.animationPreffix, dialogLine.animationFrames);
            }
            else if(dialogLine.type == 'instruction')
            {
                if(this.game.isMobile)
                {   
                    if(dialogLine.contentId == 'TAP')
                        this.instructionText.y = this.shownImage.y +200 ;
                    else
                        this.instructionText.y = this.shownImage.y +280 ;
                }
    
                this.instructionText.text = Localization.loc(dialogLine.contentId);
                this.instructionText.visible = true;
                
            }
            if (dialogLine.type == 'image' || dialogLine.type == 'animation') {
                this.shownImage.visible = true;
                SpriteUtils.alignObject(this.shownImage, { xanchor: "center", yanchor: "top" });
                this.opponentDialogBackground.visible = false;
                this.opponentSprite.visible = false;
                this.opponentText.visible = false;
                this.instructionText.visible = false;
                this.currentDialogLine++;
                this.showNextDialogue();
                return;
            }
            if(dialogLine.type == 'instruction')
            {
                this.opponentDialogBackground.visible = false;
                this.opponentSprite.visible = false;
                this.opponentText.visible = false;
                this.currentDialogLine++;
                this.showNextDialogue();
                return;
            }
            dialogueLine = this.dialogLines[this.currentDialogLine].text;
            playerSpeaking = this.dialogLines[this.currentDialogLine].isPlayer;
        }
        if (playerSpeaking) {
            this.startTypewriting(true, Localization.loc(dialogueLine));
            this.characterText.alpha = 1;
            this.characterSprite.alpha = 1;
            this.characterDialogBackground.visible = true;
            this.characterSprite.visible = true;
            this.characterText.visible = true;
            this.opponentText.alpha = 0.5;
            this.opponentSprite.alpha = 0.5;
        } else {
            this.startTypewriting(false, Localization.loc(dialogueLine));
            this.opponentText.alpha = 1;
            this.opponentSprite.alpha = 1;
            this.opponentDialogBackground.visible = true;
            this.opponentSprite.visible = true;
            this.opponentText.visible = true;
            this.characterText.alpha = 0.5;
            this.characterSprite.alpha = 0.5;
            this.shownImage.visible = false;
        }
        this.currentDialogLine++;
        if (this.currentDialogLine == this.totalDialogueLines) {
            this.onNext = () => {
                this.finalCallback();
            }
        } else {
            this.isPlayerSpeaking = !this.isPlayerSpeaking;
            this.onNext = () => {
                this.showNextDialogue();
            }
        }
    }

    update() {
        if (this.game.key["space"].trigger()) {
            this.onNext();
        }
    }

}