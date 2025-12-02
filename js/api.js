/* api.js
   TheMealDB integration helper.
   - Public endpoints (no key)
   - Functions return parsed meal objects
   - Includes safeFetch with timeout & error handling
*/

const api = (function () {
  const BASE = 'https://www.themealdb.com/api/json/v1/1';

  // Safe fetch wrapper with timeout
  async function safeFetch(url, timeout = 8000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) throw new Error('Network not ok: ' + res.status);
      return await res.json();
    } catch (err) {
      clearTimeout(id);
      console.error('safeFetch error:', err);
      throw err;
    }
  }

  // Get one random meal
  async function getRandomMeal() {
    const data = await safeFetch(`${BASE}/random.php`);
    if (!data || !data.meals) return null;
    return data.meals[0];
  }

  // Get N random meals, optionally filter by category
  async function getRandomMeals(n = 3, category = '') {
    const output = [];
    // If category provided, use filter endpoint
    if (category) {
      try {
        const list = await safeFetch(`${BASE}/filter.php?c=${encodeURIComponent(category)}`);
        if (!list || !list.meals || list.meals.length === 0) return [];
        for (let i = 0; i < n; i++) {
          const choice = list.meals[Math.floor(Math.random() * list.meals.length)];
          const full = await safeFetch(`${BASE}/lookup.php?i=${choice.idMeal}`);
          if (full && full.meals) output.push(full.meals[0]);
        }
        return output;
      } catch (err) {
        console.warn('Category fetch failed, fallback to random', err);
      }
    }

    // fallback: N random fetches
    for (let i = 0; i < n; i++) {
      const meal = await getRandomMeal();
      if (meal) output.push(meal);
    }
    return output;
  }

  // Extract ingredients
  function extractIngredients(meal) {
    if (!meal) return [];
    const list = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ing && ing.trim()) list.push({ ingredient: ing.trim(), measure: (measure || '').trim() });
    }
    return list;
  }

  function extractIngredientsHtml(meal) {
    const items = extractIngredients(meal);
    if (!items.length) return '<li>No ingredients</li>';
    return items.map(it => `<li>${it.ingredient} — ${it.measure}</li>`).join('');
  }

  return {
    getRandomMeal,
    getRandomMeals,
    extractIngredients,
    extractIngredientsHtml
  };
})();
