# Example 6: Image Generation

Template for generating images with detailed specifications.

## File: product-mockup.md

```markdown
---
name: product_mockup
version: 1.0
description: Generates realistic product mockup with AI
tags: ["image", "design", "mockup", "product"]

variables:
  product_type:
    type: string
    required: true
    description: Type of product to visualize
    validation:
      enum: ["smartphone", "laptop", "tablet", "watch", "headphones", "camera", "bottle", "book", "clothing"]

  product_name:
    type: string
    required: true
    description: Product name

  primary_color:
    type: string
    required: false
    default: "silver"
    description: Product primary color

  environment:
    type: string
    required: false
    default: "studio"
    description: Photo environment
    validation:
      enum: ["studio", "office", "home", "outdoor", "lifestyle", "minimal"]

  angle:
    type: string
    required: false
    default: "front"
    description: Camera angle
    validation:
      enum: ["front", "side", "three-quarter", "top", "floating"]

  lighting:
    type: string
    required: false
    default: "professional"
    description: Lighting type
    validation:
      enum: ["natural", "professional", "dramatic", "soft", "backlit"]

  style:
    type: string
    required: false
    default: "photorealistic"
    description: Visual style
    validation:
      enum: ["photorealistic", "minimalist", "artistic", "technical", "lifestyle"]

output:
  format: image
  mime_type: image/png
  size: 1024x1024
  quality: high
---

# Product Mockup: {{ product_name }}

Generate a high-quality product mockup image with the following specifications:

## Product Details
- **Type:** {{ product_type }}
- **Name:** {{ product_name }}
- **Primary Color:** {{ primary_color }}

## Visual Specifications
- **Environment:** {{ environment }}
- **Camera Angle:** {{ angle }}
- **Lighting:** {{ lighting }}
- **Style:** {{ style }}

## Technical Requirements

**Composition:**
- Product should be the main focus
- Professional composition following rule of thirds
- Appropriate depth of field
- Clean background without distractions

**Quality:**
- High resolution (1024x1024px)
- Sharp details and textures
- Realistic materials and reflections
- Professional color grading

**Context:**
{% if environment == "studio" %}
Clean white or gradient background, professional studio lighting, product centered
{% endif %}
{% if environment == "office" %}
Modern office desk environment, laptop/documents in background (blurred), natural window light
{% endif %}
{% if environment == "home" %}
Cozy home setting, warm ambient lighting, lifestyle context
{% endif %}
{% if environment == "outdoor" %}
Natural outdoor setting, daylight, environmental context
{% endif %}
{% if environment == "lifestyle" %}
Person using the product in real-life scenario, authentic moment
{% endif %}
{% if environment == "minimal" %}
Ultra-minimal composition, single color background, product floating
{% endif %}

**Lighting Setup:**
{% if lighting == "natural" %}
Soft natural window light, subtle shadows, warm color temperature
{% endif %}
{% if lighting == "professional" %}
Multi-point studio lighting, balanced exposure, minimal shadows
{% endif %}
{% if lighting == "dramatic" %}
High contrast, directional key light, deep shadows for depth
{% endif %}
{% if lighting == "soft" %}
Diffused soft light, gentle shadows, even illumination
{% endif %}
{% if lighting == "backlit" %}
Backlit with rim lighting, product silhouette enhanced, glowing edges
{% endif %}

Generate a photorealistic, professional-quality product image suitable for e-commerce or marketing materials.
```

## Usage

```javascript
import { render } from 'playt';

// Minimalist smartphone mockup
const prompt1 = await render('product-mockup.md', {
  product_type: 'smartphone',
  product_name: 'Galaxy Pro X',
  primary_color: 'midnight blue',
  environment: 'minimal',
  angle: 'three-quarter',
  lighting: 'professional',
  style: 'photorealistic'
});

// Use with image generation API
const image1 = await imageAI.generate(prompt1);

// Lifestyle laptop mockup
const prompt2 = await render('product-mockup.md', {
  product_type: 'laptop',
  product_name: 'MacBook Pro',
  primary_color: 'space gray',
  environment: 'office',
  angle: 'three-quarter',
  lighting: 'natural',
  style: 'lifestyle'
});

const image2 = await imageAI.generate(prompt2);
```

## Prompt Result

```
# Product Mockup: Galaxy Pro X

Generate a high-quality product mockup image with the following specifications:

## Product Details
- **Type:** smartphone
- **Name:** Galaxy Pro X
- **Primary Color:** midnight blue

## Visual Specifications
- **Environment:** minimal
- **Camera Angle:** three-quarter
- **Lighting:** professional
- **Style:** photorealistic

## Technical Requirements

**Composition:**
- Product should be the main focus
- Professional composition following rule of thirds
- Appropriate depth of field
- Clean background without distractions

**Quality:**
- High resolution (1024x1024px)
- Sharp details and textures
- Realistic materials and reflections
- Professional color grading

**Context:**
Ultra-minimal composition, single color background, product floating

**Lighting Setup:**
Multi-point studio lighting, balanced exposure, minimal shadows

Generate a photorealistic, professional-quality product image suitable for e-commerce or marketing materials.
```

## Use Cases

1. **E-commerce**: Generate product images for online store
2. **Marketing**: Create mockups for advertising campaigns
3. **Presentations**: Visualize product concepts
4. **Prototypes**: Quick mockups for testing
5. **Social Media**: Images for posts and stories

## Features

- ✅ Output specified as PNG image
- ✅ Dimensions and quality defined
- ✅ Detailed visual specifications
- ✅ Adaptive context based on variables
- ✅ Technical instructions for image AI
- ✅ Compatible with DALL-E, Midjourney, Stable Diffusion, etc.
