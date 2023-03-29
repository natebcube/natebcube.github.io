import { TweenMax } from "gsap/TweenMax";

export default class SpritePulseAnimation {
    sprites: PIXI.Sprite[];
    baseScales: number[];
    pulseScaleX: number;
    pulseScaleY: number;
    pulseTime: number;
    bounceTween: TweenMax;


    constructor (sprites: PIXI.Sprite[], baseScales: number[], pulseScaleX: number, pulseScaleY: number, pulseTime: number) {
        this.sprites = sprites;
        this.baseScales = baseScales;
        this.pulseScaleX = pulseScaleX;
        this.pulseScaleY = pulseScaleY;
        this.pulseTime = pulseTime;
    }

    activate() {
        const scale = {
            scaleX: 1,
            scaleY: 1
        }
        if (this.bounceTween) {
            this.bounceTween.kill();
        }
        this.bounceTween = TweenMax.to(scale, this.pulseTime, { onUpdate: () => {
            this.sprites.forEach((sprite, i) => {
                sprite.scale.set(scale.scaleX * this.baseScales[i], scale.scaleY * this.baseScales[i]);
            });
        }, scaleX: this.pulseScaleX, scaleY: this.pulseScaleY, repeat: -1, yoyo: true });
    }

    reset() {
        if (this.bounceTween) {
            this.bounceTween.kill();
            delete this.bounceTween;
            this.sprites.forEach((sprite, i) => {
                sprite.scale.set(this.baseScales[i]);
            });
        }
    }
}