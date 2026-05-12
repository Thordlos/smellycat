/**
 * StateManager - 持久化状态管理器
 * 通过 Tauri invoke 命令读写配置文件
 */
class StateManager {
    constructor() {
        this.invoke = null;
        if (typeof window !== 'undefined' && window.__TAURI__) {
            this.invoke = window.__TAURI__.core ? window.__TAURI__.core.invoke : window.__TAURI__.invoke;
        }
    }

    async save(state) {
        if (!this.invoke) {
            console.warn('Tauri not available, state not saved');
            return false;
        }
        try {
            await this.invoke('save_config', { data: JSON.stringify(state) });
            return true;
        } catch (e) {
            console.error('Save state failed:', e);
            return false;
        }
    }

    async load() {
        if (!this.invoke) {
            console.warn('Tauri not available, using default state');
            return null;
        }
        try {
            const data = await this.invoke('load_config');
            return JSON.parse(data);
        } catch (e) {
            console.log('No saved state found');
            return null;
        }
    }
}
