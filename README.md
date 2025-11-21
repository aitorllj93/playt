# Playt

> A powerful and flexible prompt templating library for AI applications

Playt is a modern templating system specifically designed for AI prompts. It combines the simplicity of Markdown with the power of Nunjucks templating, offering variable interpolation, validation, conditionals, loops, and more.

## ✨ Features

- 📝 **Markdown-first**: Write templates in familiar Markdown format
- 🎯 **Type-safe**: Full TypeScript support with type validation
- 🔍 **Validation**: Built-in variable validation with custom rules
- 🎨 **Flexible**: Use as a library or CLI tool
- ⚡ **Progressive**: Start simple, add features as needed
- 🧩 **Powerful templating**: Conditionals, loops, filters, and more via Nunjucks
- 🚀 **Zero config**: Works out of the box with sensible defaults

## 📦 Installation

```bash
npm install playt
```

For CLI usage, install globally:

```bash
npm install -g playt
```

## 🚀 Quick Start

### As a Library

```typescript
import { render, validate } from 'playt';

// Simple template
const template = `
---
variables:
  name:
    type: string
    required: true
---

Hello {{ name }}!
`;

// Validate variables
const validation = validate(template, { name: 'World' });
if (!validation.valid) {
  console.error(validation.errors);
}

// Render template
const result = render(template, { name: 'World' });
console.log(result); // "Hello World!"
```

### As a CLI

```bash
# Create a new template
playt init greeting.md

# Render with variables
playt render greeting.md -v name="World"

# Validate template
playt validate greeting.md -v name="Test"

# Inspect template structure
playt inspect greeting.md
```

## 📖 Template Format

Templates use YAML frontmatter for configuration and Nunjucks for content:

```markdown
---
description: A greeting template
variables:
  name:
    type: string
    required: true
    description: Name to greet
  greeting:
    type: string
    default: Hello
    description: Greeting to use
---

{{ greeting }} {{ name }}!

{% if name == "World" %}
Welcome to everyone!
{% endif %}
```

## 🎯 Core Concepts

### Variables

Define variables with type checking and validation:

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
      max: 120
  items:
    type: array
    required: true
```

### Templating

Use Nunjucks syntax for dynamic content:

```markdown
{# Conditionals #}
{% if user.premium %}
Premium content here
{% endif %}

{# Loops #}
{% for item in items %}
- {{ item.name }}: {{ item.price }}
{% endfor %}

{# Filters #}
{{ text | upper }}
{{ items | length }}
```

## 🛠️ API Reference

### `render(template, variables)`

Renders a template with the provided variables.

```typescript
import { render } from 'playt';

const result = render(template, { name: 'World' });
```

### `validate(template, variables)`

Validates variables against template requirements.

```typescript
import { validate } from 'playt';

const result = validate(template, { name: 'World' });
if (!result.valid) {
  console.error(result.errors);
}
```

## 💻 CLI Commands

- **`playt render <template>`** - Render a template
- **`playt validate <template>`** - Validate a template and variables
- **`playt inspect <template>`** - Show template information
- **`playt init <name>`** - Create a new template

Run `playt --help` for detailed command information.

## 📚 Documentation

For comprehensive documentation, visit our [documentation site](./docs/README.md):

- [Installation Guide](./docs/guide/installation.md)
- [Library Usage](./docs/guide/library.md)
- [CLI Usage](./docs/guide/cli.md)
- [API Reference](./docs/api/README.md)
- [Examples](./docs/examples/)

## 🎓 Examples

Check out the [examples directory](./docs/examples/) for practical use cases:

- [Simple templates](./docs/examples/01-simple.md)
- [Variable usage](./docs/examples/02-basic-variables.md)
- [Validation](./docs/examples/03-with-validation.md)
- [Conditionals](./docs/examples/04-conditionals.md)
- [JSON output](./docs/examples/05-json-output.md)
- [And more...](./docs/examples/)

## 🔧 Development

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Documentation

Serve documentation locally:

```bash
npm run docs:serve
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

MIT

## 🙏 Acknowledgments

Playt is built with:
- [Nunjucks](https://mozilla.github.io/nunjucks/) - Powerful templating engine
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - YAML frontmatter parser
- [Commander](https://github.com/tj/commander.js) - CLI framework

