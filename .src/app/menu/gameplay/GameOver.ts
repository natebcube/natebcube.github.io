import * as PIXI from 'pixi.js';
import GameScene from "../GameScene";
import { gameModes, gameplayBoard, gameCharacters } from '../../enums/enums';
import { gameOverButtonTextStyle, gameOverNameTextUIStyle, gameOverStatTextStyle, gameOverMainTextStyle } from '../../textStyles/textStyles';
import Persistance from '../../Persistance';
import SpriteUtils from '../../utils/SpriteUtils';
import Characters from '../../Characters';
import StoryController from '../../controller/StoryController';
import ArcadeController from '../../controller/ArcadeController';
import { viewport } from '../../config';
import Localization from '../../controller/Localization';
import Debug from '../../Debug';
import UnlockedCharacterScreen from '../UnlockedCharacterScreen';

interface GameStats { p1Points: number, p1GemsDestroyed: number, p1MaxChain: number, p2Points?: number, p2GemsDestroyed?: number, p2MaxChain?: number };

interface ButtonSpec {
    text: string,
    action: any
}

export default class GameOver extends GameScene {

    gameOverMessage: PIXI.Text;
    gameOverScoreMessage: PIXI.Text;
    
    buttons: PIXI.Sprite[] = [];
    buttonActions: any[] = [];
    buttonTexts: PIXI.Text[] = [];
    characterSprite: PIXI.Sprite;
    selectedOptionMarker: PIXI.Sprite;
    
    p1PointsLabelText: PIXI.Text;
    p1PointsText: PIXI.Text;
    p1GemsDestroyedLabelText: PIXI.Text;
    p1DestroyedGemsText: PIXI.Text;
    p1MaxChainLabelText: PIXI.Text;
    p1MaxChainText: PIXI.Text;
    
    p2PointsLabelText: PIXI.Text;
    p2PointsText: PIXI.Text;
    p2GemsDestroyedLabelText: PIXI.Text;
    p2GemsDestroyedText: PIXI.Text;
    p2MaxChainLabelText: PIXI.Text;
    p2MaxChainText: PIXI.Text;
    private tittle: PIXI.Text;
    private restartOrNextAction: Function;
    private backAction: Function;
    private restartOrNextBtn:PIXI.Sprite;
    private restartOrNextTxt:PIXI.Text;
    private unlocked:UnlockedCharacterScreen;

    constructor(game) {
        super(game, '', 'gameOverBG');
        //this.background.alpha = 0;   
        this.baseScale = 1.5;     
        setTimeout(() => { this.initLayout(); }, 0);
    }

    initLayout() {
        this.addDefeatText();
        this.initCharacterArea();
        this.initStatsArea();
        this.initButtonsArea();

        this.unlocked = new UnlockedCharacterScreen();
        this.addChild(this.unlocked);
    }

    private addDefeatText()
    {
        this.tittle = SpriteUtils.createText(Localization.loc('DEFEAT'), 3 * viewport.width/4, 160, gameOverMainTextStyle);
        this.tittle.anchor.set(0.5);
        this.addChild(this.tittle);
    } 

    initCharacterArea() 
    {                   
        this.characterSprite = SpriteUtils.createSprite('blank', 0, 0);
        this.characterSprite.scale.set(2);
        this.characterSprite.anchor.set(0, 1);
        this.characterSprite.position.set(-200, viewport.height);
        this.addChild(this.characterSprite);       
    }

    initButtonsArea() {
        var posX = viewport.width/2 + 350;
        var posY = viewport.height - 190;

        var backBtn = SpriteUtils.createSprite('backArrow', 0, 0,
        {
            action: () => {
                this.backAction();
            }
        }
        );
        backBtn.anchor.set(0.5);
        backBtn.position.set(posX, posY);
        this.addChild(backBtn);
        const text = SpriteUtils.createText(Localization.loc('GAME_OVER_BACK_TO_MENU'), backBtn.x, backBtn.y + 100, gameOverButtonTextStyle, { centered: true });
        this.addChild(text);

        this.restartOrNextBtn = SpriteUtils.createSprite('gameOverRestartBtn', 0, 0,
        {
            action: () => {
                this.restartOrNextAction();
            }
        });
        this.restartOrNextBtn.anchor.set(0.5);
        this.restartOrNextBtn.position.set(posX + 350, posY);
        this.addChild(this.restartOrNextBtn); 
        this.restartOrNextTxt = SpriteUtils.createText(Localization.loc('GAME_OVER_RETRY'), this.restartOrNextBtn.x, this.restartOrNextBtn.y + 100, gameOverButtonTextStyle, { centered: true });
        this.addChild(this.restartOrNextTxt);
    }

    initStatsArea() {
        var posY = viewport.height/2;
        let yPosition = posY;
        const labelX = viewport.width - 400;
        const valueX = viewport.width - 50;
        const labelHeight = 75;
        
        var txtBgPoints = SpriteUtils.createSprite('gameOverTextBg', 0, 0);
        txtBgPoints.position.set(viewport.width, posY - 120);
        txtBgPoints.anchor.set(1,0.5);
        txtBgPoints.scale.set(this.baseScale);
        this.addChild(txtBgPoints);      

        var txtBgDestroyed = SpriteUtils.createSprite('gameOverTextBg', 0, 0);
        txtBgDestroyed.position.set(viewport.width, posY);
        txtBgDestroyed.anchor.set(1,0.5);
        txtBgDestroyed.scale.set(this.baseScale);
        this.addChild(txtBgDestroyed);   

        var txtBgChains = SpriteUtils.createSprite('gameOverTextBg', 0, 0);
        txtBgChains.position.set(viewport.width, posY + 120);
        txtBgChains.anchor.set(1,0.5);
        txtBgChains.scale.set(this.baseScale);
        this.addChild(txtBgChains);   

        const statLabelOpts = { xanchor: 'left', yanchor: 'center' };
        const statTextOpts = { xanchor: 'right', yanchor: 'center' };
        
        this.p1PointsLabelText = SpriteUtils.createText(Localization.loc('Score') /*+ ' ' + Localization.loc('POINTS')*/, txtBgPoints.x-txtBgPoints.width + 150, txtBgPoints.y, gameOverStatTextStyle, statLabelOpts);
        this.p1PointsText = SpriteUtils.createText('1234567', valueX, txtBgPoints.y, gameOverStatTextStyle, statTextOpts);
        
        this.p1GemsDestroyedLabelText = SpriteUtils.createText(Localization.loc('GEMS_DESTROYED'), txtBgDestroyed.x-txtBgDestroyed.width + 150, txtBgDestroyed.y, gameOverStatTextStyle, statLabelOpts);
        this.p1DestroyedGemsText = SpriteUtils.createText('120', valueX, txtBgDestroyed.y, gameOverStatTextStyle, statTextOpts);
        
        this.p1MaxChainLabelText = SpriteUtils.createText(Localization.loc('MAX_CHAIN'), txtBgChains.x-txtBgChains.width + 150, txtBgChains.y, gameOverStatTextStyle, statLabelOpts);
        this.p1MaxChainText = SpriteUtils.createText('3', valueX, txtBgChains.y, gameOverStatTextStyle, statTextOpts);
        
        this.addChild(this.p1PointsLabelText);
        this.addChild(this.p1PointsText);
        this.addChild(this.p1GemsDestroyedLabelText);
        this.addChild(this.p1DestroyedGemsText);
        this.addChild(this.p1MaxChainLabelText);
        this.addChild(this.p1MaxChainText); 
    }

    enter(opts) {
        switch (opts.gameMode) {
            case gameModes.adventure:
                this.adventureOver(opts);
                break;
            case gameModes.arcade:
                this.arcadeOver(opts);
                break;
           
            case gameModes.versusComputer:
                this.versusOver(opts);
                break;

            case gameModes.versusHuman:            
                this.versusHuman(opts);
                break;
        }
    }

    adventureOver(opts) 
    {
        Debug.log("adventureOver");
        const won = opts.winnerIs === gameplayBoard.player1Board;
		this.backAction = () => this.game.setState("stageMapMenu", { stageBeat: won, Stage: opts.stage, Character: opts.p1Character, Next: false, Level: opts.level  });
        /*const buttons: ButtonSpec[] = [
            {
                text: Localization.loc('TryAgain'),
                action: this.backAction
            }
        ];*/
        if (won) {
            
            console.log("Unlock", opts);
            if(opts.unlockCharacter) this.unlocked.show(opts.p2Character);
            this.restartOrNextBtn.texture = SpriteUtils.getTexture('forwardBtn');
            this.restartOrNextTxt.text = Localization.loc("GAME_OVER_NEXT_LEVEL");

            this.restartOrNextAction = () => {
                if (opts.level == 5) {
                    StoryController.showStageEnding(opts.p1Character, opts.p2Character, opts.stage);
                } else {
					this.game.setState("stageMapMenu", { stageBeat: won, Stage: opts.stage, Character: opts.p1Character, Next: true, Level: opts.level });
                }
            };

            /*buttons.push({
                text: Localization.loc('NextFight'),
                action: this.restartOrNextAction
            });*/
            
            Persistance.saveScore(opts.stage, opts.level, opts.scoreP1);
            // This probably belongs somewhere else
            StoryController.levelCompleted(opts.stage, opts.level);
        }else{
            this.restartOrNextBtn.texture = SpriteUtils.getTexture('gameOverRestartBtn');
            this.restartOrNextTxt.text = Localization.loc("GAME_OVER_RETRY");
            this.restartOrNextAction = () => this.game.setState("gamePlay", { restart: true, gameMode: gameModes.adventure, stage: opts.stage, level: opts.level });
        }

        if (!(won && opts.level == 5)) {
            //this.backAction = () => this.game.setState("stageMapMenu", { stageBeat: won, Stage: opts.stage, Character: opts.p1Character });
            /*buttons.push({
                text: Localization.loc('BackToMap'),
                action: this.backAction
            });*/
        }

        const characterName = Localization.loc('character' + Characters[opts.p1Character].spriteKey);
        //const title = characterName + ' ' + (won ? Localization.loc('characterWins') : Localization.loc('characterLoses'));
        const title = Localization.loc(won ? 'CLEAR' : 'DEFEAT');
        //this.setGameOverScreen(title, opts.stats, opts.p1Character, won, buttons);
        this.setGameOverScreen(title, opts.stats, opts.p1Character, won, null);
    }

    arcadeOver(opts) 
    {        
        //this.backAction = () => this.game.setState("gamePlay", { restart: true });
        this.backAction = () => this.game.setState("modeSelectMenu", {});
        const won = opts.winnerIs === gameplayBoard.player1Board;
        /*const buttons: ButtonSpec[] = [
            {
                text: Localization.loc('TryAgain'),
                action: () => this.game.setState("gamePlay", { restart: true })
            }
        ];*/
        if (won) {
            this.restartOrNextBtn.texture = SpriteUtils.getTexture('forwardBtn');
            this.restartOrNextTxt.text = Localization.loc("GAME_OVER_NEXT_LEVEL");
            this.restartOrNextAction = () => {
                ArcadeController.increaseRoundStats(opts.stats.p1Points, opts.stats.p1GemsDestroyed, opts.stats.p1MaxChain);
                if (ArcadeController.hasNextFloor(opts.arcadeFloor)) {
                    this.game.setState('arcadeTower', { character: opts.p1Character, towerFloor: opts.arcadeFloor + 1 });
                } else {
                    //this.showRoundSummary(opts.p1Character);
                    this.game.setState("modeSelectMenu", {})
                }
            };

            /*buttons.push({
                text: Localization.loc('NextFight'),
                action: this.restartOrNextAction                
            });*/
        }else{
            this.restartOrNextBtn.texture = SpriteUtils.getTexture('gameOverRestartBtn');  
            this.restartOrNextTxt.text = Localization.loc("GAME_OVER_RETRY");
            this.restartOrNextAction = () => this.game.setState("gamePlay", { restart: true });
        }
        
        /*buttons.push({
            text: Localization.loc('BackToMenu'),
            action: () => this.game.setState("modeSelectMenu", {})
        });*/

        //const characterName = Localization.loc('character' + Characters[opts.p1Character].spriteKey);
        //const title = characterName + ' ' + (won ? Localization.loc('characterWins') : Localization.loc('characterLoses'));
        const title = Localization.loc(won ? 'CLEAR' : 'DEFEAT');
        this.setGameOverScreen(title, opts.stats, opts.p1Character, won, null);
    }

    showRoundSummary(character: gameCharacters) {
        //const characterName = Localization.loc('character' + Characters[character].spriteKey);
        const roundStats = ArcadeController.getRoundStats()
        const statsToDisplay = {
            p1Points: roundStats.score,
            p1GemsDestroyed: roundStats.gemsDestroyed,
            p1MaxChain: roundStats.maxChain
        }
        this.setGameOverScreen(Localization.loc('CLEAR'), statsToDisplay, character, true, null);
    }

    versusOver(opts) {
        const won = opts.winnerIs === gameplayBoard.player1Board;
        //const characterName = Localization.loc('character' + Characters[opts.p1Character].spriteKey);
        //const title = characterName + ' ' + (won ? Localization.loc('characterWins') : Localization.loc('characterLoses'));
        const title = Localization.loc(won ? 'CLEAR' : 'DEFEAT');
        const winnerCharacter = opts.winnerIs == gameplayBoard.player1Board ? opts.p1Character : opts.p2Character;
        //const characterName = Localization.loc('character' + Characters[winnerCharacter].spriteKey);
        this.restartOrNextAction = () => this.game.setState("gamePlay", { restart: true, gameMode: opts.gameMode });
        this.backAction = () => this.game.setState("modeSelectMenu", {});       
        this.restartOrNextBtn.texture = SpriteUtils.getTexture('gameOverRestartBtn'); 
        this.restartOrNextTxt.text = Localization.loc("GAME_OVER_RETRY");
        this.setGameOverScreen(title, opts.stats, winnerCharacter, true, [
            {
                text: Localization.loc('TryAgain'),
                action: () => this.game.setState("gamePlay", { restart: true, gameMode: opts.gameMode })
            },
            {
                text: Localization.loc('Characters'),
                action: () => this.game.setState("characterSelectVersusMenu", { restart: true, gameMode: opts.gameMode })
            },
            {
                text: Localization.loc('BackToMenu'),
                action: () => this.game.setState("modeSelectMenu", {})
            }
        ]);
    }

    versusHuman(opts) {
        const characterName = Localization.loc('character' + Characters[opts.p1Character].spriteKey);
        const title = Localization.loc('CLEAR');
        const winnerCharacter = opts.winnerIs == gameplayBoard.player1Board ? opts.p1Character : opts.p2Character;
        //const characterName = Localization.loc('character' + Characters[winnerCharacter].spriteKey);
        this.restartOrNextAction = () => this.game.setState("gamePlay", { restart: true, gameMode: opts.gameMode });
        this.backAction = () => this.game.setState("modeSelectMenu", {});
        
        this.setGameOverScreen(title, opts.stats, winnerCharacter, true, [
            {
                text: Localization.loc('TryAgain'),
                action: () => this.game.setState("gamePlay", { restart: true, gameMode: opts.gameMode })
            },
            {
                text: Localization.loc('Characters'),
                action: () => this.game.setState("characterSelectVersusMenu", { restart: true, gameMode: opts.gameMode })
            },
            {
                text: Localization.loc('BackToMenu'),
                action: () => this.game.setState("modeSelectMenu", {})
            }
        ]);
    }

    setGameOverScreen(text:string, stats: GameStats, character: gameCharacters, won: boolean, buttons: ButtonSpec [])
    {
        const characterName = Characters[character].spriteKey;
        this.setStats(stats);
        this.tittle.text = text;
        //this.characterSprite.texture = SpriteUtils.getTexture(characterName + ( won ? 'Win': 'Lose'));
        SpriteUtils.swapTexture(this.characterSprite, won ? Characters.getWinnerPoseKey(character) : Characters.getLoserPoseKey(character));
    }

    setStats(stats: GameStats) {
        this.p1PointsText.text = stats.p1Points.toString(10);
        this.p1DestroyedGemsText.text = stats.p1GemsDestroyed.toString(10);
        this.p1MaxChainText.text = stats.p1MaxChain.toString(10);
        const statLabelOpts = { xanchor: 'right', yanchor: 'center' };
        SpriteUtils.realignText(this.p1PointsText, statLabelOpts);
        SpriteUtils.realignText(this.p1DestroyedGemsText, statLabelOpts);
        SpriteUtils.realignText(this.p1MaxChainText, statLabelOpts);
        /*if (stats.p2Points != undefined) {
            this.p2PointsText.text = stats.p2Points.toString(10);
            this.p2GemsDestroyedText.text = stats.p2GemsDestroyed.toString(10);
            this.p2MaxChainText.text = stats.p2MaxChain.toString(10);
            SpriteUtils.realignText(this.p2PointsText, statLabelOpts);
            SpriteUtils.realignText(this.p2GemsDestroyedText, statLabelOpts);
            SpriteUtils.realignText(this.p2MaxChainText, statLabelOpts);
            this.p2PointsText.visible = true;
            this.p2GemsDestroyedText.visible = true;
            this.p2MaxChainText.visible = true;
            this.p2PointsLabelText.visible = true;
            this.p2GemsDestroyedLabelText.visible = true;
            this.p2MaxChainLabelText.visible = true;
        } else {
            this.p2PointsText.visible = false;
            this.p2GemsDestroyedText.visible = false;
            this.p2MaxChainText.visible = false;
            this.p2PointsLabelText.visible = false;
            this.p2GemsDestroyedLabelText.visible = false;
            this.p2MaxChainLabelText.visible = false;
        }*/
    }
}