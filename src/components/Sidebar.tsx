import React from 'react';
import { Box, VStack, Button, Text, HStack, Badge, Separator, IconButton } from '@chakra-ui/react';
import { 
  Users, 
  FileText, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  Settings,
 
  HelpCircle,
  
} from 'lucide-react';

// Mock auth context
const useAuth = () => ({
  user: { name: 'Admin User', email: 'admin@cms.com', role: 'Admin' }
});

const hasPermission = (role?: string, permission?: string) => {
  const permissions = {
    admin: ['read', 'manage_users', 'manage_posts', 'manage_settings'],
    editor: ['read', 'manage_posts'],
    viewer: ['read']
  };
  return permissions[role?.toLowerCase() as keyof typeof permissions]?.includes(permission || '') || false;
};

export const Sidebar = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  

  const menuItems = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: BarChart3, 
      permission: 'read',
      badge: null,
      description: 'Dashboard analytics'
    },
    { 
      id: 'posts', 
      label: 'Posts', 
      icon: FileText, 
      permission: 'read',
      badge: '3',
      description: 'Manage content'
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: Users, 
      permission: 'manage_users',
      badge: '4',
      description: 'User management'
    },
  ];



  return (
    <Box
      w={isCollapsed ? '80px' : { base: '240px', md: '280px' }}
      bg="white"
      borderRightWidth="1px"
      borderColor="gray.200"
      minH="calc(100vh - 81px)"
      shadow="sm"
      position="relative"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      
      <IconButton
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        position="absolute"
        top={4}
        right={-3}
        size="sm"
        borderRadius="full"
        bg="black"
        border="2px solid"
        borderColor="gray.200"
        shadow="md"
        zIndex={10}
        onClick={() => setIsCollapsed(!isCollapsed)}
        _hover={{ 
          bg: 'black', 
          color: 'white',
          borderColor: 'black',
          transform: 'scale(1.1)'
        }}
        transition="all 0.2s"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </IconButton>

      <VStack gap={6} align="stretch" p={4} pt={6}>
        {/* Main Navigation */}
        <Box>
          {!isCollapsed && (
            <Text 
              fontSize="xs" 
              fontWeight="700" 
              color="gray.500" 
              textTransform="uppercase" 
              letterSpacing="wider"
              px={4}
              mb={3}
            >
              Navigation
            </Text>
          )}
          <VStack gap={1.5} align="stretch">
            {menuItems.map(item => {
              const Icon = item.icon;
              const canAccess = user ? hasPermission(user.role, item.permission) : false;
              if (!canAccess) return null;
              const isActive = activeTab === item.id;
              
              return (
                <Box key={item.id} position="relative">
                  <Button
                    variant="ghost"
                    justifyContent={isCollapsed ? 'center' : 'flex-start'}
                    size="lg"
                    onClick={() => onTabChange(item.id)}
                    fontWeight="600"
                    bg={isActive ? 'black' : 'transparent'}
                    color={isActive ? 'white' : 'gray.700'}
                    _hover={{
                      bg: isActive ? 'gray.800' : 'gray.100',
                      transform: isCollapsed ? 'scale(1.05)' : 'translateX(4px)',
                      color: isActive ? 'white' : 'gray.900'
                    }}
                    _active={{
                      transform: isCollapsed ? 'scale(0.98)' : 'translateX(2px)'
                    }}
                    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                    borderRadius="xl"
                    px={isCollapsed ? 2 : 4}
                    py={6}
                    w="full"
                    position="relative"
                    overflow="visible"
                  >
                    <HStack gap={3} w="full">
                      <Box flexShrink={0}>
                        <Icon size={20} strokeWidth={2.5} />
                      </Box>
                      {!isCollapsed && (
                        <>
                          <Box flex={1} textAlign="left" minW="0">
                            <Text fontSize="md">
                              {item.label}
                            </Text>
                            {!isActive && (
                              <Text 
                                fontSize="2xs" 
                                color="gray.500" 
                                fontWeight="500"
                                mt={0.5}
                              >
                                {item.description}
                              </Text>
                            )}
                          </Box>
                          {item.badge && (
                            <Badge
                              bg={isActive ? 'whiteAlpha.300' : 'gray.100'}
                              color={isActive ? 'white' : 'gray.700'}
                              fontSize="2xs"
                              fontWeight="700"
                              px={2}
                              py={0.5}
                              borderRadius="full"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </HStack>
                   
                    {isActive && (
                      <Box
                        position="absolute"
                        left={0}
                        top="50%"
                        transform="translateY(-50%)"
                        w="3px"
                        h="60%"
                        bg="white"
                        borderRadius="0 full full 0"
                      />
                    )}
                  </Button>
                  {/* Badge for collapsed state */}
                  {isCollapsed && item.badge && (
                    <Box
                      position="absolute"
                      top={1}
                      right={1}
                      w="5"
                      h="5"
                      bg={isActive ? 'white' : 'black'}
                      color={isActive ? 'black' : 'white'}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="2xs"
                      fontWeight="bold"
                      border="2px solid white"
                      shadow="sm"
                    >
                      {item.badge}
                    </Box>
                  )}
                </Box>
              );
            })}
          </VStack>
        </Box>

        <Box mt="auto" pt={4}>
          {!isCollapsed && <Separator mb={4} />}
          <VStack gap={1.5} align="stretch">
            <Button
              variant="ghost"
              justifyContent={isCollapsed ? 'center' : 'flex-start'}
              size={isCollapsed ? 'md' : 'lg'}
              onClick={() => alert('Settings clicked!')}
              fontWeight="500"
              color="gray.600"
              _hover={{
                bg: 'gray.100',
                color: 'gray.900',
                transform: isCollapsed ? 'scale(1.1)' : 'translateX(4px)'
              }}
              transition="all 0.2s"
              borderRadius="xl"
              px={isCollapsed ? 2 : 4}
            >
              <HStack gap={3}>
                <Settings size={18} />
                {!isCollapsed && <Text fontSize="sm">Settings</Text>}
              </HStack>
            </Button>
            
            <Button
              variant="ghost"
              justifyContent={isCollapsed ? 'center' : 'flex-start'}
              size={isCollapsed ? 'md' : 'lg'}
              onClick={() => alert('Help clicked!')}
              fontWeight="500"
              color="gray.600"
              _hover={{
                bg: 'gray.100',
                color: 'gray.900',
                transform: isCollapsed ? 'scale(1.1)' : 'translateX(4px)'
              }}
              transition="all 0.2s"
              borderRadius="xl"
              px={isCollapsed ? 2 : 4}
            >
              <HStack gap={3}>
                <HelpCircle size={18} />
                {!isCollapsed && <Text fontSize="sm">Help & Support</Text>}
              </HStack>
            </Button>
          </VStack>

          
          {!isCollapsed && (
            <Box 
              mt={4} 
              p={3} 
              bg="gray.50" 
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.200"
            >
              <HStack gap={2}>
                
               
              </HStack>
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;