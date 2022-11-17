import { useContext } from 'react';
import AuthContext from '../context';
import MessageIpaContext from '../context/massageApi.js';

export const useMessageApi = () => useContext(MessageIpaContext);
export const useAuth = () => useContext(AuthContext);
