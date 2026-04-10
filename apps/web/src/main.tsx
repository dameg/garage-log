import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { router } from '@/app/router';

import { AppProvider } from './app/providers';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>,
);
