// ========================================
// Homepage Main Application Logic
// ========================================

let currentPage = 1;
let currentMediaType = 'all';
const itemsPerPage = 12;

// ========================================
// Utility Functions
// ========================================

/**
 * HTML 转义函数，防止 XSS 并正确显示特殊字符
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Execute on page load
document.addEventListener('DOMContentLoaded', () => {
    loadMediaList();
    setupFilterButtons();
});

// ========================================
// Load Media List
// ========================================
async function loadMediaList() {
    const gridContainer = document.getElementById('mediaGrid');
    
    // Show loading animation
    gridContainer.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;

    try {
        const result = await getMediaList(currentPage, itemsPerPage, currentMediaType);
        
        if (result.data.length === 0) {
            gridContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <p>No media content available</p>
                    <button class="btn-primary" onclick="window.location.href='upload.html'">Upload First Media</button>
                </div>
            `;
            return;
        }

        // Render media cards
        gridContainer.innerHTML = result.data.map(media => createMediaCard(media)).join('');
        
        // Update pagination info
        updatePagination(result.page, result.total);
        
    } catch (error) {
        gridContainer.innerHTML = `
            <div class="error-message">
                <p>❌ Failed to load: ${error.message}</p>
                <button class="btn-primary" onclick="loadMediaList()">Retry</button>
            </div>
        `;
    }
}

// ========================================
// Create Media Card HTML
// ========================================
function createMediaCard(media) {
    let thumbnail = '';
    
    if (media.media_type === 'image') {
        thumbnail = `<img src="${escapeHtml(media.thumbnail_url || media.blob_url)}" alt="${escapeHtml(media.filename)}" loading="lazy">`;
    } else if (media.media_type === 'video') {
        thumbnail = `<div class="video-thumbnail">🎬</div>`;
    } else if (media.media_type === 'audio') {
        thumbnail = `<div class="audio-thumbnail">🎵</div>`;
    }

    const description = media.description 
        ? `<p class="media-description">${escapeHtml(media.description)}</p>`
        : '';

    // 使用 id 或 media_id（兼容处理）
    const mediaId = media.id || media.media_id;
    
    return `
        <div class="media-card" onclick="viewMediaDetail('${mediaId}')">
            <div class="media-thumbnail">
                ${thumbnail}
            </div>
            <div class="media-info">
                <h3>${escapeHtml(media.filename)}</h3>
                ${description}
                <div class="media-stats">
                    <span>👁️ ${media.views_count || 0}</span>
                    <span>❤️ ${media.likes_count || 0}</span>
                </div>
            </div>
        </div>
    `;
}

// ========================================
// View Media Detail
// ========================================
function viewMediaDetail(mediaId) {
    window.location.href = `detail.html?id=${mediaId}`;
}

// ========================================
// Pagination Function
// ========================================
function updatePagination(page, total) {
    const totalPages = Math.ceil(total / itemsPerPage);
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    pageInfo.textContent = `Page ${page} / ${totalPages} (${total} items)`;
    
    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= totalPages;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadMediaList();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function nextPage() {
    currentPage++;
    loadMediaList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// Filter Function
// ========================================
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update button state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update filter type
            currentMediaType = btn.getAttribute('data-type');
            currentPage = 1; // Reset to first page
            
            // Reload list
            loadMediaList();
        });
    });
}

// ========================================
// Search Function
// ========================================
function searchMedia() {
    const searchInput = document.getElementById('searchInput');
    const keyword = searchInput.value.trim();
    
    if (keyword) {
        alert(`Search feature will be implemented in future versions\nKeyword: ${keyword}`);
        // TODO: Implement search API call
    }
}

// Support Enter key for search
document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchMedia();
    }
});

