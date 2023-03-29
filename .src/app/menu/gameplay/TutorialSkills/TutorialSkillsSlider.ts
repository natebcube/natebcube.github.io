import * as PIXI from 'pixi.js';
import { skillPopupTextStyle } from '../../../textStyles/textStyles';
import Localization from '../../../controller/Localization';
import { TweenMax } from "gsap/TweenMax";
import { Linear } from "gsap/EasePack";
import Characters from '../../../Characters';
import SpriteUtils from '../../../utils/SpriteUtils';

/**
 * Tutorial para los skills de cada personaje
 */
export default class TutorialSkill extends PIXI.Container
{
    private game:any;
    private tutorialContainer: PIXI.Sprite;
    private tittleTxt: PIXI.Text;
    private descriptionTxt: PIXI.Text;
    private baseScale:number = 1.5;
    private posInitXTxt:number;
    private posFinalXTxt:number;
    private maskWidth:number;
    private tweenMaxTxt:TweenMax;
    private tweenMaxImgs:TweenMax;
    private imgSkill_1: PIXI.Sprite;
    private imgSkill_2: PIXI.Sprite;
    private containerImgSkills: PIXI.Container;
    private timer: any = null;
    private containerImgPosInit: number;
    private speed:number = 70;

    constructor(game:any, posX: number, posY:number)
    {
        super();
        this.game = game;

        this.scale.set(0.7);

        //container principal
        this.tutorialContainer = SpriteUtils.createSprite('tutorialSkill', 0, 0);
        this.tutorialContainer.anchor.set(0.5);
        this.tutorialContainer.position.set(posX, posY);
        
        this.tutorialContainer.scale.set(this.baseScale);
        this.addChild(this.tutorialContainer);

        //texto del titulo
        this.tittleTxt = new PIXI.Text("PINK RUSH", skillPopupTextStyle);
        this.tittleTxt.anchor.set(0.5,0);
        this.tittleTxt.position.set(0,-200);
        this.addChild(this.tittleTxt);
        this.tutorialContainer.addChild(this.tittleTxt);

        //background del texto descriptivo
        var descriptionBg = SpriteUtils.createSprite('descriptionBg', 0, 0);
        descriptionBg.anchor.set(0.5);
        descriptionBg.position.set(0,175);        
        this.tutorialContainer.addChild(descriptionBg);
        
        //mascara
        var mask = new PIXI.Graphics();        
        mask.beginFill(0x000000);
        mask.drawRect(0, 0, descriptionBg.width-30, descriptionBg.height);
        mask.endFill();
        mask.pivot.set(0.5);    
        this.maskWidth = mask.width;    
        this.tutorialContainer.addChild(mask);       
        
        //texto descriptivo
        this.descriptionTxt = new PIXI.Text("ESTA SERA LA DESCRIPCION DEL SKILL", skillPopupTextStyle);
        this.descriptionTxt.anchor.set(0,1);
        this.descriptionTxt.position.set(-180,195);
        this.tutorialContainer.addChild(this.descriptionTxt);
        this.posInitXTxt = this.descriptionTxt.x;        

        mask.position.set(this.descriptionTxt.x, this.descriptionTxt.y-40);
        this.descriptionTxt.mask = mask;
        
        this.visible = false;           
        
        //slider
        this.imgSkill_1 = SpriteUtils.createSprite('stevenSkill_1', 0, 0);
        this.imgSkill_2 = SpriteUtils.createSprite('stevenSkill_2', 0, 0);
        var posXImg2 = this.imgSkill_1.position.x + this.imgSkill_1.width + 30; 
        this.imgSkill_2.x = posXImg2;
        this.imgSkill_1.anchor.set(0.5);
        this.imgSkill_2.anchor.set(0.5);

        // container de las imagenes
        this.containerImgSkills = new PIXI.Container();
        this.containerImgSkills.addChild(this.imgSkill_1);
        this.containerImgSkills.addChild(this.imgSkill_2);
       

        //mascara imagenes de skills
        var maskImgs = new PIXI.Graphics();        
        maskImgs.beginFill(0x000000);
        maskImgs.drawRect(-this.imgSkill_1.width/2-15, -this.imgSkill_1.height/2-10, this.imgSkill_1.width+30, this.imgSkill_1.height+20);
        maskImgs.endFill();
        maskImgs.pivot.set(0.5);  

        this.tutorialContainer.addChild(maskImgs);   
        this.tutorialContainer.addChild(this.containerImgSkills); 

        this.containerImgSkills.mask = maskImgs; 
        this.containerImgPosInit = this.containerImgSkills.x;        
    }  
    
    show(visible: boolean)
    {
        this.visible = visible;
        if(visible){
            var distance = Math.abs(this.imgSkill_2.x -this.imgSkill_1.x);
            this.tweenMaxImgs = TweenMax.to(this.containerImgSkills, 1, 
                { x: this.containerImgSkills.x - distance, delay:2, ease:Linear.easeNone, onCompleteParams:[this], onComplete:this.completedTweenImgs }
            );
        
            this.initTextSlider();
           
        }else{
            //cancelar tween
            if(this.tweenMaxImgs!=null)
            {
                this.tweenMaxImgs.kill();
                this.tweenMaxImgs = null;
                this.containerImgSkills.x = this.containerImgPosInit;
            }

            if(this.tweenMaxTxt!=null)
            {
                this.tweenMaxTxt.kill();
                //this.tweenMaxTxt= null;
                this.descriptionTxt.x = this.posInitXTxt;
            }
            
            if(this.timer!=null)
            {
                //console.log("Cancelar timer");
                clearTimeout(this.timer);    
                this.timer = null;                
            }

            
        }
        
    }

    completedTweenImgs(param)
    {        
        param.timer = setTimeout(() => {
            //console.log("Completed: ",param);
            var distance = Math.abs(param.imgSkill_2.x -param.imgSkill_1.x);
            param.containerImgSkills.x += distance;        
            param.tweenMaxImgs = TweenMax.to(param.containerImgSkills, 1, 
                { x: param.containerImgSkills.x - distance,
                delay:2, ease:Linear.easeNone, onCompleteParams:[param], onComplete:param.completedTweenImgs });
            
        }, 1000);
        //console.log("completedTweenImgs ",param.timer);        
    }

    updateDescription(characterId)
    {     
        var charName = Characters[characterId].spriteKey;
        
        //actualizar titulo, imagen y descripcion                 
        this.descriptionTxt.text = Localization.loc(charName + 'ComboDescription');  
        this.tittleTxt.text = Localization.loc(charName + 'ComboTittle');
        this.imgSkill_1.texture = SpriteUtils.getTexture(Characters[characterId].imgSkill_1);
        this.imgSkill_2.texture = SpriteUtils.getTexture(Characters[characterId].imgSkill_2);

        this.initTextSlider();    
    }    

    private initTextSlider()
    {
        if(this.tweenMaxTxt!=null)
        {
            this.tweenMaxTxt.kill();
        }

        this.descriptionTxt.x = this.posInitXTxt;  
        this.posFinalXTxt = this.posInitXTxt + this.maskWidth - this.descriptionTxt.width; 
        var time = Math.abs(this.posFinalXTxt-this.posInitXTxt) / this.speed;
        this.tweenMaxTxt = TweenMax.to(this.descriptionTxt, time, { x: this.posFinalXTxt, repeat:-1,repeatDelay:1, yoyo:true, delay:1, ease:Linear.easeNone });        
    }
}