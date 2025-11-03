import React from 'react';
import { ChakraProvider, defaultSystem, useBreakpointValue } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/Auth/LoginPage';
import { Dashboard } from './components/Dashboard';
import { ErrorBoundary } from './ErrorBoundary';
import { MobileRestriction } from './components/MobileRestriction';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const RootSwitch: React.FC = () => {
  const { user, login } = useAuth();
  const showRestriction = useBreakpointValue({ base: true, lg: false }, { ssr: false });

  if (showRestriction) {
    return <MobileRestriction />;
  }

  return user ? <Dashboard /> : <LoginPage onLogin={(email) => login(email, '')} />;
};

const App: React.FC = () => {
  return (
    <ChakraProvider value={defaultSystem}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <AuthProvider>
            <RootSwitch />
          </AuthProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default App