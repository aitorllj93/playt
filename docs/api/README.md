# API Reference

Complete API reference for Playt library functions and types.

## Functions

### `render()`

Renders a template with the provided variables.

**Signature:**

```typescript
function render<T = Record<string, unknown>>(
  template: string,
  variables?: T
): string
```

**Parameters:**

- `template` (string) - The template string containing YAML frontmatter and Nunjucks template
- `variables` (T) - Optional object containing variables to pass to the template

**Returns:**

- `string` - The rendered template output

**Description:**

The `render()` function processes a template and replaces variables with their values. It:

1. Parses YAML frontmatter to extract metadata and default values
2. Merges provided variables with defaults (provided variables override defaults)
3. Renders the template using Nunjucks templating engine
4. Cleans up whitespace and formatting
5. Returns the final rendered string

**Example:**

```typescript
import { render } from 'playt';

const template = `
---
variables:
  name:
    type: string
    default: World
  greeting:
    type: string
    default: Hello
---

{{ greeting }} {{ name }}!
`;

// Using defaults
const result1 = render(template);
console.log(result1); // "Hello World!"

// Overriding defaults
const result2 = render(template, { name: 'Alice', greeting: 'Hi' });
console.log(result2); // "Hi Alice!"
```

**Advanced Example with Conditionals:**

```typescript
const template = `
---
variables:
  user:
    type: object
    required: true
  items:
    type: array
    required: true
---

Hello {{ user.name }}!

{% if user.premium %}
You have premium access.
{% endif %}

Your items:
{% for item in items %}
- {{ item.name }}: ${{ item.price }}
{% endfor %}
`;

const result = render(template, {
  user: { name: 'John', premium: true },
  items: [
    { name: 'Item 1', price: 10 },
    { name: 'Item 2', price: 20 }
  ]
});
```

---

### `validate()`

Validates variables against the template's variable definitions.

**Signature:**

```typescript
function validate(
  template: string,
  variables?: Record<string, unknown>
): ValidationResult
```

**Parameters:**

- `template` (string) - The template string with variable definitions in frontmatter
- `variables` (Record<string, unknown>) - Optional variables to validate

**Returns:**

- `ValidationResult` - Object containing validation status and errors

**Description:**

The `validate()` function checks if provided variables meet the requirements defined in the template's frontmatter. It validates:

- **Required variables** - Checks if all required variables are provided
- **Type checking** - Validates variable types (string, number, boolean, array, object)
- **Custom validations** - Applies validation rules like min, max, pattern, enum, etc.

**Example:**

```typescript
import { validate } from 'playt';

const template = `
---
variables:
  email:
    type: string
    required: true
    validation:
      pattern: "^[^@]+@[^@]+\\.[^@]+$"
  age:
    type: number
    required: true
    validation:
      min: 18
      max: 120
---

Email: {{ email }}
Age: {{ age }}
`;

// Valid variables
const result1 = validate(template, {
  email: 'user@example.com',
  age: 25
});
console.log(result1.valid); // true
console.log(result1.errors); // []

// Invalid variables
const result2 = validate(template, {
  email: 'invalid-email',
  age: 15
});
console.log(result2.valid); // false
console.log(result2.errors);
// [
//   {
//     variable: 'email',
//     error: 'ValidationError',
//     message: "Variable 'email': Value does not match pattern: ..."
//   },
//   {
//     variable: 'age',
//     error: 'ValidationError',
//     message: "Variable 'age': Minimum value is 18, but got 15"
//   }
// ]

// Missing required variable
const result3 = validate(template, {
  email: 'user@example.com'
});
console.log(result3.valid); // false
console.log(result3.errors);
// [
//   {
//     variable: 'age',
//     error: 'MissingRequiredVariable',
//     message: "Variable 'age' is required but was not provided"
//   }
// ]
```

---

## Types

### `ValidationResult`

Result of template validation.

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}
```

**Properties:**

- `valid` (boolean) - Whether validation passed
- `errors` (ValidationError[]) - Array of validation errors (empty if valid)

---

### `ValidationError`

Describes a validation error.

```typescript
interface ValidationError {
  variable: string;
  error: 'MissingRequiredVariable' | 'InvalidType' | 'ValidationError';
  message: string;
}
```

**Properties:**

- `variable` (string) - Name of the variable that failed validation
- `error` (string) - Type of error
  - `'MissingRequiredVariable'` - Required variable was not provided
  - `'InvalidType'` - Variable type doesn't match expected type
  - `'ValidationError'` - Variable failed custom validation rules
- `message` (string) - Human-readable error description

---

## Variable Definition Schema

Variables are defined in the template's YAML frontmatter:

```yaml
variables:
  variableName:
    type: string | number | boolean | array | object
    required: boolean
    default: any
    description: string
    validation:
      min: number          # For numbers: minimum value
      max: number          # For numbers: maximum value
      minLength: number    # For strings: minimum length
      maxLength: number    # For strings: maximum length
      pattern: string      # For strings: regex pattern
      enum: array          # For any type: allowed values
```

### Type Definitions

**`type`** (optional, default: `"string"`)
- `"string"` - Text value
- `"number"` - Numeric value
- `"boolean"` - True/false value
- `"array"` - Array of values
- `"object"` - Object/dictionary

**`required`** (optional, default: `false`)
- `true` - Variable must be provided
- `false` - Variable is optional

**`default`** (optional)
- Default value used if variable not provided
- Type must match defined type

**`description`** (optional)
- Human-readable description of the variable
- Used in documentation and CLI help

**`validation`** (optional)
- Custom validation rules object

### Validation Rules

**For numbers:**
- `min` - Minimum value (inclusive)
- `max` - Maximum value (inclusive)

**For strings:**
- `minLength` - Minimum string length
- `maxLength` - Maximum string length
- `pattern` - Regular expression pattern (string format)

**For all types:**
- `enum` - Array of allowed values

### Example Schema

```yaml
variables:
  # Required string with pattern
  email:
    type: string
    required: true
    description: User email address
    validation:
      pattern: "^[^@]+@[^@]+\\.[^@]+$"

  # Optional number with range
  age:
    type: number
    required: false
    default: 18
    description: User age
    validation:
      min: 0
      max: 150

  # String with enum
  role:
    type: string
    required: true
    description: User role
    validation:
      enum: ['admin', 'user', 'guest']

  # String with length constraints
  username:
    type: string
    required: true
    validation:
      minLength: 3
      maxLength: 20

  # Boolean flag
  isPremium:
    type: boolean
    default: false

  # Array of items
  tags:
    type: array
    default: []

  # Complex object
  settings:
    type: object
    default: {}
```

---

## Templating Syntax

Playt uses [Nunjucks](https://mozilla.github.io/nunjucks/) for templating. Here are the most commonly used features:

### Variable Interpolation

```markdown
{{ variableName }}
{{ user.name }}
{{ items[0] }}
```

### Conditionals

```markdown
{% if condition %}
  Content when true
{% elif otherCondition %}
  Content when elif true
{% else %}
  Content when false
{% endif %}
```

### Loops

```markdown
{% for item in items %}
  {{ item.name }}
{% endfor %}

{% for key, value in object %}
  {{ key }}: {{ value }}
{% endfor %}
```

### Filters

```markdown
{{ text | upper }}
{{ text | lower }}
{{ text | title }}
{{ text | replace("old", "new") }}
{{ items | length }}
{{ items | join(", ") }}
```

### Comments

```markdown
{# This is a comment and won't appear in output #}
```

For complete Nunjucks documentation, visit: https://mozilla.github.io/nunjucks/templating.html

---

## Best Practices

### 1. Always Validate Before Rendering

```typescript
const validation = validate(template, variables);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
  throw new Error('Invalid variables');
}
const result = render(template, variables);
```

### 2. Use Type Annotations

```typescript
interface MyVariables {
  name: string;
  age: number;
  items: string[];
}

const result = render<MyVariables>(template, {
  name: 'John',
  age: 30,
  items: ['a', 'b', 'c']
});
```

### 3. Provide Defaults for Optional Variables

```yaml
variables:
  greeting:
    type: string
    default: Hello
    description: Custom greeting
```

### 4. Use Descriptive Variable Names

```yaml
variables:
  userEmailAddress:
    type: string
    required: true
    description: The email address of the user
```

### 5. Document Your Templates

```yaml
---
description: Send a welcome email to new users
author: Your Name
version: 1.0.0
variables:
  # ... well-documented variables
---
```

---

## Error Handling

### Common Errors

**Template Parse Error:**
```typescript
try {
  const result = render(invalidTemplate, variables);
} catch (error) {
  console.error('Failed to parse template:', error);
}
```

**Validation Errors:**
```typescript
const validation = validate(template, variables);
if (!validation.valid) {
  for (const error of validation.errors) {
    console.error(`${error.variable}: ${error.message}`);
  }
}
```

**Rendering Errors:**
```typescript
try {
  const result = render(template, variables);
} catch (error) {
  console.error('Failed to render template:', error);
}
```

---

## Complete Example

```typescript
import { render, validate } from 'playt';
import { readFileSync } from 'fs';

// Read template from file
const template = readFileSync('email-template.md', 'utf-8');

// Define variables
const variables = {
  recipientName: 'Alice',
  senderName: 'Bob',
  subject: 'Project Update',
  items: [
    { task: 'Design review', status: 'completed' },
    { task: 'Implementation', status: 'in-progress' }
  ]
};

// Validate
const validation = validate(template, variables);
if (!validation.valid) {
  console.error('Validation failed:');
  validation.errors.forEach(err => {
    console.error(`  - ${err.message}`);
  });
  process.exit(1);
}

// Render
try {
  const result = render(template, variables);
  console.log(result);
} catch (error) {
  console.error('Rendering failed:', error);
  process.exit(1);
}
```

