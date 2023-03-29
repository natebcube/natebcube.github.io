import * as PIXI from 'pixi.js';
import BaseScene from '../utils/State';
import { GameApp } from '../app';
import { fancyTextStyle, versusCharPlayerNumberTextStyle } from '../textStyles/textStyles';
import { viewport } from '../config';
import TutorialControlScreenPC from './gameplay/TutorialSkills/TutorialControlScreenPC';
import Localization from '../controller/Localization';
import TutorialControlScreenMovile from './gameplay/TutorialSkills/TutorialControlScreenMovile';
import TutorialScreenBase from './gameplay/TutorialSkills/TutorialScreenBase';
import SpriteUtils from '../utils/SpriteUtils';

/**
 * Base class for all game scenes
 */
export default class GameScene extends BaseScene {

    game: GameApp;
    background;
    title;
    baseScale:number;
    gameMode: string;
    backArrow: any;
    // info;
    // infoVisibilityCounter;

    constructor(game: GameApp, titleText = 'Steven Universe', backgroundTexture: string) {
        super();

        this.game = game;

        this.setBackground(backgroundTexture);

        this.title = new PIXI.Text(titleText, fancyTextStyle);
        this.title.anchor.set(0.5);
        this.title.x = viewport.width * 0.5;
        this.title.y = viewport.height * 0.20;
        this.addChild(this.title);
    }    

    protected addPatternText(posX:number, posY:number)
    {   
        var container = new PIXI.Container();
        container.position.set(posX, posY);
        container.scale.set(this.baseScale);
        this.addChild(container);

        var bgPattern = SpriteUtils.createSprite('attackPatternBg', 0, 0);
        bgPattern.anchor.set(0.5);
        
        container.addChild(bgPattern);

        var patternText = new PIXI.Text(Localization.loc('ATTACK_PATTERN'), versusCharPlayerNumberTextStyle);
        patternText.anchor.set(0.5);        
        container.addChild(patternText);   

        bgPattern.width = patternText.width+50;
    }

    protected setBackArrow(link:string, opt:any) {
        this.backArrow = SpriteUtils.createSprite('backArrow', 138, 106, { centered: true, action: () => {
            this.game.setState(link, opt);
        }
        });
        
        this.addChild(this.backArrow);
    }

    protected addTutorialControlsScreen(isVersus:boolean)
    {        
        var tutorialControls:TutorialScreenBase;
        if(this.game.isMobile)
        {
            tutorialControls = new TutorialControlScreenMovile(this.game, false, true);             
        }else{            
            tutorialControls = new TutorialControlScreenPC(this.game, isVersus, true);              
        }
        this.addChild(tutorialControls); 
        tutorialControls.Display(false);     
    }

    protected setBackground(backgroundLocation: string) {
        const backgroundSprite = SpriteUtils.createSprite(backgroundLocation, 0, 0);
        backgroundSprite.pivot.set(0);
        backgroundSprite.width = viewport.width;
        backgroundSprite.height = viewport.height; // TODO: This will cause the background to stretch.
        backgroundSprite.y = 0;
        backgroundSprite.x = 0;
        this.background = backgroundSprite;
        this.addChildAt(backgroundSprite, 0);

    }

    protected updateBackground(backgroundLocation) {
        this.background.texture = (backgroundLocation);
        this.background.width = viewport.width;
        this.background.height = viewport.height;
        this.background.y = 0;
        this.background.x = 0;       

    }

    update(dt) {
        // if (--this.infoVisibilityCounter == 0) {
        //     this.infoVisibilityCounter = 45;
        //     this.info.visible = !this.info.visible;
        // }
    }
}
