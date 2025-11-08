// ========================================
// User Authentication Management (Simplified)
// ========================================

/**
 * 简化的用户身份管理
 * 使用 localStorage 存储用户信息
 * 适用于演示和原型验证
 */
class AuthManager {
    constructor() {
        this.USER_ID_KEY = 'cloudmedia_user_id';
        this.USER_NAME_KEY = 'cloudmedia_user_name';
        this.init();
    }

    /**
     * 初始化 - 确保用户有 ID
     */
    init() {
        if (!this.getUserId()) {
            this.createNewUser();
        }
    }

    /**
     * 创建新用户
     */
    createNewUser() {
        const userId = this.generateUserId();
        localStorage.setItem(this.USER_ID_KEY, userId);
        
        // 欢迎新用户
        this.promptUserName();
    }

    /**
     * 生成唯一用户 ID
     */
    generateUserId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `user_${timestamp}_${random}`;
    }

    /**
     * 提示用户输入昵称
     */
    promptUserName() {
        // 延迟提示，避免阻塞页面加载
        setTimeout(() => {
            const userName = prompt('👋 Welcome to CloudMedia!\n\nPlease enter your nickname (optional):');
            if (userName && userName.trim()) {
                this.setUserName(userName.trim());
            } else {
                this.setUserName('Anonymous User');
            }
        }, 500);
    }

    /**
     * 获取当前用户 ID
     */
    getUserId() {
        return localStorage.getItem(this.USER_ID_KEY);
    }

    /**
     * 获取用户昵称
     */
    getUserName() {
        return localStorage.getItem(this.USER_NAME_KEY) || 'Anonymous User';
    }

    /**
     * 设置用户昵称
     */
    setUserName(name) {
        localStorage.setItem(this.USER_NAME_KEY, name);
    }

    /**
     * 检查是否已有用户信息
     */
    isInitialized() {
        return !!this.getUserId();
    }

    /**
     * 更改用户昵称
     */
    changeUserName() {
        const currentName = this.getUserName();
        const newName = prompt(`Current nickname: ${currentName}\n\nEnter new nickname:`, currentName);
        if (newName && newName.trim() && newName !== currentName) {
            this.setUserName(newName.trim());
            alert('✅ Nickname updated successfully!');
            return true;
        }
        return false;
    }

    /**
     * 重置用户（创建新身份）
     */
    resetUser() {
        if (confirm('⚠️ Are you sure you want to reset your identity?\n\nThis will create a new user ID, but your uploaded media will remain on the server.')) {
            localStorage.removeItem(this.USER_ID_KEY);
            localStorage.removeItem(this.USER_NAME_KEY);
            this.createNewUser();
            alert('✅ New user identity created!');
            location.reload();
        }
    }

    /**
     * 显示用户信息
     */
    showUserInfo() {
        const userId = this.getUserId();
        const userName = this.getUserName();
        alert(`👤 User Information\n\nNickname: ${userName}\nUser ID: ${userId}\n\nYou can change your nickname in the profile menu.`);
    }

    /**
     * 获取用户信息对象
     */
    getUserInfo() {
        return {
            userId: this.getUserId(),
            userName: this.getUserName()
        };
    }
}

// 创建全局实例
const authManager = new AuthManager();

// 导出到全局作用域（兼容性）
window.authManager = authManager;

