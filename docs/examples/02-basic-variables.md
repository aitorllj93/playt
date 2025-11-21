# Example 2: Basic Variables

Template with variables without formal definition in frontmatter.

## File: email-response.md

```markdown
You are a professional assistant. Write an email response with the following characteristics:

**Recipient:** {{ recipient }}
**Subject:** {{ subject }}
**Tone:** {{ tone }}

**Context:**
{{ context }}

Generate a polite and professional response that addresses the mentioned points.
```

## Usage

```javascript
import { render } from 'playt';

const prompt = await render('email-response.md', {
  recipient: 'VIP Customer',
  subject: 'Proposal Follow-up',
  tone: 'formal and friendly',
  context: 'The customer asked about delivery timelines and additional costs.'
});
```

## Result

```
You are a professional assistant. Write an email response with the following characteristics:

**Recipient:** VIP Customer
**Subject:** Proposal Follow-up
**Tone:** formal and friendly

**Context:**
The customer asked about delivery timelines and additional costs.

Generate a polite and professional response that addresses the mentioned points.
```

## Features

- ✅ Simple variables with `{{ variable }}`
- ✅ No validation (flexible)
- ✅ Unprovided values render as empty string
- ✅ Ideal for quick prototypes
