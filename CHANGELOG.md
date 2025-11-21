# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-21

### Added

#### Core Library
- **Markdown-first templating system** for AI prompts with YAML frontmatter support
- **`render()`** function to render templates with variable interpolation
- **`validate()`** function for validating variables against template definitions
- Full **TypeScript support** with complete type definitions
- **Progressive enhancement** philosophy - templates work from simple text to complex configurations

#### Variable System
- Variable definition with type checking (`string`, `number`, `boolean`, `array`, `object`)
- Required and optional variables with default values
- Custom validation rules:
  - `min`/`max` for numbers and string length
  - `pattern` for regex validation
  - `enum` for allowed values
  - `minLength`/`maxLength` for strings and arrays
- Variables work with or without frontmatter definitions
- Automatic default value application

#### Templating Engine
- **Nunjucks-powered** templating with full feature support:
  - Variable interpolation with `{{ variable }}`
  - Conditionals with `{% if %}...{% endif %}`
  - Loops with `{% for %}...{% endfor %}`
  - Filters (e.g., `{{ text | upper }}`, `{{ array | length }}`)
- Whitespace control and formatting preservation
- Support for nested templates and complex logic

#### Output Formats
- Multiple output format specifications:
  - Text formats: `text`, `markdown`, `html`, `xml`, `yaml`, `code`
  - Binary formats: `image`, `audio`, `video`, `pdf`
  - Structured formats: `json` with schema validation
  - `multimodal` for combining multiple output types
- Output schema definition for structured data
- Streaming support configuration
- MIME type specification for multimedia outputs
- Quality, size, and duration settings for media outputs

#### CLI Tool
- **`playt render <template>`** - Render templates with variables
- **`playt validate <template>`** - Validate templates and variable inputs
- **`playt inspect <template>`** - Show template information and metadata
- **`playt init <name>`** - Create new template files
- Variable passing via `-v key=value` flags
- File input support for variables
- Helpful error messages and validation feedback

#### Documentation
- Comprehensive README with quick start guide
- Detailed specification document (SPEC.md)
- API reference documentation
- Installation and usage guides for library and CLI
- 8 practical examples covering:
  - Simple templates
  - Basic variables
  - Validation rules
  - Conditionals
  - JSON output
  - Image generation
  - Multimodal outputs
  - Advanced loops
- Contributing guidelines

#### Template Features
- Optional frontmatter with metadata:
  - `name` - Template identifier
  - `version` - Semantic versioning support
  - `description` - Template documentation
  - `author` - Author information
  - `tags` - Categorization and search
- Template fixtures for testing and examples:
  - Code review template
  - Email response template
  - Product description generator
  - Product mockup creator
  - Recipe creator
  - Sentiment analysis
  - Simple summary
  - Team standup report

#### Development & Quality
- **Vitest** test suite with coverage reporting
- **Biome** for linting and formatting
- TypeScript compilation with source maps
- Development watch mode
- Pre-publish build hooks
- Full test coverage for core functionality

#### Package & Distribution
- Published as npm package `playt`
- Supports Node.js >= 16.0.0
- Includes compiled distribution files
- Type definitions included
- CLI binary available globally

### Dependencies
- `nunjucks` (^3.2.4) - Powerful templating engine
- `gray-matter` (^4.0.3) - YAML frontmatter parsing
- `commander` (^11.1.0) - CLI framework
- `typescript` (^5.3.3) - TypeScript support
- `vitest` (^1.6.1) - Testing framework
- `@biomejs/biome` (^2.3.7) - Linting and formatting

### Security
- Input validation and sanitization
- Type checking for all variables
- Pattern matching for complex validations
- Safe template rendering without code injection

### Performance
- Zero-config operation with sensible defaults
- Lazy loading of templates
- Efficient variable substitution
- Minimal runtime overhead

[1.0.0]: https://github.com/aitorllj93/playt/releases/tag/v1.0.0

