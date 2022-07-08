import React, {useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { addMany } from "../slices/channelsSlice";
import useAuth from "../hooks";
import axios from "axios";
import ComponentWrapper from "./ComponentWrapper";


const getToken = () => JSON.parse(localStorage.getItem("userId"));

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem("userId"));
  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};


const renderChannel = (channel) => {
  return (
 <li className="nav-item w-100">
    <button
      type="button"
      className="w-100 rounded-0 text-start btn btn-secondary"
    >
      <span className="me-1">#</span>{channel.name}
    </button>
  </li>
  )
}

const Chat = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.value);
  useEffect(() => {
    const getChannels = async () => {
      try {
        console.log(getAuthHeader());
        const response = await axios.get("http://localhost:3000/api/v1/data", {
          headers: getAuthHeader(),
        });
        dispatch(addMany(response.data.channels));
        console.log(response.data);
      } catch (e) {
        console.log(e);
      }
    }
    getChannels();
  }, [dispatch])
  console.log('channels', channels);
  return (
    <ComponentWrapper>
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
            <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
              <span>Каналы</span>
              <button
                type="button"
                className="p-0 text-primary btn btn-group-vertical"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width={20}
                  height={20}
                  fill="currentColor"
                >
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                <span className="visually-hidden">+</span>
              </button>
            </div>
            <ul className="nav flex-column nav-pills nav-fill px-2">
              {channels.map(renderChannel)}

              <li className="nav-item w-100">
                <button
                  type="button"
                  className="w-100 rounded-0 text-start btn btn-secondary"
                >
                  <span className="me-1">#</span>general
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ComponentWrapper>
  );
};

function Home() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
    }
  }, [auth, navigate]); 
  
  return (
    <Chat /> 
  );
};

export default Home;
