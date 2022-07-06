import React, {useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import useAuth from "./hooks";

const Chat = () => {
  return (
      <div>
        Chat page
      </div>
  );
};

function Home() {
  
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.loggedIn) {
      navigate("/login");
    }
  }, [auth, navigate]); 
  
  return (
    <div>
       < Chat /> 
    </div>
  );
};

export default Home;
