pragma solidity ^0.8.18;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
contract MusiChain{
  uint idxz = 0;
   Music[] public songs;
   mapping(bytes32 => Music) songInfo;
   mapping(address => User) userInfo;

   event registerEvent(bytes32 songID);
   event licenseEvent(bytes32 songID, address authorized);
   event LogMusicID(bytes32 id);



   struct Music {
    bool registered;
    bytes32 ID;
    string name;
    string fileURL1;
    uint price;
    string usertype;
    address owner;
    address[] licenseHoldersList;
    address[] shareholders;
    mapping(address => bool) licenseHolders;
  }


    struct User{
      string name;
      string password;
      bool registered;
      bytes32[] purchasedSongs;
      string[] uploadedSongs;
    }

  function registerUser(string memory name, string memory password,address ad) public returns (bool) {
    userInfo[ad].registered = true;
    userInfo[ad].name = name;
    userInfo[ad].password = password;
    return userInfo[ad].registered;
  }

  function loginUser(string memory name, string memory password, address ad){
    require(userInfo[ad].registered == false, "User not registered")
    require(userInfo[ad].password != password, "Password is wrong")
    return true;
  }
  function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
  function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

  function toAsciiString(address x) internal pure returns (string memory) {
    bytes memory s = new bytes(40);
    for (uint i = 0; i < 20; i++) {
        bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
        bytes1 hi = bytes1(uint8(b) / 16);
        bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
        s[2*i] = char(hi);
        s[2*i+1] = char(lo);            
    }
    return string(s);
}

function char(bytes1 b) internal pure returns (bytes1 c) {
    if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
    else return bytes1(uint8(b) + 0x57);
}


  function buyLicense(bytes32 songID, address ad) public payable {
    uint price = songInfo[songID].price;
    require(msg.value >= price,"Amount sent is less than required amount for the song");
    userInfo[ad].purchasedSongs.push(songID);

    songInfo[songID].licenseHolders[msg.sender] = true;
    songInfo[songID].licenseHoldersList.push(msg.sender);
    // pay the coopyright holder
    payRoyalty(songID, msg.value);

    emit licenseEvent(songID, msg.sender);
  }


  function payRoyalty(bytes32 songID, uint amount) private {
    address owner = songInfo[songID].owner;
    for(uint i = 0; i < songInfo[songID].shareholders.length; i++){
    payable(songInfo[songID].shareholders[i]).transfer(amount/songInfo[songID].shareholders.length);
    }
    
  }


  function addMusic(string memory name, string  memory URL1,uint price, address[] memory sh, string memory isrc) public {
    bool found = false;
    bytes32 songID = keccak256(abi.encodePacked(isrc));
    for(uint i=0;i<songs.length;i++){
      if(songs[i].ID == songID){
        found = true;
      }
    }
    require(found == false,"Song already present");
    songInfo[songID].owner = msg.sender;
    songInfo[songID].registered = true;
    songInfo[songID].ID = songID;
    songInfo[songID].name = name;
    songInfo[songID].price = price;
    songInfo[songID].shareholders = sh;
    songInfo[songID].fileURL1 = URL1;
    userInfo[msg.sender].uploadedSongs.push(name);
    uint256 idx = idxz;
    idxz+=1;
    songs.push();
    Music storage d = songs[idx];
    d.name = songInfo[songID].name;
    d.owner = songInfo[songID].owner;
    d.ID =songInfo[songID].ID;
    d.price = songInfo[songID].price;
    d.fileURL1 = songInfo[songID].fileURL1;
    d. shareholders = songInfo[songID].shareholders;
    emit registerEvent(songID);
  }

  function getSongList() public view returns (string[] memory) {
    string[] memory response = new string[](songs.length*4 +1 );
    uint idx = 0;
    for (uint i = 0; i < songs.length; i++) {
      Music storage song = songs[i];
      response[idx]= song.name;
      response[idx+1]= uint2str(song.price);
      response[idx+2]= toAsciiString(song.owner);
      response[idx+3]=  Strings.toHexString(uint256(song.ID), 32);

      idx+=4;

    }

    return response;
  }

  function getPurchasedList(address ad) public view returns (bytes32[] memory){
    return userInfo[ad].purchasedSongs;
  }
  function getMySongs() public view returns (string[] memory){
    return userInfo[msg.sender].uploadedSongs;
  }
  function ifUserRegistered(address ad) public view returns (bool){
    return userInfo[ad].registered;
  }
}
