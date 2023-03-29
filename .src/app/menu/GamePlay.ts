import * as PIXI from 'pixi.js';
import { Emitter } from 'pixi-particles';
import Board from "./gameplay/Board";
import GamePieceSpawner from "./gameplay/GamePieceSpawner";
import BoardRenderer from "./gameplay/gameFieldRenderer/BoardRenderer";
import GamePiece from "./gameplay/gamePiece/GamePiece";
import config, { viewport } from "../config";
import GameScene from "./GameScene";
import BufferRenderer from './gameplay/gameFieldRenderer/BufferRenderer';
import { gameModes, gameCharacters, gamePieceTypes, gamePieceColors, gameplayBoard, gameplayStates as gameplayBoardStates, gameAIMoveOptions, gameAIStates, gameAdventureStages, gameAITypes, gameplayVictoryConditions, characterGemTints } from '../enums/enums';
import { characterNameUIStyle, playerScoreUITextStyle, enemyScoreUITextStyle, timerUITextStyle, skillPromptTextStyle, tutorialPromptDontAskStyle, versusCharacterSelectNameTextUIStyle } from '../textStyles/textStyles';
import TrashGamePiece from './gameplay/GamePiece/GamePieceTrash';
import GamePieceComponent from './gameplay/gamePiece/GamePieceComponent';
import { GameApp } from '../app';
import BaseAI from './gameplay/AI/BaseAI';
import { minionPeridotAIParams, minionJasperAIParams, minionYDAIParams, peridotAIParams, jasperAIParams, yellowDiamondAIParams, amethystAIParams, stevenAIParams, pearlAIParams, garnetAIParams } from './gameplay/AI/AIHeuristics'
import IDecisionMakingAIParams from './gameplay/AI/IDecisionMakingAIParams';
import TimerUtils from '../utils/timerUtils';
import MathUtils from '../utils/MathUtils';
import SpriteUtils from '../utils/SpriteUtils';
import Characters from '../Characters';
import { TweenMax } from "gsap/TweenMax";
import GamePaused from './gameplay/GamePaused';
import Localization from '../controller/Localization';
import TouchController from '../controller/TouchController';
import StoryController from '../controller/StoryController';
import { Linear } from "gsap/EasePack";
import InGameCharacter from './gameplay/InGameCharacter';
import SpritePulseAnimation from '../utils/SpritePulseAnimation';
import Debug from '../Debug';

/**
 * GamePlay state provides main game logic
 */
export default class GamePlay extends GameScene {

    game: GameApp;
    currentGameMode: gameModes;

    //#region Victory conditions tracking properties

    currentGameVictoryCondition: gameplayVictoryConditions;
    victoryTimerUIDisplay: PIXI.Text;
    currentGameTimer: TimerUtils; // used to determine victory conditions with time constrains
    chainsToMake: number;
    chainsToMakeCounter = 0;
    trashToSurvive: number;
    trashSurvivedCounter = 0;
    objectiveCollected: boolean = false;

    //#endregion

    //#region Player1 Properties

    //Player game components

    playerBoard: Board;
    playerSpawner: GamePieceSpawner;
    playerGamePiece: GamePiece;
    playerBoardRenderer: BoardRenderer;
    playerBufferRenderer: BufferRenderer;
    playerScore: number = 100000;
    playerScoreUI: PIXI.Text;
    playerCharacterNameUI: PIXI.Text;
    playerPointsToFillBar: number = 0;
    playerPoints: number = 0;

    playerCharacter: InGameCharacter;
    playerBoardTrashAmount: number = 0;
    playerTrashGamePiece: TrashGamePiece;
    playerOrphanedPieces: GamePieceComponent[];
    havePlayerPiecesFallen: boolean;
    playerCollectedPiecesAlpha = 1;
    playerPieceFallTimer;
    playerDropPieceFallTimer;
    playerTrashPieceFallTimer;

    currentP1Character: gameCharacters;

    currentGamePlayStatePlayer1: gameplayBoardStates;

    //#endregion

    //#region Player2/Enemy Properties

    //Enemy game components
    enemyBoard: Board;
    enemySpawner: GamePieceSpawner;
    enemyGamePiece: GamePiece;
    enemyBoardRenderer: BoardRenderer;
    enemyBufferRenderer: BufferRenderer;
    enemyScore: number = 100000;
    enemyScoreUI: PIXI.Text;
    enemyCharacterNameUI: PIXI.Text;

    enemyCharacter: InGameCharacter;
    enemyBoardTrashAmount: number = 0;
    enemyTrashGamePiece: TrashGamePiece;
    enemyOrphanedPieces: GamePieceComponent[];
    haveEnemyPiecesFallen: boolean;
    enemyCollectedPiecesAlpha = 1;
    enemyPieceFallTimer;
    enemyDropPieceFallTimer;
    enemyTrashPieceFallTimer;

    currentP2Character: gameCharacters;

    currentGamePlayStatePlayer2: gameplayBoardStates;

    //#endregion

    //#region A.I.

    currentEnemyAI: BaseAI;

    //#endregion


    gameOverTransitionBlackout: PIXI.Graphics;

    gameSpecialStarted = false;
    gameSpecialFinished = false;

    previousBoard1State: gameplayBoardStates; // Store the state before an special ability was used to continue the action
    previousBoard2State: gameplayBoardStates; // Store the state before an special ability was used to continue the action


    isPaused = false;
    isGameOver = false;
    isGameOverTransitionFinished = false;
    gameOverTransitionTimer = 100;
    previousGameOpts = {};
    gameOverOpts = {};

    currentEndJingle: string;
    endJingleTimer = -1;

    pieceFallSpeed;
    pieceFallSpeedMin;
    pieceFallSpeedupStep;
    pieceFallSpeedupDelay;
    pieceDropModifier;
    currentStage: number;
    currentLevel: number;
    arcadeFloor: number;
    pauseScreen: GamePaused;
    pauseButton: PIXI.Sprite;

    /** HUD POWER BAR */
    private playerBarSprite: PIXI.Sprite;
    private enemyBarSprite: PIXI.Sprite;
    private playerBarWidth: number; // tamaño de la barra del player
    private enemyBarWidth: number; // tamaño de la barra enemiga    
    private playerPowerbarBGSprite: PIXI.Sprite;
    private playerPowerbarIconSprite: PIXI.Sprite;
    private enemyPowerbarBGSprite: PIXI.Sprite;
    private enemyPowerbarIconSprite: PIXI.Sprite;
    private enemyPointsToFillBar: number = 0;
    private enemyPoints: number = 0;

    private gemValue: number = 4;
    private destroyedGemsP1 = 0;
    private destroyedGemsP2 = 0;
    private maxChainP1 = 0;
    private maxChainP2 = 0;

    private playerSpritePulseAnimation: SpritePulseAnimation;
    private enemySpritePulseAnimation: SpritePulseAnimation;

    // Touch variables
    private isSwiping: boolean = false;
    private touchController: TouchController;

    // Skills     
    private leftContainerAnimSkill: PIXI.Container;
    private rightContainerAnimSkill: PIXI.Container;
    private leftImageSkill: PIXI.Sprite;
    private rightImageSkill: PIXI.Sprite;
    private leftSpecialSkillAd: PIXI.Container;
    private rightSpecialSkillAd: PIXI.Container;
    private leftSkillName: PIXI.Text;
    private rightSkillName: PIXI.Text;
    private bgSpecialSkill: PIXI.Sprite;

    // Emitter
    private playerEmitter: any;
    private enemyEmitter: any;
    private emitterConfig: any;
    private isPlayingVsMinion: boolean = false;

    // tween
    private leftTween: any = null;
    private rightTween: any = null;

    constructor(game) {
        super(game, "", 'arcadeBG');

        this.game = game;

        this.playerBoardTrashAmount = 0;
        this.enemyBoardTrashAmount = 0;

        this.playerBoard = null;
        this.playerSpawner = null;
        this.playerGamePiece = null;
        this.playerTrashGamePiece = null;

        this.enemyBoard = null;
        this.enemySpawner = null;
        this.enemyGamePiece = null;
        this.enemyTrashGamePiece = null;

        this.playerBoardRenderer = new BoardRenderer(this.game, 13, 6, 0, 64);
        this.enemyBoardRenderer = new BoardRenderer(this.game, 13, 6, 0, 64);

        this.playerBufferRenderer = new BufferRenderer(1, 2, 64);
        this.enemyBufferRenderer = new BufferRenderer(1, 2, 64);

        this.playerBoardRenderer.pivot.set(0.5);
        this.enemyBoardRenderer.pivot.set(0.5);

        this.playerBufferRenderer.pivot.set(0.5);
        this.enemyBufferRenderer.pivot.set(0.5);

        this.setPlayerUIContainer();
        this.setEnemyUIContainer();
        this.setTimedVictoryCounter();

        this.setGameOverTransitionBlackout();
        this.pauseScreen = new GamePaused(false, this.game, this, viewport.width, viewport.height);

        this.registerTouchEvents();

        this.initRotateListener();

        this.endJingleTimer = -5;
        this.currentEndJingle = 'victory';

        this.CreateSpecialSkillAd();
        this.createSkillImages();

    }

    private createSkillImages() {
        this.bgSpecialSkill = SpriteUtils.createSprite('black', 0, 0);
        this.bgSpecialSkill.width = 1920;
        this.bgSpecialSkill.height = 1080;
        this.bgSpecialSkill.alpha = 0.8;
        this.bgSpecialSkill.visible = false;
        this.addChild(this.bgSpecialSkill);

        this.leftContainerAnimSkill = new PIXI.Container();
        this.addChild(this.leftContainerAnimSkill);

        this.rightContainerAnimSkill = new PIXI.Container();
        this.addChild(this.rightContainerAnimSkill);

        this.leftImageSkill = SpriteUtils.createSprite('stevenSelectionPreview', 0, 0);
        this.leftImageSkill.scale.set(1.5);
        //this.leftImageSkill.anchor.set(0,1);
        //this.leftImageSkill.position.set(-1500,viewport.height);
        this.leftImageSkill.position.set(0, 0);
        //this.addChild(this.leftImageSkill);   

        this.rightImageSkill = SpriteUtils.createSprite('stevenSelectionPreview', 0, 0);
        this.rightImageSkill.scale.set(-1.5, 1.5);
        this.rightImageSkill.anchor.set(0, 1);
        //this.rightImageSkill.position.set(viewport.width + 1500,viewport.height);
        this.rightImageSkill.position.set(viewport.width, viewport.height);
        //this.addChild(this.rightImageSkill);  

        this.leftSkillName = SpriteUtils.createText("", 0, 0, versusCharacterSelectNameTextUIStyle);
        this.leftSkillName.position.set(viewport.width / 2 + 100, viewport.height / 2);
        //this.addChild(this.leftSkillName);

        this.rightSkillName = SpriteUtils.createText("", 0, 0, versusCharacterSelectNameTextUIStyle);
        this.rightSkillName.position.set(100, viewport.height / 2);
        //this.rightImageSkill.addChild(this.rightSkillName);

        this.leftContainerAnimSkill.addChild(this.leftImageSkill);
        this.leftContainerAnimSkill.addChild(this.leftSkillName);

        this.rightContainerAnimSkill.addChild(this.rightImageSkill);
        this.rightContainerAnimSkill.addChild(this.rightSkillName);

        this.leftContainerAnimSkill.x = - 1920;
        this.rightContainerAnimSkill.x = 1920;
    }

    private CreateSpecialSkillAd() {
        this.leftSpecialSkillAd = new PIXI.Container();
        this.rightSpecialSkillAd = new PIXI.Container();

        var bgLeftSpecialSkillAd = SpriteUtils.createSprite('enemyUIContainer', 195, 150);
        bgLeftSpecialSkillAd.anchor.set(0.5);
        bgLeftSpecialSkillAd.height -= 50;
        bgLeftSpecialSkillAd.width += 50;
        this.leftSpecialSkillAd.addChild(bgLeftSpecialSkillAd);

        if (!this.game.isMobile) {
            this.leftSpecialSkillAd.addChild(SpriteUtils.createText(Localization.loc("SKILL_READY_PROMPT_P1"), 20, 40, skillPromptTextStyle, { xanchor: "left" }));
        } else {
            this.leftSpecialSkillAd.addChild(SpriteUtils.createText(Localization.loc("SKILL_READY_PROMPT_P1_MOBILE"), 20, 40, skillPromptTextStyle, { xanchor: "left" }));
        }


        var leftTxt = SpriteUtils.createText(Localization.loc("SUPER_READY"), 200, 120, characterNameUIStyle, { xanchor: "center" });
        this.leftSpecialSkillAd.addChild(leftTxt);

        var bgRightSpecialSkillAd = SpriteUtils.createSprite('enemyUIContainer', viewport.width - 170, 150);
        bgRightSpecialSkillAd.anchor.set(0.5);
        bgRightSpecialSkillAd.height -= 50;
        bgRightSpecialSkillAd.width += 50;
        this.rightSpecialSkillAd.addChild(bgRightSpecialSkillAd);

        this.rightSpecialSkillAd.addChild(SpriteUtils.createText(Localization.loc("SKILL_READY_PROMPT_P2"), viewport.width - 20, 40, skillPromptTextStyle, { xanchor: "right" }));
        var rightTxt = SpriteUtils.createText(Localization.loc("SUPER_READY"), viewport.width - 170, 120, characterNameUIStyle, { xanchor: "center" });
        this.rightSpecialSkillAd.addChild(rightTxt);

        var leftScale = bgLeftSpecialSkillAd.scale;
        var rightScale = bgRightSpecialSkillAd.scale;
        TweenMax.to(bgLeftSpecialSkillAd.scale, 0.4, { x: leftScale.x + 0.1, y: leftScale.y + 0.1, ease: Linear.easeNone, repeat: -1, yoyo: true });
        TweenMax.to(bgRightSpecialSkillAd.scale, 0.4, { x: rightScale.x + 0.1, y: rightScale.y + 0.1, ease: Linear.easeNone, repeat: -1, yoyo: true });

        this.addChild(this.leftSpecialSkillAd);
        this.addChild(this.rightSpecialSkillAd);
        this.ResetSpecialSkillAd();
    }

    private GetTextureSkill(character: gameCharacters): PIXI.Texture {
        return SpriteUtils.getTexture(Characters[character].selectionPreviewImage);
    }

    // se registran eventos para version mobile
    registerTouchEvents() {
        if (!this.game.isMobile) return;

        this.touchController = new TouchController(this.game);
        this.addChild(this.touchController);
        this.touchController.registerLeftTapAction(() => {
            this.tryMovePlayerPiece(-1);
        });
        this.touchController.registerRightTapAction(() => {
            this.tryMovePlayerPiece(1);
        });
        this.touchController.registerCenterTapAction(() => {
            this.tryRotatePlayerPiece();
        });
        this.touchController.registerSwipeAction(() => {
            this.isSwiping = true;
        });
    }

    initRotateListener() {
        window.addEventListener("resize", () => {
            if (window.innerHeight > window.innerWidth) {
                this.pauseGame(true);
            }
        });
    }

    /**
    * State awake
    */
    enter(opts) {
        //this.pauseGame(false);
        if (opts.restart || opts.newGame || this.playerBoard == null) {
            Debug.log("Opts: ", opts);
            this.pauseGame(false);
            this.previousGameOpts = opts.newGame != null ? opts : this.previousGameOpts;
            this.initGameplay(this.previousGameOpts);
            this.ResetSpecialSkillAd();
        }
    }

    private ResetSpecialSkillAd() {
        this.rightSpecialSkillAd.visible = false;
        this.leftSpecialSkillAd.visible = false;
    }

    private seconds = 0;
    /**
    * Main update funcion
    * @param {Number} dt pixi timer deltaTime
    */
    update(dt) {

        if (this.playerEmitter != null) this.playerEmitter.update(dt);
        if (this.enemyEmitter != null) this.enemyEmitter.update(dt);

        // pause the game
        if (this.game.key["escape"].trigger() || this.game.key["space"].trigger()) {
            this.pauseGame(!this.isPaused);
            if (this.isPaused)
                this.game.soundManager.playSFXSound('gamePause');
        }

        // activar victoria inmediata    
        /*
        if (this.game.key["V"].trigger()) {
            Debug.log("Call Victory");
            this.startGameOverTransition(gameplayBoard.player1Board);
        }
        
        // activar habilidad especial  
        if (this.game.key["M"].trigger()) 
        {
            Debug.log("Call Special Skill: ", this.currentGameTimer);            
            this.enemyPoints = 101;
            this.activateCharacterAbility(gameplayBoard.player2Board);                       
        }
        */

        if (this.isPaused)
            return;

        this.playerBoardRenderer.updateFromBoard(this.playerBoard);
        this.playerBufferRenderer.updateFromBoard(this.playerSpawner.getBuffer());


        this.enemyBoardRenderer.updateFromBoard(this.enemyBoard);
        this.enemyBufferRenderer.updateFromBoard(this.enemySpawner.getBuffer());

        this.handleGamePlayState(gameplayBoard.player1Board, dt);
        this.handleGamePlayState(gameplayBoard.player2Board, dt);

        if (this.currentGameVictoryCondition === gameplayVictoryConditions.timedVictory && this.currentGameTimer) {
            this.victoryTimerUIDisplay.text = this.currentGameTimer.getTimer().toString();
            //if the timer reaches zero, the player loses
            if (this.currentGameTimer.getTimer() <= 0) {
                this.startGameOverTransition(gameplayBoard.player2Board);
            }
        }

        if (this.currentGameMode !== gameModes.versusHuman) {
            this.currentEnemyAI.handleCurrentState();
        }

    }

    private ShowSkillAnimation(isPlayer: boolean, charId: gameCharacters) {
        if (isPlayer) {
            this.bgSpecialSkill.visible = true;
            //if(this.leftTween) this.leftTween.kill();         
            this.leftContainerAnimSkill.position.x = -1920;
            this.leftImageSkill.texture = this.GetTextureSkill(charId);
            this.leftTween = TweenMax.to(this.leftContainerAnimSkill, 0.3, {
                x: 0, ease: Linear.easeNone, repeat: 1, yoyo: true, repeatDelay: 1, onComplete: () => {

                    if (this.rightTween == null) {
                        this.bgSpecialSkill.visible = false;
                        this.leftTween = null;
                        this.pauseGame(false);
                    }

                }
            });

        }
        else {
            this.bgSpecialSkill.visible = true;
            //if(this.rightTween) this.rightTween.kill();
            this.rightContainerAnimSkill.position.x = 1920;
            this.rightImageSkill.texture = this.GetTextureSkill(charId);
            this.rightTween = TweenMax.to(this.rightContainerAnimSkill, 0.3, {
                x: 0, ease: Linear.easeNone, repeat: 1, yoyo: true, repeatDelay: 0.5, onComplete: () => {
                    if (this.leftTween == null) {
                        this.bgSpecialSkill.visible = false;
                        this.rightTween = null;
                        this.pauseGame(false);
                    }
                }
            });
        }
    }

    //#region GAMEPLAY PROPERTIES HANDLER

    pauseGame(pause: boolean, showPauseScreen: boolean = true) {
        (this.currentGameMode == gameModes.versusHuman) ? this.pauseScreen.UpdateGameModeToVersus(true) : this.pauseScreen.UpdateGameModeToVersus(false);
        if (this.touchController) this.touchController.interactive = !pause;
        this.isPaused = pause;
        if (this.pauseButton) this.pauseButton.interactive = !this.isPaused;
        if (showPauseScreen) this.pauseScreen.showScreen(this.isPaused);
        if (this.currentGameTimer) {
            pause ? this.currentGameTimer.pauseTimer() : this.currentGameTimer.unpauseTimer();
        }

        if (showPauseScreen) this.game.soundManager.togglePause(this.isPaused);
    }

    setGameVictoryConditions(gameMode: gameModes, victoryCondition: gameplayVictoryConditions, victoryTimer: number = 0, chainsToMake: number = 0, trashToSurviveCounter: number = 0) {
        this.currentGameMode = gameMode ? gameMode : gameModes.adventure;
        this.currentGameVictoryCondition = victoryCondition;
        if (victoryCondition === gameplayVictoryConditions.timedVictory) {
            this.currentGameTimer = new TimerUtils(victoryTimer);
            this.victoryTimerUIDisplay.text = this.currentGameTimer.getTimer().toString();
            this.victoryTimerUIDisplay.alpha = 1;
        }
        this.chainsToMake = chainsToMake;
        this.chainsToMakeCounter = chainsToMake;
        this.trashToSurvive = trashToSurviveCounter;
        this.trashSurvivedCounter = trashToSurviveCounter;
        this.objectiveCollected = false;
    }

    initGameplay(opts: any) {
        this.destroyedGemsP1 = 0;
        this.destroyedGemsP2 = 0;
        this.maxChainP1 = 0;
        this.maxChainP2 = 0;
        this.resetGameOverTransition();

        this.playerBoardTrashAmount = 0;
        this.enemyBoardTrashAmount = 0;

        //Set game mode and victory conditions
        this.setGameVictoryConditions(opts.gameMode, opts.victoryCondition, opts.victoryTimer, opts.chainsToMake, opts.trashToSurviveCounter);

        this.currentStage = opts.stage;
        this.currentLevel = opts.level;
        this.arcadeFloor = opts.arcadeFloor;

        if (!this.currentStage) {
            // This is temporary until stage selection is on
            this.currentStage = 1;
        }

        this.updateBackground(SpriteUtils.getTexture('stage' + this.currentStage + 'BattleBG'));

        var conditions = StoryController.getVictoryConditionForLevel(this.currentStage, this.currentLevel);
        Debug.log("Conditions: ", conditions);

        this.playerBoard = new Board(13, 6, null);
        this.enemyBoard = new Board(13, 6, null);

        this.playerSpawner = new GamePieceSpawner(25);
        this.enemySpawner = new GamePieceSpawner(25);


        this.playerGamePiece = null;
        this.enemyGamePiece = null;

        this.pieceFallSpeed = config.game.fallSpeed;
        this.pieceFallSpeedMin = config.game.fallSpeedMin;
        this.pieceFallSpeedupStep = config.game.fallSpeedupStep;
        this.pieceFallSpeedupDelay = config.game.fallSpeedupDelay;
        this.pieceDropModifier = config.game.dropModifier;

        this.playerPieceFallTimer = this.pieceFallSpeed;
        this.enemyPieceFallTimer = this.pieceFallSpeed;

        this.playerTrashPieceFallTimer = this.pieceFallSpeed / 3;
        this.enemyTrashPieceFallTimer = this.pieceFallSpeed / 3;

        this.enemyDropPieceFallTimer = this.pieceFallSpeed / 3;
        this.playerDropPieceFallTimer = this.pieceFallSpeed / 3; // TODO: descomentar para aumentar la velocidad 

        this.playerPoints = 0;
        this.enemyPoints = 0;

        this.setPlayerScore(0);
        this.setEnemyScore(0);

        this.updatePowerBarIndicator(0, gameplayBoard.player1Board);
        this.updatePowerBarIndicator(0, gameplayBoard.player2Board);

        this.currentP1Character = opts.p1Character;
        this.playerCharacter.setCharacter(opts.p1Character);
        this.playerCharacterNameUI.text = Localization.loc('character' + Characters[opts.p1Character].spriteKey);

        //this.playerCharacterSprite.tint = 0xff8000;
        //TweenMax.from(this.playerCharacterSprite, 0.2, { tint:0xff8000, repeat: -1, yoyo: true, repeatDelay: 0.2 });        

        this.currentP2Character = opts.p2Character;
        this.enemyCharacter.setCharacter(opts.p2Character);
        this.enemyCharacterNameUI.text = Localization.loc('character' + Characters[opts.p2Character].spriteKey);

        this.playerPointsToFillBar = this.getPointsToFillBar(this.currentP1Character);
        this.enemyPointsToFillBar = this.getPointsToFillBar(this.currentP2Character);

        //this.playerBarSprite.width = 0;
        //this.enemyBarSprite.width = 0;

        this.setBoardGamePlayState(gameplayBoardStates.spawningGamePiece, gameplayBoard.player1Board);
        this.setBoardGamePlayState(gameplayBoardStates.spawningGamePiece, gameplayBoard.player2Board);

        this.setBackgroundSountrack(opts.stage);
        let AIParams = null;



        if (this.currentGameMode !== gameModes.versusHuman) {

            switch (this.currentGameMode) {
                case gameModes.versusComputer:
                case gameModes.arcade:
                    AIParams = this.getGameAI(opts.p2Character);
                    //this.currentEnemyAI = new BaseAI(AIParams, this.enemyBoard, this.enemySpawner, () => this.activateCharacterAbility(gameplayBoard.player2Board));
                    break;

                case gameModes.adventure:
                    AIParams = this.getGameAIStoryMode(opts.stage, opts.level);
                    //this.currentEnemyAI = new BaseAI(AIParams, this.enemyBoard, this.enemySpawner, () => this.activateCharacterAbility(gameplayBoard.player2Board));
                    break;
            }
            this.currentEnemyAI = new BaseAI(AIParams, this.enemyBoard, this.enemySpawner, () => this.activateCharacterAbility(gameplayBoard.player2Board));
        }
        this.playerCharacter.reset();
        this.enemyCharacter.reset();

        this.addPauseOptionsBtn();
        this.CheckFusionGemInBoards();
        this.HidePowerBarForMinions();

        this.UpdateSkilNamePosition();

        this.isSwiping = false;
    }

    private UpdateSkilNamePosition() {
        this.rightSkillName.text = Localization.loc(Characters[this.currentP2Character].spriteKey + "SkillName");
        this.leftSkillName.text = Localization.loc(Characters[this.currentP1Character].spriteKey + "SkillName");

        this.leftSkillName.x = viewport.width - this.leftSkillName.width - 100;
        this.rightSkillName.x = 100;
    }

    // revisa si debe mostrar la barra del skill para los minions
    private HidePowerBarForMinions() {
        this.isPlayingVsMinion = (this.currentLevel < 5 && this.currentGameMode === gameModes.adventure);
        this.enemyPowerbarBGSprite.visible = !this.isPlayingVsMinion;
        this.enemyPowerbarIconSprite.visible = !this.isPlayingVsMinion;
        this.enemyBarSprite.visible = !this.isPlayingVsMinion;
    }

    addPauseOptionsBtn() {
        //add Pause Screen and button
        this.pauseButton = SpriteUtils.createSprite('btnPause', viewport.width / 2, 80,
            {
                centered: true,
                action: () => {
                    this.pauseGame(true);
                }
            }
        );
        this.pauseButton.name = "PauseBtn";
        this.addChild(this.pauseButton);
        this.addChild(this.pauseScreen);
    }

    restart() {
        var link = "modeSelectMenu";
        this.stopPlayerBarFilled();
        this.stopEnemyBarFilled();
        this.pauseGame(false);
        this.game.setState(link, { restart: true });
        this.game.soundManager.playBGXSound('mainTheme');
    }

    setBackgroundSountrack(level) {

        if (this.currentGameMode === gameModes.adventure) {

            switch (level) {
                case gameAdventureStages.stage1:

                    // Set stage soundtrack
                    this.game.soundManager.playBGXSound('vsPeridot');
                    Debug.log("playing bg track");
                    break;

                case gameAdventureStages.stage2:

                    // Set stage soundtrack
                    this.game.soundManager.playBGXSound('vsJasper');
                    Debug.log("playing bg track");

                    break;

                case gameAdventureStages.stage3:

                    // Set stage soundtrack
                    this.game.soundManager.playBGXSound('vsYellowDiamond');
                    Debug.log("playing bg track");

                    break;

                default:

                    // Set stage soundtrack
                    this.game.soundManager.playBGXSound('characterSelect');
                    break;
            }
        }
        else {
            // TODO: Define music for all game modes or something
            this.game.soundManager.playBGXSound('mainTheme');
        }

    }

    getGameAI(character): IDecisionMakingAIParams {

        let currentAIParams;
        switch (character) {
            case gameCharacters.amethyst:
                currentAIParams = amethystAIParams;
                break;

            case gameCharacters.steven:
                currentAIParams = stevenAIParams;
                break;

            case gameCharacters.pearl:
                currentAIParams = pearlAIParams;
                break;

            case gameCharacters.garnet:
                currentAIParams = garnetAIParams;
                break;

            case gameCharacters.y_diamond:
                currentAIParams = yellowDiamondAIParams;
                break;

            case gameCharacters.peridot:
                currentAIParams = peridotAIParams;
                break;

            case gameCharacters.jasper:
                currentAIParams = jasperAIParams;
                break;

            default:
                currentAIParams = minionYDAIParams;
                break;
        }

        return currentAIParams;
    }

    getGameAIStoryMode(currentStage, currentLevel): IDecisionMakingAIParams {
        let currentAIParams;

        switch (currentStage) {
            case gameAdventureStages.stage1:
                if (currentLevel <= 4) {
                    currentAIParams = minionPeridotAIParams;
                }
                else if (currentLevel === 5) {
                    currentAIParams = peridotAIParams;
                }
                break;

            case gameAdventureStages.stage2:
                if (currentLevel <= 4) {
                    currentAIParams = minionJasperAIParams;
                }
                else if (currentLevel === 5) {
                    currentAIParams = jasperAIParams;
                }
                break;

            case gameAdventureStages.stage3:
                if (currentLevel <= 4) {
                    currentAIParams = minionYDAIParams;
                }
                else if (currentLevel === 5) {
                    currentAIParams = yellowDiamondAIParams;
                }
                break;
            default:
                currentAIParams = minionYDAIParams;
                break;
        }

        return currentAIParams;
    }
    //#endregion

    //#region GAMEPLAY STATE HANDLING

    setBoardGamePlayState(state: gameplayBoardStates, board: gameplayBoard) {
        // store the previous game state
        board === gameplayBoard.player1Board ? this.previousBoard1State = this.currentGamePlayStatePlayer1 : this.previousBoard2State = this.currentGamePlayStatePlayer2;
        // set the new game state
        board === gameplayBoard.player1Board ? this.currentGamePlayStatePlayer1 = state : this.currentGamePlayStatePlayer2 = state;
    }

    handleGamePlayState(board: gameplayBoard, delta: number) {

        const state = board === gameplayBoard.player1Board ? this.currentGamePlayStatePlayer1 : this.currentGamePlayStatePlayer2;

        switch (state) {

            case gameplayBoardStates.spawningGamePiece:

                if (board === gameplayBoard.player1Board) {
                    this.spawnPlayerGamePiece();
                }

                if (board === gameplayBoard.player2Board) {
                    this.spawnEnemyGamePiece();

                    if (this.currentGameMode !== gameModes.versusHuman) {
                        this.currentEnemyAI.SpawnPiece(this.enemyGamePiece, this.enemyBoard);
                    }
                }
                break;

            case gameplayBoardStates.playingGamePieceOnField:

                if (board === gameplayBoard.player1Board) {
                    this.playerBoardRenderer.updateFromGamePiece(this.playerGamePiece);
                    this.updatePlayerGamePiece(delta);
                    /*if(this.game.isMobile)
                    {
                        this.updatePlayerGamePiece(delta);
                    }else{
                        this.updatePlayerGamePiece(delta);
                    }  */
                }
                if (board === gameplayBoard.player2Board) {
                    this.enemyBoardRenderer.updateFromGamePiece(this.enemyGamePiece);
                    this.updateEnemyGamePiece();
                }

                break;

            case gameplayBoardStates.lockingPlayingGamePiece:

                if (board === gameplayBoard.player1Board) {
                    this.lockPlayerGamePiece();
                }
                if (board === gameplayBoard.player2Board) {
                    this.lockEnemyGamePiece();
                }

                this.game.soundManager.playSFXSound('gemDrop');

                break;

            case gameplayBoardStates.droppingFloatingPieces:

                if (board === gameplayBoard.player1Board) {
                    var isThereFloatingPieces = this.dropFloatingBoardPieces(this.playerBoard, this.playerBoardRenderer, this.playerDropPieceFallTimer);

                    if (!isThereFloatingPieces) {
                        this.setBoardGamePlayState(gameplayBoardStates.decreaseTrashTimers, board);
                        // this.setBoardGamePlayState(gameplayBoardStates.spawningGamePiece, board);
                    }
                }
                if (board === gameplayBoard.player2Board) {
                    var isThereFloatingPieces = this.dropFloatingBoardPieces(this.enemyBoard, this.enemyBoardRenderer, this.enemyDropPieceFallTimer);
                    if (!isThereFloatingPieces) {
                        this.setBoardGamePlayState(gameplayBoardStates.decreaseTrashTimers, board);
                        // this.setBoardGamePlayState(gameplayBoardStates.spawningGamePiece, board);
                    }
                }

                break;

            case gameplayBoardStates.decreaseTrashTimers:

                if (board === gameplayBoard.player1Board) {
                    this.playerBoard.decreaseTrashCounters(1);
                    this.setBoardGamePlayState(gameplayBoardStates.animateActivatedGems, board);
                    if (this.playerBoard.hasTrash())
                        this.game.soundManager.playSFXSound('bubbleTick');
                }

                if (board === gameplayBoard.player2Board) {
                    this.enemyBoard.decreaseTrashCounters(1);
                    this.setBoardGamePlayState(gameplayBoardStates.animateActivatedGems, board);
                    if (this.enemyBoard.hasTrash())
                        this.game.soundManager.playSFXSound('bubbleTick');
                }


                break;

            // trigger the character's special
            case gameplayBoardStates.activateSpecialAbility:
                if (!this.gameSpecialStarted) {
                    Debug.log("activate special");
                    this.activateCharacterAbility(board);
                }

                if (this.gameSpecialFinished) {
                    Debug.log("special Ended");
                    if (board == gameplayBoard.player1Board) {
                        this.setBoardGamePlayState(this.previousBoard1State, board);
                    } else {
                        this.setBoardGamePlayState(this.previousBoard2State, board);
                    }
                    //this.setBoardGamePlayState(this.previousBoard1State, board);
                    this.gameSpecialStarted = false;
                    this.gameSpecialFinished = false;
                }

                break;

            case gameplayBoardStates.animateActivatedGems:

                if (board === gameplayBoard.player1Board) {

                    var gemsToClean = this.playerBoard.getBoardCollectablePieces();

                    if (gemsToClean.length > 0) {

                        var amountPoints = gemsToClean.length;
                        if (this.playerBoardRenderer.dimGamePieces(gemsToClean, this.playerCollectedPiecesAlpha -= 0.075)) {
                            this.playerCollectedPiecesAlpha = 1;
                            this.setBoardGamePlayState(gameplayBoardStates.activateStars, board);
                            //this.updatePowerBarIndicator(amountPoints, board);
                        }
                    }
                    else {
                        this.setBoardGamePlayState(gameplayBoardStates.checkForCombos, board)
                    }
                }

                if (board === gameplayBoard.player2Board) {

                    const gemsToClean = this.enemyBoard.getBoardCollectablePieces();
                    if (gemsToClean.length > 0) {

                        var amountPoints = gemsToClean.length;
                        if (this.enemyBoardRenderer.dimGamePieces(gemsToClean, this.enemyCollectedPiecesAlpha -= 0.075)) {
                            this.enemyCollectedPiecesAlpha = 1;
                            this.setBoardGamePlayState(gameplayBoardStates.activateStars, board);
                            //this.updatePowerBarIndicator(amountPoints, board);
                        }
                    }
                    else {
                        this.setBoardGamePlayState(gameplayBoardStates.checkForCombos, board)
                    }
                }

                break;

            case gameplayBoardStates.activateStars:

                //TODO: definetly improve this, IDK what the heck i was thinking here btu this is waaayyyy too hacky
                if (board === gameplayBoard.player1Board) {
                    const gemsToClean = this.activateBoardStars(this.playerBoard, this.playerBoardRenderer, board);
                    if (gemsToClean.length > 0) {
                        gemsToClean.forEach((pos, index) => {

                            this.playerBoardRenderer.sprites[pos[0]][pos[1]].tint = 0xffffff;
                            this.playerBoardRenderer.sprites[pos[0]][pos[1]].alpha = 1;
                        });
                        this.playerCharacter.animateAttack();
                        this.setBoardGamePlayState(gameplayBoardStates.checkForCombos, board)
                    }
                    else
                        this.setBoardGamePlayState(gameplayBoardStates.checkForCombos, board)
                }

                if (board === gameplayBoard.player2Board) {
                    const gemsToClean = this.activateBoardStars(this.enemyBoard, this.enemyBoardRenderer, board);
                    if (gemsToClean.length > 0) {
                        gemsToClean.forEach((pos, index) => {

                            this.enemyBoardRenderer.sprites[pos[0]][pos[1]].tint = 0xffffff;
                            this.enemyBoardRenderer.sprites[pos[0]][pos[1]].alpha = 1;
                        });
                        this.enemyCharacter.animateAttack();
                        this.setBoardGamePlayState(gameplayBoardStates.checkForCombos, board)
                    }
                    else
                        this.setBoardGamePlayState(gameplayBoardStates.checkForCombos, board)
                }

                break;

            case gameplayBoardStates.checkForCombos:

                if (board === gameplayBoard.player1Board) {
                    var isThereFloatingPieces = this.dropFloatingBoardPieces(this.playerBoard, this.playerBoardRenderer, this.playerDropPieceFallTimer);

                    if (!isThereFloatingPieces) {
                        this.setBoardGamePlayState(gameplayBoardStates.spawningTrashGamePiece, board);
                    }
                    else {
                        this.chainsToMakeCounter--;
                        this.setBoardGamePlayState(gameplayBoardStates.animateActivatedGems, board);
                    }
                    //this.CheckSuperGemPattern(gameplayBoard.player1Board);
                }
                if (board === gameplayBoard.player2Board) {
                    var isThereFloatingPieces = this.dropFloatingBoardPieces(this.enemyBoard, this.enemyBoardRenderer, this.enemyDropPieceFallTimer);
                    if (!isThereFloatingPieces) {
                        this.setBoardGamePlayState(gameplayBoardStates.spawningTrashGamePiece, board);
                    }
                    else {
                        this.setBoardGamePlayState(gameplayBoardStates.animateActivatedGems, board);
                    }
                }

                break;

            case gameplayBoardStates.spawningTrashGamePiece:
                this.spawnTrash(board);
                /*if (board === gameplayBoard.player1Board) {
                    this.spawnTrash(board);
                }

                if (board === gameplayBoard.player2Board) {
                    this.spawnTrash(board);
                }*/

                break;

            case gameplayBoardStates.trashOnField:

                if (board === gameplayBoard.player1Board) {
                    this.playerBoardRenderer.updateFromGamePiece(this.playerTrashGamePiece);

                    this.updateTrash(this.playerTrashGamePiece, this.playerBoard, board, this.playerTrashPieceFallTimer)
                }
                if (board === gameplayBoard.player2Board) {
                    this.enemyBoardRenderer.updateFromGamePiece(this.enemyTrashGamePiece);

                    this.updateTrash(this.enemyTrashGamePiece, this.enemyBoard, board, this.enemyTrashPieceFallTimer)
                }

                // this.updateTrash();

                break;

            case gameplayBoardStates.lockingTrashGamePiece:

                if (board === gameplayBoard.player1Board) {
                    this.lockPlayerTrashGamePiece();
                }
                if (board === gameplayBoard.player2Board) {
                    this.lockEnemyTrashGamePiece();
                }

                break;

            case gameplayBoardStates.droppingFloatingTrashPiece:

                if (board === gameplayBoard.player1Board) {
                    if (!this.dropFloatingBoardPieces(this.playerBoard, this.playerBoardRenderer, this.playerTrashPieceFallTimer)) {
                        this.setBoardGamePlayState(gameplayBoardStates.spawningGamePiece, board)
                    }
                }
                if (board === gameplayBoard.player2Board) {
                    if (!this.dropFloatingBoardPieces(this.enemyBoard, this.enemyBoardRenderer, this.enemyTrashPieceFallTimer)) {
                        this.setBoardGamePlayState(gameplayBoardStates.spawningGamePiece, board)
                    }
                }

                break;

            case gameplayBoardStates.startGameOverTransition:

                if (board === gameplayBoard.player1Board) {
                    this.startGameOverTransition(gameplayBoard.player2Board);
                }

                if (board === gameplayBoard.player2Board) {
                    this.startGameOverTransition(gameplayBoard.player1Board);
                }

                break;
            case gameplayBoardStates.gameOverTransition:

                if ((this.gameOverTransitionTimer -= 3) >= 0) {
                    this.gameOverTransitionBlackout.alpha += 2 / 100;
                }
                else {
                    this.game.soundManager.playBGXSound(this.currentEndJingle);
                    this.isGameOverTransitionFinished = true;
                    this.gameOver();
                }

                break;

            case gameplayBoardStates.gameOver:


                break;

            default:
                break;
        }
    }

    private CheckFusionGemByBoard(board: Board, boardRenderer: BoardRenderer) {
        //se quita indicador de fusion en todas las gemas
        boardRenderer.resetPartOfFusion();

        //se buscan los rectangulos en la grilla
        var rectList = board.findRects();

        //se cambia en el sprite la propiedad de fusion para mostrar correctamente la fusion
        for (var r = 0; r < rectList.length; r++) {
            for (var c = 0; c < rectList[r].length; c++) {
                var pointTemp = rectList[r][c];
                boardRenderer.UpdateSpriteFusionGem(pointTemp.row, pointTemp.col, pointTemp.rectPart);
            }
        }
    }

    /**
     * Revisa si existen gemas para fusionar y las muestra
     */
    private CheckFusionGemInBoards() {
        this.CheckFusionGemByBoard(this.playerBoard, this.playerBoardRenderer);
        this.CheckFusionGemByBoard(this.enemyBoard, this.enemyBoardRenderer);
    }

    //TODO: obtener cantidad de puntos necesario dependiendo del player
    private getPointsToFillBar(character): number {
        if (character === gameCharacters.amethyst) return 120;
        return 60;
    }

    // Activate specials
    activateCharacterAbility(board: gameplayBoard) {

        if (this.isPlayingVsMinion && board === gameplayBoard.player2Board) return;


        const testBoard = board === gameplayBoard.player1Board ? this.playerBoard : this.enemyBoard;

        const character = board === gameplayBoard.player1Board ? this.currentP1Character : this.currentP2Character;
        const amount = board === gameplayBoard.player1Board ? this.playerPoints : this.enemyPoints;
        /*console.log("character: ",character);
        console.log("Amount: ",amount);*/

        // Check if the user has the required energy for the special to be activated
        if (amount < this.getPointsToFillBar(character)) {
            this.gameSpecialFinished = true;
            this.game.soundManager.playSFXSound('activateSpecial');
            return;
        }

        if (this.leftTween != null || this.rightTween != null) return;
        //if(board === gameplayBoard.player2Board && (this.leftTween!=null || this.rightTween!=null)) return;

        this.pauseGame(true, false);
        board === gameplayBoard.player1Board ? this.gameSpecialStarted = true : this.gameSpecialStarted = true;
        let targetBoard;

        // reset puntos y estrella
        if (board === gameplayBoard.player1Board) {
            this.playerPoints = 0;
            this.leftSpecialSkillAd.visible = false;
        } else {
            this.enemyPoints = 0;
            this.rightSpecialSkillAd.visible = false;
        }

        this.updatePowerBarIndicator(0, board);

        this.ShowSkillAnimation(board === gameplayBoard.player1Board, character);

        switch (character) {

            // turns all trash/counter pieces on his board to gems by setting their timers to zero
            case gameCharacters.steven:

                // get the target board for the given power
                targetBoard = board === gameplayBoard.player1Board ? this.playerBoard : this.enemyBoard;

                // Get all trash gems for the user's board
                // Set the timers to zero
                var gemPositions = targetBoard.getBoardGamepiceTypePositions(gamePieceTypes.trash);
                gemPositions.forEach(pos => {
                    targetBoard.grid[pos[0]][pos[1]].clearTimer();
                });

                // Update the target board
                board === gameplayBoard.player1Board ? this.playerBoard = targetBoard : this.enemyBoard = targetBoard;

                break;

            //Pearl: Invoke 2 lines of Bubbled Gems in the bottom of the enemy�s board.
            case gameCharacters.pearl:

                // get the target board for the given power
                targetBoard = board === gameplayBoard.player1Board ? this.enemyBoard : this.playerBoard;

                //make room for the bubbles at the bottom of the board
                for (let i = 0; i < 2; i++) {
                    targetBoard.grid.shift();
                }

                for (let j = 0; j < 2; j++) {
                    let row = [];
                    for (let k = 0; k < targetBoard.cols; k++) {
                        row.push(new GamePieceComponent(MathUtils.getNumberInRandomRange(gamePieceColors.gem1, gamePieceColors.gem4), gamePieceTypes.trash, 5))
                    }
                    targetBoard.grid.push(row);
                }

                // Update the target board
                board === gameplayBoard.player1Board ? this.enemyBoard = targetBoard : this.playerBoard = targetBoard;

                break;

            // Yellow Diamond: Convert a random group of enemy gems into Bubbled Gems
            case gameCharacters.y_diamond:

                // get the target board for the given power
                targetBoard = board === gameplayBoard.player1Board ? this.enemyBoard : this.playerBoard;

                // Get all positions containing a gamepiece on target board that is also valid for trash tranformation *gems
                let ocupiedPositions = [].concat(targetBoard.getBoardGamepiceTypePositions(gamePieceTypes.gem));//.concat(targetBoard.getBoardGamepiceTypePositions(gamePieceTypes.star));

                if (ocupiedPositions.length > 0) {
                    // Pick a position at random
                    let index = ocupiedPositions[MathUtils.getNumberInRandomRange(0, ocupiedPositions.length)];

                    // Select adjacent valid game pieces (thus a group of pieces)
                    let group = targetBoard.isScorable(index, targetBoard.gridValue(index).pieceColor).length > 0 ? targetBoard.isScorable(index, targetBoard.gridValue(index).pieceColor).concat([index]) : [index];

                    // turn the group of game pieces into trash
                    group.forEach(pos => {
                        targetBoard.grid[pos[0]][pos[1]].pieceType = gamePieceTypes.trash;
                        targetBoard.grid[pos[0]][pos[1]].timer = 5;
                    });

                }

                // Update the target board
                board === gameplayBoard.player1Board ? this.enemyBoard = targetBoard : this.playerBoard = targetBoard;

                break;

            // Peridot: Copies the opposing field
            case gameCharacters.peridot:

                // get the target board for the given power
                targetBoard = board === gameplayBoard.player1Board ? this.playerBoard : this.enemyBoard;

                // copy the opposite board
                for (let i = 0; i < targetBoard.rows; i++) {
                    for (let j = 0; j < targetBoard.cols; j++) {
                        targetBoard.grid[i][j].pieceType = board === gameplayBoard.player1Board ? this.enemyBoard.grid[i][j].pieceType : this.playerBoard.grid[i][j].pieceType;
                        targetBoard.grid[i][j].pieceColor = board === gameplayBoard.player1Board ? this.enemyBoard.grid[i][j].pieceColor : this.playerBoard.grid[i][j].pieceColor;
                        targetBoard.grid[i][j].timer = board === gameplayBoard.player1Board ? this.enemyBoard.grid[i][j].timer : this.playerBoard.grid[i][j].timer;
                    }
                }

                // Update the target board
                board === gameplayBoard.player1Board ? this.playerBoard = targetBoard : this.enemyBoard = targetBoard;

                break;

            case gameCharacters.amethyst:

                // get the target board for the given power
                targetBoard = board === gameplayBoard.player1Board ? this.playerBoard : this.enemyBoard;

                // Find the top-most available positions
                // (it's free real state)
                let freeRealState = targetBoard.getTopmostBoardPositions();

                let spawnPosition = new Set<number[]>();

                if (freeRealState && freeRealState.length > 1) {
                    // pick at random any two of them
                    while (spawnPosition.size < 2) {
                        spawnPosition.add(freeRealState[MathUtils.getNumberInRandomRange(0, freeRealState.length)]);
                    }
                }
                else {

                    // pick at random any two of them
                    while (spawnPosition.size < 2) {
                        spawnPosition.add([targetBoard.rows - 1, MathUtils.getNumberInRandomRange(0, targetBoard.cols - 1)]);
                    }
                }


                // Spawn the gems
                spawnPosition.forEach(position => {

                    if (targetBoard.gridValue(position).pieceType === gamePieceTypes.none) {
                        targetBoard.grid[position[0]][position[1]].pieceType = gamePieceTypes.star;
                        targetBoard.grid[position[0]][position[1]].pieceColor = gamePieceColors.gemR;
                    }
                });

                // Update the target board
                board === gameplayBoard.player1Board ? this.playerBoard = targetBoard : this.enemyBoard = targetBoard;

                break;

            // Garnet: Breaks her biggest fusion gem.
            case gameCharacters.garnet:

                Debug.log("Activate Garnet Skill");
                // get the target board for the given power
                targetBoard = board === gameplayBoard.player1Board ? this.playerBoard : this.enemyBoard;
                for (var i = 0; i < targetBoard.grid[0].length; i++) {
                    targetBoard.grid[12][i].pieceColor = gamePieceColors.gem3;
                    targetBoard.grid[12][i].pieceType = gamePieceTypes.gem;
                    targetBoard.grid[12][i].timer = 0;
                    targetBoard.grid[11][i].pieceColor = gamePieceColors.gem3;
                    targetBoard.grid[11][i].pieceType = gamePieceTypes.gem;
                    targetBoard.grid[11][i].timer = 0;
                }

                board === gameplayBoard.player1Board ? this.playerBoard = targetBoard : this.enemyBoard = targetBoard;

                //TODO: 
                //1. Get all fusion gems
                //2. Find the biggest one
                //3. make them scorable and cash in the points
                break;



            // Jasper: Scramble all the enemy�s gems colors, the field keeps it's shape
            case gameCharacters.jasper:

                // get the target board for the given power
                targetBoard = board === gameplayBoard.player1Board ? this.enemyBoard : this.playerBoard;

                let occupiedPositions = [];

                // store all gem colros for the target board
                targetBoard.grid.forEach(row => {
                    row.forEach(pos => {
                        if (pos.pieceType !== gamePieceTypes.none) {
                            occupiedPositions.push(pos.pieceColor);
                        }
                    });
                });

                // shuffle the color values
                for (let i = occupiedPositions.length; i > 0; --i) {
                    let j = Math.floor(Math.random() * i);
                    let tmp = occupiedPositions[i - 1];
                    occupiedPositions[i - 1] = occupiedPositions[j];
                    occupiedPositions[j] = tmp;
                }

                // swap the colors back in
                targetBoard.grid.forEach(row => {
                    row.forEach(pos => {
                        if (pos.pieceType !== gamePieceTypes.none) {
                            pos.pieceColor = occupiedPositions.pop();
                        }
                    });
                });

                // Update the target board
                board === gameplayBoard.player1Board ? this.enemyBoard = targetBoard : this.playerBoard = targetBoard;

                break;

            default:
                break;


        }
        this.playerBoard.clearRects();
        this.enemyBoard.clearRects();
        this.CheckFusionGemInBoards();
        this.gameSpecialFinished = true;
    }

    //#endregion

    //#region GAMEPIECE

    //#region SPAWN GAMEPIECE

    spawnPlayerGamePiece() {

        this.isSwiping = false;

        this.playerGamePiece = this.playerSpawner.spawn();
        this.playerGamePiece.row = -1;
        this.playerGamePiece.col = -2 + this.playerBoard.cols / 2;

        if (this.playerBoard.collides(this.playerGamePiece.absolutePos(1, 0))) {
            this.setBoardGamePlayState(gameplayBoardStates.startGameOverTransition, gameplayBoard.player1Board);
        }
        else {
            this.setBoardGamePlayState(gameplayBoardStates.playingGamePieceOnField, gameplayBoard.player1Board)
        }

    }

    spawnEnemyGamePiece() {
        this.enemyGamePiece = this.enemySpawner.spawn();
        this.enemyGamePiece.row = -1;
        this.enemyGamePiece.col = -2 + this.enemyBoard.cols / 2;

        if (this.enemyBoard.collides(this.enemyGamePiece.absolutePos(1, 0))) {
            this.setBoardGamePlayState(gameplayBoardStates.startGameOverTransition, gameplayBoard.player2Board);
        }
        else {

            this.setBoardGamePlayState(gameplayBoardStates.playingGamePieceOnField, gameplayBoard.player2Board)
        }

    }

    //#endregion

    //#region LOCK GAMEPIECE

    /**
     * Merges current game peice with the gems in the player's board
     */
    lockPlayerGamePiece() {
        let score;
        // let scorableGamePieces = this.board.setAll(this.gamePiece.absolutePos(), this.gamePiece.pieceColor, this.gamePiece.pieceType);
        this.playerBoard.setAll(this.playerGamePiece.absolutePos(), this.playerGamePiece.gamePieceComponent);
        this.playerGamePiece = null;
        // this.playerBoard.decreaseTrashCounters(1);

        // this.playerBoardRenderer.updateFromBoard(this.playerBoard);
        this.setBoardGamePlayState(gameplayBoardStates.droppingFloatingPieces, gameplayBoard.player1Board);

        // this.checkCombos(gameplayBoard.player1Board);

    }

    /**
     * Merges current game peice with the gems in the enemy's (or P2) board
     */
    lockEnemyGamePiece() {
        let score;
        // let scorableGamePieces = this.board.setAll(this.gamePiece.absolutePos(), this.gamePiece.pieceColor, this.gamePiece.pieceType);
        this.enemyBoard.setAll(this.enemyGamePiece.absolutePos(), this.enemyGamePiece.gamePieceComponent);
        this.enemyGamePiece = null;
        // this.enemyBoard.decreaseTrashCounters(1);

        if (this.currentGameMode != gameModes.versusHuman) {
            this.currentEnemyAI.setState(gameAIStates.waiting);
        }

        // this.enemyBoardRenderer.updateFromBoard(this.enemyBoard);
        this.setBoardGamePlayState(gameplayBoardStates.droppingFloatingPieces, gameplayBoard.player2Board);

        // this.checkCombos(gameplayBoard.player2Board);

    }
    //#endregion

    //#region UPDATE GAMEPIECE

    tryRotatePlayerPiece() {
        this.tryRotatePiece(this.playerBoard, this.playerGamePiece);
    }

    tryRotateEnemyPiece() {
        this.tryRotatePiece(this.enemyBoard, this.enemyGamePiece);
    }

    tryRotatePiece(board: Board, piece: GamePiece) {
        var canRotate = true;
        if (!board.collides(piece.absolutePos(0, 0, true))) {
            piece.rotate();
        } else if (!board.collides(piece.absolutePos(0, -1, true))) {
            --piece.col;
            piece.rotate();
        } else if (!board.collides(piece.absolutePos(0, 1, true))) {
            ++piece.col;
            piece.rotate();
        }
        else canRotate = false;

        if (canRotate)
            this.game.soundManager.playSFXSound('gemRotate');

    }

    tryMovePlayerPiece(direction: number) {
        if (!this.playerBoard.collides(this.playerGamePiece.absolutePos(0, direction))) {
            this.playerGamePiece.col += direction;
        }
    }

    updatePlayerGamePiece(delta: number) {

        // Debug thing
        if (this.game.key["R"].trigger()) {
            this.activateCharacterAbility(gameplayBoard.player1Board);
            //this.setBoardGamePlayState(gameplayBoardStates.activateSpecialAbility, gameplayBoard.player1Board);
            // this.stopMoving = !this.stopMoving;
        }


        if (this.game.key["W"].trigger()) {
            this.tryRotatePlayerPiece();
        }

        if (/*this.touchController.isTapped || */this.game.key["A"].trigger()) {
            this.tryMovePlayerPiece(-1);
        }
        if (/*TouchController.moveRight(delta) || */this.game.key["D"].trigger()) {
            this.tryMovePlayerPiece(1);
        }

        let tickMod = this.isSwiping || this.game.key["S"].pressed || this.game.key["E"].pressed/* || TouchController.droppingPiece()*/ ? this.pieceDropModifier : 1;

        if ((this.playerPieceFallTimer -= tickMod) <= 0) {
            var pos = this.playerGamePiece.absolutePos(1, 0);
            if (this.playerBoard.collides(pos)) {
                this.isSwiping = false;
                this.setBoardGamePlayState(gameplayBoardStates.lockingPlayingGamePiece, gameplayBoard.player1Board);
                // this.playerBoardTrashAmount > 0 ? this.spawnTrash(this.playerBoardTrashAmount, 0) : this.spawnPlayerGamePiece();
            } else {
                if (this.stopMoving) {
                    Debug.log("Deja de moverse");
                } else {
                    ++this.playerGamePiece.row;
                    this.playerPieceFallTimer = this.pieceFallSpeed;
                }
            }
        }
    }

    updateEnemyGamePiece() {

        let tickMod = 1;

        switch (this.currentGameMode) {
            case gameModes.versusHuman:

                if (this.game.key["P"].trigger()) {
                    this.setBoardGamePlayState(gameplayBoardStates.activateSpecialAbility, gameplayBoard.player2Board);
                }

                if (this.game.key["I"].trigger()) {
                    this.tryRotateEnemyPiece();
                }

                if (this.game.key["J"].trigger() && !this.enemyBoard.collides(this.enemyGamePiece.absolutePos(0, -1))) {
                    --this.enemyGamePiece.col;
                }
                if (this.game.key["L"].trigger() && !this.enemyBoard.collides(this.enemyGamePiece.absolutePos(0, 1))) {
                    ++this.enemyGamePiece.col;
                }

                tickMod = this.game.key["K"].pressed || this.game.key["O"].pressed ? this.pieceDropModifier : 1;

                if ((this.enemyPieceFallTimer -= tickMod) <= 0) {
                    if (this.enemyBoard.collides(this.enemyGamePiece.absolutePos(1, 0))) {
                        // this.lockEnemyGamePiece();
                        this.setBoardGamePlayState(gameplayBoardStates.lockingPlayingGamePiece, gameplayBoard.player2Board);
                        // this.enemyBoardTrashAmount ? this.spawnTrash(this.enemyBoardTrashAmount, 1) : this.spawnEnemyGamePiece();
                    } else {
                        ++this.enemyGamePiece.row;
                        this.enemyPieceFallTimer = this.pieceFallSpeed;
                    }
                }
                break;

            default:

                //TODO: Implement A.I.
                if (this.currentEnemyAI.currentAIPlaySequence != gameAIMoveOptions.none) {
                    if (this.currentEnemyAI.currentAIPlaySequence == gameAIMoveOptions.rotate) {
                        this.tryRotateEnemyPiece();
                    }

                    if (this.currentEnemyAI.currentAIPlaySequence == gameAIMoveOptions.left && !this.enemyBoard.collides(this.enemyGamePiece.absolutePos(0, -1))) {
                        --this.enemyGamePiece.col;
                        this.currentEnemyAI.setState(gameAIStates.moveMade);
                    }
                    if (this.currentEnemyAI.currentAIPlaySequence == gameAIMoveOptions.right && !this.enemyBoard.collides(this.enemyGamePiece.absolutePos(0, 1))) {
                        ++this.enemyGamePiece.col;
                        this.currentEnemyAI.setState(gameAIStates.moveMade);
                    }
                }

                tickMod = this.currentEnemyAI.currentDropPieceTimer < 0 ? this.pieceDropModifier : 1;

                if ((this.enemyPieceFallTimer -= tickMod) <= 0) {
                    if (this.enemyBoard.collides(this.enemyGamePiece.absolutePos(1, 0))) {
                        // this.lockEnemyGamePiece();
                        this.setBoardGamePlayState(gameplayBoardStates.lockingPlayingGamePiece, gameplayBoard.player2Board);
                        // this.enemyBoardTrashAmount ? this.spawnTrash(this.enemyBoardTrashAmount, 1) : this.spawnEnemyGamePiece();
                    } else {
                        ++this.enemyGamePiece.row;
                        this.enemyPieceFallTimer = this.pieceFallSpeed;
                    }
                }
                break;
        }


    }

    //#endregion

    //#endregion

    //#region TRASH

    //#region TRASH SPAWN

    /**
     *
     * @param targetBoard The board number to spawn trash to (player1: 0, Player2: 1)
     */
    spawnTrash(targetBoard) {

        switch (targetBoard) {
            case gameplayBoard.player1Board:
                if (this.playerBoardTrashAmount > 0) {
                    // this.playerBoard.spawnTrash(amount * 1.2);
                    this.playerTrashGamePiece = new TrashGamePiece(this.playerBoardTrashAmount, this.currentP2Character)
                    this.playerTrashGamePiece.row = 0;
                    this.playerTrashGamePiece.col = 0;
                    this.playerBoardTrashAmount = 0;

                    if (this.currentGameVictoryCondition === gameplayVictoryConditions.defenseVictory)
                        this.trashSurvivedCounter--;
                    this.playerCharacter.animateDamage();
                    this.setBoardGamePlayState(gameplayBoardStates.trashOnField, targetBoard)
                }
                else {

                    this.setBoardGamePlayState(gameplayBoardStates.spawningGamePiece, targetBoard)
                }
                break;
            case gameplayBoard.player2Board:
                Debug.log("Trash Pieces: " + this.enemyBoardTrashAmount);
                if (this.enemyBoardTrashAmount > 0) {
                    // this.enemyBoard.spawnTrash(amosunt * 1.2);
                    this.enemyTrashGamePiece = new TrashGamePiece(this.enemyBoardTrashAmount, this.currentP1Character)
                    this.enemyTrashGamePiece.row = 0;
                    this.enemyTrashGamePiece.col = 0;
                    this.enemyBoardTrashAmount = 0;
                    this.enemyCharacter.animateDamage();
                    this.setBoardGamePlayState(gameplayBoardStates.trashOnField, targetBoard)

                }
                else {
                    this.setBoardGamePlayState(gameplayBoardStates.spawningGamePiece, targetBoard)
                }
                break;

            default:
                break;
        }
    }

    //#endregion

    //#region TRASH UPDATE
    /**
     * @param board the gamplay board to update
     * @param board the board renderer to update
     * @param dropTimer the drop timer current timer
     * @returns boolean: Wheter there are floating game pieces on the board or not
     */
    updateTrash(trashGamePiece: TrashGamePiece, board: Board, targetBoard: gameplayBoard, fallTimer: number): void {

        if (trashGamePiece) {
            if ((fallTimer -= 10) <= 0) {
                if (board.collides(trashGamePiece.absolutePos(1, 0))) {
                    this.setBoardGamePlayState(gameplayBoardStates.lockingTrashGamePiece, targetBoard)
                }
                else {
                    ++trashGamePiece.row;
                    fallTimer = this.pieceFallSpeed / 3;
                }
            }
        }
    }

    //#endregion

    //#region LOCK TRASH

    lockPlayerTrashGamePiece() {
        this.playerBoard.setAll(this.playerTrashGamePiece.absolutePos(), this.playerTrashGamePiece.gamePieceComponent);
        this.playerTrashGamePiece = null;
        this.setBoardGamePlayState(gameplayBoardStates.droppingFloatingTrashPiece, gameplayBoard.player1Board);

    }

    lockEnemyTrashGamePiece() {
        this.enemyBoard.setAll(this.enemyTrashGamePiece.absolutePos(), this.enemyTrashGamePiece.gamePieceComponent);
        this.enemyTrashGamePiece = null;
        this.setBoardGamePlayState(gameplayBoardStates.droppingFloatingTrashPiece, gameplayBoard.player2Board);

    }

    //#endregion

    //#endregion

    //#region UI

    /**
    * set the player's game score
    */
    setEnemyScore(score) {

        this.enemyScore = score;
        this.enemyScoreUI.text = score.toString();
    }

    /**
     * Updates the player's game score
     */
    updateEnemyScore(score) {
        this.enemyScore = score + this.enemyScore;
        this.setEnemyScore(this.enemyScore);
    }

    /**
     * set the player's game score
     */
    setPlayerScore(score) {
        this.playerScore = score;
        this.playerScoreUI.text = score.toString();
    }

    /**
     * Updates the player's game score
     */
    updatePlayerScore(score) {
        this.playerScore = score + this.playerScore;
        this.setPlayerScore(this.playerScore);
    }

    private setGameOverTransitionBlackout() {
        this.gameOverTransitionBlackout = new PIXI.Graphics();
        // background.lineStyle(10, 0x553483, 1);
        this.gameOverTransitionBlackout.beginFill(0x000000, 0.95);
        this.gameOverTransitionBlackout.drawRoundedRect(0, 0, viewport.width, viewport.height, 45);
        this.gameOverTransitionBlackout.endFill();
        this.gameOverTransitionBlackout.pivot.set(0.5);
        this.gameOverTransitionBlackout.width = viewport.width;
        this.gameOverTransitionBlackout.height = viewport.height;
        this.gameOverTransitionBlackout.scale.x = 1 / this.scale.x;
        this.gameOverTransitionBlackout.scale.y = 1 / this.scale.y;
        this.addChild(this.gameOverTransitionBlackout);
        this.gameOverTransitionBlackout.alpha = 0;
    }

    private setPlayerSprite() {
        this.playerCharacter = new InGameCharacter((viewport.width / 2) - 260, viewport.height - 240);
        this.addChild(this.playerCharacter.sprite);
    }


    private setEnemySprite() {
        this.enemyCharacter = new InGameCharacter((viewport.width / 2) + 260, viewport.height - 240, true);
        this.addChild(this.enemyCharacter.sprite);
    }

    private setPlayerUIContainer() {

        const uiContainer = SpriteUtils.createSprite('playerUIContainer', viewport.width / 2 - 450, viewport.height - 230, { scale: 1.5 });
        uiContainer.interactive = true;
        this.addChild(uiContainer);

        this.playerScoreUI = SpriteUtils.createText(this.playerScore.toString(), uiContainer.x + 50, uiContainer.y + 95, playerScoreUITextStyle);
        this.addChild(this.playerScoreUI);

        this.setPlayerPowerBarUI(uiContainer.x + 200, uiContainer.y + 70);

        this.playerCharacterNameUI = SpriteUtils.createText("", uiContainer.x + uiContainer.width / 2, uiContainer.y - 20, characterNameUIStyle, { xanchor: "center" });
        this.addChild(this.playerCharacterNameUI);

        this.setPlayerSprite();

        this.addChild(this.playerBoardRenderer);
        this.playerBoardRenderer.pivot.set(0.5);
        this.playerBoardRenderer.position.x = 100;
        this.playerBoardRenderer.position.y = viewport.height / 2 - 330;

        this.addChild(this.playerBufferRenderer);
        this.playerBufferRenderer.position.x = 100 + this.playerBoardRenderer.width - this.playerBufferRenderer.width - 10;
        this.playerBufferRenderer.position.y = 120;

        uiContainer.on('tap', (event) => {
            if (this.isPaused) return;
            this.activateCharacterAbility(gameplayBoard.player1Board);
        });

        uiContainer.on('click', (event) => {
            if (this.isPaused) return;
            this.activateCharacterAbility(gameplayBoard.player1Board);
        });
    }

    private setEnemyUIContainer() {
        const uiContainer = SpriteUtils.createSprite('enemyUIContainer', viewport.width / 2 + 450, viewport.height - 230, { scale: 1.5 });
        uiContainer.interactive = true;
        uiContainer.x -= uiContainer.width;
        this.addChild(uiContainer);

        this.enemyScoreUI = SpriteUtils.createText(
            this.playerScore.toString(),
            uiContainer.x + uiContainer.width - 40,
            uiContainer.y + 95,
            enemyScoreUITextStyle,
            {
                xanchor: 'right'
            }
        );
        this.addChild(this.enemyScoreUI);

        this.setEnemyPowerBarUI(uiContainer.x + 180, uiContainer.y + 70);

        this.enemyCharacterNameUI = SpriteUtils.createText("", uiContainer.x + uiContainer.width / 2, uiContainer.y - 20, characterNameUIStyle, { xanchor: "center" });
        this.addChild(this.enemyCharacterNameUI);

        this.setEnemySprite();

        this.addChild(this.enemyBoardRenderer);
        this.enemyBoardRenderer.pivot.set(1);
        this.enemyBoardRenderer.position.x = viewport.width - this.enemyBoardRenderer.width - 60;
        this.enemyBoardRenderer.position.y = viewport.height / 2 - 330;

        this.addChild(this.enemyBufferRenderer);
        this.enemyBufferRenderer.position.x = this.enemyBoardRenderer.position.x;
        this.enemyBufferRenderer.position.y = 120;

        uiContainer.on('tap', (event) => {

            if (this.isPaused) return;

            this.activateCharacterAbility(gameplayBoard.player2Board);
        });

        uiContainer.on('click', (event) => {

            if (this.isPaused) return;

            this.activateCharacterAbility(gameplayBoard.player2Board);
        });
    }

    private setPlayerPowerBarUI(x, y) {

        //puntos para llenar barra 
        var containerPlayer = new PIXI.Container();
        var containerEmitter = new PIXI.Container();

        //estrella
        this.playerPowerbarIconSprite = SpriteUtils.createSprite("powerBarIcon", x - 150, y);
        this.playerPowerbarIconSprite.anchor.set(0.5);
        this.playerPowerbarIconSprite.pivot.set(0.5);

        //background de la barra
        this.playerPowerbarBGSprite = SpriteUtils.createSprite("powerBarBG", x, y);
        this.playerPowerbarBGSprite.anchor.set(0, 0.5);
        this.playerPowerbarBGSprite.pivot.set(0, 0.5);
        this.playerPowerbarBGSprite.x = this.playerPowerbarIconSprite.x;
        //this.playerPowerbarBGSprite.x = this.playerPowerbarBGSprite.y + 10;
        this.playerPowerbarBGSprite.scale.set(1.5);

        //barra temporal
        this.playerBarWidth = this.playerPowerbarBGSprite.width - 5;
        this.playerBarSprite = this.GetBarSprite(this.playerBarWidth, 25);
        this.playerBarSprite.anchor.set(0, 0.5);
        this.playerBarSprite.pivot.set(0, 0.5);
        this.playerBarSprite.position.set(this.playerPowerbarBGSprite.x, this.playerPowerbarBGSprite.y);
        this.playerSpritePulseAnimation = new SpritePulseAnimation([this.playerBarSprite, this.playerPowerbarBGSprite], [1, 1.5], 1.1, 1.5, 0.5);

        containerEmitter.position.set(this.playerPowerbarIconSprite.x, this.playerPowerbarIconSprite.y - 100);

        containerPlayer.addChild(this.playerPowerbarBGSprite);
        containerPlayer.addChild(this.playerBarSprite);
        containerPlayer.addChild(this.playerPowerbarIconSprite);
        containerPlayer.addChild(containerEmitter);
        this.addChild(containerPlayer);

        this.playerEmitter = new Emitter(containerEmitter, [SpriteUtils.getTexture('powerBarIcon')], {
            "alpha": {
                "start": 1,
                "end": 0.8
            },
            "scale": {
                "start": 0.6,
                "end": 1,
                "minimumScaleMultiplier": 0.1
            },
            "color": {
                "start": "#fafafa",
                "end": "#ffffff"
            },
            "speed": {
                "start": 1,
                "end": 1,
                "minimumSpeedMultiplier": 1
            },
            "maxSpeed": 1,
            "startRotation": {
                "min": 0,
                "max": 360
            },
            "noRotation": true,
            "lifetime": {
                "min": 50,
                "max": 100
            },
            "blendMode": "normal",
            "frequency": 0.012,
            "emitterLifetime": -1,
            "maxParticles": 10,
            "pos": {
                "x": 0,
                "y": 0
            },
            "spawnType": "rect",
            "spawnRect": {
                "x": 50,
                "y": 50,
                "w": 200,
                "h": 160
            }
        });

        this.playerEmitter.emit = false;
        this.updatePowerBarIndicator(0, gameplayBoard.player1Board);

    }

    private GetBarSprite(width: number, height: number): PIXI.Sprite {
        var bar = new PIXI.Graphics();
        bar.beginFill(0xFFFFFF);
        bar.drawRoundedRect(0, 0, width, height, 10);
        bar.endFill();

        const renderTexture = PIXI.RenderTexture.create({ width, height });
        var sprTemp = new PIXI.Sprite(renderTexture);

        var container = new PIXI.Container();
        container.addChild(bar);
        this.game.app.renderer.render(container, renderTexture);

        return sprTemp;
    }

    private playerBarFilled() {
        this.playerPoints = this.playerPointsToFillBar;
        this.playerEmitter.emit = true;
        this.leftSpecialSkillAd.visible = true;
        this.playerSpritePulseAnimation.activate();
        this.game.soundManager.playSFXLoop("powerupReady");
    }

    private enemyBarFilled() {
        this.enemyPoints = this.enemyPointsToFillBar;
        if (!this.isPlayingVsMinion) {
            this.enemyEmitter.emit = true;
            this.enemySpritePulseAnimation.activate();
            this.rightSpecialSkillAd.visible = true;
            this.game.soundManager.playSFXLoop("powerupReady");
        }
    }

    private stopPlayerBarFilled() {
        if (this.playerEmitter != null) {
            this.playerEmitter.emit = false;
        }
        this.playerSpritePulseAnimation.reset();
        if (this.enemyEmitter && !this.enemyEmitter.emit) {
            this.game.soundManager.stopSFXLoop("powerupReady");
        }
    }

    private stopEnemyBarFilled() {
        if (this.enemyEmitter != null) {
            this.enemyEmitter.emit = false;
        }
        this.enemySpritePulseAnimation.reset();
        if (this.playerEmitter && !this.playerEmitter.emit) {
            this.game.soundManager.stopSFXLoop("powerupReady");
        }
    }

    private updatePowerBarIndicator(amount: number, board: gameplayBoard) {
        if (board === gameplayBoard.player1Board) {

            this.playerPoints += amount;
            if (this.playerPoints > this.playerPointsToFillBar) {
                this.playerBarFilled();
            } else {
                this.stopPlayerBarFilled();
            }
            this.playerBarSprite.width = (this.playerPoints * this.playerBarWidth) / (this.playerPointsToFillBar);
        } else {
            this.enemyPoints += amount;
            if (this.enemyPoints > this.enemyPointsToFillBar) {
                this.enemyBarFilled();
            } else {
                this.stopEnemyBarFilled();
            }
            this.enemyBarSprite.width = (this.enemyPoints * this.enemyBarWidth) / (this.enemyPointsToFillBar);
        }

    }

    private setEnemyPowerBarUI(x, y) {
        //puntos para llenar barra 
        var enemyContainer = new PIXI.Container();
        var containerEmitter = new PIXI.Container();

        enemyContainer.on('tap', (event) => {
            this.activateCharacterAbility(gameplayBoard.player2Board)
        });

        enemyContainer.on('click', (event) => {
            this.activateCharacterAbility(gameplayBoard.player2Board)
        });

        //estrella
        this.enemyPowerbarIconSprite = SpriteUtils.createSprite("powerBarIcon", x + 130, y - 10);
        this.enemyPowerbarIconSprite.anchor.set(0.5);
        this.enemyPowerbarIconSprite.pivot.set(0.5);

        //background de la barra
        this.enemyPowerbarBGSprite = SpriteUtils.createSprite("powerBarBG", x + 160, y);
        this.enemyPowerbarBGSprite.anchor.set(1, 0.5);
        this.enemyPowerbarBGSprite.pivot.set(1, 0.5);
        this.enemyPowerbarBGSprite.x = this.enemyPowerbarIconSprite.x;
        this.enemyPowerbarBGSprite.scale.set(1.5);

        //barra
        this.enemyBarWidth = this.enemyPowerbarBGSprite.width - 5;
        this.enemyBarSprite = this.GetBarSprite(this.enemyBarWidth, 25);
        this.enemyBarSprite.anchor.set(1, 0.5);
        this.enemyBarSprite.pivot.set(1, 0.5);
        this.enemyBarSprite.position.set(this.enemyPowerbarBGSprite.x, this.enemyPowerbarBGSprite.y);

        this.enemySpritePulseAnimation = new SpritePulseAnimation([this.enemyBarSprite, this.enemyPowerbarBGSprite], [1, 1.5], 1.1, 1.5, 0.5);

        containerEmitter.position.set(this.enemyPowerbarBGSprite.x - this.enemyPowerbarBGSprite.width, this.enemyPowerbarIconSprite.y - 100);

        enemyContainer.addChild(this.enemyPowerbarBGSprite);
        enemyContainer.addChild(this.enemyBarSprite);
        enemyContainer.addChild(this.enemyPowerbarIconSprite);
        enemyContainer.addChild(containerEmitter);
        this.addChild(enemyContainer);

        this.enemyEmitter = new Emitter(containerEmitter, [SpriteUtils.getTexture('powerBarIcon')], {
            "alpha": {
                "start": 1,
                "end": 0.8
            },
            "scale": {
                "start": 0.6,
                "end": 1,
                "minimumScaleMultiplier": 0.1
            },
            "color": {
                "start": "#fafafa",
                "end": "#ffffff"
            },
            "speed": {
                "start": 1,
                "end": 1,
                "minimumSpeedMultiplier": 1
            },
            "maxSpeed": 1,
            "startRotation": {
                "min": 0,
                "max": 360
            },
            "noRotation": true,
            "lifetime": {
                "min": 50,
                "max": 100
            },
            "blendMode": "normal",
            "frequency": 0.012,
            "emitterLifetime": -1,
            "maxParticles": 10,
            "pos": {
                "x": 0,
                "y": 0
            },
            "spawnType": "rect",
            "spawnRect": {
                "x": 50,
                "y": 50,
                "w": 200,
                "h": 160
            }
        });
        this.enemyEmitter.emit = false;

        this.updatePowerBarIndicator(0, gameplayBoard.player2Board);
    }

    private setTimedVictoryCounter() {
        const halfWidth = viewport.width / 2;

        this.victoryTimerUIDisplay = new PIXI.Text("0", timerUITextStyle);
        this.victoryTimerUIDisplay.x = halfWidth;
        this.victoryTimerUIDisplay.y = 120;
        this.victoryTimerUIDisplay.anchor.set(0.5);
        this.victoryTimerUIDisplay.alpha = 0;

        this.addChild(this.victoryTimerUIDisplay);
    }

    resetGameOverTransition() {
        this.isGameOver = false;
        this.isGameOverTransitionFinished = false;
        this.gameOverTransitionTimer = 100;
        this.gameOverTransitionBlackout.alpha = 0;
    }

    //#endregion

    //#region BOARD

    //#region DROP FLOATING PIECES

    /**
     * @param board the gamplay board to update
     * @param boardRenderer the board renderer to update
     * @param dropTimer the drop timer current timer
     * @returns boolean: Wheter there are floating game pieces on the board or not
     */
    dropFloatingBoardPieces(board: Board, boardRenderer: BoardRenderer, dropTimer): boolean {
        if (board.hasFloatingPieces()) {
            Debug.log("Lanzar pieza: " + board);
            if (((dropTimer -= 10) <= 0)) {

                for (let index = 0; index < board.gridFloatingPieces.length; index++) {
                    let i = board.gridFloatingPieces[index][0];
                    let j = board.gridFloatingPieces[index][1];

                    if (board.gridValue([i, j]).pieceType !== gamePieceTypes.none) {
                        if (board.inBounds(board.goBottom([i, j])) && board.gridValue(board.goBottom([i, j])).pieceType === gamePieceTypes.none) {
                            var rectId = board.belongToRect(i, j);
                            if (rectId >= 0) {
                                board.GoDownRectPosition(rectId);
                                boardRenderer.updateFromBoard(board);
                            } else {
                                board.grid[i + 1][j].pieceType = board.grid[i][j].pieceType;
                                board.grid[i + 1][j].pieceColor = board.grid[i][j].pieceColor;
                                board.grid[i + 1][j].timer = board.grid[i][j].timer;
                                board.grid[i + 1][j].rectId = board.grid[i][j].rectId;
                                board.grid[i + 1][j].rectPart = board.grid[i][j].rectPart;
                                board.grid[i + 1][j].canMove = false;
                                board.grid[i][j] = new GamePieceComponent(gamePieceColors.none, gamePieceTypes.none, 0);
                                //boardRenderer.updateFromBoard(board);
                            }

                        }
                    }
                }

                boardRenderer.updateFromBoard(board);
                dropTimer = this.pieceFallSpeed / 3;
            }
        }
        else {
            this.CheckFusionGemInBoards();
            return false;
        }

        return true;
    }

    //#endregion

    //#region  ACTIVATE STARS

    /**
     * @param board the gamplay board to update
     * @param boardRenderer the board renderer to update
     * @param targetBoard the drop timer current timer
     * @returns boolean: Wheter there are floating game pieces on the board or not
     */
    activateBoardStars(board: Board, boardRenderer: BoardRenderer, targetBoard) {

        board.getBoardStarsPositions();
        if ((board.gridStars.length > 0 && board.lookForActivatableStars())) {

            const piecesToClean = board.getBoardCollectablePieces();
            var amountGems = piecesToClean.length;
            board.cleanGridPositions(piecesToClean);
            var amountPoints = amountGems * this.gemValue;

            this.updatePowerBarIndicator(amountPoints, targetBoard);

            if (targetBoard === gameplayBoard.player1Board) {
                this.updatePlayerScore(amountPoints);
                this.playerBoard.cleanFusionPositions(piecesToClean);
                this.destroyedGemsP1 += amountGems;
                if (amountGems > this.maxChainP1) this.maxChainP1 = amountGems;
            }

            if (targetBoard === gameplayBoard.player2Board) {
                this.updateEnemyScore(amountPoints);
                this.enemyBoard.cleanFusionPositions(piecesToClean);
                this.destroyedGemsP2 += amountGems;
                if (amountGems > this.maxChainP2) this.maxChainP2 = amountGems;
            }

            this.storeCounterTrashAmount(piecesToClean.length, targetBoard);

            if (piecesToClean.length > 0)
                this.game.soundManager.playSFXSound('gemCollect');

            // boardRenderer.updateFromBoard(board);
            return piecesToClean;
        }

        return [];
    }

    //#endregion

    //#endregion


    storeCounterTrashAmount(amount: number, attackingBoard: gameplayBoard) {
        switch (attackingBoard) {
            case gameplayBoard.player1Board:
                this.enemyBoardTrashAmount += amount;
                break;
            case gameplayBoard.player2Board:
                this.playerBoardTrashAmount += amount;
                break;
        }
    }

    startGameOverTransition(winner: gameplayBoard) {
        // const board = winner ? gameplayBoard.player1Board : gameplayBoard.player2Board;
        if (this.isGameOver) {
            // This can happen because we have two state machines, one for each board. And we only change
            // the state to "gameOverTransition" for one of them, for some god forsaken reason.
            // So this function will keep being called evern during the "gameOverTransition" state for
            // the winner.
            return;
        }
        const gameWinner = this.getCurrentGameWinner(winner);

        this.playerCharacter.setGameOver(winner == gameplayBoard.player1Board);
        this.enemyCharacter.setGameOver(winner == gameplayBoard.player2Board);

        this.game.soundManager.stopSFXLoop("powerupReady");

        var score = this.playerScore;
        var gemsAmount = this.destroyedGemsP1;
        var maxChain = this.maxChainP1;
        if (this.currentGameMode == gameModes.versusHuman) {
            maxChain = winner == gameplayBoard.player1Board ? this.maxChainP1 : this.maxChainP2;
            gemsAmount = winner == gameplayBoard.player1Board ? this.destroyedGemsP1 : this.destroyedGemsP2;
            score = winner == gameplayBoard.player1Board ? this.playerScore : this.enemyScore;
        }

        this.gameOverOpts = {
            keepVisible: true,
            gameMode: this.currentGameMode,
            winnerIs: gameWinner,
            scoreP1: this.playerScore,
            scoreP2: this.enemyScore,
            stage: this.currentStage,
            level: this.currentLevel,
            arcadeFloor: this.arcadeFloor,
            p1Character: this.currentP1Character,
            p2Character: this.currentP2Character,
            unlockCharacter: false,
            stats: {
                p1Points: score,
                p1GemsDestroyed: gemsAmount,
                p1MaxChain: maxChain,
                p2Points: this.enemyScore,
                p2GemsDestroyed: 777,
                p2MaxChain: 777
            }
        };
        this.game.soundManager.fadeoutBGXSound();
        this.endJingleTimer = 1000;
        if (winner === gameplayBoard.player2Board && this.currentGameMode === gameModes.adventure) {
            this.currentEndJingle = 'defeat';
        }
        else this.currentEndJingle = 'victory';

        if (winner == gameplayBoard.player1Board && this.currentGameMode === gameModes.adventure) {
            if (this.currentLevel == 5) {
                this.gameOverOpts.unlockCharacter = this.enemyCharacter.unlockInArcade();
            }
        }

        if (this.currentGameTimer) {
            this.currentGameTimer.stopTimer();
            this.victoryTimerUIDisplay.alpha = 0;
        }

        this.isGameOver = true;
        this.isSwiping = false;
        this.stopPlayerBarFilled();
        this.stopEnemyBarFilled();
        this.setBoardGamePlayState(gameplayBoardStates.gameOverTransition, gameWinner);
    }

    getCurrentGameWinner(winner: gameplayBoard) {
        if (this.currentGameMode != gameModes.adventure)
            return winner;

        switch (this.currentGameVictoryCondition) {
            case gameplayVictoryConditions.normalVictory:
                Debug.log("Normal Victory");
                return winner;

            case gameplayVictoryConditions.chainVictory:
                if (this.chainsToMakeCounter > 0 && winner === gameplayBoard.player1Board) {
                    return gameplayBoard.player2Board
                }
                return gameplayBoard.player1Board;

            case gameplayVictoryConditions.defenseVictory:
                if (this.trashSurvivedCounter > 0 && winner === gameplayBoard.player1Board) {
                    return gameplayBoard.player2Board
                }
                return gameplayBoard.player1Board;

            case gameplayVictoryConditions.objectiveVictory:
                if (this.objectiveCollected === false && winner === gameplayBoard.player1Board) {
                    return gameplayBoard.player2Board
                }
                return gameplayBoard.player1Board;
        }

        return winner;
    }

    /**
     * handle game ending
     */
    gameOver() {
        // this.game.scores.add(this.rowsCleared, this.score);
        this.pauseButton.interactive = false;
        if (this.touchController) this.touchController.interactive = false;
        this.game.setState('gameOver', this.gameOverOpts);
    }



    exit() {
        this.isPaused = true;
    }
}