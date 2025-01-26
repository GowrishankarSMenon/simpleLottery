const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const lotteryPath = path.resolve(__dirname, 'contracts', 'lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf8');

const input = {
    language: 'Solidity',
    sources:{
        'lottery.sol':{
            content: source
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contract = output.contracts['lottery.sol'].Lottery;

console.log(JSON.stringify(contract.abi, null, 2));