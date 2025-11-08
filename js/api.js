// API 配置 - 自动检测环境
/**
 * 根据当前运行环境自动选择 API 地址
 * - 本地开发环境 (localhost): 使用本地后端
 * - 生产环境 (GitHub Pages 等): 使用 Azure 后端
 */
const getApiBaseUrl = () => {
    const hostname = window.location.hostname;
    
    // 本地开发环境
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:7071/api';
    }
    
    // 生产环境（GitHub Pages、Azure Static Web Apps 等）
    return 'https://multimedia-api-2025-cxexhzavbgaxhddm.francecentral-01.azurewebsites.net/api';
};

const API_CONFIG = {
    baseUrl: getApiBaseUrl(),
};

// 在控制台输出当前使用的 API 地址（便于调试）
console.log('🔗 API Base URL:', API_CONFIG.baseUrl);

// ========================================
// API 调用函数
// ========================================

/**
 * 上传媒体文件
 * @param {File} file - 文件对象
 * @param {Object} metadata - 元数据（userId, description, tags, visibility）
 * @param {Function} onProgress - 进度回调函数
 * @returns {Promise<Object>} 上传结果
 */
async function uploadMedia(file, metadata, onProgress) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', metadata.userId);
    formData.append('description', metadata.description || '');
    formData.append('tags', JSON.stringify(metadata.tags || []));
    formData.append('visibility', metadata.visibility || 'public');

    try {
        const xhr = new XMLHttpRequest();

        // 返回 Promise
        return new Promise((resolve, reject) => {
            // 进度监听
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && onProgress) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    onProgress(percentComplete);
                }
            });

            // 完成监听
            xhr.addEventListener('load', () => {
                if (xhr.status === 200 || xhr.status === 201) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error(`上传失败: ${xhr.statusText}`));
                }
            });

            // 错误监听
            xhr.addEventListener('error', () => {
                reject(new Error('网络错误'));
            });

            xhr.open('POST', `${API_CONFIG.baseUrl}/media/upload`);
            xhr.send(formData);
        });
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
}

/**
 * 获取媒体列表（分页）
 * @param {Number} page - 页码（从1开始）
 * @param {Number} limit - 每页数量
 * @param {String} mediaType - 媒体类型筛选（all, image, video, audio）
 * @returns {Promise<Object>} { data: [], total: 0, page: 1, limit: 20 }
 */
async function getMediaList(page = 1, limit = 20, mediaType = 'all') {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(mediaType !== 'all' && { media_type: mediaType })
        });

        const response = await fetch(`${API_CONFIG.baseUrl}/media?${queryParams}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Get media list error:', error);
        throw error;
    }
}

/**
 * 根据ID获取媒体详情
 * @param {String} mediaId - 媒体ID
 * @returns {Promise<Object>} 媒体详情
 */
async function getMediaById(mediaId) {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/media/${mediaId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Get media by ID error:', error);
        throw error;
    }
}

/**
 * 更新媒体信息
 * @param {String} mediaId - 媒体ID
 * @param {Object} updateData - 更新的数据（description, tags）
 * @returns {Promise<Object>} 更新结果
 */
async function updateMedia(mediaId, updateData) {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/media/${mediaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Update media error:', error);
        throw error;
    }
}

/**
 * 删除媒体
 * @param {String} mediaId - 媒体ID
 * @returns {Promise<Object>} 删除结果
 */
async function deleteMedia(mediaId) {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/media/${mediaId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Delete media error:', error);
        throw error;
    }
}

/**
 * 根据用户ID获取媒体列表
 * @param {String} userId - 用户ID
 * @returns {Promise<Array>} 媒体列表
 */
async function getMediaByUser(userId) {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/media/user/${userId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Get media by user error:', error);
        throw error;
    }
}
