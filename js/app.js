/* app.js
   Core app utilities:
   - localStorage schema (single key)
   - theme handling
   - BMI calculation + storage
   - small shared UI initializations for pages
*/

(function () {
  const STORAGE_KEY = 'health_planner_v2';

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  const defaultState = {
    bmi: null,
    water: { date: todayKey(), glasses: 0 },
    sleep: { date: todayKey(), hours: 0 },
    steps: { date: todayKey(), steps: 0 },
    mood: { date: todayKey(), mood: null },
    logs: {}, // date -> [entries]
    weekly: {},
    theme: 'light',
    reminders: []
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(defaultState);
      const parsed = JSON.parse(raw);
      return Object.assign(structuredClone(defaultState), parsed);
    } catch (err) {
      console.error('loadState error', err);
      return structuredClone(defaultState);
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('saveState error', err);
    }
  }

  function resetState() {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }

  function applyTheme(theme) {
    if (theme === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }

  function calcBMI(kg, cm) {
    const m = cm / 100;
    const bmi = kg / (m * m);
    return Math.round(bmi * 10) / 10;
  }

  function bmiCategory(val) {
    if (val < 18.5) return 'Underweight';
    if (val < 25) return 'Normal';
    if (val < 30) return 'Overweight';
    return 'Obese';
  }

  // Expose for other pages
  window.HealthApp = {
    STORAGE_KEY,
    todayKey,
    loadState,
    saveState,
    resetState,
    applyTheme,
    calcBMI
  };

  // Init UI across pages
  document.addEventListener('DOMContentLoaded', () => {
    const state = loadState();

    // Years
    document.querySelectorAll('#year, #year2, #year3').forEach(el => {
      if (el) el.textContent = new Date().getFullYear();
    });

    // theme toggles
    document.querySelectorAll('#themeToggle, #themeToggle2, #themeToggle3').forEach(btn => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        const s = loadState();
        s.theme = s.theme === 'dark' ? 'light' : 'dark';
        saveState(s);
        applyTheme(s.theme);
      });
    });

    applyTheme(state.theme);

    // Reset buttons
    document.querySelectorAll('#resetData, #resetData2').forEach(b => {
      if (b) b.addEventListener('click', () => {
        if (confirm('Reset all saved data?')) resetState();
      });
    });

    // Home: BMI interactions
    const bmiForm = document.getElementById('bmiForm');
    const bmiResult = document.getElementById('bmiResult');
    if (bmiResult && state.bmi) {
      bmiResult.textContent = `Saved: ${state.bmi.value} — ${state.bmi.category}`;
    }

    if (bmiForm) {
      bmiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const kg = parseFloat(document.getElementById('weight').value);
        const cm = parseFloat(document.getElementById('height').value);
        if (!kg || !cm) {
          bmiResult.textContent = 'Please enter valid numbers.';
          return;
        }
        const value = calcBMI(kg, cm);
        const category = bmiCategory(value);
        const s = loadState();
        s.bmi = { value, category, at: new Date().toISOString() };
        saveState(s);
        bmiResult.textContent = `BMI: ${value} — ${category}`;
      });
    }

    // Home quick stats
    const waterEl = document.getElementById('todayWater');
    const sleepEl = document.getElementById('todaySleep');
    const moodEl = document.getElementById('todayMood');
    const st = loadState();
    if (waterEl) waterEl.textContent = (st.water && st.water.date === todayKey()) ? st.water.glasses : 0;
    if (sleepEl) sleepEl.textContent = (st.sleep && st.sleep.date === todayKey()) ? st.sleep.hours : 0;
    if (moodEl) moodEl.textContent = (st.mood && st.mood.date === todayKey()) ? (st.mood.mood || '—') : '—';
  });
})();
