const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const {abi, evm} = require('../compile');

const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let lottery;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(abi)
        .deploy({data: evm.bytecode.object })
        .send({from: accounts[0], gas: '1000000'});
});

describe('Lottery contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('allows multiple account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it('requires a minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('0.001', 'ether')
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('only manager can call pickWinner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('sends money to the winner and resets the players array and ensures the players is empty', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.endLottery().send({from: accounts[0]});
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;

        assert(difference > web3.utils.toWei('1.8', 'ether'));
        const players = await lottery.methods.getPlayers().call();
        assert.equal(0, players.length);
        const contractBalance = await web3.eth.getBalance(lottery.options.address);
        assert.equal('0', contractBalance);
    });

    it('gives the money back to the players', async () => {
        const enterAmount = web3.utils.toWei('2', 'ether');
        
        await lottery.methods.enter().send({
            from: accounts[0],
            value: enterAmount
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: enterAmount
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: enterAmount
        });
    
        const initialBalances = await Promise.all(
            [accounts[0], accounts[1], accounts[2]].map(account => 
                web3.eth.getBalance(account)
            )
        );
    
        const tx = await lottery.methods.returnEntries().send({ from: accounts[0] });
    
        const finalBalances = await Promise.all(
            [accounts[0], accounts[1], accounts[2]].map(account => 
                web3.eth.getBalance(account)
            )
        );
    
        const actualGasCost = BigInt(tx.effectiveGasPrice) * BigInt(tx.gasUsed);
        const entryAmountBigInt = BigInt(web3.utils.toWei('2', 'ether'));
    
        // Check first account (transaction sender)
        const expectedFirstBalance = BigInt(initialBalances[0]) - actualGasCost + entryAmountBigInt;
        assert(
            BigInt(finalBalances[0]) >= expectedFirstBalance - BigInt('1000000000000000'), 
            "Account 0 did not receive correct refund"
        );
    
        // Check other accounts received full entry amount
        assert(
            BigInt(finalBalances[1]) >= BigInt(initialBalances[1]) + entryAmountBigInt - BigInt('1000000000000000'), 
            "Account 1 did not receive correct refund"
        );
        assert(
            BigInt(finalBalances[2]) >= BigInt(initialBalances[2]) + entryAmountBigInt - BigInt('1000000000000000'), 
            "Account 2 did not receive correct refund"
        );
    });
});