import { gameCharacters } from "../../enums/enums";
import SpriteUtils from "../../utils/SpriteUtils";
import Characters from "../../Characters";
import { TweenMax } from "gsap/TweenMax";
import { Elastic, Back, Linear } from "gsap/EasePack";
import Persistance from "../../Persistance";

export default class InGameCharacter {
    sprite: PIXI.AnimatedSprite;
    ongoingAnimation: boolean;
    character: gameCharacters;
    bounceTween: any;
    displacement: number;

    constructor(x: number, y: number, flipped: boolean = false ) {
        this.sprite = SpriteUtils.createAnimatedSprite('steven_idle01', x, y, { scale: 1.5, xanchor: 'center', yanchor: 'bottom', flip: flipped });
        this.bounceTween = TweenMax.to(this.sprite.scale, 1, { y: 1.45, repeat: -1, yoyo: true });
        this.displacement = flipped ? -100 : 100;
    }

    animateDamage() {
        if (this.ongoingAnimation) {
            return;
        }
        this.ongoingAnimation = true;
        this.doDamageAnimation(this.displacement * -1).then(() => this.ongoingAnimation = false);
    }

    animateAttack() {
        if (this.ongoingAnimation) {
            return;
        }
        this.ongoingAnimation = true;
        this.doAttackAnimation(this.displacement).then(() => this.ongoingAnimation = false);
        setTimeout(() => this.animateDamage(), 400);
    }


    private stopBouncing() {
        this.bounceTween.pause();
    }

    private resumeBouncing() {
        this.bounceTween.resume();
        this.playAnimation('idle');
    }

    private playAnimation(animationId: string) {
        let preffix:string, frames:number, speed:number, loop:boolean;
        let yoyo:boolean = false;
        switch (animationId) {
            case 'hit':
                preffix = Characters.getHitPosePreffix(this.character);
                frames = Characters[this.character].hitFrames;
                speed = 0.05;
                loop = true;
                break;
            case 'idle':
                preffix = Characters.getCombatPosePreffix(this.character);
                frames = Characters[this.character].idleFrames;
                speed = 0.05;
                loop = true;
                break;
            case 'attack':
                preffix = Characters.getAttackPosePreffix(this.character);
                frames = Characters[this.character].attackFrames;
                speed = 0.15;
                loop = false;
                yoyo = true;
                break;
        }
        SpriteUtils.setTextures(this.sprite, preffix, frames, yoyo);
        this.sprite.animationSpeed = speed;
        this.sprite.loop = loop;
    }

    private doDamageAnimation(bounce: number) {
        this.stopBouncing();
        this.playAnimation('hit');
        const originalPosition = this.sprite.x;
        TweenMax.to(this.sprite, 0.4, { x: originalPosition + bounce, ease: Elastic.easeOut.config(1, 0.1) });
        return new Promise(r => {
            setTimeout(() => {
                this.resumeBouncing();
                this.sprite.x = originalPosition;
                r();
            }, 500);
        });
    }

    private doAttackAnimation(thrust: number) {
        this.stopBouncing();
        this.playAnimation('attack');
        const originalPosition = this.sprite.x;
        TweenMax.to(this.sprite, 0.4, { x: originalPosition + thrust, ease: Back.easeIn.config(3) });
        return new Promise(r => {
            setTimeout(() => {
                this.resumeBouncing();
                this.sprite.x = originalPosition;
                r();
            }, 1000);
        });
    }

    reset() {
        this.resumeBouncing();
    }

    setCharacter(character:gameCharacters) {
        this.character = character;
        SpriteUtils.setTextures(this.sprite, Characters.getCombatPosePreffix(character), Characters[character].idleFrames || 2);
    }

    setGameOver(winner: boolean) {
        const pose = winner ? Characters.getWinnerPoseKey(this.character) : Characters.getLoserPoseKey(this.character);
        SpriteUtils.swapTexture(this.sprite, pose);
        this.stopBouncing();
    }

    unlockInArcade():boolean
    {
        return Persistance.unlockBoss(this.character);
    }
}