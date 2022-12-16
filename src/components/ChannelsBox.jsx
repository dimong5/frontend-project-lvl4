import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { setCurrentChannel } from '../slices/channelsSlice';
import getModal from './modals/index';
import { getChannels, getModalState, getCurrentChannel } from '../selectors';
import {
  showAddChannelModal,
  showRemoveChannelModal,
  showRenameChannelModal,
} from '../slices/modalSlice';

const renderModal = (modalState) => {
  const { type } = modalState;
  if (!type) return null;
  const Component = getModal(type);
  return <Component />;
};

const Channel = ({ channel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentChannel = useSelector(getCurrentChannel);
  const handleRemoveChannel = async (e) => {
    e.preventDefault();
    dispatch(showRemoveChannelModal({ item: channel.id }));
  };
  const handleRenameChannel = async (e) => {
    e.preventDefault();
    dispatch(showRenameChannelModal({ item: channel }));
  };
  const isActive = currentChannel === channel.id;

  return (
    <li className="nav-item w-100" key={channel.id}>
      {channel.removable ? (
        <Dropdown
          as={ButtonGroup}
          className="d-flex"
          align="start"
          autoClose
          navbar
        >
          <Button
            variant={isActive ? 'secondary' : null}
            className="w-100 rounded-0 text-start text-truncate"
            onClick={() => {
              dispatch(setCurrentChannel(channel.id));
            }}
          >
            <span className="me-1">#</span>
            {channel.name}
          </Button>

          <Dropdown.Toggle
            className="flex-grow-0"
            split
            variant={isActive ? 'secondary' : null}
            id="dropdown-split-basic"
          >
            <span className="visually-hidden">
              {t('channelBox.channelControlToggle')}
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleRemoveChannel}>
              {t('channelBox.removeChannel')}
            </Dropdown.Item>
            <Dropdown.Item onClick={handleRenameChannel}>
              {t('channelBox.renameChannel')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button
          onClick={() => {
            dispatch(setCurrentChannel(channel.id));
          }}
          className="w-100 rounded-0 text-start"
          variant={isActive ? 'secondary' : null}
        >
          <span className="me-1">#</span>
          {channel.name}
        </Button>
      )}
    </li>
  );
};

const ChannelsBox = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector(getChannels);
  const handleAddChannel = async (e) => {
    e.preventDefault();
    dispatch(showAddChannelModal({ item: null }));
  };
  return (
    <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>{t('channelBox.channelsHeader')}</span>
        <button
          onClick={handleAddChannel}
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
        {channels.map((channel) => <Channel key={channel.id} channel={channel} />)}
      </ul>
      {renderModal(useSelector(getModalState))}
    </div>
  );
};

export default ChannelsBox;
