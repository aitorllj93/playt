# Example 5: Structured JSON Output

Template that specifies a detailed JSON schema for the response.

## File: sentiment-analysis.md

```markdown
---
name: sentiment_analysis
version: 2.0
description: Multi-level sentiment analysis with emotion detection
tags: ["nlp", "sentiment", "emotions", "analysis"]

variables:
  text:
    type: string
    required: true
    description: Text to analyze
    validation:
      minLength: 10
      maxLength: 5000

  language:
    type: string
    required: false
    default: "auto"
    description: Text language (auto for automatic detection)
    validation:
      enum: ["auto", "es", "en", "fr", "de", "it", "pt"]

  include_entities:
    type: boolean
    required: false
    default: true
    description: Extract mentioned entities

  include_keywords:
    type: boolean
    required: false
    default: true
    description: Extract keywords

output:
  format: json
  schema:
    type: object
    required: ["sentiment", "confidence", "emotions"]
    properties:
      sentiment:
        type: string
        enum: ["very_positive", "positive", "neutral", "negative", "very_negative"]
        description: Overall text sentiment

      confidence:
        type: number
        minimum: 0
        maximum: 1
        description: Analysis confidence (0-1)

      emotions:
        type: object
        properties:
          joy:
            type: number
            minimum: 0
            maximum: 1
          sadness:
            type: number
            minimum: 0
            maximum: 1
          anger:
            type: number
            minimum: 0
            maximum: 1
          fear:
            type: number
            minimum: 0
            maximum: 1
          surprise:
            type: number
            minimum: 0
            maximum: 1
        description: Intensity of each emotion (0-1)

      subjectivity:
        type: number
        minimum: 0
        maximum: 1
        description: Subjectivity vs objectivity level (0=objective, 1=subjective)

      key_phrases:
        type: array
        items:
          type: object
          properties:
            phrase:
              type: string
            sentiment:
              type: string
            score:
              type: number
        description: Key phrases with their sentiment

      entities:
        type: array
        items:
          type: object
          properties:
            text:
              type: string
            type:
              type: string
              enum: ["person", "organization", "location", "product", "event"]
            sentiment:
              type: string
        description: Mentioned entities (if include_entities=true)

      keywords:
        type: array
        items:
          type: string
        description: Main keywords (if include_keywords=true)

      summary:
        type: string
        description: Brief analysis summary
---

# Sentiment Analysis

Analyze the following text and provide a detailed sentiment and emotion analysis.

**Language:** {{ language }}

## Text to Analyze

```
{{ text }}
```

## Instructions

Perform a complete analysis that includes:

1. **Overall Sentiment**: Classify the general tone of the text
2. **Confidence**: Indicate how confident you are in the analysis (0.0 to 1.0)
3. **Emotions**: Detect and quantify present emotions:
   - Joy
   - Sadness
   - Anger
   - Fear
   - Surprise
4. **Subjectivity**: Evaluate if the text is objective or subjective
5. **Key Phrases**: Identify the most relevant phrases with their sentiment
{% if include_entities %}
6. **Entities**: Extract mentioned people, organizations, places, products, or events
{% endif %}
{% if include_keywords %}
7. **Keywords**: List the most relevant words in the text
{% endif %}
8. **Summary**: Provide a brief description of the analysis

**IMPORTANT:** Return ONLY a valid JSON object that exactly matches the specified schema. Do not include any additional text before or after the JSON.
```

## Usage

```javascript
import { render } from 'playt';

const prompt = await render('sentiment-analysis.md', {
  text: `
    I love this new product! The quality is exceptional and TechCorp's
    customer service was incredibly helpful. I will definitely recommend
    it to all my friends. The only minor downside was the shipping time,
    but the wait was totally worth it.
  `,
  language: 'en',
  include_entities: true,
  include_keywords: true
});

// Send prompt to AI API
const response = await aiAPI.complete(prompt);

// Parse JSON response
const analysis = JSON.parse(response);
console.log(analysis);
```

## Expected Response Example

```json
{
  "sentiment": "very_positive",
  "confidence": 0.92,
  "emotions": {
    "joy": 0.85,
    "sadness": 0.05,
    "anger": 0.0,
    "fear": 0.0,
    "surprise": 0.15
  },
  "subjectivity": 0.78,
  "key_phrases": [
    {
      "phrase": "I love this new product",
      "sentiment": "very_positive",
      "score": 0.95
    },
    {
      "phrase": "The quality is exceptional",
      "sentiment": "very_positive",
      "score": 0.9
    },
    {
      "phrase": "the only minor downside was the shipping time",
      "sentiment": "slightly_negative",
      "score": -0.3
    }
  ],
  "entities": [
    {
      "text": "TechCorp",
      "type": "organization",
      "sentiment": "positive"
    }
  ],
  "keywords": [
    "product",
    "quality",
    "customer service",
    "recommendation",
    "shipping"
  ],
  "summary": "Very positive review about a product, highlighting excellent quality and customer service. There's a minor mention about shipping time but it doesn't affect the overall positive impression."
}
```

## Features

- ✅ Detailed JSON schema
- ✅ Types and constraints (enum, minimum, maximum)
- ✅ Required properties
- ✅ Nested objects and arrays
- ✅ Documentation for each field
- ✅ Structured and predictable output
- ✅ Easy to parse and validate
