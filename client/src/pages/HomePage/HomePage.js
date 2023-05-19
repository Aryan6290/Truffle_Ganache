import React, { useState,useEffect } from 'react'
import Web3 from "web3";
import SimpleStorage from "../../contracts/MusiChain.json";
var jsmediatags = require("jsmediatags");
class Song {
  name;
  price;
  owner;
};
export const HomePage = () => {
    const [artist,setArtist] = useState('');
    const [lyrics, setLyrics]= useState('');
    const [album, setAlbum] = useState('');
    const [title,setTitle] = useState('');
    const data = 20;
    const [state, setState] = useState({
      web3: null,
      contract: null,
    });
    
    const [songs,setSongs] = useState([])

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
        // const data = await contract.methods.getter().call();
        // setData(data);
      }
      contract && readData();
    }, [state]);

    async function writeData() {
      const { contract } = state;

     const data = 20;
    const weiAmount = Web3.utils.toWei(data.toString(), 'ether');
  
    await contract.methods.payRoyalty("0x4Ef7588Cf7B23Df4EaAB2bF496C83261779B9d7B").send({
      from: "0xe8114F2972b5669a4Aa24A93aD690252f0FD4982",
      value: weiAmount
    });
      // await contract.methods
      //   .setter(data)
      //   .send({ from: "0xaDBC45B40437195Ab4F58a137e3CA0ec8303158f" });
      window.location.reload();
    }

    const handleFileChange = async(event) => {
        const file = event.target.files[0];
        const { contract } = state;
        console.log("here it is", contract)
        jsmediatags.read(file, {
          onSuccess: async function (tag) {
            const { artist, album, lyrics,title } = tag.tags;

            setArtist(artist);
            setAlbum(album);
            setLyrics(lyrics);
            setTitle(file.name)
            console.log("okay")
            await contract.methods.addMusic(file.name,artist,2).send({from : "0x4Ef7588Cf7B23Df4EaAB2bF496C83261779B9d7B",  gas: 4700000,
            gasPrice: '2000000000'});
            console.log("okaye2")
            // let songs = await contract.methods.getMySongs().call()
            // console.log(songs)
           let songs2 = await contract.methods.getSongList().call()
           let newsongs =[]
            console.log(songs2.length)
            for(let i =0;i<songs2.length;i+=3){
              const song = new Song();
              song.name = songs2[i];
              song.price = songs2[i+1];
              song.owner = songs2[i+2];
              // console.log(song)
              newsongs.push(song)
             
            }
            console.log(newsongs)
            setSongs(newsongs)
            // console.log(songs)
          },
          onError: function (error) {
            console.log("Error:", error);
          },
        });
        

      };
  return (
    <div>
      <input type="file" accept="audio/mp3" onChange={handleFileChange} />
      <div>
        <p>Artist: {artist}</p>
        <p>Album: {album}</p>
        <p>Lyrics: {lyrics}</p>
        <button onClick={writeData} className="button button2">
          Change Data
        </button>

      <h2>Current songs</h2>
      {songs.map((item,index)=><li key={index}>{item.name}</li>)}
      </div>
    </div>
  )
}
