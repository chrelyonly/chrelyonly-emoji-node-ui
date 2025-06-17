// src/utils/cacheUtil.js


export const cacheUtil = {
    setCache(key, value) {
        const payload = {
            value,
            time: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(payload));
    },

    getCache(key) {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        try {
            return JSON.parse(raw)?.value;
        } catch (e) {
            console.warn("缓存解析失败", e);
            return null;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clearAll() {
        localStorage.clear();
    }
};
