import * as PIXI from 'pixi.js';
import GameScene from './GameScene';
import { gameCharacters } from '../enums/enums';
import { versusCharPlayerNumberTextStyle, versusCharPlayerNumber2TextStyle, versusCharacterSelectNameTextUIStyle, windowTitleTextStyle, specialButtonLabelTextStyle } from '../textStyles/textStyles';
import Characters from '../Characters';
import { viewport } from '../config';
import Localization from '../controller/Localization';
import TutorialSkill from './gameplay/TutorialSkills/TutorialSkillsSlider';
import SpriteUtils from '../utils/SpriteUtils';
import Debug from '../Debug';
import Persistance from '../Persistance';

/**
 * Display Main Menu screen
 */
export default class GameCharacterSelectVersus extends GameScene {

    // Holds P1 selection UI
    characterP1PreviewSprite: PIXI.Sprite;
    characterP1PSelectionIndicator: PIXI.Sprite;
    characterP1PreviewName: PIXI.Text;

    // Holds P2 selection UI
    characterP2PreviewSprite: PIXI.Sprite;
    characterP2PSelectionIndicator: PIXI.Sprite;
    characterP2PreviewName: PIXI.Text;

    //selectableCharacter: any;

    isPlayer1Selection = true;
    player1Selection = gameCharacters.steven;
    player2Selection = gameCharacters.steven;
    private enabledCharacters:any;

    player1SelectionCard;
    player2SelectionCard;    
   
    
    private containerSkill: TutorialSkill;  
    private containerSkillP2: TutorialSkill;  

    //text   
    V_PADDING:number = 50;
    H_PADDING:number = 150;


    constructor(game) {
        super(game, '', 'characterSelectVSModeMenuBG');
        this.sortableChildren = true;
        
        this.enabledCharacters = {
            [gameCharacters.steven]: {enabled: Persistance.isEnabledCharacter(gameCharacters.steven), sprParticle: null, sprOver: null, sprCard: null, sprOverP2:null, sprCardP2:null, sprParticleP2: null, sprIcon:null},
            [gameCharacters.amethyst]: {enabled: Persistance.isEnabledCharacter(gameCharacters.amethyst), sprParticle: null, sprOver: null, sprCard: null, sprOverP2:null, sprCardP2:null, sprParticleP2: null, sprIcon:null},
            [gameCharacters.garnet]: {enabled: Persistance.isEnabledCharacter(gameCharacters.garnet), sprParticle: null, sprOver: null, sprCard: null, sprOverP2:null, sprCardP2:null, sprParticleP2: null, sprIcon:null},          
            [gameCharacters.jasper]: {enabled: Persistance.isEnabledCharacter(gameCharacters.jasper), sprParticle: null, sprOver: null, sprCard: null, sprOverP2:null, sprCardP2:null, sprParticleP2: null, sprIcon:null},
            [gameCharacters.pearl]: {enabled: Persistance.isEnabledCharacter(gameCharacters.pearl), sprParticle: null, sprOver: null, sprCard: null, sprOverP2:null, sprCardP2:null, sprParticleP2: null, sprIcon:null},
            [gameCharacters.peridot]: {enabled: Persistance.isEnabledCharacter(gameCharacters.peridot), sprParticle: null, sprOver: null, sprCard: null, sprOverP2:null, sprCardP2:null, sprParticleP2: null, sprIcon:null},
            [gameCharacters.y_diamond]: {enabled: Persistance.isEnabledCharacter(gameCharacters.y_diamond), sprParticle: null, sprOver: null, sprCard: null, sprOverP2:null, sprCardP2:null, sprParticleP2: null, sprIcon:null},
        };
        
        this.baseScale = 1.5;
        this.game = game;
        this.createSelecTitle(Localization.loc('CHOOSE_YOUR_FIGHTER'), viewport.width, 50);
    
        this.setBackArrow("modeSelectMenu",{});
        
        this.createTutorialSkillContainerP1();
        this.createTutorialSkillContainerP2();

        this.showInitialCharacterP1();
        this.showInitialCharacterP2();
        

        const offsetY = 100;
        const spaceX = 200;        
        const initPosY = 300;
        const sprHeight = 213; // tamaño del sprite * 1.5 (esta es la escala base)   
        const xPosLeftChar = viewport.width/2 - 120;
        const xPosRightChar = xPosLeftChar + spaceX ;        
                     
              
        //left chars
        this.setCharacterSelectIcon(gameCharacters.steven,
            xPosLeftChar,
            initPosY + offsetY + (sprHeight * 0));

        this.setCharacterSelectIcon(gameCharacters.amethyst,
            xPosLeftChar,
            initPosY + offsetY + (sprHeight * 1));

        this.setCharacterSelectIcon(gameCharacters.jasper,
            xPosLeftChar,
            initPosY + offsetY + (sprHeight * 2));
        
        //right chars
        this.setCharacterSelectIcon(gameCharacters.pearl,
            xPosRightChar,
            initPosY + (sprHeight * 0));
        
        this.setCharacterSelectIcon(gameCharacters.garnet,
            xPosRightChar,
            initPosY + (sprHeight * 1));   

        this.setCharacterSelectIcon(gameCharacters.peridot,
            xPosRightChar,
            initPosY + (sprHeight * 2));        

        this.setCharacterSelectIcon(gameCharacters.y_diamond,
            xPosRightChar,
            initPosY + (sprHeight * 3));
        
        this.addTutorialControlsScreen(true);
    } 
  

    enter(opts) {
        if (opts) {
            if (opts.restart) {        
                this.refreshEnabledCharacters();
                this.gameMode = opts.gameMode; 
                this.HideAllCardAndOver(true);
                this.isPlayer1Selection = true;
                this.containerSkill.show(false);
                this.containerSkillP2.show(false);
                this.SetSelectedCharacter(gameCharacters.steven);               
                this.SetSelectedCharacterP2(gameCharacters.pearl);
				Debug.log("GameMode: " + this.gameMode);
				this.game.soundManager.playBGXSound('characterSelect');
            }
        }
    }

    private showInitialCharacterP2()
    {       
        this.characterP2PreviewName = new PIXI.Text("", versusCharacterSelectNameTextUIStyle);
        this.characterP2PreviewName.anchor.set(0.5, 1);
        this.addChild(this.characterP2PreviewName);       
        this.characterP2PreviewSprite = PIXI.Sprite.from(this.GetCharSpriteFromId(0));        
        this.characterP2PreviewSprite.anchor.set(0, 1);
        this.characterP2PreviewSprite.position.set(viewport.width,viewport.height);
        this.characterP2PreviewSprite.scale.set(this.baseScale);
        this.characterP2PreviewSprite.scale.x *= -1;
        this.addChildAt(this.characterP2PreviewSprite, 3);
        this.createSpecialButton(1663, 1011, this.containerSkillP2);
        this.characterP2PreviewName.position.set(1555, 970);
    }

    private createSpecialButton(x: number, y: number, skillContainer) {
        const buttonBackground = SpriteUtils.createSprite('buttonSpecialBack', x, y, { centered: true, action: () => {
            skillContainer.show(!skillContainer.visible);
        } });

        const buttonFront = SpriteUtils.createSprite('buttonSpecialFront', x, y, { centered: true });
        const label = SpriteUtils.createText(Localization.loc('SPECIAL_BTN'), x + 20 , y, specialButtonLabelTextStyle, { centered: true });
        this.addChild(buttonBackground);
        this.addChild(buttonFront);
        this.addChild(label);
    }
    
    private showInitialCharacterP1() 
    {
        this.characterP1PreviewName = new PIXI.Text("", versusCharacterSelectNameTextUIStyle);
        this.characterP1PreviewName.anchor.set(0.5, 1);               
        this.addChild(this.characterP1PreviewName);       
                
        this.characterP1PreviewSprite = PIXI.Sprite.from(this.GetCharSpriteFromId(0));        
        this.characterP1PreviewSprite.anchor.set(0, 1);
        this.characterP1PreviewSprite.position.set(0,viewport.height);
        this.characterP1PreviewSprite.scale.set(this.baseScale);        
        this.addChildAt(this.characterP1PreviewSprite, 3);
        
        this.createSpecialButton(426, 1011, this.containerSkill);

        this.characterP1PreviewName.position.set(320, 970);
    } 

    private createTutorialSkillContainerP1()
    {        
        this.containerSkill = new TutorialSkill(this.game, 500, 800);
        this.addChild(this.containerSkill);
        this.containerSkill.updateDescription(0);  
    }
    
    private createTutorialSkillContainerP2()
    {        
        this.containerSkillP2 = new TutorialSkill(this.game, 2300, 800);
        this.addChild(this.containerSkillP2);
        this.containerSkillP2.updateDescription(3);  
    }

    private createSelecTitle(text, x, y) {
              
        var bgVsTitle = SpriteUtils.createSprite('bgVsTitle', 0, 0);
        bgVsTitle.anchor.set(0.5);        
        bgVsTitle.position.set(x-bgVsTitle.width/2,y+50);
        bgVsTitle.zIndex = 8;
        this.addChild(bgVsTitle);
                
        let txtTitle = new PIXI.Text(text, windowTitleTextStyle);
        txtTitle.anchor.set(0.5);    
        txtTitle.zIndex = 9;
        this.addChild(txtTitle);
        txtTitle.position.set(bgVsTitle.x + 40, bgVsTitle.y);
    }
    

    private setCharacterSelectIcon(character: gameCharacters, x: number, y: number) {
        var characterIconSprite = SpriteUtils.createSprite(Characters[character].selectionIcon, x, y);
        var charOverSprite = SpriteUtils.createSprite('highlight2', x, y);
        var charOverSpriteP2 = SpriteUtils.createSprite('highlight2', x, y);
        var charCardP1 = SpriteUtils.createSprite('p1Select', x, y);
        var charCardP2 = SpriteUtils.createSprite('p2Select', x, y);

        characterIconSprite.scale.set(this.baseScale);
        characterIconSprite.anchor.set(0.5);
        characterIconSprite.x = x;
        characterIconSprite.y = y;

        if (this.enabledCharacters[character].enabled) {            
            characterIconSprite.interactive = true;
            characterIconSprite.buttonMode = true;
        } else {
            characterIconSprite.tint = 0x5e5e5e;
        }

        this.addChild(characterIconSprite);

        //setup highlight and particles image
        //charParticleSprite.alpha = 0;
        charOverSprite.alpha = 0;        
        charOverSpriteP2.alpha = 0;      
        charCardP2.alpha = 0;
        //charParticleSprite.anchor.set(0.5);  
        charOverSprite.anchor.set(0.5);
        charOverSpriteP2.anchor.set(0.5);
        //characterIconSprite.addChild(charParticleSprite);
        characterIconSprite.addChild(charOverSprite);
        characterIconSprite.addChild(charOverSpriteP2);
        
        
        //setup left card (Player 1)
        charCardP1.alpha = 0;
        var posXLeftCard = characterIconSprite.x-characterIconSprite.width/2 + 20;
        var posYLeftCard = characterIconSprite.y-characterIconSprite.height/2 + 20;
        charCardP1.position.set(posXLeftCard, posYLeftCard);        
        charCardP1.anchor.set(0.5);
        charCardP1.zIndex = 10;
        this.addChild(charCardP1);
        
        let p1Txt = new PIXI.Text(Localization.loc('P1Token'), versusCharPlayerNumberTextStyle);
        p1Txt.anchor.set(0.5);
        charCardP1.addChild(p1Txt);
        
        //setup right card (Player 2)        
        var posXRightCard = characterIconSprite.x+characterIconSprite.width/2 - 20;
        var posYRightCard = characterIconSprite.y-characterIconSprite.height/2 + 20;
        charCardP2.position.set(posXRightCard, posYRightCard);
        charCardP2.anchor.set(0.5);
        charCardP2.zIndex = 10;
        this.addChild(charCardP2);
        
        let p2Txt = new PIXI.Text(Localization.loc('P2Token'), versusCharPlayerNumber2TextStyle);
        p2Txt.anchor.set(0.5);
        charCardP2.addChild(p2Txt);
        
                
        characterIconSprite.on('tap', () => {
            console.log("Tap: "+character);
            if (this.isPlayer1Selection) {
                this.handleCharacterSelection(character, charCardP1);
            } else {
                this.handleCharacterSelection(character, charCardP2);
            }
        });
                
        characterIconSprite.on('click', () => {
            //console.log("Click: "+character);
            if (this.isPlayer1Selection) {
                this.handleCharacterSelection(character, charCardP1);
            } else {
                this.handleCharacterSelection(character, charCardP2);
            }
        });

        characterIconSprite.on('mouseover', () => {
            //console.log("Over: "+character);            
            if (this.isPlayer1Selection) {                
                this.SetSelectedCharacter(character, true);
            } else {                
                this.SetSelectedCharacterP2(character, true);
            }
        });

        characterIconSprite.on('mouseout', (event) => {            
            //this.HideAllCardAndOver(false);
        });
        
        //store needed sprites
        this.enabledCharacters[character].sprCard = charCardP1;
        //this.enabledCharacters[character].sprParticle = charParticleSprite;
        this.enabledCharacters[character].sprOver = charOverSprite;
        this.enabledCharacters[character].sprCardP2 = charCardP2;
        //this.enabledCharacters[character].sprParticleP2 = charParticleSpriteP2;
        this.enabledCharacters[character].sprOverP2 = charOverSpriteP2;
        this.enabledCharacters[character].sprIcon = characterIconSprite;
    }

    handleCharacterSelection(character: gameCharacters, card) {
        console.log("Card: ", card);
        
        console.log("PlayerSelection: ",this.isPlayer1Selection);
        if (this.isPlayer1Selection) {
            this.SetSelectedCharacter(character, true);
            this.isPlayer1Selection = !this.isPlayer1Selection;
            this.player1Selection = character;
            this.player1SelectionCard = card;
            return;
        } else {
            this.SetSelectedCharacterP2(character, true);
            this.player2Selection = character;
            this.player2SelectionCard = card;
            this.player1SelectionCard.alpha = 0;
            this.player2SelectionCard.alpha = 0;
        }
        
        this.game.setState("gamePlay", {
            newGame: true,
            gameMode: this.gameMode,
            p1Character: this.player1Selection,
            p2Character: this.player2Selection
        });

    }

    private SetSelectedCharacter(character, hide?:boolean)
    {
        if(hide) this.HideAllCardAndOver(false);
        
        this.enabledCharacters[character].sprOver.alpha = 1;
        this.enabledCharacters[character].sprCard.alpha = 1;
        this.characterP1PreviewName.text = Localization.loc('character' + Characters[character].spriteKey + 'Upper');
        this.characterP1PreviewSprite.texture = this.GetCharSpriteFromId(character); 
        this.player1Selection = character;

        this.containerSkill.updateDescription(character);
    }

    private SetSelectedCharacterP2(character, hide?:boolean)
    {
        if(hide) this.HideAllCardAndOver(false);
        
        this.enabledCharacters[character].sprOverP2.alpha = 1;
        this.enabledCharacters[character].sprCardP2.alpha = 1;
        this.characterP2PreviewName.text = Localization.loc('character' + Characters[character].spriteKey + 'Upper');
        this.characterP2PreviewSprite.texture = this.GetCharSpriteFromId(character); 
        this.player2Selection = character;

        this.containerSkillP2.updateDescription(character);
    }

    private HideAllCardAndOver(ignoreSlection:boolean)
    {  
        if(ignoreSlection){
            for(var char in this.enabledCharacters) 
            {
                this.enabledCharacters[char].sprOver.alpha = 0;
                this.enabledCharacters[char].sprCard.alpha = 0;
                //this.enabledCharacters[char].sprParticle.alpha = 0;
                this.enabledCharacters[char].sprOverP2.alpha = 0;
                this.enabledCharacters[char].sprCardP2.alpha = 0;
                //this.enabledCharacters[char].sprParticleP2.alpha = 0;
            }
        }else{
            for(var char in this.enabledCharacters) 
            {                     
                if(this.isPlayer1Selection){
                   this.enabledCharacters[char].sprOver.alpha = 0;
                   this.enabledCharacters[char].sprCard.alpha = 0;
                   //this.enabledCharacters[char].sprParticle.alpha = 0;
                }else{
                   this.enabledCharacters[char].sprOverP2.alpha = 0;
                   this.enabledCharacters[char].sprCardP2.alpha = 0;
                   //this.enabledCharacters[char].sprParticleP2.alpha = 0;
                }
            } 
        }
        
               
    }

    private refreshEnabledCharacters()
    {
        this.enabledCharacters[gameCharacters.jasper].enabled = Persistance.isEnabledCharacter(gameCharacters.jasper);
        this.enabledCharacters[gameCharacters.y_diamond].enabled = Persistance.isEnabledCharacter(gameCharacters.y_diamond);
        this.enabledCharacters[gameCharacters.peridot].enabled = Persistance.isEnabledCharacter(gameCharacters.peridot);        

        this.enabledCharactersButtons(gameCharacters.jasper);
        this.enabledCharactersButtons(gameCharacters.y_diamond);
        this.enabledCharactersButtons(gameCharacters.peridot);
    }

    private enabledCharactersButtons(character)
    {
        if (this.enabledCharacters[character].enabled) {            
            this.enabledCharacters[character].sprIcon.interactive = true;
            this.enabledCharacters[character].sprIcon.buttonMode = true;        
            this.enabledCharacters[character].sprIcon.tint = 0xFFFFFF;
        }
    }

    private GetCharSpriteFromId(character): PIXI.Texture
    {
        return SpriteUtils.getTexture(Characters[character].selectionPreviewImage);
    }
}