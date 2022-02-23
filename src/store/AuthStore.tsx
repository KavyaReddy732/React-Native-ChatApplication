import AsyncStorage from '@react-native-async-storage/async-storage';
import create from 'zustand';
import {persist, StateStorage, devtools} from 'zustand/middleware';

interface LoginState {
  isAuth: boolean | null;
  setIsAuth: (isAuth: any) => void;
  getStorage?: (() => StateStorage) | undefined;
  // user: any;
  // setUser: (user: any) => void;
}

const useAuthStore = create<LoginState>(
  persist(
    devtools(set => ({
      isAuth: false,
      setIsAuth: isAuth => {
        set({isAuth});
      },
    })),
    {name: 'Authentication', getStorage: () => AsyncStorage},
  ),
);

export default useAuthStore;
