# Library Usage

Learn how to use Playt as a library in your JavaScript or TypeScript applications.

## Installation

```bash
npm install playt
```

## Basic Usage

### Importing

```typescript
// ES Modules
import { render, validate } from 'playt';

// CommonJS
const { render, validate } = require('playt');
```

### Simple Rendering

```typescript
import { render } from 'playt';

const template = `
---
variables:
  name:
    type: string
    required: true
---

Hello {{ name }}!
`;

const result = render(template, { name: 'World' });
console.log(result); // "Hello World!"
```

## Working with Templates

### Template Format

Templates consist of two parts:

1. **YAML Frontmatter** (optional) - Metadata and variable definitions
2. **Template Body** - Content with Nunjucks syntax

```markdown
---
description: Template description
variables:
  varname:
    type: string
    required: true
---

Template content with {{ varname }}
```

### Loading Templates

**From file:**

```typescript
import { render } from 'playt';
import { readFileSync } from 'fs';

const template = readFileSync('./templates/email.md', 'utf-8');
const result = render(template, { recipient: 'John' });
```

**From string:**

```typescript
import { render } from 'playt';

const template = `Hello {{ name }}!`;
const result = render(template, { name: 'Alice' });
```

**From module:**

```typescript
// templates/greeting.ts
export const greetingTemplate = `
---
variables:
  name:
    type: string
    required: true
---

Hello {{ name }}!
`;

// main.ts
import { render } from 'playt';
import { greetingTemplate } from './templates/greeting';

const result = render(greetingTemplate, { name: 'Bob' });
```

## Variable System

### Defining Variables

Variables are defined in the YAML frontmatter:

```yaml
variables:
  email:
    type: string
    required: true
    description: User email address
  age:
    type: number
    required: false
    default: 18
```

### Variable Types

Playt supports five basic types:

```typescript
const template = `
---
variables:
  name:
    type: string
  count:
    type: number
  active:
    type: boolean
  items:
    type: array
  config:
    type: object
---

Name: {{ name }}
Count: {{ count }}
Active: {{ active }}
Items: {{ items | join(", ") }}
Config: {{ config.key }}
`;

render(template, {
  name: 'John',
  count: 42,
  active: true,
  items: ['a', 'b', 'c'],
  config: { key: 'value' }
});
```

### Default Values

Provide defaults for optional variables:

```typescript
const template = `
---
variables:
  greeting:
    type: string
    default: Hello
  name:
    type: string
    required: true
---

{{ greeting }} {{ name }}!
`;

// Using default
render(template, { name: 'World' }); // "Hello World!"

// Overriding default
render(template, { greeting: 'Hi', name: 'Alice' }); // "Hi Alice!"
```

## Validation

### Basic Validation

Always validate variables before rendering:

```typescript
import { render, validate } from 'playt';

const template = `
---
variables:
  email:
    type: string
    required: true
---

Email: {{ email }}
`;

const variables = { email: 'user@example.com' };

// Validate first
const validation = validate(template, variables);
if (!validation.valid) {
  console.error('Validation errors:');
  validation.errors.forEach(err => {
    console.error(`  - ${err.message}`);
  });
  throw new Error('Invalid variables');
}

// Then render
const result = render(template, variables);
```

### Validation Rules

#### String Validation

```typescript
const template = `
---
variables:
  username:
    type: string
    required: true
    validation:
      minLength: 3
      maxLength: 20
      pattern: "^[a-zA-Z0-9_]+$"
  role:
    type: string
    validation:
      enum: ['admin', 'user', 'guest']
---

Username: {{ username }}
Role: {{ role }}
`;

// Valid
validate(template, {
  username: 'john_doe',
  role: 'admin'
}); // { valid: true, errors: [] }

// Invalid - too short
validate(template, {
  username: 'ab',
  role: 'admin'
}); // { valid: false, errors: [...] }

// Invalid - invalid characters
validate(template, {
  username: 'john@doe',
  role: 'admin'
}); // { valid: false, errors: [...] }

// Invalid - not in enum
validate(template, {
  username: 'john_doe',
  role: 'superuser'
}); // { valid: false, errors: [...] }
```

#### Number Validation

```typescript
const template = `
---
variables:
  age:
    type: number
    required: true
    validation:
      min: 18
      max: 120
  score:
    type: number
    validation:
      enum: [1, 2, 3, 4, 5]
---

Age: {{ age }}
Score: {{ score }}
`;

// Valid
validate(template, { age: 25, score: 5 }); // { valid: true, errors: [] }

// Invalid - below minimum
validate(template, { age: 15, score: 3 }); // { valid: false, errors: [...] }

// Invalid - above maximum
validate(template, { age: 150, score: 3 }); // { valid: false, errors: [...] }
```

### Type Checking

```typescript
const template = `
---
variables:
  name:
    type: string
  age:
    type: number
  active:
    type: boolean
---

Name: {{ name }}
Age: {{ age }}
Active: {{ active }}
`;

// Type mismatch
const validation = validate(template, {
  name: 123,        // Expected string, got number
  age: '25',        // Expected number, got string
  active: 'yes'     // Expected boolean, got string
});

console.log(validation.valid); // false
console.log(validation.errors);
// [
//   { variable: 'name', error: 'InvalidType', message: "..." },
//   { variable: 'age', error: 'InvalidType', message: "..." },
//   { variable: 'active', error: 'InvalidType', message: "..." }
// ]
```

## Templating Features

Playt uses Nunjucks for powerful templating capabilities.

### Conditionals

```typescript
const template = `
---
variables:
  user:
    type: object
    required: true
---

Hello {{ user.name }}!

{% if user.premium %}
You have premium access.
{% elif user.trial %}
You are on a trial period.
{% else %}
Consider upgrading to premium.
{% endif %}
`;

render(template, {
  user: { name: 'Alice', premium: true }
});
// Output:
// Hello Alice!
// You have premium access.
```

### Loops

```typescript
const template = `
---
variables:
  items:
    type: array
    required: true
---

Shopping List:
{% for item in items %}
{{ loop.index }}. {{ item.name }} - ${{ item.price }}
{% endfor %}

Total items: {{ items.length }}
`;

render(template, {
  items: [
    { name: 'Apple', price: 1.99 },
    { name: 'Banana', price: 0.99 },
    { name: 'Orange', price: 2.49 }
  ]
});
// Output:
// Shopping List:
// 1. Apple - $1.99
// 2. Banana - $0.99
// 3. Orange - $2.49
//
// Total items: 3
```

### Filters

```typescript
const template = `
---
variables:
  text:
    type: string
  items:
    type: array
---

Uppercase: {{ text | upper }}
Lowercase: {{ text | lower }}
Title Case: {{ text | title }}
Replace: {{ text | replace("world", "universe") }}

Items: {{ items | join(", ") }}
Count: {{ items | length }}
First: {{ items | first }}
Last: {{ items | last }}
`;

render(template, {
  text: 'hello world',
  items: ['a', 'b', 'c']
});
```

### Complex Nested Structures

```typescript
const template = `
---
variables:
  project:
    type: object
    required: true
---

# {{ project.name }}

## Team Members
{% for member in project.team %}
- **{{ member.name }}** ({{ member.role }})
  {% if member.skills %}
  Skills: {{ member.skills | join(", ") }}
  {% endif %}
{% endfor %}

## Tasks
{% for task in project.tasks %}
### {{ task.title }}
Status: {{ task.status }}
{% if task.assignee %}
Assigned to: {{ task.assignee }}
{% endif %}
{% endfor %}
`;

render(template, {
  project: {
    name: 'Project Alpha',
    team: [
      { name: 'Alice', role: 'Developer', skills: ['TypeScript', 'React'] },
      { name: 'Bob', role: 'Designer', skills: ['Figma', 'CSS'] }
    ],
    tasks: [
      { title: 'Setup project', status: 'completed', assignee: 'Alice' },
      { title: 'Design UI', status: 'in-progress', assignee: 'Bob' },
      { title: 'Write tests', status: 'pending' }
    ]
  }
});
```

## TypeScript Support

### Type Safety

Use TypeScript generics for type-safe variables:

```typescript
import { render } from 'playt';

interface EmailVariables {
  recipientName: string;
  senderName: string;
  subject: string;
  body: string;
}

const template = `...`;

// TypeScript will check that variables match EmailVariables
const result = render<EmailVariables>(template, {
  recipientName: 'John',
  senderName: 'Alice',
  subject: 'Hello',
  body: 'How are you?'
});
```

### Type Definitions

```typescript
import {
  render,
  validate,
  ValidationResult,
  ValidationError
} from 'playt';

// All functions and types are fully typed
const validation: ValidationResult = validate(template, variables);

validation.errors.forEach((error: ValidationError) => {
  console.log(error.variable);  // string
  console.log(error.error);     // 'MissingRequiredVariable' | 'InvalidType' | 'ValidationError'
  console.log(error.message);   // string
});
```

## Common Patterns

### Helper Function

Create a helper function for common workflows:

```typescript
import { render, validate } from 'playt';

export function renderTemplate(
  template: string,
  variables: Record<string, unknown>
): string {
  // Validate first
  const validation = validate(template, variables);
  if (!validation.valid) {
    const errorMessages = validation.errors
      .map(e => e.message)
      .join('\n');
    throw new Error(`Template validation failed:\n${errorMessages}`);
  }

  // Then render
  try {
    return render(template, variables);
  } catch (error) {
    throw new Error(`Template rendering failed: ${error}`);
  }
}

// Usage
const result = renderTemplate(myTemplate, myVariables);
```

### Template Manager

Manage multiple templates:

```typescript
import { render, validate } from 'playt';
import { readFileSync } from 'fs';
import { join } from 'path';

class TemplateManager {
  private templates: Map<string, string> = new Map();
  private templatesDir: string;

  constructor(templatesDir: string) {
    this.templatesDir = templatesDir;
  }

  load(name: string): void {
    const path = join(this.templatesDir, `${name}.md`);
    const content = readFileSync(path, 'utf-8');
    this.templates.set(name, content);
  }

  render(name: string, variables: Record<string, unknown>): string {
    const template = this.templates.get(name);
    if (!template) {
      throw new Error(`Template not found: ${name}`);
    }

    const validation = validate(template, variables);
    if (!validation.valid) {
      throw new Error(`Invalid variables for ${name}`);
    }

    return render(template, variables);
  }
}

// Usage
const manager = new TemplateManager('./templates');
manager.load('email');
manager.load('notification');

const emailResult = manager.render('email', { recipient: 'John' });
const notificationResult = manager.render('notification', { message: 'Hello' });
```

### Async Template Loading

```typescript
import { render, validate } from 'playt';
import { readFile } from 'fs/promises';

async function renderTemplateFromFile(
  filePath: string,
  variables: Record<string, unknown>
): Promise<string> {
  const template = await readFile(filePath, 'utf-8');

  const validation = validate(template, variables);
  if (!validation.valid) {
    throw new Error('Validation failed: ' +
      validation.errors.map(e => e.message).join(', '));
  }

  return render(template, variables);
}

// Usage
const result = await renderTemplateFromFile(
  './templates/email.md',
  { recipient: 'Alice' }
);
```

### Partial Templates

```typescript
import { render } from 'playt';

// Define reusable partials
const partials = {
  header: `# {{ title }}\n\n`,
  footer: `\n---\nGenerated on {{ date }}`
};

// Compose them
const template = `
${partials.header}

{{ content }}

${partials.footer}
`;

const result = render(template, {
  title: 'My Document',
  content: 'Document content here',
  date: new Date().toISOString()
});
```

## Error Handling

### Comprehensive Error Handling

```typescript
import { render, validate } from 'playt';

function safeRender(
  template: string,
  variables: Record<string, unknown>
): { success: boolean; result?: string; error?: string } {
  try {
    // Validate
    const validation = validate(template, variables);
    if (!validation.valid) {
      const errors = validation.errors
        .map(e => `${e.variable}: ${e.message}`)
        .join('\n');
      return { success: false, error: `Validation failed:\n${errors}` };
    }

    // Render
    const result = render(template, variables);
    return { success: true, result };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Usage
const response = safeRender(template, variables);
if (response.success) {
  console.log(response.result);
} else {
  console.error(response.error);
}
```

## Best Practices

### 1. Always Validate First

```typescript
// Good
const validation = validate(template, variables);
if (validation.valid) {
  const result = render(template, variables);
}

// Bad - might fail at runtime
const result = render(template, variables);
```

### 2. Store Templates in Files

```typescript
// Good - separate files
// templates/email.md
// templates/notification.md

// Bad - templates in code
const template = `...very long template...`;
```

### 3. Use TypeScript Types

```typescript
// Good - type-safe
interface MyVars {
  name: string;
  age: number;
}
render<MyVars>(template, { name: 'John', age: 30 });

// Bad - no type checking
render(template, { name: 'John', age: '30' }); // Might fail
```

### 4. Handle Errors Gracefully

```typescript
// Good
try {
  const result = render(template, variables);
  return result;
} catch (error) {
  logger.error('Template rendering failed', { error, template, variables });
  return fallbackContent;
}

// Bad
const result = render(template, variables); // Might crash app
```

### 5. Document Your Variables

```yaml
# Good - well documented
variables:
  userEmail:
    type: string
    required: true
    description: The email address of the user who will receive this notification

# Bad - no context
variables:
  e:
    type: string
    required: true
```

## Examples

See the [examples directory](../examples/) for more practical examples:

- [Simple templates](../examples/01-simple.md)
- [Variable usage](../examples/02-basic-variables.md)
- [Validation](../examples/03-with-validation.md)
- [Conditionals](../examples/04-conditionals.md)
- [JSON output](../examples/05-json-output.md)
- [And more...](../examples/)

## Next Steps

- Read the [API Reference](../api/README.md) for detailed API documentation
- Explore [Examples](../examples/) for practical use cases
- Check out the [CLI Guide](cli.md) for command-line usage

