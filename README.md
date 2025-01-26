# 🎲 Ethereum Lottery Dapp

## 📝 Project Overview

A decentralized lottery application built on Ethereum, allowing users to enter a lottery by sending ETH and providing a transparent, fair winner selection mechanism.

## 🌟 Features

- Decentralized lottery system
- Minimum entry threshold
- Random winner selection
- Manager-controlled lottery termination
- Entry refund functionality

## 🏗️ Project Structure

### Branches

#### `contracts`
- Smart contract development
- Solidity implementation (`lottery.sol`)
- Deployment scripts (`deploy.js`)
- Compilation script (`compile.js`)
- Unit testing with Mocha

#### `frontend`
- React-based user interface
- Web3.js integration
- Metamask wallet connection
- State management for lottery interactions

## 💻 Technologies Used

- Solidity (Smart Contract)
- React
- Web3.js
- Ganache
- Truffle HDWallet Provider
- Mocha (Testing)

## 🚀 Deployment Details

### Smart Contract
- **Network**: Sepolia Testnet
- **Deployment Method**: Manual deployment via `node deploy.js`
- **Etherscan**: [View Contract on Sepolia Etherscan](https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS)

## 📦 Installation

### Contracts Setup
```bash
cd contracts
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

## 🧪 Testing

### Smart Contract Tests
```bash
npm test
```

## 🔧 Configuration

### Environment Variables
Create `.env` files in both `contracts` and `frontend` directories:

#### Contracts `.env`
```
MNEMONIC=your_wallet_seed_phrase
INFURA_URL=https://sepolia.infura.io/v3/your_project_id
```

#### Frontend `.env`
```
REACT_APP_CONTRACT_ADDRESS=deployed_contract_address
```

## 📄 Smart Contract Functions

- `enter()`: Participate in lottery (min 0.01 ETH)
- `endLottery()`: Select and reward winner
- `returnEntries()`: Refund participants
- `getPlayers()`: View current participants

## 🔒 Security Features

- Minimum entry threshold (0.01 ETH)
- Manager-only winner selection
- Prevents multiple entries from same address
- Transparent random winner selection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## 📜 License

MIT License
