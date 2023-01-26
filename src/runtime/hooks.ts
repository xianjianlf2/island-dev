import { PageData } from './../shared/types/index';
import { createContext, useContext } from 'react';

export const DataContext = createContext({} as PageData);

export const usePageData = () => {
  return useContext(DataContext);
};
