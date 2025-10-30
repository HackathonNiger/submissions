// services/ai_analysis_service.dart
import 'dart:math';
import '../models/crime_report.dart';
import 'package:flutter/material.dart';

class AIAnalysisService {
  // High priority keywords and their weight multipliers
  static const Map<String, double> _highPriorityKeywords = {
    // Violence related
    'weapon': 3.0,
    'gun': 3.5,
    'knife': 3.0,
    'violence': 2.5,
    'assault': 2.8,
    'attack': 2.7,
    'fight': 2.0,
    'beating': 2.5,
    'stabbing': 3.5,
    'shooting': 3.8,
    'murder': 4.0,
    'killing': 4.0,

    // Drug related
    'drugs': 2.2,
    'cocaine': 2.5,
    'heroin': 2.8,
    'marijuana': 1.8,
    'dealing': 2.3,
    'trafficking': 3.0,

    // Theft related
    'robbery': 2.8,
    'burglary': 2.5,
    'stealing': 2.0,
    'theft': 2.0,
    'pickpocket': 1.8,
    'fraud': 2.2,
    'scam': 2.0,

    // Emergency indicators
    'emergency': 3.0,
    'urgent': 2.5,
    'help': 2.2,
    'danger': 2.8,
    'threatening': 2.5,
    'scared': 2.0,
    'panicking': 2.5,

    // Quantity indicators
    'gang': 2.8,
    'group': 2.0,
    'multiple': 2.2,
    'crowd': 2.0,

    // Time sensitivity
    'happening now': 3.0,
    'right now': 3.0,
    'currently': 2.5,
    'ongoing': 2.3,

    // Public safety
    'children': 2.5,
    'school': 2.3,
    'hospital': 2.5,
    'public': 1.8,
    'crowded': 2.0,
  };

  // Medium priority keywords
  static const Map<String, double> _mediumPriorityKeywords = {
    'vandalism': 1.5,
    'graffiti': 1.3,
    'noise': 1.2,
    'disturbance': 1.5,
    'suspicious': 1.8,
    'loitering': 1.3,
    'trespassing': 1.6,
    'harassment': 2.0,
    'intimidation': 1.9,
    'bullying': 1.8,
  };

  // Low priority keywords
  static const Map<String, double> _lowPriorityKeywords = {
    'littering': 1.1,
    'parking': 1.0,
    'minor': 0.8,
    'small': 0.9,
    'maybe': 0.7,
    'possibly': 0.7,
    'think': 0.8,
    'might': 0.7,
  };

  // Crime type base weights
  static const Map<CrimeType, double> _crimeTypeWeights = {
    CrimeType.assault: 3.5,
    CrimeType.theft: 2.5,
    CrimeType.drugActivity: 2.8,
    CrimeType.vandalism: 1.5,
    CrimeType.publicDisturbance: 2.0,
    CrimeType.other: 2.0,
  };

  /// Analyzes a crime report and returns a severity score from 1-5
  static int analyzeSeverity(CrimeReport report) {
    double score = 1.0; // Base score

    // Get base weight from crime type
    double crimeTypeWeight = _crimeTypeWeights[report.crimeType] ?? 2.0;
    score = crimeTypeWeight;

    // Analyze description for keywords
    String description = report.description.toLowerCase();
    double keywordMultiplier = _analyzeKeywords(description);

    // Apply keyword multiplier
    score *= keywordMultiplier;

    // Time factor - recent reports get slight boost
    double hoursSinceReport = DateTime.now().difference(report.timestamp).inHours.toDouble();
    if (hoursSinceReport < 1) {
      score *= 1.2; // 20% boost for reports within last hour
    } else if (hoursSinceReport < 6) {
      score *= 1.1; // 10% boost for reports within 6 hours
    }

    // Community validation factor
    double validationScore = _calculateValidationScore(report);
    score *= validationScore;

    // Anonymous reports get slight reduction (might be less reliable)
    if (report.isAnonymous) {
      score *= 0.9;
    }

    // Ensure score is between 1 and 5
    int finalScore = score.round().clamp(1, 5);

    return finalScore;
  }

  /// Analyzes keywords in the description
  static double _analyzeKeywords(String description) {
    double multiplier = 1.0;
    int keywordMatches = 0;

    // Check high priority keywords
    _highPriorityKeywords.forEach((keyword, weight) {
      if (description.contains(keyword)) {
        multiplier += (weight - 1.0) * 0.3; // Scale down the impact
        keywordMatches++;
      }
    });

    // Check medium priority keywords
    _mediumPriorityKeywords.forEach((keyword, weight) {
      if (description.contains(keyword)) {
        multiplier += (weight - 1.0) * 0.2;
        keywordMatches++;
      }
    });

    // Check low priority keywords (these reduce score)
    _lowPriorityKeywords.forEach((keyword, weight) {
      if (description.contains(keyword)) {
        multiplier *= weight;
        keywordMatches++;
      }
    });

    // Bonus for multiple keyword matches (indicates detailed, serious report)
    if (keywordMatches >= 3) {
      multiplier *= 1.2;
    } else if (keywordMatches >= 5) {
      multiplier *= 1.4;
    }

    return multiplier.clamp(0.5, 3.0); // Prevent extreme multipliers
  }

  /// Calculates validation score based on community votes
  static double _calculateValidationScore(CrimeReport report) {
    if (report.upvotes == 0 && report.downvotes == 0) {
      return 1.0; // No votes yet, neutral
    }

    int totalVotes = report.upvotes + report.downvotes;
    double upvoteRatio = report.upvotes / totalVotes;

    // High upvote ratio increases score
    if (upvoteRatio >= 0.8 && totalVotes >= 3) {
      return 1.3; // High community confidence
    } else if (upvoteRatio >= 0.6 && totalVotes >= 2) {
      return 1.1; // Good community confidence
    } else if (upvoteRatio < 0.4 && totalVotes >= 3) {
      return 0.7; // Community doubts the report
    }

    return 1.0; // Neutral
  }

  /// Provides explanation for the AI analysis
  static String getAnalysisExplanation(CrimeReport report, int severityScore) {
    List<String> factors = [];

    // Crime type factor
    String crimeType = report.crimeType.toString().split('.').last;
    factors.add('Crime type: $crimeType');

    // Keyword analysis
    String description = report.description.toLowerCase();
    List<String> foundKeywords = [];

    _highPriorityKeywords.keys.forEach((keyword) {
      if (description.contains(keyword)) {
        foundKeywords.add(keyword);
      }
    });

    if (foundKeywords.isNotEmpty) {
      factors.add('High priority keywords detected: ${foundKeywords.take(3).join(', ')}');
    }

    // Time factor
    double hoursSinceReport = DateTime.now().difference(report.timestamp).inHours.toDouble();
    if (hoursSinceReport < 1) {
      factors.add('Recent report (within 1 hour)');
    }

    // Community validation
    int totalVotes = report.upvotes + report.downvotes;
    if (totalVotes > 0) {
      double ratio = report.upvotes / totalVotes;
      if (ratio >= 0.8) {
        factors.add('High community confidence');
      } else if (ratio < 0.4) {
        factors.add('Community has concerns about this report');
      }
    }

    // Anonymous factor
    if (report.isAnonymous) {
      factors.add('Anonymous report');
    }

    String severityText = _getSeverityText(severityScore);

    return 'AI Analysis: $severityText priority\n\nFactors considered:\n• ${factors.join('\n• ')}';
  }

  static String _getSeverityText(int score) {
    switch (score) {
      case 1:
        return 'Very Low';
      case 2:
        return 'Low';
      case 3:
        return 'Medium';
      case 4:
        return 'High';
      case 5:
        return 'Critical';
      default:
        return 'Medium';
    }
  }

  /// Gets color representation for severity score
  static Color getSeverityColor(int score) {
    switch (score) {
      case 1:
        return Color(0xFF4CAF50); // Green
      case 2:
        return Color(0xFF8BC34A); // Light Green
      case 3:
        return Color(0xFFFF9800); // Orange
      case 4:
        return Color(0xFFFF5722); // Deep Orange
      case 5:
        return Color(0xFFD32F2F); // Red
      default:
        return Color(0xFF9E9E9E); // Grey
    }
  }
}