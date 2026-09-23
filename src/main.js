import { projects } from './data/projects.js';

const grid = document.getElementById('project-grid');
const modal = document.getElementById('project-modal');
const year = document.getElementById('year');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

year.textContent = String(new Date().getFullYear());

function roleLabel(role) {
  if (role === 'joint') return '🤝 Team development';
  return '🚀 Independent';
}

function roleClass(role) {
  return role === 'joint' ? 'joint' : 'independent';
}

function truncate(text, max = 220) {
  if (!text || text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

function renderProjects(filter = 'all') {
  const list = projects.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'web' || filter === 'mobile') return p.type === filter;
    return p.role === filter;
  });

  grid.innerHTML = list
    .map(
      (p) => `
      <article class="project reveal is-visible" data-id="${p.id}" data-type="${p.type}" data-role="${p.role}">
        <div class="project-media">
          <div class="project-badges">
            <span class="badge">${p.type === 'mobile' ? '📱 Mobile' : '🌐 Web'}</span>
            <span class="badge ${roleClass(p.role)}">${roleLabel(p.role)}</span>
          </div>
          <img src="${p.image}" alt="${p.name} preview" width="960" height="600" loading="lazy" decoding="async" />
        </div>
        <div class="project-meta">
          <p class="category"><span class="emoji">${p.icon || '✨'}</span> ${p.category}</p>
          <h3>${p.name}</h3>
          <p class="project-blurb">${truncate(p.purpose, 240)}</p>
          <div class="project-actions">
            <button class="link" data-open="${p.id}">🔎 Full case study</button>
            <a class="link" href="${p.url}" target="_blank" rel="noopener noreferrer">Visit live ↗</a>
          </div>
        </div>
      </article>
    `,
    )
    .join('');
}

function openModal(id) {
  const p = projects.find((x) => x.id === id);
  if (!p) return;

  document.getElementById('modal-image').src = p.image;
  document.getElementById('modal-image').alt = `${p.name} preview`;
  document.getElementById('modal-category').innerHTML =
    `${p.icon || '✨'} ${p.category} · ${roleLabel(p.role)}`;
  document.getElementById('modal-title').textContent = p.name;
  document.getElementById('modal-purpose').textContent = p.purpose;
  document.getElementById('modal-usage').textContent = p.usage;
  document.getElementById('modal-experience').textContent = p.experience || '';
  document.getElementById('modal-stack').innerHTML = p.stack.map((s) => `<span class="chip">${s}</span>`).join('');
  document.getElementById('modal-tech').innerHTML = p.tech.map((t) => `<span class="chip">${t}</span>`).join('');
  const link = document.getElementById('modal-link');
  link.href = p.url;

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    renderProjects(btn.dataset.filter);
  });
});

grid.addEventListener('click', (e) => {
  const openBtn = e.target.closest('[data-open]');
  if (openBtn) {
    openModal(openBtn.dataset.open);
    return;
  }
  const card = e.target.closest('.project');
  if (card && !e.target.closest('a')) {
    openModal(card.dataset.id);
  }
});

document.getElementById('modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

document.querySelectorAll('.wheel-seg').forEach((seg) => {
  const go = () => {
    const id = seg.dataset.target;
    document.querySelectorAll('.wheel-seg').forEach((s) => s.classList.remove('is-active'));
    seg.classList.add('is-active');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  seg.addEventListener('click', go);
  seg.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      go();
    }
  });
});

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('is-open');
});

navLinks?.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => navLinks.classList.remove('is-open'));
});

const toTop = document.getElementById('to-top');
const toggleToTop = () => {
  toTop?.classList.toggle('is-visible', window.scrollY > 480);
};
toggleToTop();
window.addEventListener('scroll', toggleToTop, { passive: true });
toTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const starCanvas = document.getElementById('starfield');
const starHero = starCanvas?.closest('.hero');

if (starCanvas && starHero) {
  const ctx = starCanvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = [];
  let ripples = [];
  let meteors = [];
  let nextMeteor = performance.now() + 1800;
  let lastFrame = performance.now();
  let lastDrop = { x: 0, y: 0, t: 0 };
  const fills = Array.from({ length: 21 }, (_, i) => `rgba(236, 246, 255, ${(i / 20).toFixed(2)})`);
  const sparks = Array.from({ length: 21 }, (_, i) => `rgba(186, 230, 255, ${((i / 20) * 0.7).toFixed(2)})`);

  const resizeStars = () => {
    const rect = starHero.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, rect.width < 800 ? 1.25 : 1.5);
    starCanvas.width = Math.max(1, Math.floor(rect.width * dpr));
    starCanvas.height = Math.max(1, Math.floor(rect.height * dpr));
    starCanvas.style.width = `${rect.width}px`;
    starCanvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const wheel = starHero.querySelector('.wheel-wrap');
    const wr = wheel?.getBoundingClientRect();
    const cx = wr ? wr.left - rect.left + wr.width / 2 : rect.width * 0.75;
    const cy = wr ? wr.top - rect.top + wr.height / 2 : rect.height * 0.5;
    const reach = Math.max(wr?.width || 420, Math.min(rect.width, rect.height) * 0.72);
    const cap = rect.width < 800 ? 280 : 560;
    const count = Math.min(cap, Math.floor((rect.width * rect.height) / 1800));

    stars = Array.from({ length: count }, () => {
      const inGalaxy = Math.random() < 0.72;
      let x;
      let y;
      if (inGalaxy) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.pow(Math.random(), 0.45) * reach;
        x = cx + Math.cos(angle) * radius * 1.2 + (Math.random() - 0.5) * 28;
        y = cy + Math.sin(angle) * radius * 0.78 + (Math.random() - 0.5) * 16;
      } else {
        x = Math.random() * rect.width;
        y = Math.random() * rect.height;
      }
      const bright = Math.random() > 0.9;
      return {
        x,
        y,
        r: bright ? 1.5 + Math.random() * 1.5 : 0.35 + Math.random() * 1.05,
        a: bright ? 0.72 + Math.random() * 0.28 : 0.22 + Math.random() * 0.5,
        tw: 0.5 + Math.random() * 1.6,
        ph: Math.random() * Math.PI * 2,
        spark: bright && Math.random() > 0.45,
      };
    });
  };

  const dropRipple = (x, y, now) => {
    const dx = x - lastDrop.x;
    const dy = y - lastDrop.y;
    if (now - lastDrop.t < 70 || dx * dx + dy * dy < 180) return;
    ripples.push({ x, y, born: now });
    if (ripples.length > 7) ripples.shift();
    lastDrop = { x, y, t: now };
  };

  starHero.addEventListener('pointermove', (event) => {
    if (reduceMotion) return;
    const rect = starHero.getBoundingClientRect();
    dropRipple(event.clientX - rect.left, event.clientY - rect.top, performance.now());
  });

  const draw = (now) => {
    const width = starCanvas.clientWidth;
    const height = starCanvas.clientHeight;
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;
    ctx.clearRect(0, 0, width, height);

    if (!reduceMotion && now > nextMeteor) {
      const angle = Math.PI * (0.28 + Math.random() * 0.28);
      const speed = 520 + Math.random() * 280;
      meteors.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.45,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        max: 0.7 + Math.random() * 0.55,
      });
      nextMeteor = now + 3200 + Math.random() * 6400;
    }

    for (const star of stars) {
      let x = star.x;
      let y = star.y;
      if (!reduceMotion && ripples.length) {
        for (const ripple of ripples) {
          const age = (now - ripple.born) / 1000;
          if (age < 0 || age > 2.6) continue;
          const dx = star.x - ripple.x;
          const dy = star.y - ripple.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const wave = Math.sin(dist * 0.05 - age * 6.5);
          const envelope = Math.exp(-dist / 210) * Math.exp(-age / 1.05) * (1 - Math.exp(-age * 10));
          const push = wave * 22 * envelope;
          x += (dx / dist) * push;
          y += (dy / dist) * push;
        }
      }

      const alpha = star.a * (0.62 + 0.38 * Math.sin(now / 900 * star.tw + star.ph));
      ctx.fillStyle = fills[(alpha * 20) | 0];
      ctx.beginPath();
      ctx.arc(x, y, star.r, 0, Math.PI * 2);
      ctx.fill();

      if (star.spark) {
        ctx.strokeStyle = sparks[(alpha * 20) | 0];
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(x - star.r * 2.4, y);
        ctx.lineTo(x + star.r * 2.4, y);
        ctx.moveTo(x, y - star.r * 2.4);
        ctx.lineTo(x, y + star.r * 2.4);
        ctx.stroke();
      }
    }

    ripples = ripples.filter((ripple) => now - ripple.born < 2600);

    if (!reduceMotion) {
      for (const meteor of meteors) {
        meteor.life += dt;
        const t = meteor.life / meteor.max;
        if (t >= 1) continue;
        const headX = meteor.x + meteor.vx * meteor.life;
        const headY = meteor.y + meteor.vy * meteor.life;
        const tail = 0.32;
        const tailX = headX - meteor.vx * tail;
        const tailY = headY - meteor.vy * tail;
        const fade = Math.sin(Math.min(1, t) * Math.PI);
        const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
        grad.addColorStop(0, 'rgba(186,230,255,0)');
        grad.addColorStop(0.55, `rgba(210,236,255,${0.35 * fade})`);
        grad.addColorStop(1, `rgba(255,255,255,${0.95 * fade})`);
        ctx.strokeStyle = grad;
        ctx.lineCap = 'round';
        ctx.lineWidth = 3.2;
        ctx.globalAlpha = 0.35 * fade;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${fade})`;
        ctx.beginPath();
        ctx.arc(headX, headY, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
      meteors = meteors.filter((meteor) => meteor.life < meteor.max);
    }
  };

  resizeStars();
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeStars, 150);
  });

  let frameId = 0;
  let heroVisible = true;
  const tick = (now) => {
    if (!heroVisible) {
      frameId = 0;
      return;
    }
    draw(now);
    frameId = requestAnimationFrame(tick);
  };
  const heroWatch = new IntersectionObserver(([entry]) => {
    const showing = entry.isIntersecting;
    if (showing === heroVisible) return;
    heroVisible = showing;
    if (heroVisible && !frameId) {
      lastFrame = performance.now();
      frameId = requestAnimationFrame(tick);
    }
  });
  heroWatch.observe(starHero);
  frameId = requestAnimationFrame(tick);
}

const revealEls = () => {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
};

renderProjects();
revealEls();

const observer = new MutationObserver(() => revealEls());
observer.observe(grid, { childList: true });
