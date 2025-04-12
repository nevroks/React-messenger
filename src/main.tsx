import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import { RouterProvider } from 'react-router-dom';
import router from './utils/router/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppSocketProvider from './utils/hocs/AppSocketProvider/AppSocketProvider';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppSocketProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AppSocketProvider>
  </StrictMode>,
);
