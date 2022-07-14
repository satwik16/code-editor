import { useState, useEffect } from "react";
import Clients from "../components/clients";
import Editor from "../components/Editor";
// import "../app.css";
import { useRef } from "react";
import { initSocket } from "../socket";
import ACTIONS from "../actions";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";
const Editorpage = () => {
  const copyref = useRef(null);
  const socketref = useRef(null);
  const coderef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setclients] = useState([]);
  useEffect(() => {
    const init = async () => {
      socketref.current = await initSocket();
      socketref.current.on("connect_error", (err) => {
        handleError(err);
      });
      socketref.current.on("connect_failed", (err) => {
        handleError(err);
      });

      function handleError(e) {
        console.log("socket error", e);
        toast.error("socket connection failed , trye again later");
        reactNavigator("/");
      }

      socketref.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // listening for joined
      socketref.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room`);
            
          }
          setclients(clients);
          socketref.current.emit(ACTIONS.SYNC_CODE, {
            code: coderef.current,
            socketId,
          });
        }
      );

      // listening for disconnected

      socketref.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setclients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    return () => {
      socketref.current.off(ACTIONS.JOINED);
      socketref.current.off(ACTIONS.DISCONNECTED);

      socketref.current.disconnect();
    };
  }, []);

  async function copyroomid(e) {
    //  e
    //  copyref.current.select();
    //  document.execCommand("copy");
    //  e.target.focus();
    // navigator.clipboard.writeText(copyref);
    // console.log(copyref.current.baseURI);
    // console.log(url);
    
    try {
      const url = copyref.current.baseURI.split("/")[4];
      await navigator.clipboard.writeText(url);
      toast.success(`room id has been copied to your clipboard`);
    } catch (err) {
      toast.error(`could not copy roomId`);
      console.log(err);
    }
  }

  function leaveroom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <div className="mainwrapper">
        <div className="aside">
          <div className="asideinner">
            <div className="logo">
              <img className="logoimage" src="/dna.jpg" alt="logo" />
            </div>
            <h3>connected</h3>
            <div className="clientlist">
              {clients.map((client) => (
                <Clients key={client.socketId} username={client.username} />
              ))}
            </div>
          </div>
          <button className="btn copybtn" onClick={copyroomid} ref ={copyref}>
            copy ROOM ID{" "} 
          </button>
          <button className="btn leavebtn" onClick={leaveroom}>
            LEAVE
          </button>
        </div>

        <div className="editorwrap">
          <Editor
            socketref={socketref}
            roomId={roomId}
            onCodechange={(code) => {
              coderef.current = code;
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Editorpage;
