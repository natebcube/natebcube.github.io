import { Howl, Howler } from 'howler';
import { gameSFX, gameBGX } from '../../assets/loader';



export default class SoundManager {

    private sfxLib = {};
	private bgxLib = {};
	private bgxVolumeValues = {};
	private currentBGX = null;
	private isPaused = false;

    constructor() {
        this.preloadSounds();
    }

    private preloadSounds() {

		this.sfxLib = {
			gemCollect: new Howl({
				src: [gameSFX.gemCollectSound],
				autoplay: false,
				loop: false,
				volume: 0.5,
			}),
			gemRotate: new Howl({
				src: [gameSFX.gemRotateSound],
				autoplay: false,
				loop: false,
				volume: 0.5,
			}),
			gemDrop: new Howl({
				src: [gameSFX.gemDropSound],
				autoplay: false,
				loop: false,
				volume: 0.5,
			}),
			bubbleTick: new Howl({
				src: [gameSFX.bubbleTickSound],
				autoplay: false,
				loop: false,
				volume: 0.5,
			}),
			activateSpecial: new Howl({
				src: [gameSFX.activateSpecialSound],
				autoplay: false,
				loop: false,
				volume: 0.5,
			}),
			gamePause: new Howl({
				src: [gameSFX.pauseSound],
				autoplay: false,
				loop: false,
				volume: 0.5,
			}),
			menuMove: new Howl({
				src: [gameSFX.menuMoveSound],
				autoplay: false,
				loop: false,
				volume: 0.5,
			}),
			menuSelect: new Howl({
				src: [gameSFX.menuSelectSound],
				autoplay: false,
				loop: false,
				volume: 0.5,
			}),
			arcadeNextLvl: new Howl({
				src: [gameSFX.nextLvlSound],
				autoplay: false,
				loop: false,
				volume: 0.8,
			}),
			powerupReady: new Howl({
				src: [gameSFX.powerupReady],
				autoplay: false,
				loop: true,
				volume: 0.8
			})
            // buttonClicked: new Howl({
            //     src: ['sound.webm', 'sound.mp3', 'sound.wav'],
            //     autoplay: true,
            //     loop: true,
            //     volume: 0.5,
            // }),
        };

		this.bgxVolumeValues = {
			characterSelect: 0.5,
			mainTheme: 0.45,
			vsPeridot: 0.45,
			vsJasper: 0.475,
			vsYellowDiamond: 0.48,
			victory: 0.5,
			defeat: 0.5,
		}

		this.bgxLib = {
			characterSelect: new Howl({
				src: [gameBGX.bgCharacterSelect],
				autoplay: false,
				loop: true,
				volume: this.bgxVolumeValues['characterSelect'],
			}),
			mainTheme: new Howl({
				src: [gameBGX.bgMainTheme],
				autoplay: false,
				loop: true,
				volume: this.bgxVolumeValues['mainTheme'],
			}),
			vsPeridot: new Howl({
				src: [gameBGX.bgVsPeridot],
				autoplay: false,
				loop: true,
				volume: this.bgxVolumeValues['vsPeridot'],
			}),
			vsJasper: new Howl({
				src: [gameBGX.bgVsJasper],
				autoplay: false,
				loop: true,
				volume: this.bgxVolumeValues['vsJasper'],
			}),
			vsYellowDiamond: new Howl({
				src: [gameBGX.bgVsYellowDiamond],
				autoplay: false,
				loop: true,
				volume: this.bgxVolumeValues['vsYellowDiamond'],
			}),
			victory: new Howl({
				src: [gameBGX.bgVictory],
				autoplay: false,
				loop: true,
				volume: this.bgxVolumeValues['victory'],
			}),
			defeat: new Howl({
				src: [gameBGX.bgDefeat],
				autoplay: false,
				loop: true,
				volume: this.bgxVolumeValues['defeat'],
			}),
        };

    }

    /**
     * Plays a one shot instance of a given sound
     */
	public playSFXSound(sound) {
		if (this.sfxLib[sound] != null)
			this.sfxLib[sound].play();
	}
	
	/**
     * Loops a given sound
     */
	public playSFXLoop(sound) {
		if (this.sfxLib[sound] != null && !this.sfxLib[sound].playing())
			this.sfxLib[sound].play();
	}
	
		
	/**
     * Stops a loop for a given sound
     */
	public stopSFXLoop(sound) {
		if (this.sfxLib[sound] != null)
			this.sfxLib[sound].stop();
    }

    /**
     *  Starts or switches to a given background track
     * */
    public playBGXSound(sound) {
        if (this.currentBGX !== null) {
			this.stopBGXSound();
        }
        this.currentBGX = [sound];
		this.bgxLib[sound].play();
		this.isPaused = false;
    }

    public stopBGXSound() {
		this.bgxLib[this.currentBGX].stop();
		this.bgxLib[this.currentBGX].volume(this.bgxVolumeValues[this.currentBGX]);
    }

    public fadeoutBGXSound() {
		this.bgxLib[this.currentBGX].fade(this.bgxVolumeValues[this.currentBGX], 0, 500);
    }

	public togglePause(isPaused:boolean) 
	{
		if(this.isPaused === isPaused) return;
		
		this.isPaused = isPaused;
		if (this.isPaused)
			this.bgxLib[this.currentBGX].pause();
		else
			this.bgxLib[this.currentBGX].play();
	}

	public isPlaying(sound)
	{
		return this.currentBGX == sound;
	}
}