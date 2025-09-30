/* ============================================
   LUMINA DEX - Common JavaScript v2.0
   Budget: $200K | Luca Casino Integrated
   ============================================ */

// ============================================
// 1. UTILITY FUNCTIONS
// ============================================

/**
 * Format number with commas (1000 -> 1,000)
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Format currency ($1000 -> $1,000)
 */
function formatCurrency(amount, currency = '$') {
    return currency + formatNumber(Math.round(amount));
}

/**
 * Format percentage (0.15 -> 15%)
 */
function formatPercentage(decimal, decimals = 0) {
    return (decimal * 100).toFixed(decimals) + '%';
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Toggle element visibility
 */
function toggleVisibility(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.toggle('hidden');
    }
}

// ============================================
// 2. LUCA CASINO CALCULATORS
// ============================================

/**
 * Calculate Luca Casino rewards and returns
 */
class LucaCasinoCalculator {
    constructor(stakedAmount, lockPeriod) {
        this.stakedAmount = stakedAmount;
        this.lockPeriod = lockPeriod; // in months
        this.lucaReceived = stakedAmount; // 1:1 ratio
        this.houseEdge = 0.05; // 5%
    }

    /**
     * Calculate APY based on lock period
     */
    getAPY() {
        const apyMap = {
            24: 0.30, // 30%
            36: 0.40, // 40%
            48: 0.50  // 50%
        };
        return apyMap[this.lockPeriod] || 0.30;
    }

    /**
     * Calculate total LUMINA rewards from staking
     */
    getStakingRewards() {
        const apy = this.getAPY();
        const years = this.lockPeriod / 12;
        return this.stakedAmount * apy * years;
    }

    /**
     * Calculate return based on Luca usage percentage
     */
    calculateReturn(lucaUsagePercent) {
        const lucaUsed = this.lucaReceived * lucaUsagePercent;
        const lucaRemaining = this.lucaReceived - lucaUsed;
        const luminaFromLuca = lucaRemaining; // 1:1 conversion
        const stakingRewards = this.getStakingRewards();

        return {
            initialStake: this.stakedAmount,
            lucaReceived: this.lucaReceived,
            lucaUsed: lucaUsed,
            lucaRemaining: lucaRemaining,
            luminaFromLuca: luminaFromLuca,
            stakingRewards: stakingRewards,
            totalReturn: luminaFromLuca + stakingRewards,
            netProfit: (luminaFromLuca + stakingRewards) - this.stakedAmount,
            profitPercent: ((luminaFromLuca + stakingRewards - this.stakedAmount) / this.stakedAmount)
        };
    }

    /**
     * Calculate break-even point
     */
    getBreakEvenUsage() {
        const stakingRewards = this.getStakingRewards();
        // Break-even when: (1-usage)*staked + rewards = staked
        // Solving: usage = rewards / staked
        return Math.min(stakingRewards / this.stakedAmount, 1.0);
    }
}

/**
 * Calculate expected casino revenue
 */
function calculateCasinoRevenue(totalBetsVolume, houseEdge = 0.05) {
    const grossRevenue = totalBetsVolume * houseEdge;
    const operatingCost = grossRevenue * 0.20; // 20% operational costs
    const netRevenue = grossRevenue - operatingCost;

    return {
        totalBetsVolume: totalBetsVolume,
        houseEdge: houseEdge,
        grossRevenue: grossRevenue,
        operatingCost: operatingCost,
        netRevenue: netRevenue,
        profitMargin: netRevenue / totalBetsVolume
    };
}

// ============================================
// 3. STAKING CALCULATORS
// ============================================

/**
 * Calculate Lock Staking returns
 */
function calculateLockStaking(amount, months) {
    const apyMap = {
        24: 0.30, // 30%
        36: 0.40, // 40%
        48: 0.50  // 50%
    };

    const apy = apyMap[months] || 0.30;
    const years = months / 12;
    const rewards = amount * apy * years;
    const total = amount + rewards;

    return {
        principal: amount,
        period: months,
        apy: apy,
        rewards: rewards,
        total: total,
        lucaReceived: amount // 1:1 Luca tokens
    };
}

/**
 * Calculate Flexible Staking returns
 */
function calculateFlexibleStaking(amount, days) {
    const rewardPerBlock = 0.01; // LUMINA
    const blocksPerDay = 28800; // BSC: ~3 sec/block
    const dailyReward = rewardPerBlock * blocksPerDay;
    const totalReward = (dailyReward / 1000000) * amount * days; // Assuming 1M pool

    return {
        principal: amount,
        days: days,
        estimatedReward: totalReward,
        total: amount + totalReward,
        apr: (totalReward / amount) * (365 / days)
    };
}

/**
 * Calculate Farming returns
 */
function calculateFarming(lpAmount, days, apr = 0.50) {
    const dailyRate = apr / 365;
    const rewards = lpAmount * dailyRate * days;
    const total = lpAmount + rewards;

    return {
        lpAmount: lpAmount,
        days: days,
        apr: apr,
        dailyRewards: lpAmount * dailyRate,
        totalRewards: rewards,
        total: total
    };
}

// ============================================
// 4. REVENUE PROJECTIONS
// ============================================

/**
 * Calculate total platform revenue
 */
function calculatePlatformRevenue(scenario = 'realistic') {
    const scenarios = {
        conservative: {
            lucaCasino: 100000,    // $100K
            launchpad: 30000,      // $30K
            dexFees: 20000         // $20K
        },
        realistic: {
            lucaCasino: 400000,    // $400K
            launchpad: 100000,     // $100K
            dexFees: 50000         // $50K
        },
        optimistic: {
            lucaCasino: 800000,    // $800K
            launchpad: 200000,     // $200K
            dexFees: 100000        // $100K
        }
    };

    const revenue = scenarios[scenario];
    const total = revenue.lucaCasino + revenue.launchpad + revenue.dexFees;

    return {
        lucaCasino: revenue.lucaCasino,
        lucaPercent: revenue.lucaCasino / total,
        launchpad: revenue.launchpad,
        launchpadPercent: revenue.launchpad / total,
        dexFees: revenue.dexFees,
        dexPercent: revenue.dexFees / total,
        total: total
    };
}

/**
 * Calculate break-even analysis
 */
function calculateBreakEven(initialInvestment = 200000) {
    return {
        investment: initialInvestment,
        conservativeMonths: Math.ceil(initialInvestment / (150000 / 12)), // 8개월
        realisticMonths: Math.ceil(initialInvestment / (550000 / 12)),     // 4-5개월
        optimisticMonths: Math.ceil(initialInvestment / (1100000 / 12))    // 2-3개월
    };
}

// ============================================
// 5. TOKEN ECONOMICS
// ============================================

/**
 * Calculate token circulation
 */
function calculateTokenCirculation(months) {
    const totalSupply = 1000000000; // 1B
    const initialCirculation = 45000000; // 45M (4.5%)

    // Monthly emission estimates
    const monthlyStakingRewards = 5000000; // ~0.5% per month
    const monthlyFarmingRewards = 3000000; // ~0.3% per month

    const additionalTokens = (monthlyStakingRewards + monthlyFarmingRewards) * months;
    const totalCirculation = Math.min(initialCirculation + additionalTokens, totalSupply);
    const circulationPercent = totalCirculation / totalSupply;

    return {
        totalSupply: totalSupply,
        initialCirculation: initialCirculation,
        currentCirculation: totalCirculation,
        circulationPercent: circulationPercent,
        remainingSupply: totalSupply - totalCirculation
    };
}

/**
 * Calculate token burn from Luca Casino
 */
function calculateTokenBurn(casinoVolume, avgLucaUsage = 0.30) {
    // Luca used in casino = burned tokens (returned to Treasury)
    const totalLucaInCirculation = casinoVolume * 0.1; // 10% of volume as Luca
    const lucaBurned = totalLucaInCirculation * avgLucaUsage;

    return {
        totalLuca: totalLucaInCirculation,
        lucaBurned: lucaBurned,
        burnRate: avgLucaUsage,
        deflationaryEffect: lucaBurned / 1000000000 // % of total supply
    };
}

// ============================================
// 6. INTERACTIVE ELEMENTS
// ============================================

/**
 * Toggle section visibility
 */
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.toggle('hidden');
    }
}

/**
 * Print current page
 */
function printPage() {
    window.print();
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('클립보드에 복사되었습니다!');
    }).catch(err => {
        console.error('복사 실패:', err);
    });
}

/**
 * Generate shareable link
 */
function generateShareLink() {
    const url = window.location.href;
    copyToClipboard(url);
}

// ============================================
// 7. INTERACTIVE CALCULATORS (DOM)
// ============================================

/**
 * Initialize Luca Casino calculator in DOM
 */
function initLucaCasinoCalculator() {
    const container = document.getElementById('luca-calculator');
    if (!container) return;

    container.innerHTML = `
        <div class="card" style="background: rgba(255,255,255,0.95); color: #000;">
            <h3 style="color: #000;">🎰 Luca Casino 수익 계산기</h3>
            <div style="margin: 20px 0;">
                <label style="color: #000;">Lock Staking 금액 (LUMINA):</label>
                <input type="number" id="luca-stake-amount" value="10000" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; color: #000;">

                <label style="color: #000;">Lock 기간:</label>
                <select id="luca-lock-period" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; color: #000;">
                    <option value="24">24개월 (30% APY)</option>
                    <option value="36">36개월 (40% APY)</option>
                    <option value="48" selected>48개월 (50% APY)</option>
                </select>

                <label style="color: #000;">Luca 사용 비율:</label>
                <input type="range" id="luca-usage" min="0" max="100" value="30" style="width: 100%; margin: 10px 0;">
                <div id="luca-usage-display" style="text-align: center; font-weight: bold; color: #667eea;">30%</div>

                <button onclick="calculateLucaReturn()" class="btn btn-luca" style="width: 100%; margin-top: 20px;">계산하기</button>
            </div>
            <div id="luca-result" style="display: none; margin-top: 20px; padding: 20px; background: #f8f9ff; border-radius: 10px; color: #000;"></div>
        </div>
    `;

    // Add event listener for slider
    const slider = document.getElementById('luca-usage');
    const display = document.getElementById('luca-usage-display');
    slider.addEventListener('input', (e) => {
        display.textContent = e.target.value + '%';
    });
}

/**
 * Calculate and display Luca Casino return
 */
function calculateLucaReturn() {
    const stakeAmount = parseFloat(document.getElementById('luca-stake-amount').value);
    const lockPeriod = parseInt(document.getElementById('luca-lock-period').value);
    const lucaUsage = parseFloat(document.getElementById('luca-usage').value) / 100;

    const calculator = new LucaCasinoCalculator(stakeAmount, lockPeriod);
    const result = calculator.calculateReturn(lucaUsage);
    const breakEven = calculator.getBreakEvenUsage();

    const resultDiv = document.getElementById('luca-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h4 style="color: #667eea; margin-bottom: 15px;">📊 수익 분석 결과</h4>
        <table style="width: 100%; border-collapse: collapse; color: #000;">
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; color: #000;"><strong>최초 스테이킹:</strong></td>
                <td style="padding: 10px; text-align: right; color: #000;">${formatNumber(result.initialStake)} LUMINA</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; color: #000;"><strong>받은 Luca:</strong></td>
                <td style="padding: 10px; text-align: right; color: #000;">${formatNumber(result.lucaReceived)} LUCA</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; color: #000;"><strong>사용한 Luca:</strong></td>
                <td style="padding: 10px; text-align: right; color: #f44336;">${formatNumber(result.lucaUsed)} LUCA</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; color: #000;"><strong>남은 Luca:</strong></td>
                <td style="padding: 10px; text-align: right; color: #4CAF50;">${formatNumber(result.lucaRemaining)} LUCA</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; color: #000;"><strong>Luca → LUMINA:</strong></td>
                <td style="padding: 10px; text-align: right; color: #000;">${formatNumber(result.luminaFromLuca)} LUMINA</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; color: #000;"><strong>Staking 보상:</strong></td>
                <td style="padding: 10px; text-align: right; color: #4CAF50;">${formatNumber(result.stakingRewards)} LUMINA</td>
            </tr>
            <tr style="background: #e8f5e9;">
                <td style="padding: 15px; color: #000;"><strong>총 수령:</strong></td>
                <td style="padding: 15px; text-align: right; font-size: 1.2em; font-weight: bold; color: #4CAF50;">${formatNumber(result.totalReturn)} LUMINA</td>
            </tr>
            <tr style="background: ${result.netProfit >= 0 ? '#e8f5e9' : '#ffebee'};">
                <td style="padding: 15px; color: #000;"><strong>순이익:</strong></td>
                <td style="padding: 15px; text-align: right; font-size: 1.2em; font-weight: bold; color: ${result.netProfit >= 0 ? '#4CAF50' : '#f44336'};">${result.netProfit >= 0 ? '+' : ''}${formatNumber(result.netProfit)} LUMINA (${formatPercentage(result.profitPercent, 1)})</td>
            </tr>
        </table>
        <div style="margin-top: 20px; padding: 15px; background: #fff3e0; border-radius: 8px; border-left: 4px solid #FF9800; color: #000;">
            <strong>💡 손익분기점:</strong> Luca ${formatPercentage(breakEven, 1)} 이상 사용 시 손실 발생<br>
            <small>현재 사용률 ${formatPercentage(lucaUsage, 0)}는 ${lucaUsage <= breakEven ? '안전' : '위험'} 구간입니다.</small>
        </div>
    `;
}

// ============================================
// 8. DATA VISUALIZATION HELPERS
// ============================================

/**
 * Create simple text-based progress bar
 */
function createProgressBar(percent, label = '') {
    const filled = Math.round(percent / 5); // 20 blocks total
    const empty = 20 - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    return `${label} [${bar}] ${Math.round(percent)}%`;
}

/**
 * Create comparison chart (text-based)
 */
function createComparisonChart(data) {
    let chart = '\n';
    const maxValue = Math.max(...data.map(d => d.value));

    data.forEach(item => {
        const barLength = Math.round((item.value / maxValue) * 50);
        const bar = '█'.repeat(barLength);
        chart += `${item.label.padEnd(20)} ${bar} ${formatCurrency(item.value)}\n`;
    });

    return chart;
}

// ============================================
// 9. PAGE INITIALIZATION
// ============================================

/**
 * Initialize page on load
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize calculators if present
    initLucaCasinoCalculator();

    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Add fade-in animation to sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Add current date to footer
    const footer = document.querySelector('.footer');
    if (footer) {
        const today = new Date().toLocaleDateString('ko-KR');
        footer.innerHTML += `<br><small>페이지 생성일: ${today}</small>`;
    }

    console.log('🚀 LUMINA DEX v2.0 Initialized');
    console.log('💰 Budget: $200K');
    console.log('🎰 Luca Casino: Active');
});

// ============================================
// 10. EXPORT FUNCTIONS
// ============================================

// Make key functions available globally
window.LuminaDEX = {
    // Calculators
    LucaCasinoCalculator,
    calculateLockStaking,
    calculateFlexibleStaking,
    calculateFarming,
    calculateCasinoRevenue,
    calculatePlatformRevenue,
    calculateBreakEven,
    calculateTokenCirculation,
    calculateTokenBurn,

    // Utilities
    formatNumber,
    formatCurrency,
    formatPercentage,
    smoothScrollTo,
    toggleVisibility,
    copyToClipboard,
    printPage,

    // Interactive
    calculateLucaReturn,
    initLucaCasinoCalculator,

    // Visualization
    createProgressBar,
    createComparisonChart
};

console.log('✅ LUMINA DEX JavaScript Library Loaded');
