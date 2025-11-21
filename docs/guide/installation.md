# Installation

## Requirements

- Node.js 16.x or higher
- npm, yarn, or pnpm

## Package Installation

### Using npm

```bash
npm install playt
```

### Using yarn

```bash
yarn add playt
```

### Using pnpm

```bash
pnpm add playt
```

## Global Installation (CLI)

If you want to use Playt's CLI globally:

```bash
npm install -g playt
```

Or use it directly with npx (no installation required):

```bash
npx playt --help
```

## Verify Installation

Check that Playt is installed correctly:

```bash
playt --version
```

You should see output like:

```
0.1.0
```

## Development Installation

If you want to contribute to Playt or run it from source:

```bash
# Clone the repository
git clone https://github.com/yourusername/playt.git
cd playt

# Install dependencies
npm install

# Build the project
npm run build

# Link globally for development
npm link

# Verify
playt --version
```

## TypeScript Support

Playt includes TypeScript type definitions out of the box. No additional `@types` packages are needed.

```typescript
import { render, validate } from 'playt';
// Full TypeScript support available
```

## Next Steps

After installation:

1. Read the [Library Usage Guide](guide/library.md) to use Playt in your code
2. Check the [CLI Usage Guide](guide/cli.md) to use the command-line interface
3. Explore [Examples](../examples/01-simple.md) for practical use cases
