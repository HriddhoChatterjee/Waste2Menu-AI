/**
 * ============================================================================
 * ANNAPURNA LOOP (WASTE2MENU: COMMUNITY ZERO-WASTE EDITION)
 * Pure Modern Vanilla JavaScript (ES6+) • Client Controller
 * ============================================================================
 * Features:
 * - Authentication (Master Chef vs Home Chef + 1-Click Demo Login)
 * - Complete 30-Scraps Interactive Matrix In Front (Organized as per the PDF)
 * - Multi-lingual live search (English, Hindi, Bengali, Tamil, etc.)
 * - Web Speech API Voice Guide for hands-free kitchen cooking
 * - Master Chef recipe uploading & NGO surplus food redistribution
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // AUTHENTIC 30-SCRAPS DATASET & CATEGORIES METADATA (REFERENCE GUIDE PARITY)
  // ==========================================================================
  const INGREDIENTS_DATA = [
    {
      id: 1,
      category_id: 1,
      name_en: "Bottle Gourd Peels",
      name_regional: "Lauki Chilka, Lau-er Khosha, Sorakkay Thol",
      common_uses: "Stir-fried crisp with nigella seeds (Chechki / Bhaja), ground with roasted peanuts for chutney, or mixed into raita."
    },
    {
      id: 2,
      category_id: 1,
      name_en: "Ridge Gourd Peels",
      name_regional: "Turai Chilka, Jhinge Khosha, Peerkangai Thol",
      common_uses: "Coarsely roasted with urad dal, dried red chillies, and tamarind into Thogayal / Chutney / Bata."
    },
    {
      id: 3,
      category_id: 1,
      name_en: "Potato Peels",
      name_regional: "Aloo Chilka, Aloo Khosha, Urulaikizhangu Thol",
      common_uses: "Shallow-fried with poppy seeds (Posto Aloo Khosha Bhaja) or seasoned with chaat masala into crispy chips."
    },
    {
      id: 4,
      category_id: 1,
      name_en: "Raw Banana / Plantain Peels",
      name_regional: "Kacche Kele Ka Chilka, Kancha Kolar Khosha, Vazhakkai Thol",
      common_uses: "Boiled and mashed with mustard oil, garlic, and green chillies into Khosha Bata, or stir-fried into Kerala Thoran."
    },
    {
      id: 5,
      category_id: 1,
      name_en: "Pointed Gourd Peels",
      name_regional: "Parwal Chilka, Potol Khosha",
      common_uses: "Ground into a spicy paste with mustard paste, garlic, and green chillies (Potol Khosha Bata)."
    },
    {
      id: 6,
      category_id: 1,
      name_en: "Pumpkin Peels & Fibers",
      name_regional: "Kaddu Chilka, Kumro Khosha, Parangikai Thol",
      common_uses: "Pan-roasted crisp with turmeric and cumin seeds, or slow-cooked into mixed-vegetable curries (Labra / Sambhar)."
    },
    {
      id: 7,
      category_id: 1,
      name_en: "Bitter Gourd Peels",
      name_regional: "Karela Chilka, Korola Khosha, Pavakkai Thol",
      common_uses: "Salted to extract excess bitterness, mixed with besan (gram flour), and fried into crunchy, blood-sugar friendly fritters."
    },
    {
      id: 8,
      category_id: 1,
      name_en: "Carrot & Radish Skins",
      name_regional: "Gajar / Mooli Chilka, Mulo Khosha",
      common_uses: "Sautéed into quick dry subzis with mustard seeds or blended into mixed-peel chutneys."
    },
    {
      id: 9,
      category_id: 1,
      name_en: "Eggplant / Brinjal Peels",
      name_regional: "Baingan Chilka, Begun Khosha, Kathirikai Thol",
      common_uses: "Simmered in tangy yogurt/mustard gravies (e.g., Kashmiri Khatte Baingan peel curry)."
    },
    {
      id: 10,
      category_id: 2,
      name_en: "Cauliflower Stems & Green Ribs",
      name_regional: "Phool Gobi Danthal, Fulkopi Danta, Cauliflower Thandu",
      common_uses: "Peeled and simmered into mustard paste gravies (Danta Chorchori), stir-fries with potatoes, or crunchy winter pickles."
    },
    {
      id: 11,
      category_id: 2,
      name_en: "Coriander & Mint Stems",
      name_regional: "Dhaniya Dandi, Dhonepata Danta, Kothamalli Thandu",
      common_uses: "Rich in volatile essential oils; blended into restaurant-style green chutney, soup bases, and marinades."
    },
    {
      id: 12,
      category_id: 2,
      name_en: "Broccoli Stalks",
      name_regional: "Broccoli Danthal",
      common_uses: "Woody exterior peeled away, core julienned into stir-fries, grated for paratha fillings, or pureed into soups."
    },
    {
      id: 13,
      category_id: 2,
      name_en: "Beetroot & Radish Greens",
      name_regional: "Chukandar / Mooli ke Patte, Mulo Saag",
      common_uses: "Finely chopped and cooked with garlic and green chillies into dry saag (Mooli Patte ki Sabzi)."
    },
    {
      id: 14,
      category_id: 2,
      name_en: "Colocasia / Taro Stems & Leaves",
      name_regional: "Arbi ke Patte / Dandi, Kochur Saag, Chembu Ila",
      common_uses: "Steamed with spiced besan into pinwheel rolls (Patra / Patrode) or cooked with coconut-mustard paste."
    },
    {
      id: 15,
      category_id: 2,
      name_en: "Cabbage Outer Tough Leaves & Core",
      name_regional: "Patta Gobi ki Dandi & Patte",
      common_uses: "Shredded fine for quick stir-fried bhurji or slow-simmered in hearty vegetable broths."
    },
    {
      id: 16,
      category_id: 3,
      name_en: "Watermelon White Rind",
      name_regional: "Tarbooj ka Safed Chilka, Tarmooj Khosha",
      common_uses: "Diced and made into soft morning dosas (Kalingana Polo), sweet halwa/murabba, or savory spiced gravies."
    },
    {
      id: 17,
      category_id: 3,
      name_en: "Jackfruit Seeds",
      name_regional: "Kathal ke Beej, Enchorer Bichi, Palakottai",
      common_uses: "Dried, boiled, and cooked in thick lentil dals, roasted over open charcoal embers, or stewed in spicy gravies."
    },
    {
      id: 18,
      category_id: 3,
      name_en: "Pumpkin Seeds",
      name_regional: "Kaddu ke Beej, Kumror Bichi",
      common_uses: "Washed, sun-dried, and dry-roasted with black salt and cumin as a nutrient-dense zinc snack."
    },
    {
      id: 19,
      category_id: 3,
      name_en: "Raw Mango Pits & Skins",
      name_regional: "Aam ki Guthli, Aam Aantti, Maangai Kottai",
      common_uses: "Simmered inside summer rasams or dals for natural acidity, or dried into tangy dry aamchur pickles."
    },
    {
      id: 20,
      category_id: 3,
      name_en: "Squeezed Lemon / Lime Halves",
      name_regional: "Nichoda Hua Nimbu, Lebur Khosha",
      common_uses: "Stuffed with salt and turmeric, sun-cured in glass jars for 3 weeks into zero-waste probiotic lemon pickle."
    },
    {
      id: 21,
      category_id: 4,
      name_en: "Leftover Cooked Rice",
      name_regional: "Basi Bhaat, Pazhaya Saadham, Panta Bhaat",
      common_uses: "Soaked overnight in water with green chillies for fermented breakfast, or mashed into crispy rice pakoras."
    },
    {
      id: 22,
      category_id: 4,
      name_en: "Stale Rotis / Chapati Ends",
      name_regional: "Basi Roti, Pazhaya Roti",
      common_uses: "Torn into pieces and tempered with mustard seeds, onions, and curry leaves (Roti Poha / Seyal Phulka / Kutti Roti)."
    },
    {
      id: 23,
      category_id: 4,
      name_en: "Stale Bread Crusts & Ends",
      name_regional: "Bread ke Kinare",
      common_uses: "Toasted dry and pulsed into homemade breadcrumbs, or prepared as spicy bread upma and shahi tukda bites."
    },
    {
      id: 24,
      category_id: 4,
      name_en: "Rice Wash Water",
      name_regional: "Chawal ka Paani, Dhowa Jal, Arisi Kalainja Thanneer",
      common_uses: "Used as a nutrient-rich cooking broth for dal, kneading soft roti dough, or as a mineral-rich soup base."
    },
    {
      id: 25,
      category_id: 4,
      name_en: "Cooked Rice Starch Water",
      name_regional: "Maanrh, Kanji Thanneer, Ganji",
      common_uses: "Seasoned with rock salt and roasted cumin as an energizing hydration tonic, or used as a gravy thickener."
    },
    {
      id: 26,
      category_id: 5,
      name_en: "Paneer / Chhena Whey Water",
      name_regional: "Paneer ka Paani, Chhanar Jal",
      common_uses: "High in complete protein; used to knead chapati dough, boil lentils, or form the liquid base of curries."
    },
    {
      id: 27,
      category_id: 5,
      name_en: "Sour Curd / Leftover Dahi",
      name_regional: "Khatta Dahi, Tok Doi, Puliya Thayir",
      common_uses: "Whisked with besan to make traditional Kadhi, rava dhokla fermenter, or South Indian Mor Kuzhambu."
    },
    {
      id: 28,
      category_id: 5,
      name_en: "Browned Ghee Sediment Residue",
      name_regional: "Mawa / Berukho / Khurchan / Mor Kali",
      common_uses: "Caramelized milk solids remaining in pan; tossed with hot rice and jaggery/sugar, or rolled into quick pedas."
    },
    {
      id: 29,
      category_id: 5,
      name_en: "Peeled Ginger Skins",
      name_regional: "Adrak ka Chilka, Ada-r Khosha, Inji Thol",
      common_uses: "Washed and dried, dropped directly into morning chai pots or boiled into immunity tisanes (kadha)."
    },
    {
      id: 30,
      category_id: 5,
      name_en: "Coconut Brown Husk Skins",
      name_regional: "Nariyal ka Khurchan / Brown Skin",
      common_uses: "Shredded and dry-roasted with red chillies, tamarind, and garlic into flavorful dry idli podi."
    }
  ];

  const CATEGORIES_METADATA = [
    {
      id: 1,
      name: "Vegetable Peels & Skins",
      regional: "Chilka / Khosha / Thol",
      emoji: "🥔",
      count: 9,
      description: "Outer peels of gourds, tubers, roots, and nightshades rich in dietary fiber, polyphenols, and flavor."
    },
    {
      id: 2,
      name: "Stems, Stalks & Green Leaves",
      regional: "Danta / Thandu / Leaves",
      emoji: "🌿",
      count: 6,
      description: "Nutrient-packed fibrous stalks, tender stems, and mineral-dense leaves of brassicas, herbs, and colocasia."
    },
    {
      id: 3,
      name: "Seeds, Piths & Rinds",
      regional: "Beej / Bichi / Guthli",
      emoji: "🍉",
      count: 5,
      description: "High-protein seeds, fibrous piths, melon rinds, and citrus peels packed with essential oils and pectin."
    },
    {
      id: 4,
      name: "Grains, Starches & Leftover Staples",
      regional: "Basi / Leftover",
      emoji: "🍚",
      count: 5,
      description: "Cooked rice, overnight stale rotis, bread crusts, starchy wash waters, and kanji rich in natural probiotics and energy."
    },
    {
      id: 5,
      name: "Dairy & Spice Discards",
      regional: "Paneer Whey / Khurchan / Skins",
      emoji: "🥛",
      count: 5,
      description: "Bio-active paneer whey, sour curd, caramelized ghee residue (khurchan), ginger skins, and roasted coconut husks."
    }
  ];

  // Application State
  const state = {
    currentUser: null,
    activeTab: 'home-overview',
    categories: CATEGORIES_METADATA.slice(),
    scraps: INGREDIENTS_DATA.slice(),
    recipes: [],
    dispatches: [],
    // Ingredient selection
    selectedScrapIds: new Set(),
    masterChefSelectedScrapId: null,
    selectedCourse: 'all',
    selectedDietary: 'all',
    activeRecipe: null,
    activeClaimDispatchId: null,
    isSpeaking: false,
    favorites: []
  };

  // DOM Elements Cache
  const DOM = {
    // Header & Brand
    navBrandBtn: document.getElementById('nav-brand-btn'),
    navTabButtons: document.querySelectorAll('.nav-tab-btn'),
    tabPanels: document.querySelectorAll('.tab-panel'),
    headerAuth: document.getElementById('header-auth'),
    activeDispatchBadge: document.getElementById('active-dispatch-badge'),

    // Hero Action Buttons
    btnHeroExplore: document.getElementById('btn-hero-explore'),
    btnHeroContribute: document.getElementById('btn-hero-contribute'),
    btnHeroMatrix: document.getElementById('btn-hero-matrix'),

    // Showcase & Impact Elements (Home Overview)
    ancestralShowcaseGrid: document.getElementById('ancestral-showcase-grid'),
    statScrapsRescued: document.getElementById('stat-scraps-rescued'),
    statCo2Saved: document.getElementById('stat-co2-saved'),
    statMealsServed: document.getElementById('stat-meals-served'),

    // Home Chef Elements
    filterCourse: document.getElementById('filter-course'),
    filterDietary: document.getElementById('filter-dietary'),
    btnNavToCatalog: document.getElementById('btn-nav-to-catalog'),
    recipesResultsCounter: document.getElementById('recipes-results-counter'),
    activeScrapsFilterTag: document.getElementById('active-scraps-filter-tag'),
    homeRecipeGrid: document.getElementById('home-recipe-grid'),

    // Master Chef Elements (2-Step Authoring Studio & Pop-up Dialog)
    chefRoleBanner: document.getElementById('chef-role-banner'),
    chefRoleNoticeText: document.getElementById('chef-role-notice-text'),
    btnChefDemoSignin: document.getElementById('btn-chef-demo-signin'),
    masterStep1View: document.getElementById('master-step1-view'),
    masterScrapsSelectorContainer: document.getElementById('master-scraps-selector-container'),
    step1SelectedBadge: document.getElementById('step1-selected-badge'),
    dockSelectedScrapName: document.getElementById('dock-selected-scrap-name'),
    btnMasterStep1Next: document.getElementById('btn-master-step1-next'),
    masterRecipeModal: document.getElementById('master-recipe-modal'),
    masterModalClose: document.getElementById('master-modal-close'),
    builderScrapBanner: document.getElementById('builder-scrap-banner'),
    builderScrapPill: document.getElementById('builder-scrap-pill'),
    builderScrapTitle: document.getElementById('builder-scrap-title'),
    builderScrapReg: document.getElementById('builder-scrap-reg'),
    btnBuilderChangeScrap: document.getElementById('btn-builder-change-scrap'),
    masterRecipeForm: document.getElementById('master-recipe-form'),
    formRcScrapId: document.getElementById('form-rc-scrap-id'),
    formRcTitle: document.getElementById('form-rc-title'),
    formRcCourse: document.getElementById('form-rc-course'),
    formRcDietary: document.getElementById('form-rc-dietary'),
    formRcChef: document.getElementById('form-rc-chef'),
    formRcAffiliation: document.getElementById('form-rc-affiliation'),
    formRcPrep: document.getElementById('form-rc-prep'),
    formRcDiff: document.getElementById('form-rc-diff'),
    formRcServings: document.getElementById('form-rc-servings'),
    formRcWisdom: document.getElementById('form-rc-wisdom'),
    btnAddPantryItem: document.getElementById('btn-add-pantry-item'),
    pantryInputsContainer: document.getElementById('pantry-inputs-container'),
    btnAddStepItem: document.getElementById('btn-add-step-item'),
    stepsInputsContainer: document.getElementById('steps-inputs-container'),
    btnModalStep2Back: document.getElementById('btn-modal-step2-back'),
    btnSaveRecipe: document.getElementById('btn-save-recipe'),

    // NGO Dispatch Elements
    ngoBroadcastForm: document.getElementById('ngo-broadcast-form'),
    ngoDispatchesList: document.getElementById('ngo-dispatches-list'),
    statFeedActiveMeals: document.getElementById('stat-feed-active-meals'),

    // 30 Kitchen Ingredients & Scraps Catalog
    categoriesCatalogContainer: document.getElementById('categories-catalog-container'),
    guideSelectionBar: document.getElementById('guide-selection-bar'),
    selBarCount: document.getElementById('sel-bar-count'),
    selBarNames: document.getElementById('sel-bar-names'),
    btnGuideSelectAll: document.getElementById('btn-guide-select-all'),
    btnGuideClear: document.getElementById('btn-guide-clear'),
    btnGuideViewRecipes: document.getElementById('btn-guide-view-recipes'),
    selRecipesCount: document.getElementById('sel-recipes-count'),

    // Auth Modal
    authModal: document.getElementById('auth-modal'),
    authModalClose: document.getElementById('auth-modal-close'),
    authToggleSignin: document.getElementById('auth-toggle-signin'),
    authToggleRegister: document.getElementById('auth-toggle-register'),
    formSignin: document.getElementById('form-signin'),
    formRegister: document.getElementById('form-register'),
    btnQuickDemoChef: document.getElementById('btn-quick-demo-chef'),
    btnQuickDemoHome: document.getElementById('btn-quick-demo-home'),

    // Recipe Detail Modal
    recipeModal: document.getElementById('recipe-modal'),
    recipeModalClose: document.getElementById('recipe-modal-close'),
    btnModalFavorite: document.getElementById('btn-modal-favorite'),
    favIcon: document.getElementById('fav-icon'),
    favText: document.getElementById('fav-text'),
    modalRcCourse: document.getElementById('modal-rc-course'),
    modalRcDietary: document.getElementById('modal-rc-dietary'),
    modalRcScrapTitle: document.getElementById('modal-rc-scrap-title'),
    modalRcTitle: document.getElementById('modal-rc-title'),
    modalRcChefName: document.getElementById('modal-rc-chef-name'),
    modalRcChefAffil: document.getElementById('modal-rc-chef-affil'),
    modalRcPrep: document.getElementById('modal-rc-prep'),
    modalRcDiff: document.getElementById('modal-rc-diff'),
    modalRcServings: document.getElementById('modal-rc-servings'),
    modalRcScrapEn: document.getElementById('modal-rc-scrap-en'),
    modalRcScrapReg: document.getElementById('modal-rc-scrap-reg'),
    modalRcStaples: document.getElementById('modal-rc-staples'),
    modalRcSteps: document.getElementById('modal-rc-steps'),
    modalRcWisdomWrap: document.getElementById('modal-rc-wisdom-wrap'),
    modalRcWisdom: document.getElementById('modal-rc-wisdom'),
    btnAudioPlay: document.getElementById('btn-audio-play'),
    btnAudioStop: document.getElementById('btn-audio-stop'),
    audioIconSpan: document.getElementById('audio-icon-span'),
    audioTextSpan: document.getElementById('audio-text-span'),

    // Saved Favorites Modal (Home Chef)
    favoritesModal: document.getElementById('favorites-modal'),
    favoritesModalClose: document.getElementById('favorites-modal-close'),
    favoritesListContainer: document.getElementById('favorites-list-container'),

    // NGO Claim Modal
    claimModal: document.getElementById('claim-modal'),
    claimModalClose: document.getElementById('claim-modal-close'),
    claimCancelBtn: document.getElementById('claim-cancel-btn'),
    claimDispatchForm: document.getElementById('claim-dispatch-form'),
    claimTargetDish: document.getElementById('claim-target-dish'),
    claimTargetPortions: document.getElementById('claim-target-portions'),
    claimInputNgo: document.getElementById('claim-input-ngo'),

    // Toast Tray
    toastTray: document.getElementById('toast-tray')
  };

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  async function init() {
    loadSavedSession();
    setupEventListeners();
    renderAuthHeader();
    updateNavbarVisibility();
    await loadInitialData();
  }

  function loadSavedSession() {
    try {
      const saved = localStorage.getItem('waste2menu_user') || localStorage.getItem('annapurna_user');
      if (saved) {
        state.currentUser = JSON.parse(saved);
      }
      const savedFavs = localStorage.getItem('waste2menu_favorites');
      if (savedFavs) {
        state.favorites = JSON.parse(savedFavs);
      }
    } catch (err) {
      console.warn('Could not read user session or favorites:', err);
    }
  }

  function saveFavorites() {
    try {
      localStorage.setItem('waste2menu_favorites', JSON.stringify(state.favorites));
    } catch (err) {
      console.warn('Could not save favorites:', err);
    }
  }

  async function loadInitialData() {
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
  }

  // ==========================================================================
  // EVENT LISTENERS SETUP
  // ==========================================================================
  function setupEventListeners() {
    // Brand button goes to Home
    DOM.navBrandBtn.addEventListener('click', () => switchTab('home-overview'));

    // Top Navigation Tabs
    DOM.navTabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        switchTab(tab);
      });
    });

    // Hero Action CTAs & Wisdom Banner CTA
    DOM.btnHeroExplore.addEventListener('click', () => {
      const homeTabBtn = document.getElementById('nav-tab-home-chef');
      if (homeTabBtn) homeTabBtn.style.display = 'inline-flex';
      switchTab('home-chef');
      applyFiltersAndRenderRecipes();
    });

    DOM.btnHeroContribute.addEventListener('click', () => {
      if (state.currentUser && state.currentUser.role === 'master_chef') {
        switchTab('master-chef');
      } else if (state.currentUser && state.currentUser.role === 'home_chef') {
        showToast('Recipe upload is exclusive to Master Chefs. Home Chefs can view and cook all recipes!', 'info');
      } else {
        openAuthModal();
        showToast('Master Chef recipe authoring studio is available after signing in. Use 1-Click Demo!', 'info');
      }
    });

    const bannerCookBtn = document.getElementById('btn-banner-cook');
    if (bannerCookBtn) {
      bannerCookBtn.addEventListener('click', () => {
        const homeTabBtn = document.getElementById('nav-tab-home-chef');
        if (homeTabBtn) homeTabBtn.style.display = 'inline-flex';
        switchTab('home-chef');
        applyFiltersAndRenderRecipes();
      });
    }

    DOM.btnHeroMatrix.addEventListener('click', () => switchTab('scraps-matrix'));

    // Auth Modal Triggers
    DOM.authModalClose.addEventListener('click', () => DOM.authModal.close());
    DOM.authToggleSignin.addEventListener('click', showSigninTab);
    DOM.authToggleRegister.addEventListener('click', showRegisterTab);

    // 1-Click Demo Buttons
    DOM.btnQuickDemoChef.addEventListener('click', () => executeDemoLogin('master_chef'));
    DOM.btnQuickDemoHome.addEventListener('click', () => executeDemoLogin('home_chef'));
    DOM.btnChefDemoSignin.addEventListener('click', () => executeDemoLogin('master_chef'));

    // Auth Form Submissions
    DOM.formSignin.addEventListener('submit', handleSigninSubmit);
    DOM.formRegister.addEventListener('submit', handleRegisterSubmit);

    // Home Chef Navigation Button to Catalog
    if (DOM.btnNavToCatalog) {
      DOM.btnNavToCatalog.addEventListener('click', () => switchTab('scraps-matrix'));
    }

    // Dropdown filters
    DOM.filterCourse.addEventListener('change', (e) => {
      state.selectedCourse = e.target.value;
      applyFiltersAndRenderRecipes();
    });

    DOM.filterDietary.addEventListener('change', (e) => {
      state.selectedDietary = e.target.value;
      applyFiltersAndRenderRecipes();
    });

    // Master Chef Step 1 -> Step 2 Modal Popup Triggers
    if (DOM.btnMasterStep1Next) {
      DOM.btnMasterStep1Next.addEventListener('click', openMasterRecipeBuilderModal);
    }
    if (DOM.masterModalClose) {
      DOM.masterModalClose.addEventListener('click', closeMasterRecipeBuilderModal);
    }
    if (DOM.btnBuilderChangeScrap) {
      DOM.btnBuilderChangeScrap.addEventListener('click', closeMasterRecipeBuilderModal);
    }
    if (DOM.btnModalStep2Back) {
      DOM.btnModalStep2Back.addEventListener('click', closeMasterRecipeBuilderModal);
    }
    if (DOM.masterRecipeModal) {
      DOM.masterRecipeModal.addEventListener('cancel', closeMasterRecipeBuilderModal);
    }

    // Dynamic Master Chef Form Builders (Inside Step 2 Popup)
    DOM.btnAddPantryItem.addEventListener('click', addPantryInputRow);
    DOM.btnAddStepItem.addEventListener('click', addStepInputRow);

    DOM.pantryInputsContainer.addEventListener('click', (e) => {
      if (e.target.closest('.btn-remove-row')) {
        const rows = DOM.pantryInputsContainer.querySelectorAll('.dynamic-input-row');
        if (rows.length > 1) {
          e.target.closest('.dynamic-input-row').remove();
        } else {
          showToast('Keep at least one ingredient.', 'info');
        }
      }
    });

    DOM.stepsInputsContainer.addEventListener('click', (e) => {
      if (e.target.closest('.btn-remove-row')) {
        const rows = DOM.stepsInputsContainer.querySelectorAll('.dynamic-input-row');
        if (rows.length > 1) {
          e.target.closest('.dynamic-input-row').remove();
          renumberStepRows();
        } else {
          showToast('Keep at least one cooking step.', 'info');
        }
      }
    });

    // Master Chef Recipe Submit (Step 2 Popup)
    DOM.masterRecipeForm.addEventListener('submit', handleMasterRecipeSubmit);

    // NGO Broadcast Submit
    DOM.ngoBroadcastForm.addEventListener('submit', handleNgoBroadcastSubmit);

    // Modals Close handlers
    DOM.recipeModalClose.addEventListener('click', closeRecipeModal);
    DOM.recipeModal.addEventListener('cancel', stopSpeech);
    if (DOM.btnModalFavorite) {
      DOM.btnModalFavorite.addEventListener('click', toggleFavoriteRecipe);
    }

    // Saved Favorites Modal Handlers
    if (DOM.favoritesModalClose && DOM.favoritesModal) {
      DOM.favoritesModalClose.addEventListener('click', () => DOM.favoritesModal.close());
    }

    // Web Speech API Voice Controls
    DOM.btnAudioPlay.addEventListener('click', toggleSpeechNarration);
    DOM.btnAudioStop.addEventListener('click', stopSpeech);

    // Claim Modal Handlers
    DOM.claimModalClose.addEventListener('click', () => DOM.claimModal.close());
    DOM.claimCancelBtn.addEventListener('click', () => DOM.claimModal.close());
    DOM.claimDispatchForm.addEventListener('submit', handleClaimDispatchSubmit);

    // Floating Action Dock in Ingredients Catalog
    if (DOM.btnGuideSelectAll) DOM.btnGuideSelectAll.addEventListener('click', selectAllIngredientsFromCatalog);
    if (DOM.btnGuideClear) DOM.btnGuideClear.addEventListener('click', clearIngredientsFromCatalog);
    if (DOM.btnGuideViewRecipes) DOM.btnGuideViewRecipes.addEventListener('click', viewRecipesForCatalogSelection);
  }

  // ==========================================================================
  // NAVIGATION & TAB SWITCHING
  // ==========================================================================
  function switchTab(tabId) {
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
  }

  function updateNavbarVisibility() {
    const homeTabBtn = document.getElementById('nav-tab-home-chef');
    const masterTabBtn = document.getElementById('nav-tab-master-chef');

    if (!state.currentUser) {
      // Hidden in navbar when logged out
      if (homeTabBtn) homeTabBtn.style.display = 'none';
      if (masterTabBtn) masterTabBtn.style.display = 'none';
      if (DOM.btnHeroContribute) DOM.btnHeroContribute.style.display = 'inline-flex';

      // Redirect if on an authenticated tab
      if (state.activeTab === 'master-chef') {
        switchTab('home-overview');
      }
    } else {
      // Visible after login based on role
      const role = state.currentUser.role;
      if (role === 'master_chef') {
        if (masterTabBtn) masterTabBtn.style.display = 'inline-flex';
        if (homeTabBtn) homeTabBtn.style.display = 'inline-flex';
        if (DOM.btnHeroContribute) {
          DOM.btnHeroContribute.style.display = 'inline-flex';
          DOM.btnHeroContribute.innerHTML = '<span>👨‍🍳 + Upload Recipe (Studio)</span>';
        }
      } else {
        // Home Chef role - strictly remove upload recipe options
        if (homeTabBtn) homeTabBtn.style.display = 'inline-flex';
        if (masterTabBtn) masterTabBtn.style.display = 'none';
        if (DOM.btnHeroContribute) DOM.btnHeroContribute.style.display = 'none';
        if (state.activeTab === 'master-chef') {
          switchTab('home-chef');
        }
      }
    }
  }

  // ==========================================================================
  // AUTHENTICATION LOGIC (MASTER CHEF VS HOME CHEF)
  // ==========================================================================
  function renderAuthHeader() {
    DOM.headerAuth.innerHTML = '';

    if (!state.currentUser) {
      const btn = document.createElement('button');
      btn.className = 'btn-auth-signin';
      btn.id = 'btn-open-auth';
      btn.innerHTML = `<span>🔐 Sign In / Register</span>`;
      btn.addEventListener('click', openAuthModal);
      DOM.headerAuth.appendChild(btn);
    } else {
      const u = state.currentUser;
      const isMaster = u.role === 'master_chef';

      const wrap = document.createElement('div');
      wrap.className = 'user-profile-badge';

      let favBtnHtml = '';
      if (!isMaster) {
        favBtnHtml = `<button type="button" class="btn-header-favorites" id="btn-header-favs" title="View Saved Recipes">❤️ Saved Favorites (<span id="header-fav-count">${state.favorites.length}</span>)</button>`;
      }

      wrap.innerHTML = `
        ${favBtnHtml}
        <span class="user-role-pill ${isMaster ? 'master' : 'home'}">
          ${isMaster ? '👨‍🍳 Master Chef' : '🏡 Home Chef'}
        </span>
        <span class="user-name-text">${escapeHtml(u.name)}</span>
        <button class="btn-auth-signout" title="Sign Out">Sign Out</button>
      `;

      const favBtn = wrap.querySelector('#btn-header-favs');
      if (favBtn) favBtn.addEventListener('click', openFavoritesModal);

      wrap.querySelector('.btn-auth-signout').addEventListener('click', handleSignOut);
      DOM.headerAuth.appendChild(wrap);
    }
  }

  function openAuthModal() {
    showSigninTab();
    DOM.authModal.showModal();
  }

  function showSigninTab() {
    DOM.authToggleSignin.classList.add('active');
    DOM.authToggleRegister.classList.remove('active');
    DOM.formSignin.style.display = 'flex';
    DOM.formRegister.style.display = 'none';
  }

  function showRegisterTab() {
    DOM.authToggleRegister.classList.add('active');
    DOM.authToggleSignin.classList.remove('active');
    DOM.formRegister.style.display = 'flex';
    DOM.formSignin.style.display = 'none';
  }

  async function executeDemoLogin(role) {
    const creds = role === 'master_chef'
      ? { email: 'chef@annapurna.org', password: 'chef123' }
      : { email: 'home@annapurna.org', password: 'home123' };

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
    }
  }

  async function handleSigninSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value.trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Invalid email or password');
      }

      const user = await res.json();
      setCurrentUser(user);
      DOM.authModal.close();
      showToast(`Welcome back, ${user.name}!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    const payload = {
      name: document.getElementById('reg-name').value.trim(),
      email: document.getElementById('reg-email').value.trim(),
      password: document.getElementById('reg-password').value.trim(),
      role: document.getElementById('reg-role').value,
      affiliation: document.getElementById('reg-affiliation').value.trim() || 'Community Cook'
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Registration failed');
      }

      const user = await res.json();
      setCurrentUser(user);
      DOM.authModal.close();
      showToast(`Account created! Welcome, ${user.name}.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  function setCurrentUser(user) {
    state.currentUser = user;
    localStorage.setItem('waste2menu_user', JSON.stringify(user));
    localStorage.setItem('annapurna_user', JSON.stringify(user));
    renderAuthHeader();
    updateNavbarVisibility();
    renderCategorizedCatalog();

    // Automatically navigate to the user's role workspace
    if (user.role === 'master_chef') {
      switchTab('master-chef');
    } else {
      switchTab('home-chef');
    }
  }

  function handleSignOut() {
    state.currentUser = null;
    localStorage.removeItem('waste2menu_user');
    localStorage.removeItem('annapurna_user');
    renderAuthHeader();
    updateNavbarVisibility();
    renderCategorizedCatalog();
    switchTab('home-overview');
    showToast('Signed out successfully.', 'info');
  }

  function populateScrapDropdown() {
    if (!DOM.formRcScrap) return;
    DOM.formRcScrap.innerHTML = '<option value="">-- Choose from 30 Household Scraps --</option>';
    state.scraps.forEach(sc => {
      const opt = document.createElement('option');
      opt.value = sc.id;
      const reg = sc.name_regional ? sc.name_regional.split(',')[0].trim() : '';
      opt.textContent = `${sc.id}. ${sc.name_en}${reg ? ' (' + reg + ')' : ''}`;
      DOM.formRcScrap.appendChild(opt);
    });
  }

  // ==========================================================================
  // RECIPES FILTERING & RENDERING (NO LIVE SEARCH)
  // ==========================================================================
  function applyFiltersAndRenderRecipes() {
    let filtered = state.recipes.slice();

    // 1. Filter by user's counter scraps selection
    if (state.selectedScrapIds.size > 0) {
      filtered = filtered.filter(r => state.selectedScrapIds.has(r.scrap_id));
    }

    // 2. Course filter
    if (state.selectedCourse !== 'all') {
      filtered = filtered.filter(r => r.course_type === state.selectedCourse);
    }

    // 3. Dietary filter
    if (state.selectedDietary !== 'all') {
      filtered = filtered.filter(r => r.dietary_type === state.selectedDietary);
    }

    renderRecipesGrid(filtered);
  }

  function renderRecipesGrid(customList = null) {
    const list = customList !== null ? customList : state.recipes;

    // Update Counter & Filter State Hint
    DOM.recipesResultsCounter.textContent = `Showing ${list.length} traditional recipe${list.length === 1 ? '' : 's'}`;

    if (state.selectedScrapIds.size > 0) {
      DOM.activeScrapsFilterTag.textContent = `• Filtered by ${state.selectedScrapIds.size} selected scrap${state.selectedScrapIds.size === 1 ? '' : 's'}`;
    } else {
      DOM.activeScrapsFilterTag.textContent = '• Showing all zero-waste recipes';
    }

    if (list.length === 0) {
      DOM.homeRecipeGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1.5rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg);">
          <div style="font-size: 2.8rem; margin-bottom: 0.5rem;">🥗</div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">No matching zero-waste recipes found</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary); max-width: 500px; margin: 0 auto 1.5rem;">
            Try selecting different scraps from the 30-scraps catalog or clear filters to view authentic zero-waste dishes.
          </p>
          <button class="btn-hero-primary" id="btn-empty-browse-catalog">
            <span>📚 Browse 30 Kitchen Scraps Catalog</span>
          </button>
        </div>
      `;
      const emptyBtn = DOM.homeRecipeGrid.querySelector('#btn-empty-browse-catalog');
      if (emptyBtn) {
        emptyBtn.addEventListener('click', () => switchTab('scraps-matrix'));
      }
      return;
    }

    DOM.homeRecipeGrid.innerHTML = '';
    list.forEach(rc => {
      const card = document.createElement('article');
      card.className = 'recipe-display-card';

      const savedKg = (0.35 + (rc.id % 5) * 0.1).toFixed(2);
      const co2Prevented = (savedKg * 1.8).toFixed(2);

      card.innerHTML = `
        <div>
          <div class="card-badges-row">
            <span class="badge badge-course">${escapeHtml(rc.course_type)}</span>
            <span class="badge badge-dietary">${escapeHtml(rc.dietary_type)}</span>
          </div>

          <h3 class="recipe-dish-title">${escapeHtml(rc.title)}</h3>

          <div class="card-byproduct-callout">
            <span class="byproduct-title-row">♻️ Scrap: ${escapeHtml(rc.scrap_name_en)}</span>
            <span class="byproduct-aliases">${escapeHtml(rc.scrap_name_regional)}</span>
          </div>

          ${rc.chef_wisdom_tip ? `<div class="card-wisdom-snippet">“${escapeHtml(rc.chef_wisdom_tip)}”</div>` : ''}
        </div>

        <div>
          <div class="card-specs-row">
            <span>⏱️ ${rc.prep_time_minutes} min</span>
            <span>⚡ ${escapeHtml(rc.difficulty)}</span>
            <span>🍽️ ${rc.servings} Servings</span>
          </div>

          <div class="card-nature-impact">
            🌱 ${savedKg} kg scrap transformed • ${co2Prevented} kg CO₂ prevented
          </div>

          <button class="btn-card-read" data-recipe-id="${rc.id}">
            <span>📖 View Recipe & Audio Guide</span>
          </button>
        </div>
      `;

      card.querySelector('.btn-card-read').addEventListener('click', () => {
        openRecipeDetailModal(rc.id);
      });

      DOM.homeRecipeGrid.appendChild(card);
    });
  }

  // ==========================================================================
  // RECIPE DETAIL MODAL & WEB SPEECH AUDIO GUIDE
  // ==========================================================================
  async function openRecipeDetailModal(recipeId) {
    stopSpeech();
    try {
      const res = await fetch(`/api/recipes/${recipeId}`);
      if (!res.ok) throw new Error('Could not fetch recipe');
      const rc = await res.json();
      state.activeRecipe = rc;

      DOM.modalRcCourse.textContent = rc.course_type;
      DOM.modalRcDietary.textContent = rc.dietary_type;
      DOM.modalRcScrapTitle.textContent = rc.scrap_name_en;
      DOM.modalRcTitle.textContent = rc.title;
      DOM.modalRcChefName.textContent = rc.chef_name;
      DOM.modalRcChefAffil.textContent = rc.chef_affiliation;
      DOM.modalRcPrep.textContent = rc.prep_time_minutes;
      DOM.modalRcDiff.textContent = rc.difficulty;
      DOM.modalRcServings.textContent = rc.servings;
      DOM.modalRcScrapEn.textContent = rc.scrap_name_en;
      DOM.modalRcScrapReg.textContent = rc.scrap_name_regional;

      // Update favorite button status
      const isFav = state.favorites.some(f => f.id === rc.id);
      updateFavoriteButtonUI(isFav);

      // Pantry Staples Checklist
      DOM.modalRcStaples.innerHTML = '';
      (rc.pantry_staples || []).forEach((staple, idx) => {
        const li = document.createElement('li');
        li.className = 'check-item-row';
        li.innerHTML = `
          <input type="checkbox" id="staple-check-${idx}" />
          <label for="staple-check-${idx}">${escapeHtml(staple)}</label>
        `;
        li.addEventListener('click', (e) => {
          if (e.target.tagName !== 'INPUT') {
            const cb = li.querySelector('input');
            cb.checked = !cb.checked;
          }
          li.classList.toggle('checked', li.querySelector('input').checked);
        });
        DOM.modalRcStaples.appendChild(li);
      });

      // Cooking Steps Checklist
      DOM.modalRcSteps.innerHTML = '';
      (rc.step_by_step_instructions || []).forEach((step, idx) => {
        const li = document.createElement('li');
        li.className = 'step-item-card';
        li.innerHTML = `
          <span class="step-circle-badge">${idx + 1}</span>
          <div class="step-text-content">${escapeHtml(step)}</div>
        `;
        li.addEventListener('click', () => {
          li.classList.toggle('step-done');
        });
        DOM.modalRcSteps.appendChild(li);
      });

      // Ancestral Wisdom
      if (rc.chef_wisdom_tip) {
        DOM.modalRcWisdomWrap.style.display = 'flex';
        DOM.modalRcWisdom.textContent = rc.chef_wisdom_tip;
      } else {
        DOM.modalRcWisdomWrap.style.display = 'none';
      }

      // Reset Audio Button
      DOM.audioIconSpan.textContent = '▶️';
      DOM.audioTextSpan.textContent = 'Listen to Voice Guide';
      DOM.btnAudioStop.style.display = 'none';

      DOM.recipeModal.showModal();
    } catch (err) {
      showToast('Failed to open recipe details.', 'error');
    }
  }

  function closeRecipeModal() {
    stopSpeech();
    DOM.recipeModal.close();
  }

  // Web Speech API Voice Guide
  function toggleSpeechNarration() {
    if (!('speechSynthesis' in window)) {
      showToast('Speech Synthesis audio guide not supported in this browser.', 'info');
      return;
    }
    if (state.isSpeaking) {
      stopSpeech();
    } else {
      startSpeech();
    }
  }

  function startSpeech() {
    if (!state.activeRecipe) return;
    window.speechSynthesis.cancel();

    const rc = state.activeRecipe;
    const ingredients = (rc.pantry_staples || []).join(', ');
    const steps = (rc.step_by_step_instructions || []).map((s, i) => `Step ${i + 1}: ${s}`).join('. ');

    const script = `
      Guiding recipe: ${rc.title}.
      Made from ${rc.scrap_name_en}.
      Cooking time is ${rc.prep_time_minutes} minutes, serving ${rc.servings} people.
      Pantry ingredients: ${ingredients}.
      Instructions: ${steps}.
      ${rc.chef_wisdom_tip ? `Chef wisdom tip: ${rc.chef_wisdom_tip}` : ''}
    `;

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.includes('en-IN')) || voices.find(v => v.lang.startsWith('en'));
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      state.isSpeaking = true;
      DOM.audioIconSpan.textContent = '⏸️';
      DOM.audioTextSpan.textContent = 'Playing Voice Guide...';
      DOM.btnAudioStop.style.display = 'inline-block';
    };

    utterance.onend = () => {
      resetSpeechUI();
    };

    utterance.onerror = () => {
      resetSpeechUI();
    };

    window.speechSynthesis.speak(utterance);
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    resetSpeechUI();
  }

  function resetSpeechUI() {
    state.isSpeaking = false;
    DOM.audioIconSpan.textContent = '▶️';
    DOM.audioTextSpan.textContent = 'Listen to Voice Guide';
    DOM.btnAudioStop.style.display = 'none';
  }

  // ==========================================================================
  // SAVED FAVORITES LOGIC (HOME CHEF)
  // ==========================================================================
  function updateFavoriteButtonUI(isFav) {
    if (DOM.favIcon) DOM.favIcon.textContent = isFav ? '❤️' : '🤍';
    if (DOM.favText) DOM.favText.textContent = isFav ? 'Saved' : 'Save';
    if (DOM.btnModalFavorite) {
      DOM.btnModalFavorite.classList.toggle('active', isFav);
      DOM.btnModalFavorite.title = isFav ? 'Remove from saved favorites' : 'Save to favorites';
    }
  }

  function toggleFavoriteRecipe() {
    if (!state.activeRecipe) return;
    const rc = state.activeRecipe;
    const idx = state.favorites.findIndex(f => f.id === rc.id);

    if (idx >= 0) {
      state.favorites.splice(idx, 1);
      showToast(`Removed "${rc.title}" from favorites`, 'info');
      updateFavoriteButtonUI(false);
    } else {
      state.favorites.push({
        id: rc.id,
        title: rc.title,
        course_type: rc.course_type,
        scrap_name_en: rc.scrap_name_en,
        chef_name: rc.chef_name,
        prep_time_minutes: rc.prep_time_minutes
      });
      showToast(`Saved "${rc.title}" to favorites! ❤️`, 'success');
      updateFavoriteButtonUI(true);
    }

    saveFavorites();
    renderAuthHeader();
  }

  function openFavoritesModal() {
    if (!DOM.favoritesModal || !DOM.favoritesListContainer) return;
    DOM.favoritesListContainer.innerHTML = '';

    if (!state.favorites || state.favorites.length === 0) {
      DOM.favoritesListContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; color: var(--text-muted);">
          <p style="font-size: 1.15rem; margin-bottom: 0.5rem; font-weight: 600;">🤍 No saved favorite recipes yet</p>
          <p style="font-size: 0.88rem;">Open any recipe and click the <strong>Save</strong> button to bookmark traditional zero-waste dishes here.</p>
        </div>
      `;
    } else {
      state.favorites.forEach(fav => {
        const card = document.createElement('div');
        card.className = 'favorite-item-card';
        card.innerHTML = `
          <div class="favorite-item-top">
            <span class="badge badge-course">${escapeHtml(fav.course_type || 'Dishes')}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">⏱️ ${fav.prep_time_minutes || 15} min</span>
          </div>
          <h4 class="favorite-item-title">${escapeHtml(fav.title)}</h4>
          <p class="favorite-item-scrap">♻️ Scrap: ${escapeHtml(fav.scrap_name_en || 'Kitchen Scrap')}</p>
          <div class="favorite-item-actions">
            <button type="button" class="btn-fav-read" data-id="${fav.id}">View Recipe</button>
            <button type="button" class="btn-fav-remove" data-id="${fav.id}" title="Remove">✕</button>
          </div>
        `;

        card.querySelector('.btn-fav-read').addEventListener('click', () => {
          DOM.favoritesModal.close();
          openRecipeDetailModal(fav.id);
        });

        card.querySelector('.btn-fav-remove').addEventListener('click', () => {
          state.favorites = state.favorites.filter(f => f.id !== fav.id);
          saveFavorites();
          openFavoritesModal();
          renderAuthHeader();
          showToast('Removed from favorites', 'info');
        });

        DOM.favoritesListContainer.appendChild(card);
      });
    }

    DOM.favoritesModal.showModal();
  }

  // ==========================================================================
  // MASTER CHEF: 2-STEP RECIPE AUTHORING STUDIO & BUILDER POPUP
  // ==========================================================================

  /**
   * Step 1: Render 30 Scraps Organized in 5 Categorized Sections for Master Chef Selection
   */
  function renderMasterChefScrapsSelector() {
    if (!DOM.masterScrapsSelectorContainer) return;
    DOM.masterScrapsSelectorContainer.innerHTML = '';

    state.categories.forEach(cat => {
      const catScraps = state.scraps.filter(s => s.category_id === cat.id);
      if (catScraps.length === 0) return;

      const catSection = document.createElement('div');
      catSection.className = 'master-cat-section';

      catSection.innerHTML = `
        <h4 class="master-cat-title">
          <span>${cat.emoji}</span>
          <span>Category ${cat.id}: ${escapeHtml(cat.name)}</span>
          <span style="font-size: 0.82rem; font-weight: 500; color: var(--text-muted); margin-left: 0.25rem;">(${escapeHtml(cat.regional)})</span>
        </h4>
        <div class="master-scraps-subgrid"></div>
      `;

      const subgrid = catSection.querySelector('.master-scraps-subgrid');

      catScraps.forEach(sc => {
        const isSelected = (state.masterChefSelectedScrapId === sc.id);
        const card = document.createElement('div');
        card.className = `master-scrap-card ${isSelected ? 'selected' : ''}`;
        card.dataset.scrapId = sc.id;

        card.innerHTML = `
          <div>
            <div class="master-scrap-card-top">
              <span class="master-scrap-id">#${sc.id}</span>
              <div class="master-scrap-radio-indicator">${isSelected ? '✓' : ''}</div>
            </div>
            <h4 class="master-scrap-name">${escapeHtml(sc.name_en)}</h4>
            <div class="master-scrap-regional">🇮🇳 ${escapeHtml(sc.name_regional)}</div>
            <p class="master-scrap-method">${escapeHtml(sc.common_uses)}</p>
          </div>
          <button type="button" class="btn-master-card-select">
            <span>${isSelected ? '✓ Selected for Recipe' : 'Select for Recipe'}</span>
          </button>
        `;

        card.addEventListener('click', () => {
          selectMasterChefScrap(sc.id);
        });

        subgrid.appendChild(card);
      });

      DOM.masterScrapsSelectorContainer.appendChild(catSection);
    });

    updateMasterStep1SelectionUI();
  }

  /**
   * Handle scrap selection in Master Chef Step 1
   */
  function selectMasterChefScrap(scrapId) {
    state.masterChefSelectedScrapId = scrapId;
    updateMasterStep1SelectionUI();

    const selectedScrap = state.scraps.find(s => s.id === scrapId);
    if (selectedScrap) {
      showToast(`Selected "${selectedScrap.name_en}". Click "Next" to build the recipe!`, 'info');
    }
  }

  /**
   * Synchronize visual selection badges, radio indicators, and the bottom sticky dock
   */
  function updateMasterStep1SelectionUI() {
    if (!DOM.masterScrapsSelectorContainer) return;

    const selId = state.masterChefSelectedScrapId;
    const cards = DOM.masterScrapsSelectorContainer.querySelectorAll('.master-scrap-card');
    cards.forEach(card => {
      const id = parseInt(card.dataset.scrapId, 10);
      const isSelected = (id === selId);
      card.classList.toggle('selected', isSelected);
      const radio = card.querySelector('.master-scrap-radio-indicator');
      if (radio) radio.textContent = isSelected ? '✓' : '';
      const btn = card.querySelector('.btn-master-card-select span');
      if (btn) btn.textContent = isSelected ? '✓ Selected for Recipe' : 'Select for Recipe';
    });

    const selectedScrap = state.scraps.find(s => s.id === selId);

    if (DOM.step1SelectedBadge) {
      if (selectedScrap) {
        DOM.step1SelectedBadge.classList.add('has-selection');
        DOM.step1SelectedBadge.innerHTML = `<span>✓ Selected: <strong>${escapeHtml(selectedScrap.name_en)}</strong></span>`;
      } else {
        DOM.step1SelectedBadge.classList.remove('has-selection');
        DOM.step1SelectedBadge.innerHTML = `<span>No scrap selected yet</span>`;
      }
    }

    if (DOM.dockSelectedScrapName) {
      if (selectedScrap) {
        const reg = selectedScrap.name_regional ? ` (${selectedScrap.name_regional.split(',')[0].trim()})` : '';
        DOM.dockSelectedScrapName.textContent = `${selectedScrap.name_en}${reg}`;
        DOM.dockSelectedScrapName.style.color = 'var(--emerald-primary)';
      } else {
        DOM.dockSelectedScrapName.textContent = 'None chosen — please click a scrap card above';
        DOM.dockSelectedScrapName.style.color = 'var(--text-muted)';
      }
    }

    if (DOM.btnMasterStep1Next) {
      DOM.btnMasterStep1Next.disabled = !selectedScrap;
    }

    if (DOM.formRcScrapId && selectedScrap) {
      DOM.formRcScrapId.value = selectedScrap.id;
    }
  }

  /**
   * Step 2: Open Master Chef Recipe Builder Pop-Up Modal
   */
  function openMasterRecipeBuilderModal() {
    if (!state.masterChefSelectedScrapId) {
      showToast('Please select a kitchen scrap first from Step 1.', 'info');
      return;
    }

    const scrap = state.scraps.find(s => s.id === state.masterChefSelectedScrapId);
    if (!scrap) return;

    if (DOM.builderScrapPill) {
      DOM.builderScrapPill.textContent = `♻️ Scrap #${scrap.id}`;
    }
    if (DOM.builderScrapTitle) {
      DOM.builderScrapTitle.textContent = scrap.name_en;
    }
    if (DOM.builderScrapReg) {
      DOM.builderScrapReg.textContent = scrap.name_regional ? `Regional aliases: ${scrap.name_regional}` : '';
    }
    if (DOM.formRcScrapId) {
      DOM.formRcScrapId.value = scrap.id;
    }

    // Pre-populate author details if user is logged in
    if (state.currentUser) {
      if (DOM.formRcChef && !DOM.formRcChef.value) {
        DOM.formRcChef.value = state.currentUser.name || '';
      }
      if (DOM.formRcAffiliation && !DOM.formRcAffiliation.value) {
        DOM.formRcAffiliation.value = state.currentUser.affiliation || '';
      }
    }

    // Set stepper indicator 2 to active
    const step2 = document.getElementById('stepper-item-2');
    if (step2) step2.classList.add('active');

    if (DOM.masterRecipeModal) {
      DOM.masterRecipeModal.showModal();
    }
  }

  /**
   * Close Master Chef Recipe Builder Pop-Up Modal
   */
  function closeMasterRecipeBuilderModal() {
    if (DOM.masterRecipeModal) {
      DOM.masterRecipeModal.close();
    }
    const step2 = document.getElementById('stepper-item-2');
    if (step2) step2.classList.remove('active');
  }

  function addPantryInputRow() {
    const row = document.createElement('div');
    row.className = 'dynamic-input-row';
    const num = DOM.pantryInputsContainer.querySelectorAll('.dynamic-input-row').length + 1;
    row.innerHTML = `
      <input type="text" class="input-pantry" placeholder="Ingredient ${num} (e.g. Mustard oil, Kalonji, Turmeric)" required />
      <button type="button" class="btn-remove-row" title="Remove">✕</button>
    `;
    DOM.pantryInputsContainer.appendChild(row);
    row.querySelector('input').focus();
  }

  function addStepInputRow() {
    const row = document.createElement('div');
    row.className = 'dynamic-input-row';
    const num = DOM.stepsInputsContainer.querySelectorAll('.dynamic-input-row').length + 1;
    row.innerHTML = `
      <span class="step-num-pill">${num}</span>
      <textarea class="input-step" rows="2" placeholder="Step ${num}: Describe preparation method..." required></textarea>
      <button type="button" class="btn-remove-row" title="Remove">✕</button>
    `;
    DOM.stepsInputsContainer.appendChild(row);
    row.querySelector('textarea').focus();
  }

  function renumberStepRows() {
    const rows = DOM.stepsInputsContainer.querySelectorAll('.dynamic-input-row');
    rows.forEach((row, idx) => {
      row.querySelector('.step-num-pill').textContent = idx + 1;
    });
  }

  /**
   * Submit new dish authored in Master Chef Step 2 Popup
   */
  async function handleMasterRecipeSubmit(e) {
    e.preventDefault();

    const scrapId = parseInt(DOM.formRcScrapId && DOM.formRcScrapId.value ? DOM.formRcScrapId.value : state.masterChefSelectedScrapId, 10);
    if (!scrapId) {
      showToast('Please select a kitchen scrap first.', 'error');
      return;
    }

    const staples = Array.from(DOM.pantryInputsContainer.querySelectorAll('.input-pantry'))
      .map(i => i.value.trim())
      .filter(Boolean);

    const steps = Array.from(DOM.stepsInputsContainer.querySelectorAll('.input-step'))
      .map(i => i.value.trim())
      .filter(Boolean);

    if (staples.length === 0 || steps.length === 0) {
      showToast('Please provide both pantry ingredients and cooking steps.', 'error');
      return;
    }

    const payload = {
      title: DOM.formRcTitle.value.trim(),
      scrap_id: scrapId,
      chef_name: DOM.formRcChef.value.trim(),
      chef_affiliation: DOM.formRcAffiliation.value.trim(),
      prep_time_minutes: parseInt(DOM.formRcPrep.value, 10),
      difficulty: DOM.formRcDiff.value,
      course_type: DOM.formRcCourse.value,
      dietary_type: DOM.formRcDietary.value,
      pantry_staples: staples,
      step_by_step_instructions: steps,
      chef_wisdom_tip: (DOM.formRcWisdom && DOM.formRcWisdom.value.trim()) ? DOM.formRcWisdom.value.trim() : null,
      servings: parseInt(DOM.formRcServings.value, 10)
    };

    const submitBtn = DOM.btnSaveRecipe || document.getElementById('btn-save-recipe');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Preserving Recipe...';
    }

    try {
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
    }
  }

  // ==========================================================================
  // NGO SURPLUS FOOD DISPATCH
  // ==========================================================================
  function renderDispatchesFeed() {
    let activeCount = 0;
    let totalPortions = 0;

    DOM.ngoDispatchesList.innerHTML = '';

    if (state.dispatches.length === 0) {
      DOM.ngoDispatchesList.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md);">
          All surplus meals have been collected by community shelters!
        </div>
      `;
      DOM.statFeedActiveMeals.textContent = '0';
      DOM.activeDispatchBadge.style.display = 'none';
      return;
    }

    state.dispatches.forEach(dp => {
      const isActive = dp.status === 'ACTIVE';
      if (isActive) {
        activeCount++;
        totalPortions += dp.portions_available;
      }

      const card = document.createElement('div');
      card.className = `dispatch-item-card ${isActive ? 'active-alert' : 'claimed-alert'}`;

      card.innerHTML = `
        <div class="disp-top-row">
          <div>
            <h4 class="disp-dish-title">${escapeHtml(dp.dish_name)}</h4>
            <span style="font-size: 0.82rem; color: var(--emerald-primary); font-weight: 700;">🍲 ${dp.portions_available} Meals Available</span>
          </div>
          <span class="disp-status-badge ${isActive ? 'active' : 'claimed'}">
            ${isActive ? '🟢 Ready for Pickup' : '🤝 Claimed'}
          </span>
        </div>

        <div class="disp-details-grid">
          <div><span>Kitchen:</span> <strong>${escapeHtml(dp.prepared_by_chef)}</strong></div>
          <div><span>Contact:</span> <strong><a href="tel:${escapeHtml(dp.contact_number)}" style="color: var(--saffron-primary); text-decoration: none;">${escapeHtml(dp.contact_number)}</a></strong></div>
          <div style="grid-column: span 2;"><span>Pickup:</span> <strong>${escapeHtml(dp.pickup_location)}</strong></div>
        </div>

        ${dp.notes ? `<div style="font-size: 0.8rem; font-style: italic; color: var(--text-secondary); background: var(--bg-base); padding: 0.4rem 0.65rem; border-radius: 4px;">“${escapeHtml(dp.notes)}”</div>` : ''}

        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.5rem; border-top: 1px solid var(--border-light);">
          <span style="font-size: 0.75rem; color: var(--text-muted);">${dp.created_at ? new Date(dp.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}</span>
          ${isActive ? `
            <button class="btn-claim-dispatch" data-dispatch-id="${dp.id}">
              1-Tap Claim for Shelter
            </button>
          ` : `
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--saffron-hover);">Claimed by: ${escapeHtml(dp.claimed_by_ngo || 'Shelter Partner')}</span>
          `}
        </div>
      `;

      if (isActive) {
        card.querySelector('.btn-claim-dispatch').addEventListener('click', () => {
          openClaimModal(dp);
        });
      }

      DOM.ngoDispatchesList.appendChild(card);
    });

    DOM.statFeedActiveMeals.textContent = totalPortions;
    DOM.activeDispatchBadge.textContent = activeCount;
    DOM.activeDispatchBadge.style.display = activeCount > 0 ? 'inline-block' : 'none';
  }

  async function handleNgoBroadcastSubmit(e) {
    e.preventDefault();

    const payload = {
      dish_name: document.getElementById('disp-dish-name').value.trim(),
      prepared_by_chef: document.getElementById('disp-chef-name').value.trim(),
      portions_available: parseInt(document.getElementById('disp-portions').value, 10),
      pickup_location: document.getElementById('disp-location').value.trim(),
      contact_number: document.getElementById('disp-contact').value.trim(),
      notes: document.getElementById('disp-notes').value.trim() || null
    };

    const submitBtn = document.getElementById('btn-submit-broadcast');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Broadcasting...';

    try {
      const res = await fetch('/api/dispatches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to post dispatch');
      }

      showToast('📢 Surplus food alert broadcast to shelters!', 'success');
      DOM.ngoBroadcastForm.reset();
      const updated = await fetch('/api/dispatches');
      if (updated.ok) state.dispatches = await updated.json();
      renderDispatchesFeed();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>📢 Broadcast Surplus Alert to Shelters</span>';
    }
  }

  function openClaimModal(dispatch) {
    state.activeClaimDispatchId = dispatch.id;
    DOM.claimTargetDish.textContent = dispatch.dish_name;
    DOM.claimTargetPortions.textContent = dispatch.portions_available;
    DOM.claimInputNgo.value = '';
    DOM.claimModal.showModal();
  }

  async function handleClaimDispatchSubmit(e) {
    e.preventDefault();
    const ngo = DOM.claimInputNgo.value.trim();
    if (!ngo || !state.activeClaimDispatchId) return;

    try {
      const res = await fetch(`/api/dispatches/${state.activeClaimDispatchId}/claim`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimed_by_ngo: ngo })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to claim batch');
      }

      showToast(`🤝 Meal batch claimed for ${ngo}!`, 'success');
      DOM.claimModal.close();
      const updated = await fetch('/api/dispatches');
      if (updated.ok) state.dispatches = await updated.json();
      renderDispatchesFeed();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // ==========================================================================
  // REAL-TIME METRIC COUNTERS ANIMATION (SMOOTH NUMBER TICKING)
  // ==========================================================================
  function animateMetricCounters() {
    const targets = [
      { element: DOM.statScrapsRescued, target: 12450, suffix: '+ kg' },
      { element: DOM.statCo2Saved, target: 31125, suffix: ' kg' },
      { element: DOM.statMealsServed, target: 1420, suffix: '+' }
    ];

    targets.forEach(item => {
      if (!item.element) return;
      const duration = 1600;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(ease * item.target);
        item.element.textContent = currentVal.toLocaleString('en-IN') + item.suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });
  }

  // ==========================================================================
  // ANCESTRAL UPCYCLING SHOWCASE (CURATED PREVIEW CARDS ON HOME PAGE)
  // Strictly informational/inspirational with direct "Cook With This Scrap" CTA
  // ==========================================================================
  function renderAncestralShowcase() {
    if (!DOM.ancestralShowcaseGrid) return;
    DOM.ancestralShowcaseGrid.innerHTML = '';

    // 6 representative ancestral byproducts across categories
    const featuredIds = [1, 10, 16, 21, 28, 11];
    const featuredScraps = state.scraps.filter(s => featuredIds.includes(s.id));

    featuredScraps.forEach(sc => {
      const catMeta = CATEGORIES_METADATA.find(c => c.id === sc.category_id) || {};
      const card = document.createElement('article');
      card.className = 'showcase-scrap-card';
      card.innerHTML = `
        <div>
          <div class="showcase-card-top">
            <span class="showcase-cat-pill">${catMeta.emoji || '🌱'} ${escapeHtml(catMeta.name || 'Byproduct')}</span>
            <span class="showcase-eco-badge">♻️ 100% Edible</span>
          </div>
          <h4 class="showcase-scrap-title">${escapeHtml(sc.name_en)}</h4>
          <div class="showcase-regional-names">🇮🇳 ${escapeHtml(sc.name_regional)}</div>
          <p class="showcase-method-text">${escapeHtml(sc.common_uses)}</p>
        </div>
        <div class="showcase-card-bottom">
          <span style="font-size: 0.76rem; color: var(--text-muted); font-weight: 600;">Ancestral Recipe Ready</span>
          <button type="button" class="btn-showcase-cook" data-scrap-id="${sc.id}">
            <span>Cook With This Scrap ➔</span>
          </button>
        </div>
      `;

      const cookBtn = card.querySelector('.btn-showcase-cook');
      if (cookBtn) {
        cookBtn.addEventListener('click', () => {
          const rc = state.recipes.find(r => r.scrap_id === sc.id);
          if (rc) {
            openRecipeDetailModal(rc.id);
          } else {
            state.selectedScrapIds.clear();
            state.selectedScrapIds.add(sc.id);
            updateCatalogCardsSelectionState();
            updateCatalogSelectionDock();
            switchTab('home-chef');
            applyFiltersAndRenderRecipes();
          }
        });
      }

      DOM.ancestralShowcaseGrid.appendChild(card);
    });
  }

  // ==========================================================================
  // BROWSABLE 30-SCRAPS CATALOG (5 EXPANDABLE VISUAL CATEGORY SECTIONS)
  // No search bar — 100% browsable visual organization matching reference guide
  // ==========================================================================
  function renderCategorizedCatalog() {
    if (!DOM.categoriesCatalogContainer) return;
    DOM.categoriesCatalogContainer.innerHTML = '';

    CATEGORIES_METADATA.forEach(cat => {
      const catScraps = state.scraps.filter(s => s.category_id === cat.id);
      if (catScraps.length === 0) return;

      const accordion = document.createElement('div');
      accordion.className = 'catalog-category-accordion';
      accordion.dataset.categoryId = cat.id;

      accordion.innerHTML = `
        <button type="button" class="catalog-category-header" aria-expanded="true">
          <div class="cat-header-left">
            <span class="cat-header-emoji">${cat.emoji}</span>
            <div>
              <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
                <h3 class="cat-header-title">Category ${cat.id}: ${escapeHtml(cat.name)}</h3>
                <span class="cat-header-count">${catScraps.length} Scraps</span>
              </div>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0.2rem 0 0 0;">${escapeHtml(cat.description)}</p>
            </div>
          </div>
          <div class="cat-header-toggle-icon">▼</div>
        </button>
        <div class="catalog-category-body">
          <div class="catalog-category-grid"></div>
        </div>
      `;

      // Accordion toggle
      const headerBtn = accordion.querySelector('.catalog-category-header');
      headerBtn.addEventListener('click', () => {
        const isCollapsed = accordion.classList.toggle('collapsed');
        headerBtn.setAttribute('aria-expanded', (!isCollapsed).toString());
      });

      // Populate rich scrap cards
      const grid = accordion.querySelector('.catalog-category-grid');
      catScraps.forEach(sc => {
        const isSelected = state.selectedScrapIds.has(sc.id);
        const card = document.createElement('div');
        card.className = `scrap-item-rich-card ${isSelected ? 'selected' : ''}`;
        card.dataset.scrapId = sc.id;

        card.innerHTML = `
          <div>
            <div class="scrap-card-header">
              <span class="scrap-card-id">#${sc.id}</span>
              <span class="scrap-card-category-tag">${cat.emoji} Cat ${cat.id}</span>
            </div>
            <h4 class="scrap-card-title">${escapeHtml(sc.name_en)}</h4>
            <div class="scrap-card-regional">🇮🇳 ${escapeHtml(sc.name_regional)}</div>
            <p class="scrap-card-method">${escapeHtml(sc.common_uses)}</p>
          </div>
          <div class="scrap-card-actions">
            <button type="button" class="btn-scrap-select-toggle" data-scrap-id="${sc.id}">
              <span>${isSelected ? '✓ Selected' : '+ Select Scrap'}</span>
            </button>
            <button type="button" class="btn-scrap-view-recipe" data-scrap-id="${sc.id}">
              <span>View Recipe ➔</span>
            </button>
          </div>
        `;

        // Toggle button click
        const toggleBtn = card.querySelector('.btn-scrap-select-toggle');
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleCatalogScrapSelection(sc.id);
        });

        // Entire card click (except View Recipe) toggles selection
        card.addEventListener('click', (e) => {
          if (e.target.closest('.btn-scrap-view-recipe')) return;
          toggleCatalogScrapSelection(sc.id);
        });

        // View Recipe button
        const viewRecipeBtn = card.querySelector('.btn-scrap-view-recipe');
        viewRecipeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const rc = state.recipes.find(r => r.scrap_id === sc.id);
          if (rc) {
            openRecipeDetailModal(rc.id);
          } else {
            showToast(`Recipe for ${sc.name_en} will be uploaded soon!`, 'info');
          }
        });

        grid.appendChild(card);
      });

      DOM.categoriesCatalogContainer.appendChild(accordion);
    });

    updateCatalogSelectionDock();
  }

  function toggleCatalogScrapSelection(scrapId) {
    if (state.selectedScrapIds.has(scrapId)) {
      state.selectedScrapIds.delete(scrapId);
    } else {
      state.selectedScrapIds.add(scrapId);
    }

    updateCatalogCardsSelectionState();
    updateCatalogSelectionDock();
    applyFiltersAndRenderRecipes();
  }

  function updateCatalogCardsSelectionState() {
    if (!DOM.categoriesCatalogContainer) return;
    const cards = DOM.categoriesCatalogContainer.querySelectorAll('.scrap-item-rich-card');
    cards.forEach(card => {
      const id = parseInt(card.dataset.scrapId, 10);
      const isSelected = state.selectedScrapIds.has(id);
      card.classList.toggle('selected', isSelected);
      const toggleBtn = card.querySelector('.btn-scrap-select-toggle span');
      if (toggleBtn) {
        toggleBtn.textContent = isSelected ? '✓ Selected' : '+ Select Scrap';
      }
    });
  }

  function selectAllIngredientsFromCatalog() {
    state.selectedScrapIds = new Set(state.scraps.map(s => s.id));
    updateCatalogCardsSelectionState();
    updateCatalogSelectionDock();
    applyFiltersAndRenderRecipes();
    showToast('All 30 kitchen ingredients selected!', 'success');
  }

  function clearIngredientsFromCatalog() {
    state.selectedScrapIds.clear();
    updateCatalogCardsSelectionState();
    updateCatalogSelectionDock();
    applyFiltersAndRenderRecipes();
    showToast('Selection cleared. Tap any scrap card to select.', 'info');
  }

  function updateCatalogSelectionDock() {
    if (!DOM.guideSelectionBar) return;

    const count = state.selectedScrapIds.size;
    if (count === 0) {
      DOM.guideSelectionBar.style.display = 'none';
      return;
    }

    DOM.guideSelectionBar.style.display = 'flex';

    if (DOM.selBarCount) {
      DOM.selBarCount.textContent = `${count} Selected`;
    }

    if (DOM.selBarNames) {
      if (count === state.scraps.length) {
        DOM.selBarNames.textContent = 'All 30 Indian household ingredients selected';
      } else {
        const names = state.scraps
          .filter(s => state.selectedScrapIds.has(s.id))
          .map(s => s.name_en)
          .join(', ');
        DOM.selBarNames.textContent = names;
        DOM.selBarNames.title = names;
      }
    }

    const matchingCount = state.recipes.filter(r => state.selectedScrapIds.has(r.scrap_id)).length;
    if (DOM.selRecipesCount) {
      DOM.selRecipesCount.textContent = matchingCount;
    }
  }

  function viewRecipesForCatalogSelection() {
    if (state.selectedScrapIds.size === 0) {
      selectAllIngredientsFromCatalog();
    }

    const homeTabBtn = document.getElementById('nav-tab-home-chef');
    if (homeTabBtn) homeTabBtn.style.display = 'inline-flex';

    switchTab('home-chef');
    applyFiltersAndRenderRecipes();

    const rcSection = document.getElementById('home-recipe-grid');
    if (rcSection) {
      setTimeout(() => {
        rcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }

    showToast(`✨ Showing zero-waste recipes for your selected ingredients!`, 'success');
  }

  // ==========================================================================
  // TOAST NOTIFICATIONS & UTILITIES
  // ==========================================================================
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;

    DOM.toastTray.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Self-Start
  document.addEventListener('DOMContentLoaded', init);
})();
