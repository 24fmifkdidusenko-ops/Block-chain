// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract HelloWorld {
    string public greet = "Hi";

    function setGreet(string memory _newGreet) public {
        greet = _newGreet;
    }
}
