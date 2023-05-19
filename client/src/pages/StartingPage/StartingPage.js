import React, { useState } from 'react'
var jsmediatags = require("jsmediatags");
export const StartingPage = () => {
    const [artist,setArtist] = useState('');
    const [lyrics, setLyrics]= useState('');
    const [album, setAlbum] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
    
        jsmediatags.read(file, {
          onSuccess: function (tag) {
            const { artist, album, lyrics } = tag.tags;
            setArtist(artist);
            setAlbum(album);
            setLyrics(lyrics);
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
      </div>
    </div>
  )
}
