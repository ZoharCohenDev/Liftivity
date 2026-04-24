# Liftivity Month 1: ML Pipeline Guide

## 1. Feature Design

### 1.1 NLP Features (Text Quality & Readability)

Extract from the page's main content (body text, excluding navigation/footer):

| Feature | Tool/Method | Why It Matters |
|---------|------------|----------------|
| **Text length** | Word count | Content richness indicator |
| **Flesch Kincaid Grade** | `textstat` library | Readability difficulty |
| **Flesch Reading Ease** | `textstat` | Overall readability (0-100, higher = easier) |
| **Avg sentence length** | Token count / sentence count | Complexity indicator |
| **Avg word length** | Char count / word count | Vocabulary difficulty |
| **Unique word ratio** | Unique words / total words | Content diversity |
| **Passive voice %** | `nltk` + linguistic rules | Writing quality |
| **Sentiment polarity** | `TextBlob` or `transformers` | Tone (positive/negative) |
| **Subjectivity** | `TextBlob` | Opinion vs fact balance |
| **Spelling errors count** | `pyspellchecker` | Grammar/quality proxy |

**Implementation:**
```python
import textstat
from textblob import TextBlob

def extract_nlp_features(text):
    return {
        'text_length': len(text.split()),
        'flesch_kincaid': textstat.flesch_kincaid_grade(text),
        'flesch_ease': textstat.flesch_reading_ease(text),
        'avg_sentence_length': textstat.avg_sentence_length(text),
        'sentiment_polarity': TextBlob(text).sentiment.polarity,
        'subjectivity': TextBlob(text).sentiment.subjectivity,
        # ... more metrics
    }
```

---

### 1.2 DOM / Structure Features (HTML Quality)

Extract from the parsed HTML/DOM:

| Feature | How to Detect | Why It Matters |
|---------|--------------|----------------|
| **Heading hierarchy valid** | h1 exists, h2 follows h1, no gaps | SEO + accessibility |
| **Heading count** | Count h1-h6 tags | Content organization |
| **Image alt text %** | Images with alt / total images | Accessibility |
| **Broken images %** | HTTP requests for img src | Quality indicator |
| **External links ratio** | External / total links | Content richness |
| **Broken links count** | HTTP 404 responses | Maintenance quality |
| **Meta description present** | Check meta[name="description"] | SEO completeness |
| **Meta keywords present** | Check meta[name="keywords"] | SEO setup |
| **Schema markup** | Check <script type="application/ld+json"> | Rich snippet support |
| **Forms present** | Count <form> tags | Interactivity |
| **Form labels** | Label count / input count | Accessibility |
| **Video embed count** | iframe + video tags | Multimedia richness |
| **Code blocks present** | <code>, <pre> | Technical content |
| **Rel attributes** | nofollow, canonical, etc. | SEO awareness |

**Implementation:**
```python
from bs4 import BeautifulSoup
import requests

def extract_dom_features(html, base_url):
    soup = BeautifulSoup(html, 'html.parser')
    
    features = {}
    
    # Heading hierarchy
    h1_count = len(soup.find_all('h1'))
    h2_count = len(soup.find_all('h2'))
    features['h1_count'] = h1_count
    features['h2_count'] = h2_count
    features['heading_hierarchy_valid'] = h1_count >= 1  # Simple check
    
    # Images
    images = soup.find_all('img')
    images_with_alt = sum(1 for img in images if img.get('alt'))
    features['image_alt_ratio'] = images_with_alt / len(images) if images else 0
    
    # Links
    links = soup.find_all('a', href=True)
    external_links = sum(1 for link in links if not link['href'].startswith(base_url))
    features['external_link_ratio'] = external_links / len(links) if links else 0
    
    # Meta tags
    features['meta_description_present'] = bool(soup.find('meta', {'name': 'description'}))
    features['meta_keywords_present'] = bool(soup.find('meta', {'name': 'keywords'}))
    
    # Schema markup
    features['schema_markup_present'] = bool(soup.find('script', {'type': 'application/ld+json'}))
    
    return features
```

---

### 1.3 Performance Features (Lighthouse Metrics)

Use Lighthouse API or `lighthouse` CLI:

| Feature | How to Get | Why It Matters |
|---------|-----------|----------------|
| **Lighthouse score** | Lighthouse API | Overall performance |
| **First Contentful Paint (FCP)** | Lighthouse metrics | Speed perception |
| **Largest Contentful Paint (LCP)** | Lighthouse metrics | Core Web Vital |
| **Cumulative Layout Shift (CLS)** | Lighthouse metrics | Core Web Vital |
| **Time to Interactive (TTI)** | Lighthouse metrics | Usability |
| **Total Blocking Time (TBT)** | Lighthouse metrics | Interactivity |
| **Page size (bytes)** | Sum of resources | Optimization |
| **Request count** | Total network requests | Bloat indicator |
| **Third-party script count** | Iframe + external scripts | Dependency bloat |

**Implementation:**
```python
import json
import subprocess

def extract_lighthouse_features(url):
    """Run Lighthouse and extract metrics"""
    result = subprocess.run(
        ['lighthouse', url, '--output=json', '--quiet'],
        capture_output=True,
        text=True
    )
    data = json.loads(result.stdout)
    
    metrics = data['audits']['metrics']['details']['items'][0]
    
    return {
        'lighthouse_score': data['categories']['performance']['score'] * 100,
        'fcp': metrics.get('firstContentfulPaint'),
        'lcp': metrics.get('largestContentfulPaint'),
        'cls': metrics.get('cumulativeLayoutShift'),
        'tti': metrics.get('interactive'),
    }
```

---

### 1.4 Basic Visual Features (Screenshots)

Light analysis without deep learning:

| Feature | How to Extract | Why It Matters |
|---------|---------------|----------------|
| **Screenshot dimensions** | Viewport size | Design responsiveness |
| **Color palette size** | Dominant colors (via `PIL`) | Design simplicity |
| **Text/background contrast** | Pixel analysis (basic) | Accessibility |
| **Whitespace ratio** | Non-content area / total | Design breathing room |
| **Image count (visual)** | Count in screenshot | Visual richness |

**Implementation:**
```python
from PIL import Image
import numpy as np

def extract_visual_features(screenshot_path):
    """Extract basic visual features from screenshot"""
    img = Image.open(screenshot_path)
    
    # Convert to RGB and analyze
    img_rgb = img.convert('RGB')
    pixels = np.array(img_rgb)
    
    # Color palette (approximate)
    unique_colors = len(set(map(tuple, pixels.reshape(-1, 3))))
    
    # Whitespace (simple: white/light pixels)
    white_pixels = np.sum((pixels > 200).all(axis=2))
    whitespace_ratio = white_pixels / (pixels.shape[0] * pixels.shape[1])
    
    return {
        'image_width': img.width,
        'image_height': img.height,
        'color_palette_size': unique_colors,
        'whitespace_ratio': whitespace_ratio,
    }
```

---

### 1.5 Feature Summary

**Total features: ~25–30**

| Category | Count | Example Features |
|----------|-------|------------------|
| NLP | 10 | readability, sentiment, text length |
| DOM | 10 | heading hierarchy, image alt %, schema markup |
| Performance | 5 | lighthouse score, LCP, CLS |
| Visual | 4 | color palette, whitespace ratio |

Start with all of these, but you'll drop low-variance features during model training.

---

## 2. Dataset Structure

### 2.1 Directory Organization

```
liftivity/
├── data/
│   ├── raw/
│   │   ├── websites.csv           # URLs to analyze
│   │   ├── html/                  # Crawled HTML files
│   │   │   ├── site_1.html
│   │   │   ├── site_2.html
│   │   │   └── ...
│   │   ├── screenshots/           # Screenshot PNGs
│   │   │   ├── site_1.png
│   │   │   └── ...
│   │   └── lighthouse_reports/    # Lighthouse JSON
│   │       ├── site_1.json
│   │       └── ...
│   │
│   ├── processed/
│   │   ├── features.csv           # All extracted features + label
│   │   ├── feature_metadata.json  # Feature names, scaling info
│   │   ├── train_test_split.json  # Train/test indices
│   │   └── label_distribution.png # Visualization
│   │
│   └── labels/
│       ├── heuristic_labels.csv   # Heuristic scoring results
│       ├── manual_validation.csv  # Small manual labeling
│       └── label_methodology.md   # How labels were created
│
├── ml/
│   ├── feature_extraction.py      # Extract all features
│   ├── labeling.py                # Heuristic + label generation
│   ├── preprocessing.py           # Normalization, train/test split
│   ├── baseline_model.py          # Linear Regression training
│   ├── evaluation.py              # Metrics, visualization
│   └── models/
│       ├── baseline_v1.pkl        # Trained model
│       └── model_v1_metadata.json # Performance, features used
│
└── notebooks/
    └── 01_exploratory_analysis.ipynb  # EDA, feature correlation
```

### 2.2 CSV Format: `features.csv`

```
url,text_length,flesch_kincaid,sentiment_polarity,...,lighthouse_score,whitespace_ratio,target_score,label_source
https://example.com,450,8.2,0.65,...,85,0.35,72,heuristic
https://another.com,1200,5.1,0.72,...,92,0.42,81,heuristic
...
```

**Key columns:**
- `url`: Website URL (primary key)
- `target_score`: Quality score 0–100 (your label)
- `label_source`: "heuristic" | "lighthouse" | "manual" | "combined"
- All feature columns (25–30 numeric features)

### 2.3 Label CSV: `heuristic_labels.csv`

```
url,readability_score,seo_score,performance_score,accessibility_score,combined_score,notes
https://example.com,75,68,90,70,76,"Good performance, needs better accessibility"
...
```

This helps trace where your label came from.

---

## 3. First Model Implementation

### 3.1 Baseline: Linear Regression

**Why linear regression first?**
- Interpretable (feature importance)
- Fast (good feedback loop)
- Benchmark (know what tree models beat)
- Good for understanding feature relationships

**Approach:**

```python
# ml/baseline_model.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import json

def train_baseline_model(features_csv_path, output_dir='ml/models'):
    """
    Train a linear regression baseline model
    
    Args:
        features_csv_path: Path to features.csv with extracted features
        output_dir: Where to save the model and metadata
    """
    
    # Load data
    df = pd.read_csv(features_csv_path)
    
    # Separate features and target
    X = df.drop(['url', 'target_score', 'label_source'], axis=1)
    y = df['target_score']
    
    # Train/test split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features (important for interpretability)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = LinearRegression()
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred_train = model.predict(X_train_scaled)
    y_pred_test = model.predict(X_test_scaled)
    
    train_mae = mean_absolute_error(y_train, y_pred_train)
    test_mae = mean_absolute_error(y_test, y_pred_test)
    test_r2 = r2_score(y_test, y_pred_test)
    
    print(f"Train MAE: {train_mae:.2f}")
    print(f"Test MAE: {test_mae:.2f}")
    print(f"Test R²: {test_r2:.4f}")
    
    # Feature importance (coefficients)
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'coefficient': model.coef_
    }).sort_values('coefficient', key=abs, ascending=False)
    
    print("\nTop 10 features:")
    print(feature_importance.head(10))
    
    # Save model
    joblib.dump(model, f'{output_dir}/baseline_v1.pkl')
    joblib.dump(scaler, f'{output_dir}/baseline_v1_scaler.pkl')
    
    # Save metadata
    metadata = {
        'model_type': 'LinearRegression',
        'train_mae': float(train_mae),
        'test_mae': float(test_mae),
        'test_r2': float(test_r2),
        'features_used': list(X.columns),
        'feature_importance': feature_importance.to_dict('records'),
        'train_size': len(X_train),
        'test_size': len(X_test),
    }
    
    with open(f'{output_dir}/baseline_v1_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    return model, scaler, metadata

# Usage
if __name__ == '__main__':
    train_baseline_model('data/processed/features.csv')
```

### 3.2 Next: Tree-based Model (XGBoost)

After validating the baseline, upgrade to:

```python
# ml/xgboost_model.py

import xgboost as xgb
from sklearn.model_selection import cross_val_score

def train_xgboost_model(features_csv_path, output_dir='ml/models'):
    """Train XGBoost model with cross-validation"""
    
    df = pd.read_csv(features_csv_path)
    X = df.drop(['url', 'target_score', 'label_source'], axis=1)
    y = df['target_score']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # XGBoost (no scaling needed)
    model = xgb.XGBRegressor(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        subsample=0.8,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    test_mae = mean_absolute_error(y_test, y_pred)
    test_r2 = r2_score(y_test, y_pred)
    
    print(f"XGBoost Test MAE: {test_mae:.2f}")
    print(f"XGBoost Test R²: {test_r2:.4f}")
    
    # Feature importance
    importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop 10 features by importance:")
    print(importance.head(10))
    
    # Save
    joblib.dump(model, f'{output_dir}/xgboost_v1.pkl')
    
    return model
```

---

## 4. Evaluation Approach

### 4.1 Regression Metrics

For predicting a quality score (0–100):

| Metric | Formula | Interpretation | Target |
|--------|---------|-----------------|--------|
| **MAE** | Avg \|y - ŷ\| | Avg error in points | < 5 points |
| **RMSE** | √(Avg(y - ŷ)²) | Penalizes large errors | < 7 points |
| **R²** | 1 - (SS_res / SS_tot) | % variance explained | > 0.7 for month 1 |
| **MAPE** | Avg \|(y - ŷ) / y\| | % error | < 10% |

```python
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

def evaluate_model(y_true, y_pred):
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)
    mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100
    
    print(f"MAE: {mae:.2f} points")
    print(f"RMSE: {rmse:.2f} points")
    print(f"R²: {r2:.4f}")
    print(f"MAPE: {mape:.2f}%")
    
    return {'mae': mae, 'rmse': rmse, 'r2': r2, 'mape': mape}
```

### 4.2 Residual Analysis

Check if your model has systematic errors:

```python
import matplotlib.pyplot as plt

def plot_residuals(y_true, y_pred):
    residuals = y_true - y_pred
    
    fig, axes = plt.subplots(1, 2, figsize=(12, 4))
    
    # Residuals vs predicted
    axes[0].scatter(y_pred, residuals, alpha=0.6)
    axes[0].axhline(y=0, color='r', linestyle='--')
    axes[0].set_xlabel('Predicted Score')
    axes[0].set_ylabel('Residuals')
    axes[0].set_title('Residual Plot')
    
    # Histogram of residuals
    axes[1].hist(residuals, bins=20, edgecolor='black')
    axes[1].set_xlabel('Residuals')
    axes[1].set_ylabel('Frequency')
    axes[1].set_title('Residual Distribution')
    
    plt.tight_layout()
    plt.savefig('residuals.png')
```

### 4.3 Feature Analysis

Understand which features matter most:

```python
def analyze_features(model, feature_names):
    """For linear model: coefficients. For tree: feature importance."""
    
    if hasattr(model, 'coef_'):  # Linear model
        importance = pd.DataFrame({
            'feature': feature_names,
            'coefficient': model.coef_
        }).sort_values('coefficient', key=abs, ascending=False)
    else:  # Tree model
        importance = pd.DataFrame({
            'feature': feature_names,
            'importance': model.feature_importances_
        }).sort_values('importance', ascending=False)
    
    print(importance.head(15))
    return importance
```

### 4.4 Cross-Validation

To ensure robust results:

```python
from sklearn.model_selection import cross_val_score

def cross_validate_model(model, X, y, cv=5):
    scores = cross_val_score(model, X, y, cv=cv, scoring='r2')
    print(f"CV R² scores: {scores}")
    print(f"Mean R²: {scores.mean():.4f} (+/- {scores.std():.4f})")
```

---

## 5. Month 1 Workflow

### Week 1: Data Collection & Features

1. Create website list (100–300 URLs)
   - Use Alexa top sites, relevant domains, diverse categories
2. Scrape HTML + screenshots (with delays to be respectful)
3. Run Lighthouse on each
4. Extract all 25–30 features
5. Result: `data/processed/features.csv` ✓

### Week 2: Labeling & EDA

1. Create heuristic labels (combine 4–5 feature groups)
   - E.g., `(readability_score * 0.3) + (performance_score * 0.4) + ...`
2. Validate with Lighthouse scores
3. Exploratory Data Analysis (EDA)
   - Feature distributions
   - Correlation matrix
   - Target variable statistics
4. Identify any data issues

### Week 3: Baseline Model

1. Train Linear Regression baseline
2. Evaluate (MAE, RMSE, R²)
3. Analyze feature importance
4. Identify weak predictions (residual analysis)

### Week 4: Improvement & Integration

1. Train XGBoost model
2. Compare with baseline
3. Connect to system: `URL → features → model prediction → GPT explanation`
4. Document findings

---

## 6. Next Steps (Month 2+)

- Add more labeled data (manual validation)
- Engineer new features (embeddings, advanced NLP)
- Tune hyperparameters
- Classification model (low/medium/high quality)
- Deploy model as microservice

---

## References

- **Readability:** `textstat` library
- **NLP:** `nltk`, `textblob`, `transformers`
- **Scraping:** `requests`, `BeautifulSoup`
- **ML:** `scikit-learn`, `xgboost`
- **Visual:** `PIL`, `OpenCV` (basic features first)
