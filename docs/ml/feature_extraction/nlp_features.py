"""
NLP Feature Extraction Module

Extracts text readability and quality metrics from HTML content.
Priority features for baseline model:
- text_length_words
- flesch_kincaid_grade
- flesch_reading_ease
- avg_sentence_length_words
- spelling_error_ratio
"""

import re
import textstat
from textblob import TextBlob
from spellchecker import SpellChecker
import nltk
from typing import Dict, Any

# Download required NLTK data (one-time)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)


class NLPFeatureExtractor:
    """Extract NLP-based quality metrics from website text"""

    def __init__(self):
        self.spell_checker = SpellChecker()

    def extract_all(self, text: str) -> Dict[str, Any]:
        """
        Extract all NLP features from text

        Args:
            text: Cleaned main content text (HTML removed)

        Returns:
            Dictionary of NLP features
        """
        if not text or len(text.strip()) < 10:
            return self._empty_features()

        features = {}

        # Basic text metrics
        features.update(self._extract_length_metrics(text))

        # Readability metrics
        features.update(self._extract_readability_metrics(text))

        # Sentence metrics
        features.update(self._extract_sentence_metrics(text))

        # Spelling errors
        features.update(self._extract_spelling_metrics(text))

        # Sentiment
        features.update(self._extract_sentiment_metrics(text))

        return features

    def _extract_length_metrics(self, text: str) -> Dict[str, Any]:
        """Word count and basic length metrics"""
        words = text.split()
        word_count = len(words)

        return {
            'text_length_words': word_count,
        }

    def _extract_readability_metrics(self, text: str) -> Dict[str, Any]:
        """Flesch Kincaid and reading ease"""
        try:
            fkg = textstat.flesch_kincaid_grade(text)
            fre = textstat.flesch_reading_ease(text)
        except:
            fkg = None
            fre = None

        return {
            'flesch_kincaid_grade': fkg,
            'flesch_reading_ease': fre,
        }

    def _extract_sentence_metrics(self, text: str) -> Dict[str, Any]:
        """Sentence-level metrics"""
        try:
            sentences = nltk.sent_tokenize(text)
            words = text.split()

            if sentences and words:
                avg_sentence_length = len(words) / len(sentences)
            else:
                avg_sentence_length = 0

            # Character-level metrics
            total_chars = sum(len(word) for word in words)
            avg_word_length = total_chars / len(words) if words else 0
        except:
            avg_sentence_length = None
            avg_word_length = None

        return {
            'avg_sentence_length_words': avg_sentence_length,
            'avg_word_length_chars': avg_word_length,
        }

    def _extract_spelling_metrics(self, text: str) -> Dict[str, Any]:
        """Detect spelling errors"""
        try:
            # Filter words: lowercase, length > 2, no digits
            words = [w.lower() for w in text.split() if len(w) > 2 and not w.isdigit()]

            if not words:
                return {'spelling_error_ratio': 0}

            misspelled = self.spell_checker.unknown(words)
            error_ratio = len(misspelled) / len(words)
        except:
            error_ratio = None

        return {
            'spelling_error_ratio': error_ratio,
        }

    def _extract_sentiment_metrics(self, text: str) -> Dict[str, Any]:
        """Sentiment polarity and subjectivity"""
        try:
            blob = TextBlob(text)
            polarity = blob.sentiment.polarity
            subjectivity = blob.sentiment.subjectivity
        except:
            polarity = None
            subjectivity = None

        return {
            'sentiment_polarity': polarity,
            'sentiment_subjectivity': subjectivity,
        }

    def _empty_features(self) -> Dict[str, Any]:
        """Return empty/null features when text is unavailable"""
        return {
            'text_length_words': 0,
            'flesch_kincaid_grade': None,
            'flesch_reading_ease': None,
            'avg_sentence_length_words': None,
            'avg_word_length_chars': None,
            'spelling_error_ratio': None,
            'sentiment_polarity': None,
            'sentiment_subjectivity': None,
        }


# Module-level extractor for convenience
nlp_extractor = NLPFeatureExtractor()

def extract_nlp_features(text: str) -> Dict[str, Any]:
    """Convenience function to extract NLP features"""
    return nlp_extractor.extract_all(text)
