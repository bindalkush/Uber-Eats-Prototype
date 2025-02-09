import { useSelector } from 'react-redux';

export const useSessionToken = () => {
  return useSelector(state => state.counter.sessionToken);
};

