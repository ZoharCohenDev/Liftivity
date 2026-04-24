# Feature Extraction Layer - Implementation Guide

## Overview

Your feature extraction pipeline is now ready. This guide explains the structure and how to use it.

---

## Priority Features (13 Baseline)

These are the 13 features implemented and prioritized for your baseline model:

### NLP Features (5 features)
1. **`text_length_words`** — Total words in main content (proxy for content richness)
2. **`flesch_kincaid_grade`** — Reading grade level (ideal: 8–10)
3. **`flesch_reading_ease`** — Overall readability score 0–100 (ideal: 50–70)
4. **`avg_sentence_length_words`** — Average words per sentence (ideal: 12–17)
5. **`spelling_error_ratio`** — % of words misspelled (ideal: < 2%)

### DOM Features (5 features)
6. **`h1_count`** — Number of H1 tags (ideal: 1)
7. **`heading_hierarchy_valid`** — Is heading structure proper? (0 or 1)
8. **`image_alt_text_ratio`** — % of images with alt text (ideal: 100%)
9. **`meta_description_present`** — Does page have meta description? (0 or 1)
10. **`meta_viewport_present`** — Is page mobile-responsive? (0 or 1)

### Performance Features (3 features)
11. **`lighthouse_performance_score`** — Lighthouse performance 0–100 (ideal: > 70)
12. **`lcp_ms`** — Largest Contentful Paint in ms (ideal: < 2500ms)
13. **`cls`** — Cumulative Layout Shift 0–1 (ideal: < 0.1)

**Plus:** Additional optional features included (sentiment, heading density, forms count, etc.)

---

## Project Structure

```
ml/
├── requirements.txt                    # Python dependencies
├── feature_extraction/                 # Main package
│   ├── __init__.py
│   ├── nlp_features.py                # NLP feature extraction
│   ├── dom_features.py                # DOM/HTML feature extraction
│   ├── performance_features.py        # Lighthouse integration
│   └── extractor.py                   # Main orchestrator
├── test_feature_extraction.py          # Test script
└── FEATURE_EXTRACTION_GUIDE.md         # This file
```

---

## How to Use

### 1. Install Dependencies

```bash
cd ml
pip install -r requirements.txt
```

**Note:** Lighthouse requires Node.js. Install globally:
```bash
npm install -g lighthouse
```

### 2. Extract Features for a Single URL

```python
from feature_extraction import extract_all_features

# Extract all features for one website
result = extract_all_features('https://example.com')

print(result)
# Output: {
#   'url': 'https://example.com',
#   'success': True/False,
#   'error': None or error message,
#   'features': {
#       'text_length_words': 1234,
#       'flesch_kincaid_grade': 8.5,
#       ... (all other features)
#   },
#   'metadata': { ... }
# }
```

### 3. Extract Features for Multiple URLs

```python
from feature_extraction import extract_batch

urls = [
    'https://example.com',
    'https://github.com',
    'https://wikipedia.org',
]

results = extract_batch(urls)

# results is a list of dictionaries (same format as above)
```

### 4. Run the Test Pipeline

Test the extraction on 8 diverse websites:

```bash
python ml/test_feature_extraction.py
```

**Output:**
- `data/processed/test_features.csv` — Features in CSV format (for inspection)
- `data/processed/test_extraction_log.json` — Full results with metadata

---

## Module Details

### `nlp_features.py`
Extracts text-based quality metrics using:
- `textstat` — Readability metrics (Flesch-Kincaid, etc.)
- `textblob` — Sentiment analysis
- `spellchecker` — Spelling error detection
- `nltk` — Sentence tokenization

**Input:** Cleaned text (HTML removed)  
**Output:** Dictionary of 8 NLP features

### `dom_features.py`
Extracts HTML structure metrics using:
- `BeautifulSoup` — HTML parsing
- `requests` — HTTP link checking (optional, slow)

**Input:** Raw HTML string + base URL  
**Output:** Dictionary of 12 DOM features

### `performance_features.py`
Extracts Lighthouse metrics by:
- Running Lighthouse CLI
- Parsing JSON output
- Extracting Core Web Vitals

**Input:** Website URL  
**Output:** Dictionary of 6 performance metrics

### `extractor.py` (Orchestrator)
Coordinates the full pipeline:
1. Fetches HTML from URL
2. Extracts main content text
3. Calls all three feature modules
4. Combines results into a single dictionary

**Input:** Website URL  
**Output:** Complete feature dictionary + metadata

---

## Feature Extraction Flow

```
URL
  ↓
[Fetch HTML]
  ↓
[Parse HTML + Extract Main Text]
  ├→ [NLP Features] → {text readability metrics}
  ├→ [DOM Features] → {HTML structure metrics}
  └→ [Performance] → {Lighthouse metrics}
  ↓
[Combine All Features]
  ↓
Dictionary: {url, success, error, features{}, metadata{}}
```

---

## Output Format

Each extraction returns:

```json
{
  "url": "https://example.com",
  "success": true,
  "error": null,
  "features": {
    "text_length_words": 1500,
    "flesch_kincaid_grade": 8.5,
    "flesch_reading_ease": 62.3,
    "avg_sentence_length_words": 14.2,
    "spelling_error_ratio": 0.01,
    "h1_count": 1,
    "heading_hierarchy_valid": 1,
    "image_alt_text_ratio": 0.95,
    "meta_description_present": 1,
    "meta_viewport_present": 1,
    "lighthouse_performance_score": 85.0,
    "lcp_ms": 2100,
    "cls": 0.08,
    ... (other optional features)
  },
  "metadata": {
    "html_length": 45000,
    "text_length": 8500,
    "url_domain": "example.com"
  }
}
```

---

## Next Steps (Month 1)

### Week 1: Validate Extraction
- [ ] Run `test_feature_extraction.py` on test URLs
- [ ] Inspect output CSV and JSON
- [ ] Check for any extraction errors
- [ ] Verify feature ranges make sense

### Week 2: Expand to 50–100 URLs
- [ ] Create list of 50–100 diverse websites (SaaS, e-commerce, blogs)
- [ ] Extract features for all URLs
- [ ] Create `data/processed/features.csv`
- [ ] Analyze feature distributions

### Week 3: Create Labels
- [ ] Implement labeling heuristic formula
- [ ] Generate 0–100 quality labels for each URL
- [ ] Create `target_score` column in CSV

### Week 4: Train Baseline Model
- [ ] Train Linear Regression on 13 priority features
- [ ] Evaluate (MAE, RMSE, R²)
- [ ] Analyze feature importance
- [ ] Prepare for Month 2 improvements

---

## Troubleshooting

### Lighthouse Installation
If you get "Lighthouse not found":
```bash
npm install -g lighthouse
```

### Feature Extraction Timeout
If a website takes too long, it may hang. Edit timeout in:
- `feature_extraction/extractor.py`: `self.timeout = 10` (seconds)
- `feature_extraction/performance_features.py`: `self.timeout = 120` (Lighthouse)

### Missing Dependencies
If you get import errors:
```bash
pip install -r ml/requirements.txt
```

### Lighthouse Metrics are None
Some websites may not work with Lighthouse (timeouts, blocked). This is normal. The extractor returns `None` for those features.

---

## Tips for Month 1

1. **Start with 5–10 test URLs** — Verify extraction works before scaling
2. **Use diverse domains** — SaaS, e-commerce, blogs, news sites
3. **Check for errors** — Look at the JSON log to see what failed
4. **Monitor extraction time** — On average: ~30 seconds per URL (most spent on Lighthouse)
5. **Focus on 13 priority features** — Don't get distracted by optional features yet
6. **Clean up failed extractions** — Remove URLs that consistently fail

---

## Extending Features (Future)

When you're ready to add more features:

1. **Add visual features** → Extend `feature_extraction/visual_features.py`
2. **Add more NLP metrics** → Extend `nlp_features.py` (e.g., topic modeling, keyword density)
3. **Add custom metrics** → Create a new module and import in `extractor.py`

Each module is independent, so new features are easy to add without breaking existing code.
