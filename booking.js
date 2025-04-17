document.addEventListener('DOMContentLoaded', function() {
    // Mobile sidebar toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const closeSidebarBtn = document.querySelector('.close-sidebar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', function() {
            sidebar.classList.remove('open');
        });
    }

    // User dropdown functionality
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown) {
        userDropdown.addEventListener('click', function() {
            this.classList.toggle('active');
        });

        // Close dropdown when clicking elsewhere
        document.addEventListener('click', function(event) {
            if (!userDropdown.contains(event.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }

    // Copy booking ID functionality
    const copyBtn = document.querySelector('.copy-btn');
    const bookingId = document.getElementById('bookingId');
    
    if (copyBtn && bookingId) {
        copyBtn.addEventListener('click', function() {
            const textToCopy = bookingId.textContent;
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    // Show success feedback
                    const originalHtml = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    copyBtn.classList.add('copied');
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = originalHtml;
                        copyBtn.classList.remove('copied');
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        });
    }

    // Download receipt functionality
    const downloadReceiptBtn = document.getElementById('downloadReceiptBtn');
    if (downloadReceiptBtn) {
        downloadReceiptBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // This will be handled by your backend
            console.log('Download receipt clicked - to be implemented with backend');
            // You can add a loading state here if needed
        });
    }

    // Share functionality
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if Web Share API is available
            if (navigator.share) {
                navigator.share({
                    title: 'My ParkEase Booking',
                    text: `Booking ID: ${bookingId.textContent}`,
                    // You'll need to set your actual URL here
                    url: window.location.href
                })
                .catch(err => console.error('Share failed:', err));
            } else {
                // Fallback for browsers that don't support the Web Share API
                console.log('Web Share API not supported - implement custom share modal with backend');
            }
        });
    }

    // Add to calendar functionality
    const addCalendarBtn = document.getElementById('addCalendarBtn');
    if (addCalendarBtn) {
        addCalendarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // This will be handled by your backend to generate the proper calendar file
            console.log('Add to calendar clicked - to be implemented with backend');
        });
    }

    // Function to generate QR code placeholder
    // This is a placeholder - you'll likely generate this with your backend
    function generateQRCode() {
        const qrPlaceholder = document.querySelector('.qr-placeholder');
        if (qrPlaceholder) {
            // Your backend will provide the actual QR code
            // This is just for visualization in the frontend
            qrPlaceholder.style.backgroundImage = "url('data:image/svg+xml;charset=UTF-8," + 
                encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100">' +
                '<rect x="0" y="0" width="100" height="100" fill="#FFFFFF"/>' +
                '<pattern id="pattern" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">' +
                '<rect x="0" y="0" width="5" height="10" fill="#000000"/>' +
                '</pattern>' +
                '<rect x="10" y="10" width="80" height="80" fill="url(#pattern)"/>' +
                '</svg>') + "')";
        }
    }

    // Initialize QR code
    generateQRCode();

    // Set up map pin position - this would be dynamic based on the slot
    function setupMapPin() {
        const slotPin = document.getElementById('slotPin');
        const mapContainer = document.querySelector('.map-container');
        
        if (slotPin && mapContainer) {
            // Position would be calculated based on the actual slot
            // These are placeholder calculations
            const slotNumber = document.getElementById('confirmSlot').textContent;
            const pinPositionX = ((parseInt(slotNumber) % 10) / 10) * 80 + 10; // Basic calculation for demo
            const pinPositionY = (Math.floor(parseInt(slotNumber) / 10) / 5) * 80 + 10; // Basic calculation for demo
            
            slotPin.style.left = `${pinPositionX}%`;
            slotPin.style.top = `${pinPositionY}%`;
        }
    }

    // Initialize map pin
    setupMapPin();

    // Function to update booking details from server data
    // You'll call this after fetching data from your backend
    function updateBookingDetails(bookingData) {
        // This is a placeholder function that you would call with your backend data
        if (!bookingData) return;
        
        // Update all the booking details
        const elements = {
            'bookingId': bookingData.bookingId,
            'confirmZone': bookingData.zone,
            'confirmSlot': bookingData.slot,
            'confirmEntry': bookingData.entryTime,
            'confirmExit': bookingData.exitTime,
            'confirmVehicle': bookingData.vehicleType,
            'confirmVehicleNum': bookingData.vehicleNumber,
            'confirmPlan': bookingData.pricingPlan,
            'confirmPayment': bookingData.paymentMethod,
            'confirmAmount': bookingData.amount,
            'confirmStatus': bookingData.paymentStatus
        };
        
        // Update each element if it exists
        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element && value) {
                element.textContent = value;
            }
        }
        
        // Update map pin position after data is loaded
        setupMapPin();
    }

    // This would be called when your backend sends booking data
    // For now, we'll leave it as a placeholder
    // updateBookingDetails(yourBackendData);

    // Handle any session timeout or authentication issues
    function setupSessionHandling() {
        // Check authentication status or session validity
        // This is a placeholder for your backend integration
        
        // Example: Redirect to login if session is invalid
        /* 
        if (!isSessionValid()) {
            window.location.href = 'login.html';
        }
        */
    }

    // Call session handling setup
    setupSessionHandling();
});