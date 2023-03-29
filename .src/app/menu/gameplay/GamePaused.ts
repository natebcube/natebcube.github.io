import * as PIXI from 'pixi.js';
import GamePlay from "../GamePlay";
import { timerUITextStyle, pauseScreenButtonText } from '../../textStyles/textStyles';
import Localization from '../../controller/Localization';
import TutorialControlScreenMovile from './TutorialSkills/TutorialControlScreenMovile';
import TutorialScreenBase from './TutorialSkills/TutorialScreenBase';
import TutorialControlScreenPC from './TutorialSkills/TutorialControlScreenPC';
import SpriteUtils from '../../utils/SpriteUtils';
/**
 * GamePause state Pauses the game
 */
export default class GamePaused extends PIXI.Container
{
    private game:any;   
    private gamePlay:GamePlay;
    private isVersus:boolean;
    private controlScreen;

    constructor(isVersus:boolean,game:any, gameplay:GamePlay, width:number, height:number)
    {
        super();
        this.gamePlay = gameplay;
        this.game = game;
        this.name = "GamePaused";
        this.width = width;
        this.height = height;
        this.isVersus = isVersus;

        var bgPause = SpriteUtils.createSprite('black', 0, 0);
        bgPause.alpha = 0.8;
        bgPause.width = width;
        bgPause.height = height+80;    
        this.addChild(bgPause); 

        this.controlScreen = new TutorialScreenBase(this.game, true, false);
        if(this.game.isMobile)
        {
            this.controlScreen = new TutorialControlScreenMovile(this.game, false, false);
        }else{
            this.controlScreen = new TutorialControlScreenPC(this.game, this.isVersus, false);
        }

        this.addChild(this.controlScreen);

        var label = this.setPauseTxt();        
        
        this.setBackMainMenuBtn(label);
        this.setResumeBtn(label);
        this.showScreen(false);        
    }

    showScreen(show:boolean)
    {
        this.visible = show;
    }

    setPauseTxt()
    {
        var label = new PIXI.Text(Localization.loc("PAUSE"), timerUITextStyle);        
        label.style.fill = 0xFFFFFF;
        label.style.fontSize = 100;
        label.position.set(this.width/2, 100);   
        label.anchor.set(0.5);  
        this.addChild(label);
        return label;
    }

    setBackMainMenuBtn(label)
    {
        var btnBackToMainMenu = SpriteUtils.createSprite('backArrow', 0, 0);
        btnBackToMainMenu.position.set(this.width/2+label.width/2, this.height/2 + label.height+250);
        btnBackToMainMenu.interactive = true;
        btnBackToMainMenu.buttonMode = true;       
        btnBackToMainMenu.anchor.set(0.5);

        btnBackToMainMenu.on('tap', (event) => {            
            this.gamePlay.restart();
        });

        btnBackToMainMenu.on('click', (event) => {           
            this.gamePlay.restart();
        }); 

        this.addChild(btnBackToMainMenu);

        var txt = new PIXI.Text(Localization.loc("BACK_TO_MENU"), pauseScreenButtonText);         
        txt.position.set(0, btnBackToMainMenu.height/2 + 30);   
        txt.anchor.set(0.5);  
        btnBackToMainMenu.addChild(txt);
    }

       

    setResumeBtn(label)
    {
        const xPos: number = this.width/2-label.width/2;
        const yPos: number = this.height/2 + label.height + 250

        var btnQuitPause = SpriteUtils.createSprite('playButton', xPos, yPos, 
            {
                centered: true,
                action: () => {
                    this.gamePlay.pauseGame(false);
                },
                scale: 0.7
            }
        );
        this.addChild(btnQuitPause); 

        var txt = new PIXI.Text(Localization.loc("RESUME"), pauseScreenButtonText);         
        txt.position.set(xPos, yPos + btnQuitPause.height/2 + 30);   
        txt.anchor.set(0.5);  
        this.addChild(txt);
    }
      
    UpdateGameModeToVersus(isVersus:boolean)
    {
        this.removeChild(this.controlScreen);
        if(this.game.isMobile)
        {
            this.controlScreen = new TutorialControlScreenMovile(this.game, false, false);
        }else{
            this.controlScreen = new TutorialControlScreenPC(this.game, isVersus, false);
        }
        this.addChild(this.controlScreen);
    }
}