import React from 'react';
import { Flex, Card, VStack, Box, Heading, Text, Field, Input, Button, HStack } from '@chakra-ui/react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';  

// Mock API call 
const loginAPI = async (credentials: { email: string; password: string }) => {
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = api.findUserByEmail(credentials.email);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  return { user };
};

export const LoginPage: React.FC<{ onLogin: (email: string) => void }> = ({ onLogin }) => {
  const [email, setEmail] = React.useState('admin@cms.com');
  const [password, setPassword] = React.useState('123');
  const [showPassword, setShowPassword] = React.useState(false);

  const loginMutation = useMutation({
    mutationFn: loginAPI,
    onSuccess: () => {

      onLogin(email);
    },
    onError: (error: Error) => {
      console.error('Login error:', error);
     
    },
  });

  const handleLogin = () => {
    loginMutation.mutate({ email, password });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loginMutation.isPending) {
      handleLogin();
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.100"
      p={4}
    >
      <Card.Root
        maxW="480px"
        w="full"
        bg="white"
        shadow="2xl"
        borderRadius="2xl"
        overflow="hidden"
        border="none"
      >
        <Card.Body p={{ base: 6, md: 10 }}>
          <VStack gap={8}>
            <Box textAlign="center" w="full">
              <Box
                w="20"
                h="20"
                bg="black"
                borderRadius="2xl"
                mx="auto"
                mb={5}
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition="all 0.3s ease"
                _hover={{ transform: "rotate(0deg) scale(1.05)" }}
              >
                <ShieldCheck size={36} color="white" strokeWidth={2.5} />
              </Box>
              <Heading 
                size="2xl" 
                mb={2} 
                color="gray.800"
                fontWeight="bold"
              >
                Welcome Back
              </Heading>
              <Text color="gray.700" fontWeight="400" fontSize="lg">
                Sign in to continue to your dashboard
              </Text>
            </Box>

            <VStack gap={5} w="full">
              {loginMutation.isError && (
                <Box
                  w="full"
                  p={4}
                  bg="red.50"
                  border="1px solid"
                  borderColor="red.200"
                  borderRadius="lg"
                >
                  <HStack gap={2}>
                    <AlertCircle size={18} color="#DC2626" />
                    <Text fontSize="sm" color="red.700" fontWeight="500">
                      {loginMutation.error?.message || 'Login failed. Please try again.'}
                    </Text>
                  </HStack>
                </Box>
              )}

              <Field.Root w="full">
                <Field.Label color="gray.700" fontWeight="600" fontSize="sm" mb={2}>
                  Email Address
                </Field.Label>
                <Box position="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="you@example.com"
                    size="lg"
                    pl={12}
                    h="52px"
                    bg="gray.50"
                    border="2px solid"
                    borderColor="gray.200"
                    borderRadius="xl"
                    fontSize="md"
                    transition="all 0.2s"
                    disabled={loginMutation.isPending}
                    _hover={{ borderColor: "black", bg: "white" }}
                    _focus={{ 
                      borderColor: "black", 
                      bg: "white",
                      shadow: "0 0 0 3px rgba(102, 126, 234, 0.1)"
                    }}
                    _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
                  />
                  <Box 
                    position="absolute" 
                    left={4} 
                    top="50%" 
                    transform="translateY(-50%)" 
                    color="gray.400"
                    transition="color 0.2s"
                  >
                    <Mail size={20} />
                  </Box>
                </Box>
              </Field.Root>

              <Field.Root w="full">
                <Field.Label color="gray.700" fontWeight="600" fontSize="sm" mb={2}>
                  Password
                </Field.Label>
                <Box position="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your password"
                    size="lg"
                    pl={12}
                    pr={12}
                    h="52px"
                    bg="gray.50"
                    border="2px solid"
                    borderColor="gray.200"
                    borderRadius="xl"
                    fontSize="md"
                    transition="all 0.2s"
                    disabled={loginMutation.isPending}
                    _hover={{ borderColor: "black", bg: "white" }}
                    _focus={{ 
                      borderColor: "black", 
                      bg: "white",
                      shadow: "0 0 0 3px rgba(102, 126, 234, 0.1)"
                    }}
                    _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
                  />
                  <Box 
                    position="absolute" 
                    left={4} 
                    top="50%" 
                    transform="translateY(-50%)" 
                    color="gray.400"
                  >
                    <Lock size={20} />
                  </Box>
                  <Button
                    position="absolute"
                    right={2}
                    top="50%"
                    transform="translateY(-50%)"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    p={2}
                    borderRadius="lg"
                    color="gray.500"
                    disabled={loginMutation.isPending}
                    _hover={{ color: "black", bg: "white" }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </Box>
              </Field.Root>
            </VStack>

            <Button
              w="100%"
              h="52px"
              onClick={handleLogin}
              loading={loginMutation.isPending}
              loadingText="Signing in..."
              bg="black"
              color="white"
              fontSize="md"
              fontWeight="600"
              borderRadius="xl"
              shadow="lg"
              disabled={loginMutation.isPending}
              _hover={{ 
                shadow: "xl", 
                transform: "translateY(-2px)",
                bg: "gray.900"
              }}
              _active={{ 
                transform: "translateY(0px)",
                shadow: "md"
              }}
              _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
              transition="all 0.2s ease"
            >
              Sign In
            </Button>

            <Box
              w="100%"
              p={6}
              bg="accent"
              borderRadius="xl"
              border="1px solid"
              borderColor="purple.100"
              shadow="sm"
            >
              <HStack mb={3} gap={2}>
                <Box w="2" h="2" bg="black" borderRadius="full" display="flex" alignItems="center" justifyContent="center">
                </Box>
                <Text fontSize="sm" fontWeight="700" color="gray.800">
                  Demo Credentials
                </Text>
              </HStack>
              <VStack align="start" gap={2.5}>
                <HStack gap={3}>
                  <Box 
                    w="2" 
                    h="2" 
                    bg="emerald.400" 
                    borderRadius="full"
                    shadow="sm"
                  />
                  <Text fontSize="sm" color="gray.700" fontWeight="500">
                    admin@cms.com - Full access
                  </Text>
                </HStack>
                <HStack gap={3}>
                  <Box 
                    w="2" 
                    h="2" 
                    bg="amber.400" 
                    borderRadius="full"
                    shadow="sm"
                  />
                  <Text fontSize="sm" color="gray.700" fontWeight="500">
                    editor@cms.com - Edit content
                  </Text>
                </HStack>
                <HStack gap={3}>
                  <Box 
                    w="2" 
                    h="2" 
                    bg="rose.400" 
                    borderRadius="full"
                    shadow="sm"
                  />
                  <Text fontSize="sm" color="gray.700" fontWeight="500">
                    viewer@cms.com - View only
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Flex>
  );
};