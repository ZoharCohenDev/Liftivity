"""
Main Feature Extraction Orchestrator

Coordinates scraping, parsing, and feature extraction for a single website.
Provides the complete pipeline: URL → HTML/text → features → dictionary
"""

import logging
from typing import Dict, Any, Optional
from bs4 import BeautifulSoup
import requests
from urllib.parse import urlparse

from .nlp_features import extract_nlp_features
from .dom_features import extract_dom_features
from .performance_features import extract_performance_features

logger = logging.getLogger(__name__)


class FeatureExtractor:
    """Main orchestrator for extracting all features from a website"""

    def __init__(self):
        self.timeout = 10
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

    def extract_for_url(self, url: str) -> Dict[str, Any]:
        """
        Extract all features for a given URL

        Args:
            url: Website URL

        Returns:
            Dictionary with all features and metadata
        """
        logger.info(f"Extracting features for: {url}")

        result = {
            'url': url,
            'success': False,
            'error': None,
            'features': {},
            'metadata': {},
        }

        # Step 1: Fetch HTML
        html = self._fetch_html(url)
        if not html:
            result['error'] = 'Failed to fetch HTML'
            return result

        # Step 2: Parse and extract text
        soup = BeautifulSoup(html, 'html.parser')
        text = self._extract_main_text(soup)

        if not text:
            result['error'] = 'Failed to extract main text'
            return result

        # Step 3: Extract DOM features (fast)
        logger.info("Extracting DOM features...")
        dom_features = extract_dom_features(html, url)
        result['features'].update(dom_features)

        # Step 4: Extract NLP features (fast)
        logger.info("Extracting NLP features...")
        nlp_features = extract_nlp_features(text)
        result['features'].update(nlp_features)

        # Step 5: Extract performance features (slow, optional)
        logger.info("Extracting performance features (Lighthouse)...")
        perf_features = extract_performance_features(url)
        result['features'].update(perf_features)

        # Step 6: Add metadata
        result['metadata'] = {
            'html_length': len(html),
            'text_length': len(text),
            'url_domain': urlparse(url).netloc,
        }

        result['success'] = True
        logger.info(f"✓ Successfully extracted features for: {url}")

        return result

    def _fetch_html(self, url: str) -> Optional[str]:
        """
        Fetch HTML from URL

        Args:
            url: Website URL

        Returns:
            HTML content or None if fetch failed
        """
        try:
            # Ensure URL has protocol
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url

            response = requests.get(
                url,
                timeout=self.timeout,
                headers=self.headers,
                allow_redirects=True
            )
            response.raise_for_status()

            return response.text
        except requests.exceptions.RequestException as e:
            logger.warning(f"Failed to fetch {url}: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error fetching {url}: {e}")
            return None

    def _extract_main_text(self, soup: BeautifulSoup) -> Optional[str]:
        """
        Extract main content text from HTML, removing navigation, footer, scripts

        Args:
            soup: BeautifulSoup parsed HTML

        Returns:
            Extracted main text or None if extraction failed
        """
        try:
            # Clone soup to avoid modifying original
            soup_copy = BeautifulSoup(str(soup), 'html.parser')

            # Remove script, style, nav, footer tags
            for tag in soup_copy(['script', 'style', 'nav', 'footer', 'noscript']):
                tag.decompose()

            # Extract text
            text = soup_copy.get_text(separator=' ', strip=True)

            # Clean up whitespace
            text = ' '.join(text.split())

            if len(text) < 10:
                return None

            return text
        except Exception as e:
            logger.error(f"Error extracting main text: {e}")
            return None


# Module-level extractor for convenience
_extractor = FeatureExtractor()


def extract_all_features(url: str) -> Dict[str, Any]:
    """Convenience function to extract all features for a URL"""
    return _extractor.extract_for_url(url)


def extract_batch(urls: list) -> list:
    """
    Extract features for multiple URLs

    Args:
        urls: List of website URLs

    Returns:
        List of extraction results
    """
    results = []
    for i, url in enumerate(urls, 1):
        logger.info(f"Processing {i}/{len(urls)}: {url}")
        result = _extractor.extract_for_url(url)
        results.append(result)
    return results
