import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from '../Error/ErrorBoundary/ErrorBoundary';
import Sidebar from './Sidebar/Sidebar';
import classes from './style.module.scss';
import { Outlet } from 'react-router-dom';

import { useMessagesSubscribe } from '../../utils/hooks/Messages/useMessagesSubscribe.ts';
import { useChatsSubscribe } from '../../utils/hooks/Chats/useChatsSubscribe.ts';
import Header from './Header/Header.tsx';

const queryClient = new QueryClient();


const Layout: React.FC = () => {

   
   
    useChatsSubscribe()
    useMessagesSubscribe();

    return (
        <QueryClientProvider client={queryClient}>
            <div className={classes['layout']}>
                <Suspense fallback={<div>Loading Sidebar...</div>}>
                    <ErrorBoundary>
                        <Sidebar />
                    </ErrorBoundary>
                </Suspense>
                <div className={classes['layout-page_wrapper']}>
                    <Suspense fallback={<div>Loading Header...</div>}>
                        <ErrorBoundary>
                            <Header/>
                        </ErrorBoundary>
                    </Suspense>
                    <div className={classes['layout-page']}>
                        <Suspense fallback={<div>Loading Content...</div>}>
                            <ErrorBoundary>
                                <Outlet />
                            </ErrorBoundary>
                        </Suspense>
                    </div>
                </div>
            </div>
        </QueryClientProvider>
    );
};

export default Layout;