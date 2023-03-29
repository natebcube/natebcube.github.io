import { controls as controlsConfig } from '../config';

// handled keys
const KEY_MAP = {
    27: 'escape',
    32: 'space',
    74: 'J', // P2 Move
    73: 'I', // P2 Move
    76: 'L', // P2 Move
    75: 'K', // P2 Move
    79: "O", // P2 Drop

    65: 'A', // P1 Move
    87: 'W', // P1 Move
    68: 'D', // P1 Move
    83: 'S', // P1 Move
    69: 'E', // P1 Drop

    // Debug mode keys below
    
    82: 'R', // P1 Prevent failling
    
    80: "P", // P2 Special Skill (Buggy)
    77: 'M', // P1 Special skill (Buggy)
    86: 'V', // Activate insta-win
    
};

/**
 * Represents key control and handle custom repeat delay
 */
class Key {
    constructor(code) {
        this.code = code;
        this.name = KEY_MAP[code];
        this.pressed = false;
        
        this.repeatsCount = 0;
        this.repeatTimer = 0;
    }
    
    /**
     * Update repeat counters and check if action should be triggered
     * @returns {boolean} true if action should be triggered
     */
    trigger() {
        if (this.pressed) {
            --this.repeatTimer;
            if (this.repeatTimer <= 0) {
                this.repeatTimer = (this.repeatsCount > 0)
                    ? controlsConfig.repeatDelay
                    : controlsConfig.initialRepeatDelay;
                ++this.repeatsCount;
                return true;
            }
        }
        return false;
    }
    
    onPress() {        
        this.pressed = true;
    }
    
    onRelease() {
        this.pressed = false;
        this.repeatTimer = 0;
        this.repeatsCount = 0;
    }
}


/**
 * Handles keyboard controls for known keys
 * 
 * This class could be more generic, but its not needed for this game.
 */
export default class Keyboard {
    constructor() {
        this.keys = {};
        
        Object.keys(KEY_MAP).forEach(k => {
            let key = new Key(k);
            this.keys[k] = key;
            this[key.name] = key;
        });
        
        window.addEventListener('keydown', (evt) => {
            let key = this.keys[evt.keyCode];
            if (key) {                
                key.onPress();
            }
        });
        window.addEventListener('keyup', (evt) => {
            let key = this.keys[evt.keyCode];
            if (key) {
                key.onRelease();
            }
        });
    }
}
