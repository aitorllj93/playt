# Example 3: Variables with Validation

Template with complete frontmatter including variable validation.

## File: code-review.md

```markdown
---
name: code_review
version: 1.0
description: Performs structured code review
author: Dev Team <dev@company.com>
tags: ["code", "review", "quality"]

variables:
  language:
    type: string
    required: true
    description: Programming language of the code
    validation:
      enum: ["javascript", "typescript", "python", "java", "go", "rust"]

  code:
    type: string
    required: true
    description: Code to review
    validation:
      minLength: 10
      maxLength: 10000

  focus_areas:
    type: array
    required: false
    default: ["performance", "security", "maintainability"]
    description: Specific areas to review

  severity_level:
    type: string
    required: false
    default: "standard"
    description: Severity level for the review
    validation:
      enum: ["lenient", "standard", "strict"]

output:
  format: json
  schema:
    type: object
    properties:
      overall_score:
        type: number
        description: Overall score (0-10)
      issues:
        type: array
        items:
          type: object
          properties:
            severity:
              type: string
              enum: ["low", "medium", "high", "critical"]
            line:
              type: number
            description:
              type: string
            suggestion:
              type: string
      strengths:
        type: array
        items:
          type: string
      recommendations:
        type: array
        items:
          type: string
---

# Code Review - {{ language }}

Perform a thorough review of the following {{ language }} code.

## Focus Areas
{% for area in focus_areas %}
- {{ area }}
{% endfor %}

## Severity Level
{{ severity_level }}

## Code to Review

```{{ language }}
{{ code }}
```

## Instructions

1. Analyze the code line by line
2. Identify issues related to: security, performance, maintainability, and best practices
3. Assign severity to each issue found
4. Provide concrete improvement suggestions
5. Highlight code strengths
6. Give general recommendations

Return the result in JSON format following the specified schema.
```

## Usage

```javascript
import { render, validate } from 'playt';

const variables = {
  language: 'typescript',
  code: `
function calculateTotal(items: any[]) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}
  `,
  focus_areas: ['performance', 'typescript-best-practices'],
  severity_level: 'strict'
};

// Validate variables before rendering
const validation = await validate('code-review.md', variables);

if (validation.valid) {
  const prompt = await render('code-review.md', variables);
  console.log(prompt);
} else {
  console.error('Validation errors:', validation.errors);
}
```

## Validation Error Example

```javascript
// This will generate an error because 'ruby' is not in the enum
const invalidVars = {
  language: 'ruby',  // ❌ Not in enum
  code: 'def hello...'
};

const validation = await validate('code-review.md', invalidVars);
// validation.valid === false
// validation.errors === [
//   {
//     variable: 'language',
//     error: 'ValidationError',
//     message: "Must be one of: javascript, typescript, python, java, go, rust"
//   }
// ]
```

## Features

- ✅ Type validation
- ✅ Enum values
- ✅ Default values
- ✅ Min/max length
- ✅ Required variables
- ✅ JSON output schema
- ✅ Integrated documentation
