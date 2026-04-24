"""
Test and Demo: Feature Extraction Pipeline

Run this script to extract features from a small set of test websites.
Usage:
    python ml/test_feature_extraction.py

Output:
    - Console: Extraction progress and summary
    - data/processed/test_features.csv: Extracted features as CSV
    - data/processed/test_extraction_log.json: Detailed results (including errors)
"""

import sys
import json
import csv
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

from feature_extraction import extract_batch


# Test URLs (diverse domains for validation)
TEST_URLS = [
    'https://example.com',
    'https://www.wikipedia.org',
    'https://github.com',
    'https://www.medium.com',
    'https://www.producthunt.com',
    'https://www.techcrunch.com',
    'https://www.stackoverflow.com',
    'https://www.stripe.com',
]


def save_features_to_csv(results: list, output_path: str):
    """
    Save extracted features to CSV

    Args:
        results: List of extraction results from extract_batch()
        output_path: Path to save CSV
    """
    # Collect all feature keys from successful extractions
    all_feature_keys = set()
    for result in results:
        if result['success']:
            all_feature_keys.update(result['features'].keys())

    # Sort keys for consistent column order
    feature_keys = sorted(list(all_feature_keys))

    # Prepare rows
    rows = []
    for result in results:
        row = {'url': result['url']}

        if result['success']:
            # Add all features (None if missing)
            for key in feature_keys:
                row[key] = result['features'].get(key)
        else:
            # Mark failure
            row['error'] = result['error']

        rows.append(row)

    # Write CSV
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['url'] + feature_keys + ['error']
        writer = csv.DictWriter(f, fieldnames=fieldnames)

        writer.writeheader()
        for row in rows:
            writer.writerow(row)

    logger.info(f"✓ Features saved to: {output_path}")


def save_detailed_results(results: list, output_path: str):
    """Save detailed extraction results (including errors) as JSON"""
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)

    logger.info(f"✓ Detailed results saved to: {output_path}")


def print_summary(results: list):
    """Print extraction summary to console"""
    successful = sum(1 for r in results if r['success'])
    failed = len(results) - successful

    print("\n" + "=" * 60)
    print("FEATURE EXTRACTION SUMMARY")
    print("=" * 60)
    print(f"Total URLs: {len(results)}")
    print(f"Successful: {successful}")
    print(f"Failed: {failed}")
    print("=" * 60)

    # Print sample features from first successful extraction
    for result in results:
        if result['success']:
            print(f"\nSample features from: {result['url']}")
            print("-" * 60)
            for feature_name, value in sorted(result['features'].items()):
                if value is not None:
                    if isinstance(value, float):
                        print(f"  {feature_name}: {value:.4f}")
                    else:
                        print(f"  {feature_name}: {value}")
            break

    # Print failures
    if failed > 0:
        print("\n" + "=" * 60)
        print("FAILURES")
        print("=" * 60)
        for result in results:
            if not result['success']:
                print(f"  {result['url']}: {result['error']}")


def main():
    """Run the feature extraction test pipeline"""
    logger.info("Starting feature extraction test pipeline...")
    logger.info(f"Testing on {len(TEST_URLS)} URLs")

    # Extract features for all test URLs
    results = extract_batch(TEST_URLS)

    # Save outputs
    csv_path = 'data/processed/test_features.csv'
    json_path = 'data/processed/test_extraction_log.json'

    save_features_to_csv(results, csv_path)
    save_detailed_results(results, json_path)

    # Print summary
    print_summary(results)

    logger.info("\n✓ Feature extraction test complete!")
    logger.info(f"  CSV: {csv_path}")
    logger.info(f"  JSON: {json_path}")


if __name__ == '__main__':
    main()
