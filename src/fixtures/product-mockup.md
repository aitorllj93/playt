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

