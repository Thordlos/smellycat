/**
 * Logger - 日志系统
 * 内存日志 + 定期导出文件
 */
class Logger {
    constructor(maxEntries = 500) {
        this.logs = [];
        this.maxEntries = maxEntries;
        this.autoSaveInterval = null;
    }

    log(msg) {
        const entry = `[${new Date().toLocaleTimeString()}] ${msg}`;
        this.logs.push(entry);
        if (this.logs.length > this.maxEntries) {
            this.logs.shift();
        }
        console.log(msg);
    }

    error(msg) {
        const entry = `[${new Date().toLocaleTimeString()}] ❌ ${msg}`;
        this.logs.push(entry);
        console.error(msg);
    }

    warn(msg) {
        const entry = `[${new Date().toLocaleTimeString()}] ⚠️ ${msg}`;
        this.logs.push(entry);
        console.warn(msg);
    }

    getLogs() {
        return this.logs.join('\n');
    }

    // 导出日志为文件下载
    saveToFile() {
        const blob = new Blob([this.getLogs()], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smellycat-${new Date().toISOString().slice(0, 10)}.log`;
        a.click();
        URL.revokeObjectURL(url);
        this.log('日志已导出');
    }

    // 定时自动保存（秒）
    startAutoSave(intervalSec = 60) {
        this.autoSaveInterval = setInterval(() => this.saveToFile(), intervalSec * 1000);
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }
}
