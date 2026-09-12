import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';import path from 'node:path';
if(!process.argv[2])throw Error('explicit candidate file required');
const mod=await import(pathToFileURL(path.resolve(process.argv[2])).href);
assert.equal(mod.sum([2,3]),5); assert.equal(mod.sum([]),0); assert.equal(mod.sum([7]),7); assert.equal(mod.sum([-1,2,0]),1);
console.log('code acceptance passed');
