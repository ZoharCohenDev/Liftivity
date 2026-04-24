"""
Feature Extraction Package

Exports the main extraction interface.
"""

from .extractor import extract_all_features, extract_batch

__all__ = ['extract_all_features', 'extract_batch']
