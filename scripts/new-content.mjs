#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function usage() {
	return [
		'Usage:',
		'  npm run new:post -- <slug> [YYYY-MM-DD]',
		'  npm run new:project -- <slug> [YYYY-MM-DD]',
		'',
		'Examples:',
		'  npm run new:post -- kv-cache-notes 2026-01-11',
		'  npm run new:project -- fast-llm-server 2026-01-11',
	].join('\n');
}

function die(message) {
	process.stderr.write(`${message}\n`);
	process.exit(1);
}

function assertSlug(slug) {
	if (!slug || typeof slug !== 'string') die('Missing slug.\n\n' + usage());
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
		die(
			'Invalid slug. Use lowercase letters/numbers and hyphens only (e.g. my-new-post).\n\n' +
				usage(),
		);
	}
}

function todayIso() {
	return new Date().toISOString().slice(0, 10);
}

function normalizeDate(input) {
	if (!input) return todayIso();
	if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) die('Invalid date. Use YYYY-MM-DD.');
	const d = new Date(input);
	if (Number.isNaN(d.getTime())) die('Invalid date.');
	return input;
}

function readTemplate(templatePath) {
	try {
		return fs.readFileSync(templatePath, 'utf8');
	} catch {
		die(`Missing template: ${templatePath}`);
	}
}

function writeNewFile(outPath, content) {
	if (fs.existsSync(outPath)) die(`File already exists: ${outPath}`);
	fs.mkdirSync(path.dirname(outPath), { recursive: true });
	fs.writeFileSync(outPath, content, 'utf8');
}

const [, , kind, slug, dateArg] = process.argv;
if (kind !== 'post' && kind !== 'project') die(usage());
assertSlug(slug);
const date = normalizeDate(dateArg);

const repoRoot = process.cwd();
const dir = kind === 'post' ? 'src/content/posts' : 'src/content/projects';
const templateName = '_template.mdx';

const templatePath = path.join(repoRoot, dir, templateName);
const outPath = path.join(repoRoot, dir, `${slug}.mdx`);

let content = readTemplate(templatePath);
content = content.replace(/^pubDate:\s*.*$/m, `pubDate: ${date}`);
content = content.replace(/^date:\s*.*$/m, `date: ${date}`);
content = content.replace(/^title:\s*.*$/m, `title: "${slug.replace(/-/g, ' ')}"`);

writeNewFile(outPath, content);
process.stdout.write(`Created ${kind}: ${path.relative(repoRoot, outPath)}\n`);
