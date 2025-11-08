// ========================================
// Upload Page Logic
// ========================================

let selectedFile = null;

// Execute on page load
document.addEventListener('DOMContentLoaded', () => {
    setupFileUpload();
    setupDragAndDrop();
});

// ========================================
// File Selection Setup
// ========================================
function setupFileUpload() {
    const fileInput = document.getElementById('fileInput');
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });
}

// ========================================
// Drag and Drop Upload Setup
// ========================================
function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });
}

// ========================================
// Handle File Selection
// ========================================
function handleFileSelect(file) {
    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
        alert('❌ File too large! Maximum supported: 100MB');
        return;
    }

    // Validate file type
    const validTypes = ['image/', 'video/', 'audio/'];
    const isValid = validTypes.some(type => file.type.startsWith(type));
    
    if (!isValid) {
        alert('❌ Unsupported file type! Please upload image, video, or audio files');
        return;
    }

    selectedFile = file;
    showFilePreview(file);
    showUploadForm();
}

// ========================================
// Show File Preview
// ========================================
function showFilePreview(file) {
    const previewArea = document.getElementById('previewArea');
    const previewContent = document.getElementById('previewContent');
    const uploadArea = document.getElementById('uploadArea');
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
        let preview = '';
        
        if (file.type.startsWith('image/')) {
            preview = `<img src="${e.target.result}" alt="Preview" style="max-width: 100%; border-radius: 8px;">`;
        } else if (file.type.startsWith('video/')) {
            preview = `<video src="${e.target.result}" controls style="max-width: 100%; border-radius: 8px;"></video>`;
        } else if (file.type.startsWith('audio/')) {
            preview = `
                <div style="padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white;">
                    <div style="font-size: 4rem; text-align: center;">🎵</div>
                    <audio src="${e.target.result}" controls style="width: 100%; margin-top: 1rem;"></audio>
                </div>
            `;
        }
        
        previewContent.innerHTML = preview;
        previewArea.style.display = 'block';
        uploadArea.style.display = 'none';
    };
    
    reader.readAsDataURL(file);
}

// ========================================
// Show Upload Form
// ========================================
function showUploadForm() {
    document.getElementById('uploadForm').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
}

// ========================================
// Clear File
// ========================================
function clearFile() {
    selectedFile = null;
    document.getElementById('fileInput').value = '';
    document.getElementById('previewArea').style.display = 'none';
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('uploadForm').style.display = 'none';
}

// ========================================
// Form Submit
// ========================================
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
        alert('Please select a file first');
        return;
    }

    // Get form data
    const userId = document.getElementById('userId').value.trim();
    const description = document.getElementById('description').value.trim();
    const tagsInput = document.getElementById('tags').value.trim();
    const visibility = document.getElementById('visibility').value;

    if (!userId) {
        alert('Please enter User ID');
        return;
    }

    // Process tags
    const tags = tagsInput 
        ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

    // Prepare metadata
    const metadata = {
        userId,
        description,
        tags,
        visibility
    };

    // Show upload progress
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const submitBtn = document.getElementById('submitBtn');

    uploadProgress.style.display = 'block';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading...';

    try {
        // Call upload API
        const result = await uploadMedia(selectedFile, metadata, (percent) => {
            // Update progress
            progressFill.style.width = `${percent}%`;
            progressText.textContent = `Uploading... ${Math.round(percent)}%`;
        });

        console.log('Upload success:', result);

        // Show success message
        document.getElementById('uploadForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';

    } catch (error) {
        alert('❌ Upload failed: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Upload';
    } finally {
        uploadProgress.style.display = 'none';
    }
});

// ========================================
// Reset Form
// ========================================
function resetForm() {
    clearFile();
    document.getElementById('uploadForm').reset();
    document.getElementById('successMessage').style.display = 'none';
}

