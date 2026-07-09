  document.getElementById('year').textContent = new Date().getFullYear();

  // mobile nav
  const navToggle = document.getElementById('navToggle');
  const navlinks = document.getElementById('navlinks');
  navToggle.addEventListener('click', () => navlinks.classList.toggle('open'));
  navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navlinks.classList.remove('open')));

  // scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  reveals.forEach(el => io.observe(el));

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => { o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = null; });
      if (!isOpen) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  // Business analyzer (front-end simulation)
  const analyzeBtn = document.getElementById('analyzeBtn');
  const resultBox = document.getElementById('analyzerResult');
  analyzeBtn.addEventListener('click', () => {
    const name = document.getElementById('bizname').value.trim();
    const site = document.getElementById('bizsite').value.trim();
    if (!name) { resultBox.innerHTML = '<div class="line" style="animation-delay:.05s; color:#D21767;">&gt; Please enter a business name.</div>'; resultBox.querySelectorAll('.line').forEach(l=>l.style.opacity=1); return; }
    resultBox.innerHTML = '';
    const lines = [
      '> Scanning ' + name + (site ? ' (' + site + ')' : '') + ' ...',
      '> Full analysis engine launches in ReasonLab v2.',
      '> Want the real breakdown now? Book a strategy call below.'
    ];
    lines.forEach((text, i) => {
      const div = document.createElement('div');
      div.className = 'line';
      div.style.animationDelay = (i * 0.35) + 's';
      div.textContent = text;
      resultBox.appendChild(div);
      setTimeout(() => { div.style.opacity = 1; }, i * 350);
    });
  });

  // Hero node network canvas
  (function(){
    const canvas = document.getElementById('node-canvas');
    const ctx = canvas.getContext('2d');
    let w, h, nodes, animId;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize(){
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }

    function init(){
      resize();
      const count = window.innerWidth < 680 ? 22 : 42;
      nodes = Array.from({length: count}, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        r: Math.random() * 1.6 + 0.8
      }));
    }

    const colors = ['#7029A1', '#D21767', '#00b6dd', '#FF690D'];

    function draw(){
      ctx.clearRect(0, 0, w, h);
      const linkDist = 140 * devicePixelRatio;

      for (let i = 0; i < nodes.length; i++){
        const n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      for (let i = 0; i < nodes.length; i++){
        for (let j = i + 1; j < nodes.length; j++){
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < linkDist){
            ctx.strokeStyle = 'rgba(122, 148, 154,' + (1 - dist/linkDist) * 0.35 + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n, i) => {
        ctx.fillStyle = colors[i % colors.length];
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      animId = requestAnimationFrame(draw);
    }

    init();
    if (!reduceMotion) { draw(); } else {
      // draw a single static frame
      draw(); cancelAnimationFrame(animId);
    }
    window.addEventListener('resize', () => { cancelAnimationFrame(animId); init(); if(!reduceMotion) draw(); });
  })();