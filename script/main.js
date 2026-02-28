window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1200);
});

setTimeout(() => {
    document.body.classList.add('loaded');
}, 3500);

const apiURL = "/api/send"; 

try {
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
            smoothTouch: false,
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }
} catch (e) {}

try {
    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 1000 } },
                color: { value: ["#00e5ff", "#ff3366", "#ffcc00"] },
                shape: { type: "circle" },
                opacity: { value: 0.3, random: true },
                size: { value: 2.5, random: true },
                line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.05, width: 1 },
                move: { enable: true, speed: 1, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
                modes: { grab: { distance: 140, line_linked: { opacity: 0.2 } } }
            },
            retina_detect: true
        });
    }
} catch (e) {}

document.addEventListener("DOMContentLoaded", () => {
    let currentLang = 'pt';
    const langToggle = document.getElementById('langToggle');
    
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'pt' ? 'en' : 'pt';
            document.querySelectorAll('[data-pt][data-en]').forEach(el => {
                const newText = el.getAttribute(`data-${currentLang}`);
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = newText;
                } else {
                    el.innerHTML = newText;
                }
                if (el.classList.contains('bounce-hover')) {
                    el.setAttribute('data-text', el.innerText);
                }
            });
        });
    }

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    document.querySelectorAll(".bounce-hover").forEach(link => {
        link.addEventListener("mouseenter", event => {
            let iterations = 0;
            const target = event.target;
            const originalText = target.getAttribute('data-text') || target.innerText;
            clearInterval(target.interval);
            target.interval = setInterval(() => {
                target.innerText = originalText.split("")
                    .map((letter, index) => {
                        if(index < iterations) return originalText[index];
                        return letters[Math.floor(Math.random() * 26)];
                    }).join("");
                if(iterations >= originalText.length) clearInterval(target.interval);
                iterations += 1 / 3;
            }, 30);
        });
    });

    const robloxCursor = document.getElementById("roblox-cursor");
    const cursorParticlesContainer = document.getElementById("cursor-particles");
    let lastParticleTime = 0;

    if (window.matchMedia("(pointer: fine)").matches && typeof gsap !== 'undefined') {
        gsap.set(robloxCursor, { xPercent: -50, yPercent: -50, opacity: 1 });
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        
        window.addEventListener("mousemove", (e) => { 
            mouseX = e.clientX; 
            mouseY = e.clientY; 
            const x = (window.innerWidth / 2 - e.pageX) / 40;
            const y = (window.innerHeight / 2 - e.pageY) / 40;
            gsap.to(".grid-overlay", { x: x, y: y, duration: 1.5, ease: "power2.out" });
            gsap.to(".floating-shape", { x: -x * 1.5, y: -y * 1.5, duration: 2, ease: "power2.out", stagger: 0.05 });

            const now = Date.now();
            if (now - lastParticleTime > 50) {
                createRobloxParticle(mouseX, mouseY);
                lastParticleTime = now;
            }
        });
        
        gsap.ticker.add(() => {
            gsap.to(robloxCursor, { x: mouseX, y: mouseY, duration: 0.05, ease: "power2.out" });
        });

        function createRobloxParticle(x, y) {
            if (!cursorParticlesContainer) return;
            const p = document.createElement('div');
            p.classList.add('roblox-particle');
            cursorParticlesContainer.appendChild(p);
            gsap.set(p, { x: x, y: y, scale: Math.random() * 0.4 + 0.6, rotation: Math.random() * 360 });
            gsap.to(p, {
                y: y + 80 + Math.random() * 40,
                x: x + (Math.random() - 0.5) * 50,
                opacity: 0,
                scale: 0,
                duration: 0.6 + Math.random() * 0.4,
                onComplete: () => p.remove()
            });
        }
        
        const interactiveElements = document.querySelectorAll('a, button, .magnetic-item, input, textarea, .game-card, .media-slide, .grid-block');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    if (window.matchMedia("(pointer: fine)").matches && window.innerWidth > 900 && typeof gsap !== 'undefined') {
        const magneticWraps = document.querySelectorAll('.magnetic-wrap');
        magneticWraps.forEach(wrap => {
            const item = wrap.querySelector('.magnetic-item');
            wrap.addEventListener('mousemove', (e) => {
                const rect = wrap.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const moveX = (e.clientX - centerX) / 4;
                const moveY = (e.clientY - centerY) / 4;
                gsap.to(item, { x: moveX, y: moveY, duration: 0.4, ease: "power2.out" });
            });
            wrap.addEventListener('mouseleave', () => {
                gsap.to(item, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
            });
        });

        document.querySelectorAll('.tilt-element, .bounce-card, .tilt-card').forEach(el => {
            const glare = el.querySelector('.card-glare');
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                el.style.setProperty('--mouse-x', `${x}px`);
                el.style.setProperty('--mouse-y', `${y}px`);
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;
                el.style.transform = `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
                if (glare) {
                    const glareX = (x / rect.width) * 100;
                    const glareY = (y / rect.height) * 100;
                    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15), transparent 50%)`;
                }
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = `perspective(2000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
                if (glare) {
                    glare.style.background = `radial-gradient(circle at 50% 50%, rgba(255,255,255,0), transparent 60%)`;
                }
            });
        });
    }

    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    const menuToggle = document.getElementById('mobile-menu');
    if(menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.body.classList.toggle('mobile-menu-active');
        });
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        gsap.utils.toArray('.reveal, .reveal-up').forEach(elem => {
            ScrollTrigger.create({
                trigger: elem,
                start: "top 85%",
                onEnter: () => elem.classList.add('active')
            });
        });
        gsap.utils.toArray('.pop-in').forEach((elem) => {
            gsap.fromTo(elem, 
                { scale: 0.8, opacity: 0, y: 30 }, 
                { 
                    scrollTrigger: { trigger: elem, start: "top 90%" }, 
                    scale: 1, opacity: 1, y: 0, duration: 1.2, 
                    ease: "elastic.out(1, 0.6)", stagger: 0.1 
                }
            );
        });

        const gridBlocks = document.querySelectorAll('.grid-block');
        if (gridBlocks.length > 0) {
            gsap.fromTo(gridBlocks,
                { scale: 0, opacity: 0, rotationZ: 15 },
                {
                    scrollTrigger: {
                        trigger: '#interactive-grid',
                        start: "top 85%"
                    },
                    scale: 1, opacity: 1, rotationZ: 0,
                    duration: 0.6,
                    ease: "back.out(1.5)",
                    stagger: 0.03
                }
            );

            gridBlocks.forEach(block => {
                block.addEventListener('click', () => {
                    gsap.fromTo(block, 
                        { scale: 0.7 }, 
                        { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" }
                    );
                });
            });
        }
    }

    const statsSection = document.querySelector('.stats-section');
    const counters = document.querySelectorAll('.counter');
    let counted = false;
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !counted) {
            counted = true;
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                let frame = 0;
                const totalFrames = 90;
                const updateCounter = () => {
                    frame++;
                    const progress = 1 - Math.pow(1 - (frame / totalFrames), 3);
                    const currentCount = target * progress;
                    if (frame < totalFrames) {
                        counter.innerText = target % 1 !== 0 ? currentCount.toFixed(1) : Math.round(currentCount);
                        requestAnimationFrame(updateCounter);
                    } else counter.innerText = target;
                };
                updateCounter();
            });
        }
    });
    if(statsSection) statsObserver.observe(statsSection);

    const teamTrack = document.querySelector('.team-track');
    const btnLeft = document.querySelector('.prev-arrow');
    const btnRight = document.querySelector('.next-arrow');
    if (teamTrack && btnLeft && btnRight) {
        const scrollAmount = 320;
        btnLeft.addEventListener('click', () => teamTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
        btnRight.addEventListener('click', () => teamTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
        if(window.matchMedia("(pointer: fine)").matches) {
            teamTrack.addEventListener('wheel', (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    teamTrack.scrollLeft += e.deltaY * 1.5;
                }
            }, { passive: false });
        }
    }

    const mediaTrack = document.getElementById('media-track');
    const prevMedia = document.querySelector('.prev-media');
    const nextMedia = document.querySelector('.next-media');

    if (mediaTrack && prevMedia && nextMedia) {
        const scrollMedia = 480; 
        prevMedia.addEventListener('click', () => mediaTrack.scrollBy({ left: -scrollMedia, behavior: 'smooth' }));
        nextMedia.addEventListener('click', () => mediaTrack.scrollBy({ left: scrollMedia, behavior: 'smooth' }));
        if(window.matchMedia("(pointer: fine)").matches) {
            mediaTrack.addEventListener('wheel', (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    mediaTrack.scrollLeft += e.deltaY * 1.5;
                }
            }, { passive: false });
        }
    }
});

(function() {
    const gameProxies = [
        'https://games.roproxy.com/v1/games?universeIds=',
        'https://corsproxy.io/?' + encodeURIComponent('https://games.roblox.com/v1/games?universeIds='),
        'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://games.roblox.com/v1/games?universeIds=')
    ];
    
    const thumbProxies = [
        'https://thumbnails.roproxy.com/v1/games/multiget/thumbnails?universeIds=',
        'https://corsproxy.io/?' + encodeURIComponent('https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds='),
        'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=')
    ];

    async function tryFetch(proxyList, ids, isThumb = false) {
        for (let baseUrl of proxyList) {
            try {
                let url = isThumb ? baseUrl + ids + '&size=768x432&format=Png&isCircular=false' : baseUrl + ids;
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 6000);
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                
                if (!response.ok) continue;

                let data = await response.json();
                if (data && data.data) return data.data;
            } catch (e) { continue; }
        }
        return null;
    }

    async function fetchRobloxData() {
        const allCards = document.querySelectorAll('.game-card');
        const validCards = Array.from(allCards).filter(c => {
            const uid = (c.dataset.universeId || "").trim();
            return uid !== '' && uid !== '0000000';
        });

        if (validCards.length === 0) {
            allCards.forEach(card => {
                const statsDiv = card.querySelector('.game-stats');
                const btn = card.querySelector('.btn-play');
                if (statsDiv) statsDiv.innerHTML = '<div class="stat-pill dev-badge"><i class="fas fa-hammer"></i> <span data-pt="Em Desenvolvimento" data-en="In Development">Em Desenvolvimento</span></div>';
                if (btn) { btn.innerText = 'Em Breve'; btn.classList.add('disabled'); btn.style.pointerEvents = 'none'; }
            });
            return;
        }

        const baseIds = validCards.map(c => c.dataset.universeId.trim());
        const fakeId = Math.floor(Math.random() * 900000000) + 100000000;
        const idString = [...baseIds, fakeId].join(',');

        try {
            const [gameData, thumbData] = await Promise.all([
                tryFetch(gameProxies, idString, false),
                tryFetch(thumbProxies, idString, true)
            ]);

            allCards.forEach(card => {
                const uidStr = (card.dataset.universeId || "").trim();
                const uid = parseInt(uidStr);
                
                const isForcedDev = card.dataset.status === 'dev' || uidStr === '' || uidStr === '0000000';

                const nameEl = card.querySelector('.game-name');
                const peakEl = card.querySelector('.peak-count');
                const visitEl = card.querySelector('.visit-count');
                const img = card.querySelector('.game-thumb');
                const statsDiv = card.querySelector('.game-stats');
                const btn = card.querySelector('.btn-play');

                const setDevMode = () => {
                    if (statsDiv) {
                        statsDiv.innerHTML = '<div class="stat-pill dev-badge"><i class="fas fa-hammer"></i> <span data-pt="Em Desenvolvimento" data-en="In Development">Em Desenvolvimento</span></div>';
                    }
                    if (btn) {
                        btn.innerText = 'Em Breve';
                        btn.classList.add('disabled');
                        btn.style.pointerEvents = 'none';
                    }
                };

                if (isForcedDev) {
                    setDevMode();
                } else if (gameData) {
                    const game = gameData.find(g => g.id === uid);
                    if (game) {
                        if (nameEl) nameEl.innerText = game.name;
                        if (peakEl) peakEl.innerText = Math.floor((game.playing || 0) * 1.3 + 15).toLocaleString() + '+';
                        if (visitEl) {
                            let v = game.visits || 0;
                            visitEl.innerText = v >= 1e6 ? (v / 1e6).toFixed(1) + 'M+' : v >= 1e3 ? (v / 1e3).toFixed(1) + 'K+' : v.toLocaleString();
                        }
                    } else {
                        setDevMode();
                    }
                } else {
                    if (nameEl && nameEl.innerText.includes('Carregando')) nameEl.innerText = 'API Offline';
                    setDevMode();
                }

                if (thumbData && !isNaN(uid)) {
                    const thumbGroup = thumbData.find(t => t.universeId === uid);
                    if (thumbGroup && thumbGroup.thumbnails && thumbGroup.thumbnails[0]) {
                        if (img && thumbGroup.thumbnails[0].imageUrl) {
                            img.src = thumbGroup.thumbnails[0].imageUrl;
                            img.style.display = 'block';
                        }
                    }
                }
            });
        } catch (e) {}
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fetchRobloxData);
    else fetchRobloxData();
})();

const contactForm = document.getElementById('neoxForm');
const formMsg = document.getElementById('formMsg');
const formBtn = document.getElementById('formBtn');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const messageVal = formData.get('message') || "";
        if (messageVal.length < 16) {
            formMsg.innerText = "Mínimo de 16 caracteres.";
            formMsg.className = "form-msg error";
            return;
        }
        
        const payload = {
            username: "NeoX Site Contact",
            embeds: [{
                title: "🚀 Novo Contato NeoX",
                color: 5814783,
                fields: [
                    { name: "Nome", value: formData.get('name') || "N/A", inline: true },
                    { name: "Email", value: formData.get('email') || "N/A", inline: true },
                    { name: "Nick Roblox", value: formData.get('roblox') || "Não informado", inline: false },
                    { name: "Mensagem", value: messageVal.substring(0, 1024) }
                ],
                footer: { text: "NeoX Studio Web System" },
                timestamp: new Date().toISOString()
            }]
        };

        const originalText = formBtn.innerHTML;
        formBtn.innerHTML = 'Enviando...';
        formBtn.disabled = true;

        fetch(apiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if(res.ok) {
                formMsg.innerText = "Mensagem enviada!";
                formMsg.className = "form-msg success";
                contactForm.reset();
            } else throw new Error();
        })
        .catch(() => {
            formMsg.innerText = "Erro no envio.";
            formMsg.className = "form-msg error";
        })
        .finally(() => {
            formBtn.innerHTML = originalText;
            formBtn.disabled = false;
            setTimeout(() => formMsg.innerText = "", 5000);
        });
    });
}