import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';import path from 'node:path';
if(!process.argv[2])throw Error('explicit candidate file required');
const mod=await import(pathToFileURL(path.resolve(process.argv[2])).href);
assert.equal(mod.clamp(8,0,5),5); assert.equal(mod.clamp(-1,0,5),0); assert.equal(mod.clamp(3,0,5),3); assert.throws(()=>mod.clamp(1,5,0));
console.log('code acceptance passed');
