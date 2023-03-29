import { gameCharacters } from "./enums/enums";

export default [
    {
        background: 'sceneStage1Background',
        levelSelectionIcon: 'stage1SelectionIcon',
        levelSelectionOffset: 100,
        bossLevelSelectionIcon: 'stage1SelectionIcon',
        bossLevelSelectionOffset: 120,
        boss: gameCharacters.peridot,
        levels: [
            { x: 348, y: 807 },
            { x: 573, y: 563 },
            { x: 1122, y: 716 },
            { x: 1209, y: 434 },
            { x: 1593, y: 396 }
        ]
    },
    {
        background: 'sceneStage2Background',
        levelSelectionIcon: 'stage2SelectionIcon',
        levelSelectionOffset: 90,
        bossLevelSelectionIcon: 'stage2SelectionIcon',
        bossLevelSelectionOffset: 120,
        boss: gameCharacters.jasper,
        levels: [
            { x: 335, y: 780 },
            { x: 717, y: 955 },
            { x: 824, y: 592 },
            { x: 1227, y: 753 },
            { x: 1512, y: 493} 
        ]
    },
    {
        background: 'sceneStage3Background',
        levelSelectionIcon: 'stage3SelectionIcon',
        levelSelectionOffset: 100,
        bossLevelSelectionIcon: 'stage3SelectionIcon',
        bossLevelSelectionOffset: 120,
        boss: gameCharacters.y_diamond,
        levels: [
            { x: 342, y: 698 },
            { x: 707, y: 866 },
            { x: 806, y: 513 },
            { x: 1211, y: 665 },
            { x: 1491, y: 414} 
        ]
    }
]