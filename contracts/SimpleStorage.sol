// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract SimpleStorage {
    uint256 a;

    function payableFunction(address payable to) external payable {
        require(msg.value > 0, "Amount must be greater than zero");
        to.transfer(msg.value);
    }


    function setter(uint256 _a) public {
        a = _a;
    }

    function getter() public view returns (uint256) {
        return a;
    }
}