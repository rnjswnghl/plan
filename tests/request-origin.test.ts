import {test} from 'node:test';
import assert from 'node:assert/strict';
import {allowedOrigin} from '../lib/request-origin';
test('browser origin uses public Host even when Next internal URL differs',()=>{assert.equal(allowedOrigin('http://127.0.0.1:3001','127.0.0.1:3001','http://localhost:3001/api/state'),true);assert.equal(allowedOrigin('https://evil.example','127.0.0.1:3001','http://localhost:3001/api/state'),false);assert.equal(allowedOrigin('null','127.0.0.1:3001','http://localhost:3001/api/state'),false);assert.equal(allowedOrigin(null,'127.0.0.1:3001','http://localhost:3001/api/state'),true);});
