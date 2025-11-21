import matter from "gray-matter";

export interface ValidationError {
	variable: string;
	error: "MissingRequiredVariable" | "InvalidType" | "ValidationError";
	message: string;
}

export interface ValidationResult {
	valid: boolean;
	errors: ValidationError[];
}

interface VariableDefinition {
	type?: "string" | "number" | "boolean" | "array" | "object";
	required?: boolean;
	default?: unknown;
	description?: string;
	validation?: {
		min?: number;
		max?: number;
		pattern?: string;
		enum?: unknown[];
		minLength?: number;
		maxLength?: number;
	};
}

/**
 * Validates a single value against its validation rules
 */
function validateValue(
	value: unknown,
	rules: VariableDefinition["validation"],
): string[] {
	if (!rules) return [];

	const errors: string[] = [];

	// String validations
	if (typeof value === "string") {
		if (rules.minLength !== undefined && value.length < rules.minLength) {
			errors.push(
				`Minimum length is ${rules.minLength}, but got ${value.length}`,
			);
		}
		if (rules.maxLength !== undefined && value.length > rules.maxLength) {
			errors.push(
				`Maximum length is ${rules.maxLength}, but got ${value.length}`,
			);
		}
		if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
			errors.push(`Value does not match pattern: ${rules.pattern}`);
		}
	}

	// Number validations
	if (typeof value === "number") {
		if (rules.min !== undefined && value < rules.min) {
			errors.push(`Minimum value is ${rules.min}, but got ${value}`);
		}
		if (rules.max !== undefined && value > rules.max) {
			errors.push(`Maximum value is ${rules.max}, but got ${value}`);
		}
	}

	// Enum validation (for all types)
	if (rules.enum && !rules.enum.includes(value)) {
		errors.push(`Value must be one of: ${rules.enum.join(", ")}`);
	}

	return errors;
}

/**
 * Validates variables against the template's frontmatter definition
 */
export function validate(
	template: string,
	variables?: Record<string, unknown>,
): ValidationResult {
	const parsed = matter(template);
	const errors: ValidationError[] = [];

	// If no variables defined in frontmatter, everything is valid
	if (!parsed.data.variables) {
		return { valid: true, errors: [] };
	}

	const vars = variables || {};
	const variablesDef = parsed.data.variables as Record<
		string,
		VariableDefinition
	>;

	for (const [key, varDef] of Object.entries(variablesDef)) {
		const value = vars[key];

		// Check if required variable is missing
		if (varDef.required && value === undefined) {
			errors.push({
				variable: key,
				error: "MissingRequiredVariable",
				message: `Variable '${key}' is required but was not provided`,
			});
			continue;
		}

		// If no value provided and not required, skip further validation
		if (value === undefined) continue;

		// Validate type
		const expectedType = varDef.type || "string";
		const actualType = Array.isArray(value) ? "array" : typeof value;

		if (expectedType !== actualType) {
			errors.push({
				variable: key,
				error: "InvalidType",
				message: `Variable '${key}' expected type '${expectedType}' but got '${actualType}'`,
			});
			continue;
		}

		// Validate custom rules
		if (varDef.validation) {
			const validationErrors = validateValue(value, varDef.validation);
			for (const err of validationErrors) {
				errors.push({
					variable: key,
					error: "ValidationError",
					message: `Variable '${key}': ${err}`,
				});
			}
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}
