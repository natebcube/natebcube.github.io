
export const game = {
    // board dimensions
    cols: 10,
    rows: 20,
    hiddenRows: 2,
    // number of frames between block falls one row
    fallSpeed: 30,
    fallSpeedMin: 3,
    fallSpeedupStep: 2,
    fallSpeedupDelay: 1800,
    // block will fall this time faster when drop key pressed
    dropModifier: 10
}

export const controls = {
    // controls key repeat speed
    repeatDelay: 2,
    initialRepeatDelay: 10
}

export const viewport = {
    width: 1920,
    height: 1080,
    gemScale: 0.47
}

export default {game, controls, viewport};
