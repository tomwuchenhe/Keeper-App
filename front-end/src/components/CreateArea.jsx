import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { Zoom } from "@mui/material";

function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: ""
  });

  const [showNote, setShow] = useState(false)


  function handleChange(event) {
    const { name, value } = event.target;

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function submitNote() {
    props.onAdd(note);
    setNote({
      title: "",
      content: ""
    });
    setShow(false)
  }

  return (
    <div>
      <form className="create-note">
          {showNote && <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />}
          <textarea
            name="content"
            onChange={handleChange}
            value={note.content}
            placeholder="Take a note..."
            rows={showNote ? "3" : "1"}
            onClick={() => setShow(true)}
          />
          {showNote &&  <Zoom in={true}>
            <Fab onClick={submitNote}><AddIcon /></Fab>
          </Zoom> }
      </form>
  </div>
  );
}

export default CreateArea;
