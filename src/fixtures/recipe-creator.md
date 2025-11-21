---
name: recipe_creator
version: 1.0
description: Generates complete recipe with text, image, and structured data
tags: ["food", "recipe", "multimodal", "cooking"]

variables:
  dish_name:
    type: string
    required: true
    description: Name of the dish to create

  cuisine_type:
    type: string
    required: false
    default: "international"
    description: Type of cuisine
    validation:
      enum: ["mediterranean", "asian", "mexican", "italian", "french", "american", "international"]

  dietary_restrictions:
    type: array
    required: false
    default: []
    description: Dietary restrictions
    validation:
      items:
        enum: ["vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free", "low-carb"]

  difficulty:
    type: string
    required: false
    default: "medium"
    validation:
      enum: ["easy", "medium", "hard"]

  servings:
    type: number
    required: false
    default: 4
    description: Number of servings
    validation:
      min: 1
      max: 12

output:
  format: multimodal
  components:
    - type: text
      format: markdown
      description: Complete recipe with step-by-step instructions

    - type: image
      format: png
      size: 1024x1024
      description: Professional photo of the finished dish

    - type: json
      description: Structured data (ingredients, nutrition, timings)

    - type: image
      format: png
      size: 800x600
      description: Visual diagram of preparation steps
---

# Recipe Creation: {{ dish_name }}

Generate a complete recipe package including text instructions, professional food photography, structured data, and visual guide.

## Recipe Specifications

**Dish:** {{ dish_name }}
**Cuisine Type:** {{ cuisine_type }}
**Difficulty Level:** {{ difficulty }}
**Servings:** {{ servings }} people

{% if dietary_restrictions %}
**Dietary Restrictions:**
{% for restriction in dietary_restrictions %}
- {{ restriction }}
{% endfor %}
{% endif %}

---

## Component 1: Recipe Text (Markdown)

Create a beautifully formatted recipe that includes:

### Overview
- Brief description of the dish
- What makes it special
- Preparation and cooking time estimates

### Ingredients
List all ingredients with exact measurements for {{ servings }} servings
- Organized by recipe sections (if applicable)
- Include notes about substitutions

### Instructions
Step-by-step instructions:
1. Numbered steps, clear and concise
2. Include temperatures, times, and visual cues
3. Add tips and tricks
4. Mention common mistakes to avoid

### Chef's Notes
- Serving suggestions
- Pairing recommendations
- Storage instructions
- Make-ahead tips

### Nutrition Information (per serving)
- Calories
- Protein, Carbs, Fat
- Key vitamins/minerals

---

## Component 2: Hero Image (PNG 1024x1024)

Generate a professional food photography image:

**Subject:** {{ dish_name }} beautifully plated

**Style:**
- Professional food photography
- {{ cuisine_type }} presentation style
- Natural lighting, slightly overhead angle (45°)
- Shallow depth of field
- Restaurant-quality plating

**Composition:**
- Main dish as focal point
- Complementary garnishes
- Appropriate dinnerware/props
- Clean, uncluttered background
- Warm, appetizing color palette

**Mood:**
- Inviting and appetizing
- Fresh and vibrant
{% if difficulty == "easy" %}
- Rustic, homestyle feel
{% endif %}
{% if difficulty == "hard" %}
- Elegant, refined presentation
{% endif %}

---

## Component 3: Structured Data (JSON)

Provide recipe data in JSON format:

```json
{
  "recipe": {
    "name": "{{ dish_name }}",
    "cuisine": "{{ cuisine_type }}",
    "difficulty": "{{ difficulty }}",
    "servings": {{ servings }},
    "prepTime": "minutes",
    "cookTime": "minutes",
    "totalTime": "minutes",
    "ingredients": [
      {
        "item": "ingredient name",
        "amount": "quantity",
        "unit": "measurement",
        "preparation": "optional prep note"
      }
    ],
    "instructions": [
      {
        "step": 1,
        "instruction": "detailed instruction",
        "duration": "optional time",
        "temperature": "optional temp"
      }
    ],
    "nutrition": {
      "calories": 0,
      "protein": "0g",
      "carbohydrates": "0g",
      "fat": "0g",
      "fiber": "0g",
      "sodium": "0mg"
    },
    "tags": ["tag1", "tag2"],
    "dietary": {{ dietary_restrictions | json }},
    "equipment": ["list of needed tools"],
    "cost": {
      "perServing": "$0.00",
      "total": "$0.00"
    }
  }
}
```

---

## Component 4: Visual Steps Guide (PNG 800x600)

Generate an infographic-style visual guide:

**Content:**
- 4-6 key cooking steps illustrated
- Simple icons or illustrations
- Brief text labels
- Timeline/flow indicator

**Style:**
- Clean, modern infographic design
- Consistent color scheme (matching cuisine type)
- Easy to read fonts
- Professional but approachable

**Layout:**
- Horizontal or vertical flow
- Numbered steps
- Visual hierarchy clear
- Suitable for printing or digital display

---

## Final Requirements

Ensure all components:
1. Are cohesive and reference the same recipe
2. Match the specified difficulty level
3. Respect dietary restrictions
4. Are appropriate for {{ servings }} servings
5. Reflect {{ cuisine_type }} culinary traditions
6. Are professional quality and ready to publish

