export default class TimerUtils {

    private isTimerPaused = false;
    private counter = 0;
    private intervalId;

    public pauseTimer = () => { this.isTimerPaused = true };
    public unpauseTimer = () => { this.isTimerPaused = false };
    public getTimer = () => { return this.counter };
    public stopTimer = () => { clearInterval(this.intervalId) };

    constructor(counter) {
        this.counter = counter;
        this.intervalId = setInterval(() => {
            if (!this.isTimerPaused) {
                this.counter = this.counter - 1;
                if (this.counter <= 0) clearInterval(this.intervalId)
            }
        }, 1000);

    }


}