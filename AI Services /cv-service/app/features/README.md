# cv-service — features

This folder needs to be implemented with visual feature extraction logic for the Computer Vision service.

## What to implement

- `layout_features.py` — detect visual hierarchy, section structure, whitespace balance
- `cta_features.py` — locate and score call-to-action buttons (size, color contrast, position)
- `image_features.py` — image-to-text ratio, hero image quality, media presence
- `color_features.py` — brand color consistency, contrast ratios, accessibility scoring
- `base.py` — abstract base class for all feature extractors
