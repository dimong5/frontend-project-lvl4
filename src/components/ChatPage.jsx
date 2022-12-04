import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCurrentChannel, setInitialState } from '../slices/channelsSlice';
import { useAuth } from '../hooks';
import NavBar from './Navbar';
import ChannelsBox from './ChannelsBox';
import ChatBox from './ChatBox';
import { getCurrentChannel, getChannels } from '../selectors';
import routes from '../routes/routes';

import 'react-toastify/dist/ReactToastify.css';

const ChatPage = () => {
  const currentChannel = useSelector(getCurrentChannel());
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(routes.dataPath(), {
        headers: auth.getAuthHeader(),
      });
      return res.data;
    };
    const getData = async () => {
      try {
        const data = await fetchData();
        dispatch(setInitialState(data));
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };
    getData();
  }, [dispatch, navigate, auth]);

  const channels = useSelector(getChannels());

  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <NavBar />
          <div className="container h-100 my-4 overflow-hidden rounded shadow">
            <div className="row h-100 bg-white flex-md-row">
              {channels.length > 0 ? (
                <ChannelsBox
                  currentChannel={currentChannel}
                  setCurrentChannel={setCurrentChannel}
                />
              ) : null}
              {channels.length > 0 ? (
                <ChatBox currentChannel={currentChannel} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
