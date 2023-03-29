import * as PIXI from 'pixi.js';
import { viewport } from '../../../config';
import SpriteUtils from '../../../utils/SpriteUtils';

export default class TutorialScreenBase extends PIXI.Container
{
    protected game:any;
    protected baseScale:number;
    protected controlBtn:PIXI.Sprite;
    protected container:PIXI.Container;
    protected useCloseBtn:boolean;

    constructor(game:any, isVersus:boolean, useCloseBtn:boolean)
    {
        super();
        this.game = game;                
        this.baseScale = 1.5;
        this.useCloseBtn = useCloseBtn;
        this.position.set(viewport.width/2,viewport.height/2-20);
        this.scale.set(this.baseScale);

        this.addControlBtn();        
    } 
    
    Display(visible:boolean)
    {
        this.container.visible = visible;
    }

    protected drawCloseBtn(leftLimit:number, topLimit:number)
    {
        if(!this.useCloseBtn) return;

        // X button
        var btnX = SpriteUtils.createSprite('closeButtonControl', 0, 0);
        btnX.anchor.set(0.5);
        btnX.position.set(leftLimit,topLimit);
        this.container.addChild(btnX);

        // eventos
        btnX.interactive = true;
        btnX.buttonMode = true;
        btnX.on('tap', (event) => {                        
            this.container.visible = false;
            this.controlBtn.visible = true;
        });

        btnX.on('click', (event) => {        
            //console.log("Click: ",this.controlBtn);    
            this.container.visible = false;
            this.controlBtn.visible = true;
        }); 
    }

    protected addControlBtn()
    {        
        if(!this.useCloseBtn) return;
        
        this.controlBtn = SpriteUtils.createSprite('controlBtn', -550, -180, { scale: 0.8, action: () => {
            this.container.visible = true;
            this.controlBtn.visible = false;
        }, centered: true});
        this.addChild(this.controlBtn);
    }

}