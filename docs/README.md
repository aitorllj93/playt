# Playt

> A powerful and flexible prompt templating library for AI applications

## What is Playt?

Playt is a modern templating system specifically designed for AI prompts and LLM applications. It combines the simplicity of Markdown with the power of Nunjucks templating, allowing you to create reusable, dynamic, and maintainable prompt templates.

## Why Playt?

Working with AI prompts often involves:
- Managing multiple variations of prompts
- Inserting dynamic data into prompts
- Validating input parameters
- Maintaining consistency across prompts
- Version control and documentation

Playt solves these challenges by providing a structured, validated, and flexible approach to prompt management.

## Features

- 📝 **Markdown-first** - Write templates in familiar Markdown format
- 🎯 **Type-safe** - Full TypeScript support with runtime validation
- 🔍 **Validation** - Define schemas with custom validation rules
- 🎨 **Templating** - Conditionals, loops, filters via Nunjucks
- 🔧 **Dual usage** - Use as a library or CLI tool
- ⚡ **Progressive** - Start simple, add complexity as needed
- 🚀 **Zero config** - Works out of the box

## Quick Start

### Installation

```bash
npm install playt
```

### Basic Example

Create a template file `greeting.md`:

```markdown
---
variables:
  name:
    type: string
    required: true
---

Hello {{ name }}! Welcome to Playt.
```

Use it in your code:

```typescript
import { render } from 'playt';
import { readFileSync } from 'fs';

const template = readFileSync('greeting.md', 'utf-8');
const result = render(template, { name: 'World' });
console.log(result); // "Hello World! Welcome to Playt."
```

Or via CLI:

```bash
playt render greeting.md -v name="World"
```

## Core Concepts

### 1. Templates

Templates are Markdown files with optional YAML frontmatter:

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

### 2. Variables

Define typed variables with validation rules:

```yaml
variables:
  email:
    type: string
    required: true
    validation:
      pattern: "^[^@]+@[^@]+\\.[^@]+$"
  age:
    type: number
    validation:
      min: 18
      max: 100
```

### 3. Templating

Use Nunjucks syntax for dynamic content:

```markdown
{% if user.premium %}
Premium content
{% endif %}

{% for item in items %}
- {{ item }}
{% endfor %}
```

### 4. Validation

Validate variables before rendering:

```typescript
import { validate, render } from 'playt';

const validation = validate(template, variables);
if (validation.valid) {
  const result = render(template, variables);
}
```

## Use Cases

- **AI Prompt Management** - Organize and version control your prompts
- **Dynamic Content Generation** - Generate personalized content at scale
- **Chatbot Templates** - Maintain consistent chatbot responses
- **Email Templates** - Create validated email templates
- **Code Generation** - Template-based code generation
- **Documentation** - Dynamic documentation generation

## Documentation

Explore the complete documentation:

### Getting Started
- [Installation Guide](guide/installation.md) - Setup and installation
- [Library Usage](guide/library.md) - Using Playt in your code
- [CLI Usage](guide/cli.md) - Command-line interface

### Reference
- [API Reference](api/README.md) - Complete API documentation
- [Template Specification](SPEC.md) - Full template format specification

### Examples
- [01 - Simple Template](examples/01-simple.md)
- [02 - Basic Variables](examples/02-basic-variables.md)
- [03 - With Validation](examples/03-with-validation.md)
- [04 - Conditionals](examples/04-conditionals.md)
- [05 - JSON Output](examples/05-json-output.md)
- [06 - Image Generation](examples/06-image-generation.md)
- [07 - Multimodal](examples/07-multimodal.md)
- [08 - Advanced Loops](examples/08-advanced-loops.md)

## Quick Links

- [GitHub Repository](https://github.com/aitorllamas/playt)
- [NPM Package](https://www.npmjs.com/package/playt)
- [Report Issues](https://github.com/aitorllamas/playt/issues)

## Next Steps

1. Follow the [Installation Guide](guide/installation.md) to get started
2. Read the [Library Usage](guide/library.md) to learn the API
3. Explore [Examples](examples/01-simple.md) for practical use cases
4. Check the [CLI Guide](guide/cli.md) for command-line usage

