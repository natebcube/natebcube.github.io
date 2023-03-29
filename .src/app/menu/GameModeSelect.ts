import * as PIXI from 'pixi.js';
import GameScene from './GameScene';
import { modeSelectTextUIStyle, modeSelectTextUIStyleSelected } from '../textStyles/textStyles';
import SpriteUtils from '../utils/SpriteUtils';
import { gameModes, gameCharacters } from '../enums/enums';
import Localization from '../controller/Localization';
import { viewport } from '../config';
import TutorialPromptPopup from './TutorialPromptPopup';
import Persistance from '../Persistance';
import UnlockedCharacterScreen from './UnlockedCharacterScreen';
import Characters from '../Characters';

/**
 * Display Mode Selection Screen
 */
export default class GameModeSelect extends GameScene {
    
    sprLeftImage: PIXI.Sprite;
    leftImages = [];
	btnList = [];
	firstSelect: boolean;
    
    constructor(game) {
        super(game, '', 'gameModeSelectionBG');
		this.initLayout();
        this.firstSelect = true;
       
    }

    private initLayout() {
        const buttons:[string, string, {}, boolean][] = [ ];
        
        buttons.push([Localization.loc('STORY_MODE'), 'characterSelectMenu', { gameMode: 'story' }, true]);
        this.leftImages.push( SpriteUtils.getTexture('storyModeOption'));
        
        buttons.push([Localization.loc('ARCADE_MODE'), 'characterSelectMenu', { gameMode: 'arcade' }, this.canShowArcadeBtn()]);
        this.leftImages.push(SpriteUtils.getTexture('arcadeModeOption'));
                
        buttons.push([Localization.loc('VS_FRIEND'), 'characterSelectVersusMenu', { restart: true, gameMode: gameModes.versusHuman }, !this.game.isMobile]);
        this.leftImages.push(SpriteUtils.getTexture('vsFriendOption'));
        
        buttons.push([Localization.loc('VS_COMPUTER'), 'characterSelectVersusMenu', { restart: true, gameMode: gameModes.versusComputer }, true ]);            
        this.leftImages.push( SpriteUtils.getTexture('vsComputerOption'));
    
        
        buttons.push([Localization.loc('TUTORIAL_BTN'), 'dialogue', {
            character: gameCharacters.steven,
            opponent: gameCharacters.pearl,
            dialogue: TutorialPromptPopup.getTutorialDialogue(this.game.isMobile),
            stageNumber: 1,
            defeated: false,
            cb: () => {                
                this.game.setState('modeSelectMenu', { restart: true });
            }
        }, true]);
        this.leftImages.push( SpriteUtils.getTexture('tutorialOption'));
        
        this.SetInitialBtnSelected();

        const gameLogo = SpriteUtils.createSprite('logo_intro1', viewport.width - 500, 280, { centered: true, scale: 0.85});
        const logoCN = SpriteUtils.createSprite('logo_intro2',100,100, { centered: true });
        const logoSteven = SpriteUtils.createSprite('logo_intro3', viewport.width - 750, 80, { centered: true, scale: 0.6});
        this.addChild(gameLogo);
        this.addChild(logoCN);
        this.addChild(logoSteven);
        
        buttons.forEach((button, i) => {            
            this.createBtn(i, button);              
        });

        this.adjustBtnPosition();
        this.PutOver(this.btnList[0]);

        /*var unlocked = new UnlockedCharacterScreen();
        this.addChild(unlocked);

        unlocked.show(gameCharacters.jasper);*/
    }   
    
    private canShowArcadeBtn():boolean
    {
        return (Persistance.isEnabledCharacter(gameCharacters.jasper) &&
            Persistance.isEnabledCharacter(gameCharacters.peridot) &&
            Persistance.isEnabledCharacter(gameCharacters.y_diamond));
    }

    private SetInitialBtnSelected()
    {
        this.sprLeftImage = SpriteUtils.createSprite('storyModeOption', 0, viewport.height);
        this.sprLeftImage.anchor.set(0,1);
        this.sprLeftImage.scale.set(1.2);
        this.addChild(this.sprLeftImage);
    }
    
    private createBtn(index: number, btnInfo){
               
		var spr = SpriteUtils.createSprite('blank', 0, 0);
        spr.scale.set(1.5);
        spr.anchor.set(0.5);
        //spr.position.set(viewport.width - 500, posInitY + spr.height/2 +(index * (spr.height+verticalSpace)));
        this.addChild(spr);            
        
        const label = new PIXI.Text(btnInfo[0], modeSelectTextUIStyle);
        label.anchor.set(0.5);
        spr.addChild(label);
        
        var link = btnInfo[1];        
        var opts = btnInfo[2];      
        
        spr.interactive = true;
		spr.buttonMode = true;

        spr.on('tap', (event) => {
			this.game.setState(link, opts);
            this.game.soundManager.playSFXSound('menuSelect');            
        });

        spr.on('click', (event) => {
			this.game.setState(link, opts);
            this.game.soundManager.playSFXSound('menuSelect');            
        });
        
        spr.data = index;        
        
        spr.on('mouseover', (event) => {       
			var currentSpr = event.currentTarget;
			if (!currentSpr.selected) {
				this.game.soundManager.playSFXSound('menuMove');
				this.firstSelect = false;
			}
			this.PutOver(currentSpr);
        });

        spr.on('mouseout', (event) => {     
            var currentSpr = event.currentTarget;
            //this.PutOut(currentSpr);
        });
        
        if (!btnInfo[3]) spr.visible = false;
        spr.isArcade = btnInfo[2].gameMode === 'arcade';
        this.btnList[index]= spr;
    }   
    
    private ResetOver()
    {
        this.btnList.forEach((button, i) => {
			this.PutOut(button); 
        });
	}

    private adjustBtnPosition()
    {
        var posInitY = 600;
        var verticalSpace = 90; 
        var ind = 0;
        var enableArcade = this.canShowArcadeBtn();

        this.btnList.forEach((sprBtn, i) => {
            
            //si es arcade lo hace visible 
            if (enableArcade && sprBtn.isArcade) sprBtn.visible = true;
            
            if (sprBtn.visible)
            {
                //se usa la escala porque al momento de crearse el sprite el tamaño lo representa la escala
                sprBtn.position.set(viewport.width - 500, posInitY + sprBtn.scale.y / 2 + (ind * (sprBtn.scale.y + verticalSpace)));    
                ind++;
            }			
        });
    }
    
    private PutOver(currentSpr: PIXI.Sprite)
	{
        this.ResetOver();
        this.sprLeftImage.texture = this.leftImages[currentSpr.data];
        currentSpr.texture = SpriteUtils.getTexture('overBtnMenuSelection');
        const label:PIXI.Text = currentSpr.getChildAt(0); // ugly.
        label.style = modeSelectTextUIStyleSelected;
		currentSpr.selected = true;
    }
    
    private PutOut (currentSpr)
    {
        currentSpr.texture = SpriteUtils.getTexture('blank');
		currentSpr.getChildAt(0).style = modeSelectTextUIStyle;
		currentSpr.selected = false;
	}
	enter(opts)
    {   
        this.adjustBtnPosition();

		if (!this.game.soundManager.isPlaying('mainTheme'))
			this.game.soundManager.playBGXSound('mainTheme');
	}

}