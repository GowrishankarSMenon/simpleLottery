// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Lottery{
    address public manager;
    address[] public players;
    mapping(address => uint) public contributions;

    constructor(){
        manager = msg.sender;
    }

    function getPlayers() public view returns(address[] memory){
        return players;
    }

    function enter() public payable {
        require(msg.value > 0.01 ether, "Minimum ETH required");
        require(contributions[msg.sender] == 0, "Already entered");

        players.push(msg.sender);
        contributions[msg.sender] = msg.value;
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, players)));
    }

    function getWinner() private view returns (address) {
        uint randomNumber = random() % players.length;
        return players[randomNumber];
    }

    function endLottery() public administrative{
        address winner = getWinner();
        payable (winner).transfer(address(this).balance);
        players = new address[](0);
        for (uint i = 0; i < players.length; i++) {
        contributions[players[i]] = 0;
    }
    }

    modifier administrative(){
        require(msg.sender == manager, "Not a manager");
        require(players.length > 0, "No players in the lottery");
        _;
    }

    function returnEntries() public administrative{
        for (uint i = 0; i<players.length; i++){
            address player = players[i];
            uint amount = contributions[player];

            if (amount>0){
                payable(player).transfer(amount);
                contributions[player] = 0;
            }
        }
    }

}