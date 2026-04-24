"""
DOM Feature Extraction Module

Extracts HTML structure and accessibility metrics from BeautifulSoup parsed HTML.
Priority features for baseline model:
- h1_count
- heading_hierarchy_valid
- image_alt_text_ratio
- meta_description_present
- meta_viewport_present
"""

from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import requests
from typing import Dict, Any, Optional


class DOMFeatureExtractor:
    """Extract DOM-based quality metrics from HTML"""

    def __init__(self, base_url: str = ""):
        self.base_url = base_url
        self.timeout = 5

    def extract_all(self, html: str, base_url: Optional[str] = None) -> Dict[str, Any]:
        """
        Extract all DOM features from HTML

        Args:
            html: Raw HTML string
            base_url: Base URL for resolving relative links (optional)

        Returns:
            Dictionary of DOM features
        """
        if not html:
            return self._empty_features()

        if base_url:
            self.base_url = base_url

        try:
            soup = BeautifulSoup(html, 'html.parser')
        except:
            return self._empty_features()

        features = {}

        # Heading metrics
        features.update(self._extract_heading_metrics(soup))

        # Image metrics
        features.update(self._extract_image_metrics(soup))

        # Meta tags
        features.update(self._extract_meta_tags(soup))

        # Link metrics (optional, can be slow)
        # features.update(self._extract_link_metrics(soup))

        # Form metrics (optional)
        # features.update(self._extract_form_metrics(soup))

        return features

    def _extract_heading_metrics(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract heading-related metrics"""
        h1s = soup.find_all('h1')
        h2s = soup.find_all('h2')
        h3s = soup.find_all('h3')

        h1_count = len(h1s)

        # Check heading hierarchy validity
        hierarchy_valid = self._is_heading_hierarchy_valid(soup)

        # Heading density (optional, requires full text)
        heading_density = self._calculate_heading_density(soup)

        return {
            'h1_count': h1_count,
            'h2_count': len(h2s),
            'h3_count': len(h3s),
            'heading_hierarchy_valid': hierarchy_valid,
            'heading_density': heading_density,
        }

    def _is_heading_hierarchy_valid(self, soup: BeautifulSoup) -> int:
        """
        Check if heading hierarchy follows proper structure
        - H1 exists and appears before other headings
        - No large jumps (H1 -> H3 directly)
        """
        headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

        if not headings:
            return 0

        # Check H1 exists
        h1_exists = any(h.name == 'h1' for h in headings)
        if not h1_exists:
            return 0

        # Check H1 is first
        if headings[0].name != 'h1':
            return 0

        # Check no large gaps
        levels = [int(h.name[1]) for h in headings]
        for i in range(1, len(levels)):
            if levels[i] - levels[i - 1] > 1:  # Gap > 1 level
                return 0

        return 1

    def _calculate_heading_density(self, soup: BeautifulSoup) -> Optional[float]:
        """Calculate what % of content is in headings"""
        try:
            # Get all text
            all_text = soup.get_text(separator=' ', strip=True)
            total_words = len(all_text.split())

            if total_words < 10:
                return 0

            # Get heading text
            headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
            heading_words = sum(len(h.get_text().split()) for h in headings)

            return heading_words / total_words if total_words > 0 else 0
        except:
            return None

    def _extract_image_metrics(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract image-related metrics"""
        images = soup.find_all('img')
        total_images = len(images)

        if total_images == 0:
            alt_ratio = 1.0  # No images = pass
        else:
            images_with_alt = sum(1 for img in images if img.get('alt'))
            alt_ratio = images_with_alt / total_images

        return {
            'image_alt_text_ratio': alt_ratio,
            'total_images': total_images,
        }

    def _extract_meta_tags(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract meta tag presence"""
        meta_desc = soup.find('meta', {'name': 'description'})
        meta_keywords = soup.find('meta', {'name': 'keywords'})
        meta_viewport = soup.find('meta', {'name': 'viewport'})
        schema_markup = soup.find('script', {'type': 'application/ld+json'})

        return {
            'meta_description_present': 1 if meta_desc else 0,
            'meta_keywords_present': 1 if meta_keywords else 0,
            'meta_viewport_present': 1 if meta_viewport else 0,
            'schema_markup_present': 1 if schema_markup else 0,
        }

    def _extract_link_metrics(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """
        Extract link-related metrics
        WARNING: This can be slow due to HTTP requests
        """
        links = soup.find_all('a', href=True)
        total_links = len(links)

        if total_links == 0:
            return {
                'broken_link_ratio': 0,
                'external_link_ratio': 0,
                'total_links': 0,
            }

        # Count external links
        base_domain = urlparse(self.base_url).netloc
        external_count = 0
        broken_count = 0

        for link in links:
            href = link.get('href', '')

            # Skip anchors, javascript, mailto
            if (
                href.startswith('#')
                or href.startswith('javascript:')
                or href.startswith('mailto:')
            ):
                continue

            # Check if external
            if href.startswith('http'):
                link_domain = urlparse(href).netloc
                if link_domain != base_domain:
                    external_count += 1

            # Check if broken (slow)
            try:
                full_url = urljoin(self.base_url, href)
                response = requests.head(
                    full_url, timeout=self.timeout, allow_redirects=True
                )
                if response.status_code >= 400:
                    broken_count += 1
            except:
                broken_count += 1

        external_ratio = external_count / total_links if total_links > 0 else 0
        broken_ratio = broken_count / total_links if total_links > 0 else 0

        return {
            'broken_link_ratio': broken_ratio,
            'external_link_ratio': external_ratio,
            'total_links': total_links,
        }

    def _extract_form_metrics(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract form-related metrics"""
        forms = soup.find_all('form')
        inputs = soup.find_all(['input', 'textarea', 'select'])
        labels = soup.find_all('label')

        # Calculate input label ratio
        labeled = 0
        for inp in inputs:
            if inp.get('id') and any(
                label.get('for') == inp.get('id') for label in labels
            ):
                labeled += 1

        label_ratio = labeled / len(inputs) if inputs else 1

        return {
            'forms_count': len(forms),
            'input_count': len(inputs),
            'input_label_ratio': label_ratio,
        }

    def _empty_features(self) -> Dict[str, Any]:
        """Return empty/null features when HTML is unavailable"""
        return {
            'h1_count': 0,
            'h2_count': 0,
            'h3_count': 0,
            'heading_hierarchy_valid': 0,
            'heading_density': None,
            'image_alt_text_ratio': 0,
            'total_images': 0,
            'meta_description_present': 0,
            'meta_keywords_present': 0,
            'meta_viewport_present': 0,
            'schema_markup_present': 0,
            'broken_link_ratio': None,
            'external_link_ratio': None,
            'total_links': 0,
            'forms_count': 0,
            'input_count': 0,
            'input_label_ratio': None,
        }


def extract_dom_features(html: str, base_url: str = "") -> Dict[str, Any]:
    """Convenience function to extract DOM features"""
    extractor = DOMFeatureExtractor(base_url)
    return extractor.extract_all(html, base_url)
