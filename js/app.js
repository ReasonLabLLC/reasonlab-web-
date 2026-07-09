document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const navlinks = document.getElementById('navlinks');

navToggle.addEventListener('click', () => {
  const isOpen = navlinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

navlinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navlinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const reveals = document.querySelectorAll('.reveal:not(.in)');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
reveals.forEach(el => revealObserver.observe(el));

document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => {
      o.classList.remove('open');
      o.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!open) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

const form = document.getElementById('analyzerForm');
const resultBox = document.getElementById('analyzerResult');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('bizname').value.trim();
  const site = document.getElementById('bizsite').value.trim();
  const industry = document.getElementById('industry').value;
  const challenge = document.getElementById('challenge').value;

  if (!name) {
    resultBox.innerHTML = '<div style="color:#ff6b9d">&gt; Please enter a business name.</div>';
    return;
  }

  const steps = [
    `&gt; Connecting to ReasonLab Engine...`,
    `&gt; Scanning ${name}${site ? ' (' + site + ')' : ''}...`,
    `&gt; Checking lead capture...`,
    `&gt; Detecting automation opportunities...`,
    `&gt; Generating AI recommendations...`
  ];

  resultBox.innerHTML = '';
  steps.forEach((text, i) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.textContent = text;
      resultBox.appendChild(line);
    }, i * 420);
  });

  setTimeout(() => {
    const hours = challenge === 'Manual work' ? 22 : 16;
    const system = challenge === 'Customer follow-up' ? 'AI Follow-up Agent' : challenge === 'Operations visibility' ? 'Business Dashboard' : 'AI Lead Capture + CRM Automation';
    resultBox.innerHTML += `
      <div class="audit-card">
        <strong style="color:#fff">AI Audit Report</strong>
        <div class="audit-grid">
          <div class="audit-metric"><small>Lead Capture</small><strong>Needs Improvement</strong></div>
          <div class="audit-metric"><small>Automation Potential</small><strong>High</strong></div>
          <div class="audit-metric"><small>Time Saved</small><strong>≈ ${hours} hrs/week</strong></div>
          <div class="audit-metric"><small>First Build</small><strong>${system}</strong></div>
        </div>
        <p style="margin-top:14px;font-size:13.5px">Based on your inputs${industry ? ' in ' + industry : ''}, we would start by building a system that captures inquiries, qualifies leads and triggers follow-up automatically.</p>
        <a href="#contact" class="btn btn-primary" style="margin-top:16px;width:100%">Book a Strategy Call</a>
      </div>
    `;
  }, steps.length * 420 + 350);
});

(function(){
  const canvas = document.getElementById('node-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, nodes, frame;

  function resize(){
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }

  function init(){
    resize();
    const count = window.innerWidth < 760 ? 24 : 48;
    nodes = Array.from({length: count}, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.22 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.22 * devicePixelRatio,
      r: Math.random() * 1.4 + 0.8
    }));
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    const linkDist = 145 * devicePixelRatio;

    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });

    for (let i=0;i<nodes.length;i++){
      for (let j=i+1;j<nodes.length;j++){
        const a=nodes[i], b=nodes[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<linkDist){
          ctx.strokeStyle = `rgba(122,148,154,${(1-dist/linkDist)*0.32})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }

    const colors = ['#7029A1','#D21767','#00b6dd','#FF690D'];
    nodes.forEach((n,i)=>{
      ctx.fillStyle = colors[i % colors.length];
      ctx.globalAlpha = .82;
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r*devicePixelRatio,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    });
    frame = requestAnimationFrame(draw);
  }

  init();
  draw();
  if (reduceMotion) cancelAnimationFrame(frame);
  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame);
    init();
    if (!reduceMotion) draw();
  });
})();
