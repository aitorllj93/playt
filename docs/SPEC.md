# Playt Specification v1.0

## 1. Introduction

### 1.1 Purpose
This document defines the standard for creating reusable and parameterizable prompt templates. The goal is to establish a **totally flexible** format that allows:

- Using simple prompts without any additional configuration
- Defining prompts with structured metadata (optional)
- Specifying input variables with type validation (optional)
- Configuring optional parameters with default values
- Maintaining versioning and integrated documentation
- Facilitating reuse and composition of prompts

**Design philosophy:** The standard is completely optional and progressive. A simple text file is valid, and features can be added as needed without breaking compatibility.

### 1.2 Scope
This specification covers the syntax, structure, and expected behavior of prompt templates, including:

- Frontmatter format (optional)
- Variable system (with and without definition)
- Value interpolation (flexible)
- Output definition (optional)
- Validation and error handling (progressive)

**Important:** All elements are optional. A prompt can be as simple as plain text or as complex as needed.

## 2. Document Structure

A prompt template can have one or two sections:

### 2.1 With Frontmatter (Optional)
```
---
[FRONTMATTER]
---

[TEMPLATE BODY]
```

### 2.2 Without Frontmatter
```
[TEMPLATE BODY]
```

### 2.3 Frontmatter
**Optional** section delimited by `---` containing metadata in YAML format.

### 2.4 Template Body
Content of the prompt that can use interpolation syntax for variables (if defined).

## 3. Basic Usage Examples

### 3.1 Minimal Template (Text Only)

The simplest form is a pure markdown file:

```markdown
Summarize the following text in less than 150 words.
```

### 3.2 Template with Variables Without Definition

Variables can be used without defining them:

```markdown
Summarize the following text in less than {{ max_length }} words:

{{ text }}
```

**Usage:**
```javascript
render(template, { text: "...", max_length: 150 });
```

### 3.3 Template with Minimal Frontmatter

```markdown
---
name: summarize
---

Summarize the following text:

{{ text }}
```

### 3.4 Template with Validation

Only when you need validation, define the variables:

```markdown
---
name: summarize
variables:
  text:
    type: string
    required: true
  max_length:
    type: number
    default: 150
---

Summarize the following text in less than {{ max_length }} words:

{{ text }}
```

## 4. Frontmatter Specification

### 4.1 Available Fields

#### 4.1.1 `name`
- **Type:** `string`
- **Required:** No
- **Description:** Unique identifier of the template
- **Format:** snake_case recommended
- **Example:** `summarize`, `translate_text`, `code_review`

#### 4.1.2 `version`
- **Type:** `string`
- **Required:** No
- **Description:** Template version following Semantic Versioning
- **Format:** `MAJOR.MINOR.PATCH` or `MAJOR.MINOR`
- **Example:** `1.0`, `2.1.3`

#### 4.1.3 `description`
- **Type:** `string`
- **Required:** No
- **Description:** Brief description of the template's purpose
- **Example:** `"Generates a concise summary of the provided text"`

#### 4.1.4 `author`
- **Type:** `string`
- **Required:** No
- **Description:** Author or maintainer of the template
- **Example:** `"John Doe <john@example.com>"`

#### 4.1.5 `tags`
- **Type:** `array<string>`
- **Required:** No
- **Description:** Tags for categorization and search
- **Example:** `["text", "summarization", "nlp"]`

## 5. Variable System

### 5.1 `variables` Section

**Optionally** defines the input parameters that the template accepts. Variables can be used in the template body even if not defined in this section.

**Behavior:**
- Variables defined in frontmatter: Validated and rules applied as specified
- Variables not defined: Rendered directly without validation
- Variables without value: Rendered as empty string or can be configured to show a placeholder

```yaml
variables:
  variable_name:
    type: <type>
    required: <boolean>
    default: <value>
    description: <string>
    validation: <object>
```

### 5.2 Variable Properties

#### 5.2.1 `type`
- **Required:** No
- **Default:** `string`
- **Allowed values:**
  - `string`: Text string
  - `number`: Integer or decimal number
  - `boolean`: Boolean value (true/false)
  - `array`: List of values
  - `object`: JSON object
- **Example:**
```yaml
text:
  type: string
```

#### 5.2.2 `required`
- **Required:** No
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Indicates if the variable is mandatory
- **Example:**
```yaml
text:
  type: string
  required: true
```

#### 5.2.3 `default`
- **Required:** No
- **Type:** According to the variable type
- **Description:** Default value if not provided
- **Behavior:** Only valid when `required: false`
- **Example:**
```yaml
max_length:
  type: number
  required: false
  default: 150
```

#### 5.2.4 `description`
- **Required:** No
- **Type:** `string`
- **Description:** Documentation about the variable's purpose
- **Example:**
```yaml
temperature:
  type: number
  description: "Controls the creativity of the response (0.0-1.0)"
```

#### 5.2.5 `validation`
- **Required:** No
- **Type:** `object`
- **Description:** Additional validation rules
- **Common properties:**
  - `min`, `max`: For numbers and string length
  - `pattern`: Regular expression for strings
  - `enum`: List of allowed values
  - `minLength`, `maxLength`: String/array length

**Example:**
```yaml
age:
  type: number
  validation:
    min: 0
    max: 120

language:
  type: string
  validation:
    enum: ["es", "en", "fr", "de"]

email:
  type: string
  validation:
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
```

## 6. Output Configuration

### 6.1 `output` Section

Defines the format and characteristics of the expected response.

```yaml
output:
  format: <format>
  schema: <schema>
  streaming: <boolean>
```

### 6.2 Properties

#### 6.2.1 `format`
- **Required:** No
- **Default:** `text`
- **Allowed values:**
  - `text`: Plain text
  - `markdown`: Formatted markdown
  - `json`: JSON object
  - `html`: HTML
  - `xml`: XML
  - `yaml`: YAML
  - `code`: Source code
  - `image`: Image (PNG, JPEG, WebP, etc.)
  - `audio`: Audio (MP3, WAV, OGG, etc.)
  - `video`: Video (MP4, WebM, etc.)
  - `pdf`: PDF document
  - `multimodal`: Response combining multiple formats

**Text example:**
```yaml
output:
  format: markdown
```

**Image example:**
```yaml
output:
  format: image
  mime_type: image/png
  size: 1024x1024
```

**Multimodal example:**
```yaml
output:
  format: multimodal
  components:
    - type: text
      format: markdown
    - type: image
      format: png
    - type: code
      language: python
```

#### 6.2.2 `schema`
- **Required:** No
- **Type:** `object`
- **Description:** Defines the expected output structure (especially for JSON format)
- **Example:**
```yaml
output:
  format: json
  schema:
    type: object
    properties:
      summary:
        type: string
      keywords:
        type: array
        items:
          type: string
      sentiment:
        type: string
        enum: ["positive", "neutral", "negative"]
```

#### 6.2.3 `streaming`
- **Required:** No
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Indicates if output should be generated in streaming mode

#### 6.2.4 `mime_type`
- **Required:** No (required for multimedia formats)
- **Type:** `string`
- **Description:** Specific MIME type for multimedia outputs
- **Examples:**
  - `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`
  - `audio/mpeg`, `audio/wav`, `audio/ogg`
  - `video/mp4`, `video/webm`
  - `application/pdf`

#### 6.2.5 `size`
- **Required:** No
- **Type:** `string` or `object`
- **Description:** Dimensions for visual outputs (images, videos)
- **Formats:**
  - String: `"1024x1024"`, `"1920x1080"`, `"square"`, `"portrait"`, `"landscape"`
  - Object: `{ width: 1024, height: 768 }`

**Example:**
```yaml
output:
  format: image
  size: 1024x1024
```

#### 6.2.6 `quality`
- **Required:** No
- **Type:** `string` or `number`
- **Description:** Quality of multimedia output
- **Values:**
  - String: `"low"`, `"medium"`, `"high"`, `"best"`
  - Number: 0-100 (for formats with compression)

#### 6.2.7 `duration`
- **Required:** No
- **Type:** `number` or `string`
- **Description:** Duration for audio/video outputs
- **Formats:**
  - Number: seconds (e.g., `30`)
  - String: time format (e.g., `"00:30"`, `"1m30s"`)

#### 6.2.8 `components`
- **Required:** No (required for `multimodal` format)
- **Type:** `array<object>`
- **Description:** List of components for multimodal outputs
- **Structure of each component:**
  ```yaml
  - type: text | image | audio | video | code | json
    format: <specific format>
    description: <component description>
    # ... other properties depending on type
  ```

**Complete multimodal example:**
```yaml
output:
  format: multimodal
  components:
    - type: text
      format: markdown
      description: Analysis explanation
    - type: image
      format: png
      size: 800x600
      description: Data visualization
    - type: code
      language: python
      description: Example code
```

## 7. Template Syntax

### 7.1 Variable Interpolation

Variables are interpolated using double curly brace syntax: `{{ variable_name }}`

**Syntax:**
```
{{ variable_name }}
```

**Example:**
```
Summarize the following text in less than {{ max_length }} words:

{{ text }}
```

**Variable behavior:**
- **Variables defined in frontmatter**: Validated, defaults applied and validation rules enforced
- **Variables not defined**: Rendered directly without validation
- **Variables without value**: Rendered as empty string (`""`) by default

**Example without frontmatter:**
```javascript
const template = "Hello {{ name }}, your age is {{ age }}";
render(template, { name: "John", age: 30 });
// Output: "Hello John, your age is 30"
```

### 7.2 Whitespace

- Spaces around braces are ignored: `{{variable}}` is equivalent to `{{ variable }}`
- Line breaks and spaces from the template are preserved
- To avoid unnecessary blank lines, use `-` at the beginning or end of braces

### 7.3 Conditional Expressions (Extension)

Syntax for conditional content:

```
{% if variable %}
  content if true
{% else %}
  content if false
{% endif %}
```

### 7.4 Iteration (Extension)

Syntax for iterating over arrays:

```
{% for item in items %}
  - {{ item }}
{% endfor %}
```

### 7.5 Filters (Extension)

Modifiers that transform values:

```
{{ text | uppercase }}
{{ number | round }}
{{ array | join(", ") }}
```

**Common filters:**
- `uppercase`, `lowercase`, `capitalize`
- `trim`, `truncate(n)`
- `replace(old, new)`
- `default(value)`
- `length`

## 8. Complete Examples

### 8.1 Example with Text and Validation

```markdown
---
name: translate_with_context
version: 2.0
description: Translates text maintaining cultural and technical context
author: AI Team <ai@company.com>
tags: ["translation", "i18n", "nlp"]

variables:
  text:
    type: string
    required: true
    description: Text to translate
    validation:
      minLength: 1
      maxLength: 5000

  source_language:
    type: string
    required: false
    default: "auto"
    description: Source language (auto for automatic detection)
    validation:
      enum: ["auto", "es", "en", "fr", "de", "it", "pt"]

  target_language:
    type: string
    required: true
    description: Target language
    validation:
      enum: ["es", "en", "fr", "de", "it", "pt"]

  preserve_formatting:
    type: boolean
    required: false
    default: true
    description: Maintain original formatting (markdown, html, etc)

  tone:
    type: string
    required: false
    default: "neutral"
    description: Translation tone
    validation:
      enum: ["formal", "neutral", "informal"]

output:
  format: json
  schema:
    type: object
    properties:
      translation:
        type: string
        description: Translated text
      detected_language:
        type: string
        description: Detected language (if source_language is 'auto')
      confidence:
        type: number
        description: Translation confidence level (0-1)
      notes:
        type: array
        items:
          type: string
        description: Notes about cultural or technical adaptations
---

Translate the following text from {{ source_language }} to {{ target_language }}.

{% if preserve_formatting %}
IMPORTANT: Preserve all original text formatting (markdown, HTML, spaces, line breaks, etc).
{% endif %}

Required tone: {{ tone }}

Text to translate:
```
{{ text }}
```

Provide the translation in JSON format following the specified schema.
If you find cultural or technical terms that require adaptation, include them in the notes.
```

### 8.2 Example with Image Output

```markdown
---
name: generate_diagram
version: 1.0
description: Generates a visual diagram based on description

variables:
  description:
    type: string
    required: true
    description: Description of the diagram to generate

  style:
    type: string
    default: "modern"
    validation:
      enum: ["modern", "minimalist", "detailed", "hand-drawn"]

  color_scheme:
    type: string
    default: "vibrant"
    validation:
      enum: ["vibrant", "pastel", "monochrome", "corporate"]

output:
  format: image
  mime_type: image/png
  size: 1024x1024
  quality: high
---

Generate a visual diagram with the following characteristics:

Description: {{ description }}
Style: {{ style }}
Color scheme: {{ color_scheme }}

Requirements:
- Clear and professional design
- Readable labels
- Appropriate use of space
- High resolution
```

### 8.3 Multimodal Example

```markdown
---
name: data_analysis_report
version: 1.0
description: Generates a complete data analysis report with multiple formats

variables:
  dataset:
    type: object
    required: true
    description: Dataset to analyze

  analysis_type:
    type: string
    default: "comprehensive"
    validation:
      enum: ["basic", "comprehensive", "advanced"]

  include_code:
    type: boolean
    default: true
    description: Include example code

output:
  format: multimodal
  components:
    - type: text
      format: markdown
      description: Executive summary and analysis
    - type: image
      format: png
      size: 1200x800
      description: Data visualizations (charts)
    - type: code
      language: python
      description: Code to reproduce the analysis
    - type: json
      description: Processed data and statistics
---

# Data Analysis - Type: {{ analysis_type }}

Analyze the following dataset and provide:

1. **Executive Summary** (markdown):
   - Main findings
   - Identified trends
   - Recommendations

2. **Visualizations** (image):
   - Relevant statistical charts
   - Data distributions
   - Important correlations

{% if include_code %}
3. **Reproducible Code** (Python):
   - Analysis scripts
   - Functions used
   - Usage examples
{% endif %}

4. **Structured Data** (JSON):
   - Descriptive statistics
   - Test results
   - Calculated metrics

Data to analyze:
```json
{{ dataset }}
```

Generate a complete and professional analysis in multimodal format.
```

### 8.4 Example with Audio

```markdown
---
name: text_to_speech_podcast
version: 1.0
description: Converts text into a podcast episode with natural narration

variables:
  script:
    type: string
    required: true
    description: Episode script

  voice:
    type: string
    default: "neutral"
    validation:
      enum: ["neutral", "energetic", "calm", "professional"]

  duration_limit:
    type: number
    default: 300
    description: Maximum duration in seconds

output:
  format: audio
  mime_type: audio/mpeg
  quality: high
  duration: "{{ duration_limit }}"
---

Convert the following script into a podcast episode:

Voice/Tone: {{ voice }}
Target duration: {{ duration_limit }} seconds

Script:
{{ script }}

Requirements:
- Natural and fluid narration
- Appropriate pauses between sections
- Emphasis on key points
- Suitable pace for comprehension
```

### 8.5 PDF Example with Multiple Variables

```markdown
---
name: generate_invoice
version: 1.0

variables:
  company_name:
    type: string
  client_name:
    type: string
  items:
    type: array
  date:
    type: string
  currency:
    type: string
    default: "USD"

output:
  format: pdf
  size: A4
---

# Invoice

**Company:** {{ company_name }}
**Client:** {{ client_name }}
**Date:** {{ date }}
**Currency:** {{ currency }}

## Items

{% for item in items %}
- {{ item.description }}: {{ item.quantity }} x {{ item.price }} {{ currency }}
{% endfor %}

---
Total: {{ total }} {{ currency }}
```

## 9. Validation

### 9.1 Frontmatter Validation

A valid template must:
1. If it includes frontmatter, it must be delimited by `---`
2. Use valid YAML in the frontmatter (if it exists)
3. Define valid types for all variables (if they exist)
4. Not have required variables with default values
5. Comply with specific validation rules for each field

### 9.2 Variable Validation

Before executing a template, **only for variables defined in the frontmatter**:
1. Verify that all required variables are present
2. Validate data types according to their definition
3. Apply defined validation rules
4. Use default values for optional variables not provided

**Variables not defined in frontmatter:**
- Accepted and rendered without validation
- If no value is provided, rendered as empty string
- Do not generate validation errors

### 9.3 Common Errors

| Error | Description | Solution |
|-------|-------------|----------|
| `MissingRequiredVariable` | Required variable (defined in frontmatter) not provided | Provide value for the variable |
| `InvalidType` | Incorrect data type for defined variable | Convert to expected type |
| `ValidationError` | Custom validation fails | Adjust value according to rules |
| `InvalidFrontmatter` | Invalid YAML in frontmatter | Verify YAML syntax |

**Note:** Variables not defined in the frontmatter do **NOT** generate errors, they are rendered directly.

## 10. Best Practices

### 10.1 Flexibility Principle

1. **Start simple**: Begin with plain text, add structure only when necessary
2. **Progressiveness**: Add frontmatter, variables and validation incrementally
3. **Don't over-specify**: Only define variables when you need validation or documentation
4. **Compatibility**: A simple prompt should always work without additional configuration

**Evolution example:**

```markdown
# Version 1: Simple
Summarize this text in less than 150 words.

# Version 2: With variables
Summarize the following text in less than {{ max_length }} words:
{{ text }}

# Version 3: With validation
---
variables:
  text:
    type: string
    required: true
---
Summarize the following text in less than {{ max_length }} words:
{{ text }}
```

### 10.2 Template Design

1. **Clarity**: Use descriptive names for variables
2. **Documentation**: Include `description` in variables when relevant
3. **Default values**: Provide sensible defaults for optional variables
4. **Validation**: Define validation rules only when necessary
5. **Versioning**: Increment version on breaking changes (if using versioning)

### 10.3 Maintenance

1. **Changelog**: Document changes between versions
2. **Backward compatibility**: Deprecate before removing
3. **Testing**: Test with edge cases
4. **Documentation**: Keep examples updated

### 10.4 Security

1. **Sanitization**: Validate and clean inputs
2. **Limits**: Establish reasonable limits (max_length, etc)
3. **Injection**: Escape special characters if necessary
4. **Privacy**: Don't include sensitive data in defaults

## 11. Future Extensions

### 11.1 Template Composition

Allow including templates within others:

```yaml
imports:
  - name: common_instructions
    version: 1.0
```

### 11.2 Custom Functions

Define reusable functions:

```yaml
functions:
  format_date:
    args: [date, format]
    return: string
```

### 11.3 Hooks and Callbacks

Allow pre/post execution processing:

```yaml
hooks:
  before_render:
    - validate_api_key
  after_render:
    - log_usage
```

## 12. References

### 12.1 Related Specifications

- [YAML 1.2](https://yaml.org/spec/1.2/spec.html)
- [Semantic Versioning](https://semver.org/)
- [JSON Schema](https://json-schema.org/)
- [Jinja2 Template Engine](https://jinja.palletsprojects.com/)

### 12.2 Tools

- Template validators
- Documentation generators
- IDEs with format support

## 13. Appendix

### 13.1 Frontmatter JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "pattern": "^[a-z][a-z0-9_]*$"
    },
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+(\\.\\d+)?$"
    },
    "description": {
      "type": "string"
    },
    "author": {
      "type": "string"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "variables": {
      "type": "object",
      "patternProperties": {
        "^[a-zA-Z_][a-zA-Z0-9_]*$": {
          "type": "object",
          "properties": {
            "type": {
              "enum": ["string", "number", "boolean", "array", "object"]
            },
            "required": {
              "type": "boolean"
            },
            "default": {},
            "description": {
              "type": "string"
            },
            "validation": {
              "type": "object"
            }
          }
        }
      }
    },
    "output": {
      "type": "object",
      "properties": {
        "format": {
          "enum": ["text", "markdown", "json", "html", "xml", "yaml", "code", "image", "audio", "video", "pdf", "multimodal"]
        },
        "schema": {
          "type": "object"
        },
        "streaming": {
          "type": "boolean"
        },
        "mime_type": {
          "type": "string",
          "description": "MIME type for multimedia outputs"
        },
        "size": {
          "oneOf": [
            { "type": "string" },
            {
              "type": "object",
              "properties": {
                "width": { "type": "number" },
                "height": { "type": "number" }
              }
            }
          ]
        },
        "quality": {
          "oneOf": [
            { "type": "string", "enum": ["low", "medium", "high", "best"] },
            { "type": "number", "minimum": 0, "maximum": 100 }
          ]
        },
        "duration": {
          "oneOf": [
            { "type": "number" },
            { "type": "string" }
          ]
        },
        "components": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": {
                "enum": ["text", "image", "audio", "video", "code", "json"]
              },
              "format": { "type": "string" },
              "description": { "type": "string" }
            },
            "required": ["type"]
          }
        }
      }
    }
  }
}
```

### 13.2 Implementation Example (TypeScript)

```typescript
interface PromptVariable {
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required?: boolean;
  default?: any;
  description?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: any[];
    minLength?: number;
    maxLength?: number;
  };
}

interface OutputComponent {
  type: 'text' | 'image' | 'audio' | 'video' | 'code' | 'json';
  format?: string;
  description?: string;
  language?: string; // For code components
  size?: string | { width: number; height: number }; // For image/video
}

interface PromptOutput {
  format?: 'text' | 'markdown' | 'json' | 'html' | 'xml' | 'yaml' | 'code' |
           'image' | 'audio' | 'video' | 'pdf' | 'multimodal';
  schema?: object;
  streaming?: boolean;
  mime_type?: string; // For multimedia outputs
  size?: string | { width: number; height: number }; // For image/video
  quality?: 'low' | 'medium' | 'high' | 'best' | number;
  duration?: number | string; // For audio/video
  components?: OutputComponent[]; // For multimodal
}

interface PromptTemplate {
  name?: string;
  version?: string;
  description?: string;
  author?: string;
  tags?: string[];
  variables?: Record<string, PromptVariable>;
  output?: PromptOutput;
  body: string;
}

/**
 * Parses a prompt template in markdown format
 */
function parsePromptTemplate(markdown: string): PromptTemplate {
  const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    // No frontmatter, only body
    return { body: markdown };
  }

  const [, frontmatterYaml, body] = frontmatterMatch;
  const frontmatter = parseYAML(frontmatterYaml); // Use YAML library

  return {
    ...frontmatter,
    body: body.trim()
  };
}

/**
 * Renders a template with the provided variables
 */
function renderPrompt(
  template: PromptTemplate,
  variables: Record<string, any> = {}
): string {
  let rendered = template.body;

  // Apply defaults for defined variables
  const allVariables = { ...variables };
  if (template.variables) {
    for (const [key, varDef] of Object.entries(template.variables)) {
      if (!(key in allVariables) && varDef.default !== undefined) {
        allVariables[key] = varDef.default;
      }
    }
  }

  // Interpolate variables with {{ }}
  rendered = rendered.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, varName) => {
    return allVariables[varName]?.toString() ?? '';
  });

  // Process conditionals {% if %} (extension)
  rendered = processConditionals(rendered, allVariables);

  // Process loops {% for %} (extension)
  rendered = processLoops(rendered, allVariables);

  return rendered;
}

/**
 * Validates provided variables against template definition
 */
function validateVariables(
  template: PromptTemplate,
  variables: Record<string, any>
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!template.variables) {
    // No variable definition, everything is valid
    return { valid: true, errors: [] };
  }

  for (const [key, varDef] of Object.entries(template.variables)) {
    const value = variables[key];

    // Validate required
    if (varDef.required && value === undefined) {
      errors.push({
        variable: key,
        error: 'MissingRequiredVariable',
        message: `Variable '${key}' is required`
      });
      continue;
    }

    // If no value and not required, ok
    if (value === undefined) continue;

    // Validate type
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (varDef.type && actualType !== varDef.type) {
      errors.push({
        variable: key,
        error: 'InvalidType',
        message: `Expected type '${varDef.type}' but received '${actualType}'`
      });
      continue;
    }

    // Validate custom rules
    if (varDef.validation) {
      const validationErrors = validateValue(value, varDef.validation);
      errors.push(...validationErrors.map(err => ({
        variable: key,
        error: 'ValidationError',
        message: err
      })));
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  variable: string;
  error: string;
  message: string;
}

function validateValue(value: any, rules: any): string[] {
  const errors: string[] = [];

  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`Minimum length: ${rules.minLength}`);
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Maximum length: ${rules.maxLength}`);
    }
    if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
      errors.push(`Does not match pattern: ${rules.pattern}`);
    }
  }

  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      errors.push(`Minimum value: ${rules.min}`);
    }
    if (rules.max !== undefined && value > rules.max) {
      errors.push(`Maximum value: ${rules.max}`);
    }
  }

  if (rules.enum && !rules.enum.includes(value)) {
    errors.push(`Must be one of: ${rules.enum.join(', ')}`);
  }

  return errors;
}

// Helpers for extensions
function processConditionals(text: string, vars: Record<string, any>): string {
  // Simplified implementation
  return text.replace(
    /\{%\s*if\s+(\w+)\s*%\}([\s\S]*?)(?:\{%\s*else\s*%\}([\s\S]*?))?\{%\s*endif\s*%\}/g,
    (match, varName, truthyContent, falsyContent = '') => {
      return vars[varName] ? truthyContent : falsyContent;
    }
  );
}

function processLoops(text: string, vars: Record<string, any>): string {
  // Simplified implementation
  return text.replace(
    /\{%\s*for\s+(\w+)\s+in\s+(\w+)\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g,
    (match, itemName, arrayName, content) => {
      const array = vars[arrayName];
      if (!Array.isArray(array)) return '';

      return array.map(item => {
        return content.replace(
          new RegExp(`\\{\\{\\s*${itemName}\\s*\\}\\}`, 'g'),
          item?.toString() ?? ''
        );
      }).join('');
    }
  );
}

function parseYAML(yaml: string): any {
  // Use library like js-yaml
  // import * as yaml from 'js-yaml';
  // return yaml.load(yaml);
  throw new Error('Implement with YAML library');
}

// Usage example
const template = parsePromptTemplate(`
---
name: summarize
version: 1.0
variables:
  text:
    type: string
    required: true
  max_length:
    type: number
    default: 150
output:
  format: markdown
---

Summarize the following text in less than {{ max_length }} words:

{{ text }}
`);

const validation = validateVariables(template, {
  text: "This is a very long text that needs to be summarized...",
  max_length: 100
});

if (validation.valid) {
  const result = renderPrompt(template, {
    text: "This is a very long text that needs to be summarized...",
    max_length: 100
  });
  console.log(result);
}
```

---

**Document version:** 1.0
**Last updated:** 2025-11-21
**Status:** Draft
```
