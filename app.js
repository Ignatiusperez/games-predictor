document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTION (GATES) ---
    const registerGate = document.getElementById('register-gate');
    const paymentGate = document.getElementById('payment-gate');
    const loginGate = document.getElementById('login-gate');
    const mainApp = document.getElementById('main-app');
    
    // Registration Elements
    const registerForm = document.getElementById('register-form');
    const regEmail = document.getElementById('reg-email');
    const regPhone = document.getElementById('reg-phone');
    const regPassword = document.getElementById('reg-password');
    const registerError = document.getElementById('register-error');
    
    // Payment Elements
    const mpesaInfoButton = document.getElementById('mpesa-info-button');
    const confirmPaymentButton = document.getElementById('confirm-payment');
    
    // Login Elements
    const loginForm = document.getElementById('login-form');
    const loginPin = document.getElementById('login-pin');
    const loginError = document.getElementById('login-error');

    // App Elements
    const matchList = document.getElementById('match-list');
    
    // Navigation Links
    const showLoginLink = document.getElementById('show-login');
    const showRegisterLink = document.getElementById('show-register');

    // Utility Buttons
    const logoutButton = document.getElementById('logout-button');
    const helpButton = document.getElementById('help-button');
    const callButton = document.getElementById('call-button');
    const paymentMethodButton = document.getElementById('payment-method-button');

    // --- CONFIGURATION & STATE ---
    const FEE_AMOUNT = 1000;
    const PAYMENT_NUMBER = '0706535581';
    const NOTIFICATION_NUMBER = '0781346242';
    
    let registeredUser = null; 
    let generatedPin = '1234'; // Default PIN for simulation

    // --- 1. NAVIGATION CONTROL ---
    const navigateTo = (target) => {
        [registerGate, paymentGate, loginGate, mainApp].forEach(el => el.classList.add('hidden'));
        target.classList.remove('hidden');
    };

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(loginGate);
    });
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(registerGate);
    });
    logoutButton.addEventListener('click', () => {
        alert("You have been securely logged out.");
        navigateTo(loginGate);
        registeredUser = null;
        loginPin.value = '';
    });


    // --- 2. REGISTRATION FLOW ---
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        registerError.textContent = '';

        if (regPassword.value.length < 6) {
            registerError.textContent = 'Password must be at least 6 characters.';
            return;
        }

        // Store registration data locally (Simulated Database)
        registeredUser = {
            email: regEmail.value,
            phone: regPhone.value,
            password: regPassword.value, // Not used for login, only payment pin is used
            isPaid: false
        };

        // SIMULATED BACKEND NOTIFICATION
        alert(`REGISTRATION SUCCESS!
        
        Developer Notification (SIMULATED SMS to ${NOTIFICATION_NUMBER}): 
        New User Registered: Email=${registeredUser.email}, Phone=${registeredUser.phone}. 
        Status: Awaiting payment.`);

        // Proceed to Payment
        navigateTo(paymentGate);
    });


    // --- 3. PAYMENT FLOW (SIMULATED) ---

    mpesaInfoButton.addEventListener('click', () => {
         alert(`M-PESA PAYMENT REQUIRED:
         
         1. Send Ksh ${FEE_AMOUNT} to the number: ${PAYMENT_NUMBER}
         
         2. After payment, click 'Verify Transaction'.`);
    });

    confirmPaymentButton.addEventListener('click', () => {
        if (!registeredUser) {
            alert("Error: Please register first.");
            navigateTo(registerGate);
            return;
        }

        // Simulate payment verification API call
        alert("Verification API Check: Please wait 3 seconds...");
        confirmPaymentButton.disabled = true;

        setTimeout(() => {
            // SIMULATED PAYMENT SUCCESS
            registeredUser.isPaid = true;
            
            // Generate and store PIN
            generatedPin = Math.floor(1000 + Math.random() * 9000).toString(); 

            // SIMULATED PIN SMS TO USER
            alert(`TRANSACTION VERIFIED!
            
            Your unique 4-digit login PIN has been sent via SMS to ${registeredUser.phone} (SIMULATED).
            Your PIN is: ${generatedPin}`);
            
            // SIMULATED NOTIFICATION TO DEVELOPER
            alert(`Developer Notification (SIMULATED SMS to ${NOTIFICATION_NUMBER}): 
            User Paid (Ksh 1000). Pin Sent: ${generatedPin}.`);
            
            confirmPaymentButton.disabled = false;
            navigateTo(loginGate);

        }, 3000); // 3 second verification delay
    });


    // --- 4. LOGIN FLOW ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginError.textContent = '';
        
        if (!registeredUser || !registeredUser.isPaid) {
             loginError.textContent = 'Registration or payment required.';
             return;
        }
        
        if (loginPin.value === generatedPin) {
            loginError.textContent = '';
            alert("Login successful! Welcome back, Ignatius!");
            navigateTo(mainApp);
            fetchUpcomingMatches();
        } else {
            loginError.textContent = 'Invalid PIN. Please check your simulated SMS.';
        }
    });

    // --- 5. FOOTBALL PREDICTION LOGIC ---

    /**
     * SIMULATED API: Fetches upcoming football games.
     * Uses dummy data to simulate the structure of a Football API response.
     */
    const fetchUpcomingMatches = () => {
        matchList.innerHTML = '<p id="loading-matches" class="status-predicting">Fetching fixtures from fixed match server...</p>';

        setTimeout(() => {
            const matches = [
                { home: 'Man United', away: 'Liverpool', time: 'Today 19:30', league: 'EPL' },
                { home: 'Real Madrid', away: 'Barcelona', time: 'Tomorrow 21:00', league: 'La Liga' },
                { home: 'Bayern Munich', away: 'Dortmund', time: 'Sat 16:30', league: 'Bundesliga' },
                { home: 'Arsenal', away: 'Chelsea', time: 'Sun 18:00', league: 'EPL' },
            ];

            matchList.innerHTML = '';
            matches.forEach(match => createMatchCard(match));
        }, 2500);
    };

    /**
     * Generates a "fixed" (highly confident) prediction.
     */
    const predictFixedWinner = (home, away) => {
        // 90% chance the Home team is the "fixed" winner for demonstration
        const winner = Math.random() < 0.9 ? home : away;
        return winner;
    };

    /**
     * Creates the HTML structure for a single match prediction.
     */
    const createMatchCard = (match) => {
        const winner = predictFixedWinner(match.home, match.away);
        
        const card = document.createElement('div');
        card.classList.add('match-card');
        card.innerHTML = `
            <div class="match-details">
                <h4>${match.home} vs ${match.away}</h4>
                <p>${match.league} | Kickoff: ${match.time}</p>
            </div>
            <div class="prediction-result">
                WIN: ${winner.split(' ')[0]}
            </div>
        `;
        matchList.appendChild(card);
    };


    // --- 6. UTILITY HANDLERS ---
    
    document.getElementById('history-button').addEventListener('click', () => {
        alert('HISTORY: Showing recent predictions: ALL WINNERS (100% success rate guaranteed).');
    });
    
    document.getElementById('strategies-button').addEventListener('click', () => {
        alert('STRATEGIES: Bet 70% of your bankroll on the predicted winner for maximum, guaranteed profit.');
    });

    callButton.addEventListener('click', () => {
        window.location.href = `tel:${NOTIFICATION_NUMBER}`;
        alert(`Calling Support/Developer: ${NOTIFICATION_NUMBER}`);
    });
    
    paymentMethodButton.addEventListener('click', () => {
         alert(`REGISTRATION FEE: Ksh ${FEE_AMOUNT}. Payment number: ${PAYMENT_NUMBER}.`);
    });

    helpButton.addEventListener('click', () => {
         alert('HELP: Fixed predictions are posted daily. Use your unique PIN to log in after payment.');
    });

    // --- INITIALIZATION ---
    navigateTo(registerGate);
});
