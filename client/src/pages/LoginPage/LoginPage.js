import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {initialiseContract} from '../../utils/music'
import Web3 from "web3";
import { addUsers } from '../../utils/mongo';
var jsmediatags = require("jsmediatags");
class Song {
    id;
    name;
    price;
    owner;
  };
export const LoginPage = (props) => {
    const { state } = props;
    const [userName, setUserName] = useState('');
    const [userId, setUserID] = useState('');
    const [password, setPassword] = useState(''); ;
    const [isLogin, setIsLogin] = useState(false)
    const [artist,setArtist] = useState('');
    const [lyrics, setLyrics]= useState('');
    const [album, setAlbum] = useState('');
    const [title,setTitle] = useState('');
    const [accounts, setAccounts] = useState([])
    const [price, setPrice] = useState(0);
    const [purchasedSongs, setPurchasedSongs]= useState([])
    const [uploadeSongs, setUploadedSongs]= useState([])
    const [file, setFile] = useState('')
    const [composer, setComposer] = useState('');
    const [lyricist, setLyricist] = useState('');
    const [isrc, setIsrc] = useState('')

    const handleLyricistChange =(e)=>{
      setLyricist(e.target.value)
    }
    const handleComposerChange =(e)=>{
      setComposer(e.target.value)
    }
    const importacc = async()=>{
      const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
      const web3 = new Web3(provider);
      const d = await web3.eth.getAccounts()
      const accounts = addUsers(d)
      console.log(accounts)
      setAccounts(accounts)

    }
    const [songs,setSongs] = useState([])
    useEffect(() => {
      importacc()
    }, [])
    

    const buySong = async(index)=>{
      const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
      const web3 = new Web3(provider);
        const contract = (props.props.contract)
      const id = songs[index].id;

      


      console.log(songs[index].id,songs[index].price)
      const weiAmount = Web3.utils.toWei(songs[index].price.toString(), 'ether');
      await contract.methods.buyLicense(id,Web3.utils.toChecksumAddress(userId)).send({
        from: Web3.utils.toChecksumAddress(userId),
        value: weiAmount,
        gas: 4700000,
        gasPrice: '2000000000'



        
      });
      const songs2 =await contract.methods.getPurchasedList(Web3.utils.toChecksumAddress(userId)).call()
      const newsongs  = songs.filter(obj => songs2.some(obj2 => obj.id === obj2))
      console.log("dekho",newsongs)
      setPurchasedSongs(newsongs)
    //   let newsongs =[]
    //         console.log(songs2.length)
    //         for(let i =0;i<songs2.length -1;i+=4){
    //           const song = new Song();
    //           song.name = songs2[i];
    //           song.price = songs2[i+1];
    //           song.owner = songs2[i+2];
    //           song.id = songs2[i+3];
    //           console.log("YEH RHA",song)
    //           newsongs.push(song)
             
    //         }
    //         console.log(newsongs)
    //         setPurchasedSongs(newsongs)

    }
    const uploadSong = async()=>{
      const contract = (props.props.contract)
      const addressArray = []
      addressArray.push(Web3.utils.toChecksumAddress(userId))
      if(lyricist!==''){
        addressArray.push(Web3.utils.toChecksumAddress(lyricist))
      }
      if(composer!==''){
        addressArray.push(Web3.utils.toChecksumAddress(composer))
      }

            await contract.methods.addMusic(file.name,artist,price,addressArray, isrc).send({from : Web3.utils.toChecksumAddress(userId),  gas: 4700000,
            gasPrice: '2000000000'});
            console.log("okaye2")
            // let songs = await contract.methods.getMySongs().call()
            // console.log(songs)
           let songs2 = await contract.methods.getSongList().call()
           let newsongs =[]
            console.log(songs2.length)
            for(let i =0;i<songs2.length -1;i+=4){
              const song = new Song();
              song.name = songs2[i];
              song.price = songs2[i+1];
              song.owner = songs2[i+2];
              song.id = songs2[i+3];
              console.log("YEH RHA",song)
              newsongs.push(song)
             
            }
            console.log(newsongs)
            setSongs(newsongs)
    }
    const playSong = ()=>{
        const fileURL = URL.createObjectURL(file);
        const audio = new Audio(fileURL);
        audio.play();
    }
    const handleFileChange = async(event) => {

        const file = event.target.files[0];
        setFile(file)
      //   console.log("herse it is", contract)
      //   const results = await acoustid(file);
      //   const fingerprint = results[0].id;
      //  console.log('Fingerprint:', fingerprint);
      // const fp = generateAudioFingerprint(file)
      // console.log(fp)
      var reader = new FileReader();

      reader.onload = function(e) {
        var audio = new Audio();
        audio.src = e.target.result;

        audio.addEventListener('loadedmetadata', function() {
          var duration = audio.duration.toFixed(2);
          var filesize = file.size;
          var bitrate = ((filesize * 8) / (duration * 1024)).toFixed(2);


          // Retrieve ISRC if available
          var isrc = audio.seekable.end(0);
          console.log(duration, filesize, bitrate, isrc)
          setIsrc(isrc)
        });
      };

      reader.readAsDataURL(file);
        

      };
    

    const regsiterClick = async(e)=>{
        e.preventDefault();
        const contract = (props.props.contract)
        if(!accounts.some(obj => obj.id === userId)){
            console.log("account not present");
            return ;
        }
        const loginSuccessful = await contract.methods.registerUser(userName,password,Web3.utils.toChecksumAddress(userId)).call();
        console.log(loginSuccessful);
        const regUsers = await contract.methods.ifUserRegistered(Web3.utils.toChecksumAddress(userId)).call()
        console.log(regUsers)
        setIsLogin(true)
        let songs2 = await contract.methods.getSongList().call()
           let newsongs =[]
            console.log(songs2.length)
            for(let i =0;i<songs2.length -1;i+=4){
              const song = new Song();
              song.name = songs2[i];
              song.price = songs2[i+1];
              song.owner = songs2[i+2];
              song.id = songs2[i+3];
              console.log("YEH RHA",song)
              newsongs.push(song)
             
            }
            console.log(newsongs)
            setSongs(newsongs)
    }
    return (
        isLogin? <div>
          <div style={{position: 'absolute', top:'10px', right: '20px',flexDirection:'column'}}>
            <h3>{accounts.find(obj => obj.id === userId).name}</h3>
            <h4 style={{fontSize:'12px', marginTop:'5px'}}>{userId}</h4>
          </div>
        <div>
        <input type="file" accept="audio/mp3" onChange={handleFileChange} />
        <br/>
        <label>
        Price :
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        </label>
        <br/>
        <label>Lyricist :

        <select value={lyricist} onChange={handleLyricistChange}>
        <option value="">Select an option</option>
          {accounts.map((item,index)=><option value={item.id}>{item.name}</option> )}
        </select>
        </label>
        <br/>
        <label>Composer :

        <select value={composer} onChange={handleComposerChange}>
        <option value="">Select an option</option>
          {accounts.map((item,index)=><option value={item.id}>{item.name}</option> )}
        </select>
        </label>
        <br/>
        <button onClick={uploadSong}>Add song</button>
        
        </div>
        <div>
          {/* <p>Artist: {artist}</p>
          <p>Album: {album}</p>
          <p>Lyrics: {lyrics}</p> */}
  
        <h2>Current songs</h2>
        {songs ===0 ? <h1>No songs yet</h1> : null}
        {songs.map((item,index)=><div class="songItem">
                          <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/artistic-album-cover-design-template-d12ef0296af80b58363dc0deef077ecc_screen.jpg?ts=1561488440" alt="1"/>
                          <div style={{flexDirection :'column'}}>                         
                           <span class="songName">{item.name}</span>
                            <h4 style={{color:'#a9a9a9', fontSize : '12px'}}>{item.price} ether -- {accounts.find(obj => obj.id === userId).name} </h4>
                            </div>
                            
                          <span class="songlistplay"><button class="button" onClick={()=>buySong(index)}>Buy</button></span>
                  </div>)}
                  <br/>
                  <h2>Purchased songs</h2>
                  {purchasedSongs.length ===0 ? <h2 style={{color : 'white', textColor : '#fff',marginTop: 30}}>No purchased songs yet</h2> : null}
        {purchasedSongs.map((item,index)=><div class="songItem">
                          <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/artistic-album-cover-design-template-d12ef0296af80b58363dc0deef077ecc_screen.jpg?ts=1561488440" alt="1"/>
                          <span class="songName">{item.name}</span>
                          <span class="songlistplay"><button class="button" onClick={()=>{
                                playSong()
                          }}>Play</button></span>
                  </div>)}
        </div>
      </div> : <div>
           
        <h3>MusiChain - A Blockchain Based Music Ledger</h3>
        <form onSubmit={regsiterClick}>
        <h2>Register</h2>
        <div class="mainContainer">
        <label for="username">Your username</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

<br></br>
<label for="username">Your userid</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserID(e.target.value)}
        />
        <br/>
<label for="pswrd">Your password</label>
<br></br>
<input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
<br/>
<button type="submit">Login</button>


          

      </div> </form>
        <div style={{marginTop:50, flexDirection:'column'}}>
          {accounts.map((item,index)=> <div>

            <h3 style={{textColor:'#000'}}>{item.name}</h3>
            <h3 style={{color:'#fff'}}>{item.id}</h3>
          </div>)}
        </div>
      </div>
      )

}