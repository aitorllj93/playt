# Example 4: Conditionals

Using conditional expressions `{% if %}` for dynamic content.

## File: product-description.md

```markdown
---
name: product_description
version: 1.0

variables:
  product_name:
    type: string
    required: true

  price:
    type: number
    required: true

  category:
    type: string
    required: true

  on_sale:
    type: boolean
    required: false
    default: false

  discount_percentage:
    type: number
    required: false

  features:
    type: array
    required: true

  include_technical_specs:
    type: boolean
    required: false
    default: false

  target_audience:
    type: string
    required: false
    validation:
      enum: ["general", "professional", "enterprise"]

output:
  format: markdown
---

# {{ product_name }}

Generate an attractive and compelling description for the following product.

## Product Information

**Category:** {{ category }}
**Price:** ${{ price }}

{% if on_sale %}
🔥 **SPECIAL OFFER!**
{{ discount_percentage }}% discount
Final price: ${{ price - (price * discount_percentage / 100) }}
{% endif %}

## Key Features

{% for feature in features %}
- {{ feature }}
{% endfor %}

## Target Audience

{% if target_audience == "general" %}
This product is designed for the general public, with a focus on ease of use and accessibility.
{% endif %}

{% if target_audience == "professional" %}
Product oriented to professionals seeking high-performance tools and advanced features.
{% endif %}

{% if target_audience == "enterprise" %}
Enterprise solution designed for teams and organizations requiring scalability and dedicated support.
{% endif %}

{% if include_technical_specs %}
## Technical Specifications

Include a detailed section with:
- Dimensions and weight
- System requirements
- Compatibility
- Warranty and support
{% endif %}

## Instructions

Create a persuasive description that:
1. Highlights the main benefits
2. Uses language appropriate for the target audience
3. Includes calls to action
{% if on_sale %}
4. Emphasizes the urgency of the limited offer
{% endif %}
```

## Usage

```javascript
import { render } from 'playt';

// Product on sale
const prompt1 = await render('product-description.md', {
  product_name: 'SmartPhone Pro X',
  price: 999,
  category: 'Electronics',
  on_sale: true,
  discount_percentage: 20,
  features: [
    '6.7" OLED Display',
    'Triple 108MP Camera',
    '5000mAh Battery',
    '5G'
  ],
  include_technical_specs: true,
  target_audience: 'professional'
});

// Regular product
const prompt2 = await render('product-description.md', {
  product_name: 'Bluetooth Headphones',
  price: 79,
  category: 'Audio',
  on_sale: false,
  features: [
    'Active noise cancellation',
    '30 hours battery life',
    'Bluetooth 5.0'
  ],
  target_audience: 'general'
});
```

## Result (Product on Sale)

```markdown
# SmartPhone Pro X

Generate an attractive and compelling description for the following product.

## Product Information

**Category:** Electronics
**Price:** $999

🔥 **SPECIAL OFFER!**
20% discount
Final price: $799.2

## Key Features

- 6.7" OLED Display
- Triple 108MP Camera
- 5000mAh Battery
- 5G

## Target Audience

Product oriented to professionals seeking high-performance tools and advanced features.

## Technical Specifications

Include a detailed section with:
- Dimensions and weight
- System requirements
- Compatibility
- Warranty and support

## Instructions

Create a persuasive description that:
1. Highlights the main benefits
2. Uses language appropriate for the target audience
3. Includes calls to action
4. Emphasizes the urgency of the limited offer
```

## Features

- ✅ Conditional blocks `{% if %}`
- ✅ Conditions with boolean values
- ✅ String comparisons
- ✅ `{% else %}` blocks
- ✅ Loops `{% for %}`
- ✅ Dynamic content based on context
