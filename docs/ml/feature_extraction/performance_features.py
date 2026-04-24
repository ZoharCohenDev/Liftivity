"""
Performance Feature Extraction Module

Extracts Lighthouse metrics (performance, Core Web Vitals) for websites.
Priority features for baseline model:
- lighthouse_performance_score
- lcp_ms (Largest Contentful Paint)
- cls (Cumulative Layout Shift)
"""

import subprocess
import json
import re
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class PerformanceFeatureExtractor:
    """Extract Lighthouse performance metrics"""

    def __init__(self):
        self.timeout = 120  # Lighthouse can take a while
        self._check_lighthouse_installed()

    def _check_lighthouse_installed(self):
        """Verify Lighthouse is installed via npm"""
        try:
            result = subprocess.run(
                ['which', 'lighthouse'],
                capture_output=True,
                text=True
            )
            if result.returncode != 0:
                logger.warning(
                    "Lighthouse not found. Install with: npm install -g lighthouse"
                )
        except:
            logger.warning("Could not check Lighthouse installation")

    def extract_all(self, url: str) -> Dict[str, Any]:
        """
        Extract Lighthouse performance metrics

        Args:
            url: Website URL to analyze

        Returns:
            Dictionary of performance metrics
        """
        try:
            lighthouse_data = self._run_lighthouse(url)
            if not lighthouse_data:
                return self._empty_features()

            features = self._parse_lighthouse_metrics(lighthouse_data)
            return features
        except Exception as e:
            logger.error(f"Error extracting performance features for {url}: {e}")
            return self._empty_features()

    def _run_lighthouse(self, url: str) -> Optional[Dict[str, Any]]:
        """
        Run Lighthouse CLI and return JSON output

        Args:
            url: Website URL

        Returns:
            Parsed Lighthouse JSON output or None on error
        """
        try:
            # Run lighthouse with minimal output
            result = subprocess.run(
                [
                    'lighthouse',
                    url,
                    '--output=json',
                    '--quiet',
                    '--chrome-flags="--headless --no-sandbox"'
                ],
                capture_output=True,
                text=True,
                timeout=self.timeout
            )

            if result.returncode != 0:
                logger.warning(f"Lighthouse failed for {url}")
                return None

            data = json.loads(result.stdout)
            return data
        except subprocess.TimeoutExpired:
            logger.error(f"Lighthouse timeout for {url}")
            return None
        except json.JSONDecodeError:
            logger.error(f"Could not parse Lighthouse output for {url}")
            return None
        except FileNotFoundError:
            logger.error("Lighthouse not installed. Run: npm install -g lighthouse")
            return None
        except Exception as e:
            logger.error(f"Unexpected error running Lighthouse: {e}")
            return None

    def _parse_lighthouse_metrics(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract relevant metrics from Lighthouse JSON"""
        features = {}

        # Overall performance score
        try:
            perf_score = data.get('categories', {}).get('performance', {}).get('score')
            features['lighthouse_performance_score'] = (perf_score * 100) if perf_score else None
        except:
            features['lighthouse_performance_score'] = None

        # Core Web Vitals from metrics audit
        try:
            metrics_audit = data.get('audits', {}).get('metrics', {})
            metrics_details = metrics_audit.get('details', {}).get('items', [{}])[0]

            # Extract key metrics
            features['fcp_ms'] = metrics_details.get('firstContentfulPaint')
            features['lcp_ms'] = metrics_details.get('largestContentfulPaint')
            features['cls'] = metrics_details.get('cumulativeLayoutShift')
            features['tti_ms'] = metrics_details.get('interactive')
            features['tbt_ms'] = metrics_details.get('totalBlockingTime')
        except:
            features['fcp_ms'] = None
            features['lcp_ms'] = None
            features['cls'] = None
            features['tti_ms'] = None
            features['tbt_ms'] = None

        return features

    def _empty_features(self) -> Dict[str, Any]:
        """Return empty/null features when Lighthouse fails"""
        return {
            'lighthouse_performance_score': None,
            'fcp_ms': None,
            'lcp_ms': None,
            'cls': None,
            'tti_ms': None,
            'tbt_ms': None,
        }


def extract_performance_features(url: str) -> Dict[str, Any]:
    """Convenience function to extract performance features"""
    extractor = PerformanceFeatureExtractor()
    return extractor.extract_all(url)
