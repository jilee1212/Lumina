let currentLang = 'en'; // Default language is English
let isDarkMode = false; // Default theme is white (light)

// Calculate staking rewards
function calculateStaking() {
    const stakingAmountInput = document.getElementById('staking-amount');
    const stakingPeriodSelect = document.getElementById('staking-period');
    const stakingResultP = document.getElementById('staking-result');

    const amount = parseFloat(stakingAmountInput.value) || 10000;
    const apyPercentage = parseFloat(stakingPeriodSelect.value);
    
    const reward = amount * (apyPercentage / 100);
    
    stakingResultP.textContent = `${reward.toLocaleString()} $LMN`;
}

// Set language for all elements
function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (textData[currentLang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = textData[currentLang][key];
            } else if (element.tagName === 'OPTION') {
                element.textContent = textData[currentLang][key];
            } else {
                element.textContent = textData[currentLang][key];
            }
        }
    });
    // Special handling for staking period options as their values are numerical
    const stakingPeriodSelect = document.getElementById('staking-period');
    const optionsData = [
        { value: "36", en: "30 Days (APY 36%)", ko: "30일 (APY 36%)" },
        { value: "42", en: "90 Days (APY 42%)", ko: "90일 (APY 42%)" },
        { value: "50", en: "180 Days (APY 50%)", ko: "180일 (APY 50%)" }
    ];
    stakingPeriodSelect.innerHTML = optionsData.map(opt => 
        `<option value="${opt.value}" ${opt.value === "50" ? "selected" : ""}>${textData[currentLang][`period${opt.value === "36" ? "30" : (opt.value === "42" ? "90" : "180")}`]}</option>`
    ).join('');
    calculateStaking(); // Recalculate and display profit with updated language
}

// Toggle between light and dark theme
function toggleTheme() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.body.classList.remove('light');
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
    }
    // Update Chart.js colors for dark mode if it exists
    if (window.tokenDistributionChart) {
        window.tokenDistributionChart.data.datasets[0].backgroundColor = isDarkMode ? [
            'rgba(99, 179, 237, 0.8)', // Lighter blue
            'rgba(236, 201, 75, 0.8)', // Lighter gold
            'rgba(144, 238, 144, 0.8)', // Light green
            'rgba(255, 255, 102, 0.8)', // Light yellow
            'rgba(128, 240, 215, 0.8)', // Lighter teal
            'rgba(210, 105, 30, 0.8)'  // Brownish orange
        ] : [
            'rgba(74, 144, 226, 0.8)',
            'rgba(245, 166, 35, 0.8)',
            'rgba(126, 211, 33, 0.8)',
            'rgba(248, 231, 28, 0.8)',
            'rgba(80, 227, 194, 0.8)',
            'rgba(189, 16, 224, 0.8)'
        ];
        window.tokenDistributionChart.update();
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize theme
    const theme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark', theme === 'dark');
    updateThemeButton();

    // Initialize language
    const language = localStorage.getItem('language') || 'en';
    updateLanguage(language);
    updateLanguageButton();

    // Initialize mobile menu
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            mobileMenu.classList.add('hidden'); // Close menu on link click
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Language Toggle
    document.getElementById('language-toggle').addEventListener('click', () => {
        setLanguage(currentLang === 'en' ? 'ko' : 'en');
    });
    document.getElementById('language-toggle-mobile').addEventListener('click', () => {
        setLanguage(currentLang === 'en' ? 'ko' : 'en');
    });

    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('theme-toggle-mobile').addEventListener('click', toggleTheme);

    // Tokenomics Donut Chart
    const ctx = document.getElementById('tokenDistributionChart').getContext('2d');
    window.tokenDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Staking Rewards', 'Ecosystem Growth Fund', 'Team & Advisors', 'Initial Liquidity Provision', 'Public/Private Sale', 'Airdrop/Events'],
            datasets: [{
                label: '$LMN Distribution',
                data: [40, 20, 15, 10, 10, 5],
                backgroundColor: [
                    'rgba(74, 144, 226, 0.8)',
                    'rgba(245, 166, 35, 0.8)',
                    'rgba(126, 211, 33, 0.8)',
                    'rgba(248, 231, 28, 0.8)',
                    'rgba(80, 227, 194, 0.8)',
                    'rgba(189, 16, 224, 0.8)'
                ],
                borderColor: [
                    'rgba(74, 144, 226, 1)',
                    'rgba(245, 166, 35, 1)',
                    'rgba(126, 211, 33, 1)',
                    'rgba(248, 231, 28, 1)',
                    'rgba(80, 227, 194, 1)',
                    'rgba(189, 16, 224, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: isDarkMode ? '#e2e8f0' : '#212529'
                    }
                },
                title: {
                    display: true,
                    text: '$LMN Token Distribution (Total 1 Billion)',
                    font: {
                        size: 18
                    },
                    color: isDarkMode ? '#e2e8f0' : '#212529'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed + '%';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });

    // Ecosystem Tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;

            tabButtons.forEach(btn => {
                btn.classList.remove('bg-[#4A90E2]', 'text-white');
                btn.classList.remove('dark:bg-[#63b3ed]', 'dark:text-white');
            });
            button.classList.add('bg-[#4A90E2]', 'text-white');
            button.classList.add('dark:bg-[#63b3ed]', 'dark:text-white');

            tabContents.forEach(content => {
                if (content.id === `${tab}-content`) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });

    // Staking Calculator - Event listeners
    const stakingAmountInput = document.getElementById('staking-amount');
    const stakingPeriodSelect = document.getElementById('staking-period');
    stakingAmountInput.addEventListener('input', calculateStaking);
    stakingPeriodSelect.addEventListener('change', calculateStaking);
    calculateStaking(); // Initial calculation

    // Roadmap interaction
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('click', () => {
            const details = item.querySelector('.timeline-details');
            details.classList.toggle('hidden');
        });
    });

    // Gemini API Integration: DeFi Concept Explainer
    const defiTermInput = document.getElementById('defi-term-input');
    const explainDefiButton = document.getElementById('explain-defi-button');
    const defiExplanationOutput = document.getElementById('defi-explanation-output');
    const defiErrorMessage = document.getElementById('defi-error-message');
    const explainDefiSpinner = document.getElementById('explain-defi-spinner');

    explainDefiButton.addEventListener('click', async () => {
        const term = defiTermInput.value.trim();
        if (!term) {
            defiExplanationOutput.textContent = textData[currentLang].defiExplainerPrompt;
            defiErrorMessage.classList.add('hidden');
            return;
        }

        defiExplanationOutput.textContent = ''; 
        defiErrorMessage.classList.add('hidden'); 
        explainDefiSpinner.classList.remove('hidden'); 
        explainDefiButton.disabled = true; 

        try {
            let chatHistory = [];
            const prompt = `Explain "${term}" in simple terms, focusing on its relevance in a decentralized finance (DeFi) ecosystem, specifically mentioning how it might relate to a project like Lumina ($LMN) if applicable. Keep the explanation concise and easy for a beginner to understand. Respond in ${currentLang === 'en' ? 'English' : 'Korean'}.`;
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiKey = ""; // Add your Gemini API key here
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                defiExplanationOutput.textContent = text;
            } else {
                defiExplanationOutput.textContent = textData[currentLang].defiExplanationFailed;
                defiErrorMessage.classList.remove('hidden');
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            defiExplanationOutput.textContent = textData[currentLang].defiNetworkError;
            defiErrorMessage.classList.remove('hidden');
        } finally {
            explainDefiSpinner.classList.add('hidden'); 
            explainDefiButton.disabled = false; 
        }
    });

    // Particle Animation
    const particleContainer = document.getElementById('particle-container');
    const numParticles = 30;

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        const startX = Math.random() * particleContainer.offsetWidth;
        const startY = Math.random() * particleContainer.offsetHeight;
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;

        const duration = Math.random() * 10 + 5;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${-Math.random() * duration}s`;

        particleContainer.appendChild(particle);

        const dx = (Math.random() - 0.5) * 200;
        const dy = (Math.random() - 0.5) * 200;
        const dz = (Math.random() - 0.5) * 100;

        particle.animate([
            { transform: `translate3d(0px, 0px, 0px)` },
            { transform: `translate3d(${dx}px, ${dy}px, ${dz}px)` }
        ], {
            duration: duration * 1000,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out'
        });
    }

    for (let i = 0; i < numParticles; i++) {
        createParticle();
    }
});

// Theme toggle functionality
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeButton();
}

function updateThemeButton() {
    const isDark = document.body.classList.contains('dark');
    const themeButtons = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
    themeButtons.forEach(button => {
        button.innerHTML = isDark ? 
            '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>' :
            '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>';
    });
}

// Language toggle functionality
function toggleLanguage() {
    const currentLang = localStorage.getItem('language') || 'en';
    const newLang = currentLang === 'en' ? 'ko' : 'en';
    updateLanguage(newLang);
    localStorage.setItem('language', newLang);
    updateLanguageButton();
}

function updateLanguage(lang) {
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
}

function updateLanguageButton() {
    const currentLang = localStorage.getItem('language') || 'en';
    const langButtons = document.querySelectorAll('#language-toggle, #language-toggle-mobile');
    langButtons.forEach(button => {
        button.textContent = currentLang.toUpperCase();
    });
}

// Add event listeners for theme and language toggles
document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
document.getElementById('theme-toggle-mobile')?.addEventListener('click', toggleTheme);
document.getElementById('language-toggle')?.addEventListener('click', toggleLanguage);
document.getElementById('language-toggle-mobile')?.addEventListener('click', toggleLanguage); 
