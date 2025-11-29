/* dashboard.js
   Page-specific logic for dashboard.html
   - water add/remove
   - save sleep & steps
   - mood selection
   - logs add/clear
   - weekly overview render
*/

(function () {
  const { loadState, saveState, todayKey } = window.HealthApp;

  document.addEventListener('DOMContentLoaded', () => {
    let state = loadState();

    // Ensure today's records exist
    function ensureToday() {
      const t = todayKey();
      if (!state.water || state.water.date !== t) state.water = { date: t, glasses: 0 };
      if (!state.sleep || state.sleep.date !== t) state.sleep = { date: t, hours: 0 };
      if (!state.steps || state.steps.date !== t) state.steps = { date: t, steps: 0 };
      if (!state.mood || state.mood.date !== t) state.mood = { date: t, mood: null };
      if (!state.logs) state.logs = {};
    }
    ensureToday();

    // Elements
    const waterCount = document.getElementById('waterCount');
    const waterProgress = document.getElementById('waterProgress');
    const addWater = document.getElementById('addWater');
    const subWater = document.getElementById('subWater');

    const sleepInput = document.getElementById('sleepInput');
    const saveSleep = document.getElementById('saveSleep');
    const sleepHours = document.getElementById('sleepHours');

    const stepsInput = document.getElementById('stepsInput');
    const saveSteps = document.getElementById('saveSteps');
    const stepsCount = document.getElementById('stepsCount');

    const moodBtns = document.querySelectorAll('.mood-btn');
    const currentMood = document.getElementById('currentMood');

    const logForm = document.getElementById('logForm');
    const logText = document.getElementById('logText');
    const logsList = document.getElementById('logsList');
    const clearLogs = document.getElementById('clearLogs');

    const weeklyGrid = document.getElementById('weeklyGrid');

    function renderWater() {
      waterCount.textContent = state.water.glasses || 0;
      const pct = Math.min(100, Math.round((state.water.glasses / 8) * 100));
      waterProgress.style.width = pct + '%';
    }

    addWater.addEventListener('click', () => {
      state.water.glasses = (state.water.glasses || 0) + 1;
      saveState(state);
      renderWater();
    });
    subWater.addEventListener('click', () => {
      state.water.glasses = Math.max(0, (state.water.glasses || 0) - 1);
      saveState(state);
      renderWater();
    });

    // Sleep
    sleepHours.textContent = state.sleep.hours || 0;
    saveSleep.addEventListener('click', () => {
      const val = parseFloat(sleepInput.value);
      if (isNaN(val) || val < 0) return alert('Enter valid hours');
      state.sleep.hours = val;
      saveState(state);
      sleepInput.value = '';
      sleepHours.textContent = val;
      renderWeekly();
    });

    // Steps
    stepsCount.textContent = state.steps.steps || 0;
    saveSteps.addEventListener('click', () => {
      const val = parseInt(stepsInput.value, 10);
      if (isNaN(val) || val < 0) return alert('Enter valid steps');
      state.steps.steps = val;
      saveState(state);
      stepsInput.value = '';
      stepsCount.textContent = val;
      renderWeekly();
    });

    // Mood
    currentMood.textContent = state.mood.mood || '—';
    moodBtns.forEach(b => b.addEventListener('click', () => {
      const mood = b.dataset.mood;
      state.mood = { date: todayKey(), mood };
      saveState(state);
      currentMood.textContent = mood;
      renderWeekly();
    }));

    // Logs
    function renderLogs() {
      const key = todayKey();
      const list = state.logs && state.logs[key] ? state.logs[key] : [];
      logsList.innerHTML = '';
      list.forEach((l) => {
        const li = document.createElement('li');
        li.textContent = l;
        logsList.appendChild(li);
      });
    }

    logForm && logForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const txt = logText.value.trim();
      if (!txt) return;
      const key = todayKey();
      state.logs[key] = state.logs[key] || [];
      state.logs[key].unshift(txt);
      saveState(state);
      logText.value = '';
      renderLogs();
      renderWeekly();
    });

    clearLogs && clearLogs.addEventListener('click', () => {
      if (!confirm('Clear logs for today?')) return;
      const key = todayKey();
      state.logs[key] = [];
      saveState(state);
      renderLogs();
    });

    // Weekly overview (last 7 days)
    function renderWeekly() {
      weeklyGrid.innerHTML = '';
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0,10);
        const label = d.toLocaleDateString(undefined, { weekday: 'short' });
        const w = (state.water && state.water.date === key) ? state.water.glasses : (state.weekly[key] && state.weekly[key].water) || 0;
        const s = (state.sleep && state.sleep.date === key) ? state.sleep.hours : 0;
        const mood = (state.mood && state.mood.date === key) ? state.mood.mood : '—';
        const div = document.createElement('div');
        div.className = 'day';
        div.innerHTML = `<strong>${label}</strong><div class="muted small">W:${w} • S:${s} • ${mood}</div>`;
        weeklyGrid.appendChild(div);
      }
    }

    // Initial render
    renderWater();
    renderLogs();
    renderWeekly();
  });
})();
