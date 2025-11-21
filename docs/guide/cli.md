# CLI Usage

Playt provides a powerful command-line interface for working with prompt templates.

## Installation

```bash
npm install -g playt
```

Or use directly in your project:

```bash
npm install playt
npx playt --help
```

## Commands

### `render` - Render a template

Render a template file with variables and output the result.

```bash
playt render <template> [options]
```

**Options:**
- `-v, --var <key=value>` - Pass individual variables (can be used multiple times)
- `--vars <file>` - Load variables from a JSON file
- `--stdin` - Read variables from stdin as JSON
- `-o, --output <file>` - Save result to file (default: stdout)
- `--no-validate` - Skip validation of variables

**Examples:**

```bash
# Render with inline variables
playt render email.md -v recipient="John" -v subject="Meeting"

# Render with variables from file
playt render email.md --vars vars.json

# Render with variables from stdin
echo '{"name":"Alice"}' | playt render template.md --stdin

# Combine variables (inline variables override file/stdin)
playt render template.md --vars base.json -v name="Bob"

# Save output to file
playt render template.md -v name="Charlie" -o output.txt

# Skip validation for faster rendering
playt render template.md -v name="Dave" --no-validate
```

**Variable Format:**

Variables passed with `-v` can be strings or JSON values:

```bash
# String value
playt render template.md -v name="John"

# Number value
playt render template.md -v age=30

# Boolean value
playt render template.md -v active=true

# Array value (must be valid JSON)
playt render template.md -v 'items=["a","b","c"]'

# Object value (must be valid JSON)
playt render template.md -v 'config={"key":"value"}'
```

### `validate` - Validate a template

Validate that a template and its variables are correct.

```bash
playt validate <template> [options]
```

**Options:**
- `-v, --var <key=value>` - Pass individual variables (can be used multiple times)
- `--vars <file>` - Load variables from a JSON file
- `--stdin` - Read variables from stdin as JSON

**Examples:**

```bash
# Validate with inline variables
playt validate template.md -v name="Test"

# Validate with variables from file
playt validate template.md --vars vars.json

# Validate template structure only (no variables)
playt validate template.md
```

**Exit codes:**
- `0` - Template is valid
- `1` - Validation failed

### `inspect` - Show template information

Display information about a template including its variables, types, and descriptions.

```bash
playt inspect <template>
```

**Examples:**

```bash
playt inspect email-response.md
```

**Output includes:**
- Template description
- Required variables with types and descriptions
- Optional variables with defaults
- Template size (lines and characters)

### `init` - Create a new template

Create a new template file with example frontmatter and content.

```bash
playt init <name> [options]
```

**Options:**
- `-d, --description <text>` - Template description

**Examples:**

```bash
# Create a basic template
playt init my-template.md

# Create with description
playt init my-template.md -d "Email response generator"
```

The generated template includes:
- Example frontmatter with variable definitions
- Sample template content
- Comments to guide customization

## Common Workflows

### Development Workflow

```bash
# 1. Create a new template
playt init my-prompt.md

# 2. Edit the template (use your favorite editor)
vim my-prompt.md

# 3. Check what variables are needed
playt inspect my-prompt.md

# 4. Test with variables
playt render my-prompt.md -v name="Test"

# 5. Validate with different inputs
playt validate my-prompt.md -v name="Production"
```

### Integration with Scripts

```bash
# Generate variables programmatically
node generate-vars.js | playt render template.md --stdin

# Use in shell scripts
RESULT=$(playt render template.md --vars config.json)
echo "$RESULT" | some-other-command

# Batch processing
for file in prompts/*.md; do
  playt render "$file" --vars vars.json -o "output/$(basename $file)"
done
```

### CI/CD Integration

```bash
# Validate all templates in CI
for template in templates/*.md; do
  echo "Validating $template..."
  playt validate "$template" --vars test-vars.json || exit 1
done

# Generate prompts for deployment
playt render prod-prompt.md --vars prod-vars.json -o dist/prompt.txt
```

## Tips

1. **Use JSON files for complex variables**: For templates with many variables or complex data structures, store them in JSON files.

2. **Combine sources**: You can combine `--vars` with `-v` flags. Inline variables will override file variables.

3. **Pipe chains**: The CLI works well with Unix pipes. Output can be piped to other commands.

4. **Exit codes**: Commands return appropriate exit codes for scripting (0 = success, 1 = error).

5. **Validation**: By default, `render` validates variables. Use `--no-validate` only when you're certain variables are correct.

## Environment Variables

Currently, Playt CLI doesn't use environment variables, but you can create wrapper scripts:

```bash
#!/bin/bash
# wrapper.sh
VARS_FILE="${PLAYT_VARS_FILE:-default-vars.json}"
playt render "$1" --vars "$VARS_FILE"
```

## Troubleshooting

**Template not found:**
```
Error: Template file not found: template.md
```
Make sure you're in the correct directory or provide the full path to the template.

**Invalid JSON:**
```
Error: Invalid JSON in variables file: vars.json
```
Validate your JSON file with a JSON validator or `jq`.

**Missing required variable:**
```
Validation errors:
  - Variable 'name' is required but was not provided
```
Check the template's required variables with `playt inspect template.md`.

**Invalid variable format:**
```
Error: Invalid variable format: key:value
Expected format: key=value
```
Use `=` to separate keys and values: `-v key=value`.
