import * as PIXI from 'pixi.js';
import GameScene from './GameScene';
import { specialButtonLabelTextStyle, versusCharPlayerNumberTextStyle, storyCharacterSelectNameTextUIStyle, windowTitleTextStyle } from '../textStyles/textStyles';
import { gameCharacters } from '../enums/enums';
import Characters from '../Characters';
import SpriteUtils from '../utils/SpriteUtils';
import Persistance from '../Persistance';
import { viewport } from '../config';
import Localization from '../controller/Localization';
import TutorialSkill from './gameplay/TutorialSkills/TutorialSkillsSlider';
import Debug from '../Debug';

/**
 * Display Main Menu screen
 */
export default class GameCharacterSelect extends GameScene {
    questionIcon: PIXI.Sprite;
    characterPreviewSprite: PIXI.Sprite;
    characterPreviewName: PIXI.Text;
    characterSelectionGrid: PIXI.Container;
    selectedCharacter: gameCharacters;
    enabledCharacters: {};
    highlights: {} = {};
    selectedMode: string;
    
    containerSkill:TutorialSkill;

    V_PADDING:number = 80;
    H_PADDING:number = 100;

    constructor(game) {
        super(game, '', 'arcadeBG');
        
        this.baseScale = 1.5;
        this.game = game;
        this.createSelecTitle(Localization.loc('CHOOSE_YOUR_FIGHTER'), viewport.width, 50);

        this.setBackArrow("modeSelectMenu",{});
        this.createTutorialSkillContainerP1();
        this.showInitialCharacterP1();

        
        // TODO: Get from data
        this.enabledCharacters = {
            [gameCharacters.steven]: {enabled: Persistance.isEnabledCharacter(gameCharacters.steven), sprOver: null, sprCard: null, sprIcon: null},
            [gameCharacters.amethyst]: {enabled: Persistance.isEnabledCharacter(gameCharacters.amethyst), sprOver: null, sprCard: null, sprIcon: null},
            [gameCharacters.garnet]: {enabled: Persistance.isEnabledCharacter(gameCharacters.garnet), sprOver: null, sprCard: null, sprIcon: null},
            //[gameCharacters.j_minion]: {enabled: true, sprOver: null, sprCard: null},
            [gameCharacters.jasper]: {enabled: Persistance.isEnabledCharacter(gameCharacters.jasper), sprOver: null, sprCard: null, sprIcon: null},
            //[gameCharacters.p_minion]: {enabled: true, sprOver: null, sprCard: null},
            [gameCharacters.pearl]: {enabled: Persistance.isEnabledCharacter(gameCharacters.pearl), sprOver: null, sprCard: null, sprIcon: null},
            [gameCharacters.peridot]: {enabled: Persistance.isEnabledCharacter(gameCharacters.peridot), sprOver: null, sprCard: null, sprIcon: null},
            [gameCharacters.y_diamond]: {enabled: Persistance.isEnabledCharacter(gameCharacters.y_diamond), sprOver: null, sprCard: null, sprIcon: null},
            //[gameCharacters.y_minion]: {enabled: true, sprOver: null, sprCard: null},
        };
        
        
        const offsetY = 100;
        const spaceX = 200;        
        const initPosY = 300;
        const xPosLeftChar = viewport.width-500;
        const xPosRightChar = xPosLeftChar + spaceX ;        
        const sprHeight = 213; // tamaño del sprite * 1.5 (esta es la escala base)        
        
              
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
        
        
        
        this.SetSelectedCharacter(gameCharacters.steven);                
        //this.addPatternText(this.comboSprite.x + this.comboSprite.width/2,this.comboSprite.y-250);
        this.addTutorialControlsScreen(false);
        //this.preselectCharacter(gameCharacters.steven);
    }

    private createTutorialSkillContainerP1()
    {        
        this.containerSkill = new TutorialSkill(this.game, viewport.width/2, viewport.height/2-80);          
        this.containerSkill.scale.set(1);
        this.addChild(this.containerSkill);
        this.containerSkill.updateDescription(0);  
    }
    
    private showInitialCharacterP1() 
    {
        this.characterPreviewName = new PIXI.Text("STEVEN", storyCharacterSelectNameTextUIStyle);
        this.characterPreviewName.anchor.set(0.5);
        this.characterPreviewName.position.set(viewport.width/2 - 400, viewport.height-160);        
        this.addChild(this.characterPreviewName);
                
        this.characterPreviewSprite = PIXI.Sprite.from(this.GetCharSpriteFromId(0));        
        this.characterPreviewSprite.anchor.set(0, 1);
        this.characterPreviewSprite.position.set(0,viewport.height);
        this.characterPreviewSprite.scale.set(this.baseScale);
        this.addChildAt(this.characterPreviewSprite, 3);

        this.createSpecialButton(1090, 1015, this.containerSkill);
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
        txtTitle.position.set(bgVsTitle.x,bgVsTitle.y);
    }  

    private selectCharacter(character:gameCharacters) {
        if (this.enabledCharacters[character].enabled) {
            if (this.selectedCharacter == character) {
                this.confirmCharacterSelection(character);
            } else {
                this.SetSelectedCharacter(character);
            }
        }
    }

    private confirmCharacterSelection(character: gameCharacters) {
        if (this.selectedMode == 'story') {
            const maxStage = Persistance.getStoryProgress().stage;
            this.game.setState('stageMapMenu', { Stage: maxStage, Character: character });
        } else {
            const opponents = [ gameCharacters.amethyst, gameCharacters.garnet, gameCharacters.jasper, gameCharacters.peridot, gameCharacters.y_diamond ]; // TODO: Pick randomly, what criteria?
            this.game.setState('arcadeTower', { opponents, character, towerFloor: 1 });
        }
    }    

    private setCharacterSelectIcon(character: gameCharacters, x: number, y: number) 
    {
        const characterIconSprite = SpriteUtils.createSprite(Characters.getArcadeSelectionIconKey(character), x, y);
        const characterIconSpriteHighlight1 = SpriteUtils.createSprite('highlight1', x, y);
        const characterIconSpriteHighlightP1Card = SpriteUtils.createSprite('p1Select', x, y);

        characterIconSprite.scale.set(this.baseScale);
        characterIconSprite.anchor.set(0.5);
        characterIconSprite.position.set(x,y);
        
        if (this.enabledCharacters[character].enabled) {            
            characterIconSprite.interactive = true;
            characterIconSprite.buttonMode = true;
        } else {
            characterIconSprite.tint = 0x5e5e5e;            
        }
        
        this.addChild(characterIconSprite);

        //setup highlight and particles image
        characterIconSpriteHighlight1.alpha = 0;
        characterIconSpriteHighlight1.anchor.set(0.5);  
        characterIconSprite.addChild(characterIconSpriteHighlight1);
        
        
        //setup left card (Player 1)
        characterIconSpriteHighlightP1Card.alpha = 0;
        var posXLeftCard = characterIconSprite.x-characterIconSprite.width/2 + 20;
        var posYLeftCard = characterIconSprite.y-characterIconSprite.height/2 + 20;
        characterIconSpriteHighlightP1Card.position.set(posXLeftCard, posYLeftCard);        
        characterIconSpriteHighlightP1Card.anchor.set(0.5);
        characterIconSpriteHighlightP1Card.zIndex = 10;
        this.addChild(characterIconSpriteHighlightP1Card);
        
        let p1Txt = new PIXI.Text(Localization.loc("P1Token"), versusCharPlayerNumberTextStyle);
        p1Txt.anchor.set(0.5);
        characterIconSpriteHighlightP1Card.addChild(p1Txt);
                
               
        characterIconSprite.on('tap', () => {
            Debug.log("Tap: "+character);            
            //this.handleCharacterSelection(character, characterIconSpriteHighlightP1Card);
            this.selectCharacter(character);
        });
                
        characterIconSprite.on('click', () => {
            //this.handleCharacterSelection(character, characterIconSpriteHighlightP1Card);
            this.selectCharacter(character);
        });

        characterIconSprite.on('mouseover', () => {
            this.SetSelectedCharacter(character);
        });

        characterIconSprite.on('mouseout', (event) => {
            this.HideAllCardAndOver();        
        });
        
        this.enabledCharacters[character].sprCard = characterIconSpriteHighlightP1Card;
        this.enabledCharacters[character].sprOver = characterIconSpriteHighlight1;
        this.enabledCharacters[character].sprIcon = characterIconSprite;
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
    
    private HideAllCardAndOver()
    {
        for(var char in this.enabledCharacters) {                     
            this.enabledCharacters[char].sprOver.alpha = 0;
            this.enabledCharacters[char].sprCard.alpha = 0;
        }        
    }

    private SetSelectedCharacter(character: gameCharacters)
    {
        this.HideAllCardAndOver();
        
        this.enabledCharacters[character].sprOver.alpha = 1;
        this.enabledCharacters[character].sprCard.alpha = 1;
        this.characterPreviewName.text = Localization.loc('character' + Characters[character].spriteKey + 'Upper');
        this.characterPreviewSprite.texture = this.GetCharSpriteFromId(character); 
        this.selectedCharacter = character;

        this.containerSkill.updateDescription(character);
    }

    enter(opts) {
        this.selectedMode = opts.gameMode;
        this.refreshEnabledCharacters();
		this.containerSkill.show(false);
		this.game.soundManager.playBGXSound('characterSelect');
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