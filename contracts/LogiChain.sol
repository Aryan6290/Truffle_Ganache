pragma solidity ^0.8.18;
contract LogiChain{
    uint ag_idx = 0;
    uint od_idx = 0;
    Agency[] agencies;
    Order[] orders;

     struct User{
      string name;
      bool usertype; // 0 = client, 1 = agent
      string password;
      bool registered;
      bytes32[] orders;
    }
    struct Order{
        address client;
        address agent;
        bytes32 id;
        string from;
        string to;
        string status;
        uint price;
    }

    struct Agency{
        bytes32 id;
        address agent;
        uint price;
    }
        mapping(bytes32 => Agency) agencyInfo;
       mapping(address => User) userInfo;
       mapping(bytes32 => Order) orderInfo;


function registerUser(string memory name, string memory password,address ad, bool usertype, uint price) public returns (bool) {
    userInfo[ad].registered = true;
    userInfo[ad].name = name;
    userInfo[ad].password = password;
    userInfo[ad].usertype = usertype;
    if(usertype ==true){
        createAgency(price,ad);
    }
    return true;
  }


function createAgency(uint price, address agent ) public{
    bytes32 agentId = keccak256(abi.encodePacked(agent));
    agencyInfo[agentId].id = agentId;
    agencyInfo[agentId].agent = agent;
    agencyInfo[agentId].price = price;
     uint256 idx = ag_idx;
    ag_idx+=1;
    agencies.push();
    Agency storage d = agencies[idx];
    d.id = agencyInfo[agentId].id;
    d.price = agencyInfo[agentId].price;
    d.agent = agencyInfo[agentId].agent;
}
  function loginUser(string memory name, string memory password, address ad) public view returns (bool){
    require(userInfo[ad].registered == false, "User not registered");
    require(keccak256(abi.encodePacked(userInfo[ad].name)) != keccak256(abi.encodePacked(name)), "name is wrong");
    require(keccak256(abi.encodePacked(userInfo[ad].password)) != keccak256(abi.encodePacked(password)), "Password is wrong");
    return true;
  }

  function addOrder (string memory from, string memory to, address client,bytes32 agentid) public payable{
        uint price = agencyInfo[agentid].price;
        require(msg.value >= price,"Amount sent is less than required amount for the order");
        bytes32 id =keccak256(abi.encodePacked(client, from, to,agentid));
        orderInfo[id].from = from;
        orderInfo[id].to = to;
        orderInfo[id].id = id;
        orderInfo[id].client = client;
        orderInfo[id].price = price;
        orderInfo[id].status = "Initialised"
        orderInfo[id].agent = agencyInfo[agentid].agent;
        userInfo[client].orders.push(id);
         uint256 idx = od_idx;
          od_idx+=1;
          orders.push();
          Order storage d = orders[idx];
          d.id = orderInfo[id].id;
          d.from = orderInfo[id].from;
          d.to = orderInfo[id].to;
          d.client = orderInfo[id].client;
          d.agent = orderInfo[id].agent;
          
        payable(client).transfer(price);

  }
  function updateOrder(address agent, bytes32 orderId, string memory status) public {
    require(agent == orderInfo[orderId].agent, "Only the agent of this order can edit it");
    orderInfo[orderId].status = status;
  }

  function getAllOrders() public view {
    string[] memory response = new string[](orders.length*5 +1 );
    uint idx = 0;
    for (uint i = 0; i < songs.length; i++) {
      Order storage order = orders[i];
      response[idx]= order.from;
      response[idx+1]= uint2str(order.price);
      response[idx+2]= toAsciiString(order.agent);
      response[idx+3]=  Strings.toHexString(uint256(order.ID), 32);
      response[idx+4]= order.to;

      idx+=5;

    }

    return response;

  }


}