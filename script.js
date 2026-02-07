// DOM Elements
const form = document.getElementById('leadForm');
const successMessage = document.getElementById('successMessage');
const projectSelect = document.getElementById('project-type');

// Configuration - WhatsApp Number (USER TO REPLACE)
const WHATSAPP_NUMBER = "5587999115437"; // Substitua pelo seu numero real (apenas digitos)

// 1. 3D Tilt Effect - Lightweight Implementation
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.tilt-element');

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Only animate if mouse is over or near element
        if (x > -50 && x < rect.width + 50 && y > -50 && y < rect.height + 50) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg tilt
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        }
    });
});

// 2. Scroll Animations (IntersectionObserver)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');

            // Trigger CountUp if it's a number
            if (entry.target.classList.contains('count-up')) {
                animateValue(entry.target, 0, parseInt(entry.target.dataset.target), 2000);
            }

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.hero__content, .card, .col-half, .section__title').forEach(el => {
    el.style.opacity = "0"; // Start hidden
    observer.observe(el);
});

document.querySelectorAll('.count-up').forEach(el => {
    observer.observe(el);
});

// Helper: Animate Number
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// 3. Form Handling
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        company: document.getElementById('company').value,
        contact: document.getElementById('contact-info').value,
        email: document.getElementById('email').value,
        type: document.getElementById('project-type').value,
        message: document.getElementById('message').value,
        date: new Date().toISOString()
    };


    // Save to LocalStorage (Fallback)
    const leads = JSON.parse(localStorage.getItem('nexus_leads') || '[]');
    leads.push(formData);
    localStorage.setItem('nexus_leads', JSON.stringify(leads));

    // Firebase Save (If configured)
    if (typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined' && firebaseConfig.apiKey !== "SUA_API_KEY_AQUI") {
        try {
            if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
            const db = firebase.firestore();
            db.collection('leads').add(formData)
                .then(() => console.log("Lead saved to Firestore"))
                .catch((error) => console.error("Error adding document: ", error));
        } catch (e) {
            console.error("Firebase init error:", e);
        }
    }

    // Show Success Animation

    form.classList.add('hidden');
    successMessage.classList.remove('hidden');

    // Simulate API Call
    console.log("Lead captured:", formData);

    // Auto-trigger WhatsApp logic
    window.lastLeadData = formData;

    // Small delay to ensure UI updates before opening new tab
    setTimeout(() => {
        openWhatsApp();
    }, 500);
});


// 4. WhatsApp Logic
function openWhatsApp() {
    let message = "Olá! Gostaria de um diagnóstico gratuito para minha empresa.";


    if (window.lastLeadData) {
        const { name, company, type, message: msg, email } = window.lastLeadData;
        message = `Olá! Me chamo ${name}, da empresa ${company}. Quero um diagnóstico gratuito para ${type}. Minha necessidade: ${msg}. Meu email: ${email}.`;
    }

    else {

        const nameVal = document.getElementById('name').value;
        if (nameVal) {
            message = `Olá! Me chamo ${nameVal}. Gostaria de saber mais sobre a Nexus Code.`;
        }
    }

    const encodedMsg = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;
    window.open(url, '_blank');
}



// 5. Preloader Sequence (Minimalist & Fast)
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');

    // Smooth minimalist fade-out
    setTimeout(() => {
        preloader.classList.add('fade-out');
    }, 2000); // 2 seconds display for brand impact
});


let calcState = {
    step: 1,
    basePrice: 0,
    features: [],
    platformName: ''
};

window.toggleCalc = function (show) {
    const modal = document.getElementById('calcModal');
    if (show) {
        modal.classList.remove('hidden');

        setTimeout(() => modal.classList.remove('opacity-0'), 10);
    } else {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

window.selectOption = function (key, value, price, el) {

    el.parentElement.querySelectorAll('.calc-option').forEach(opt => opt.classList.remove('selected'));

    el.classList.add('selected');


    if (key === 'type') {
        calcState.basePrice = price;
        calcState.platformName = el.querySelector('.font-bold').innerText;
    }

    document.getElementById('btnNext').disabled = false;
}

window.toggleFeature = function (price, el) {
    el.classList.toggle('selected');
    const isSelected = el.classList.contains('selected');
    const name = el.querySelector('span').innerText;

    if (isSelected) {
        calcState.features.push({ name, price });
    } else {
        calcState.features = calcState.features.filter(f => f.name !== name);
    }
}

window.nextStep = function () {
    if (calcState.step < 3) {

        document.querySelector(`.step[data-step="${calcState.step}"]`).classList.add('hidden');

        calcState.step++;
        document.querySelector(`.step[data-step="${calcState.step}"]`).classList.remove('hidden');

        document.getElementById('btnPrev').disabled = false;
        if (calcState.step === 3) {
            document.getElementById('btnNext').classList.add('hidden');
            calculateTotal();
        } else {
            document.getElementById('btnNext').disabled = false;
        }
    }
}

window.prevStep = function () {
    if (calcState.step > 1) {
        document.querySelector(`.step[data-step="${calcState.step}"]`).classList.add('hidden');
        calcState.step--;
        document.querySelector(`.step[data-step="${calcState.step}"]`).classList.remove('hidden');

        document.getElementById('btnNext').classList.remove('hidden');
        if (calcState.step === 1) document.getElementById('btnPrev').disabled = true;
    }
}

function calculateTotal() {
    let total = calcState.basePrice;
    calcState.features.forEach(f => total += f.price);

    const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
    const min = total * 0.9;
    const max = total * 1.2;

    const minFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(min);
    const maxFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(max);

    document.getElementById('finalPrice').innerText = `${minFmt} - ${maxFmt}`;
}

window.sendCalcToWhatsApp = function () {
    let msg = `Olá! Fiz uma simulação no site da Nexus Code:%0A%0A`;
    msg += `🚀 *Projeto:* ${calcState.platformName}%0A`;
    if (calcState.features.length > 0) {
        msg += `⚙️ *Funcionalidades:* ${calcState.features.map(f => f.name).join(', ')}%0A`;
    } else {
        msg += `⚙️ *Funcionalidades:* Básico%0A`;
    }
    msg += `💰 *Estimativa:* ${document.getElementById('finalPrice').innerText}%0A%0A`;
    msg += `Gostaria de validar esse valor e agendar uma reunião.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}


// --- CHAT WIDGET LOGIC ---

// --- CHAT WIDGET LOGIC ---
let chatOpen = false;

window.toggleChat = function () {
    chatOpen = !chatOpen;
    const bubble = document.getElementById('chatWidgetBubble');
    const btn = document.getElementById('chatToggleBtn');

    // Safely toggling classes instead of modifying style directly
    btn.classList.toggle('open');

    if (chatOpen) {
        bubble.classList.add('open');
    } else {
        bubble.classList.remove('open');
    }
}

window.closeChat = function () {
    chatOpen = false;
    const bubble = document.getElementById('chatWidgetBubble');
    const btn = document.getElementById('chatToggleBtn');

    bubble.classList.remove('open');
    btn.classList.remove('open');
}



window.addEventListener('load', () => {
    // Auto Open Chat after 5s
    setTimeout(() => {
        if (!chatOpen) {
            toggleChat();
        }
    }, 5000);

    // Typing Effect Simulation
    const originalText = "Olá! Posso gerar uma estimativa rápida para seu projeto?";
    const chatTextEl = document.getElementById('chatText');

    if (chatTextEl) {
        chatTextEl.textContent = "...";

        setTimeout(() => {
            let i = 0;
            chatTextEl.textContent = "";
            function type() {
                if (i < originalText.length) {
                    chatTextEl.textContent += originalText.charAt(i);
                    i++;
                    setTimeout(type, 30);
                } else {

                    document.getElementById('chatOptions').classList.remove('hidden');
                }
            }
            type();
        }, 5500);
    }
});

// 6. Particle System (The Nexus)
const particleCanvas = document.getElementById('heroParticles');
if (particleCanvas) {
    const pCtx = particleCanvas.getContext('2d');
    let pWidth, pHeight;
    let particles = [];

    function resizeParticles() {
        pWidth = particleCanvas.width = window.innerWidth;
        pHeight = particleCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeParticles);
    resizeParticles();

    class Particle {
        constructor() {
            this.x = Math.random() * pWidth;
            this.y = Math.random() * pHeight;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > pWidth) this.vx *= -1;
            if (this.y < 0 || this.y > pHeight) this.vy *= -1;
        }
        draw() {
            pCtx.fillStyle = "rgba(124, 58, 237, 0.5)"; // Purple
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            pCtx.fill();
        }
    }

    for (let i = 0; i < 40; i++) particles.push(new Particle());

    function animateParticles() {
        pCtx.clearRect(0, 0, pWidth, pHeight);

        particles.forEach((p, i) => {
            p.update();
            p.draw();

            // Connect
            particles.slice(i + 1).forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    pCtx.strokeStyle = `rgba(124, 58, 237, ${0.2 - dist / 1500})`;
                    pCtx.beginPath();
                    pCtx.moveTo(p.x, p.y);
                    pCtx.lineTo(p2.x, p2.y);
                    pCtx.stroke();
                }
            });
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// 7. FAQ Toggle
window.toggleFAQ = function (item) {
    item.classList.toggle('active');
}

window.sendToWhatsAppDirect = function () {
    openWhatsApp();
}
// --- ULTIMATE UPGRADE LOGIC ---

// 8. Custom Cursor Logic
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay (animation in CSS)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

// 9. Scroll Progress & Timeline Activation
const scrollProgress = document.getElementById('scrollProgress');
const timelineItems = document.querySelectorAll('.timeline-item');

window.addEventListener('scroll', () => {
    // Scroll Progress
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (scrollProgress) {
        scrollProgress.style.width = `${progress}%`;
    }

    // Scroll Reveal
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
            reveal.classList.add('active');
        }
    });

    // Timeline Line Drawing Effect
    // (Optional enhancement: animate the line height based on scroll)
});

// 10. Matrix Mode (Easter Egg - Konami Code)
const matrixCanvas = document.getElementById('matrixCanvas');
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
let matrixInterval;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateMatrixMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateMatrixMode() {
    if (!matrixCanvas) return;


    // Toggle
    if (matrixCanvas.classList.contains('active-matrix')) {
        matrixCanvas.style.opacity = '0';
        matrixCanvas.classList.remove('active-matrix');
        clearInterval(matrixInterval);
        showToast("Matrix Mode: DEACTIVATED");
        return;
    }

    showToast("🐰 EASTER EGG FOUND: Matrix Mode ACTIVATED!");
    matrixCanvas.style.opacity = '0.1'; // Subtle overlay
    matrixCanvas.classList.add('active-matrix');

    const ctx = matrixCanvas.getContext('2d');
    let width = matrixCanvas.width = window.innerWidth;
    let height = matrixCanvas.height = window.innerHeight;

    const cols = Math.floor(width / 20);
    const ypos = Array(cols).fill(0);

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    function matrix() {
        ctx.fillStyle = '#0001'; // Fade effect
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#0f0';
        ctx.font = '15pt monospace';

        ypos.forEach((y, ind) => {
            const text = String.fromCharCode(Math.random() * 128);
            const x = ind * 20;
            ctx.fillText(text, x, y);
            if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
            else ypos[ind] = y + 20;
        });
    }

    matrixInterval = setInterval(matrix, 50);
}

// 11. Custom Toast Logic
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = "toast show";

    setTimeout(function () {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}

// Global scope for HTML access
window.showToast = showToast;

// 12. Exit Intent Modal Logic
let exitIntentTriggered = false;
window.closeExitModal = function () {
    document.getElementById('exitModal').classList.add('hidden');
    document.getElementById('exitModal').classList.remove('active');
    // Save state so we don't annoy user again in this session
    sessionStorage.setItem('nexus_exit_shown', 'true');
}

document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 0 && !exitIntentTriggered && !sessionStorage.getItem('nexus_exit_shown')) {
        document.getElementById('exitModal').classList.remove('hidden');
        // Small delay for animation
        setTimeout(() => document.getElementById('exitModal').classList.add('active'), 10);
        exitIntentTriggered = true;
    }
});

// 13. Dynamic Title (Tab Blur)
const pageTitle = document.title;
const blurTitle = "😭 Volte para a Nexus!";
let titleInterval;

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = blurTitle;
    } else {
        document.title = pageTitle;
    }
});

// 14. Global Ripple Effect
document.addEventListener('click', function (e) {
    // Only apply to buttons or cards
    if (!e.target.closest('.btn') && !e.target.closest('.card') && !e.target.closest('.nav-link')) return;

    const target = e.target.closest('.btn') || e.target.closest('.card') || e.target.closest('.nav-link');

    // Create Ripple
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    // Add custom style for ripple in JS to avoid CSS dependency if missing
    ripple.style.position = 'absolute';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';

    // Ensure target is relative
    const style = window.getComputedStyle(target);
    if (style.position === 'static') {
        target.style.position = 'relative';
        target.style.overflow = 'hidden';
    }

    target.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
});

// Inject Ripple Keyframes dynamically if not present
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);
