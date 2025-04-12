/**
 * Header functionality for Trumpac-Man game
 */

document.addEventListener('DOMContentLoaded', function() {
    // Copy button functionality
    const copyButton = document.getElementById('copyButton');
    const copyMessage = document.getElementById('copyMessage');
    const walletAddress = document.getElementById('walletAddress');
    // TODO Add wallet address
    const addressValue = walletAddress ? walletAddress.textContent : 'Will be There';
    
    // Make the entire wallet container clickable for copying
    const walletContainer = document.querySelector('.wallet-container');
    if (walletContainer) {
        walletContainer.style.cursor = 'pointer';
        
        walletContainer.addEventListener('click', function(e) {
            // Don't trigger if clicking on the button itself (it has its own handler)
            if (e.target === copyButton || copyButton.contains(e.target)) {
                return;
            }
            
            // Trigger the copy button click
            copyButton.click();
        });
    }
    
    // Copy button click handler
    copyButton.addEventListener('click', function() {
        // Add click effect to button
        copyButton.classList.add('clicked');
        
        // Copy the address to clipboard
        navigator.clipboard.writeText(addressValue)
            .then(() => {
                // Show the copied message with animation
                copyMessage.classList.add('show');
                
                // Add a subtle pulse to the wallet container
                if (walletContainer) {
                    walletContainer.classList.add('active-copy');
                }
                
                // Speed up coin rotation during copy animation
                const walletCoin = document.querySelector('.wallet-coin');
                if (walletCoin) {
                    walletCoin.style.animationDuration = '0.5s';
                }
                
                // Hide the message and reset after animation completes
                setTimeout(() => {
                    copyMessage.classList.remove('show');
                    copyButton.classList.remove('clicked');
                    
                    if (walletContainer) {
                        walletContainer.classList.remove('active-copy');
                    }
                    
                    // Return coin rotation to normal
                    if (walletCoin) {
                        walletCoin.style.animationDuration = '4s';
                    }
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy address: ', err);
                copyButton.classList.remove('clicked');
            });
    });
    
    // Add hover effects for social buttons
    const socialButtons = document.querySelectorAll('.social-button');
    socialButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.social-icon');
            if (icon) icon.classList.add('animated');
        });
        
        button.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.social-icon');
            if (icon) icon.classList.remove('animated');
        });
    });
    
    // Add 3D rotation effect on wallet icon hover
    if (walletContainer) {
        const walletCoin = walletContainer.querySelector('.wallet-coin');
        
        walletContainer.addEventListener('mouseenter', function() {
            if (walletCoin) walletCoin.style.animationDuration = '1s';
        });
        
        walletContainer.addEventListener('mouseleave', function() {
            if (!walletContainer.classList.contains('active-copy') && walletCoin) {
                walletCoin.style.animationDuration = '4s';
            }
        });
    }
});
