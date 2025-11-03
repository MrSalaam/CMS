import React from 'react';
import { Box, Flex, Text, VStack, Container } from '@chakra-ui/react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

export const MobileRestriction: React.FC = () => {
  return (
    <Box 
      minH="100vh" 
      bg="black"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={6}
    >
      <Container maxW="500px">
        <VStack gap={8} textAlign="center">
          
          <Flex gap={4} justify="center" align="center">
            <Box
              
            >
              <Smartphone size={40} color="white" />
            </Box>
            <Box
              
            >
              <Tablet size={48} color="white" />
            </Box>
            <Box
             
            >
              <Monitor size={56} color="white" />
            </Box>
          </Flex>

          
          <VStack gap={4}>
            <Text 
              fontSize={{ base: '3xl', md: '4xl' }} 
              fontWeight="bold" 
              color="white"
              lineHeight="1.2"
            >
              Desktop Only
            </Text>
            <Text 
              fontSize={{ base: 'lg', md: 'xl' }} 
              color="whiteAlpha.900"
              fontWeight="500"
            >
              This CMS is not available on mobile or tablet devices
            </Text>
            <Text 
              fontSize={{ base: 'sm', md: 'md' }} 
              color="whiteAlpha.800"
              maxW="400px"
              lineHeight="1.6"
            >
              For the best experience and full functionality, please access this application from a desktop computer with a screen width of at least 1024px.
            </Text>
          </VStack>

          
          <Box 
            bg="whiteAlpha.200" 
            borderRadius="xl" 
            p={6}
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor="whiteAlpha.300"
            w="full"
          >
            <VStack gap={3}>
              <Text fontSize="sm" color="whiteAlpha.900" fontWeight="600">
                Minimum Requirements
              </Text>
              <VStack gap={2} align="stretch" fontSize="sm" color="whiteAlpha.800">
                <Flex justify="space-between" align="center">
                  <Text>Screen Width:</Text>
                  <Text fontWeight="600" color="white">≥ 1024px</Text>
                </Flex>
                
              
              </VStack>
            </VStack>
          </Box>

          
        </VStack>
      </Container>

    
    </Box>
  );
};

export default MobileRestriction;