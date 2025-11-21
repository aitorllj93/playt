#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { Command } from "commander";
import matter from "gray-matter";

import { render } from "./render";
import { validate } from "./validate";

const program = new Command();

// Helper to load variables from different sources
function loadVariables(options: {
	var?: string[];
	vars?: string;
	stdin?: boolean;
}): Record<string, unknown> {
	let variables: Record<string, unknown> = {};

	// Load from file if provided
	if (options.vars) {
		const varsPath = resolve(process.cwd(), options.vars);
		if (!existsSync(varsPath)) {
			console.error(`Error: Variables file not found: ${varsPath}`);
			process.exit(1);
		}
		const content = readFileSync(varsPath, "utf-8");
		try {
			variables = JSON.parse(content);
		} catch (_error) {
			console.error(`Error: Invalid JSON in variables file: ${varsPath}`);
			process.exit(1);
		}
	}

	// Load from stdin if requested
	if (options.stdin) {
		const stdinData = readFileSync(0, "utf-8");
		try {
			const stdinVars = JSON.parse(stdinData);
			variables = { ...variables, ...stdinVars };
		} catch (_error) {
			console.error("Error: Invalid JSON from stdin");
			process.exit(1);
		}
	}

	// Parse inline variables (overwrites file/stdin variables)
	if (options.var && options.var.length > 0) {
		for (const varStr of options.var) {
			const match = varStr.match(/^([^=]+)=(.+)$/);
			if (!match) {
				console.error(`Error: Invalid variable format: ${varStr}`);
				console.error("Expected format: key=value");
				process.exit(1);
			}
			const [, key, value] = match;
			// Try to parse as JSON first, fallback to string
			try {
				variables[key] = JSON.parse(value);
			} catch {
				variables[key] = value;
			}
		}
	}

	return variables;
}

// Helper to load template
function loadTemplate(templatePath: string): string {
	const fullPath = resolve(process.cwd(), templatePath);
	if (!existsSync(fullPath)) {
		console.error(`Error: Template file not found: ${fullPath}`);
		process.exit(1);
	}
	return readFileSync(fullPath, "utf-8");
}

// Render command
program
	.command("render")
	.description("Render a template with variables")
	.argument("<template>", "Template file to render")
	.option(
		"-v, --var <key=value...>",
		"Pass individual variables (repeatable)",
		(value, previous: string[] = []) => {
			return [...previous, value];
		},
	)
	.option("--vars <file>", "Load variables from JSON file")
	.option("--stdin", "Read variables from stdin (JSON)")
	.option("-o, --output <file>", "Save result to file (default: stdout)")
	.option("--no-validate", "Skip validation of variables")
	.action((templatePath, options) => {
		try {
			const template = loadTemplate(templatePath);
			const variables = loadVariables(options);

			// Validate if not disabled
			if (options.validate !== false) {
				const validation = validate(template, variables);
				if (!validation.valid) {
					console.error("Validation errors:");
					for (const error of validation.errors) {
						console.error(`  - ${error.message}`);
					}
					process.exit(1);
				}
			}

			// Render
			const result = render(template, variables);

			// Output
			if (options.output) {
				const outputPath = resolve(process.cwd(), options.output);
				writeFileSync(outputPath, result, "utf-8");
				console.log(`✓ Rendered to: ${outputPath}`);
			} else {
				console.log(result);
			}
		} catch (error) {
			console.error(
				`Error: ${error instanceof Error ? error.message : String(error)}`,
			);
			process.exit(1);
		}
	});

// Validate command
program
	.command("validate")
	.description("Validate a template and variables")
	.argument("<template>", "Template file to validate")
	.option(
		"-v, --var <key=value...>",
		"Pass individual variables (repeatable)",
		(value, previous: string[] = []) => {
			return [...previous, value];
		},
	)
	.option("--vars <file>", "Load variables from JSON file")
	.option("--stdin", "Read variables from stdin (JSON)")
	.action((templatePath, options) => {
		try {
			const template = loadTemplate(templatePath);
			const variables = loadVariables(options);

			const validation = validate(template, variables);

			if (validation.valid) {
				console.log("✓ Template is valid");
				process.exit(0);
			} else {
				console.error("✗ Validation errors:");
				for (const error of validation.errors) {
					console.error(`  - ${error.message}`);
				}
				process.exit(1);
			}
		} catch (error) {
			console.error(
				`Error: ${error instanceof Error ? error.message : String(error)}`,
			);
			process.exit(1);
		}
	});

// Inspect command
program
	.command("inspect")
	.description("Show template information")
	.argument("<template>", "Template file to inspect")
	.action((templatePath) => {
		try {
			const template = loadTemplate(templatePath);
			const parsed = matter(template);

			console.log(`Template: ${templatePath}`);
			console.log("");

			// Description
			if (parsed.data.description) {
				console.log(`Description: ${parsed.data.description}`);
				console.log("");
			}

			// Variables
			if (parsed.data.variables) {
				// biome-ignore lint/suspicious/noExplicitAny: Template variables are dynamic
				const variables = parsed.data.variables as Record<string, any>;
				const requiredVars: string[] = [];
				const optionalVars: string[] = [];

				for (const [key, def] of Object.entries(variables)) {
					const varInfo = [];
					varInfo.push(key);

					if (def.type) {
						varInfo.push(`(${def.type})`);
					}

					if (def.description) {
						varInfo.push(`- ${def.description}`);
					}

					if (def.default !== undefined) {
						varInfo.push(`[default: ${JSON.stringify(def.default)}]`);
					}

					const varStr = `  ${varInfo.join(" ")}`;

					if (def.required) {
						requiredVars.push(varStr);
					} else {
						optionalVars.push(varStr);
					}
				}

				if (requiredVars.length > 0) {
					console.log("Required Variables:");
					for (const v of requiredVars) {
						console.log(v);
					}
					console.log("");
				}

				if (optionalVars.length > 0) {
					console.log("Optional Variables:");
					for (const v of optionalVars) {
						console.log(v);
					}
				}

				if (requiredVars.length === 0 && optionalVars.length === 0) {
					console.log("No variables defined");
					console.log("");
				}
			} else {
				console.log("No variables defined");
				console.log("");
			}

			// Template size
			const lines = parsed.content.trim().split("\n").length;
			console.log(
				`Template size: ${lines} lines, ${parsed.content.length} characters`,
			);
		} catch (error) {
			console.error(
				`Error: ${error instanceof Error ? error.message : String(error)}`,
			);
			process.exit(1);
		}
	});

// Init command
program
	.command("init")
	.description("Create a new template")
	.argument("<name>", "Name of the template file (e.g., my-template.md)")
	.option("-d, --description <text>", "Template description")
	.action((name, options) => {
		try {
			const templatePath = resolve(process.cwd(), name);

			if (existsSync(templatePath)) {
				console.error(`Error: File already exists: ${templatePath}`);
				process.exit(1);
			}

			const templateContent = `---
description: ${options.description || "A new Playt template"}
variables:
  name:
    type: string
    required: true
    description: User name
  message:
    type: string
    required: false
    default: Hello!
    description: A custom message
---

Hello {{ name }}!

{{ message }}

This is your new Playt template. Edit this file to customize it.
`;

			writeFileSync(templatePath, templateContent, "utf-8");
			console.log(`✓ Created template: ${templatePath}`);
			console.log("");
			console.log("Next steps:");
			console.log(`  1. Edit ${name} to customize your template`);
			console.log(`  2. Test it: playt render ${name} -v name="World"`);
			console.log(`  3. Inspect it: playt inspect ${name}`);
		} catch (error) {
			console.error(
				`Error: ${error instanceof Error ? error.message : String(error)}`,
			);
			process.exit(1);
		}
	});

// Main program
program
	.name("playt")
	.description("A powerful prompt templating CLI")
	.version("0.1.0");

program.parse();
