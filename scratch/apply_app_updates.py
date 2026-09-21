import json
from pathlib import Path

BASE_DIR = Path("H:/Waste2Menu-AI")
APP_JS = BASE_DIR / "app.js"
SEED_JSON = BASE_DIR / "seed_data.json"

# Load and enrich seed data
seed_data = json.load(SEED_JSON.open(encoding="utf-8"))
scraps_map = {s["id"]: s for s in seed_data["scraps"]}
recipes = seed_data["recipes"]
for r in recipes:
    sc = scraps_map.get(r["scrap_id"], {})
    r["scrap_name_en"] = sc.get("name_en", "")
    r["scrap_name_regional"] = sc.get("name_regional", "")

dispatches = seed_data.get("dispatches", [])

content = APP_JS.read_text(encoding="utf-8")

# 1. Prepare Fallback datasets JS
fallback_block = f"""  // ==========================================================================
  // STATIC GIT DEPLOYMENT & OFFLINE FALLBACK DATASETS
  // ==========================================================================
  const FALLBACK_RECIPES = {json.dumps(recipes, indent=2)};

  const FALLBACK_DISPATCHES = {json.dumps(dispatches, indent=2)};

  function getStoredOrFallbackRecipes() {{
    try {{
      const stored = localStorage.getItem('waste2menu_recipes');
      if (stored) {{
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 30) return parsed;
      }}
    }} catch (e) {{}}
    return FALLBACK_RECIPES.slice();
  }}

  function getStoredOrFallbackDispatches() {{
    try {{
      const stored = localStorage.getItem('waste2menu_dispatches');
      if (stored) {{
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }}
    }} catch (e) {{}}
    return FALLBACK_DISPATCHES.slice();
  }}
"""

# Insert fallback block right before "  // Application State"
target_state_comment = "  // Application State\n  const state = {"
assert target_state_comment in content, "Could not find target_state_comment"

new_state_block = f"""{fallback_block}
  // Application State
  const state = {{
    currentUser: null,
    activeTab: 'home-overview',
    categories: CATEGORIES_METADATA.slice(),
    scraps: INGREDIENTS_DATA.slice(),
    recipes: getStoredOrFallbackRecipes(),
    dispatches: getStoredOrFallbackDispatches(),"""

old_state_block = """  // Application State
  const state = {
    currentUser: null,
    activeTab: 'home-overview',
    categories: CATEGORIES_METADATA.slice(),
    scraps: INGREDIENTS_DATA.slice(),
    recipes: [],
    dispatches: [],"""

assert old_state_block in content, "Could not find old_state_block in app.js"
content = content.replace(old_state_block, new_state_block, 1)

# 2. Update init() to call handleRouteFromHash()
old_init = """  async function init() {
    loadSavedSession();
    setupEventListeners();
    renderAuthHeader();
    updateNavbarVisibility();
    await loadInitialData();
  }"""

new_init = """  async function init() {
    loadSavedSession();
    setupEventListeners();
    renderAuthHeader();
    updateNavbarVisibility();
    await loadInitialData();
    handleRouteFromHash();
  }"""
assert old_init in content, "Could not find old_init in app.js"
content = content.replace(old_init, new_init, 1)

# 3. Update setupEventListeners to handle nav buttons with preventDefault, and add hashchange/popstate listeners
old_nav_listeners = """    // Top Navigation Tabs
    DOM.navTabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        switchTab(tab);
      });
    });"""

new_nav_listeners = """    // Top Navigation Tabs (Changes Git Deploy Link in Address Bar)
    DOM.navTabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.dataset.tab;
        switchTab(tab, true);
      });
    });

    // Hash & History Routing (Support Direct Links & Browser Back/Forward on Git Deploy)
    window.addEventListener('hashchange', () => {
      handleRouteFromHash();
    });
    window.addEventListener('popstate', () => {
      handleRouteFromHash();
    });"""

assert old_nav_listeners in content, "Could not find old_nav_listeners in app.js"
content = content.replace(old_nav_listeners, new_nav_listeners, 1)

# 4. Update switchTab and add handleRouteFromHash
old_switch_tab = """  function switchTab(tabId) {
    if (tabId === 'master-chef') {
      if (state.currentUser && state.currentUser.role === 'home_chef') {
        showToast('Recipe authoring & upload is exclusive to Master Chefs. Home Chefs can explore and cook all recipes!', 'info');
        switchTab('home-chef');
        return;
      }
      if (!state.currentUser || state.currentUser.role !== 'master_chef') {
        showToast('Master Chef recipe authoring studio is available after signing in as Master Chef.', 'info');
        openAuthModal();
        return;
      }
    }

    state.activeTab = tabId;

    DOM.navTabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    DOM.tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `panel-${tabId}`);
    });

    // Check Master Chef permissions
    if (tabId === 'master-chef') {
      const isMaster = state.currentUser && state.currentUser.role === 'master_chef';
      DOM.chefRoleBanner.style.display = isMaster ? 'none' : 'flex';
      renderMasterChefScrapsSelector();
    }

    if (tabId === 'home-overview') {
      renderAncestralShowcase();
      animateMetricCounters();
    }

    if (tabId === 'home-chef') {
      applyFiltersAndRenderRecipes();
    }

    if (tabId === 'ngo-dispatch') {
      renderDispatchesFeed();
    }

    if (tabId === 'scraps-matrix') {
      renderCategorizedCatalog();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }"""

new_switch_tab = """  function switchTab(tabId, updateHash = true) {
    if (tabId === 'master-chef') {
      if (state.currentUser && state.currentUser.role === 'home_chef') {
        showToast('Recipe authoring & upload is exclusive to Master Chefs. Home Chefs can explore and cook all recipes!', 'info');
        switchTab('home-chef', updateHash);
        return;
      }
      if (!state.currentUser || state.currentUser.role !== 'master_chef') {
        showToast('Master Chef recipe authoring studio is available after signing in as Master Chef.', 'info');
        openAuthModal();
        return;
      }
    }

    state.activeTab = tabId;

    // Update URL hash so the Git deploy link dynamically changes among pages
    if (updateHash) {
      const targetHash = `#${tabId}`;
      if (window.location.hash !== targetHash) {
        try {
          window.history.pushState(null, '', targetHash);
        } catch (e) {
          window.location.hash = targetHash;
        }
      }
    }

    DOM.navTabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    DOM.tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `panel-${tabId}`);
    });

    // Check Master Chef permissions
    if (tabId === 'master-chef') {
      const isMaster = state.currentUser && state.currentUser.role === 'master_chef';
      DOM.chefRoleBanner.style.display = isMaster ? 'none' : 'flex';
      renderMasterChefScrapsSelector();
    }

    if (tabId === 'home-overview') {
      renderAncestralShowcase();
      animateMetricCounters();
    }

    if (tabId === 'home-chef') {
      applyFiltersAndRenderRecipes();
    }

    if (tabId === 'ngo-dispatch') {
      renderDispatchesFeed();
    }

    if (tabId === 'scraps-matrix') {
      renderCategorizedCatalog();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Route reader: parse current window.location.hash and activate the corresponding tab
   */
  function handleRouteFromHash() {
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
    if (!rawHash) {
      switchTab('home-overview', false);
      return;
    }

    const validTabs = ['home-overview', 'scraps-matrix', 'home-chef', 'master-chef', 'ngo-dispatch'];
    const aliasMap = {
      'home': 'home-overview',
      'overview': 'home-overview',
      'catalog': 'scraps-matrix',
      'matrix': 'scraps-matrix',
      'scraps': 'scraps-matrix',
      'ingredients': 'scraps-matrix',
      'cook': 'home-chef',
      'recipes': 'home-chef',
      'homechef': 'home-chef',
      'masterchef': 'master-chef',
      'chef': 'master-chef',
      'upload': 'master-chef',
      'ngo': 'ngo-dispatch',
      'dispatch': 'ngo-dispatch',
      'dispatches': 'ngo-dispatch'
    };

    const targetTab = validTabs.includes(rawHash) ? rawHash : (aliasMap[rawHash] || 'home-overview');

    if (targetTab === 'master-chef' && (!state.currentUser || state.currentUser.role !== 'master_chef')) {
      switchTab('home-overview', true);
      return;
    }

    switchTab(targetTab, false);
  }"""

assert old_switch_tab in content, "Could not find old_switch_tab in app.js"
content = content.replace(old_switch_tab, new_switch_tab, 1)

# 5. Update loadInitialData() to gracefully handle static Git deployment
old_load_initial = """  async function loadInitialData() {
    // 1. Instant fallback to authentic 30 ingredients & categories
    state.scraps = INGREDIENTS_DATA.slice();
    state.categories = CATEGORIES_METADATA.slice();

    renderAncestralShowcase();
    renderCategorizedCatalog();
    renderMasterChefScrapsSelector();
    populateScrapDropdown();
    animateMetricCounters();

    try {
      const [catsRes, scrapsRes, recsRes, dispRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/scraps'),
        fetch('/api/recipes'),
        fetch('/api/dispatches')
      ]);

      if (catsRes.ok) {
        const fetchedCats = await catsRes.json();
        if (fetchedCats && fetchedCats.length > 0) state.categories = fetchedCats;
      }
      if (scrapsRes.ok) {
        const fetchedScraps = await scrapsRes.json();
        if (fetchedScraps && fetchedScraps.length >= 30) state.scraps = fetchedScraps;
      }
      if (recsRes.ok) state.recipes = await recsRes.json();
      if (dispRes.ok) state.dispatches = await dispRes.json();

      // Render updated views
      renderAncestralShowcase();
      renderCategorizedCatalog();
      renderMasterChefScrapsSelector();
      populateScrapDropdown();
      renderRecipesGrid();
      renderDispatchesFeed();
    } catch (err) {
      console.warn('Initial data fetch notice:', err);
      renderAncestralShowcase();
      renderCategorizedCatalog();
      populateScrapDropdown();
      renderRecipesGrid();
      renderMasterChefScrapsSelector();
    }
  }"""

new_load_initial = """  async function loadInitialData() {
    // 1. Instant fallback to authentic 30 ingredients, categories, recipes & dispatches
    state.scraps = INGREDIENTS_DATA.slice();
    state.categories = CATEGORIES_METADATA.slice();
    state.recipes = getStoredOrFallbackRecipes();
    state.dispatches = getStoredOrFallbackDispatches();

    renderAncestralShowcase();
    renderCategorizedCatalog();
    renderMasterChefScrapsSelector();
    populateScrapDropdown();
    renderRecipesGrid();
    renderDispatchesFeed();
    animateMetricCounters();

    // 2. Attempt fetching from backend if live server is reachable
    try {
      const [catsRes, scrapsRes, recsRes, dispRes] = await Promise.all([
        fetch('/api/categories').catch(() => null),
        fetch('/api/scraps').catch(() => null),
        fetch('/api/recipes').catch(() => null),
        fetch('/api/dispatches').catch(() => null)
      ]);

      if (catsRes && catsRes.ok) {
        const fetchedCats = await catsRes.json();
        if (fetchedCats && fetchedCats.length > 0) state.categories = fetchedCats;
      }
      if (scrapsRes && scrapsRes.ok) {
        const fetchedScraps = await scrapsRes.json();
        if (fetchedScraps && fetchedScraps.length >= 30) state.scraps = fetchedScraps;
      }
      if (recsRes && recsRes.ok) {
        state.recipes = await recsRes.json();
      }
      if (dispRes && dispRes.ok) {
        state.dispatches = await dispRes.json();
      }

      // Render with fresh backend data if fetched
      renderAncestralShowcase();
      renderCategorizedCatalog();
      renderMasterChefScrapsSelector();
      populateScrapDropdown();
      renderRecipesGrid();
      renderDispatchesFeed();
    } catch (err) {
      console.info('Operating on embedded dataset (Git static deployment):', err);
    }
  }"""

assert old_load_initial in content, "Could not find old_load_initial in app.js"
content = content.replace(old_load_initial, new_load_initial, 1)

# 6. Update openRecipeDetailModal to use in-memory recipe fallback if fetch fails
old_open_modal = """  async function openRecipeDetailModal(recipeId) {
    stopSpeech();
    try {
      const res = await fetch(`/api/recipes/${recipeId}`);
      if (!res.ok) throw new Error('Could not fetch recipe');
      const rc = await res.json();
      state.activeRecipe = rc;"""

new_open_modal = """  async function openRecipeDetailModal(recipeId) {
    stopSpeech();
    try {
      let rc = state.recipes.find(r => r.id === recipeId);

      // Attempt live fetch if possible
      try {
        const res = await fetch(`/api/recipes/${recipeId}`);
        if (res && res.ok) rc = await res.json();
      } catch (netErr) {
        // Fallback to in-memory recipe for static Git deployment
      }

      if (!rc) throw new Error('Could not fetch recipe');
      state.activeRecipe = rc;"""

assert old_open_modal in content, "Could not find old_open_modal in app.js"
content = content.replace(old_open_modal, new_open_modal, 1)

# 7. Update executeDemoLogin for offline/static deployment fallback
old_demo_login = """    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
      });

      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        DOM.authModal.close();
        showToast(`✨ Welcome ${user.name}! Switched to ${user.role === 'master_chef' ? 'Master Chef' : 'Home Chef'} mode.`, 'success');
      } else {
        // Fallback demo user if backend not seeded yet
        const demoUser = role === 'master_chef'
          ? { id: 1, name: 'Chef Sanjeev Kapoor', email: 'chef@annapurna.org', role: 'master_chef', affiliation: 'Heritage Rasoi Guild' }
          : { id: 2, name: 'Priya Sharma', email: 'home@annapurna.org', role: 'home_chef', affiliation: 'Home Cook' };
        setCurrentUser(demoUser);
        DOM.authModal.close();
        showToast(`✨ Welcome ${demoUser.name}! (${role === 'master_chef' ? 'Master Chef' : 'Home Chef'})`, 'success');
      }
    } catch (err) {
      console.warn('Demo login network error:', err);
    }"""

new_demo_login = """    const demoUser = role === 'master_chef'
      ? { id: 1, name: 'Chef Sanjeev Kapoor', email: 'chef@annapurna.org', role: 'master_chef', affiliation: 'Heritage Rasoi Guild' }
      : { id: 2, name: 'Priya Sharma', email: 'home@annapurna.org', role: 'home_chef', affiliation: 'Home Cook' };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
      });

      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        DOM.authModal.close();
        showToast(`✨ Welcome ${user.name}! Switched to ${user.role === 'master_chef' ? 'Master Chef' : 'Home Chef'} mode.`, 'success');
        return;
      }
    } catch (err) {
      console.info('Demo login running in static mode');
    }

    // Fallback for static Git deployment
    setCurrentUser(demoUser);
    DOM.authModal.close();
    showToast(`✨ Welcome ${demoUser.name}! (${role === 'master_chef' ? 'Master Chef' : 'Home Chef'})`, 'success');"""

assert old_demo_login in content, "Could not find old_demo_login in app.js"
content = content.replace(old_demo_login, new_demo_login, 1)

# 8. Update handleMasterRecipeSubmit for static deployment fallback
old_submit_recipe = """    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to submit recipe');
      }

      showToast(`✨ "${payload.title}" published & preserved in the catalog!`, 'success');
      DOM.masterRecipeForm.reset();
      closeMasterRecipeBuilderModal();

      state.masterChefSelectedScrapId = null;
      updateMasterStep1SelectionUI();

      // Refresh recipe list and switch to Home Chef
      const updated = await fetch('/api/recipes');
      if (updated.ok) state.recipes = await updated.json();
      applyFiltersAndRenderRecipes();
      switchTab('home-chef');
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>🌿 Publish & Build New Dish</span>';
      }
    }"""

new_submit_recipe = """    try {
      let savedOnBackend = false;
      try {
        const res = await fetch('/api/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res && res.ok) savedOnBackend = true;
      } catch (netErr) {
        console.info('Backend unreachable, saving recipe in static Git mode');
      }

      // Add to local state & persist
      payload.id = state.recipes.length ? Math.max(...state.recipes.map(r => r.id)) + 1 : 31;
      const scrap = state.scraps.find(s => s.id === payload.scrap_id);
      if (scrap) {
        payload.scrap_name_en = scrap.name_en;
        payload.scrap_name_regional = scrap.name_regional;
      }
      state.recipes.unshift(payload);
      try {
        localStorage.setItem('waste2menu_recipes', JSON.stringify(state.recipes));
      } catch (e) {}

      showToast(`✨ "${payload.title}" published & preserved in the catalog!`, 'success');
      DOM.masterRecipeForm.reset();
      closeMasterRecipeBuilderModal();

      state.masterChefSelectedScrapId = null;
      updateMasterStep1SelectionUI();

      // Refresh recipe list if backend available
      if (savedOnBackend) {
        try {
          const updated = await fetch('/api/recipes');
          if (updated && updated.ok) state.recipes = await updated.json();
        } catch (e) {}
      }

      applyFiltersAndRenderRecipes();
      switchTab('home-chef', true);
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>🌿 Publish & Build New Dish</span>';
      }
    }"""

assert old_submit_recipe in content, "Could not find old_submit_recipe in app.js"
content = content.replace(old_submit_recipe, new_submit_recipe, 1)

# Write updated app.js
APP_JS.write_text(content, encoding="utf-8")
print("Successfully updated app.js with fallbacks and hash routing!")
