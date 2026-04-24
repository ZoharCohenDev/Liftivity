# Liftivity Feature Specification

## Overview

This document defines **27 core features** across 4 categories for the baseline model. Each feature includes:
- **Definition:** What it measures
- **Computation:** Exact method
- **Code:** Implementation template
- **Range:** Expected values
- **Priority:** Core vs. optional (for baseline)
- **Why:** Business rationale

---

## Category 1: NLP Features (Text Quality & Readability)

These measure how well-written, clear, and accessible the main content is.

### Priority: **HIGH** (Include in baseline)

---

#### 1.1 `text_length_words`
**Definition:** Total word count of main content (excluding nav, footer, ads)

**Computation:**
```
text_length_words = total_words(extracted_text)
```

**Code:**
```python
def extract_text_length(soup):
    # Remove script, style, nav, footer tags
    for tag in soup(['script', 'style', 'nav', 'footer', 'noscript']):
        tag.decompose()
    
    text = soup.get_text(separator=' ', strip=True)
    word_count = len(text.split())
    
    return {
        'text_length_words': word_count
    }
```

**Range:** 100–5,000 words (typical websites)

**Why:** Content richness. Thin content (< 300 words) often indicates low-quality sites.

---

#### 1.2 `flesch_kincaid_grade`
**Definition:** Grade level needed to understand the text (0–18+)

**Computation:**
```
FKG = 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
```
- Grade 8–10 = optimal (business writing)
- Grade 12+ = too complex
- Grade 6 = too simple

**Code:**
```python
import textstat

def extract_readability(text):
    fkg = textstat.flesch_kincaid_grade(text)
    flesch_ease = textstat.flesch_reading_ease(text)
    
    return {
        'flesch_kincaid_grade': fkg,
        'flesch_reading_ease': flesch_ease,  # 0-100, higher = easier
    }
```

**Range:** 4–16 (typical web content is 8–12)

**Why:** Grade level 8–10 is ideal. Too high = barrier to entry. Too low = looks unprofessional.

---

#### 1.3 `flesch_reading_ease`
**Definition:** Overall readability score (0–100)

**Computation:**
```
FRE = 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
- 0–30: College-level (hard)
- 50–60: 10th grade (ideal for web)
- 90–100: 5th grade (simple)
```

**Range:** 20–90 (websites typically 40–70)

**Why:** Directly measures how easy content is to read. Higher = better UX.

---

#### 1.4 `avg_sentence_length_words`
**Definition:** Average words per sentence

**Computation:**
```
avg_sentence_length = total_words / sentence_count
```

**Code:**
```python
import nltk
nltk.download('punkt')  # One-time

def extract_sentence_metrics(text):
    sentences = nltk.sent_tokenize(text)
    words = text.split()
    
    avg_sentence = len(words) / len(sentences) if sentences else 0
    
    return {
        'avg_sentence_length_words': avg_sentence,
    }
```

**Range:** 10–25 words/sentence (ideal: 12–17)

**Why:** Shorter sentences = clearer writing. Long sentences are harder to parse.

---

#### 1.5 `avg_word_length_chars`
**Definition:** Average characters per word

**Computation:**
```
avg_word_length = total_characters / total_words
```

**Code:**
```python
def extract_word_metrics(text):
    words = text.split()
    total_chars = sum(len(word) for word in words)
    avg_length = total_chars / len(words) if words else 0
    
    return {
        'avg_word_length_chars': avg_length,
    }
```

**Range:** 4–6 characters (ideal: 4.5–5.5)

**Why:** Shorter words = simpler vocabulary = better accessibility.

---

#### 1.6 `unique_word_ratio`
**Definition:** % of unique words (vocabulary diversity)

**Computation:**
```
unique_word_ratio = unique_words / total_words
```

**Code:**
```python
def extract_vocabulary_diversity(text):
    words = [w.lower() for w in text.split() if len(w) > 3]
    unique_ratio = len(set(words)) / len(words) if words else 0
    
    return {
        'unique_word_ratio': unique_ratio,
    }
```

**Range:** 0.3–0.7 (typical: 0.4–0.6)

**Why:** Too low = repetitive/boring. Too high = unclear focus.

---

#### 1.7 `sentiment_polarity`
**Definition:** Overall sentiment (-1 to +1)

**Computation:**
- -1.0: Very negative
- 0.0: Neutral
- +1.0: Very positive

**Code:**
```python
from textblob import TextBlob

def extract_sentiment(text):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    
    return {
        'sentiment_polarity': polarity,
        'sentiment_subjectivity': subjectivity,
    }
```

**Range:** -1 to +1

**Why:** Negative sites (complaints, errors) indicate quality issues. Balanced tone is better.

---

#### 1.8 `sentiment_subjectivity`
**Definition:** How subjective vs. factual is the text (0 to +1)

**Computation:**
- 0.0: Completely objective/factual
- +1.0: Completely subjective/opinion-based

**Range:** 0 to +1

**Why:** Business/product sites should be somewhat objective. Blogs can be more subjective. Extreme values = red flag.

---

#### 1.9 `spelling_error_ratio`
**Definition:** % of words with spelling errors

**Computation:**
```
spelling_error_ratio = misspelled_words / total_words
```

**Code:**
```python
from spellchecker import SpellChecker

def extract_spelling_errors(text):
    spell = SpellChecker()
    words = text.split()
    
    # Filter out very short words and numbers
    words_to_check = [w.lower() for w in words if len(w) > 2 and not w.isdigit()]
    
    misspelled = spell.unknown(words_to_check)
    error_ratio = len(misspelled) / len(words_to_check) if words_to_check else 0
    
    return {
        'spelling_error_ratio': error_ratio,
    }
```

**Range:** 0–0.1 (typical: 0–0.02)

**Why:** Spelling errors = lack of quality control / professionalism.

---

#### 1.10 `heading_density`
**Definition:** Ratio of heading words to total words

**Computation:**
```
heading_density = words_in_headings / total_words
```

**Code:**
```python
def extract_heading_metrics(soup):
    headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
    heading_words = sum(len(h.get_text().split()) for h in headings)
    
    total_text = soup.get_text().split()
    total_words = len(total_text)
    
    heading_density = heading_words / total_words if total_words else 0
    
    return {
        'heading_density': heading_density,
    }
```

**Range:** 0.02–0.15 (typical: 0.05–0.10)

**Why:** Good heading coverage = well-structured content. Low = hard to scan.

---

## Category 2: DOM / Structure Features (HTML Quality & Accessibility)

These measure the technical quality of the HTML and structural organization.

### Priority: **HIGH** (Include in baseline)

---

#### 2.1 `h1_count`
**Definition:** Number of H1 tags

**Computation:**
```
h1_count = count(<h1> tags)
```

**Code:**
```python
def extract_heading_structure(soup):
    h1s = soup.find_all('h1')
    h2s = soup.find_all('h2')
    h3s = soup.find_all('h3')
    
    return {
        'h1_count': len(h1s),
        'h2_count': len(h2s),
        'h3_count': len(h3s),
    }
```

**Range:** 0–3 (ideal: 1)

**Why:** SEO best practice: exactly 1 H1 per page. Multiple H1s = poor structure.

---

#### 2.2 `heading_hierarchy_valid`
**Definition:** Does heading structure follow proper hierarchy? (0 or 1)

**Computation:**
```
valid = (H1 exists) AND (no gaps like H1 → H3 directly) AND (H1 before other headings)
```

**Code:**
```python
def extract_heading_hierarchy(soup):
    headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
    
    if not headings:
        return {'heading_hierarchy_valid': 0}
    
    # Check H1 exists and is first
    h1_exists = any(h.name == 'h1' for h in headings)
    if not h1_exists:
        return {'heading_hierarchy_valid': 0}
    
    # Check no large gaps
    levels = [int(h.name[1]) for h in headings]
    valid = 1
    for i in range(1, len(levels)):
        if levels[i] - levels[i-1] > 1:  # Gap larger than 1
            valid = 0
            break
    
    return {'heading_hierarchy_valid': valid}
```

**Range:** 0 or 1

**Why:** Proper hierarchy = accessibility + SEO. Invalid = confusing structure.

---

#### 2.3 `image_alt_text_ratio`
**Definition:** % of images with alt text

**Computation:**
```
alt_ratio = images_with_alt / total_images
```

**Code:**
```python
def extract_image_metrics(soup):
    images = soup.find_all('img')
    images_with_alt = sum(1 for img in images if img.get('alt'))
    
    alt_ratio = images_with_alt / len(images) if images else 1  # No images = pass
    
    return {
        'image_alt_text_ratio': alt_ratio,
        'total_images': len(images),
    }
```

**Range:** 0–1 (ideal: 1.0 = all images have alt text)

**Why:** Accessibility + SEO. Missing alt text = excluding users + lowering SEO.

---

#### 2.4 `broken_link_ratio`
**Definition:** % of links that return 404 or timeout

**Computation:**
```
broken_ratio = broken_links / total_links
```

**Code:**
```python
import requests
from urllib.parse import urljoin

def extract_link_metrics(soup, base_url, timeout=5):
    links = soup.find_all('a', href=True)
    broken_count = 0
    
    for link in links:
        href = link['href']
        
        # Skip anchors, javascript, mailto
        if href.startswith('#') or href.startswith('javascript:') or href.startswith('mailto:'):
            continue
        
        full_url = urljoin(base_url, href)
        
        try:
            response = requests.head(full_url, timeout=timeout, allow_redirects=True)
            if response.status_code >= 400:
                broken_count += 1
        except:
            broken_count += 1  # Timeout = broken
    
    # Only count external links (internal links harder to check)
    external_links = [l['href'] for l in links if not l['href'].startswith('#')]
    
    broken_ratio = broken_count / len(external_links) if external_links else 0
    
    return {
        'broken_link_ratio': broken_ratio,
    }
```

**Range:** 0–1 (ideal: 0 = no broken links)

**Why:** Broken links = poor maintenance. Indicates abandoned or careless site.

---

#### 2.5 `external_link_ratio`
**Definition:** % of links pointing to external domains

**Computation:**
```
external_ratio = external_links / total_links
```

**Code:**
```python
from urllib.parse import urlparse

def extract_link_distribution(soup, base_url):
    links = soup.find_all('a', href=True)
    base_domain = urlparse(base_url).netloc
    
    external_count = 0
    for link in links:
        href = link['href']
        if href.startswith('http'):  # Full URL
            link_domain = urlparse(href).netloc
            if link_domain != base_domain:
                external_count += 1
    
    external_ratio = external_count / len(links) if links else 0
    
    return {
        'external_link_ratio': external_ratio,
        'total_links': len(links),
    }
```

**Range:** 0–1 (typical: 0.1–0.3)

**Why:** Some external links = credibility + citations. Too many = ad spam. None = isolated content.

---

#### 2.6 `meta_description_present`
**Definition:** Does page have a meta description? (0 or 1)

**Computation:**
```
present = bool(<meta name="description" content="...">)
```

**Code:**
```python
def extract_meta_tags(soup):
    meta_desc = soup.find('meta', {'name': 'description'})
    meta_keywords = soup.find('meta', {'name': 'keywords'})
    meta_viewport = soup.find('meta', {'name': 'viewport'})
    
    return {
        'meta_description_present': 1 if meta_desc else 0,
        'meta_keywords_present': 1 if meta_keywords else 0,
        'meta_viewport_present': 1 if meta_viewport else 0,  # Mobile-responsive
    }
```

**Range:** 0 or 1

**Why:** Meta description is critical for SEO click-through rates.

---

#### 2.7 `meta_viewport_present`
**Definition:** Does page declare mobile-responsive viewport? (0 or 1)

**Computation:**
```
present = bool(<meta name="viewport" content="width=device-width, initial-scale=1">)
```

**Range:** 0 or 1

**Why:** No viewport meta = site doesn't work on mobile. Major quality indicator.

---

#### 2.8 `schema_markup_present`
**Definition:** Does page include structured data (JSON-LD, microdata)? (0 or 1)

**Computation:**
```
present = bool(<script type="application/ld+json">)
```

**Code:**
```python
def extract_schema_markup(soup):
    json_ld = soup.find('script', {'type': 'application/ld+json'})
    microdata = bool(soup.find(attrs={'itemscope': True}))
    
    return {
        'schema_markup_present': 1 if json_ld or microdata else 0,
    }
```

**Range:** 0 or 1

**Why:** Schema markup = rich snippets in search results = higher CTR. Shows SEO effort.

---

#### 2.9 `forms_count`
**Definition:** Number of forms on the page

**Computation:**
```
forms_count = count(<form> tags)
```

**Code:**
```python
def extract_interactivity(soup):
    forms = soup.find_all('form')
    inputs = soup.find_all('input')
    buttons = soup.find_all('button')
    
    return {
        'forms_count': len(forms),
        'input_count': len(inputs),
        'button_count': len(buttons),
    }
```

**Range:** 0–10 (typical: 0–3)

**Why:** Forms = conversion opportunities. Zero forms on e-commerce = red flag.

---

#### 2.10 `input_label_ratio`
**Definition:** % of form inputs that have associated labels

**Computation:**
```
label_ratio = inputs_with_labels / total_inputs
```

**Code:**
```python
def extract_form_accessibility(soup):
    inputs = soup.find_all(['input', 'textarea', 'select'])
    labels = soup.find_all('label')
    
    # Simple heuristic: input has label if name attribute matches label's for attribute
    labeled = 0
    for inp in inputs:
        if inp.get('id') and any(label.get('for') == inp.get('id') for label in labels):
            labeled += 1
    
    label_ratio = labeled / len(inputs) if inputs else 1
    
    return {
        'input_label_ratio': label_ratio,
    }
```

**Range:** 0–1 (ideal: 1 = all inputs labeled)

**Why:** Labeled inputs = accessibility + usability.

---

## Category 3: Performance Features (Lighthouse & Core Web Vitals)

These measure speed, interactivity, and visual stability.

### Priority: **HIGH** (Include in baseline)

---

#### 3.1 `lighthouse_performance_score`
**Definition:** Lighthouse performance score (0–100)

**Computation:**
```
From Lighthouse API: categories.performance.score * 100
```

**Code:**
```python
import subprocess
import json

def extract_lighthouse_metrics(url):
    """Run Lighthouse and extract metrics"""
    try:
        result = subprocess.run(
            ['lighthouse', url, '--output=json', '--quiet', '--chrome-flags="--headless"'],
            capture_output=True,
            text=True,
            timeout=120
        )
        
        data = json.loads(result.stdout)
        
        perf_score = data['categories']['performance']['score'] * 100
        metrics = data['audits']['metrics']['details']['items'][0]
        
        return {
            'lighthouse_performance_score': perf_score,
            'fcp_ms': metrics.get('firstContentfulPaint'),
            'lcp_ms': metrics.get('largestContentfulPaint'),
            'cls': metrics.get('cumulativeLayoutShift'),
            'tti_ms': metrics.get('interactive'),
            'tbt_ms': metrics.get('totalBlockingTime'),
        }
    except Exception as e:
        print(f"Lighthouse error for {url}: {e}")
        return {
            'lighthouse_performance_score': 0,
            'fcp_ms': None,
            'lcp_ms': None,
            'cls': None,
            'tti_ms': None,
            'tbt_ms': None,
        }
```

**Range:** 0–100

**Why:** Directly tied to user experience and SEO ranking.

---

#### 3.2 `fcp_ms` (First Contentful Paint)
**Definition:** Time until first content appears (milliseconds)

**Range:** 0–5000ms (ideal: < 1800ms)

**Why:** User perceives this as "page is loading". Faster = better.

---

#### 3.3 `lcp_ms` (Largest Contentful Paint)
**Definition:** Time until largest content element is visible (milliseconds)

**Range:** 0–8000ms (ideal: < 2500ms)

**Why:** Core Web Vital. Major ranking factor.

---

#### 3.4 `cls` (Cumulative Layout Shift)
**Definition:** How much the page layout shifts unexpectedly (unitless, 0–1)

**Range:** 0–1 (ideal: < 0.1)

**Why:** Core Web Vital. High CLS = annoying user experience.

---

#### 3.5 `tti_ms` (Time to Interactive)
**Definition:** Time until page is fully interactive (milliseconds)

**Range:** 0–10000ms (ideal: < 3800ms)

**Why:** User can click/type. Slower = frustration.

---

#### 3.6 `tbt_ms` (Total Blocking Time)
**Definition:** Sum of time windows where main thread is blocked (milliseconds)

**Range:** 0–5000ms (ideal: < 300ms)

**Why:** Measures JS execution that blocks user interaction.

---

#### 3.7 `page_size_kb`
**Definition:** Total page size (HTML + CSS + JS + images) in KB

**Computation:**
```
Sum all HTTP response body sizes
```

**Code:**
```python
async def extract_page_size(playwright_context):
    """Track page size during Playwright navigation"""
    total_size = 0
    
    async def handle_response(response):
        nonlocal total_size
        try:
            total_size += len(await response.body())
        except:
            pass
    
    page = await playwright_context.new_page()
    page.on('response', handle_response)
    
    await page.goto(url, wait_until='networkidle')
    
    return {
        'page_size_kb': total_size / 1024,
    }
```

**Range:** 100–10000 KB (typical: 1000–3000 KB)

**Why:** Bloated pages = slower load, higher bandwidth cost.

---

#### 3.8 `request_count`
**Definition:** Total HTTP requests

**Range:** 5–500 (typical: 20–100)

**Why:** More requests = slower (network latency). High request count = bloat.

---

## Category 4: Visual Features (Screenshot Analysis)

These measure design quality from the rendered page.

### Priority: **MEDIUM** (Optional for baseline, add later)

---

#### 4.1 `color_palette_size`
**Definition:** Number of unique colors in the screenshot (approximate)

**Computation:**
```
Count unique RGB values (quantized to nearest 10)
```

**Code:**
```python
from PIL import Image
import numpy as np

def extract_visual_features(screenshot_path):
    img = Image.open(screenshot_path).convert('RGB')
    pixels = np.array(img)
    
    # Quantize to nearest 10 for approximate palette
    quantized = (pixels // 10) * 10
    unique_colors = len(set(map(tuple, quantized.reshape(-1, 3))))
    
    return {
        'color_palette_size': unique_colors,
    }
```

**Range:** 10–500 (ideal: 20–100)

**Why:** Limited palette = consistent design. Too many = chaotic.

---

#### 4.2 `whitespace_ratio`
**Definition:** % of white/blank pixels in screenshot

**Computation:**
```
whitespace_ratio = white_pixels / total_pixels
```

**Code:**
```python
def extract_whitespace(screenshot_path):
    img = Image.open(screenshot_path).convert('RGB')
    pixels = np.array(img)
    
    # White = RGB(255, 255, 255), light gray > 200, 200, 200
    white_mask = (pixels > 200).all(axis=2)
    whitespace_ratio = np.sum(white_mask) / white_mask.size
    
    return {
        'whitespace_ratio': whitespace_ratio,
    }
```

**Range:** 0–1 (ideal: 0.2–0.5)

**Why:** Some whitespace = breathing room. Too much = empty. Too little = cluttered.

---

#### 4.3 `text_image_ratio`
**Definition:** Approximate ratio of text pixels to image pixels

**Computation:**
```
Estimate text vs images using OCR-lite or color clustering
```

**Code (simplified):**
```python
def extract_text_image_ratio(screenshot_path):
    img = Image.open(screenshot_path).convert('RGB')
    pixels = np.array(img)
    
    # Simple heuristic: dark pixels = text, light = background/images
    dark_pixels = np.sum((pixels < 100).any(axis=2))
    light_pixels = np.sum((pixels > 150).all(axis=2))
    
    text_image_ratio = dark_pixels / light_pixels if light_pixels > 0 else 0
    
    return {
        'text_image_ratio': text_image_ratio,
    }
```

**Range:** 0–2 (typical: 0.3–1.0)

**Why:** Good balance = professional. Too text-heavy = boring. Too image-heavy = slow.

---

## Feature Priority Matrix

### Baseline Model (Month 1)

**Must-have (High Priority):**
- `text_length_words` (NLP)
- `flesch_kincaid_grade` (NLP)
- `flesch_reading_ease` (NLP)
- `avg_sentence_length_words` (NLP)
- `spelling_error_ratio` (NLP)
- `h1_count` (DOM)
- `heading_hierarchy_valid` (DOM)
- `image_alt_text_ratio` (DOM)
- `meta_description_present` (DOM)
- `meta_viewport_present` (DOM)
- `lighthouse_performance_score` (Performance)
- `lcp_ms` (Performance)
- `cls` (Performance)

**Nice-to-have (Medium Priority):**
- `sentiment_polarity` (NLP)
- `heading_density` (NLP)
- `broken_link_ratio` (DOM)
- `external_link_ratio` (DOM)
- `schema_markup_present` (DOM)
- `page_size_kb` (Performance)
- `request_count` (Performance)
- `color_palette_size` (Visual)
- `whitespace_ratio` (Visual)

---

## Labeling Heuristic Formula

Combine features into a 0–100 quality score:

```python
def generate_heuristic_label(features):
    """
    Combine feature groups into a quality score (0-100)
    """
    
    # Readability score (0-100)
    readability = (
        (100 - features['flesch_kincaid_grade'] * 5) +  # Grade 8-10 is optimal
        features['flesch_reading_ease'] +                # 0-100 scale
        (100 - features['spelling_error_ratio'] * 1000)  # Few errors
    ) / 3
    readability = max(0, min(100, readability))
    
    # Structure score (0-100)
    structure = (
        (features['h1_count'] == 1) * 100 +              # Exactly 1 H1
        features['heading_hierarchy_valid'] * 100 +
        features['image_alt_text_ratio'] * 100 +
        features['meta_description_present'] * 100 +
        features['meta_viewport_present'] * 100 +
        features['schema_markup_present'] * 50           # Nice-to-have
    ) / 6
    structure = max(0, min(100, structure))
    
    # Performance score (0-100)
    performance = features['lighthouse_performance_score']  # Already 0-100
    
    # Accessibility score (0-100)
    accessibility = (
        features['image_alt_text_ratio'] * 100 +
        features['input_label_ratio'] * 100 +
        (100 - min(features['text_length_words'] / 50, 100))  # Not too short
    ) / 3
    accessibility = max(0, min(100, accessibility))
    
    # Combine with weights
    quality_score = (
        readability * 0.3 +
        structure * 0.3 +
        performance * 0.25 +
        accessibility * 0.15
    )
    
    return max(0, min(100, quality_score))
```

---

## Feature Extraction Module Structure

Recommended code organization:

```
ml/
├── feature_extraction/
│   ├── __init__.py
│   ├── nlp_features.py       # 1.1-1.10
│   ├── dom_features.py       # 2.1-2.10
│   ├── performance_features.py  # 3.1-3.8
│   ├── visual_features.py    # 4.1-4.3
│   ├── extractor.py          # Main orchestrator
│   └── validators.py         # Data validation
│
├── labeling/
│   ├── heuristic_labels.py   # Heuristic formula
│   └── lighthouse_labels.py
│
└── data_collection/
    ├── scraper.py           # Playwright scraper
    ├── storage.py           # Save HTML/screenshots
    └── pipeline.py          # Orchestrate scraping + features
```

---

## Implementation Checklist

### Week 1: Feature Extraction Foundation
- [ ] Set up project structure
- [ ] Implement NLP features module (`nlp_features.py`)
- [ ] Implement DOM features module (`dom_features.py`)
- [ ] Test on 5–10 sample websites

### Week 2: Performance & Visual Features
- [ ] Implement performance features (Lighthouse integration)
- [ ] Implement visual features (screenshot analysis)
- [ ] Implement labeling heuristic
- [ ] Create feature extractor orchestrator

### Week 3: Data Collection Pipeline
- [ ] Build Playwright scraper
- [ ] Integrate with feature extraction
- [ ] Collect 100–300 websites
- [ ] Generate features.csv + labels

### Week 4: Baseline Model
- [ ] Train Linear Regression
- [ ] Evaluate (MAE, RMSE, R²)
- [ ] Feature importance analysis
- [ ] Iterate based on results

---

## Next: Implementation

You're ready to start coding the feature extraction layer. Start with NLP features (easiest to validate), then DOM, then performance.

Would you like me to:
1. Create starter code templates for each module?
2. Set up the data collection pipeline (Playwright + storage)?
3. Build the labeling heuristic formula?

