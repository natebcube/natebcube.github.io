import * as PIXI from 'pixi.js';
import GameScene from './GameScene';
import { levelSelectTextEnabledUIStyle, stageMapTitleStyle, changeStageButton } from '../textStyles/textStyles';
import { gameCharacters, gameAdventureLevels } from '../enums/enums';
import Persistance from '../Persistance';
import Stages from '../Stages';
import SpriteUtils from '../utils/SpriteUtils';
import StoryController from '../controller/StoryController';
import Localization from '../controller/Localization';
import Characters from '../Characters';
import { TweenMax } from "gsap/TweenMax";
import MathUtils from '../utils/MathUtils';

/**
 * Display Main Menu screen
 */
export default class GameStageMapMenu extends GameScene {

    stageNameText: PIXI.Text;
    playerCharacter: gameCharacters;
	levelIconComponents: { icon: PIXI.Sprite, text: PIXI.Text, highScoreText: PIXI.Text, highScoreTitleText: PIXI.Text }[] = [];
	levelPathComponents: { icon: PIXI.Sprite, stage: number, level: number}[] = [];
    currentStage: number;
    showHighScores: boolean = false;
    bossIcon: PIXI.Sprite;
	playerIcon: PIXI.Sprite;
	gemIcon: PIXI.Sprite;
    levelIconSprites: PIXI.Sprite[] = [];
    previousStageButton: PIXI.Sprite;
    nextStageButton: PIXI.Sprite;
    previousStageButtonLabel: PIXI.Text;
	nextStageButtonLabel: PIXI.Text;

	autoContinue: boolean;
	autoLevelNext: any;
	bossTween;
    autoContAnimation: boolean;
    playerColorFilter: PIXI.filters.ColorMatrixFilter;

    constructor(game) {
        super(game, '', 'sceneStage1Background');

        this.game = game;
        
        this.baseScale = 1.5;
        this.setBackArrow("characterSelectMenu",{ gameMode: 'story' });
        this.setStageNameText();


		//this.createPaths(0.2);

        this.setLevelSelectIcon(Localization.loc('Level') + " 1", 1.2, gameAdventureLevels.level1);
        this.setLevelSelectIcon(Localization.loc('Level') + " 2", 1.2, gameAdventureLevels.level2);
        this.setLevelSelectIcon(Localization.loc('Level') + " 3", 1.2, gameAdventureLevels.level3);
        this.setLevelSelectIcon(Localization.loc('Level') + " 4", 1.2, gameAdventureLevels.level4);
        this.setLevelSelectIcon(Localization.loc('BOSS'), 1.6, gameAdventureLevels.level5);

        this.bossIcon = SpriteUtils.createSprite('steven_idle01', 500, 500, { xanchor: 'center', yanchor: 'bottom', scale: 0.7});
		this.addChild(this.bossIcon);
		this.playerIcon = SpriteUtils.createSprite('steven_idle01', 500, 500, { xanchor: 'center', yanchor: 'bottom', scale: 0.7 });
		this.addChild(this.playerIcon);
		this.gemIcon = SpriteUtils.createSprite('gemR', 500, 500, { xanchor: 'center', yanchor: 'center', scale: 0.7 });
		this.gemIcon.scale.set(0);
		this.addChild(this.gemIcon);

		this.playerColorFilter = new PIXI.filters.ColorMatrixFilter();
		// 	this.playerIcon.filters = [this.playerColorFilter];
		this.gemIcon.filters = [this.playerColorFilter];

        this.previousStageButton = SpriteUtils.createSprite('changeStageButton', 300, 300, { centered: true, action: () => this.previousStage()});
        this.previousStageButtonLabel = SpriteUtils.createText(Localization.loc('PREVIOUS_STAGE'), 420, 300, changeStageButton, { centered: true });
        this.previousStageButton.scale.x = - 1;
        this.addChild(this.previousStageButton);
        this.addChild(this.previousStageButtonLabel);


        this.nextStageButton = SpriteUtils.createSprite('changeStageButton', 700, 300, { centered: true, action: () => this.nextStage()});
        this.nextStageButtonLabel = SpriteUtils.createText(Localization.loc('NEXT_STAGE'), 580, 300, changeStageButton, { centered: true });
        this.addChild(this.nextStageButton);
        this.addChild(this.nextStageButtonLabel);       

		this.bossTween = TweenMax.to(this.bossIcon.scale, 1, { y: this.bossIcon.scale.y * 1.025, repeat: -1, yoyo: true });
		TweenMax.to(this.playerIcon.scale, 1, { y: this.playerIcon.scale.y * 1.025, repeat: -1, yoyo: true });
    }    

    private previousStage() {
        this.loadStage(this.currentStage - 1);
    }

    private nextStage() {
        this.loadStage(this.currentStage + 1);
    }

    enter(opts) { 
		
        if (opts.stageBeat) {
			this.currentStage = Persistance.getStoryProgress().stage;
		}
		
		this.backArrow.visible = true;
		this.autoContAnimation = false;
		this.autoContinue = false;		

		if (opts.Next) {
			
			this.autoContinue = opts.Next;

			SpriteUtils.swapTexture(this.playerIcon, Characters.getWinnerPoseKey(this.playerCharacter));
			setTimeout(() => this.startAutoAnimation(), 500);

			this.autoLevelNext = opts.Level;
			setTimeout(() => StoryController.startStoryGame(this.playerCharacter, opts.Stage, opts.Level+1), 3600);
		}

        this.playerCharacter = opts.Character;

		this.loadStage(opts.Stage || this.currentStage);

		if (!this.game.soundManager.isPlaying('characterSelect'))
			this.game.soundManager.playBGXSound('characterSelect');

		if (opts.Next)
		{
			this.backArrow.visible = !opts.Next;
			this.previousStageButton.visible = !opts.Next;
			this.previousStageButtonLabel.visible = !opts.Next;
			this.nextStageButton.visible = !opts.Next;
			this.nextStageButtonLabel.visible = !opts.Next;
		}		
    }

    loadStage(stage: number) {
        const stageInfo = Stages[stage - 1];
		this.previousStageButton.visible = stage > 1 && !this.autoContinue;
		this.previousStageButtonLabel.visible = this.previousStageButton.visible;
        
        this.updateBackground(SpriteUtils.getTexture(stageInfo.background));
        this.stageNameText.text = Localization.loc('Stage') + ' ' + stage;
        const storyProgress = Persistance.getStoryProgress();
        const maxStage = storyProgress.stage;
        const maxLevel = stage == maxStage ? storyProgress.level : stage < maxStage ? 5 : 0;

		if (!this.autoContinue)
			SpriteUtils.swapTexture(this.playerIcon, Characters.getCombatPosePreffix(this.playerCharacter)+1);

		this.nextStageButton.visible = stage < Stages.length && maxLevel == stageInfo.levels.length && !this.autoContinue;
		this.nextStageButtonLabel.visible = this.nextStageButton.visible;

		var hasCurrent = false;
		/* TODO
		this.levelPathComponents.forEach((group: { icon: PIXI.Sprite, stage: number, level: number }, i: number) => {
			const { icon, stage, level } = group;

			if (this.currentStage != stage+1)
				icon.visible = false;
			else icon.visible = true;

		});*/

		//if (this.levelPathComponents[5].stage+1 == this.currentStage)
		//	this.levelPathComponents[5].icon.visible = true;

        this.levelIconComponents.forEach((group: { icon: PIXI.Sprite, text: PIXI.Text, highScoreText: PIXI.Text, highScoreTitleText: PIXI.Text }, i: number) => {
            const { icon, text, highScoreText, highScoreTitleText } = group;

            const nodeInfo = stageInfo.levels[i];
            icon.x = nodeInfo.x;
            icon.y = nodeInfo.y;
            const isBoss = i == stageInfo.levels.length - 1;
			const offsetY = isBoss ? stageInfo.bossLevelSelectionOffset : stageInfo.levelSelectionOffset;

			const isCurrent = i == maxLevel - 1;
			const isAutoPrev = i == this.autoLevelNext-1;

            text.x = nodeInfo.x;
            text.y = nodeInfo.y + offsetY;
            SpriteUtils.realignText(text, { centered: true });
            // TODO: Place these more smartly, if we decide to display them
            highScoreTitleText.x = nodeInfo.x;
            highScoreTitleText.y = nodeInfo.y + offsetY + 350;
            highScoreText.x = nodeInfo.x;
			highScoreText.y = nodeInfo.y + offsetY + 470;

			if (isBoss) {
				var isIngame = (i < maxLevel - 1 || maxStage > stage) && !this.autoContinue ? false : true;
				var preffix = isIngame ? Characters.getCombatPosePreffix(stageInfo.boss)+1 : Characters.getLoserPoseKey(stageInfo.boss);
                SpriteUtils.swapTexture(this.bossIcon, preffix);				

				//SpriteUtils.swapTexture(this.bossIcon, isIngame + stageInfo.bossKey);
                SpriteUtils.swapTexture(this.levelIconSprites[i], stageInfo.bossLevelSelectionIcon);
                this.bossIcon.x = nodeInfo.x;
				this.bossIcon.y = nodeInfo.y;
				this.bossIcon.scale.x = Math.abs(this.bossIcon.scale.x);
				this.bossIcon.alpha = 0.5;
				this.bossTween.pause();
            } else {
                SpriteUtils.swapTexture(this.levelIconSprites[i], stageInfo.levelSelectionIcon);
            }


			if (isAutoPrev && this.autoContinue) {
				this.playerIcon.x = nodeInfo.x;
				this.playerIcon.y = nodeInfo.y;
				hasCurrent = true;
			}
			if ((isCurrent && maxStage == stage) || (this.autoContinue && this.autoLevelNext == stageInfo.levels.length-1)) {

				if (!this.autoContinue) {
					this.playerIcon.x = nodeInfo.x;
					this.playerIcon.y = nodeInfo.y;
					hasCurrent = true;
				}
			
				if (isBoss) {
					if (!this.autoContinue)
						this.playerIcon.x -= 100;
					this.bossIcon.x = nodeInfo.x + 100;
					this.bossIcon.scale.x *= -1;
				}
			}

            if (i + 1 <= maxLevel) {
                icon.interactive = true;
                icon.buttonMode = true;
                icon.tint = 0xFFFFFF;
                text.tint = 0xFFFFFF;
				this.bossIcon.alpha = 1.0;
				this.bossTween.resume();

            } else {
                icon.interactive = false;
                icon.buttonMode = false;
                icon.tint = 0x5e5e5e;
				text.tint = 0x5e5e5e;
            }
            if (this.showHighScores) {
                const highScore = Persistance.getHighScore(stage, i + 1);
                if (highScore) {
                    highScoreText.visible = true;
                    highScoreTitleText.visible = true;
                    highScoreText.text = highScore;
                } else {
                    highScoreText.visible = false;
                    highScoreTitleText.visible = false;
                }
            } else {
                highScoreText.visible = false;
                highScoreTitleText.visible = false;
            }
        });
		this.currentStage = stage;

		if (!hasCurrent) {
			this.playerIcon.x = -110;
			this.playerIcon.y = stageInfo.levels[0].y;
		}
    }

    private setStageNameText() {
        this.stageNameText = new PIXI.Text('', stageMapTitleStyle);
        this.stageNameText.pivot.set(0.5);
        this.stageNameText.x = 280;
        this.stageNameText.y = 80;
        this.addChild(this.stageNameText);
    }

    private setLevelSelectIcon(name: string, scale: number, levelNumber: number) {
        let levelIconSprite = SpriteUtils.createSprite('stage1SelectionIcon', 0, 0, { action: () => { this.selectLevel(levelNumber); } });
        levelIconSprite.anchor.set(0.5);
        levelIconSprite.scale.set(scale);
        this.levelIconSprites.push(levelIconSprite);
        this.addChild(levelIconSprite);

        const levelText = new PIXI.Text(name, levelSelectTextEnabledUIStyle);
        levelText.pivot.set(0.5);
        this.addChild(levelText);

        const highScoreTitleText = new PIXI.Text('HIGHSCORE', levelSelectTextEnabledUIStyle); // TODO: Remove this component
        highScoreTitleText.pivot.set(0.5);
        this.addChild(highScoreTitleText);

        const highScoreText = new PIXI.Text('', levelSelectTextEnabledUIStyle);
        highScoreText.pivot.set(0.5);
        this.addChild(highScoreText);

        this.levelIconComponents.push({ icon: levelIconSprite, text: levelText, highScoreText, highScoreTitleText });
    }

	private createPath(stage: number, from: number, to: number, scale: number) {
		const stageInfo = Stages[stage];
		const fromNode = stageInfo.levels[from];
		const toNode = stageInfo.levels[to];
		const xDiff = fromNode.x - toNode.x;
		const yDiff = toNode.y - fromNode.y;
		const length = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
		const angle = Math.asin(yDiff / length);

		const spriteHeight = 134 * scale;
		const spriteCount: number = Math.floor(length / spriteHeight);


		for (var i = 0; i < spriteCount; i++)
		{
			let pathSprite = SpriteUtils.createSprite('testPath', fromNode.x + Math.cos(angle) * spriteHeight * i, fromNode.y + Math.sin(angle) * spriteHeight * i);
			pathSprite.anchor.set(0, 0.5);
			pathSprite.scale.set(scale);
			pathSprite.rotation = angle;
			this.addChild(pathSprite);
			this.levelPathComponents.push({ icon: pathSprite, stage: stage, level: from });
		}

	}

	private createPaths(scale: number) {
		for (var stg = 0; stg < Stages.length; stg++)
			for (var lvl = 0; lvl < Stages[stg].levels.length - 1; lvl++)
				this.createPath(stg, lvl, lvl + 1, scale);
	}

	selectLevel(level: number) {
		if (!this.autoContinue)
			StoryController.startStoryGame(this.playerCharacter, this.currentStage, level);
	}
	
	public lerp(a: number, b: number, amount: number) {

		var diff = Math.sign(b - a);

		a += diff*amount;

		if ((diff == -1 && a <= b) || (diff == 1 && a >= b))
			a = b;

		return a;
	}

	public startAutoAnimation() {

		setTimeout(() => this.autoContAnimation = true, 750);
		setTimeout(() => TweenMax.to(this.playerColorFilter.matrix, 0.125,
			[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]), 450);
		TweenMax.to(this.playerIcon.scale, 0.5, { x: 0, repeat: 0, yoyo: false });
		TweenMax.to(this.playerIcon.scale, 0.5, { y: 0, repeat: 0, yoyo: false });
		TweenMax.to(this.gemIcon.scale, 0.5, { x: 0.7, repeat: 0, yoyo: false });
		TweenMax.to(this.gemIcon.scale, 0.5, { y: 0.7, repeat: 0, yoyo: false });

		TweenMax.to(this.playerColorFilter.matrix, 2, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0]);

	}

	public endAutoAnimation() {

		SpriteUtils.swapTexture(this.playerIcon, Characters.getCombatPosePreffix(this.playerCharacter)+1);
		this.autoContAnimation = false;
		TweenMax.to(this.playerIcon.scale, 1, { x: 0.7, repeat: 0, yoyo: false });
		TweenMax.to(this.playerIcon.scale, 1, { y: 0.7, repeat: 0, yoyo: false });
		TweenMax.to(this.gemIcon.scale, 1, { x: 0, repeat: 0, yoyo: false });
		TweenMax.to(this.gemIcon.scale, 1, { y: 0, repeat: 0, yoyo: false });
		
		TweenMax.to(this.playerColorFilter.matrix, 0.125,
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0]);
		setTimeout(() =>
			TweenMax.to(this.playerColorFilter.matrix, 0.5, 
			[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]), 750);
	}

	public update(dt) {

		this.gemIcon.x = this.playerIcon.x;
		this.gemIcon.y = this.playerIcon.y - 50;

		if (this.autoContAnimation) {


			const stageInfo = Stages[this.currentStage - 1];
			const progress = Persistance.getStoryProgress();
			const isBoss = this.autoLevelNext == stageInfo.levels.length - 1;
			if (this.currentStage > progress.stage) return;

			const nodeFrom = stageInfo.levels[Math.max(0, this.autoLevelNext - 1)];
			const nodeTo = stageInfo.levels[this.autoLevelNext];

			const nodeFromX = this.autoLevelNext <= 0 ? -110 : nodeFrom.x;
			const nodeToX = isBoss ? nodeTo.x - 100 : nodeTo.x;
			const nodeFromY = nodeFrom.y;
			const nodeToY = nodeTo.y;

			const speed = 5;

			const xDiff = nodeToX - nodeFromX;
			const yDiff = nodeTo.y - nodeFrom.y;

			var facing = Math.sign(xDiff);
			if (facing == 0) facing = 1;

			this.playerIcon.scale.x = Math.abs(this.playerIcon.scale.x) * facing;
			this.playerIcon.x = this.lerp(this.playerIcon.x, nodeToX, Math.abs(xDiff / 50));
			this.playerIcon.y = this.lerp(this.playerIcon.y, nodeTo.y, Math.abs(yDiff / 50));

			if (this.autoContAnimation) {
				if (this.playerIcon.x == nodeToX && this.playerIcon.y == nodeTo.y) 
					this.endAutoAnimation();
					
			}
		}
	}

}