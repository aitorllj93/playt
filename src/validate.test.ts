import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { validate } from "./validate";

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

describe("validate() method", () => {
	describe("Template without frontmatter", () => {
		it("should pass validation for templates without frontmatter", () => {
			const result = validate(simpleSummaryTemplate, {});
			expect(result.valid).toBe(true);
			expect(result.errors).toEqual([]);
		});

		it("should pass validation even with extra variables", () => {
			const result = validate(simpleSummaryTemplate, { foo: "bar", baz: 123 });
			expect(result.valid).toBe(true);
			expect(result.errors).toEqual([]);
		});
	});

	describe("Template with variable definitions", () => {
		it("should pass validation with all required variables provided", () => {
			const result = validate(codeReviewTemplate, {
				language: "javascript",
				code: "const x = 5;",
			});
			expect(result.valid).toBe(true);
			expect(result.errors).toEqual([]);
		});

		it("should fail validation when required variable is missing", () => {
			const result = validate(codeReviewTemplate, {
				language: "javascript",
				// code is missing
			});
			expect(result.valid).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0]).toEqual({
				variable: "code",
				error: "MissingRequiredVariable",
				message: "Variable 'code' is required but was not provided",
			});
		});

		it("should fail validation when multiple required variables are missing", () => {
			const result = validate(codeReviewTemplate, {});
			expect(result.valid).toBe(false);
			expect(result.errors).toHaveLength(2);
			expect(result.errors[0].error).toBe("MissingRequiredVariable");
			expect(result.errors[0].variable).toBe("language");
			expect(result.errors[1].error).toBe("MissingRequiredVariable");
			expect(result.errors[1].variable).toBe("code");
		});

		it("should fail validation when variable type is incorrect", () => {
			const result = validate(codeReviewTemplate, {
				language: 123, // should be string
				code: "function test() { return true; }", // valid code
			});
			expect(result.valid).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0]).toEqual({
				variable: "language",
				error: "InvalidType",
				message: "Variable 'language' expected type 'string' but got 'number'",
			});
		});

		it("should pass validation for optional variables", () => {
			const result = validate(codeReviewTemplate, {
				language: "python",
				code: "def test(): pass",
				// focus_areas and severity_level are optional
			});
			expect(result.valid).toBe(true);
			expect(result.errors).toEqual([]);
		});
	});

	describe("Enum validation", () => {
		it("should pass validation when value is in enum", () => {
			const result = validate(codeReviewTemplate, {
				language: "typescript",
				code: "const x = 5;",
				severity_level: "strict",
			});
			expect(result.valid).toBe(true);
			expect(result.errors).toEqual([]);
		});

		it("should fail validation when value is not in enum", () => {
			const result = validate(codeReviewTemplate, {
				language: "ruby", // not in enum
				code: 'puts "hello"',
			});
			expect(result.valid).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].error).toBe("ValidationError");
			expect(result.errors[0].message).toContain("must be one of");
		});

		it("should fail validation for optional enum variable with invalid value", () => {
			const result = validate(codeReviewTemplate, {
				language: "javascript",
				code: "function test() { return true; }", // valid code
				severity_level: "extreme", // not in enum
			});
			expect(result.valid).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].variable).toBe("severity_level");
			expect(result.errors[0].error).toBe("ValidationError");
		});
	});

	describe("String length validation", () => {
		it("should pass validation when string length is valid", () => {
			const result = validate(codeReviewTemplate, {
				language: "javascript",
				code: "function test() { return true; }", // between 10 and 10000
			});
			expect(result.valid).toBe(true);
			expect(result.errors).toEqual([]);
		});

		it("should fail validation when string is too short", () => {
			const result = validate(codeReviewTemplate, {
				language: "javascript",
				code: "x = 5", // less than 10 characters
			});
			expect(result.valid).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].error).toBe("ValidationError");
			expect(result.errors[0].message).toContain("Minimum length is 10");
		});

		it("should fail validation when string is too long", () => {
			const longCode = "x".repeat(10001);
			const result = validate(codeReviewTemplate, {
				language: "javascript",
				code: longCode,
			});
			expect(result.valid).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].error).toBe("ValidationError");
			expect(result.errors[0].message).toContain("Maximum length is 10000");
		});
	});

	describe("Type validation", () => {
		it("should correctly validate string type", () => {
			const result = validate(codeReviewTemplate, {
				language: "javascript",
				code: "test code here",
			});
			expect(result.valid).toBe(true);
		});

		it("should correctly validate array type", () => {
			const result = validate(codeReviewTemplate, {
				language: "javascript",
				code: "test code here",
				focus_areas: ["security", "performance"],
			});
			expect(result.valid).toBe(true);
		});

		it("should fail when array is expected but string provided", () => {
			const result = validate(codeReviewTemplate, {
				language: "javascript",
				code: "test code here",
				focus_areas: "security", // should be array
			});
			expect(result.valid).toBe(false);
			expect(result.errors[0].error).toBe("InvalidType");
			expect(result.errors[0].message).toContain(
				"expected type 'array' but got 'string'",
			);
		});
	});

	describe("Multiple validation errors", () => {
		it("should return all validation errors at once", () => {
			const result = validate(codeReviewTemplate, {
				language: "ruby", // invalid enum
				code: "x", // too short
			});
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(1);
		});
	});

	describe("Templates without variable definitions", () => {
		it("should pass validation for templates with variables but no validation rules", () => {
			const result = validate(emailResponseTemplate, {
				recipient: "John",
				subject: "Test",
			});
			expect(result.valid).toBe(true);
		});

		it("should pass validation even without providing variables", () => {
			const result = validate(emailResponseTemplate, {});
			expect(result.valid).toBe(true);
		});
	});
});
