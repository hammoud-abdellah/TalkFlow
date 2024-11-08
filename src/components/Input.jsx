import React, { useContext, useState } from 'react'
import Img from "../img/img.png"
import Attach from "../img/attach.png"
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

const Input = () => {

  const [text, setText]= useState("");
  const [img, setImg] = useState(null);

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);

  const handleSend = async() => {
    // try{
      if(img) {

        const formData = new FormData();
        formData.append('file', img);
        formData.append('upload_preset', 'talkflow_preset');

        const uploadResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/dibhdau39/image/upload`,
          formData
        );

        const downloadURL = uploadResponse.data.secure_url;

        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            img: downloadURL,
          })
        });
      
      } else {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          })
        });
      }

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text
        },
        [data.chatId + ".date"]: serverTimestamp(),
      })

      setText("")
      setImg(null)

    // } catch(error) {
    //   console.log(error);
    // }
  }

  return (
    <div className='input'>
      <input 
        type="text" 
        placeholder='Type something ....'
        onChange={e=>setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input 
          type="file" 
          style={{display: "none"}} id="file"
          onChange={e=>setImg(e.target.files[0])}
        />
        <label htmlFor="file" >
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>

    </div>
  )
}

export default Input