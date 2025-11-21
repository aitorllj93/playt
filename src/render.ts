import matter from "gray-matter";
import nunjucks from "nunjucks";

const env = nunjucks.configure({
	autoescape: false,
	trimBlocks: true,
	lstripBlocks: true,
});

export function render<T = Record<string, unknown>>(
	template: string,
	variables?: T,
): string {
	const parsed = matter(template);
	const content = parsed.content.trim();

	const defaults: Record<string, unknown> = {};
	if (parsed.data.variables) {
		Object.entries(parsed.data.variables).forEach(([key, value]) => {
			if (typeof value === "object" && value !== null && "default" in value) {
				defaults[key] = (value as { default: unknown }).default;
			}
		});
	}

	const mergedVariables = { ...defaults, ...variables };

	let result = env.renderString(content, mergedVariables);

	result = result
		.split("\n")
		.map((line) => line.trimEnd())
		.join("\n");
	result = result.replace(/\n\n\n+/g, "\n\n");
	result = result.trimEnd();

	return result;
}
