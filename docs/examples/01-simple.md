# Example 1: Simple Template

This is the most basic form: a pure text file without frontmatter or variables.

## File: simple-summary.md

```markdown
Analyze the following text and provide:

1. A summary in 2-3 sentences
2. The main key points
3. A conclusion

Please maintain a professional and objective tone.
```

## Usage

```javascript
import { render } from 'playt';

const prompt = await render('simple-summary.md');
// The prompt contains exactly the text from the file
```

## Features

- ✅ No configuration required
- ✅ Reusable static text
- ✅ Perfect for fixed instructions
- ✅ Maximum simplicity
