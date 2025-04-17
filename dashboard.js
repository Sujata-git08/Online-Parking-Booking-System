// DOM Elements and initialization
document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const bookingModal = document.getElementById('bookingModal');
    const modalClose = document.querySelector('.modal-close');
    const modalCancel = document.querySelector('.modal-cancel');
    const confirmBookingBtn = document.getElementById('confirmBookingBtn');
    
    // Zone selection elements
    const zoneMap = document.querySelectorAll('.zone-selector .zone');
    const selectedZoneName = document.getElementById('selectedZoneName');
    const zoneTotal = document.getElementById('zoneTotal');
    const zoneAvailable = document.getElementById('zoneAvailable');
    const zoneLocation = document.getElementById('zoneLocation');
    
    // Booking form elements
    const bookingForm = document.getElementById('bookingForm');
    const slotSelectors = document.querySelectorAll('.slot-item');
    const entryDateInput = document.getElementById('entryDate');
    const exitDateInput = document.getElementById('exitDate');
    const vehicleTypeSelect = document.getElementById('vehicleType');
    
    // Summary elements in modal
    const summaryZone = document.getElementById('summaryZone');
    const summarySlot = document.getElementById('summarySlot');
    const summaryEntry = document.getElementById('summaryEntry');
    const summaryExit = document.getElementById('summaryExit');
    const summaryVehicle = document.getElementById('summaryVehicle');
    const summaryDuration = document.getElementById('summaryDuration');
    const summaryPlan = document.getElementById('summaryPlan');
    const summaryPrice = document.getElementById('summaryPrice');
    
    // Action buttons in booking list
    const viewBookingBtns = document.querySelectorAll('.booking-actions .btn-icon[title="View Booking"]');
    const cancelBookingBtns = document.querySelectorAll('.booking-actions .btn-icon[title="Cancel Booking"]');
    const bookAgainBtns = document.querySelectorAll('.booking-actions .btn-icon[title="Book Again"]');
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }


    document.getElementById("logoutBtn").addEventListener("click", function (event) {
        // Prevent default navigation
        event.preventDefault();
      
        // Clear local storage
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      
        // Optionally: Show a message or redirect
        alert("You have been logged out!");
      
        // Redirect to homepage or login page
        window.location.href = "./index.html";
      });
      
    
    // Zone data (would typically come from API)
    const zonesData = {
        'zone-a': {
            name: 'Zone A',
            total: 30,
            available: 18,
            location: 'North Campus',
            features: ['CCTV', 'Security', 'Covered'],
            price: 50
        },
        'zone-b': {
            name: 'Zone B',
            total: 25,
            available: 10,
            location: 'South Campus',
            features: ['CCTV', 'Security'],
            price: 40
        },
        'zone-c': {
            name: 'Zone C',
            total: 20,
            available: 5,
            location: 'East Campus',
            features: ['CCTV'],
            price: 30
        },
        'zone-d': {
            name: 'Zone D',
            total: 35,
            available: 22,
            location: 'West Campus',
            features: ['CCTV', 'Security', 'Covered', 'EV Charging'],
            price: 60
        }
    };
    
    // Slot status data (would typically come from API)
    const slotStatus = {
        'zone-a': {
            1: 'occupied', 2: 'available', 3: 'available', 4: 'occupied',
            5: 'available', 6: 'occupied', 7: 'available', 8: 'occupied',
            9: 'available', 10: 'available', 11: 'occupied', 12: 'available',
            13: 'occupied', 14: 'available', 15: 'occupied'
        },
        'zone-b': {
            // Similar data for Zone B
        },
        'zone-c': {
            // Similar data for Zone C
        },
        'zone-d': {
            // Similar data for Zone D
        }
    };
    
    // Initialize date pickers if they exist
    if (entryDateInput && exitDateInput) {
        // Initialize flatpickr for date inputs if the library is loaded
        if (typeof flatpickr === 'function') {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);
            
            // Entry date configuration
            const entryDatePicker = flatpickr(entryDateInput, {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                minDate: "today",
                defaultDate: today,
                onChange: function(selectedDates, dateStr) {
                    // Update exit date min time when entry date is changed
                    exitDatePicker.set('minDate', dateStr);
                    updateDurationAndPrice();
                }
            });
            
            // Exit date configuration
            const exitDatePicker = flatpickr(exitDateInput, {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                minDate: today,
                defaultDate: tomorrow,
                onChange: function() {
                    updateDurationAndPrice();
                }
            });
        }
    }
    
    // Initialize zone map
    if (zoneMap && zoneMap.length > 0) {
        zoneMap.forEach(zone => {
            zone.addEventListener('click', function() {
                // Remove active class from all zones
                zoneMap.forEach(z => z.classList.remove('active'));
                
                // Add active class to clicked zone
                this.classList.add('active');
                
                // Update zone information
                const zoneId = this.getAttribute('data-zone');
                updateZoneInfo(zoneId);
                
                // Update slot grid based on selected zone
                updateSlotGrid(zoneId);
            });
        });
        
        // Activate the first zone by default
        if (zoneMap[0]) {
            zoneMap[0].click();
        }
    }
    
    // Initialize slot selection
    if (slotSelectors && slotSelectors.length > 0) {
        slotSelectors.forEach(slot => {
            slot.addEventListener('click', function() {
                // Only allow selection if the slot is available
                if (!this.classList.contains('occupied')) {
                    // Toggle selected state
                    slotSelectors.forEach(s => s.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    // Update form with selected slot
                    if (bookingForm) {
                        const slotInput = bookingForm.querySelector('input[name="selectedSlot"]');
                        if (slotInput) {
                            slotInput.value = this.getAttribute('data-slot');
                        }
                    }
                }
            });
        });
    }
    
    // Handle form submission for booking
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get selected zone
            const activeZone = document.querySelector('.zone-selector .zone.active');
            if (!activeZone) {
                showAlert('Please select a parking zone', 'error');
                return;
            }
            
            // Get selected slot
            const selectedSlot = document.querySelector('.slot-item.selected');
            if (!selectedSlot) {
                showAlert('Please select a parking slot', 'error');
                return;
            }
            
            // Get form values
            const zoneId = activeZone.getAttribute('data-zone');
            const slotNumber = selectedSlot.getAttribute('data-slot');
            const entryDate = entryDateInput.value;
            const exitDate = exitDateInput.value;
            const vehicleType = vehicleTypeSelect.value;
            
            // Open booking confirmation modal
            openBookingModal(zoneId, slotNumber, entryDate, exitDate, vehicleType);
        });
    }
    
    // Modal event listeners
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalCancel) {
        modalCancel.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === bookingModal) {
            closeModal();
        }
    });
    
    // Confirm booking button
    if (confirmBookingBtn) {
        confirmBookingBtn.addEventListener('click', function() {
            // Show processing state
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            // Simulate payment and booking process
            setTimeout(() => {
                // Close modal
                closeModal();
                
                // Show success notification
                showAlert('Booking confirmed successfully!', 'success');
                
                // Reset form and reload zone information
                if (bookingForm) {
                    bookingForm.reset();
                }
                
                // Update slot grid to reflect the newly booked slot
                const activeZone = document.querySelector('.zone-selector .zone.active');
                if (activeZone) {
                    const zoneId = activeZone.getAttribute('data-zone');
                    updateZoneInfo(zoneId);
                    updateSlotGrid(zoneId);
                }
                
                // Reset button state
                this.disabled = false;
                this.innerHTML = 'Confirm & Pay';
                
                // Simulate reload of bookings list or redirect to bookings page
                // In a real application you might want to redirect or update the bookings list
                // window.location.href = 'bookings.html';
            }, 2000);
        });
    }
    
    // Handle action buttons in booking list
    if (viewBookingBtns.length > 0) {
        viewBookingBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const bookingItem = this.closest('.booking-item');
                const bookingInfo = bookingItem.querySelector('.booking-details h4').textContent;
                
                // In a real app, you'd fetch the booking details from an API
                alert(`Viewing details for ${bookingInfo}`);
                // Or redirect to a booking details page
                // window.location.href = `booking-details.html?id=${bookingId}`;
            });
        });
    }
    
    if (cancelBookingBtns.length > 0) {
        cancelBookingBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const bookingItem = this.closest('.booking-item');
                const bookingInfo = bookingItem.querySelector('.booking-details h4').textContent;
                
                if (confirm(`Are you sure you want to cancel your booking for ${bookingInfo}?`)) {
                    // In a real app, you'd send a cancel request to an API
                    // Simulate success for demonstration
                    bookingItem.style.opacity = '0.5';
                    const status = bookingItem.querySelector('.booking-status');
                    status.textContent = 'Cancelled';
                    status.className = 'booking-status cancelled';
                    
                    showAlert('Booking cancelled successfully', 'success');
                }
            });
        });
    }
    
    if (bookAgainBtns.length > 0) {
        bookAgainBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const bookingItem = this.closest('.booking-item');
                const bookingInfo = bookingItem.querySelector('.booking-details h4').textContent;
                
                // Extract zone and slot information
                const match = bookingInfo.match(/Zone (\w+) - Slot (\d+)/);
                if (match) {
                    const zoneChar = match[1];
                    const slotNumber = match[2];
                    
                    // Navigate to booking section and pre-select the zone/slot
                    // In a real app, you'd pre-fill the form with these values
                    alert(`Book again for Zone ${zoneChar} - Slot ${slotNumber}`);
                    
                    // Scroll to booking section
                    const bookingSection = document.getElementById('booking-section');
                    if (bookingSection) {
                        bookingSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }
    
    // Helper Functions
    function updateZoneInfo(zoneId) {
        const zoneData = zonesData[zoneId];
        if (!zoneData) return;
        
        // Update zone information in the UI
        if (selectedZoneName) selectedZoneName.textContent = zoneData.name;
        if (zoneTotal) zoneTotal.textContent = zoneData.total;
        if (zoneAvailable) zoneAvailable.textContent = zoneData.available;
        if (zoneLocation) zoneLocation.textContent = zoneData.location;
        
        // Update zone status class
        const zoneStatus = document.querySelector('.zone-status');
        if (zoneStatus) {
            zoneStatus.className = 'zone-status';
            zoneStatus.classList.add(zoneData.available > 0 ? 'available' : 'full');
            zoneStatus.textContent = zoneData.available > 0 ? 'Available' : 'Full';
        }
        
        // Update features
        updateFeatures(zoneData.features);
    }
    
    function updateFeatures(features) {
        const featuresContainer = document.querySelector('.zone-features');
        if (!featuresContainer) return;
        
        // Clear existing features
        featuresContainer.innerHTML = '';
        
        // Add the features
        features.forEach(feature => {
            const iconClass = getFeatureIcon(feature);
            const featureEl = document.createElement('div');
            featureEl.className = 'zone-feature';
            featureEl.innerHTML = `
                <i class="${iconClass}"></i>
                <span>${feature}</span>
            `;
            featuresContainer.appendChild(featureEl);
        });
    }
    
    function getFeatureIcon(feature) {
        // Map features to icons
        const iconMap = {
            'CCTV': 'fas fa-video',
            'Security': 'fas fa-shield-alt',
            'Covered': 'fas fa-umbrella',
            'EV Charging': 'fas fa-charging-station',
            'Handicap Access': 'fas fa-wheelchair'
        };
        
        return iconMap[feature] || 'fas fa-check-circle';
    }
    
    function updateSlotGrid(zoneId) {
        // In a real app, you'd fetch this data from an API
        const slotsContainer = document.querySelector('.slot-grid');
        if (!slotsContainer) return;
        
        // Get slot status data for the selected zone
        const slots = slotStatus[zoneId] || {};
        
        // Clear existing slots
        slotsContainer.innerHTML = '';
        
        // Generate slots based on zone capacity
        const totalSlots = zonesData[zoneId].total;
        for (let i = 1; i <= totalSlots; i++) {
            const status = slots[i] || 'available';
            const slotItem = document.createElement('div');
            slotItem.className = `slot-item ${status}`;
            slotItem.setAttribute('data-slot', i);
            slotItem.innerHTML = `
                <span class="slot-number">${i}</span>
                <i class="fas fa-${status === 'occupied' ? 'times' : 'check'}"></i>
            `;
            
            // Add click event for available slots
            if (status !== 'occupied') {
                slotItem.addEventListener('click', function() {
                    document.querySelectorAll('.slot-item').forEach(s => s.classList.remove('selected'));
                    this.classList.add('selected');
                });
            }
            
            slotsContainer.appendChild(slotItem);
        }
    }
    
    function openBookingModal(zoneId, slotNumber, entryDate, exitDate, vehicleType) {
        const zoneData = zonesData[zoneId];
        if (!zoneData) return;
        
        // Format dates for display
        const entryDateTime = new Date(entryDate);
        const exitDateTime = new Date(exitDate);
        
        const formattedEntryDate = formatDateTime(entryDateTime);
        const formattedExitDate = formatDateTime(exitDateTime);
        
        // Calculate duration and price
        const durationHours = (exitDateTime - entryDateTime) / (1000 * 60 * 60);
        const durationFormatted = formatDuration(durationHours);
        
        const price = calculatePrice(zoneData.price, durationHours, vehicleType);
        
        // Update modal with booking details
        if (summaryZone) summaryZone.textContent = zoneData.name;
        if (summarySlot) summarySlot.textContent = slotNumber;
        if (summaryEntry) summaryEntry.textContent = formattedEntryDate;
        if (summaryExit) summaryExit.textContent = formattedExitDate;
        if (summaryVehicle) summaryVehicle.textContent = getVehicleTypeLabel(vehicleType);
        if (summaryDuration) summaryDuration.textContent = durationFormatted;
        if (summaryPlan) summaryPlan.textContent = `Daily (₹${zoneData.price}/day)`;
        if (summaryPrice) summaryPrice.textContent = `₹${price}`;
        
        // Show modal
        if (bookingModal) {
            bookingModal.style.display = 'block';
        }
    }
    
    function closeModal() {
        if (bookingModal) {
            bookingModal.style.display = 'none';
        }
    }
    
    function getVehicleTypeLabel(type) {
        const vehicleTypes = {
            'car': '4-Wheeler',
            'bike': '2-Wheeler',
            'suv': 'SUV/Large Vehicle'
        };
        
        return vehicleTypes[type] || type;
    }
    
    function formatDateTime(date) {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit'
        };
        
        return date.toLocaleDateString('en-US', options);
    }
    
    function formatDuration(hours) {
        if (hours < 1) {
            return `${Math.ceil(hours * 60)} minutes`;
        } else if (Math.floor(hours) === hours) {
            return `${hours} hours`;
        } else {
            const h = Math.floor(hours);
            const m = Math.round((hours - h) * 60);
            return `${h} hours, ${m} minutes`;
        }
    }
    
    function calculatePrice(baseRate, duration, vehicleType) {
        // Calculate price based on duration and vehicle type
        let price = baseRate;
        
        // Apply vehicle type multiplier
        const vehicleMultiplier = {
            'car': 1,
            'bike': 0.7,
            'suv': 1.3
        };
        
        const multiplier = vehicleMultiplier[vehicleType] || 1;
        price *= multiplier;
        
        // Apply duration pricing (daily rate)
        const days = Math.ceil(duration / 24);
        price *= days;
        
        return Math.round(price);
    }
    
    function updateDurationAndPrice() {
        // This function would be called when date inputs change
        // to update any visible duration and price information
        if (!entryDateInput || !exitDateInput) return;
        
        const entryDate = new Date(entryDateInput.value);
        const exitDate = new Date(exitDateInput.value);
        
        if (isNaN(entryDate) || isNaN(exitDate)) return;
        
        // Calculate duration
        const durationHours = (exitDate - entryDate) / (1000 * 60 * 60);
        if (durationHours <= 0) return;
        
        // Find where to display this information
        const durationDisplay = document.getElementById('bookingDuration');
        const priceDisplay = document.getElementById('bookingPrice');
        
        if (durationDisplay) {
            durationDisplay.textContent = formatDuration(durationHours);
        }
        
        // Update price if zone is selected
        if (priceDisplay) {
            const activeZone = document.querySelector('.zone-selector .zone.active');
            if (activeZone) {
                const zoneId = activeZone.getAttribute('data-zone');
                const zoneData = zonesData[zoneId];
                
                if (zoneData) {
                    const vehicleType = vehicleTypeSelect ? vehicleTypeSelect.value : 'car';
                    const price = calculatePrice(zoneData.price, durationHours, vehicleType);
                    priceDisplay.textContent = `₹${price}`;
                }
            }
        }
    }
    
    function showAlert(message, type = 'info') {
        // Create alert container if it doesn't exist
        let alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) {
            alertContainer = document.createElement('div');
            alertContainer.id = 'alertContainer';
            alertContainer.className = 'alert-container';
            document.body.appendChild(alertContainer);
        }
        
        // Create the alert
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="alert-close">&times;</button>
        `;
        
        // Add to container
        alertContainer.appendChild(alert);
        
        // Auto remove after a delay
        const timeout = setTimeout(() => {
            if (alert.parentNode) {
                alert.classList.add('fade-out');
                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.parentNode.removeChild(alert);
                    }
                }, 300);
            }
        }, 5000);
        
        // Close button
        const closeBtn = alert.querySelector('.alert-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                clearTimeout(timeout);
                alert.classList.add('fade-out');
                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.parentNode.removeChild(alert);
                    }
                }, 300);
            });
        }
    }
    
    // Add these styles if you don't have them in your CSS already
    function addAlertStyles() {
        if (!document.querySelector('#alert-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'alert-styles';
            styleSheet.textContent = `
                .alert-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .alert {
                    background-color: white;
                    border-radius: 4px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    padding: 12px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-width: 250px;
                    max-width: 350px;
                    animation: slideIn 0.3s ease-in-out;
                }
                
                .alert.fade-out {
                    animation: slideOut 0.3s ease-in-out forwards;
                }
                
                .alert-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .alert-content i {
                    font-size: 1.2rem;
                }
                
                .alert-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1.2rem;
                    opacity: 0.5;
                }
                
                .alert-close:hover {
                    opacity: 1;
                }
                
                .alert-success {
                    border-left: 4px solid #4CAF50;
                }
                
                .alert-success i {
                    color: #4CAF50;
                }
                
                .alert-error {
                    border-left: 4px solid #F44336;
                }
                
                .alert-error i {
                    color: #F44336;
                }
                
                .alert-info {
                    border-left: 4px solid #2196F3;
                }
                
                .alert-info i {
                    color: #2196F3;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }
    
    // Add alert styles
    addAlertStyles();
});