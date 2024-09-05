import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import { Button } from '@mui/material';
import {useState, useEffect} from 'react'



export default function BasicSelect(props) {
  const [selectedUser, setSelectedUser] = useState(''); // For selected user
  const [users, setUsers] = useState(null); // For list of users

  async function getUser() {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data); // Set users to the list of fetched users
    } catch (err) {
      console.log("ERROR FOR", err);
    }
  }


  useEffect(() => {
    const getData = async () => {
        await getUser()
    }
    getData()
  }, []);

  const handleChange = (event) => {
    console.log(event.target)
    setSelectedUser(event.target.value);
  };

  return (
    <Box sx={{ width: '40vw', margin: '0 auto', maxWidth: '100%' }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Users</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedUser} // Use selectedUser here
          label="Users"
          onChange={handleChange}
        >
          {users && users.map((user, index) => {
            if (user.user_name !== props.curU) {
                return <MenuItem value={user.user_name} key={user.uid}>
                {user.user_name}
            </MenuItem>
            }
            
          })}
        </Select>
        <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2}}
              onClick={() => {
                console.log(props.curU)
                console.log(selectedUser)
                props.addU({
                    current_user: props.curU,
                    link_with: selectedUser
                })

              }}
            >
            Confirm
        </Button>
      </FormControl>
    </Box>
  );
}
