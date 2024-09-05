import React from "react";
import "../../public/confirm.css"
import Button from '@mui/material/Button';
import axios from "axios";


function Confirmation(props) {
    console.log(props.detail)
    async function successLinking() {
        try {
            await axios.post("/api/link-user")
        } catch (err) {
            console.log(err)
        }
    }

    

    return (
        <div className="center">
            <div className="button-accept">
            <Button variant="contained" color="success" onClick={() => successLinking()}>
                Accept
            </Button>
            </div>
            <div className="button-decline">
          <Button variant="outlined" color="error" onClick={() => 
            alert("Refused")
          }>
            Decline
          </Button>
          </div>
        </div>
      );
}

export default Confirmation;