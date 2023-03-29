import * as PIXI from 'pixi.js';
import { tittleTutorialScreen, contentTutorialScreen, contentTutorialScreenMovileBig, contentTutorialScreenMovileMedium } from '../../../textStyles/textStyles';
import Localization from '../../../controller/Localization';
import TutorialScreenBase from './TutorialScreenBase';
import SpriteUtils from '../../../utils/SpriteUtils';


/**
 * Pantalla de tutorial de los controles
 */
export default class TutorialControlScreenMovile extends TutorialScreenBase
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
            bg = SpriteUtils.createSprite('tutorialControlsBgVs', 0, 0);
        }else{
            bg = SpriteUtils.createSprite('touchBG', 0, 0);
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
        
        //hacer q quede por encima
        this.zIndex = 100;
        //this.container.visible = false;        
    }

    private drawPlayer1Section(isVersus: boolean,leftLimit:number, topLimit:number, bgWidth:number)
    {       
        // tittle        
        var tittle = new PIXI.Text(Localization.loc('CONTROLS'), tittleTutorialScreen);
        tittle.anchor.set(0.5);        
        tittle.position.set(/*isVersus ? 0 : 50*/0,topLimit);
        this.container.addChild(tittle); 
        
        // TAP TO ROTATE IMG
        var imgRotate = SpriteUtils.createSprite('rotateTouch', 0, 0);
        imgRotate.anchor.set(0.5,0);
        imgRotate.position.set(leftLimit + 50,topLimit+50);
        this.container.addChild(imgRotate);

        // TAP text
        var dropTxt = new PIXI.Text(Localization.loc('TAP'), contentTutorialScreenMovileBig);
        dropTxt.anchor.set(0.5,0);
        dropTxt.position.set(imgRotate.x + 150,imgRotate.y);
        this.container.addChild(dropTxt);

        //TO ROTATE text
        var dropTxt = new PIXI.Text(Localization.loc('TO_ROTATE'), contentTutorialScreenMovileMedium);
        dropTxt.anchor.set(0.5,0);
        dropTxt.position.set(imgRotate.x + 200,imgRotate.y+dropTxt.height);
        this.container.addChild(dropTxt);


        // SKILL IMG
        var imgMove = SpriteUtils.createSprite('activateSkillTouch', 0, 0);
        imgMove.anchor.set(0.5,0);
        imgMove.position.set(leftLimit + 50, 50);
        this.container.addChild(imgMove);

        // TAP text
        var dropSkillTxt = new PIXI.Text(Localization.loc('TAP'), contentTutorialScreenMovileBig);
        dropSkillTxt.anchor.set(0.5,0);
        dropSkillTxt.position.set(imgRotate.x + 150,imgMove.y);
        this.container.addChild(dropSkillTxt);

        // skill text
        var skillTxt = new PIXI.Text(Localization.loc('ACTIVATE_SKILL_MOVILE'), contentTutorialScreenMovileMedium);
        skillTxt.anchor.set(0.5,0);
        skillTxt.position.set(imgMove.x + 150,imgMove.y+dropSkillTxt.height);
        this.container.addChild(skillTxt);    

        // DROP touch
        var imgDrop = SpriteUtils.createSprite('dropTouch', 0, 0);
        imgDrop.anchor.set(0.5,0);
        imgDrop.position.set(leftLimit + 550,topLimit+ 50);
        this.container.addChild(imgDrop);

        // DROP text
        var moveTxt = new PIXI.Text(Localization.loc('DROP_MOVILE'), contentTutorialScreenMovileBig);
        moveTxt.anchor.set(0.5,0);
        moveTxt.position.set(imgDrop.x +150,imgDrop.y);
        this.container.addChild(moveTxt); 

        // DROP text
        var pieceTxt = new PIXI.Text(Localization.loc('PIECE'), contentTutorialScreenMovileMedium);
        pieceTxt.anchor.set(0.5,0);
        pieceTxt.position.set(imgDrop.x +150,imgDrop.y+moveTxt.height);
        this.container.addChild(pieceTxt);
            
        // MOVE IMG
        var imgMove = SpriteUtils.createSprite('moveTouch', 0, 0);
        imgMove.anchor.set(0.5,0);
        imgMove.position.set(leftLimit + 550,topLimit+250);
        this.container.addChild(imgMove);

        // DRAG text
        var dragTxt = new PIXI.Text(Localization.loc('DRAG'), contentTutorialScreenMovileBig);
        dragTxt.anchor.set(0.5,0);
        dragTxt.position.set(imgMove.x +150,imgMove.y);
        this.container.addChild(dragTxt); 

        // DRAG text
        var dragMoveTxt = new PIXI.Text(Localization.loc('DRAG_MOVE'), contentTutorialScreenMovileMedium);
        dragMoveTxt.anchor.set(0.5,0);
        dragMoveTxt.position.set(imgMove.x +200,imgMove.y+dragTxt.height);
        this.container.addChild(dragMoveTxt); 

        //player 1 text
        var player1Txt = new PIXI.Text(Localization.loc('PLAYER')+" 1", contentTutorialScreenMovileBig);
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
        moveArrowsTxt.anchor.set(0.5);
        moveArrowsTxt.position.set(imgArrows.x,imgArrows.y+90);
        this.container.addChild(moveArrowsTxt); 

        // Alt Gr img
        var imgAltGr = SpriteUtils.createSprite('keyAltGrControl', 0, 0);
        imgAltGr.anchor.set(0.5,0);
        imgAltGr.position.set(leftLimit + 820,0);
        this.container.addChild(imgAltGr);

        // drop alt text
        var dropAltTxt = new PIXI.Text(Localization.loc('DROP'), contentTutorialScreen);
        dropAltTxt.anchor.set(0.5);
        dropAltTxt.position.set(imgAltGr.x,imgAltGr.y+90);
        this.container.addChild(dropAltTxt);

        // Control img
        var imgCtrl = SpriteUtils.createSprite('keyCtrlControl', 0, 0);
        imgCtrl.anchor.set(0.5,0);
        imgCtrl.position.set(leftLimit + 970,0);
        this.container.addChild(imgCtrl);

        // skill control text
        var skillCtrlTxt = new PIXI.Text(Localization.loc('ACTIVATE_SKILL'), contentTutorialScreen);
        skillCtrlTxt.anchor.set(0.5, 0);
        skillCtrlTxt.position.set(imgCtrl.x,imgCtrl.y+70);
        this.container.addChild(skillCtrlTxt);

        //player 2 text
        var player2Txt = new PIXI.Text(Localization.loc('PLAYER')+" 2", contentTutorialScreen);
        player2Txt.anchor.set(0.5);
        player2Txt.position.set(bgWidth/2,(topLimit*-1));
        this.container.addChild(player2Txt);
    }

}