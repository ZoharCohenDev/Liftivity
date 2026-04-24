# ML Pipeline for Liftivity

This directory contains the machine learning pipeline for analyzing website quality.

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt
npm install -g lighthouse  # If not already installed

# 2. Test feature extraction on sample websites
python test_feature_extraction.py

# 3. Output appears in:
#    - data/processed/test_features.csv
#    - data/processed/test_extraction_log.json
```

## Directory Structure

```
ml/
├── requirements.txt                    # Python dependencies
├── README.md                          # This file
├── FEATURE_EXTRACTION_GUIDE.md         # Detailed guide for feature extraction
├── feature_extraction/                # Core feature extraction package
│   ├── __init__.py
│   ├── extractor.py                   # Main orchestrator
│   ├── nlp_features.py                # Text quality metrics
│   ├── dom_features.py                # HTML structure metrics
│   └── performance_features.py        # Lighthouse metrics
├── test_feature_extraction.py          # Test script (run this first!)
├── labeling/                          # Placeholder for labeling logic
├── models/                            # Placeholder for trained models
└── notebooks/                         # Placeholder for analysis notebooks
```

## Current Status

**✓ Implemented:**
- Feature extraction for 13 priority features (NLP + DOM + Performance)
- Test pipeline with sample URLs
- Modular, extensible architecture

**→ Next (Week 1–4):**
1. Validate extraction on 5–10 test websites
2. Expand to 100–300 diverse websites
3. Implement labeling heuristic
4. Train baseline Linear Regression model

## Features Extracted (13 Priority + Extras)

### Priority Features (13 for baseline model)
- **NLP (5):** text length, readability grade, reading ease, sentence length, spelling errors
- **DOM (5):** H1 count, heading hierarchy, image alt text, meta description, mobile viewport
- **Performance (3):** Lighthouse score, LCP, CLS

### Bonus Features (included in extraction)
- Sentiment polarity/subjectivity
- Heading density
- Schema markup presence
- Forms count and accessibility
- External link ratio

## Usage Examples

### Extract for One URL
```python
from feature_extraction import extract_all_features

result = extract_all_features('https://example.com')
print(result['features'])  # Dictionary of 25+ features
```

### Extract for Multiple URLs
```python
from feature_extraction import extract_batch

urls = ['https://site1.com', 'https://site2.com']
results = extract_batch(urls)
```

### Batch Process to CSV
```python
from feature_extraction import extract_batch
import csv

urls = [...]  # Your list of URLs
results = extract_batch(urls)

# Save to CSV
with open('features.csv', 'w') as f:
    writer = csv.DictWriter(f, fieldnames=['url', ...])
    for result in results:
        writer.writerow({
            'url': result['url'],
            **result['features']
        })
```

## Dependencies

- `beautifulsoup4` — HTML parsing
- `requests` — HTTP requests
- `textstat` — Readability metrics
- `textblob` — Sentiment analysis
- `spellchecker` — Spelling error detection
- `nltk` — Natural language processing
- `playwright` — (future: for screenshots)
- `pandas` — Data manipulation
- `numpy` — Numerical computing

## Performance Notes

- **Per-website time:** ~30 seconds (most spent on Lighthouse)
- **Bottleneck:** Lighthouse performance analysis
- **100 websites:** ~50 minutes
- **300 websites:** ~2.5 hours

For faster iteration during development:
- Skip Lighthouse (comment out in `extractor.py`)
- Extract only NLP + DOM features (10–15 seconds per site)

## Month 1 Plan

```
Week 1: Validate extraction on 5–10 test websites
Week 2: Scale to 100–300 websites, create dataset
Week 3: Implement labeling heuristic (0–100 quality score)
Week 4: Train baseline Linear Regression model
```

## Documentation

- **Feature Details:** See `FEATURE_SPECIFICATION.md` (in parent directory)
- **Feature Guide:** See `FEATURE_EXTRACTION_GUIDE.md`
- **Full Architecture:** See `MONTH1_ML_GUIDE.md` (in parent directory)

---

**Next Step:** Run `python test_feature_extraction.py` to validate the extraction pipeline!
