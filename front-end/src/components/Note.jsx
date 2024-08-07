import React, {useState, useEffect} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Fab, Zoom, Slide } from "@mui/material";


function Note(props) {
  const [noteEdit, setNoteEdit] = useState({
    new_title: props.title,
    new_content: props.content
  });
  const [edit, setEdit] = useState(false);
  const [visible, setVisible] = useState(true);



  useEffect(() => {
    if (edit) {
      handleEditSubmit();
    }
  }, [noteEdit]);

  //on delete animation
  const handleDelete = () => {
    setVisible(false);
    setTimeout(() => {
    props.onDelete(props.id);
    }, 500);
  };

  function handleEdit() {
    setEdit(!edit);
  }

  function handleEditSubmit() {
    props.onEdit({
      uid: props.id,
      title: noteEdit.new_title,
      content: noteEdit.new_content
    })
    handleEdit()
  }

  function handleChange(event) {
    const note_tag = event.target.closest(".note").querySelector("h1").getAttribute("id").split("_")[1] //This might be modified to better approach!!!
    const title_innerText = document.getElementById("h1" + "_" + note_tag).innerText;
    const content_innerText = document.getElementById("p" + "_" + note_tag).innerText;
    const title_edited = noteEdit.new_title !== title_innerText;
    const content_edited = noteEdit.new_content !== content_innerText;
    const new_data = {
      new_title: title_edited ? title_innerText : noteEdit.new_title,
      new_content: content_edited ? content_innerText : noteEdit.new_content
    };
    (JSON.stringify(new_data) === JSON.stringify(noteEdit)) ? handleEdit() : setNoteEdit(new_data)
  }

  

  return (
    <Slide direction="up" in={visible} mountOnEnter unmountOnExit>
    <div className="note">
      <h1
        id={"h1" + "_" + props.id}
        contentEditable={edit}
        suppressContentEditableWarning={true}
      >
        {noteEdit.new_title}
      </h1>
      <p
        id={"p" + "_" + props.id}
        contentEditable={edit}
        suppressContentEditableWarning={true}
      >
        {noteEdit.new_content}
      </p>
      <Zoom in={true}>
        <button onClick={handleDelete}><DeleteIcon /></button>
      </Zoom>
      {edit ? (
        <Zoom in={true}>
          <Fab
            color="success"
            id="whited"
            onClick={handleChange}
          >
            <ArrowUpwardIcon />
          </Fab>
        </Zoom>
      ) : (
        <button onClick={handleEdit}><EditIcon /></button>
      )}
    </div>
    </Slide>
  );
}

export default Note;
