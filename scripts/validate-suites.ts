// Vérifie toutes les suites de src/bench/suites/ sans lancer l'app : yarn validate
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { validateSuite } from '../src/bench/suites/validate.ts'

const root = path.resolve(import.meta.dirname, '../src/bench/suites')
const folders = (await readdir(root, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name)

let failed = 0
for (const folder of folders) {
  let errors: string[]
  let cases = 0
  try {
    const { suite } = await import(pathToFileURL(path.join(root, folder, 'suite.ts')).href)
    errors = validateSuite(suite, folder)
    cases = suite?.cases?.length ?? 0
  } catch (e) {
    errors = [`${folder}: cannot load suite.ts — ${(e as Error).message}`]
  }
  if (errors.length) {
    failed++
    console.error(`✗ ${folder}\n${errors.map((e) => `  ${e}`).join('\n')}`)
  } else {
    console.log(`✓ ${folder} (${cases} cases)`)
  }
}
if (!folders.length) console.error('No suite found in src/bench/suites/.')
process.exit(failed || !folders.length ? 1 : 0)
