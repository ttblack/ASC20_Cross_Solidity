// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract CrossInscribe is OwnableUpgradeable {
    string constant public version = "v0.0.1";
    uint256 private _crossFee;

    struct ListOrder{
        address from;
        uint256 price;
        uint256 amt;
        uint256 expireTime;
        bytes32 avascriptionID;
    }
    mapping(address => ListOrder[]) internal _orders;
    // asc20 evens
    event avascriptions_protocol_CrossASC20Token(
            address from,
            string  to,
            string  ticker,
            uint256 amount
    );

    event avascriptions_protocol_TransferASC20TokenForListing(address indexed from, address indexed to, bytes32 id);

    event avascriptions_protocol_TransferASC20Token(address indexed from,address indexed to,string indexed ticker,uint256 amount);

    function init(uint256 fee) initializer public {
        __Ownable_init(msg.sender);
        _crossFee = fee;
    }

    function crossToBTC(string calldata toBtc, string calldata ticker, uint256 amt) public payable {
        require(msg.value >= _crossFee, "FeeToSmall");
        emit avascriptions_protocol_CrossASC20Token(address(this), toBtc, ticker, amt);
    }

    function transferTo(string calldata ticker, uint256 amt) public payable{
        require(msg.value >= _crossFee, "FeeToSmall");
        emit avascriptions_protocol_TransferASC20Token(msg.sender, address(this), ticker, amt);
    }

    function createOrder(uint256 price, uint256 amount, uint256 expiredate, bytes32 avascribeID) public {
        ListOrder[] storage list = _orders[msg.sender];
        for (uint i = 0; i < list.length; i++) {
            if (list[i].avascriptionID == avascribeID) {
                revert("duplicate avascribeID");
            }
        }

        ListOrder memory order;
        order.avascriptionID = avascribeID;
        order.from = msg.sender;
        order.amt = amount;
        order.expireTime = expiredate;
        order.price = price;
        list.push(order);
    }

    function buyOrder(address to, bytes32 avascribeID) public payable {
        ListOrder[] storage list = _orders[msg.sender];
        for (uint i = 0; i < list.length; i++) {
            if (list[i].avascriptionID == avascribeID) {
                require(list[i].price <= msg.value, "smallPrice");
                emit avascriptions_protocol_TransferASC20TokenForListing(address(this), to, avascribeID);
                delete list[i];
                deleteOrders(msg.sender, i);
                break;
            }
        }
    }

    function deleteOrders(address sender, uint256 deleteIndex) private {
        ListOrder[] storage list = _orders[sender];
        require(deleteIndex < list.length, "deleteIndexError");
        for (uint i = 0; i < list.length - 1; i++) {
           if (i >= deleteIndex) {
               list[i] = list[i+1];
           }
        }
       list.pop();
        _orders[sender] = list;
    }

    function getOrders() public view returns(ListOrder[] memory)  {
        ListOrder[] memory list = _orders[msg.sender];
        return list;
    }

    fallback() external payable {}

    receive() external payable{}

    function transfer(address payable to, uint256 amt) external onlyOwner {
        require(to != address(0), "error to");
        require(amt > 0, "error amt");
        require(address(this).balance >= amt, "balance not enough");
        (bool success, ) = to.call{value: amt}(new bytes(0));
        require(success, "transferFailed");
    }
}
