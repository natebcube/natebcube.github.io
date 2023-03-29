import { gameModes, gameCharacters, gameAdventureStages, gameAdventureLevels } from '../enums/enums';
import { lvl1PeridotVictoryParams, lvl2PeridotVictoryParams, lvl3PeridotVictoryParams, lvl4PeridotVictoryParams, lvl5PeridotVictoryParams, lvl1JasperVictoryParams, lvl5JasperVictoryParams, lvl2JasperVictoryParams, lvl3JasperVictoryParams, lvl4JasperVictoryParams, lvl1Y_DiamondVictoryParams, lvl2Y_DiamondVictoryParams, lvl3Y_DiamondVictoryParams, lvl4Y_DiamondVictoryParams, lvl5Y_DiamondVictoryParams } from "../menu/gameplay/levelVictoryConditionParams";
import Persistance from '../Persistance';
import CutsceneScripts from '../CutsceneScripts';
import Characters from '../Characters';

export default {
    setGame(game) {
        this.game = game;
    },
    startStoryGame(character: gameCharacters, stage: number, level: number) {
        if (level == 5) {
            const opponent = this.getBoss(stage);
            this.game.setState("dialogue", {
                character,
                opponent,
                dialogue: this.getIntroDialogue(character, opponent),
                stageNumber: stage,
                defeated: false,
                cb: () => {
                    this.__doStartStoryGame(character, stage, level);
                }
            });
        } else {
            this.__doStartStoryGame(character, stage, level);
        }
    },
    __doStartStoryGame(character: gameCharacters, stage: number, level: number) {
        const vConditions = this.getVictoryConditionForLevel(level, stage);
        this.game.setState("gamePlay",
            {
                restart: false,
                newGame: true,
                gameMode: gameModes.adventure,
                p1Character: character,
                p2Character: this.getGameplayCharacter(level, stage),
                level: level,
                stage: stage,
                victoryCondition: vConditions.condition,
                victoryTimer: vConditions.timer,
                chainsToMake: vConditions.chainsToMake,
                trashToSurviveCounter: vConditions.trashToSurvive,
                board1State: vConditions.board1State,
                board2State: vConditions.board2State,
            }
        );
    },
    levelCompleted(stage: number, level: number) {
        Persistance.beatLevel(stage, level);
    },
    showStageEnding(playerCharacter: gameCharacters, boss: gameCharacters, stageNumber: number) {
        this.game.setState("dialogue", {
            character: playerCharacter,
            opponent: boss,
            stageNumber,
            defeated: true,
            dialogue: this.getDefeatDialogue(playerCharacter, boss),
            cb: () => {
                if (stageNumber == 3) {
                    this.game.setState("modeSelectMenu", {});
				} else {

					this.game.setState("stageMapMenu", { stageBeat: true, Stage: stageNumber+1, Character: playerCharacter, Next: true, Level: 0 });
                    //this.startStoryGame(playerCharacter, stageNumber + 1, 1);
                }
            }
        });
            
    },
    getVictoryConditionForLevel(level: number, currentStage: number) {
        switch (currentStage) {
            case gameAdventureStages.stage1:
                switch (level) {
                    case gameAdventureLevels.level1:
                        var r = lvl1PeridotVictoryParams;
                        return r;
                    case gameAdventureLevels.level2:
                        return lvl2PeridotVictoryParams;
                    case gameAdventureLevels.level3:
                        return lvl3PeridotVictoryParams;
                    case gameAdventureLevels.level4:
                        return lvl4PeridotVictoryParams;
                    case gameAdventureLevels.level5:
                        return lvl5PeridotVictoryParams;
                }
                break;
            case gameAdventureStages.stage2:
                switch (level) {
                    case gameAdventureLevels.level1:
                        return lvl1JasperVictoryParams;
                    case gameAdventureLevels.level2:
                        return lvl2JasperVictoryParams;
                    case gameAdventureLevels.level3:
                        return lvl3JasperVictoryParams;
                    case gameAdventureLevels.level4:
                        return lvl4JasperVictoryParams;
                    case gameAdventureLevels.level5:
                        return lvl5JasperVictoryParams;
                }
                break;
            case gameAdventureStages.stage3:
                switch (level) {
                    case gameAdventureLevels.level1:
                        return lvl1Y_DiamondVictoryParams;
                    case gameAdventureLevels.level2:
                        return lvl2Y_DiamondVictoryParams;
                    case gameAdventureLevels.level3:
                        return lvl3Y_DiamondVictoryParams;
                    case gameAdventureLevels.level4:
                        return lvl4Y_DiamondVictoryParams;
                    case gameAdventureLevels.level5:
                        return lvl5Y_DiamondVictoryParams;
                }
                break;
        }
    },

    getGameplayCharacter(level, stage): gameCharacters {
        let character;
        switch (stage) {
            case gameAdventureStages.stage1:
                if (level < 5) {
                    character = gameCharacters.p_minion;
                } else {
                    character = gameCharacters.peridot;
                }
                break;
            case gameAdventureStages.stage2:
                if (level < 5) {
                    character = gameCharacters.j_minion;
                } else {
                    character = gameCharacters.jasper;
                }
                break;
            case gameAdventureStages.stage3:
                if (level < 5) {
                    character = gameCharacters.y_minion;
                } else {
                    character = gameCharacters.y_diamond
                }
                break;
            default:
                break;
        }
        return character;
    },

    getBoss(stage:gameAdventureStages): gameCharacters {
        switch (stage) {
            case gameAdventureStages.stage1:
                return gameCharacters.peridot;
            case gameAdventureStages.stage2:
                return gameCharacters.jasper;
            case gameAdventureStages.stage3:
                return gameCharacters.y_diamond;
            default:
                return undefined;
        }
    },

    getIntroDialogue(player:gameCharacters, opponent: gameCharacters) {
        return this.__getDialogue(player, opponent, 'before');
    },

    getDefeatDialogue(player:gameCharacters, opponent: gameCharacters) {
        return this.__getDialogue(player, opponent, 'after');
    },

    __getDialogue(player:gameCharacters, opponent: gameCharacters, type: string) {
        const dialogue = CutsceneScripts[player][opponent][type];
        dialogue.preffix = 'dialogue_' + Characters.getDataKey(player) + '_' + Characters.getDataKey(opponent) + '_' + type + '_';
        return dialogue;
    }
}