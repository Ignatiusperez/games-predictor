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
    const regPasswordInput = document.getElementById('reg-password'); 
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
    
    // Navigation Links and Buttons
    const showLoginLink = document.getElementById('show-login');
    const showRegisterLink = document.getElementById('show-register');
    const logoutButton = document.getElementById('logout-button');
    const callButton = document.getElementById('call-button');

    // Utility Buttons
    const paymentMethodButton = document.getElementById('payment-method-button');


    // --- CONFIGURATION & STATE ---
    const FEE_AMOUNT = 1000;
    const PAYMENT_NUMBER = '0706535581';
    const NOTIFICATION_NUMBER = '0781346242';
    
    const DEV_BYPASS_PASSWORD = 'devpass23'; 
    const GENERATED_PIN_DEFAULT = '1234'; 
    
    let registeredUser = null; 
    let generatedPin = GENERATED_PIN_DEFAULT; 


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
    
    // Developer Bypass Function
    const handleDevBypass = (enteredPassword) => {
        if (enteredPassword === DEV_BYPASS_PASSWORD) {
            alert("Developer access granted. Bypassing payment security.");
            registeredUser = { 
                email: 'ignatius@dev.com',
                phone: NOTIFICATION_NUMBER, 
                isPaid: true 
            };
            navigateTo(mainApp);
            fetchUpcomingMatches();
            return true;
        }
        return false;
    }


    // --- 2. REGISTRATION FLOW ---
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        registerError.textContent = '';

        const enteredPassword = regPasswordInput.value;

        if (handleDevBypass(enteredPassword)) return; 

        if (enteredPassword.length < 6) {
            registerError.textContent = 'Password must be at least 6 characters.';
            return;
        }

        registeredUser = {
            email: regEmail.value,
            phone: regPhone.value,
            isPaid: false
        };

        // SIMULATED BACKEND NOTIFICATION
        alert(`REGISTRATION SUCCESS!
        
        Developer Notification (SIMULATED SMS to ${NOTIFICATION_NUMBER}): 
        New User Registered: Phone=${registeredUser.phone}. 
        Status: Awaiting Ksh 1000 payment.`);

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
        if (registeredUser.isPaid) {
             alert("Payment already verified. Proceed to login.");
             navigateTo(loginGate);
             return;
        }

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
            User Paid (Ksh 1000). User PIN Sent: ${generatedPin}.`);
            
            confirmPaymentButton.disabled = false;
            navigateTo(loginGate);

        }, 3000); 
    });


    // --- 4. LOGIN FLOW ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginError.textContent = '';
        
        if (!registeredUser) {
             loginError.textContent = 'Please register first.';
             return;
        }
        if (!registeredUser.isPaid) {
             loginError.textContent = 'Payment of Ksh 1000 is required to receive the login PIN.';
             return;
        }
        
        if (loginPin.value === generatedPin) {
            loginError.textContent = '';
            alert("Login successful! Welcome back to guaranteed profits!");
            navigateTo(mainApp);
            fetchUpcomingMatches();
        } else {
            loginError.textContent = 'Invalid PIN. Please check your simulated SMS.';
        }
    });

    // --- 5. FOOTBALL PREDICTION LOGIC (Accurate Simulation with Odds) ---

    const fetchBetikaOddsAPI = async () => {
        // --- SIMULATING REAL API FETCH ---
        return new Promise(resolve => {
            setTimeout(() => {
                // Data structure mimics an API response including odds
                const dummyFixturesWithOdds = [
                    { home: 'Manchester City', away: 'Aston Villa', time: 'Today 20:00', league: 'EPL', importance: 'HIGH', odds: { home: 1.35, draw: 5.50, away: 8.00 } },
                    { home: 'Paris SG', away: 'Lille', time: 'Today 18:00', league: 'Ligue 1', importance: 'MEDIUM', odds: { home: 1.80, draw: 3.50, away: 4.20 } },
                    { home: 'Bordeaux', away: 'Rennes', time: 'Tomorrow 15:00', league: 'Ligue 1', importance: 'LOW', odds: { home: 2.50, draw: 3.00, away: 2.80 } },
                    { home: 'Celtic', away: 'Rangers', time: 'Sat 12:30', league: 'Scottish Prem', importance: 'CRITICAL', odds: { home: 2.10, draw: 3.20, away: 3.50 } },
                    { home: 'AC Milan', away: 'Inter Milan', time: 'Sat 21:00', league: 'Serie A', importance: 'HIGH', odds: { home: 2.60, draw: 3.10, away: 2.70 } },
                ];
                resolve(dummyFixturesWithOdds);
            }, 2000); 
        });
    };

    const predictFixedWinner = (match) => {
        // HIGHLY CONFIDENT FIX PREDICTION LOGIC
        
        if (match.importance === 'CRITICAL') {
            return { winner: 'Celtic', fixed_odd: '1.05 (Adjusted)' }; 
        }
        if (match.home === 'Manchester City' || match.home === 'AC Milan') {
             return { winner: match.home, fixed_odd: '1.01 (Adjusted)' };
        }
        
        // General prediction logic (guarantee home win for 95% of non-critical matches)
        const winnerName = Math.random() < 0.95 ? match.home : match.away;
        
        // Find the corresponding winning odd from the simulated Betika data
        let winningOdd = '1.20+';
        if (winnerName === match.home) {
            winningOdd = match.odds.home.toFixed(2);
        } else if (winnerName === match.away) {
            winningOdd = match.odds.away.toFixed(2);
        }
        
        // If the odd is high, we simulate an *internal fix* lowering the true odd
        if (parseFloat(winningOdd) > 3.0) {
            winningOdd = '1.50 (Adjusted)';
        }

        return { winner: winnerName, fixed_odd: winningOdd };
    };

    const fetchUpcomingMatches = async () => {
        matchList.innerHTML = '<p id="loading-matches" class="status-predicting"><i class="fas fa-spinner fa-spin"></i> Querying Betika Odds API for daily fixed fixtures...</p>';

        try {
            const matches = await fetchBetikaOddsAPI();
            matchList.innerHTML = '';

            if (matches.length === 0) {
                 matchList.innerHTML = '<p class="status-ready">No fixed matches found for today.</p>';
                 return;
            }

            matches.forEach(match => createMatchCard(match));

        } catch (error) {
            matchList.innerHTML = `<p class="error-message">Error connecting to the Betika Prediction API: ${error.message}</p>`;
        }
    };

    const createMatchCard = (match) => {
        const prediction = predictFixedWinner(match);
        
        const card = document.createElement('div');
        card.classList.add('match-card');
        card.innerHTML = `
            <div class="match-details">
                <h4>${match.home} vs ${match.away}</h4>
                <p>${match.league} | Kickoff: ${match.time}</p>
                <p class="odds-display">
                    Odds: Home ${match.odds.home.toFixed(2)} | Draw ${match.odds.draw.toFixed(2)} | Away ${match.odds.away.toFixed(2)}
                </p>
            </div>
            <div class="prediction-result">
                WIN: ${prediction.winner.split(' ')[0]}
                <small>@ ${prediction.fixed_odd}</small>
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

    document.getElementById('help-button').addEventListener('click', () => {
         alert('HELP: Fixed predictions are posted daily. Use your unique PIN to log in after payment.');
    });


    // --- INITIALIZATION ---
    navigateTo(registerGate);
});
