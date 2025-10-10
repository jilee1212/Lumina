// ==============================================
// 전역 설정
// ==============================================
const CONFIG = {
    PASSWORD: 'lumina2025',
    SESSION_KEY: 'lumina_auth',
    SESSION_TIME_KEY: 'lumina_auth_time',
    SESSION_DURATION: 24 * 60 * 60 * 1000 // 24시간
};

// ==============================================
// 초기화
// ==============================================
document.addEventListener('DOMContentLoaded', function() {
    initPasswordProtection();
    initLogout();
    checkSessionExpiry();
});

// ==============================================
// 세션 만료 체크
// ==============================================
function checkSessionExpiry() {
    const authTime = sessionStorage.getItem(CONFIG.SESSION_TIME_KEY);

    if (authTime) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - parseInt(authTime);

        // 세션 만료 체크
        if (elapsedTime > CONFIG.SESSION_DURATION) {
            logout();
            alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        }
    }
}

// ==============================================
// 비밀번호 보호
// ==============================================
function initPasswordProtection() {
    const passwordOverlay = document.getElementById('passwordOverlay');
    const mainContent = document.getElementById('mainContent');
    const passwordInput = document.getElementById('passwordInput');
    const passwordSubmit = document.getElementById('passwordSubmit');
    const passwordError = document.getElementById('passwordError');

    // 요소가 존재하지 않으면 (서브페이지) 인증 체크만 수행
    if (!passwordOverlay || !mainContent) {
        checkAuthentication();
        return;
    }

    // 이미 인증된 경우
    if (isAuthenticated()) {
        showMainContent();
    }

    // 비밀번호 제출 버튼 이벤트
    if (passwordSubmit) {
        passwordSubmit.addEventListener('click', handlePasswordSubmit);
    }

    // Enter 키 이벤트
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handlePasswordSubmit();
            }
        });
    }

    // 비밀번호 제출 핸들러
    function handlePasswordSubmit() {
        const input = passwordInput.value.trim();

        if (input === CONFIG.PASSWORD) {
            // 인증 성공
            sessionStorage.setItem(CONFIG.SESSION_KEY, 'true');
            sessionStorage.setItem(CONFIG.SESSION_TIME_KEY, Date.now().toString());
            showMainContent();
        } else {
            // 인증 실패
            passwordError.classList.add('show');
            passwordInput.value = '';
            passwordInput.focus();

            setTimeout(() => {
                passwordError.classList.remove('show');
            }, 3000);
        }
    }

    // 메인 콘텐츠 표시
    function showMainContent() {
        passwordOverlay.classList.add('hidden');
        mainContent.classList.add('active');
    }
}

// ==============================================
// 인증 상태 체크
// ==============================================
function isAuthenticated() {
    const auth = sessionStorage.getItem(CONFIG.SESSION_KEY);
    const authTime = sessionStorage.getItem(CONFIG.SESSION_TIME_KEY);

    if (!auth || !authTime) {
        return false;
    }

    // 세션 만료 체크
    const currentTime = Date.now();
    const elapsedTime = currentTime - parseInt(authTime);

    if (elapsedTime > CONFIG.SESSION_DURATION) {
        return false;
    }

    return auth === 'true';
}

// ==============================================
// 서브페이지 인증 체크 (리디렉션)
// ==============================================
function checkAuthentication() {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
    }
}

// ==============================================
// 로그아웃
// ==============================================
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

function logout() {
    sessionStorage.removeItem(CONFIG.SESSION_KEY);
    sessionStorage.removeItem(CONFIG.SESSION_TIME_KEY);
    window.location.href = 'index.html';
}

// ==============================================
// 유틸리티: 숫자 포맷
// ==============================================
function formatNumber(num) {
    return new Intl.NumberFormat('ko-KR').format(num);
}

function formatCurrency(num, currency = '$') {
    return currency + formatNumber(num);
}

function formatPercentage(num) {
    return num.toFixed(2) + '%';
}

// ==============================================
// 유틸리티: 애니메이션 카운터
// ==============================================
function animateCounter(element, start, end, duration = 1000) {
    const startTime = Date.now();
    const range = end - start;

    function update() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const current = start + (range * easeOutQuad(progress));
        element.textContent = formatNumber(Math.round(current));

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    update();
}

function easeOutQuad(t) {
    return t * (2 - t);
}

// ==============================================
// 유틸리티: 스크롤 애니메이션
// ==============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.content-card, .dashboard-card, .metric-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 스타일 추가 (visible 클래스)
const style = document.createElement('style');
style.textContent = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ==============================================
// 체크리스트 토글 (deployment.html에서 사용)
// ==============================================
function initChecklistToggle() {
    const checklistItems = document.querySelectorAll('.checklist li');

    checklistItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            this.classList.toggle('checked');
            saveChecklistState();
        });
    });

    loadChecklistState();
}

function saveChecklistState() {
    const checkedItems = [];
    document.querySelectorAll('.checklist li.checked').forEach((item, index) => {
        checkedItems.push(item.textContent);
    });
    localStorage.setItem('checklist_state', JSON.stringify(checkedItems));
}

function loadChecklistState() {
    const savedState = localStorage.getItem('checklist_state');
    if (!savedState) return;

    const checkedItems = JSON.parse(savedState);
    document.querySelectorAll('.checklist li').forEach(item => {
        if (checkedItems.includes(item.textContent)) {
            item.classList.add('checked');
        }
    });
}

// ==============================================
// 테이블 정렬 (옵션)
// ==============================================
function initTableSort() {
    const tables = document.querySelectorAll('table');

    tables.forEach(table => {
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => sortTable(table, index));
        });
    });
}

function sortTable(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll('tr'));
    const isAscending = table.dataset.sortOrder !== 'asc';

    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();

        const aNum = parseFloat(aValue.replace(/[^0-9.-]/g, ''));
        const bNum = parseFloat(bValue.replace(/[^0-9.-]/g, ''));

        if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAscending ? aNum - bNum : bNum - aNum;
        }

        return isAscending
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
    });

    rows.forEach(row => tbody.appendChild(row));
    table.dataset.sortOrder = isAscending ? 'asc' : 'desc';
}

// ==============================================
// 프린트 함수
// ==============================================
function printPage() {
    window.print();
}

// ==============================================
// 다크모드 토글 (옵션)
// ==============================================
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;

    // 저장된 다크모드 설정 로드
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
    });
}

// ==============================================
// 검색 기능 (옵션)
// ==============================================
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.dashboard-card, .content-card');

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// ==============================================
// 툴팁 (옵션)
// ==============================================
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.dataset.tooltip;
        document.body.appendChild(tooltip);

        element.addEventListener('mouseenter', function(e) {
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) + 'px';
            tooltip.style.top = rect.top - 40 + 'px';
            tooltip.classList.add('show');
        });

        element.addEventListener('mouseleave', function() {
            tooltip.classList.remove('show');
        });
    });
}

// 툴팁 스타일
const tooltipStyle = document.createElement('style');
tooltipStyle.textContent = `
    .tooltip {
        position: fixed;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s;
        transform: translateX(-50%);
        white-space: nowrap;
        z-index: 10000;
    }
    .tooltip.show {
        opacity: 1;
    }
`;
document.head.appendChild(tooltipStyle);

// ==============================================
// 복사 기능 (컨트랙트 주소 등)
// ==============================================
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('클립보드에 복사되었습니다!', 'success');
        });
    } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('클립보드에 복사되었습니다!', 'success');
    }
}

// ==============================================
// 알림 표시
// ==============================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 알림 스타일
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.3s ease;
        z-index: 10000;
    }
    .notification.show {
        opacity: 1;
        transform: translateX(0);
    }
    .notification-success {
        background: #48bb78;
    }
    .notification-info {
        background: #4299e1;
    }
    .notification-warning {
        background: #ed8936;
    }
    .notification-danger {
        background: #f56565;
    }
`;
document.head.appendChild(notificationStyle);

// ==============================================
// 페이지별 초기화
// ==============================================
window.addEventListener('load', function() {
    // 스크롤 애니메이션
    if (document.querySelectorAll('.content-card, .dashboard-card').length > 0) {
        initScrollAnimations();
    }

    // 체크리스트 (deployment.html)
    if (document.querySelectorAll('.checklist').length > 0) {
        initChecklistToggle();
    }

    // 테이블 정렬
    if (document.querySelectorAll('table').length > 0) {
        initTableSort();
    }

    // 다크모드
    initDarkMode();

    // 검색
    initSearch();

    // 툴팁
    initTooltips();
});

// ==============================================
// 외부 스크립트용 Export
// ==============================================
window.LuminaUtils = {
    formatNumber,
    formatCurrency,
    formatPercentage,
    animateCounter,
    copyToClipboard,
    showNotification,
    printPage,
    logout,
    isAuthenticated
};
