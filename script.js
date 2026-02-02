// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
    });
}

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');

function handleReveal() {
    const trigger = window.innerHeight * 0.85;

    reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < trigger) {
            el.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', handleReveal);
window.addEventListener('load', handleReveal);