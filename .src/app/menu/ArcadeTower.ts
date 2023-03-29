import * as PIXI from 'pixi.js';
import GameScene from './GameScene';
import SpriteUtils from '../utils/SpriteUtils';
import { gameCharacters } from '../enums/enums';
import Characters from '../Characters';
import { TweenMax } from "gsap/TweenMax";
import ArcadeController from '../controller/ArcadeController';
import { viewport } from '../config';
import { storyCharacterSelectNameTextUIStyle } from '../textStyles/textStyles';
import Localization from '../controller/Localization';
import Debug from '../Debug';

/**
 * Display Arcade Tower screen
 */
export default class ArcadeTower extends GameScene {
    character: gameCharacters;
    opponents: gameCharacters[];
    towerComponents: { opponentPortrait: PIXI.Sprite }[] = [];
    selectedCharacterSprite: PIXI.Sprite;
    characterName: PIXI.Text;
    playerCharacterIcon: PIXI.Sprite;
    bar: PIXI.Sprite;
    baseScale:number;
    portraitsList:any[];
    timer;
    
    V_PADDING:number = 80;
    H_PADDING:number = 100;
    
    constructor(game) {
        super(game, '', 'arcadeBG');
        this.game = game;
        setTimeout(() => this.initLayout(), 100); // This has to be delayed in order for the container to be scaled correctly when there are children off view
    }

    initLayout() {
        this.baseScale = 1.5;
        const gameWidth = viewport.width;
        const gameHeight = viewport.height;
               
        this.selectedCharacterSprite = SpriteUtils.createSprite('stevenSelectionPreview', 0, gameHeight);
        this.selectedCharacterSprite.anchor.set(0,1);
        this.selectedCharacterSprite.scale.set(this.baseScale);        
        this.addChild(this.selectedCharacterSprite);
        
        this.characterName = new PIXI.Text("STEVEN", storyCharacterSelectNameTextUIStyle);
        this.characterName.anchor.set(0.5);
        this.characterName.position.set(viewport.width/2 - 600,viewport.height-150);
        this.addChild(this.characterName);
        
        this.portraitsList = [];
        
        for (let i = 0; i < 5; i++) {
            const x = gameWidth - 400;
            const y = gameHeight - 100 - 200 * ( 4 - i);            
            
            var opponentPortrait = SpriteUtils.createSprite(Characters[gameCharacters.steven].selectionIcon, x + 120, y, { centered: true });
            opponentPortrait.scale.set(this.baseScale);            
            this.towerComponents.push({ opponentPortrait });            
            this.addChild(opponentPortrait);
            this.portraitsList[i] = opponentPortrait;
        }
        
        this.playerCharacterIcon = SpriteUtils.createSprite(Characters[gameCharacters.steven].selectionIcon, gameWidth - 520, 0, 
                                                            { centered: true, scale: this.baseScale });
        this.addChild(this.playerCharacterIcon);
        
        this.portraitsList.reverse();
    }
    
    enter(opts: {character: gameCharacters, opponents: gameCharacters[], towerFloor: number}) {
        const { opponents, character, towerFloor } = opts;
        this.character = character;
        if (opponents) {
            this.opponents = opponents;
            this.opponents.forEach((opponent, i) => {
                if (!this.towerComponents[4 - i]) {
                    return;
                }
                SpriteUtils.swapTexture(this.towerComponents[4 - i].opponentPortrait, Characters[opponent].selectionIcon);
            })
            ArcadeController.resetRound(opponents);
        }
        
        SpriteUtils.swapTexture(this.selectedCharacterSprite, Characters[this.character].selectionPreviewImage);
        SpriteUtils.swapTexture(this.playerCharacterIcon, Characters[this.character].selectionIcon);
        this.characterName.text = Localization.loc('character' + Characters[this.character].spriteKey + 'Upper');
        
		this.StartTween(towerFloor);    

		if (!this.game.soundManager.isPlaying('characterSelect'))
			this.game.soundManager.playBGXSound('characterSelect');
		this.game.soundManager.playSFXSound('arcadeNextLvl');
    }
    
    private StartTween(towerFloor:number)
    {       
        var index = towerFloor-1;
        Debug.log("Index: "+index);
        var posFrom = viewport.height+100;        
        var posTo = 0;
        if(index>0){
            var ind = index-1;
            posFrom = this.portraitsList[ind].y;
            posTo = this.portraitsList[index].y;
        }else{
            posTo= this.portraitsList[index].y;
        }
        TweenMax.fromTo(this.playerCharacterIcon, 3, { y: posFrom }, { y: posTo, onComplete:()=> {
            this.timer = setTimeout(() => this.startBattle(towerFloor), 1000);
        }});
    }
    
    private NextTween(index:number)
    {        
        if(index<this.portraitsList.length){
            this.StartTween(index);
        }else{            
            Debug.log("Se acabo");
            return;
        }
    }
    
    startBattle(towerFloor: number) {
        ArcadeController.startArcadeGame(this.character, towerFloor);
    }
}