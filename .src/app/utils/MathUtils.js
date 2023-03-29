export default class MathUtils {

    /**
     * 
     * @param {number} minValue :the minimum for the range to pick from
     * @param {number} maxValue :the maximum for the range to pick from
     */
    static getNumberInRandomRange(minValue, maxValue) {
        return Math.floor(Math.random() * (maxValue - minValue)) + minValue;
    }

    static flipCoin() {
        return MathUtils.getNumberInRandomRange(0, 2) === 0;
    }

    /**
     * 
     * @param {number} chance The chance of something happening (between 0 and 100)
     */
    static getChance(chance) {
        const maxValue = 100
        const minValue = 0
        return (Math.floor(Math.random() * (maxValue - minValue)) + minValue) <= chance;
    }

}