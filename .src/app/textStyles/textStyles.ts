import * as PIXI from 'pixi.js';


export const fancyTextStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 120,
    fontWeight: 'bold',
    fill: ['#FD79A8'],
    // fill: ['#FD79A8', '#34AEFC', '#FC1051'],
    stroke: '#000000',
    strokeThickness: 4
});

export const simpleTextStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 18,
    fill: '#FFF1E9',
    stroke: '#000000',
    strokeThickness: 4
});


export const dialogueText = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 60,
    fontWeight: 'bold',
    fill: '#371740',
    wordWrap: true,
    wordWrapWidth: 900
});

/**
 * Game over screen
 * -------------------------------------------------------------
 */

export const gameOverMainTextStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 200,
    fill: [ "#fcaf10", "#fef7a0"],
    fillGradientStops: [ 0.4 ],
    stroke: "#fa5505",
    strokeThickness: 10,
    dropShadowColor: "#47576e",
    dropShadowBlur: 11,
    dropShadowAngle: 9,
    dropShadowDistance: 4,
    fontWeight: "bold",
    align: "center"
});

export const gameOverButtonTextStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 30,
    fill: "#FFFFFF",
    dropShadowColor: "#47576e",
    dropShadowBlur: 4,
    dropShadowAngle: 45,
    dropShadowDistance: 10
});

export const gameOverStatTextStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 70,
    fill: "#FFFFFF",
    dropShadowColor: "#47576e",
    dropShadowBlur: 4,
    dropShadowAngle: 45,
    dropShadowDistance: 10
});
//gameOverTittleStyle


/**
 * -------------------------------------------------------------
 */

/**
 * Level select game map
 * -------------------------------------------------------------
 */

export const levelSelectTextEnabledUIStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 50,
    fill: "yellow",
    stroke: "yellow",
    strokeThickness: 3,
    dropShadow: true,
    dropShadowColor: "#cf25fa",
    dropShadowBlur: 4,
    dropShadowAngle: 45,
    dropShadowDistance: 4,
});

export const levelSelectTextDisabledUIStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 35,
    fill: "white",
    stroke: "grey",
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#11111",
    dropShadowBlur: 5,
    dropShadowAngle: 45,
    dropShadowDistance: 5,
});

export const stageMapTitleStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 120,
    fill: "#ffdf40",
    stroke: "#775215",
    strokeThickness: 7,
    dropShadow: true,
    dropShadowColor: "#f9f5f8",
    dropShadowBlur: 0,
    dropShadowAngle: 290,
    dropShadowDistance: 7,
});

export const changeStageButton = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 30,
    fill: "#FFFFFF",
    stroke: "#000",
    strokeThickness: 1,
    align: 'center'
});

/**
 * -------------------------------------------------------------
 */

/**
 * Single Player Character select
 * -------------------------------------------------------------
 */

export const gameOverNameTextUIStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 120,
    fill: "yellow",
    stroke: "yellow",
    strokeThickness: 2,
    dropShadow: true,
    dropShadowColor: "#cf25fa",
    dropShadowBlur: 2,
    dropShadowAngle: 45,
    dropShadowDistance: 2,
});

export const storyCharacterSelectNameTextUIStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 120,
    fill: "#dd5c69",
    stroke: "white",
    fontWeight: "bold",
    strokeThickness: 15,
    miterLimit: 15
});
/**
 * -------------------------------------------------------------
 */


export const specialButtonLabelTextStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 24,
    fill: "#c5015b",
    fontWeight: "bold"
});

/**
 * Versus Mode Character select 
 * -------------------------------------------------------------
 */

export const versusCharacterSelectNameTextUIStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 120,
    fill: "#dd5c69",
    stroke: "white",
    fontWeight: "bold",
    strokeThickness: 15,
    miterLimit: 15
});

export const versusCharPlayerNumberTextStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 40,
    fill: "#d9015c",
    fontWeight: "bold"
});

export const versusCharPlayerNumber2TextStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 40,
    fill: "#2c2995",
    fontWeight: "bold"
});

/**
* -------------------------------------------------------------
*/

/**
 * Versus Mode Character select 
 * -------------------------------------------------------------
 */

export const tittleTutorialScreen = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 50,
    dropShadow: false,    
    fill: "white",   
    miterLimit: 15,
    strokeThickness: 1
});

export const contentTutorialScreen = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 30,
    dropShadow: false,    
    fill: "white",   
    miterLimit: 15,
    strokeThickness: 1,
    align: "center"
});

export const contentTutorialScreenMovileBig = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 30,
    dropShadow: false,    
    fill: "white",   
    miterLimit: 15,
    strokeThickness: 1,
    align: "left"
});

export const contentTutorialScreenMovileMedium = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 20,
    dropShadow: false,    
    fill: "white",   
    miterLimit: 15,
    strokeThickness: 1,
    align: "left"
});

/**
 * Game Mode Menu
 * -------------------------------------------------------------
 */

export const windowTitleTextStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 50,
    fill: "#371d76",
    fontWeight: "bold"
});


export const modeSelectTextUIStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 40,
    fill: "#371d76",
    fontWeight: "bold"
});

export const modeSelectTextUIStyleSelected = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 60,
    fill: "#c5015b",
    fontWeight: "bold",
    stroke: "white",
    strokeThickness: 8
});

/**
 * Game Gameplay
 * -------------------------------------------------------------
 */

export const characterNameUIStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 40,
    fill: "white",
    stroke: '#17107a',
    strokeThickness: 8,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 5,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 3,
    align: "center"
});

export const skillPromptTextStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 40,
    fill: "white",
    stroke: '#17107a',
    strokeThickness: 8,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 5,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 3,
    align: "center"
});

export const playerScoreUITextStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 60,
    fill: "white",
    stroke: '#f04ac1',
    strokeThickness: 1,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 2,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 3,
    align: "left"
});

export const enemyScoreUITextStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 60,
    fill: "white",
    stroke: '#8d49f2',
    strokeThickness: 1,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 2,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 3,
    align: "right"
});

export const timerUITextStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 100,
    fill: "white",
    stroke: '#8d49f2',
    strokeThickness: 1,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    align: "rigth",
});

/**
* -------------------------------------------------------------
*/

export const skillPopupTextStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 35,
    fill: "white",
    fontWeight: "bold"
});

export const pauseScreenButtonText = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 30,
    fill: "white",
    stroke: '#8d49f2',
    strokeThickness: 1,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 2,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 10,
    align: "right"
});

export const tutorialPromptPromptStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 30,
    fill: "white",
    fontWeight: "bold"
});

export const tutorialPromptOptionStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 40,
    fill: "white",
    fontWeight: "bold",
    stroke: 'black',
    strokeThickness: 1
});

export const tutorialPromptSelectedOptionStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 45,
    fill: "white",
    fontWeight: "bold",
    stroke: 'white',
    strokeThickness: 1
});

export const tutorialPromptDontAskStyle = new PIXI.TextStyle({
    fontFamily: "VAGRounded BT",
    fontSize: 20,
    fill: "white",
    fontWeight: "bold"
});