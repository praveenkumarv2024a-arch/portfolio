/* Interactive Application Logic for Praveenkumar V Portfolio */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypingEffect();
  initHeaderScroll();
  initSkillsGrid();
  initStatsCounter();
  initContactForm();
  updateMsgCount();
});

/* -------------------------------------------------------------
   1. Particle Canvas AI Network Animation
   ------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 75);

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? '#00f2fe' : '#7f00ff';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Connect close particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${1 - dist / 130 * 0.85})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* -------------------------------------------------------------
   2. Typing Effect for Hero Subtitle
   ------------------------------------------------------------- */
function initTypingEffect() {
  const target = document.getElementById('typing-text');
  if (!target) return;

  const words = [
    "M.Sc Data Science Postgraduate @ VIT",
    "AI / Machine Learning Engineer",
    "Predictive Analytics Specialist",
    "SHAP Explainable AI Developer",
    "SQL & Database Querying Specialist"
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2200; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* -------------------------------------------------------------
   3. Header Navigation Scroll & Mobile Drawer
   ------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Drawer Toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawer = document.getElementById('mobile-drawer');

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => drawer.classList.add('active'));
    drawerCloseBtn.addEventListener('click', () => drawer.classList.remove('active'));
    
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => drawer.classList.remove('active'));
    });
  }
}

/* -------------------------------------------------------------
   4. Skills Grid & Filtering Logic
   ------------------------------------------------------------- */
const skillsData = [
  { name: 'Python (Pandas, NumPy)', category: 'languages', level: 95, icon: 'fa-brands fa-python', catLabel: 'Languages & DB' },
  { name: 'SQL & Relational DBs', category: 'languages', level: 90, icon: 'fa-solid fa-database', catLabel: 'Languages & DB' },
  { name: 'Scikit-Learn & ML', category: 'languages', level: 92, icon: 'fa-solid fa-gears', catLabel: 'Machine Learning' },
  { name: 'LightGBM & XGBoost', category: 'languages', level: 88, icon: 'fa-solid fa-bolt', catLabel: 'Machine Learning' },
  { name: 'Microsoft Excel (Advanced & Pivot)', category: 'visualization', level: 92, icon: 'fa-solid fa-file-excel', catLabel: 'Data Analysis & Tools' },
  { name: 'Power BI', category: 'visualization', level: 86, icon: 'fa-solid fa-chart-column', catLabel: 'Data Visualization' },
  { name: 'Tableau', category: 'visualization', level: 82, icon: 'fa-solid fa-chart-pie', catLabel: 'Data Visualization' },
  { name: 'Matplotlib & Seaborn', category: 'visualization', level: 90, icon: 'fa-solid fa-chart-area', catLabel: 'Data Visualization' },
  { name: 'SHAP Explainable AI', category: 'tools', level: 88, icon: 'fa-solid fa-brain', catLabel: 'Tools & AI Workflows' },
  { name: 'Git & GitHub', category: 'tools', level: 85, icon: 'fa-brands fa-git-alt', catLabel: 'Tools & AI Workflows' },
  { name: 'Jupyter Notebooks', category: 'tools', level: 94, icon: 'fa-solid fa-book-open', catLabel: 'Tools & AI Workflows' },
  { name: 'Claude (AI Prompting & Automation)', category: 'tools', level: 92, icon: 'fa-solid fa-robot', catLabel: 'Tools & AI Workflows' },
  { name: 'Flask & Streamlit Web Apps', category: 'tools', level: 88, icon: 'fa-solid fa-laptop-code', catLabel: 'Tools & AI Workflows' }
];

function initSkillsGrid() {
  const container = document.getElementById('skills-container');
  if (!container) return;

  function renderSkills(filter = 'all') {
    container.innerHTML = '';
    const filtered = filter === 'all' ? skillsData : skillsData.filter(s => s.category === filter);

    filtered.forEach(skill => {
      const card = document.createElement('div');
      card.className = 'skill-card';
      card.innerHTML = `
        <div class="skill-header">
          <div class="skill-title-wrap">
            <div class="skill-icon-box"><i class="${skill.icon}"></i></div>
            <div>
              <div class="skill-name">${skill.name}</div>
              <div class="skill-category">${skill.catLabel}</div>
            </div>
          </div>
          <span style="font-weight: 700; color: var(--primary-cyan); font-size: 0.9rem;">${skill.level}%</span>
        </div>
        <div class="skill-level-bar">
          <div class="skill-level-fill" style="width: ${skill.level}%"></div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  renderSkills('all');

  // Filter Button Listeners
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSkills(btn.dataset.filter);
    });
  });
}

/* -------------------------------------------------------------
   5. Numeric Counter Animation
   ------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = parseFloat(stat.dataset.target);
      let count = 0;
      const speed = target / 50;

      const updateCount = () => {
        count += speed;
        if (count < target) {
          stat.textContent = target % 1 !== 0 ? count.toFixed(2) : Math.ceil(count);
          setTimeout(updateCount, 30);
        } else {
          stat.textContent = target;
        }
      };
      updateCount();
    });
  }

  window.addEventListener('scroll', () => {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    const top = statsSection.getBoundingClientRect().top;
    if (top < window.innerHeight && !animated) {
      animateCounters();
      animated = true;
    }
  });
}

/* -------------------------------------------------------------
   6. Stock Market AI Simulator Modal & Chart
   ------------------------------------------------------------- */
let stockChartInstance = null;

function openStockSimulator() {
  document.getElementById('stock-modal').classList.add('active');
  updateStockSim();
}

function updateStockSim() {
  const sentiment = parseFloat(document.getElementById('slider-sentiment').value);
  const rsi = parseFloat(document.getElementById('slider-rsi').value);
  const macd = parseFloat(document.getElementById('slider-macd').value);

  // Update Labels
  document.getElementById('stock-sentiment-val').textContent = `${sentiment >= 0 ? '+' : ''}${sentiment} (${sentiment > 0.2 ? 'Bullish' : sentiment < -0.2 ? 'Bearish' : 'Neutral'})`;
  document.getElementById('stock-rsi-val').textContent = rsi;
  document.getElementById('stock-macd-val').textContent = `${macd >= 0 ? '+' : ''}${macd} (${macd > 0 ? 'Buy' : 'Sell'})`;

  // Compute Signal Score
  const score = (sentiment * 45) + ((rsi - 50) * 0.7) + (macd * 15);
  const circle = document.getElementById('stock-circle');
  const actionText = document.getElementById('stock-action');
  const confText = document.getElementById('stock-conf');
  const reasonText = document.getElementById('stock-reason');

  if (score > 15) {
    actionText.textContent = "STRONG BUY";
    actionText.style.fontSize = "1.2rem";
    actionText.style.color = "#10b981";
    confText.textContent = `${Math.min(99, Math.round(75 + score / 2))}% Confidence`;
    circle.style.background = `conic-gradient(#10b981 0deg, #10b981 320deg, rgba(255,255,255,0.1) 320deg)`;
    reasonText.textContent = "Bullish NLP sentiment combined with MACD signal crossover confirms strong upward buy trajectory.";
  } else if (score < -15) {
    actionText.textContent = "SELL";
    actionText.style.fontSize = "1.5rem";
    actionText.style.color = "#ef4444";
    confText.textContent = `${Math.min(99, Math.round(75 + Math.abs(score) / 2))}% Confidence`;
    circle.style.background = `conic-gradient(#ef4444 0deg, #ef4444 280deg, rgba(255,255,255,0.1) 280deg)`;
    reasonText.textContent = "Bearish sentiment and negative MACD signal indicate downside risk. Paper trading engine executes exit.";
  } else {
    actionText.textContent = "HOLD";
    actionText.style.fontSize = "1.5rem";
    actionText.style.color = "#f59e0b";
    confText.textContent = "65% Confidence";
    circle.style.background = `conic-gradient(#f59e0b 0deg, #f59e0b 180deg, rgba(255,255,255,0.1) 180deg)`;
    reasonText.textContent = "Mixed indicators detected. Engine recommends holding position until sentiment direction clarifies.";
  }

  // Render / Update Chart.js
  const ctx = document.getElementById('stockChart').getContext('2d');
  const shapValues = [
    (sentiment * 0.42).toFixed(2),
    ((rsi - 50) * 0.015).toFixed(2),
    (macd * 0.08).toFixed(2),
    0.15
  ];

  if (stockChartInstance) {
    stockChartInstance.data.datasets[0].data = shapValues;
    stockChartInstance.update();
  } else {
    stockChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['NLP News Sentiment', 'RSI (14)', 'MACD Crossover', 'Quarterly Financials'],
        datasets: [{
          label: 'SHAP Feature Contribution Value',
          data: shapValues,
          backgroundColor: shapValues.map(v => v >= 0 ? 'rgba(0, 242, 254, 0.75)' : 'rgba(239, 68, 68, 0.75)'),
          borderColor: shapValues.map(v => v >= 0 ? '#00f2fe' : '#ef4444'),
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }
}

/* -------------------------------------------------------------
   7. Loan Predictor Simulator Modal & Chart
   ------------------------------------------------------------- */
let loanChartInstance = null;

function openLoanCalculator() {
  document.getElementById('loan-modal').classList.add('active');
  updateLoanSim();
}

function updateLoanSim() {
  const credit = parseInt(document.getElementById('slider-credit').value);
  const income = parseInt(document.getElementById('slider-income').value);
  const amount = parseInt(document.getElementById('slider-amount').value);

  document.getElementById('loan-credit-val').textContent = credit;
  document.getElementById('loan-income-val').textContent = `$${income.toLocaleString()}`;
  document.getElementById('loan-amount-val').textContent = `$${amount.toLocaleString()}`;

  // ML Score Formula Simulation
  const creditFactor = (credit - 300) / 550 * 50; // 0 to 50
  const incomeRatio = Math.min((income * 12) / amount, 3) / 3 * 50; // 0 to 50
  const approvalProb = Math.min(99, Math.max(5, Math.round(creditFactor + incomeRatio)));

  const statusVal = document.getElementById('loan-status');
  const statusText = document.getElementById('loan-status-text');
  const circle = document.getElementById('loan-circle');

  statusVal.textContent = `${approvalProb}%`;

  if (approvalProb >= 70) {
    statusText.textContent = "APPROVED";
    statusText.style.color = "#10b981";
    circle.style.background = `conic-gradient(#10b981 0deg, #10b981 ${approvalProb * 3.6}deg, rgba(255,255,255,0.1) ${approvalProb * 3.6}deg)`;
  } else if (approvalProb >= 45) {
    statusText.textContent = "MANUAL REVIEW";
    statusText.style.color = "#f59e0b";
    circle.style.background = `conic-gradient(#f59e0b 0deg, #f59e0b ${approvalProb * 3.6}deg, rgba(255,255,255,0.1) ${approvalProb * 3.6}deg)`;
  } else {
    statusText.textContent = "REJECTED";
    statusText.style.color = "#ef4444";
    circle.style.background = `conic-gradient(#ef4444 0deg, #ef4444 ${approvalProb * 3.6}deg, rgba(255,255,255,0.1) ${approvalProb * 3.6}deg)`;
  }

  // Update SHAP Chart
  const ctx = document.getElementById('loanChart').getContext('2d');
  const shapData = [
    ((credit - 650) * 0.002).toFixed(2),
    ((income - 5000) * 0.00005).toFixed(2),
    (- (amount - 15000) * 0.00003).toFixed(2),
    0.12
  ];

  if (loanChartInstance) {
    loanChartInstance.data.datasets[0].data = shapData;
    loanChartInstance.update();
  } else {
    loanChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['CIBIL Credit Score', 'Monthly Applicant Income', 'Loan-to-Income Ratio', 'Historical Payment Record'],
        datasets: [{
          label: 'SHAP Value Impact',
          data: shapData,
          backgroundColor: shapData.map(v => v >= 0 ? 'rgba(16, 185, 129, 0.75)' : 'rgba(239, 68, 68, 0.75)'),
          borderColor: shapData.map(v => v >= 0 ? '#10b981' : '#ef4444'),
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

/* -------------------------------------------------------------
   8. Contact Us Form & Copy Utilities
   ------------------------------------------------------------- */
function selectTopic(topic) {
  document.getElementById('sender-subject').value = topic;
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('contact-submit-btn');
    const originalText = btn.innerHTML;

    const name = document.getElementById('sender-name').value;
    const email = document.getElementById('sender-email').value;
    const subject = document.getElementById('sender-subject').value;
    const message = document.getElementById('sender-message').value;

    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...`;
    btn.disabled = true;

    // Save message locally
    const newMsg = {
      id: Date.now(),
      name,
      email,
      subject,
      message,
      timestamp: new Date().toLocaleString()
    };

    let savedMsgs = JSON.parse(localStorage.getItem('praveen_portfolio_msgs') || '[]');
    savedMsgs.unshift(newMsg);
    localStorage.setItem('praveen_portfolio_msgs', JSON.stringify(savedMsgs));

    setTimeout(() => {
      btn.innerHTML = `<i class="fa-solid fa-check"></i> Message Sent!`;
      btn.style.background = "linear-gradient(135deg, #10b981, #059669)";
      btn.style.color = "#ffffff";
      
      showToast(`✨ Message received from ${name}! (Saved to Inbox)`);
      updateMsgCount();

      setTimeout(() => {
        form.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.background = "";
        btn.style.color = "";
      }, 3000);
    }, 1000);
  });
}

/* -------------------------------------------------------------
   9. Private Admin Messages Inbox & Excel Export Logic
   ------------------------------------------------------------- */
let logoClickCount = 0;
let logoClickTimer = null;

function handleLogoClick(e) {
  logoClickCount++;
  if (logoClickTimer) clearTimeout(logoClickTimer);

  if (logoClickCount >= 3) {
    logoClickCount = 0;
    promptAdminAccess();
  } else {
    logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 1000);
  }
}

// Global Secret Shortcut: Ctrl + Shift + A
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
    e.preventDefault();
    promptAdminAccess();
  }
});

function promptAdminAccess() {
  const pwd = prompt("🔒 Enter Private Passkey:");
  if (pwd === "praveen") {
    openAdminModal();
  } else if (pwd !== null && pwd.trim() !== "") {
    showToast("❌ Incorrect Passkey!");
  }
}

function updateMsgCount() {
  const msgs = JSON.parse(localStorage.getItem('praveen_portfolio_msgs') || '[]');
  const countEl = document.getElementById('msg-count');
  if (countEl) countEl.textContent = msgs.length;
}

function openAdminModal() {
  document.getElementById('admin-modal').classList.add('active');
  renderAdminMessages();
}

function renderAdminMessages() {
  const listEl = document.getElementById('admin-messages-list');
  const msgs = JSON.parse(localStorage.getItem('praveen_portfolio_msgs') || '[]');

  if (!listEl) return;

  if (msgs.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
        <i class="fa-solid fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p>No messages received yet. Submit a test message through the Contact Us form!</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = msgs.map(m => `
    <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(0, 242, 254, 0.2); border-radius: 14px; padding: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
        <div>
          <strong style="color: var(--primary-cyan); font-size: 1.05rem;">${escapeHtml(m.name)}</strong>
          <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 0.5rem;">&lt;${escapeHtml(m.email)}&gt;</span>
        </div>
        <span style="font-size: 0.75rem; color: var(--text-dim);">${m.timestamp}</span>
      </div>
      <div style="font-size: 0.9rem; font-weight: 600; color: var(--primary-blue); margin-bottom: 0.5rem;">Subject: ${escapeHtml(m.subject)}</div>
      <p style="font-size: 0.95rem; color: var(--text-main); margin: 0; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(m.message)}</p>
    </div>
  `).join('');
}

function exportMessagesToExcel() {
  const msgs = JSON.parse(localStorage.getItem('praveen_portfolio_msgs') || '[]');
  
  if (msgs.length === 0) {
    showToast('⚠️ No messages available to export!');
    return;
  }

  // Create CSV Content for Microsoft Excel & Google Sheets
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "ID,Date & Time,Name,Email,Subject,Message\n";

  msgs.forEach(m => {
    const row = [
      m.id,
      `"${(m.timestamp || '').replace(/"/g, '""')}"`,
      `"${(m.name || '').replace(/"/g, '""')}"`,
      `"${(m.email || '').replace(/"/g, '""')}"`,
      `"${(m.subject || '').replace(/"/g, '""')}"`,
      `"${(m.message || '').replace(/"/g, '""')}"`
    ].join(",");
    csvContent += row + "\n";
  });

  // Download Trigger
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Praveenkumar_Portfolio_Messages_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('📊 Exported to Excel / CSV spreadsheet!');
}

function clearAdminMessages() {
  if (confirm('Are you sure you want to clear all received messages?')) {
    localStorage.removeItem('praveen_portfolio_msgs');
    updateMsgCount();
    renderAdminMessages();
    showToast('🗑️ All messages cleared!');
  }
}

function escapeHtml(str) {
  return str ? str.replace(/[&<>"']/g, match => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[match]) : '';
}

function copyToClipboard(text, event) {
  if (event) event.preventDefault();
  navigator.clipboard.writeText(text).then(() => {
    showToast(`📋 Copied "${text}" to clipboard!`);
  }).catch(err => {
    showToast(`Copied: ${text}`);
  });
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--primary-cyan);"></i> <span>${message}</span>`;
  
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
