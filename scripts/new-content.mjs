#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function usage() {
  return [
    'Usage:',
    '  npm run new:post <slug>',
    '  npm run new:project <slug>',
    '',
    'Examples:',
    '  npm run new:post kv-cache-notes',
    '  npm run new:project fast-llm-server',
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

function normalizeDate(_input) {
  return todayIso();
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

const [, , kind, ...restArgs] = process.argv;
if (kind !== 'post' && kind !== 'project') die(usage());

const args = restArgs;
const [slug] = args;

assertSlug(slug);
const date = normalizeDate();

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
