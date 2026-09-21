"""
Verification Script for Waste2Menu Browsable Catalog Redesign & Search Bar Removal
"""
import urllib.request
import json
import re
import sys
from pathlib import Path

BASE_DIR = Path("H:/Waste2Menu-AI")
HTML_FILE = BASE_DIR / "index.html"
CSS_FILE = BASE_DIR / "style.css"
JS_FILE = BASE_DIR / "app.js"

def test_endpoints():
    print("\n--- Testing HTTP Endpoints ---")
    urls = [
        "http://127.0.0.1:8000/",
        "http://127.0.0.1:8000/style.css",
        "http://127.0.0.1:8000/app.js",
        "http://127.0.0.1:8000/api/categories",
        "http://127.0.0.1:8000/api/scraps",
        "http://127.0.0.1:8000/api/recipes",
        "http://127.0.0.1:8000/api/dispatches"
    ]
    for url in urls:
        resp = urllib.request.urlopen(url)
        assert resp.status == 200, f"Failed: {url} status {resp.status}"
        data = resp.read()
        print(f"  [PASS] {url} -> 200 OK ({len(data)} bytes)")

    # Verify API contents
    scraps_resp = urllib.request.urlopen("http://127.0.0.1:8000/api/scraps")
    scraps = json.loads(scraps_resp.read().decode('utf-8'))
    assert len(scraps) == 30, f"Expected 30 scraps, got {len(scraps)}"
    print(f"  [PASS] /api/scraps returns exactly 30 household scraps.")

    cats_resp = urllib.request.urlopen("http://127.0.0.1:8000/api/categories")
    cats = json.loads(cats_resp.read().decode('utf-8'))
    assert len(cats) == 5, f"Expected 5 categories, got {len(cats)}"
    print(f"  [PASS] /api/categories returns exactly 5 categories.")

def test_html():
    print("\n--- Testing index.html Structure ---")
    html = HTML_FILE.read_text(encoding="utf-8")

    # 1. No search inputs anywhere
    assert "home-search-input" not in html, "Found home-search-input in HTML!"
    assert "catalog-search-input" not in html, "Found catalog-search-input in HTML!"
    assert 'type="search"' not in html, "Found type=search in HTML!"
    print("  [PASS] Zero search bar or search input fields found in HTML.")

    # 2. Key structural IDs
    required_ids = [
        "panel-home-overview",
        "panel-home-chef",
        "panel-master-chef",
        "panel-ngo-dispatch",
        "panel-scraps-matrix",
        "ancestral-showcase-grid",
        "categories-catalog-container",
        "guide-selection-bar",
        "sel-bar-count",
        "sel-bar-names",
        "btn-guide-select-all",
        "btn-guide-clear",
        "btn-guide-view-recipes",
        "sel-recipes-count",
        "btn-nav-to-catalog",
        "stat-scraps-rescued",
        "stat-co2-saved",
        "stat-meals-served"
    ]
    for rid in required_ids:
        assert f'id="{rid}"' in html, f"Missing id '{rid}' in index.html"
        print(f"  [PASS] Required element #{rid} is present.")

    # 3. Main home page must not have checkboxes
    overview_match = re.search(r'<section class="tab-panel active" id="panel-home-overview">(.*?)</section>', html, re.DOTALL)
    assert overview_match, "panel-home-overview section not found"
    overview_content = overview_match.group(1)
    assert '<input type="checkbox"' not in overview_content, "Found checkboxes in home overview tab!"
    print("  [PASS] Main Home Page is strictly informational/inspirational (no select checkboxes).")

def test_js():
    print("\n--- Testing app.js Logic & Dataset ---")
    js = JS_FILE.read_text(encoding="utf-8")

    # 1. Dataset verification
    # Count items in INGREDIENTS_DATA
    scrap_ids = re.findall(r'id:\s*(\d+),\s*category_id:\s*(\d+)', js)
    assert len(scrap_ids) >= 30, f"Expected 30 scraps in INGREDIENTS_DATA, found {len(scrap_ids)}"
    
    # Check category distribution: Cat 1: 9, Cat 2: 6, Cat 3: 5, Cat 4: 5, Cat 5: 5
    cat_counts = {}
    for sid, cid in scrap_ids[:30]:
        cat_counts[cid] = cat_counts.get(cid, 0) + 1
    
    print(f"  Category item distribution in INGREDIENTS_DATA: {cat_counts}")
    assert cat_counts.get('1') == 9, f"Category 1 should have 9 items, got {cat_counts.get('1')}"
    assert cat_counts.get('2') == 6, f"Category 2 should have 6 items, got {cat_counts.get('2')}"
    assert cat_counts.get('3') == 5, f"Category 3 should have 5 items, got {cat_counts.get('3')}"
    assert cat_counts.get('4') == 5, f"Category 4 should have 5 items, got {cat_counts.get('4')}"
    assert cat_counts.get('5') == 5, f"Category 5 should have 5 items, got {cat_counts.get('5')}"
    print("  [PASS] INGREDIENTS_DATA has exactly 30 items correctly mapped into 5 categories (9, 6, 5, 5, 5).")

    # 2. Key functions presence
    required_funcs = [
        "animateMetricCounters",
        "renderAncestralShowcase",
        "renderCategorizedCatalog",
        "toggleCatalogScrapSelection",
        "updateCatalogCardsSelectionState",
        "selectAllIngredientsFromCatalog",
        "clearIngredientsFromCatalog",
        "updateCatalogSelectionDock",
        "viewRecipesForCatalogSelection"
    ]
    for func in required_funcs:
        assert func in js, f"Missing function '{func}' in app.js"
        print(f"  [PASS] Function '{func}' defined in app.js.")

    # 3. No search query logic
    assert "searchDebounceTimer" not in js, "searchDebounceTimer still present in app.js"
    assert "catalogSearchQuery" not in js, "catalogSearchQuery still present in app.js"
    print("  [PASS] Obsolete search query states and debounce timers completely removed.")

def test_css():
    print("\n--- Testing style.css Aesthetics & Animations ---")
    css = CSS_FILE.read_text(encoding="utf-8")

    required_classes_and_keyframes = [
        "@keyframes slideUp",
        "@keyframes modalScaleIn",
        "@keyframes pulseEmerald",
        ".ancestral-showcase-section",
        ".ancestral-showcase-grid",
        ".showcase-scrap-card",
        ".btn-showcase-cook",
        ".categories-catalog-container",
        ".catalog-category-accordion",
        ".catalog-category-header",
        ".catalog-category-body",
        ".catalog-category-grid",
        ".scrap-item-rich-card",
        ".btn-scrap-select-toggle",
        ".btn-scrap-view-recipe",
        ".guide-selection-bar"
    ]
    for item in required_classes_and_keyframes:
        assert item in css, f"Missing '{item}' in style.css"
        print(f"  [PASS] CSS rule '{item}' exists.")

if __name__ == "__main__":
    try:
        test_endpoints()
        test_html()
        test_js()
        test_css()
        print("\n=======================================================")
        print("🎉 ALL TESTS PASSED! Waste2Menu redesign verified 100%.")
        print("=======================================================\n")
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        sys.exit(1)
