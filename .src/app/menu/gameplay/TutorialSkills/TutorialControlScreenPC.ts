import * as PIXI from 'pixi.js';
import { tittleTutorialScreen, contentTutorialScreen } from '../../../textStyles/textStyles';
import Localization from '../../../controller/Localization';
import TutorialScreenBase from './TutorialScreenBase';
import SpriteUtils from '../../../utils/SpriteUtils';


/**
 * Pantalla de tutorial de los controles
 */
export default class TutorialControlScreenPC extends TutorialScreenBase
{   

    constructor(game:any, isVersus:boolean, useCloseBtn:boolean)
    {
        super(game, isVersus, useCloseBtn);  

        this.container = new PIXI.Container();
        this.addChild(this.container);

        //background        
        var bg;
        if(isVersus)
        {
            bg = SpriteUtils.createSprite('tutorialControlsBgVs', 0, 0)
        }else{
            bg = SpriteUtils.createSprite('tutorialControlsBg', 0, 0);
        }

        bg.anchor.set(0.5);
        this.container.addChild(bg);
        var paddingX = 80;
        var paddingY = 50;
        var width = bg.width/2;
        var leftLimit = -width + paddingX;
        var topLimit = -bg.height/2 + paddingY;

        this.drawPlayer1Section(isVersus,leftLimit,topLimit,width);
        this.drawCloseBtn(leftLimit,topLimit);

        if(isVersus)
        {        
            this.drawPlayer2Section(leftLimit,topLimit,width);
        }
        
        //hacer q quede por encima
        this.zIndex = 100;
        
        //this.controlBtn.visible = true;
    }   

    private drawPlayer1Section(isVersus: boolean,leftLimit:number, topLimit:number, bgWidth:number)
    {       
        // tittle
        
        var tittle = new PIXI.Text(Localization.loc('CONTROLS'), tittleTutorialScreen);
        tittle.anchor.set(0.5);        
        tittle.position.set(isVersus ? 0 : 0,topLimit);
        this.container.addChild(tittle); 

        // WASD img
        var imgWasd = SpriteUtils.createSprite('wasdControl', 0, 0);
        imgWasd.anchor.set(0.5);
        imgWasd.position.set(leftLimit + 80,0);
        this.container.addChild(imgWasd);

        // move text
        var moveTxt = new PIXI.Text(Localization.loc('MOVE'), contentTutorialScreen);
        moveTxt.anchor.set(0.5,0);
        moveTxt.position.set(imgWasd.x,imgWasd.y+60);
        this.container.addChild(moveTxt); 

        // V img
        var imgV = SpriteUtils.createSprite('keyVControl', 0, 0);
        imgV.anchor.set(0.5,0);
        imgV.position.set(leftLimit + 250,0);
        this.container.addChild(imgV);

        // drop text
        var dropTxt = new PIXI.Text(Localization.loc('DROP'), contentTutorialScreen);
        dropTxt.anchor.set(0.5,0);
        dropTxt.position.set(imgV.x,imgV.y+60);
        this.container.addChild(dropTxt);

        // N img
        var imgN = SpriteUtils.createSprite('keyNControl', 0, 0);
        imgN.anchor.set(0.5,0);
        imgN.position.set(leftLimit + 400,0);
        this.container.addChild(imgN);

        // skill text
        var skillTxt = new PIXI.Text(Localization.loc('ACTIVATE_SKILL'), contentTutorialScreen);
        skillTxt.anchor.set(0.5, 0);
        skillTxt.position.set(imgN.x,imgN.y+60);
        this.container.addChild(skillTxt);        

        //player 1 text
        var player1Txt = new PIXI.Text(Localization.loc('PLAYER')+" 1", contentTutorialScreen);
        player1Txt.anchor.set(0.5);
        var posX = isVersus ? -bgWidth / 2 : 0;
        player1Txt.position.set(posX,(topLimit*-1));
        this.container.addChild(player1Txt);
        
    }

    private drawPlayer2Section(leftLimit:number, topLimit:number, bgWidth:number)
    {
        // Arrows img
        var imgArrows = SpriteUtils.createSprite('arrowsControl', 0, 0);
        imgArrows.anchor.set(0.5);
        imgArrows.position.set(leftLimit + 650,0);
        this.container.addChild(imgArrows);

        // move arrow text
        var moveArrowsTxt = new PIXI.Text(Localization.loc('MOVE'), contentTutorialScreen);
        moveArrowsTxt.anchor.set(0.5,0);
        moveArrowsTxt.position.set(imgArrows.x,imgArrows.y+60);
        this.container.addChild(moveArrowsTxt); 

        // Alt Gr img
        var imgAltGr = SpriteUtils.createSprite('keyAltGrControl', 0, 0);
        imgAltGr.anchor.set(0.5,0);
        imgAltGr.position.set(leftLimit + 820,0);
        this.container.addChild(imgAltGr);

        // drop alt text
        var dropAltTxt = new PIXI.Text(Localization.loc('DROP'), contentTutorialScreen);
        dropAltTxt.anchor.set(0.5,0);
        dropAltTxt.position.set(imgAltGr.x,imgAltGr.y+60);
        this.container.addChild(dropAltTxt);

        // Control img
        var imgCtrl = SpriteUtils.createSprite('keyCtrlControl', 0, 0);
        imgCtrl.anchor.set(0.5,0);
        imgCtrl.position.set(leftLimit + 970,0);
        this.container.addChild(imgCtrl);

        // skill control text
        var skillCtrlTxt = new PIXI.Text(Localization.loc('ACTIVATE_SKILL'), contentTutorialScreen);
        skillCtrlTxt.anchor.set(0.5, 0);
        skillCtrlTxt.position.set(imgCtrl.x,imgCtrl.y+60);
        this.container.addChild(skillCtrlTxt);

        //player 2 text
        var player2Txt = new PIXI.Text(Localization.loc('PLAYER')+" 2", contentTutorialScreen);
        player2Txt.anchor.set(0.5);
        player2Txt.position.set(bgWidth/2,(topLimit*-1));
        this.container.addChild(player2Txt);
    }

}