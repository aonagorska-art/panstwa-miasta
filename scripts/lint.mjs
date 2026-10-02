import { readdir, readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

const files = []
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) await walk(path)
    else if (['.ts', '.tsx'].includes(extname(path))) files.push(path)
  }
}
await walk('src')
const problems = []
for (const file of files) {
  const text = await readFile(file, 'utf8')
  if (/\bany\b/.test(text)) problems.push(`${file}: niedozwolony typ any`)
  if (/console\.(log|debug)\(/.test(text)) problems.push(`${file}: pozostawiony console.log/debug`)
}
if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log(`Lint: OK (${files.length} plików TypeScript)`)
