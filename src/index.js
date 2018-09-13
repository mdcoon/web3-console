#!/usr/bin/env node

import repl from 'repl';
import paraseArgs from 'minimist';
import chalk from 'chalk';
import Web3 from 'web3';
import Web3Method from 'web3-core-method';
import net from 'net';

let args = paraseArgs(process.argv.slice(2));
args = (args._ || []);

const arg = args[0];

let url = 'http://localhost:8545';

if (typeof arg === 'string') {
  url = arg;
} else if (typeof arg === 'number') {
  url = `http://localhost:${arg}`;
}

let ipcPath = null;
if(url.startsWith("ipc:")) {
  ipcPath = url.substring(4);
}

let provider = null;
if(ipcPath) {
  provider = new Web3.providers.IPCProvider(ipcPath, net);
} else {
  provider = new Web3.providers.HttpProvider(url);
}
const web3 =  new Web3(provider);

if(args.length > 1) {
  if(args[1] === 'parity') {
    let exensions = [
      new Web3Method({
        name: "allTransactions",
        call: "parity_allTransactions",
        params: 0
      })
    ];
    exensions.forEach(m=>{
      m.attachToObject(web3);
      m.setRequestManager(web3._requestManager);
    });
  }
}

function prettyInfo(name, value) {
  return `${chalk.dim(`${name}:`)} ${chalk.green(value)}`;
}

try {
  process.stdout.write(`
${prettyInfo('RPC Endpoint', url)}
${prettyInfo('Node Version', web3.version.node)}
${prettyInfo('Latest Block', web3.eth.blockNumber)}
${prettyInfo('Network ID #', web3.version.network)}

`);
  global.web3 = web3;
  repl.start({});
} catch (e) {
  process.stdout.write(`${chalk.red(`Error connecting to ${url}`)}\n${e}\n`);
}
