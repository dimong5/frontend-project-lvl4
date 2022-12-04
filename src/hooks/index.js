import { useContext } from 'react';
import { AuthContext, ApiContext } from '../context';

export const useApi = () => useContext(ApiContext);
export const useAuth = () => useContext(AuthContext);
