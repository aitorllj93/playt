import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { render } from "./render";

const FIXTURES_DIR = path.join(__dirname, "fixtures");

const simpleSummaryTemplate = readFileSync(
	path.join(FIXTURES_DIR, "simple-summary.md"),
	"utf-8",
);
const emailResponseTemplate = readFileSync(
	path.join(FIXTURES_DIR, "email-response.md"),
	"utf-8",
);
const codeReviewTemplate = readFileSync(
	path.join(FIXTURES_DIR, "code-review.md"),
	"utf-8",
);
const productDescriptionTemplate = readFileSync(
	path.join(FIXTURES_DIR, "product-description.md"),
	"utf-8",
);
const sentimentAnalysisTemplate = readFileSync(
	path.join(FIXTURES_DIR, "sentiment-analysis.md"),
	"utf-8",
);
const productMockupTemplate = readFileSync(
	path.join(FIXTURES_DIR, "product-mockup.md"),
	"utf-8",
);
const teamStandupReportTemplate = readFileSync(
	path.join(FIXTURES_DIR, "team-standup-report.md"),
	"utf-8",
);

describe("render() method", () => {
	describe("Example 1: Simple Templates (No Frontmatter)", () => {
		it("should render a simple template without variables", async () => {
			const result = render(simpleSummaryTemplate);

			const expected = `Analyze the following text and provide:

1. A summary in 2-3 sentences
2. The main key points
3. A conclusion

Please maintain a professional and objective tone.`;

			expect(result).toEqual(expected);
		});
	});

	describe("Example 2: Basic Variables (No Validation)", () => {
		it("should render template with provided variables", async () => {
			const result = render(emailResponseTemplate, {
				recipient: "VIP Customer",
				subject: "Proposal Follow-up",
				tone: "formal and friendly",
				context:
					"The customer asked about delivery timelines and additional costs.",
			});

			const expected = `You are a professional assistant. Write an email response with the following characteristics:

**Recipient:** VIP Customer
**Subject:** Proposal Follow-up
**Tone:** formal and friendly

**Context:**
The customer asked about delivery timelines and additional costs.

Generate a polite and professional response that addresses the mentioned points.`;

			expect(result).toEqual(expected);
		});

		it("should render unprovided variables as empty strings", async () => {
			const result = render(emailResponseTemplate, {
				recipient: "Customer",
				subject: "Follow-up",
				// tone and context not provided
			});

			const expected = `You are a professional assistant. Write an email response with the following characteristics:

**Recipient:** Customer
**Subject:** Follow-up
**Tone:**

**Context:**

Generate a polite and professional response that addresses the mentioned points.`;

			expect(result).toEqual(expected);
		});

		it("should handle partial variable replacement", async () => {
			const result = render(emailResponseTemplate, {
				recipient: "John Doe",
				tone: "professional",
			});

			const expected = `You are a professional assistant. Write an email response with the following characteristics:

**Recipient:** John Doe
**Subject:**
**Tone:** professional

**Context:**

Generate a polite and professional response that addresses the mentioned points.`;

			expect(result).toEqual(expected);
		});
	});

	describe("Example 3: Variables with Validation", () => {
		it("should render template with valid variables and defaults", async () => {
			const result = render(codeReviewTemplate, {
				language: "typescript",
				code: "function test() { return true; }",
			});

			const expected = `# Code Review - typescript

Perform a thorough review of the following typescript code.

## Focus Areas
- performance
- security
- maintainability

## Severity Level
standard

## Code to Review

\`\`\`typescript
function test() { return true; }
\`\`\`

## Instructions

1. Analyze the code line by line
2. Identify issues related to: security, performance, maintainability, and best practices
3. Assign severity to each issue found
4. Provide concrete improvement suggestions
5. Highlight code strengths
6. Give general recommendations

Return the result in JSON format following the specified schema.`;

			expect(result).toEqual(expected);
		});

		it("should override default values with provided variables", async () => {
			const result = render(codeReviewTemplate, {
				language: "python",
				code: "def hello(): pass",
				focus_areas: ["performance", "readability"],
				severity_level: "strict",
			});

			const expected = `# Code Review - python

Perform a thorough review of the following python code.

## Focus Areas
- performance
- readability

## Severity Level
strict

## Code to Review

\`\`\`python
def hello(): pass
\`\`\`

## Instructions

1. Analyze the code line by line
2. Identify issues related to: security, performance, maintainability, and best practices
3. Assign severity to each issue found
4. Provide concrete improvement suggestions
5. Highlight code strengths
6. Give general recommendations

Return the result in JSON format following the specified schema.`;

			expect(result).toEqual(expected);
		});

		it("should handle array variables in loops", async () => {
			const result = render(codeReviewTemplate, {
				language: "javascript",
				code: "const x = 5;",
				focus_areas: ["style", "performance", "documentation"],
			});

			const expected = `# Code Review - javascript

Perform a thorough review of the following javascript code.

## Focus Areas
- style
- performance
- documentation

## Severity Level
standard

## Code to Review

\`\`\`javascript
const x = 5;
\`\`\`

## Instructions

1. Analyze the code line by line
2. Identify issues related to: security, performance, maintainability, and best practices
3. Assign severity to each issue found
4. Provide concrete improvement suggestions
5. Highlight code strengths
6. Give general recommendations

Return the result in JSON format following the specified schema.`;

			expect(result).toEqual(expected);
		});
	});

	describe("Example 4: Conditionals", () => {
		it("should render conditional blocks when condition is true", async () => {
			const result = render(productDescriptionTemplate, {
				product_name: "SmartPhone Pro X",
				price: 999,
				category: "Electronics",
				on_sale: true,
				discount_percentage: 20,
				features: [
					'6.7" OLED Display',
					"Triple 108MP Camera",
					"5000mAh Battery",
					"5G",
				],
				include_technical_specs: true,
				target_audience: "professional",
			});

			const expected = `# SmartPhone Pro X

Generate an attractive and compelling description for the following product.

## Product Information

**Category:** Electronics
**Price:** $999

🔥 **SPECIAL OFFER!**
20% discount
Final price: $799.2

## Key Features

- 6.7" OLED Display
- Triple 108MP Camera
- 5000mAh Battery
- 5G

## Target Audience

Product oriented to professionals seeking high-performance tools and advanced features.

## Technical Specifications

Include a detailed section with:
- Dimensions and weight
- System requirements
- Compatibility
- Warranty and support

## Instructions

Create a persuasive description that:
1. Highlights the main benefits
2. Uses language appropriate for the target audience
3. Includes calls to action
4. Emphasizes the urgency of the limited offer`;

			expect(result).toEqual(expected);
		});

		it("should not render conditional blocks when condition is false", async () => {
			const result = render(productDescriptionTemplate, {
				product_name: "Bluetooth Headphones",
				price: 79,
				category: "Audio",
				on_sale: false,
				features: [
					"Active noise cancellation",
					"30 hours battery life",
					"Bluetooth 5.0",
				],
				include_technical_specs: false,
				target_audience: "general",
			});

			const expected = `# Bluetooth Headphones

Generate an attractive and compelling description for the following product.

## Product Information

**Category:** Audio
**Price:** $79

## Key Features

- Active noise cancellation
- 30 hours battery life
- Bluetooth 5.0

## Target Audience

This product is designed for the general public, with a focus on ease of use and accessibility.

## Instructions

Create a persuasive description that:
1. Highlights the main benefits
2. Uses language appropriate for the target audience
3. Includes calls to action`;

			expect(result).toEqual(expected);
		});

		it("should handle multiple if/else conditions", async () => {
			// Test enterprise audience
			const result1 = render(productDescriptionTemplate, {
				product_name: "Product A",
				price: 1000,
				category: "Software",
				features: ["Feature 1"],
				target_audience: "enterprise",
			});

			const expected1 = `# Product A

Generate an attractive and compelling description for the following product.

## Product Information

**Category:** Software
**Price:** $1000

## Key Features

- Feature 1

## Target Audience

Enterprise solution designed for teams and organizations requiring scalability and dedicated support.

## Instructions

Create a persuasive description that:
1. Highlights the main benefits
2. Uses language appropriate for the target audience
3. Includes calls to action`;

			expect(result1).toEqual(expected1);

			// Test professional audience
			const result2 = render(productDescriptionTemplate, {
				product_name: "Product B",
				price: 500,
				category: "Hardware",
				features: ["Feature 1"],
				target_audience: "professional",
			});

			const expected2 = `# Product B

Generate an attractive and compelling description for the following product.

## Product Information

**Category:** Hardware
**Price:** $500

## Key Features

- Feature 1

## Target Audience

Product oriented to professionals seeking high-performance tools and advanced features.

## Instructions

Create a persuasive description that:
1. Highlights the main benefits
2. Uses language appropriate for the target audience
3. Includes calls to action`;

			expect(result2).toEqual(expected2);

			// Test general audience
			const result3 = render(productDescriptionTemplate, {
				product_name: "Product C",
				price: 100,
				category: "Consumer",
				features: ["Feature 1"],
				target_audience: "general",
			});

			const expected3 = `# Product C

Generate an attractive and compelling description for the following product.

## Product Information

**Category:** Consumer
**Price:** $100

## Key Features

- Feature 1

## Target Audience

This product is designed for the general public, with a focus on ease of use and accessibility.

## Instructions

Create a persuasive description that:
1. Highlights the main benefits
2. Uses language appropriate for the target audience
3. Includes calls to action`;

			expect(result3).toEqual(expected3);
		});

		it("should handle boolean default values", async () => {
			const result = render(productDescriptionTemplate, {
				product_name: "Product",
				price: 100,
				category: "Test",
				features: ["Feature"],
				// on_sale defaults to false
				// include_technical_specs defaults to false
			});

			const expected = `# Product

Generate an attractive and compelling description for the following product.

## Product Information

**Category:** Test
**Price:** $100

## Key Features

- Feature

## Target Audience

## Instructions

Create a persuasive description that:
1. Highlights the main benefits
2. Uses language appropriate for the target audience
3. Includes calls to action`;

			expect(result).toEqual(expected);
		});
	});

	describe("Example 5: JSON Output", () => {
		it("should render template with JSON output specification", async () => {
			const result = render(sentimentAnalysisTemplate, {
				text: "I love this product! It is amazing and exceeded all my expectations.",
				language: "en",
				include_entities: true,
				include_keywords: true,
			});

			const expected = `# Sentiment Analysis

Analyze the following text and provide a detailed sentiment and emotion analysis.

**Language:** en

## Text to Analyze

\`\`\`
I love this product! It is amazing and exceeded all my expectations.
\`\`\`

## Instructions

Perform a complete analysis that includes:

1. **Overall Sentiment**: Classify the general tone of the text
2. **Confidence**: Indicate how confident you are in the analysis (0.0 to 1.0)
3. **Emotions**: Detect and quantify present emotions:
   - Joy
   - Sadness
   - Anger
   - Fear
   - Surprise
4. **Subjectivity**: Evaluate if the text is objective or subjective
5. **Key Phrases**: Identify the most relevant phrases with their sentiment
6. **Entities**: Extract mentioned people, organizations, places, products, or events
7. **Keywords**: List the most relevant words in the text
8. **Summary**: Provide a brief description of the analysis

**IMPORTANT:** Return ONLY a valid JSON object that exactly matches the specified schema. Do not include any additional text before or after the JSON.`;

			expect(result).toEqual(expected);
		});

		it("should use default values for optional variables", async () => {
			const result = render(sentimentAnalysisTemplate, {
				text: "This is a test text for sentiment analysis.",
			});

			const expected = `# Sentiment Analysis

Analyze the following text and provide a detailed sentiment and emotion analysis.

**Language:** auto

## Text to Analyze

\`\`\`
This is a test text for sentiment analysis.
\`\`\`

## Instructions

Perform a complete analysis that includes:

1. **Overall Sentiment**: Classify the general tone of the text
2. **Confidence**: Indicate how confident you are in the analysis (0.0 to 1.0)
3. **Emotions**: Detect and quantify present emotions:
   - Joy
   - Sadness
   - Anger
   - Fear
   - Surprise
4. **Subjectivity**: Evaluate if the text is objective or subjective
5. **Key Phrases**: Identify the most relevant phrases with their sentiment
6. **Entities**: Extract mentioned people, organizations, places, products, or events
7. **Keywords**: List the most relevant words in the text
8. **Summary**: Provide a brief description of the analysis

**IMPORTANT:** Return ONLY a valid JSON object that exactly matches the specified schema. Do not include any additional text before or after the JSON.`;

			expect(result).toEqual(expected);
		});

		it("should conditionally include optional sections", async () => {
			const result = render(sentimentAnalysisTemplate, {
				text: "Sample text for analysis.",
				include_entities: false,
				include_keywords: false,
			});

			const expected = `# Sentiment Analysis

Analyze the following text and provide a detailed sentiment and emotion analysis.

**Language:** auto

## Text to Analyze

\`\`\`
Sample text for analysis.
\`\`\`

## Instructions

Perform a complete analysis that includes:

1. **Overall Sentiment**: Classify the general tone of the text
2. **Confidence**: Indicate how confident you are in the analysis (0.0 to 1.0)
3. **Emotions**: Detect and quantify present emotions:
   - Joy
   - Sadness
   - Anger
   - Fear
   - Surprise
4. **Subjectivity**: Evaluate if the text is objective or subjective
5. **Key Phrases**: Identify the most relevant phrases with their sentiment
8. **Summary**: Provide a brief description of the analysis

**IMPORTANT:** Return ONLY a valid JSON object that exactly matches the specified schema. Do not include any additional text before or after the JSON.`;

			expect(result).toEqual(expected);
		});
	});

	describe("Example 6: Image Generation", () => {
		it("should render image generation prompt with all specifications", async () => {
			const result = render(productMockupTemplate, {
				product_type: "smartphone",
				product_name: "Galaxy Pro X",
				primary_color: "midnight blue",
				environment: "minimal",
				angle: "three-quarter",
				lighting: "professional",
				style: "photorealistic",
			});

			const expected = `# Product Mockup: Galaxy Pro X

Generate a high-quality product mockup image with the following specifications:

## Product Details
- **Type:** smartphone
- **Name:** Galaxy Pro X
- **Primary Color:** midnight blue

## Visual Specifications
- **Environment:** minimal
- **Camera Angle:** three-quarter
- **Lighting:** professional
- **Style:** photorealistic

## Technical Requirements

**Composition:**
- Product should be the main focus
- Professional composition following rule of thirds
- Appropriate depth of field
- Clean background without distractions

**Quality:**
- High resolution (1024x1024px)
- Sharp details and textures
- Realistic materials and reflections
- Professional color grading

**Context:**
Ultra-minimal composition, single color background, product floating

**Lighting Setup:**
Multi-point studio lighting, balanced exposure, minimal shadows

Generate a photorealistic, professional-quality product image suitable for e-commerce or marketing materials.`;

			expect(result).toEqual(expected);
		});

		it("should use default values for optional image parameters", async () => {
			const result = render(productMockupTemplate, {
				product_type: "laptop",
				product_name: "MacBook Pro",
			});

			const expected = `# Product Mockup: MacBook Pro

Generate a high-quality product mockup image with the following specifications:

## Product Details
- **Type:** laptop
- **Name:** MacBook Pro
- **Primary Color:** silver

## Visual Specifications
- **Environment:** studio
- **Camera Angle:** front
- **Lighting:** professional
- **Style:** photorealistic

## Technical Requirements

**Composition:**
- Product should be the main focus
- Professional composition following rule of thirds
- Appropriate depth of field
- Clean background without distractions

**Quality:**
- High resolution (1024x1024px)
- Sharp details and textures
- Realistic materials and reflections
- Professional color grading

**Context:**
Clean white or gradient background, professional studio lighting, product centered

**Lighting Setup:**
Multi-point studio lighting, balanced exposure, minimal shadows

Generate a photorealistic, professional-quality product image suitable for e-commerce or marketing materials.`;

			expect(result).toEqual(expected);
		});
	});

	describe("Example 8: Advanced Loops", () => {
		it("should render nested loops with complex objects", async () => {
			const result = render(teamStandupReportTemplate, {
				team_name: "Platform Engineering",
				date: "2025-11-21",
				sprint_number: 24,
				team_members: [
					{
						name: "Sarah Chen",
						role: "Senior Engineer",
						completed: [
							"Implemented user authentication API",
							"Fixed critical bug",
						],
						planned: ["Complete integration tests", "Start dashboard redesign"],
						notes: "Auth API ready for QA",
					},
					{
						name: "Mike Rodriguez",
						role: "Backend Engineer",
						completed: ["Database migration", "Optimized queries"],
						planned: ["Implement caching"],
						blockers: ["Waiting on DevOps"],
					},
				],
			});

			const expected = `# Daily Standup Report - Platform Engineering

**Date:** 2025-11-21
**Sprint:** #24

Generate a comprehensive standup report summarizing the team's progress, blockers, and next steps.

---

## Team Updates

### Sarah Chen (Senior Engineer)

**Yesterday:**
- ✅ Implemented user authentication API
- ✅ Fixed critical bug

**Today:**
- 🎯 Complete integration tests
- 🎯 Start dashboard redesign

**Notes:** Auth API ready for QA

---
### Mike Rodriguez (Backend Engineer)

**Yesterday:**
- ✅ Database migration
- ✅ Optimized queries

**Today:**
- 🎯 Implement caching

**Blockers:**
- 🚧 Waiting on DevOps

---

## Team Blockers

The following blockers need attention:

## Upcoming Deadlines

---

## Analysis Request

Based on the above information, provide:

1. **Team Velocity Assessment**
   - Are we on track for sprint goals?
   - Any concerns about workload distribution?

2. **Blocker Resolution**
   - Prioritize blockers by impact
   - Suggest action items for resolution

3. **Risk Analysis**
   - Identify potential risks from the updates
   - Highlight dependencies between team members

4. **Recommendations**
   - Suggest schedule adjustments if needed
   - Identify opportunities for collaboration
   - Flag items that need management attention

5. **Morale Check**
   - Assess team sentiment from the updates
   - Identify team members who might need support

Generate a concise executive summary suitable for management review.`;

			expect(result).toEqual(expected);
		});

		it("should render blockers list with join filter", async () => {
			const result = render(teamStandupReportTemplate, {
				team_name: "Dev Team",
				date: "2025-11-21",
				sprint_number: 5,
				team_members: [
					{
						name: "Developer",
						role: "Engineer",
						completed: ["Task 1"],
						planned: ["Task 2"],
					},
				],
				blockers: [
					{
						title: "Redis Cluster Not Available",
						severity: "Medium",
						affected_members: ["Mike Rodriguez", "Sarah Chen"],
						description: "Backend team needs Redis cluster",
						solution: "Escalate to DevOps manager",
					},
				],
			});

			const expected = `# Daily Standup Report - Dev Team

**Date:** 2025-11-21
**Sprint:** #5

Generate a comprehensive standup report summarizing the team's progress, blockers, and next steps.

---

## Team Updates

### Developer (Engineer)

**Yesterday:**
- ✅ Task 1

**Today:**
- 🎯 Task 2

---

## Team Blockers

The following blockers need attention:

### Redis Cluster Not Available
- **Severity:** Medium
- **Affected:** Mike Rodriguez, Sarah Chen
- **Description:** Backend team needs Redis cluster
- **Proposed Solution:** Escalate to DevOps manager

## Upcoming Deadlines

---

## Analysis Request

Based on the above information, provide:

1. **Team Velocity Assessment**
   - Are we on track for sprint goals?
   - Any concerns about workload distribution?

2. **Blocker Resolution**
   - Prioritize blockers by impact
   - Suggest action items for resolution

3. **Risk Analysis**
   - Identify potential risks from the updates
   - Highlight dependencies between team members

4. **Recommendations**
   - Suggest schedule adjustments if needed
   - Identify opportunities for collaboration
   - Flag items that need management attention

5. **Morale Check**
   - Assess team sentiment from the updates
   - Identify team members who might need support

Generate a concise executive summary suitable for management review.`;

			expect(result).toEqual(expected);
		});

		it("should show message when no blockers exist", async () => {
			const result = render(teamStandupReportTemplate, {
				team_name: "Happy Team",
				date: "2025-11-21",
				sprint_number: 10,
				team_members: [
					{
						name: "Dev",
						role: "Engineer",
						completed: ["Work"],
						planned: ["More work"],
					},
				],
				blockers: [],
			});

			const expected = `# Daily Standup Report - Happy Team

**Date:** 2025-11-21
**Sprint:** #10

Generate a comprehensive standup report summarizing the team's progress, blockers, and next steps.

---

## Team Updates

### Dev (Engineer)

**Yesterday:**
- ✅ Work

**Today:**
- 🎯 More work

---

## Team Blockers

The following blockers need attention:

## Upcoming Deadlines

---

## Analysis Request

Based on the above information, provide:

1. **Team Velocity Assessment**
   - Are we on track for sprint goals?
   - Any concerns about workload distribution?

2. **Blocker Resolution**
   - Prioritize blockers by impact
   - Suggest action items for resolution

3. **Risk Analysis**
   - Identify potential risks from the updates
   - Highlight dependencies between team members

4. **Recommendations**
   - Suggest schedule adjustments if needed
   - Identify opportunities for collaboration
   - Flag items that need management attention

5. **Morale Check**
   - Assess team sentiment from the updates
   - Identify team members who might need support

Generate a concise executive summary suitable for management review.`;

			expect(result).toEqual(expected);
		});

		it("should render upcoming deadlines with all details", async () => {
			const result = render(teamStandupReportTemplate, {
				team_name: "Dev Team",
				date: "2025-11-21",
				sprint_number: 8,
				team_members: [
					{
						name: "Dev",
						role: "Engineer",
						completed: ["Task"],
						planned: ["Task"],
					},
				],
				upcoming_deadlines: [
					{
						date: "2025-11-25",
						milestone: "Authentication System Complete",
						status: "On Track",
						owner: "Sarah Chen",
						progress: 85,
					},
					{
						date: "2025-11-30",
						milestone: "Performance Optimization Sprint",
						status: "At Risk",
						owner: "Mike Rodriguez",
						progress: 45,
					},
				],
			});

			const expected = `# Daily Standup Report - Dev Team

**Date:** 2025-11-21
**Sprint:** #8

Generate a comprehensive standup report summarizing the team's progress, blockers, and next steps.

---

## Team Updates

### Dev (Engineer)

**Yesterday:**
- ✅ Task

**Today:**
- 🎯 Task

---

## Team Blockers

The following blockers need attention:

## Upcoming Deadlines

- **2025-11-25**: Authentication System Complete (On Track)
  - Owner: Sarah Chen
  - Progress: 85%
- **2025-11-30**: Performance Optimization Sprint (At Risk)
  - Owner: Mike Rodriguez
  - Progress: 45%

---

## Analysis Request

Based on the above information, provide:

1. **Team Velocity Assessment**
   - Are we on track for sprint goals?
   - Any concerns about workload distribution?

2. **Blocker Resolution**
   - Prioritize blockers by impact
   - Suggest action items for resolution

3. **Risk Analysis**
   - Identify potential risks from the updates
   - Highlight dependencies between team members

4. **Recommendations**
   - Suggest schedule adjustments if needed
   - Identify opportunities for collaboration
   - Flag items that need management attention

5. **Morale Check**
   - Assess team sentiment from the updates
   - Identify team members who might need support

Generate a concise executive summary suitable for management review.`;

			expect(result).toEqual(expected);
		});
	});

	describe("Edge Cases and Special Scenarios", () => {
		it("should handle empty arrays in loops", async () => {
			const result = render(productDescriptionTemplate, {
				product_name: "Test Product",
				price: 100,
				category: "Test",
				features: [],
			});

			const expected = `# Test Product

Generate an attractive and compelling description for the following product.

## Product Information

**Category:** Test
**Price:** $100

## Key Features

## Target Audience

## Instructions

Create a persuasive description that:
1. Highlights the main benefits
2. Uses language appropriate for the target audience
3. Includes calls to action`;

			expect(result).toEqual(expected);
		});

		it("should handle numeric calculations in templates", async () => {
			const result = render(productDescriptionTemplate, {
				product_name: "Discount Product",
				price: 1000,
				category: "Electronics",
				on_sale: true,
				discount_percentage: 25,
				features: ["Feature 1"],
			});

			const expected = `# Discount Product

Generate an attractive and compelling description for the following product.

## Product Information

**Category:** Electronics
**Price:** $1000

🔥 **SPECIAL OFFER!**
25% discount
Final price: $750

## Key Features

- Feature 1

## Target Audience

## Instructions

Create a persuasive description that:
1. Highlights the main benefits
2. Uses language appropriate for the target audience
3. Includes calls to action
4. Emphasizes the urgency of the limited offer`;

			expect(result).toEqual(expected);
		});

		it("should preserve special characters in variable values", async () => {
			const result = render(emailResponseTemplate, {
				recipient: "Customer <customer@example.com>",
				subject: 'Re: Your inquiry about "Product X" & pricing',
				tone: "professional",
				context: 'Customer asked: "What\'s the price?" and mentioned <urgent>',
			});

			const expected = `You are a professional assistant. Write an email response with the following characteristics:

**Recipient:** Customer <customer@example.com>
**Subject:** Re: Your inquiry about "Product X" & pricing
**Tone:** professional

**Context:**
Customer asked: "What's the price?" and mentioned <urgent>

Generate a polite and professional response that addresses the mentioned points.`;

			expect(result).toEqual(expected);
		});
	});

	describe("Variable Types and Defaults", () => {
		it("should handle string variables", async () => {
			const result = render(emailResponseTemplate, {
				recipient: "John Doe",
				subject: "Meeting",
				tone: "casual",
				context: "Let's meet tomorrow",
			});

			const expected = `You are a professional assistant. Write an email response with the following characteristics:

**Recipient:** John Doe
**Subject:** Meeting
**Tone:** casual

**Context:**
Let's meet tomorrow

Generate a polite and professional response that addresses the mentioned points.`;

			expect(result).toEqual(expected);
		});

		it("should handle boolean variables", async () => {
			const result1 = render(productDescriptionTemplate, {
				product_name: "Product",
				price: 100,
				category: "Test",
				features: ["Feature"],
				on_sale: true,
				discount_percentage: 10,
			});

			const expected1 = `# Product

Generate an attractive and compelling description for the following product.

## Product Information

**Category:** Test
**Price:** $100

🔥 **SPECIAL OFFER!**
10% discount
Final price: $90

## Key Features

- Feature

## Target Audience

## Instructions

Create a persuasive description that:
1. Highlights the main benefits
2. Uses language appropriate for the target audience
3. Includes calls to action
4. Emphasizes the urgency of the limited offer`;

			expect(result1).toEqual(expected1);

			const result2 = render(productDescriptionTemplate, {
				product_name: "Product",
				price: 100,
				category: "Test",
				features: ["Feature"],
				on_sale: false,
			});

			const expected2 = `# Product

Generate an attractive and compelling description for the following product.

## Product Information

**Category:** Test
**Price:** $100

## Key Features

- Feature

## Target Audience

## Instructions

Create a persuasive description that:
1. Highlights the main benefits
2. Uses language appropriate for the target audience
3. Includes calls to action`;

			expect(result2).toEqual(expected2);
		});

		it("should handle array variables", async () => {
			const result = render(codeReviewTemplate, {
				language: "python",
				code: "def test(): pass",
				focus_areas: ["security", "performance", "style", "documentation"],
			});

			const expected = `# Code Review - python

Perform a thorough review of the following python code.

## Focus Areas
- security
- performance
- style
- documentation

## Severity Level
standard

## Code to Review

\`\`\`python
def test(): pass
\`\`\`

## Instructions

1. Analyze the code line by line
2. Identify issues related to: security, performance, maintainability, and best practices
3. Assign severity to each issue found
4. Provide concrete improvement suggestions
5. Highlight code strengths
6. Give general recommendations

Return the result in JSON format following the specified schema.`;

			expect(result).toEqual(expected);
		});
	});
});
