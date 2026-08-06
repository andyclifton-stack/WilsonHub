import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const read=name=>JSON.parse(fs.readFileSync(new URL(`../public/data/${name}.json`,import.meta.url),'utf8'))
test('public registration is masked',()=>{const text=JSON.stringify(read('vehicle'));assert.match(text,/GD26 •••/);assert.doesNotMatch(text,/\b[A-Z]{2}\d{2}\s?[A-Z]{3}\b/)})
test('known software is represented as factory delivery',()=>{const sw=read('software').find(x=>x.id==='software-2026-14-300');assert.equal(sw.current,true);assert.match(sw.summary,/Factory-delivery/)})
test('license spelling tolerance has searchable aliases',()=>{const issue=read('issues').find(x=>x.id==='issue-spotify-licence');assert.ok(issue.tags.includes('license'));assert.ok(issue.tags.includes('licence'))})
test('pending checks are not shown as confirmed',()=>{assert.equal(read('actions').filter(x=>x.status==='pending').length,3)})
