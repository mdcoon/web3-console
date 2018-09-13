#!/usr/bin/env node
'use strict';

var _repl = require('repl');

var _repl2 = _interopRequireDefault(_repl);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _web3CoreMethod = require('web3-core-method');

var _web3CoreMethod2 = _interopRequireDefault(_web3CoreMethod);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = (0, _minimist2.default)(process.argv.slice(2));
args = args._ || [];

var arg = args[0];

var url = 'http://localhost:8545';

if (typeof arg === 'string') {
  url = arg;
} else if (typeof arg === 'number') {
  url = 'http://localhost:' + arg;
}

var ipcPath = null;
if (url.startsWith("ipc:")) {
  ipcPath = url.substring(4);
}

var provider = null;
if (ipcPath) {
  provider = new _web2.default.providers.IPCProvider(ipcPath);
} else {
  provider = new _web2.default.providers.HttpProvider(url);
}
var web3 = new _web2.default(provider);

if (args.length > 1) {
  if (args[1] === 'parity') {
    var exensions = [new _web3CoreMethod2.default({
      name: "allTransactions",
      call: "parity_allTransactions",
      params: 0
    })];
    exensions.forEach(function (m) {
      m.attachToObject(web3);
      m.setRequestManager(web3._requestManager);
    });
  }
}

function prettyInfo(name, value) {
  return _chalk2.default.dim(name + ':') + ' ' + _chalk2.default.green(value);
}

try {
  process.stdout.write('\n' + prettyInfo('RPC Endpoint', url) + '\n' + prettyInfo('Node Version', web3.version.node) + '\n' + prettyInfo('Latest Block', web3.eth.blockNumber) + '\n' + prettyInfo('Network ID #', web3.version.network) + '\n\n');
  global.web3 = web3;
  _repl2.default.start({});
} catch (e) {
  process.stdout.write(_chalk2.default.red('Error connecting to ' + url) + '\n' + e + '\n');
}