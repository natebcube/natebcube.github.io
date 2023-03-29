export default {
    setTexts(gameTexts: any) {
        this.gameTexts = gameTexts;
    },
    setLanguage(lang: string) {
        this.lang = lang;
    },
    loc(key: string) {
        const locInfo = this.gameTexts[key];
        if (!locInfo) {
            return '{{' + key + '}}';
        }
        const translation = locInfo[this.lang];
        if (!translation) {
            return '{' + key + '}';
        }
        return translation;
    }
}