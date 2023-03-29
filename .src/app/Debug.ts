const DEBUG_ACTIVE = false;

export default {
    log(...params: any) {
        if (DEBUG_ACTIVE) {
            console.log(...params);
        }
    }
}