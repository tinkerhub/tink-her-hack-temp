
/* ══════════════════════════════════════
   DATA
══════════════════════════════════════ */
const STORAGE_KEY = 'campuscents_v2';

function loadData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { expenses: [], budgets: {} }; }
  catch { return { expenses: [], budgets: {} }; }
}

function saveData(d) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
}

let appData = loadData();
let currentMonth = new Date().toISOString().slice(0,7); // "YYYY-MM"

/* ══════════════════════════════════════
   NAV
══════════════════════════════════════ */
function switchTab(tab) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
  const tabs = document.querySelectorAll('.nav-tab');
  tabs[tab === 'walkthrough' ? 0 : 1].classList.add('active');
  if (tab === 'tracker') renderTracker();
}

function switchToInvest() {
  // Show invest-panel section, hide walkthrough, keep Learn nav-tab active
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('invest-panel').classList.add('active');
  document.querySelectorAll('.nav-tab')[0].classList.add('active');
  // Sync sub-nav buttons on walkthrough section too
  document.querySelectorAll('.wt-section-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === 'invest');
  });
  renderSIP500();
  renderCustomCalc();
}

function switchFromInvest(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('walkthrough').classList.add('active');
  document.querySelectorAll('.nav-tab')[0].classList.add('active');
  switchWTSection(section);
}

/* ══════════════════════════════════════
   WALKTHROUGH CARDS
══════════════════════════════════════ */
const WT_CARDS = [
  { tag: 'Welcome', accent: '#c9a96e', emoji: '👋', title: "Let's talk money — without the stress.", body: "Budgeting isn't about restricting yourself. It's about knowing where your money goes so YOU decide what it does. This quick guide walks you through the basics in under 5 minutes." },
  { tag: 'Step 1', accent: '#4a9b6f', emoji: '💰', title: "Know what's coming IN.", body: "List every rupee you receive — part-time job, scholarships, grants, loans, family support. Then figure out how much is actually spendable each month. Some aid comes once a term, not every month!", tip: "Use your lowest typical monthly amount — never your best month — to be safe." },
  { tag: 'Step 2', accent: '#2c6fad', emoji: '📋', title: "Know what's going OUT.", body: "Write down every expense. Split them into two buckets:", bullets: ["🔒 Fixed — rent, phone bill, insurance. Same every month.", "🎲 Variable — food, transport, subscriptions, fun. Changes month to month."], tip: "Ask: Is this a NEED or a WANT? That one question changes everything." },
  { tag: 'Step 3', accent: '#c0392b', emoji: '🔍', title: "Spot the gaps & set real goals.", body: "Subtract your fixed costs from your income. What's left? Now look at variable spending — are you consistently overspending somewhere? That's where the savings are hiding.", tip: "'Save ₹500 this month' beats 'spend less' — specific wins build momentum." },
  { tag: 'Step 4', accent: '#d4851a', emoji: '🏗️', title: "Build your actual budget.", body: "Put it all together:", bullets: ["1️⃣  Start with total monthly income.", "2️⃣  Subtract fixed expenses (non-negotiable).", "3️⃣  Set limits for variable expenses.", "4️⃣  Decide what leftover money does — savings, debt, or next month's costs."] },
  { tag: 'Strategy', accent: '#4a9b6f', emoji: '🧠', title: "Pick a budgeting style that fits YOU.", body: "No single strategy is the 'right' one. The best budget is the one you'll actually stick to. Here are three popular methods — pick what resonates." },
  { tag: 'Strategy A', accent: '#c0392b', emoji: '🥧', title: "The 50 / 30 / 20 Rule", body: "Slice your monthly income into three simple portions:", bullets: ["50% → Needs (rent, food, utilities, transport)", "30% → Wants (dining out, entertainment, hobbies)", "20% → Savings or paying down debt"], tip: "Flexible! If rent eats 60%, just adjust the other slices — no guilt." },
  { tag: 'Strategy B', accent: '#2c6fad', emoji: '🏦', title: "Pay Yourself First", body: "The moment money hits your account — move a fixed amount into savings. Before groceries. Before Netflix. Before anything else.", tip: "Automate it so you never see that money. Out of sight, out of temptation." },
  { tag: 'Strategy C', accent: '#d4851a', emoji: '⚖️', title: "Zero-Based Budget", body: "Every single rupee has a job before the month starts. Income minus all assigned spending = ₹0. Leftover money goes to savings or debt — nothing floats around unassigned.", tip: "Intense but powerful — especially for getting out of debt fast." },
  { tag: 'Step 5', accent: '#4a9b6f', emoji: '🛠️', title: "Use the right tools.", body: "Spreadsheets work, but budgeting apps and trackers do the heavy lifting — auto-categorising your spending and giving a real-time picture of where money is going.", tip: "Or just use CampusCents — we built the tracker right here for you! Switch to 'Track' above 👆" },
  { tag: 'Step 6', accent: '#2c6fad', emoji: '🔄', title: "Review. Adjust. Repeat.", body: "After your first month, compare actual spending to your plan. Over in some category? That's completely normal — don't quit, just adjust.", bullets: ["🍳 Cook more → lower dining costs", "🛍️ Shop secondhand → stretch your budget", "📵 Cut unused subscriptions → instant free money"] },
  { tag: 'Save More', accent: '#c9a96e', emoji: '💡', title: "Smart ways to keep more money.", body: "Small habit shifts equal big savings over a semester. Here are the highest-impact tips for college students:" },
  { tag: 'Tip 1', accent: '#4a9b6f', emoji: '📚', title: "Never pay full price for textbooks.", body: "Check Facebook Marketplace, campus group chats, and secondhand bookstores. Rent or buy e-books on Amazon, Chegg, or AbeBooks. A ₹3,000 textbook often costs ₹300 used.", tip: "Always check if your library has a copy first — it's free." },
  { tag: 'Tip 2', accent: '#c0392b', emoji: '🍳', title: "Cook more. Spend way less.", body: "The average person spends ~₹30,000/year dining out. Cooking just 4 extra meals at home per week can save thousands every semester — money that goes straight toward tuition or savings." },
  { tag: 'Tip 3', accent: '#2c6fad', emoji: '🛍️', title: "Secondhand is the student's superpower.", body: "Thrift stores, consignment shops, OLX, Facebook Marketplace — clothing, furniture, essentials at a fraction of retail. Sustainable AND budget-friendly. Win-win." },
  { tag: 'Tip 4', accent: '#d4851a', emoji: '🎓', title: "Flash your student ID everywhere.", body: "Countless businesses offer student discounts on food, software, transport, and entertainment. Your employer might offer gym discounts or wellness programs too. Always ask before paying full price.", tip: "Your ID is basically a discount card — never leave home without it." },
  { tag: 'Tip 5', accent: '#4a9b6f', emoji: '📵', title: "Audit your subscriptions ruthlessly.", body: "Add up every recurring charge. Most people are shocked by the total. Cancel what you don't actually use. Find student pricing for what you love.", tip: "This single habit often saves ₹500–₹1,500 per month — immediately." },
  { tag: 'Tip 6', accent: '#c0392b', emoji: '🛡️', title: "Build your emergency fund first.", body: "Before saving for anything else, set aside even ₹2,000–₹5,000 for unexpected costs — a medical bill, broken phone, or emergency trip home. One bad day won't wreck your whole budget.", tip: "Emergency fund = financial self-defence. Build it before investing elsewhere." },
  { tag: "You're Ready!", accent: '#c9a96e', emoji: '🚀', title: "That's a wrap. Now let's track.", body: "You know the essentials — income, expenses, strategies, and saving hacks. The next step? Put it into practice with the tracker.", tip: "Remember: a budget isn't a punishment. It's a plan that gives your money a direction. Now go track! 💪" },
];

// Jargon cards
const JARGON_CARDS = [
  { tag: 'Welcome', accent: '#e74c3c', emoji: '📖', title: "Stock Market Jargon Decoded.", body: "Don't let fancy words scare you. Every investor started as a beginner. This guide breaks down the essential stock market terms into simple, relatable explanations." },
  { tag: 'Basics', accent: '#3498db', emoji: '🏢', title: "What is a Stock?", body: "A stock is a tiny piece of ownership in a company. When you buy a stock, you become a part-owner (shareholder) of that company. The more is its value, the more valuable your ownership becomes." },
  { tag: 'Basics', accent: '#3498db', emoji: '💹', title: "Stock Price", body: "The stock price is what you pay to own one share. Prices go up and down based on company performance, market conditions, and investor sentiment. Buy low, sell high — that's the basic idea." },
  { tag: 'Basics', accent: '#3498db', emoji: '📈', title: "Bull Market vs Bear Market", body: "A bull market is when prices rise and investors are optimistic (bull pushes horns UP). A bear market is when prices fall and investors are pessimistic (bear swipes paws DOWN). Both are normal cycles." },
  { tag: 'Trading', accent: '#f39c12', emoji: '🔄', title: "Bid and Ask Price", body: "The bid price is what buyers are willing to pay. The ask price is what sellers want. The difference between them is the 'spread'. Think of it like haggling at a market stall." },
  { tag: 'Trading', accent: '#f39c12', emoji: '📊', title: "Volume", body: "Volume is how many shares got traded in a day. High volume = lots of buying/selling and high liquidity (easy to buy/sell). Low volume = less trading activity and harder to move shares quickly." },
  { tag: 'Trading', accent: '#f39c12', emoji: '🎯', title: "Market Orders vs Limit Orders", body: "A market order buys/sells immediately at current price. A limit order waits until the price hits your target. Market orders = instant execution. Limit orders = you pick the price, but might not execute." },
  { tag: 'Companies', accent: '#27ae60', emoji: '💰', title: "Dividend", body: "Some companies share their profits with shareholders as dividends — usually cash paid quarterly or yearly. It's free money for owning the stock. Not all stocks pay dividends though." },
  { tag: 'Companies', accent: '#27ae60', emoji: '📉', title: "Market Cap", body: "Market cap = stock price × total shares outstanding. It tells you the company's total value. Large cap = big, stable companies. Small cap = smaller, riskier, higher growth potential companies." },
  { tag: 'Companies', accent: '#27ae60', emoji: '💵', title: "P/E Ratio", body: "Price-to-Earnings ratio = stock price ÷ annual profit per share. It shows if a stock is expensive or cheap compared to earnings. Lower P/E = potentially cheaper. Higher P/E = investors expect more growth." },
  { tag: 'Risk', accent: '#c0392b', emoji: '⚠️', title: "Volatility", body: "Volatility measures how much a stock price bounces around. High volatility = big price swings, high risk but high reward potential. Low volatility = stable, boring but safer. Your risk tolerance should match volatility." },
  { tag: 'Risk', accent: '#c0392b', emoji: '🛡️', title: "Diversification", body: "Don't put all eggs in one basket. Spread investments across different companies, sectors, and asset types. If one fails, your whole portfolio doesn't crash. Reduces risk significantly." },
  { tag: 'Strategies', accent: '#8e44ad', emoji: '🔍', title: "Fundamental Analysis", body: "Researching company fundamentals: earnings, growth, debt, leadership. Asking 'Is this company actually good?'. Long-term investors use this to find quality companies worth owning." },
  { tag: 'Strategies', accent: '#8e44ad', emoji: '📈', title: "Technical Analysis", body: "Studying price patterns and charts to predict future moves. Looking at trends, support/resistance levels, moving averages. Short-term traders rely heavily on technical analysis." },
  { tag: 'Market', accent: '#16a085', emoji: '🏛️', title: "Stock Exchange & Index", body: "A stock exchange is where stocks are traded (like NSE, BSE in India). An index (Sensex, Nifty) tracks a group of companies to show market health. Buy individual stocks or invest in index funds." },
  { tag: 'You\'re Ready!', accent: '#e74c3c', emoji: '✨', title: "Jargon mastered! Continue learning.", body: "You now know the essential terms. Next, dive into strategies for actually getting started. Don't worry if it feels complex — every expert was once confused too. Keep learning!", tip: "Bookmark this and reference it often. Understanding terminology is the first step to confident investing." },
];

// Beginners Guide cards
const BEGINNERS_CARDS = [
  { tag: 'Start Here', accent: '#2ecc71', emoji: '🚀', title: "Getting Into Stock Market: A Beginner's Roadmap.", body: "Ready to start investing? This guide walks you through every step from opening your first account to making your first trade. No experience necessary — just curiosity and patience." },
  { tag: 'Foundation', accent: '#3498db', emoji: '🎓', title: "Step 1: Build Your Financial Base.", body: "Before investing, get your basics right:", bullets: ["✅ Build an emergency fund (3-6 months expenses)", "✅ Pay off high-interest debt", "✅ Have stable income ", "✅ Understand your risk tolerance"], tip: "Investing money you can't afford to lose is dangerous. Secure your foundation first." },
  { tag: 'Foundation', accent: '#3498db', emoji: '💡', title: "Risk Tolerance Quiz", body: "How much loss can you handle? If stock price drops 30%, can you stay calm and hold? This determines your investment strategy.", bullets: ["🟢 Low risk: Stable, prefer dividends, can't handle losses", "🟡 Medium risk: Balanced growth with some safety", "🔴 High risk: Growth-focused, can handle volatility"], tip: "Young investors can typically afford higher risk. Adjust as you age or accumulate wealth." },
  { tag: 'Setup', accent: '#e74c3c', emoji: '📱', title: "Step 2: Choose Your Investment Platform.", body: "You need a brokerage account (like Zerodha, Angel, Upstox for India). Compare:", bullets: ["Commission fees & account opening costs", "Trading app quality & support", "Research tools & educational resources", "Account minimum & deposit methods"], tip: "Most brokers offer free accounts. Open one that feels easy to use — you'll be staring at it often." },
  { tag: 'Setup', accent: '#e74c3c', emoji: '✍️', title: "Step 3: Open Your Brokerage Account.", body: "The process is usually online and takes 10-15 minutes:", bullets: ["1️⃣ Download the app or visit website", "2️⃣ Provide ID, PAN, bank details, address", "3️⃣ Complete KYC verification (video call usually)", "4️⃣ Link your bank account (for deposits)"], tip: "Save your login credentials safely. Two-factor authentication is essential." },
  { tag: 'Learning', accent: '#f39c12', emoji: '📚', title: "Step 4: Learn Before You Invest.", body: "Give yourself 2-4 weeks to learn basics without real money:", bullets: ["📖 Read investing books (Zerodha Academy, Investopedia)", "📊 Paper trading — practice trading without money", "🎓 Watch market analysis videos (CNBC, YouTube channels)", "💬 Join investor communities, ask questions"], tip: "The best investment is education. Time invested now saves thousands in mistakes later." },
  { tag: 'First Trade', accent: '#27ae60', emoji: '🎯', title: "Step 5: Start Small with Your First Trade.", body: "Don't go all-in. Your first investment should be small:", bullets: ["💰 Invest ₹1,000–₹5,000 in your first purchase", "🏢 Pick a well-known, stable company (HDFC, TCS, Reliance)", "📈 Or start with an index fund (Nifty 50, Sensex)", "⏱️ Hold for at least 2-3 years minimum"], tip: "First investments teach you reality — emotions, volatility, patience. ₹2,000 lost teaches better than ₹200,000." },
  { tag: 'Strategy', accent: '#9b59b6', emoji: '🔄', title: "Strategy: Dollar-Cost Averaging (DCA)", body: "Invest a fixed amount regularly (monthly) instead of lump sum. Reduces the impact of market timing mistakes.", bullets: ["Invest ₹2,000 every month for 5 years = ₹1,20,000", "Works in up AND down markets", "Less stressful than trying to 'time the market'", "Perfect for beginners"], tip: "Discipline beats intelligence in the market. Consistent investing beats trying to be a fortune-teller." },
  { tag: 'Strategy', accent: '#9b59b6', emoji: '🌍', title: "Strategy: Index Investing for Beginners", body: "Can't pick individual stocks? Buy an entire market segment:", bullets: ["Nifty 50 index fund = Top 50 Indian companies", "Sensex = BSE's 30-stock index", "Lower fees than actively managed funds", "Proven to beat 90% of active traders long-term"], tip: "Warren Buffett recommends index funds for most investors. You're in good company." },
  { tag: 'Mistakes', accent: '#e67e22', emoji: '❌', title: "Common Beginner Mistakes to Avoid", body: "Learn from others' mistakes:", bullets: ["🚫 Trading too much — it kills returns & increases taxes", "🚫 Following tips blindly — do your own research (DYOR)", "🚫 Emotional trading — panic selling & FOMO buying", "🚫 Ignoring diversification — concentration risk is deadly"], tip: "Every investor makes these once. Making them twice is expensive education." },
  { tag: 'Psychology', accent: '#16a085', emoji: '🧠', title: "Master Your Emotions", body: "Market swings 10%? Stocks crash 20%? Normal. Your emotional response? Either makes or breaks your wealth.", bullets: ["📉 During crashes: Hold or buy more (not panic sell)", "📈 During booms: Don't chase highs (not FOMO buy)", "⏰ Time in market > Timing the market", "💪 Confidence comes from preparation & patience"], tip: "The richest investors are boring. They hold through good years & bad years." },
  { tag: 'Tools', accent: '#2980b9', emoji: '🛠️', title: "Essential Tools & Resources", body: "Equip yourself with knowledge:", bullets: ["📊 NSE/BSE websites for company info", "📱 Your broker's analysis tools", "📺 YouTube channels: Akshat Shrivastav, CA Rachana Ranade", "📖 Books: 'The Intelligent Investor' by Benjamin Graham"], tip: "Your broker probably offers free research & webinars. Use them!" },
  { tag: 'Timeline', accent: '#d35400', emoji: '⏳', title: "Realistic Growth Timeline", body: "Don't expect overnight riches:", bullets: ["Year 1: Learn & build habits, expect 8-12% returns max", "Year 3: Compound growth starts kicking in", "Year 5+: Real wealth building begins, compounding magic", "Year 10+: Your money makes money makes money"], tip: "If someone promises 50% returns monthly, they're lying or scamming. Investing is a marathon." },
  { tag: 'Next Steps', accent: '#2ecc71', emoji: '🎯', title: "Your Action Plan", body: "From reading to action:", bullets: ["✅ Today: Understand your risk tolerance", "✅ This week: Research & open broker account", "✅ Next week: Start learning with paper trading", "✅ Month 2-3: Make your first real investment"], tip: "The best time to plant a tree was 10 years ago. Second best time is today. Start now!" },
  { tag: 'You\'re Ready!', accent: '#2ecc71', emoji: '🏆', title: "Welcome to the Stock Market!", body: "You've learned the roadmap. The real education starts now — through experience, mistakes, and persistence. Remember: every billionaire investor started exactly where you are right now.", tip: "Invest in yourself first. Read. Learn. Question everything. Your future self will thank you! 💪" },
];

let wtCurrent = 0;
let wtAnimating = false;
let currentWTSection = 'walkthrough'; // 'walkthrough', 'jargon', or 'beginners'

function getWTCards() {
  if (currentWTSection === 'jargon') return JARGON_CARDS;
  if (currentWTSection === 'beginners') return BEGINNERS_CARDS;
  return WT_CARDS;
}

function switchWTSection(section) {
  currentWTSection = section;
  wtCurrent = 0;
  renderWTCard();
  // Sync buttons on both the walkthrough section and the invest-panel section
  document.querySelectorAll('.wt-section-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === section);
  });
}

function renderWTCard() {
  const cards = getWTCards();
  const card = cards[wtCurrent];
  const el = document.getElementById('wt-card');
  const total = cards.length;

  // Progress
  const pct = Math.round(((wtCurrent + 1) / total) * 100);
  document.getElementById('wt-progress').style.width = pct + '%';
  document.getElementById('wt-step-label').textContent = `Card ${wtCurrent+1} of ${total}`;
  document.getElementById('wt-pct-label').textContent = pct + '% complete';

  // Dots
  const dotsEl = document.getElementById('wt-dots');
  dotsEl.innerHTML = '';
  cards.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'wt-dot' + (i === wtCurrent ? ' active' : '');
    d.style.background = i === wtCurrent ? card.accent : '';
    d.onclick = () => wtGoTo(i);
    dotsEl.appendChild(d);
  });

  // Buttons
  document.getElementById('wt-prev').disabled = wtCurrent === 0;
  document.getElementById('wt-next').disabled = wtCurrent === total - 1;
  document.getElementById('wt-next').textContent = wtCurrent === total - 1 ? '✓ Done' : 'Next →';

  // Build card HTML
  let inner = `
    <div class="wt-card-accent-bar" style="background:${card.accent}"></div>
    <div class="wt-tag" style="background:${card.accent}18;color:${card.accent};border-color:${card.accent}50">${card.tag}</div>
    <div class="wt-emoji">${card.emoji}</div>
    <h2>${card.title}</h2>
    <p>${card.body}</p>
  `;

  if (card.bullets) {
    inner += '<ul class="wt-bullets">' + card.bullets.map(b => `<li>${b}</li>`).join('') + '</ul>';
  }

  if (card.tip) {
    inner += `<div class="wt-tip" style="border-left-color:${card.accent};background:${card.accent}12;color:${card.accent}">${card.tip}</div>`;
  }

  inner += `<div class="wt-card-number">${wtCurrent+1} / ${total}</div>`;
  el.innerHTML = inner;
}

function wtGo(delta) {
  if (wtAnimating) return;
  const cards = getWTCards();
  const next = wtCurrent + delta;
  if (next < 0 || next >= cards.length) return;
  wtAnimating = true;

  const el = document.getElementById('wt-card');
  el.classList.add(delta > 0 ? 'exit-left' : 'exit-right');

  setTimeout(() => {
    el.classList.remove('exit-left', 'exit-right');
    wtCurrent = next;
    renderWTCard(delta);
    wtAnimating = false;
  }, 250);
}

function wtGoTo(idx) {
  if (idx === wtCurrent) return;
  wtGo(idx > wtCurrent ? 1 : -1);
  // For multi-step jump, use timeout chain
  if (Math.abs(idx - wtCurrent) > 1) {
    // Direct jump
    setTimeout(() => {
      wtCurrent = idx;
      renderWTCard(0);
    }, 300);
  }
}

// Keyboard
document.addEventListener('keydown', e => {
  const wt = document.getElementById('walkthrough');
  if (!wt.classList.contains('active')) return;
  if (e.key === 'ArrowRight') wtGo(1);
  if (e.key === 'ArrowLeft') wtGo(-1);
});

/* ══════════════════════════════════════
   SIP CALCULATOR — LEARN SECTION
══════════════════════════════════════ */
let sip500Rate = 12;
let customRate  = 12;

function calcSIP(monthly, annualRate, years) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return { invested: monthly * n, value: monthly * n };
  const value = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  return { invested: monthly * n, value: Math.round(value) };
}

function sipYearlyData(monthly, annualRate, maxYears) {
  const points = [];
  for (let y = 1; y <= maxYears; y++) {
    const { invested, value } = calcSIP(monthly, annualRate, y);
    points.push({ year: y, invested, value });
  }
  return points;
}

function renderSIPChart(svgId, labelsId, data) {
  const svg = document.getElementById(svgId);
  const labelsEl = document.getElementById(labelsId);
  if (!svg) return;

  const W = 500, H = 180, padL = 0, padR = 10, padT = 10, padB = 0;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxVal = Math.max(...data.map(d => d.value));

  const xScale = i => padL + (i / (data.length - 1)) * plotW;
  const yScale = v => padT + plotH - (v / maxVal) * plotH;

  // Invested area path
  let investedPath = `M ${xScale(0)} ${yScale(data[0].invested)}`;
  data.forEach((d, i) => { if (i > 0) investedPath += ` L ${xScale(i)} ${yScale(d.invested)}`; });
  investedPath += ` L ${xScale(data.length-1)} ${H} L ${xScale(0)} ${H} Z`;

  // Value area path
  let valuePath = `M ${xScale(0)} ${yScale(data[0].value)}`;
  data.forEach((d, i) => { if (i > 0) valuePath += ` L ${xScale(i)} ${yScale(d.value)}`; });
  valuePath += ` L ${xScale(data.length-1)} ${H} L ${xScale(0)} ${H} Z`;

  // Value line
  let valueLine = `M ${xScale(0)} ${yScale(data[0].value)}`;
  data.forEach((d, i) => { if (i > 0) valueLine += ` L ${xScale(i)} ${yScale(d.value)}`; });

  svg.innerHTML = `
    <defs>
      <linearGradient id="grad-val-${svgId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4a9b6f" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#4a9b6f" stop-opacity="0.03"/>
      </linearGradient>
      <linearGradient id="grad-inv-${svgId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#c9a96e" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#c9a96e" stop-opacity="0.03"/>
      </linearGradient>
    </defs>
    <path d="${valuePath}" fill="url(#grad-val-${svgId})"/>
    <path d="${investedPath}" fill="url(#grad-inv-${svgId})"/>
    <path d="${valueLine}" fill="none" stroke="#4a9b6f" stroke-width="2.5" stroke-linejoin="round"/>
  `;

  // X-axis labels: show every 5 years
  labelsEl.innerHTML = '';
  data.forEach((d, i) => {
    if (d.year === 1 || d.year % 5 === 0) {
      const span = document.createElement('span');
      span.textContent = `${d.year}y`;
      span.style.left = ((i / (data.length - 1)) * 100) + '%';
      labelsEl.appendChild(span);
    }
  });
}

function renderSIPStats(containerId, monthly, annualRate) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const milestones = [5, 10, 20];
  el.innerHTML = milestones.map(y => {
    const { invested, value } = calcSIP(monthly, annualRate, y);
    const gain = value - invested;
    return `
      <div class="sip-stat-card">
        <div class="sip-stat-year">${y} years</div>
        <div class="sip-stat-value">₹${fmtL(value)}</div>
        <div class="sip-stat-row">
          <span class="sip-stat-invested">Invested ₹${fmtL(invested)}</span>
          <span class="sip-stat-gain">+₹${fmtL(gain)}</span>
        </div>
      </div>`;
  }).join('');
}

function fmtL(n) {
  if (n >= 10000000) return (n/10000000).toFixed(1) + 'Cr';
  if (n >= 100000)   return (n/100000).toFixed(1) + 'L';
  if (n >= 1000)     return (n/1000).toFixed(1) + 'K';
  return Math.round(n).toLocaleString('en-IN');
}

function renderSIP500() {
  const data = sipYearlyData(500, sip500Rate, 20);
  renderSIPChart('sip500-chart', 'sip500-xlabels', data);
  renderSIPStats('sip500-stats', 500, sip500Rate);
  document.getElementById('sip500-rate').textContent = sip500Rate + '%';
}

function renderCustomCalc() {
  const monthly = Math.max(100, parseFloat(document.getElementById('custom-amount').value) || 500);
  document.getElementById('custom-title').textContent = `₹${fmtL(monthly)} / month`;
  const data = sipYearlyData(monthly, customRate, 20);
  renderSIPChart('custom-chart', 'custom-xlabels', data);
  renderSIPStats('custom-stats', monthly, customRate);
  document.getElementById('custom-rate').textContent = customRate + '%';
}

function changeSip500Rate(delta) {
  sip500Rate = Math.min(24, Math.max(4, sip500Rate + delta));
  renderSIP500();
}

function changeCustomRate(delta) {
  customRate = Math.min(24, Math.max(4, customRate + delta));
  renderCustomCalc();
}

/* ══════════════════════════════════════
   SURPLUS GROWTH — TRACKER PANEL
══════════════════════════════════════ */
let surplusRate = 12;

function renderSurplusPanel(surplus) {
  const el = document.getElementById('surplus-panel-body');
  if (!el) return;

  if (!surplus || surplus <= 0) {
    el.innerHTML = `
      <div class="surplus-empty">
        <div class="surplus-empty-icon">📈</div>
        <div class="surplus-empty-text">${surplus !== null && surplus <= 0
          ? "You're over budget this month — no surplus to invest. Review your expenses."
          : "Set a budget and log expenses — we'll show what your surplus could grow into."
        }</div>
      </div>`;
    return;
  }

  const milestones = [5, 10, 20];
  const statsHTML = milestones.map(y => {
    const { invested, value } = calcSIP(surplus, surplusRate, y);
    const gain = value - invested;
    return `
      <div class="sip-stat-card">
        <div class="sip-stat-year">${y} years</div>
        <div class="sip-stat-value">₹${fmtL(value)}</div>
        <div class="sip-stat-row">
          <span class="sip-stat-invested">In ₹${fmtL(invested)}</span>
          <span class="sip-stat-gain">+₹${fmtL(gain)}</span>
        </div>
      </div>`;
  }).join('');

  const data = sipYearlyData(surplus, surplusRate, 20);

  // Build chart SVG inline
  const W = 500, H = 140, padT = 10;
  const maxVal = Math.max(...data.map(d => d.value));
  const xScale = i => (i / (data.length - 1)) * 500;
  const yScale = v => padT + (130 - padT) - ((v / maxVal) * (130 - padT));

  let valuePath = `M ${xScale(0)} ${yScale(data[0].value)}`;
  data.forEach((d, i) => { if (i > 0) valuePath += ` L ${xScale(i)} ${yScale(d.value)}`; });
  let investPath = `M ${xScale(0)} ${yScale(data[0].invested)}`;
  data.forEach((d, i) => { if (i > 0) investPath += ` L ${xScale(i)} ${yScale(d.invested)}`; });
  const valueArea = valuePath + ` L 500 140 L 0 140 Z`;
  const investArea = investPath + ` L 500 140 L 0 140 Z`;

  el.innerHTML = `
    <div class="surplus-headline">
      If you invest your <strong>₹${fmt(surplus)}</strong> surplus every month:
    </div>
    <div class="invest-stats-row" style="margin-bottom:16px;">${statsHTML}</div>
    <div class="invest-chart-wrap" style="margin-bottom:12px;">
      <svg class="invest-chart-svg" viewBox="0 0 500 140" preserveAspectRatio="none" style="height:120px;">
        <defs>
          <linearGradient id="sg-val" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#4a9b6f" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#4a9b6f" stop-opacity="0.03"/>
          </linearGradient>
          <linearGradient id="sg-inv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#c9a96e" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#c9a96e" stop-opacity="0.03"/>
          </linearGradient>
        </defs>
        <path d="${valueArea}" fill="url(#sg-val)"/>
        <path d="${investArea}" fill="url(#sg-inv)"/>
        <path d="${valuePath}" fill="none" stroke="#4a9b6f" stroke-width="2.5" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="surplus-rate-row">
      <span class="invest-rate-label">Return rate assumption</span>
      <div class="invest-rate-controls">
        <button class="invest-rate-btn" onclick="changeSurplusRate(-2)">−</button>
        <span class="invest-rate-val" id="surplus-rate-val">${surplusRate}%</span>
        <button class="invest-rate-btn" onclick="changeSurplusRate(2)">+</button>
      </div>
    </div>
    <div class="invest-disclaimer" style="margin-top:12px;">Based on ₹${fmt(surplus)}/mo at ${surplusRate}% p.a. Projections only — not financial advice.</div>
    <a class="invest-cta-btn" style="margin-top:12px;" href="https://zerodha.com" target="_blank" rel="noopener">Open a Demat Account — Start Investing →</a>
  `;
}

function changeSurplusRate(delta) {
  surplusRate = Math.min(24, Math.max(4, surplusRate + delta));
  // Re-render tracker to pick up new rate
  renderTracker();
}

/* ══════════════════════════════════════
   TRACKER
══════════════════════════════════════ */
let selectedCat = 'need';

function selectCat(cat) {
  selectedCat = cat;
  document.querySelectorAll('.cat-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === cat);
  });
}

function getMonthExpenses() {
  return appData.expenses.filter(e => e.date && e.date.startsWith(currentMonth));
}

function saveBudget() {
  const val = parseFloat(document.getElementById('budget-input').value);
  if (isNaN(val) || val <= 0) { showToast('Enter a valid budget amount'); return; }
  appData.budgets[currentMonth] = val;
  saveData(appData);
  renderTracker();
  showToast(`Budget set to ₹${fmt(val)}`);
}

function addExpense() {
  const date = document.getElementById('exp-date').value;
  const amount = parseFloat(document.getElementById('exp-amount').value);
  const desc = document.getElementById('exp-desc').value.trim();
  const place = document.getElementById('exp-place').value.trim();
  const subcategory = document.getElementById('exp-subcategory').value;

  if (!date) { showToast('Please pick a date'); return; }
  if (!amount || amount <= 0) { showToast('Enter a valid amount'); return; }
  if (!desc) { showToast('Add a description'); return; }
  if (!subcategory) { showToast('Select a category'); return; }

  const expense = {
    id: Date.now(),
    date, amount, desc, place: place || '—', subcategory,
    cat: selectedCat
  };

  appData.expenses.push(expense);
  saveData(appData);

  // Reset form (keep date & cat)
  document.getElementById('exp-amount').value = '';
  document.getElementById('exp-desc').value = '';
  document.getElementById('exp-place').value = '';
  document.getElementById('exp-subcategory').value = '';

  // Update month to match entry date
  currentMonth = date.slice(0,7);
  renderTracker();
  showToast('Expense added ✓');
}

function deleteExpense(id) {
  appData.expenses = appData.expenses.filter(e => e.id !== id);
  saveData(appData);
  renderTracker();
  showToast('Deleted');
}

function changeMonth(delta) {
  const [y, m] = currentMonth.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  currentMonth = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0');
  renderTracker();
}

function fmt(n) {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function renderTracker() {
  const expenses = getMonthExpenses();
  const budget = appData.budgets[currentMonth] || 0;

  // Month label
  const [y, m] = currentMonth.split('-');
  const monthName = new Date(y, m-1, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  document.getElementById('month-label').textContent = monthName;

  // Budget input pre-fill
  if (budget) document.getElementById('budget-input').value = budget;

  // Totals
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const needAmt = expenses.filter(e => e.cat === 'need').reduce((s, e) => s + e.amount, 0);
  const wantAmt = expenses.filter(e => e.cat === 'want').reduce((s, e) => s + e.amount, 0);
  const extraAmt = expenses.filter(e => e.cat === 'extra').reduce((s, e) => s + e.amount, 0);
  const remaining = budget ? budget - totalSpent : null;

  // Summary cards
  document.getElementById('sc-budget').textContent = budget ? `₹${fmt(budget)}` : '₹—';
  document.getElementById('sc-spent').textContent = `₹${fmt(totalSpent)}`;
  document.getElementById('sc-remaining').textContent = remaining !== null ? `₹${fmt(remaining)}` : '₹—';

  const needPct = totalSpent ? Math.round(needAmt/totalSpent*100) : 0;
  const wantPct = totalSpent ? Math.round(wantAmt/totalSpent*100) : 0;
  document.getElementById('sc-ratio').textContent = totalSpent ? `${needPct}% / ${wantPct}%` : '—';

  // Breakdown bars
  document.getElementById('bar-need-amt').textContent = `₹${fmt(needAmt)}`;
  document.getElementById('bar-want-amt').textContent = `₹${fmt(wantAmt)}`;
  document.getElementById('bar-extra-amt').textContent = `₹${fmt(extraAmt)}`;
  const maxAmt = Math.max(needAmt, wantAmt, extraAmt, 1);
  document.getElementById('bar-need-fill').style.width = (needAmt/maxAmt*100) + '%';
  document.getElementById('bar-want-fill').style.width = (wantAmt/maxAmt*100) + '%';
  document.getElementById('bar-extra-fill').style.width = (extraAmt/maxAmt*100) + '%';

  // Donut chart
  renderDonut(needAmt, wantAmt, extraAmt, totalSpent);

  // Category breakdown
  renderCatBreakdown(expenses, totalSpent);

  // Expense table
  renderTable(expenses);

  // Smart tips
  renderTips(expenses, totalSpent, budget, needAmt, wantAmt, extraAmt);

  // Surplus growth panel
  renderSurplusPanel(remaining);
}

function renderDonut(need, want, extra, total) {
  const svg = document.getElementById('donut-svg');
  const legend = document.getElementById('donut-legend');

  // Remove old slices
  svg.querySelectorAll('.donut-slice').forEach(el => el.remove());

  if (total === 0) {
    legend.innerHTML = '<div style="font-family:\'JetBrains Mono\',monospace;font-size:11px;color:var(--muted);text-align:center;padding:20px 0;">No data yet. Add some expenses!</div>';
    return;
  }

  const slices = [
    { label: 'Needs', amt: need, color: '#4a9b6f' },
    { label: 'Wants', amt: want, color: '#2c6fad' },
    { label: 'Additional', amt: extra, color: '#d4851a' },
  ].filter(s => s.amt > 0);

  const cx = 65, cy = 65, r = 52, strokeW = 18;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  slices.forEach(s => {
    const pct = s.amt / total;
    const dash = pct * circumference;
    const gap = circumference - dash;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('class', 'donut-slice');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', s.color);
    circle.setAttribute('stroke-width', strokeW);
    circle.setAttribute('stroke-dasharray', `${dash} ${gap}`);
    circle.setAttribute('stroke-dashoffset', -offset * circumference);
    circle.setAttribute('transform', 'rotate(-90 65 65)');
    svg.appendChild(circle);
    offset += pct;
  });

  // Legend
  legend.innerHTML = slices.map(s => {
    const pct = Math.round(s.amt / total * 100);
    return `<div class="donut-item">
      <div class="donut-dot" style="background:${s.color}"></div>
      <div class="donut-item-label">${s.label}</div>
      <div class="donut-item-pct">${pct}%</div>
      <div class="donut-item-amt">₹${fmt(s.amt)}</div>
    </div>`;
  }).join('');
}

function renderCatBreakdown(expenses, total) {
  const el = document.getElementById('cat-breakdown');
  if (!expenses.length) { el.innerHTML = '<div style="color:var(--muted);font-size:13px;font-family:\'JetBrains Mono\',monospace;">No data yet.</div>'; return; }

  const cats = {};
  expenses.forEach(e => {
    cats[e.subcategory] = (cats[e.subcategory] || 0) + e.amount;
  });

  const sorted = Object.entries(cats).sort((a,b) => b[1] - a[1]).slice(0, 5);
  const max = sorted[0][1];

  el.innerHTML = sorted.map(([cat, amt]) => `
    <div class="breakdown-bar-wrap">
      <div class="breakdown-bar-meta">
        <div class="breakdown-bar-name">${cat}</div>
        <div class="breakdown-bar-amount">₹${fmt(amt)}</div>
      </div>
      <div class="breakdown-bar">
        <div class="breakdown-bar-fill" style="width:${amt/max*100}%;background:var(--warm)"></div>
      </div>
    </div>
  `).join('');
}

function renderTable(expenses) {
  const tbody = document.getElementById('expense-tbody');
  if (!expenses.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-state-icon">🧾</div><div class="empty-state-text">No expenses for this month yet.</div></div></td></tr>`;
    return;
  }

  const sorted = [...expenses].sort((a,b) => new Date(b.date) - new Date(a.date));

  tbody.innerHTML = sorted.map(e => {
    const dateStr = new Date(e.date + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short' });
    const catLabel = e.cat === 'need' ? 'Need' : e.cat === 'want' ? 'Want' : 'Extra';
    return `<tr>
      <td style="color:var(--muted);font-family:'JetBrains Mono',monospace;font-size:12px;">${dateStr}</td>
      <td>${e.desc}</td>
      <td style="color:var(--muted);">${e.place}</td>
      <td style="color:var(--muted);font-size:12px;">${e.subcategory}</td>
      <td><span class="cat-badge ${e.cat}">${catLabel}</span></td>
      <td class="amount-cell">₹${fmt(e.amount)}</td>
      <td><button class="delete-btn" onclick="deleteExpense(${e.id})" title="Delete">×</button></td>
    </tr>`;
  }).join('');
}

function renderTips(expenses, totalSpent, budget, need, want, extra) {
  const el = document.getElementById('smart-tips');
  const tips = [];

  if (!expenses.length) {
    el.innerHTML = `<div class="tip-card"><div class="tip-card-label">💡 Getting Started</div><div class="tip-card-text">Add your first expense and set a monthly budget — we'll give you personalised saving tips based on where you're spending.</div></div>`;
    return;
  }

  // Over budget
  if (budget && totalSpent > budget) {
    const over = totalSpent - budget;
    tips.push({ label: '⚠️ Over Budget!', text: `You've exceeded your budget by ₹${fmt(over)} this month. Try cooking at home more often and cutting back on wants for the remaining days.` });
  }

  // High want spending
  const wantPct = totalSpent ? (want / totalSpent * 100) : 0;
  if (wantPct > 40) {
    tips.push({ label: '💙 High "Want" Spending', text: `${Math.round(wantPct)}% of your spending is on wants. The 50/30/20 rule suggests keeping wants under 30%. Review your entertainment and dining habits.` });
  }

  // Category-specific tips
  const cats = {};
  expenses.forEach(e => { cats[e.subcategory] = (cats[e.subcategory] || 0) + e.amount; });

  if (cats['Food & Dining'] && totalSpent && cats['Food & Dining'] / totalSpent > 0.25) {
    tips.push({ label: '🍽️ Dining Costs', text: `Food & Dining is ₹${fmt(cats['Food & Dining'])} — that's ${Math.round(cats['Food & Dining']/totalSpent*100)}% of your spending. Meal-prepping just twice a week can cut this significantly.` });
  }

  if (cats['Subscriptions'] && cats['Subscriptions'] > 500) {
    tips.push({ label: '📺 Subscriptions', text: `You're spending ₹${fmt(cats['Subscriptions'])} on subscriptions. Check which ones you actually used this month — cancel the rest and look for student pricing.` });
  }

  if (cats['Entertainment'] && totalSpent && cats['Entertainment'] / totalSpent > 0.2) {
    tips.push({ label: '🎬 Entertainment Budget', text: `Entertainment is ${Math.round(cats['Entertainment']/totalSpent*100)}% of your spending. Look for student discounts, free campus events, or set a weekly entertainment cap.` });
  }

  // Good habits
  if (budget && totalSpent < budget * 0.8) {
    tips.push({ label: '🎉 Great Work!', text: `You're on track — only ₹${fmt(totalSpent)} of your ₹${fmt(budget)} budget used. Consider putting the surplus into an emergency fund or savings.` });
  }

  if (extra > 0) {
    tips.push({ label: '✨ Review Extras', text: `You have ₹${fmt(extra)} in "additional" spending this month. Review these entries — could any have been avoided? Small extras add up fast over a semester.` });
  }

  if (!tips.length) {
    tips.push({ label: '✅ Looking Good', text: `Your spending looks balanced this month. Keep logging daily to stay aware and spot any creeping habits before they grow.` });
  }

  el.innerHTML = tips.map(t => `
    <div class="tip-card">
      <div class="tip-card-label">${t.label}</div>
      <div class="tip-card-text">${t.text}</div>
    </div>
  `).join('');
}

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
// Set today's date as default
document.getElementById('exp-date').valueAsDate = new Date();

// Render walkthrough
renderWTCard(0);

// Init tracker month label
const [iy, im] = currentMonth.split('-');
document.getElementById('month-label').textContent = new Date(iy, im-1, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

/* ══════════════════════════════════════
   FINANCIAL TWIN — AI CHATBOT
   (Gemini-powered, reads live appData)
══════════════════════════════════════ */
let chatHistory  = [];
let chatOpened   = false;
let aiThinking   = false;

function toggleChat() {
  const panel = document.getElementById('ai-panel');
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) {
    if (!chatOpened) {
      chatOpened = true;
      openingAnalysis();
    }
    setTimeout(() => document.getElementById('ai-input').focus(), 300);
  }
}

function buildSystemPrompt() {
  const monthExpenses = getMonthExpenses();
  const budget = appData.budgets[currentMonth] || null;
  const totalSpent = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const byCat = {};
  monthExpenses.forEach(e => { byCat[e.subcategory] = (byCat[e.subcategory] || 0) + e.amount; });
  const needAmt  = monthExpenses.filter(e => e.cat === 'need').reduce((s, e) => s + e.amount, 0);
  const wantAmt  = monthExpenses.filter(e => e.cat === 'want').reduce((s, e) => s + e.amount, 0);
  const extraAmt = monthExpenses.filter(e => e.cat === 'extra').reduce((s, e) => s + e.amount, 0);

  const now = new Date();
  const lastDay  = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = lastDay - now.getDate();
  const daysPassed = now.getDate();
  const dailyAvg = daysPassed > 0 ? totalSpent / daysPassed : 0;

  return `You are "Financial Twin" — a sharp, warm personal finance advisor inside CampusCents, a student budgeting app. You have FULL ACCESS to this student's real spending data. Never say you don't have their data.

TODAY: ${now.toDateString()}
CURRENT MONTH: ${currentMonth} (${daysPassed} days in, ${daysLeft} days left)
BUDGET: ${budget ? '₹' + budget : 'Not set'}
TOTAL SPENT: ₹${totalSpent.toFixed(0)}
REMAINING: ${budget ? '₹' + (budget - totalSpent).toFixed(0) : 'Budget not set'}
DAILY AVERAGE: ₹${dailyAvg.toFixed(0)}/day
PROJECTED MONTH-END: ₹${(dailyAvg * lastDay).toFixed(0)}

SPENDING BY TYPE:
• Needs: ₹${needAmt.toFixed(0)} (${totalSpent ? Math.round(needAmt / totalSpent * 100) : 0}%)
• Wants: ₹${wantAmt.toFixed(0)} (${totalSpent ? Math.round(wantAmt / totalSpent * 100) : 0}%)
• Additional: ₹${extraAmt.toFixed(0)} (${totalSpent ? Math.round(extraAmt / totalSpent * 100) : 0}%)

TOP CATEGORIES:
${Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(x => '• ' + x[0] + ': ₹' + x[1].toFixed(0)).join('\n')}

ALL EXPENSES THIS MONTH:
${monthExpenses.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).map(e => `• ${e.date} | ₹${e.amount} | ${e.subcategory} | ${e.cat} | "${e.desc}" @ ${e.place}`).join('\n')}

RULES: Be specific with their real numbers. Be concise (2-4 sentences). Be direct and warm. Use ₹. Do the actual math when they ask about affording something. Never say "As an AI" or "I don't have access".`;
}

function appendMessage(role, text) {
  const msgs = document.getElementById('ai-messages');
  const div = document.createElement('div');
  div.className = 'ai-msg ' + role;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function appendTyping() {
  const msgs = document.getElementById('ai-messages');
  const div = document.createElement('div');
  div.className = 'ai-msg typing';
  div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

const GEMINI_API_KEY = "AIzaSyDRfxmhv0bHpOydRYOGyIkkCt9WoPTp04A";

async function callGemini(promptText) {
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: promptText }] }]
      })
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error((data.error && data.error.message) || 'Gemini API error');
  return (data.candidates?.[0]?.content?.parts?.[0]?.text) || 'No response.';
}

async function openingAnalysis() {
  const typing = appendTyping();
  const monthExpenses = getMonthExpenses();
  const taskPrompt = monthExpenses.length > 0
    ? "Give a sharp, specific 2-3 sentence opening analysis of this student's spending this month. Use their real numbers. Lead with the single most important insight. End with one focused practical question."
    : "The student hasn't logged any expenses yet. In 2 sentences, tell them specifically what insights you'll surface once they start logging — make it feel genuinely useful. Then ask them one question to get started.";
  try {
    const text = await callGemini(buildSystemPrompt() + '\n\nYour task: ' + taskPrompt);
    typing.remove();
    appendMessage('ai', text);
    chatHistory = [{ role: 'user', content: taskPrompt }, { role: 'assistant', content: text }];
  } catch (err) {
    typing.remove();
    appendMessage('ai', "Hi! I'm your Financial Twin. I can see all your spending data and give you personalised insights. What would you like to know?");
  }
}

async function sendToAI(text) {
  if (aiThinking) return;
  aiThinking = true;
  document.getElementById('ai-send').disabled = true;
  appendMessage('user', text);
  chatHistory.push({ role: 'user', content: text });
  const typing = appendTyping();
  try {
    const conversation = chatHistory.map(m => m.role.toUpperCase() + ': ' + m.content).join('\n');
    const reply = await callGemini(
      buildSystemPrompt() + '\n\nConversation so far:\n' + conversation + '\n\nNow reply as Financial Twin to the last USER message:'
    );
    typing.remove();
    appendMessage('ai', reply);
    chatHistory.push({ role: 'assistant', content: reply });
  } catch (err) {
    typing.remove();
    appendMessage('ai', 'Could not reach Gemini right now. Check the API key and network connection.');
  }
  aiThinking = false;
  document.getElementById('ai-send').disabled = false;
}

function sendAIMessage() {
  const input = document.getElementById('ai-input');
  const text = input.value.trim();
  if (!text || aiThinking) return;
  input.value = '';
  sendToAI(text);
}

function askQuick(prompt) {
  if (aiThinking) return;
  document.getElementById('ai-quick-prompts').style.display = 'none';
  sendToAI(prompt);
}

// Enter key to send
document.getElementById('ai-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendAIMessage();
});
