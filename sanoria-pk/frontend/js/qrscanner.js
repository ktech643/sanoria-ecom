// ===== SANORIA.PK - QR Scanner Functionality =====

let qrScanner = null;
let scannerModal = null;

// Initialize QR Scanner
function initializeQRScanner() {
    // Create scanner modal HTML
    const scannerHTML = `
        <div class="modal fade" id="qrScannerModal" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Scan QR Code</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" onclick="stopQRScanner()"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div id="qr-reader" style="width: 100%; max-width: 500px; margin: 0 auto;"></div>
                        <div id="qr-reader-results" class="mt-3"></div>
                        <p class="text-muted mt-3">Position the QR code within the frame to scan</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="stopQRScanner()">Close</button>
                        <button type="button" class="btn btn-primary" onclick="switchCamera()">
                            <i class="fas fa-sync-alt"></i> Switch Camera
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body if not exists
    if (!document.getElementById('qrScannerModal')) {
        document.body.insertAdjacentHTML('beforeend', scannerHTML);
    }
    
    // Add QR scanner library
    if (!document.querySelector('script[src*="html5-qrcode"]')) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
        script.onload = () => {
            console.log('QR Scanner library loaded');
        };
        document.head.appendChild(script);
    }
}

// Start QR Scanner
function startQRScanner() {
    // Show modal
    scannerModal = new bootstrap.Modal(document.getElementById('qrScannerModal'));
    scannerModal.show();
    
    // Wait for library to load
    if (typeof Html5Qrcode === 'undefined') {
        setTimeout(startQRScanner, 500);
        return;
    }
    
    // Initialize scanner
    qrScanner = new Html5Qrcode('qr-reader');
    
    // Scanner configuration
    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    };
    
    // Start scanning
    qrScanner.start(
        { facingMode: "environment" }, // Use rear camera
        config,
        onQRCodeScanned,
        onQRScanError
    ).catch(err => {
        console.error('Failed to start scanner:', err);
        showScannerError('Unable to access camera. Please ensure camera permissions are granted.');
    });
}

// Stop QR Scanner
function stopQRScanner() {
    if (qrScanner) {
        qrScanner.stop().then(() => {
            qrScanner.clear();
            qrScanner = null;
        }).catch(err => {
            console.error('Failed to stop scanner:', err);
        });
    }
}

// Handle successful QR scan
async function onQRCodeScanned(decodedText, decodedResult) {
    console.log('QR Code scanned:', decodedText);
    
    // Stop scanning
    stopQRScanner();
    
    // Show loading
    showScannerLoading();
    
    try {
        // Send scanned data to backend
        const response = await fetch('/api/qrcode/scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('sanoriaToken') || ''}`
            },
            body: JSON.stringify({ qrData: decodedText })
        });
        
        const result = await response.json();
        
        if (result.success) {
            handleQRScanResult(result);
        } else {
            showScannerError(result.message || 'Invalid QR code');
        }
    } catch (error) {
        console.error('Error processing QR code:', error);
        showScannerError('Failed to process QR code. Please try again.');
    }
}

// Handle QR scan errors
function onQRScanError(errorMessage) {
    // Ignore continuous scan errors
    if (errorMessage.includes('No QR code found')) {
        return;
    }
    console.warn('QR scan error:', errorMessage);
}

// Handle QR scan result based on type
function handleQRScanResult(result) {
    // Hide modal
    if (scannerModal) {
        scannerModal.hide();
    }
    
    switch (result.type) {
        case 'product':
            // Redirect to product page
            window.location.href = `/products/${result.data.slug}`;
            break;
            
        case 'order':
            // Redirect to order tracking
            window.location.href = result.url;
            break;
            
        case 'promotion':
            // Apply promotion code
            applyScannedPromotion(result.data);
            break;
            
        case 'verification':
            // Handle verification
            window.location.href = result.url;
            break;
            
        default:
            showNotification('QR code scanned successfully', 'success');
    }
}

// Apply scanned promotion
async function applyScannedPromotion(promotionData) {
    // Check if user is logged in
    if (!localStorage.getItem('sanoriaToken')) {
        showNotification('Please login to apply promotions', 'warning');
        showLoginModal();
        return;
    }
    
    // Show promotion details
    const promotionModal = `
        <div class="modal fade" id="promotionModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Promotion Unlocked!</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <i class="fas fa-gift fa-4x text-primary mb-3"></i>
                        <h4>${promotionData.discountType === 'percentage' ? promotionData.discount + '%' : 'Rs. ' + promotionData.discount} OFF</h4>
                        <p>Promotion code: <strong>${promotionData.code}</strong></p>
                        <p class="text-muted">This promotion has been applied to your account</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <a href="/shop" class="btn btn-primary">Shop Now</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('promotionModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', promotionModal);
    const modal = new bootstrap.Modal(document.getElementById('promotionModal'));
    modal.show();
    
    // Store promotion in session
    sessionStorage.setItem('appliedPromotion', JSON.stringify(promotionData));
}

// Switch camera
function switchCamera() {
    if (qrScanner) {
        stopQRScanner();
        // Restart with front camera
        qrScanner = new Html5Qrcode('qr-reader');
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        };
        
        qrScanner.start(
            { facingMode: "user" }, // Use front camera
            config,
            onQRCodeScanned,
            onQRScanError
        ).catch(err => {
            // If front camera fails, try rear again
            qrScanner.start(
                { facingMode: "environment" },
                config,
                onQRCodeScanned,
                onQRScanError
            );
        });
    }
}

// Show scanner loading
function showScannerLoading() {
    const resultsDiv = document.getElementById('qr-reader-results');
    if (resultsDiv) {
        resultsDiv.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Processing...</span>
            </div>
            <p class="mt-2">Processing QR code...</p>
        `;
    }
}

// Show scanner error
function showScannerError(message) {
    const resultsDiv = document.getElementById('qr-reader-results');
    if (resultsDiv) {
        resultsDiv.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i> ${message}
            </div>
        `;
    }
}

// Generate QR code for sharing
async function generateShareQR(type, id) {
    try {
        const response = await fetch(`/api/qrcode/${type}/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('sanoriaToken') || ''}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            showQRCodeModal(result.data);
        } else {
            showNotification('Failed to generate QR code', 'error');
        }
    } catch (error) {
        console.error('Error generating QR code:', error);
        showNotification('Failed to generate QR code', 'error');
    }
}

// Show QR code in modal
function showQRCodeModal(data) {
    const modalHTML = `
        <div class="modal fade" id="qrCodeModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">QR Code</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img src="${data.qrCode}" alt="QR Code" class="img-fluid mb-3">
                        <p class="text-muted">Scan this code to share</p>
                        <button class="btn btn-primary" onclick="downloadQRCode('${data.qrCode}')">
                            <i class="fas fa-download"></i> Download QR Code
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('qrCodeModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('qrCodeModal'));
    modal.show();
}

// Download QR code
function downloadQRCode(dataUrl) {
    const link = document.createElement('a');
    link.download = 'sanoria-qr-code.png';
    link.href = dataUrl;
    link.click();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeQRScanner();
    
    // Add click handler to QR scan button
    const scanButton = document.querySelector('[onclick="startQRScanner()"]');
    if (!scanButton) {
        // Find the QR scan button and add handler
        const qrButtons = document.querySelectorAll('.btn');
        qrButtons.forEach(btn => {
            if (btn.innerHTML.includes('fa-qrcode')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    startQRScanner();
                });
            }
        });
    }
});

// Add QR scanner styles
const qrStyles = document.createElement('style');
qrStyles.textContent = `
    #qr-reader {
        border: 2px solid var(--primary-color);
        border-radius: 15px;
        overflow: hidden;
    }
    
    #qr-reader video {
        border-radius: 13px;
    }
    
    #qr-reader-results {
        min-height: 50px;
    }
    
    .qr-share-button {
        cursor: pointer;
        color: var(--primary-color);
        transition: var(--transition);
    }
    
    .qr-share-button:hover {
        color: var(--secondary-color);
        transform: scale(1.1);
    }
`;
document.head.appendChild(qrStyles);