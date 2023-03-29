import { gameCharacters } from './enums/enums';

export default {
    getWinnerPoseKey(character: gameCharacters) {
        return 'winner' + this[character].spriteKey
    },
    getLoserPoseKey(character: gameCharacters) {
        return 'loser' + this[character].spriteKey
    },
    getCombatPosePreffix(character: gameCharacters) {
        return this[character].inGameSpriteKey + '_idle0';
    },
    getAttackPosePreffix(character: gameCharacters) {
        return this[character].inGameSpriteKey + '_attack0';
    },
    getHitPosePreffix(character: gameCharacters) {
        return this[character].inGameSpriteKey + '_hit0';
    },
    getArcadeSelectionIconKey(character: gameCharacters) {
        return this[character].selectionIcon;
    },
    getPortraitKey(character: gameCharacters) {
        return this[character].inGameSpriteKey + '_portrait';
    },
    getDataKey(character: gameCharacters) {
        return this[character].inGameSpriteKey;
    },
    [gameCharacters.steven]: {
        inGameSpriteKey: 'steven',
        spriteKey: 'Steven',
        selectionPreviewImage: 'stevenSelectionPreview',
        selectionIcon: 'stevenSelectionIcon',
        comboSprite: 'stevenCombo',
        imgSkill_1: 'stevenSkill_1',
        imgSkill_2:'stevenSkill_2',
        idleFrames: 3,
        hitFrames: 3,
        attackFrames: 5
    },
    [gameCharacters.amethyst]: {
        inGameSpriteKey: 'amethyst',
        spriteKey: 'Amethyst',
        selectionPreviewImage: 'amethystSelectionPreview',
        selectionIcon: 'amethystSelectionIcon',
        comboSprite: 'amethystCombo',
        imgSkill_1: 'amethystSkill_1',
        imgSkill_2:'amethystSkill_2',
        idleFrames: 2,
        hitFrames: 2,
        attackFrames: 5
    },
    [gameCharacters.garnet]: {
        inGameSpriteKey: 'garnet',
        spriteKey: 'Garnet',
        selectionPreviewImage: 'garnetSelectionPreview',
        selectionIcon: 'garnetSelectionIcon',
        comboSprite: 'garnetCombo',
        imgSkill_1: 'garnetSkill_1',
        imgSkill_2:'garnetSkill_2',
        idleFrames: 2,
        hitFrames: 2,
        attackFrames: 5
    },
    [gameCharacters.jasper]: {
        inGameSpriteKey: 'jasper',
        spriteKey: 'Jasper',
        selectionPreviewImage: 'jasperSelectionPreview',
        selectionIcon: 'jasperSelectionIcon',
        comboSprite: 'jasperCombo',
        imgSkill_1: 'jasperSkill_1',
        imgSkill_2:'jasperSkill_2',
        idleFrames: 2,
        hitFrames: 2,
        attackFrames: 5
    },
    [gameCharacters.pearl]: {
        inGameSpriteKey: 'pearl',
        spriteKey: 'Pearl',
        selectionPreviewImage: 'pearlSelectionPreview',
        selectionIcon: 'pearlSelectionIcon',
        comboSprite: 'pearlCombo',
        imgSkill_1: 'pearlSkill_1',
        imgSkill_2:'pearlSkill_2',
        idleFrames: 2,
        hitFrames: 2,
        attackFrames: 5
    },
    [gameCharacters.peridot]: {
        inGameSpriteKey: 'peridot',
        spriteKey: 'Peridot',
        selectionPreviewImage: 'peridotSelectionPreview',
        selectionIcon: 'peridotSelectionIcon',
        comboSprite: 'peridotCombo',
        imgSkill_1: 'peridotSkill_1',
        imgSkill_2:'peridotSkill_2',
        idleFrames: 2,
        hitFrames: 2,
        attackFrames: 5
    },
    [gameCharacters.y_diamond]: {
        inGameSpriteKey: 'yd',
        spriteKey: 'YellowDiamond',
        selectionPreviewImage: 'yellowDiamondSelectionPreview',
        selectionIcon: 'yellowDiamondSelectionIcon',
        comboSprite: 'yellowDiamondCombo',
        imgSkill_1: 'yellowDiamondSkill_1',
        imgSkill_2:'yellowDiamondSkill_2',
        idleFrames: 2,
        hitFrames: 2,
        attackFrames: 5
    },
    [gameCharacters.p_minion]: {
        inGameSpriteKey: 'robonoids',
        spriteKey: 'Robonoids',
        selectionPreviewImage: 'yellowDiamondSelectionPreview',
        selectionIcon: 'yellowDiamondSelectionIcon',
        idleFrames: 1,
        hitFrames: 1,
        attackFrames: 1
    },
    [gameCharacters.j_minion]: {
        inGameSpriteKey: 'rubyDoc',
        spriteKey: 'RubyDoc',
        selectionPreviewImage: 'yellowDiamondSelectionPreview',
        selectionIcon: 'yellowDiamondSelectionIcon',
        idleFrames: 1,
        hitFrames: 1,
        attackFrames: 1
    },
    [gameCharacters.y_minion]: {
        inGameSpriteKey: 'topaz',
        spriteKey: 'Topaz',
        selectionPreviewImage: 'yellowDiamondSelectionPreview',
        selectionIcon: 'yellowDiamondSelectionIcon',
        idleFrames: 1,
        hitFrames: 1,
        attackFrames: 1
    }
}