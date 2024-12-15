import React from 'react';
import './App.css';

import { RouterProvider } from "react-router-dom";

import router from './router';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 1000, // every minute
    },
  },
});

const App = () => {
  return (

<QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
 
  );
}

export default App;
