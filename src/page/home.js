
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [roomId, setroomId] = useState("");
  const [username, setusername] = useState("");
         const navigate = useNavigate();
  const createnewroom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    
    setroomId(id);
   toast.success('created new room');
  };
  const joinroom = ()=>{
   
       if(!roomId || !username){
            toast.error('room ID an username is required ');
       }

      else {

        navigate(`/editor/${roomId}` , {
          
          state :{
            username,
          },
          
          
        } );
      } 
  }

  const handle_enter  = (e)=>{

     if(e.code == 'Enter'){
        joinroom();
     }

  }
  return (
    <div className="homewrapper">
      <div className="formwrapper">
        <img src="/dna.jpg" alt="" className="logo-photo" />
        <h4 className="mainlabel"> paste invtation room id </h4>
        <div className="inputgroup">
          <input
            type="text"
            className="inputbox"
            placeholder="Room ID"
            onChange={(e)=>  setroomId(e.target.value) }
            value={roomId}
            onKeyUp = {handle_enter}
          ></input>
          <input
            type="text"
            className="inputbox"
            placeholder="User Name"
            onChange={(e)=>  setusername(e.target.value) }
            value={username}
            onKeyUp = {handle_enter}

          ></input>
          <button className="btn joinbtn" onClick = {joinroom}>join</button>
          <span className="createinfo">
            {" "}
            if you dont have an invite then create &nbsp;
            <a onClick={createnewroom} href="" className="createnewbtn">
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        {" "}
        <h4>built by satwik</h4>{" "}
      </footer>
    </div>
  );
};

export default Home;
