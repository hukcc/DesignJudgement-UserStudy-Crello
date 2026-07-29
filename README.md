# DesignJudgement — Crello User Study

A public, mobile-friendly, **blind A/B design study**. Each trial shows two designs with the same
content — a human **golden** reference and an **AI candidate** — with identity hidden and left/right
randomized per participant. The participant picks the better-looking one. It's **100 randomly-sampled
pairs** (~20–25 min). At the end the page shows how the participant did versus every judge model, broken
down by whether the models were mostly wrong / wavering / mostly right on each pair.

Results are **submitted automatically** to a Google Sheet on finish (with a manual **Export JSON**
fallback). Hosting is static (GitHub Pages); data collection is a free Google Apps Script — no server.

## Live study

**https://hukcc.github.io/DesignJudgement-UserStudy-Crello/**

(Available after you enable GitHub Pages — see step 3.)

## Files

| File | Purpose |
|------|---------|
| `index.html` | The entire study — self-contained (images embedded as base64). Nothing to build. |
| `config.js` | **The one file you edit:** paste your Apps Script `/exec` URL here to turn on auto-submit. |
| `apps-script/Code.gs` | The Google Apps Script that receives results and appends them to your Sheet. |
| `.nojekyll` | Tells GitHub Pages to serve files as-is. |

## Setup (3 steps, ~5 min)

### 1. Stand up the data collector (Google Apps Script → Google Sheet)
1. Create a new **Google Sheet** (it will store responses).
2. **Extensions ▸ Apps Script** → delete the sample code → paste the contents of
   [`apps-script/Code.gs`](apps-script/Code.gs) → **Save**.
3. **Deploy ▸ New deployment ▸** (gear) **Web app** →
   **Execute as: Me**, **Who has access: Anyone** → **Deploy** → authorize → **copy the Web app URL**
   (it ends in `/exec`).
4. *(optional)* In the editor, run `sendTestRow` once to confirm a row appears in the Sheet.

### 2. Turn on auto-submit
Edit **`config.js`** and paste your URL:
```js
window.GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
```
Commit the change. (Leave it `""` and the study still works, but only offers a manual JSON download.)

### 3. Publish on GitHub Pages
Repo **Settings ▸ Pages** → **Build and deployment ▸ Source: Deploy from a branch** →
**Branch: `main`**, **folder: `/ (root)`** → **Save**. The URL above goes live in ~1 minute.

## Collecting & analyzing results

- Each finished participant becomes **one row** in your Sheet; the full per-trial JSON is in the
  `fullJson` column. Download the Sheet (or the individual JSONs) when you're ready to analyze.
- To pool across participants and get the human-vs-model leaderboard + per-stratum breakdown, feed the
  exported JSONs to `aggregate_study.py` in the main DesignJudgeAgent repo.

## Privacy

No accounts, no cookies, no personal data is requested — only the design choices, timing, a random
participant ID, browser user-agent, and language. Consider adding a one-line consent note if you
recruit publicly.
