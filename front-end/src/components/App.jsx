import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios"
import { useNavigate } from "react-router-dom";



function App() {


  async function verifyUser(nav, set) {
    try {
       await axios.get("/api/verify")
       set(false)
    } catch {
      nav("/")
    }
  }

  async function getUser() {
    try {
      const response = await axios.get("/api/verify")
      return response.data.user
    } catch (err) {
      console.log(err)
    }
  }


  const [notes, setNotes] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(false); 
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const nav = useNavigate()

  //initialization
  useEffect(() => {
    async function loading() {
      const [temp, val] = await Promise.all([
        verifyUser(nav, setLoading),  
        getUser(),        
      ])
      setUser(val)
    }
    loading()
  },[])
  


  async function getNote() {
    try {
      const response = await axios.get(`/api/show-data/${user}`)
      setNotes(response.data)
    } catch (err) {
      console.log("ERROR FOR", err)
    }
  }

  async function deleteNote(id) {
    try {
      await axios.delete(`/api/delete-data/${id}`)
      setUpdateTrigger(!updateTrigger)
    } catch (err) {
      console.log("ERROR FOR", err)
    }
  }

  async function editNote(note) {
    try {
      await axios.patch("/api/edit-data/note/", note)
      setUpdateTrigger(!updateTrigger)
    } catch (err) {
      console.log("ERROR FOR", err)
    }
  }

  async function insertNote(note) {
    try {
      console.log(user)
      await axios.post(`/api/post-data/note/${user}`, note)
      setUpdateTrigger(!updateTrigger)
    } catch (err) {
      console.log("ERROR FOR", err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (user)
        await getNote()
          
    };
    fetchData();
  }, [updateTrigger, user]);

//{acceptLinkAwait ? <Confirmation detail={user}/> : <BasicSelect addU = {postLinkedUser} curU = {user}/>}
  return (
    !loading &&
    <div>
      <Header />
      <CreateArea onAdd={insertNote} />
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={noteItem.nid}
            id={noteItem.nid}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
            onEdit={editNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
