// Configuration
const UPDATE_INTERVAL = 3000; // Update every 3 seconds
const ALERT_THRESHOLD = 30; // Alert when soil moisture is below 30%

let lastSoilPercent = null;
let alertShown = false;

// Function to update the dashboard
async function updateDashboard() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();

        if (data.error) {
            showError(data.message);
            return;
        }

        // Update sensor values
        updateElement('temperature', data.temperature ? data.temperature.toFixed(1) : '--');
        updateElement('humidity', data.humidity ? data.humidity.toFixed(1) : '--');
        updateElement('soilPercent', data.soil_percent !== null ? data.soil_percent : '--');
        updateElement('soilRaw', data.soil_raw !== null ? data.soil_raw : '--');
        updateElement('soilMoisture', data.soil_percent !== null ? data.soil_percent : '--');

        // Update soil progress bar
        const progressBar = document.getElementById('soilProgress');
        if (progressBar && data.soil_percent !== null) {
            progressBar.style.width = `${data.soil_percent}%`;
        }

        // Update soil image and status
        updateSoilStatus(data.soil_percent, data.soilImage, data.soilMessage);

        // Update connection status
        updateConnectionStatus(true);

        // Update last update time
        updateLastUpdate();

        // Check for alerts
        checkSoilQuality(data.soil_percent);

        lastSoilPercent = data.soil_percent;
    } catch (error) {
        console.error('Error updating dashboard:', error);
        showError('Failed to fetch data from server');
        updateConnectionStatus(false);
    }
}

// Function to update soil status
function updateSoilStatus(soilPercent, imageName, message) {
    const soilImage = document.getElementById('soilImage');
    const soilStatus = document.getElementById('soilStatus');

    if (soilImage && imageName) {
        soilImage.src = `/images/${imageName}`;
    }

    if (soilStatus && message) {
        soilStatus.textContent = message;
        
        // Update status class
        soilStatus.className = 'status-';
        if (soilPercent >= 60) {
            soilStatus.className += 'excellent';
        } else if (soilPercent >= 30) {
            soilStatus.className += 'normal';
        } else {
            soilStatus.className += 'poor';
        }
    }
}

// Function to check soil quality and show alerts
function checkSoilQuality(soilPercent) {
    if (soilPercent === null || soilPercent === undefined) return;

    // Show alert if soil quality drops below threshold
    if (soilPercent < ALERT_THRESHOLD) {
        // Only show alert if it's a new drop (wasn't already below threshold)
        if (lastSoilPercent === null || lastSoilPercent >= ALERT_THRESHOLD) {
            showAlert(soilPercent);
            alertShown = true;
        }
    } else {
        // Reset alert flag when soil quality improves
        if (soilPercent >= ALERT_THRESHOLD) {
            alertShown = false;
        }
    }
}

// Function to show alert modal
function showAlert(soilPercent) {
    const modal = document.getElementById('alertModal');
    const alertMessage = document.getElementById('alertMessage');

    if (modal && alertMessage) {
        alertMessage.textContent = `Soil moisture is critically low at ${soilPercent}%!`;
        modal.classList.add('show');
        
        // Auto-close after 10 seconds if user doesn't close it
        setTimeout(() => {
            if (modal.classList.contains('show')) {
                closeAlert();
            }
        }, 10000);
    }
}

// Function to close alert modal
function closeAlert() {
    const modal = document.getElementById('alertModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Function to update element text
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Function to update connection status
function updateConnectionStatus(connected) {
    const statusElement = document.getElementById('connectionStatus');
    if (statusElement) {
        if (connected) {
            statusElement.textContent = '🟢 Connected';
            statusElement.style.color = '#2d5016';
        } else {
            statusElement.textContent = '🔴 Disconnected';
            statusElement.style.color = '#d32f2f';
        }
    }
}

// Function to update last update time
function updateLastUpdate() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        lastUpdateElement.textContent = timeString;
    }
}

// Function to show error message
function showError(message) {
    console.error('Dashboard Error:', message);
    updateConnectionStatus(false);
    
    // Update elements to show error state
    updateElement('temperature', '--');
    updateElement('humidity', '--');
    updateElement('soilPercent', '--');
    updateElement('soilRaw', '--');
    updateElement('soilMoisture', '--');
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('Soil Monitoring Dashboard initialized');
    
    // Initial update
    updateDashboard();
    
    // Set up periodic updates
    setInterval(updateDashboard, UPDATE_INTERVAL);
    
    // Close modal when clicking outside
    const modal = document.getElementById('alertModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAlert();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAlert();
        }
    });
});

