import { useState, useEffect } from "react";
import SimpleStorage from "./contracts/SimpleStorage.json";
import Web3 from "web3";
import "./App.css";

function App() {
  const [state, setState] = useState({
    web3: null,
    contract: null,
  });
  const [data, setData] = useState("nill");
  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");

    async function template() {
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorage.networks[networkId];
      const contract = new web3.eth.Contract(
        SimpleStorage.abi,
        deployedNetwork.address
      );
      console.log(contract);
      setState({ web3: web3, contract: contract });
    }
    provider && template();
  }, []);
  useEffect(() => {
    const { contract } = state;
    async function readData() {
      const data = await contract.methods.getter().call();
      setData(data);
    }
    contract && readData();
  }, [state]);
  async function writeData() {
    const { contract } = state;
    const data = document.querySelector("#value").value;

  const weiAmount = Web3.utils.toWei(data.toString(), 'ether');

  await contract.methods.payableFunction("0xF40213b3772064772A1a70e0B62D0f93f85F82F0").send({
    from: "0x9f96cAd3ce7fA931f0A005c88cA0A179E4edA21E",
    value: weiAmount
  });
    // await contract.methods
    //   .setter(data)
    //   .send({ from: "0xaDBC45B40437195Ab4F58a137e3CA0ec8303158f" });
    window.location.reload();
  }
  return (
    <>
      <h1>Welcome to Dapp</h1>
      <div className="App">
        <p className="text">Contract Data : {data}</p>
        <div>
          <input type="text" id="value" required="required"></input>
        </div>

        <button onClick={writeData} className="button button2">
          Change Data
        </button>
      </div>
    </>
  );
}

export default App;