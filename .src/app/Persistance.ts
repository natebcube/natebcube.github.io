import Characters from "./Characters";
import { gameCharacters } from "./enums/enums";

export default {
    init() {
        const storedData = localStorage.getItem("suSave");
        if (!storedData) {
            this.model = this.getDefaultModel();
        } else {
            try {
                this.model = JSON.parse(storedData);
                this.healModel(this.model);
            } catch (e) {
                this.model = this.getDefaultModel();
            }
        }
    },

    getDefaultModel() {
        return {
            maxStage: 1,
            maxLevel: 1,
            hiScores: {},
            skipTutorial: false,
            charactersEnabled: {
                [gameCharacters.steven]: true,                
                [gameCharacters.amethyst]: true,  
                [gameCharacters.garnet]: true,                
                [gameCharacters.jasper]: false,
                [gameCharacters.pearl]: true,                
                [gameCharacters.peridot]: false,
                [gameCharacters.y_diamond]: false,
            }
        }
    },

    healModel(model: {}) {
        this.model = Object.assign(this.getDefaultModel(), model);
    },

    saveScore(stage: number, level: number, score: number) {
        const currentScore = this.model.hiScores['s' + stage + '-' + level];
        if (!currentScore || score > currentScore) {
            this.model.hiScores['s'+ stage + '-' + level] = score;
            this.persist();
        }
    },

    skipTutorial() {
        return this.model.skipTutorial;
    },

    saveSkipTutorial() {
        this.model.skipTutorial = true;
        this.persist();
    },

    getHighScore(stage: number, level: number) {
        return this.model.hiScores['s'+ stage + '-' + level] || 0;
    },

    beatLevel(stage: number, level: number) {
        if (stage == this.model.maxStage && level == this.model.maxLevel) {
            this.model.maxLevel++;
            if (this.model.maxLevel == 6) {
                if (this.model.maxStage == 3) {
                    // Do nothing, ending should be shown somewhere else
                } else {
                    this.model.maxStage++;
                    this.model.maxLevel = 1;
                }
            }
            this.persist();
        }
    },

    unlockBoss(enemy)
    {
        if(!this.model.charactersEnabled[enemy])
        {
            this.model.charactersEnabled[enemy] = true;
            this.persist();
            return true;
        }
        return false;        
    },

    isEnabledCharacter(character)
    {
        return this.model.charactersEnabled[character];
    },

    getStoryProgress() {
        return { level: this.model.maxLevel, stage: this.model.maxStage };
    },

    persist() {
        localStorage.setItem("suSave", JSON.stringify(this.model));
    }
}