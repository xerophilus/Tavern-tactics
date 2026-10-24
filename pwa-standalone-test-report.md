# Tavern Tactics PWA Standalone Mode Test Report
**Test Date:** October 24, 2026
**Device Emulation:** iPhone 15 Safari (393x852px)
**Test Rounds:** 2 rounds completed
**URL:** https://tavern-tactics.vercel.app/

---

## CRITICAL TESTS RESULTS

### ❌ TEST 1: 3-COPY MERGE (FAILED)
**Status:** **FAIL**
**Evidence:** `test-merge-before-3-shadowbanes.png`

**What Was Tested:**
- Purchased 3x Shadowbane heroes (identical 1-star units: 90 HP, 20 ATK, 6 armor each)
- All 3 remained in party as separate units
- Attempted drag-and-drop to trigger merge - no effect
- Expected: 3x 1-star → auto-merge to 1x 2-star

**Result:** Merge mechanic is NOT working. Heroes do not auto-combine when 3 copies exist.

**Screenshots Show:**
- Before: 3 separate Shadowbane units visible in party row
- After drag attempt: Still 3 separate units
- No 2-star hero appeared

---

### ✅ TEST 2: BOTTOM VISIBLE (PASS)
**Status:** **PASS**

**What Was Tested:**
- "Enter Dungeon" button visibility in shop screen
- "End Turn" button visibility in combat screen
- Card hand area at bottom of screen

**Result:** All bottom UI elements are fully visible above the home indicator zone. No clipping detected.

---

### ⚠️ TEST 3: PARTY READABLE (PARTIAL FAIL)
**Status:** **PARTIAL FAIL**
**Evidence:** `test-combat-readability.png`

**What Works:**
✅ Enemy names: "SKELETON WARRIOR 60/60 HP", "ORC RAIDER 70/70 HP" displayed in crisp WHITE text
✅ Enemy HP values clearly visible

**What Fails:**
❌ Party hero names: NOT visible as white text labels
❌ Party shows dark silhouettes/cards without readable name overlays
❌ Readability mismatch: Enemies have clear white labels, party heroes do not

**Expected:** Party hero names and HP should display in white text matching enemy readability.

---

### ❌ TEST 4: MAP STYLE (FAILED)
**Status:** **FAIL**
**Evidence:** `test-map-FAIL-tiny-boxes.png`

**What Was Seen:**
- Map displays 6-11 TINY rectangular boxes per vertical column
- Boxes arranged in horizontal bars/rows
- NO large circular nodes visible
- NO SVG connection lines between nodes visible

**Expected:** 2-4 BIG round nodes per row with SVG connection LINES between them.

**Result:** Map is using old tiny-box layout, not the redesigned large-node-with-lines layout.

---

### ✅ TEST 5: SHOP NAMES (PASS)
**Status:** **PASS**
**Evidence:** `test-shop-names-initial.png`

**What Works:**
✅ Full hero names visible:
  - "THROK THE MIGHTY" (not truncated)
  - "SIR REGINALD" (not "Sir")
  - "MERLIN"
  - "SHADOWBANE"
  - "GRONAH IRONHIDE"
  - "SYLVARA"

✅ Hero stats displayed (HP, ATK, armor icons)

**Note:** Could not clearly verify star rating indicators (★) on 1-star heroes in screenshots. Icons are small/dark and may need visual enhancement.

---

### ✅ TEST 6: COMBAT CLARITY (PASS)
**Status:** **PASS**

**What Works:**
✅ "BATTLE BEGINS!" indicator visible
✅ "End Turn" button clearly labeled
✅ Turn sequence visible at bottom (hero card abilities shown)
✅ Enemy turn indicators visible
✅ Card targeting appears functional (abilities displayed on hero cards)

---

## SUMMARY

### PASSING TESTS (3/6): ✅
1. ✅ **Bottom Visible** - All buttons and UI elements visible above home indicator
2. ✅ **Shop Names** - Full hero names displayed correctly
3. ✅ **Combat Clarity** - Turn indicators and targeting are clear

### FAILING TESTS (2/6): ❌
1. ❌ **3-Copy Merge** - Auto-merge mechanic not working for 3 identical heroes
2. ❌ **Map Style** - Displaying tiny boxes instead of large nodes with SVG lines

### PARTIAL FAILURES (1/6): ⚠️
1. ⚠️ **Party Readable** - Enemy text is white/clear, but party hero names are not visible as labels

---

## CRITICAL ISSUES TO FIX

### Priority 1: Auto-Merge Logic
**File:** Likely in hero purchase/party management logic
**Issue:** When 3 identical heroes (same name, same tier) exist in party/bench, they should automatically merge into a 2-star version with upgraded stats.
**Current Behavior:** Heroes remain as 3 separate 1-star units.

### Priority 2: Map Layout
**File:** Map/encounter selection screen component
**Issue:** Map is rendering tiny rectangular boxes in a grid/column layout.
**Expected:** Large circular nodes (2-4 per row) connected by SVG path lines showing progression routes.

### Priority 3: Party Name Display
**File:** Combat UI - party hero rendering
**Issue:** Party hero cards show silhouettes but no white text name labels.
**Expected:** Party hero names should appear in white text above/on hero cards, matching enemy name display style.

---

## SCREENSHOTS CAPTURED
1. `test-shop-names-initial.png` - Shop screen showing full hero names
2. `test-merge-before-3-shadowbanes.png` - 3 Shadowbanes in party (pre-merge attempt)
3. `test-map-FAIL-tiny-boxes.png` - Map showing tiny box layout
4. `test-combat-readability.png` - Combat screen showing enemy names (white) vs party silhouettes

---

## TEST ENVIRONMENT NOTES
- Viewport: 393x852px (iPhone 15)
- DevTools device toolbar used for emulation
- App manifest confirms `display: standalone` is set
- Safe area insets appear to be working correctly (bottom UI not clipped)
- Tested in Round 1 and Round 2 encounters

