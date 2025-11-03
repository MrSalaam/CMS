import React from 'react';
import {
  Box,
  Flex,
  Button,
  Text,
  Heading,
  HStack,
  Badge,
  VStack,
  Input,
  Field,
  Dialog,
  Menu,
  IconButton,
  Separator,
  Portal
} from '@chakra-ui/react';
import { Settings, LogOut, ChevronDown, User, Bell, Search, Shield } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const [notifications, setNotifications] = React.useState(3);
  // local role state so badge/menu can update at runtime

  const getRoleBadgeColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'green';
      case 'editor':
        return 'orange';
      case 'viewer':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getRolePermissions = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'Full access: manage users, posts, and system settings.';
      case 'editor':
        return 'Edit access: create, edit, and delete posts.';
      case 'viewer':
        return 'View access: read posts and users only.';
      default:
        return 'No permissions defined.';
    }
  };

  const handleSaveSettings = () => {
    if (newPassword) {
      alert('Password updated successfully!');
      setNewPassword('');
    }
    setIsSettingsOpen(false);
  };

  const handleNotificationClick = () => {
    setNotifications(0);
    alert('Notifications opened!');
  };

  return (
    <>
      <Box
        bg="rgba(255, 255, 255, 0.98)"
        borderBottomWidth="1px"
        borderColor="gray.200"
        px={{ base: 4, sm: 6, md: 8 }}
        py={{ base: 3, md: 4 }}
        shadow="sm"
        position="sticky"
        top={0}
        zIndex={1000}
        backdropFilter="blur(12px)"
      >
        <Flex justify="space-between" align="center" gap={4}>
          {/* Logo Section with Animation */}
          <HStack gap={3} minW="0" flex={{ base: '1', md: 'initial' }}>
            
            <Box minW="0">
              <Heading
                size={{ base: 'md', sm: 'lg', md: 'xl' }}
                color="black"
                fontWeight="black"
                letterSpacing="-1px"
                lineHeight="1"
              >
                CMS Dashboard
              </Heading>
              <Text
                fontSize={{ base: '2xs', sm: 'xs' }}
                color="gray.500"
                fontWeight="medium"
                display={{ base: 'none', sm: 'block' }}
                mt={0.5}
              >
                Content Management System
              </Text>
            </Box>
          </HStack>

          {/* Actions Section */}
          <HStack gap={{ base: 1, sm: 2, md: 3 }} flexShrink={0}>
            {/* Search Button - Desktop */}
            <IconButton
              aria-label="Search"
              variant="ghost"
              size={{ base: 'sm', md: 'md' }}
              borderRadius="lg"
              display={{ base: 'none', md: 'flex' }}
              _hover={{ bg: 'gray.100' }}
            >
              <Search size={18} />
            </IconButton>

            

            {/* Notifications */}
            <Box position="relative">
              <IconButton
                aria-label="Notifications"
                variant="ghost"
                size={{ base: 'sm', md: 'md' }}
                borderRadius="lg"
                onClick={handleNotificationClick}
                _hover={{ bg: 'gray.100' }}
              >
                <Bell size={18} />
              </IconButton>
              {notifications > 0 && (
                <Box
                  position="absolute"
                  top="-1"
                  right="-1"
                  w="5"
                  h="5"
                  bg="red.500"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="2xs"
                  color="white"
                  fontWeight="bold"
                  border="2px solid white"
                >
                  {notifications}
                </Box>
              )}
            </Box>

            {/* Role Badge */}
            <Badge
              colorScheme={getRoleBadgeColor(user?.role)}
              fontSize={{ base: '2xs', sm: 'xs' }}
              px={{ base: 2, sm: 3 }}
              py={{ base: 1, sm: 1.5 }}
              borderRadius="full"
              fontWeight="600"
              display={{ base: 'none', lg: 'inline-flex' }}
              textTransform="uppercase"
              letterSpacing="wider"
              cursor="pointer"
              _hover={{ opacity: 0.9, transform: 'scale(1.03)' }}
              transition="all 0.15s"
              title={getRolePermissions(user?.role)}
              whiteSpace="nowrap"
              onClick={() => alert(getRolePermissions(user?.role))}
            >
              <HStack gap={1.5}>
                <Shield size={12} />
                <Text>{user?.role}</Text>
              </HStack>
            </Badge>

            {/* User Menu */}
            <Menu.Root positioning={{ placement: 'bottom-end' }}>
              <Menu.Trigger asChild>
                <Button
                  variant="ghost"
                  size={{ base: 'sm', md: 'md' }}
                  px={{ base: 2, sm: 3 }}
                  py={{ base: 1.5, sm: 2 }}
                  h="auto"
                  borderRadius={{ base: 'lg', md: 'xl' }}
                  transition="all 0.2s"
                  _hover={{ bg: 'gray.100', transform: 'translateY(-1px)' }}
                  _active={{ transform: 'translateY(0)' }}
                  minW="0"
                >
                  <HStack gap={{ base: 2, md: 3 }}>
                    <Box
                      w={{ base: '7', sm: '9' }}
                      h={{ base: '7', sm: '9' }}
                      bgGradient="to-br"
                      gradientFrom="black"
                      gradientTo="gray.700"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="white"
                      fontWeight="bold"
                      fontSize={{ base: 'xs', sm: 'sm' }}
                      border="2px solid"
                      borderColor="gray.200"
                      flexShrink={0}
                      
                    >
                      {user?.name?.charAt(0) || 'U'}
                    </Box>
                    <Box
                      textAlign="left"
                      display={{ base: 'none', md: 'block' }}
                      minW="0"
                    >
                      <Text
                        fontWeight="600"
                        fontSize="sm"
                        color="gray.800"
                        lineHeight="1.2"
                      >
                        {user?.name}
                      </Text>
                      <Text
                        fontSize="xs"
                        color="gray.500"
                        fontWeight="500"
                      >
                        {user?.email}
                      </Text>
                    </Box>
                    <Box display={{ base: 'none', sm: 'block' }} flexShrink={0}>
                      <ChevronDown size={16} style={{ color: '#6B7280' }} />
                    </Box>
                  </HStack>
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content
                    minW={{ base: '220px', sm: '260px' }}
                    maxW={{ base: '90vw', sm: '320px' }}
                    borderRadius="xl"
                    
                    border="1px solid"
                    borderColor="gray.200"
                    p={2}
                    bg="white"
                  >
                    {/* User Info Header */}
                    <Box
                      px={3}
                      py={3}
                      mb={2}
                      borderBottomWidth="1px"
                      borderColor="gray.100"
                      bg="gray.50"
                      borderRadius="lg"
                    >
                      <HStack gap={3}>
                        <Box
                          w="10"
                          h="10"
                          bg="black"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color="white"
                          fontWeight="bold"
                          fontSize="md"
                          flexShrink={0}
                        >
                          {user?.name?.charAt(0) || 'U'}
                        </Box>
                        <Box flex={1} minW="0">
                          <Text
                            fontWeight="700"
                            fontSize="sm"
                            color="gray.800"
                          >
                            {user?.name}
                          </Text>
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            mt={0.5}
                          >
                            {user?.email}
                          </Text>
                          <Badge
                            colorScheme={getRoleBadgeColor(user?.role)}
                            fontSize="2xs"
                            px={2}
                            py={0.5}
                            borderRadius="full"
                            fontWeight="600"
                            mt={1.5}
                            textTransform="uppercase"
                          >
                            {user?.role}
                          </Badge>
                        </Box>
                      </HStack>
                    </Box>

                    {/* Menu Items */}
                    <Menu.Item
                      value="settings"
                      onClick={() => setIsSettingsOpen(true)}
                      borderRadius="lg"
                      py={2.5}
                      px={3}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{ bg: 'gray.50', transform: 'translateX(2px)' }}
                    >
                      <HStack gap={3}>
                        <Box
                          w="8"
                          h="8"
                          bg="gray.100"
                          borderRadius="lg"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          flexShrink={0}
                          transition="all 0.2s"
                          _groupHover={{ bg: 'gray.200' }}
                        >
                          <Settings size={16} color="#4B5563" />
                        </Box>
                        <Box flex={1} minW="0">
                          <Text fontWeight="600" fontSize="sm" color="gray.800">
                            Settings
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Manage preferences
                          </Text>
                        </Box>
                      </HStack>
                    </Menu.Item>

                    <Separator my={2} />

                    <Menu.Item
                      value="logout"
                      onClick={logout}
                      borderRadius="lg"
                      py={2.5}
                      px={3}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{ bg: 'red.50', transform: 'translateX(2px)' }}
                    >
                      <HStack gap={3}>
                        <Box
                          w="8"
                          h="8"
                          bg="red.50"
                          borderRadius="lg"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          flexShrink={0}
                          transition="all 0.2s"
                          _groupHover={{ bg: 'red.100' }}
                        >
                          <LogOut size={16} color="#DC2626" />
                        </Box>
                        <Box flex={1} minW="0">
                          <Text fontWeight="600" fontSize="sm" color="red.600">
                            Logout
                          </Text>
                          <Text fontSize="xs" color="red.400">
                            Sign out of account
                          </Text>
                        </Box>
                      </HStack>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </HStack>
        </Flex>
      </Box>

    
      <Dialog.Root 
        open={isSettingsOpen} 
        onOpenChange={(e) => setIsSettingsOpen(e.open)}
      >
        <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <Portal>
          <Dialog.Positioner>
            <Dialog.Content 
              borderRadius="xl"
              maxW={{ base: '95vw', sm: '90vw', md: '540px' }}
              mx={{ base: 2, sm: 4 }}
              shadow="2xl"
              mt="8vh"
              bg="white"
            >
              <Dialog.Header borderBottomWidth="1px" borderColor="gray.100" pb={4}>
                <HStack gap={3}>
                  <Box
                    w={{ base: '10', md: '12' }}
                    h={{ base: '10', md: '12' }}
                    bg="black"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    mx={{ base: 0, md: 2 }}
                    my={{ base: 0, md: 2 }}
                  >
                    <Settings size={22} color="white" />
                  </Box>
                  <Box minW="0" flex={1}>
                    <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="gray.900">
                      Account Settings
                    </Text>
                    <Text fontSize={{ base: 'xs', sm: 'sm' }} color="gray.600" mt={1}>
                      Manage your account preferences and security
                    </Text>
                  </Box>
                </HStack>
              </Dialog.Header>
              <Dialog.CloseTrigger />
              
              <Dialog.Body px={{ base: 4, md: 6 }} py={{ base: 5, md: 6 }}>
                <VStack gap={5} align="stretch">
                  {/* Password Field */}
                  <Field.Root>
                    <Field.Label 
                      fontWeight="600" 
                      color="gray.700" 
                      fontSize={{ base: 'sm', md: 'md' }}
                      mb={2}
                    >
                      Change Password
                    </Field.Label>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      bg="white"
                      border="2px solid"
                      borderColor="gray.200"
                      borderRadius="xl"
                      fontSize={{ base: 'sm', md: 'md' }}
                      h={{ base: '11', md: '12' }}
                      _hover={{ borderColor: "gray.300" }}
                      _focus={{ borderColor: "black", bg: "white", shadow: "0 0 0 3px rgba(0,0,0,0.1)" }}
                      transition="all 0.2s"
                      px={4}
                    />
                    <Field.HelperText fontSize="xs" color="gray.500" mt={1.5}>
                      Use a strong password with at least 8 characters
                    </Field.HelperText>
                  </Field.Root>

                  {/* Profile Info Card */}
                  <Box 
                    p={{ base: 4, md: 5 }} 
                    bg="gray.50" 
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    <HStack gap={2.5} mb={3}>
                      <Box
                        w="8"
                        h="8"
                        bg="black"
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                      >
                        <User size={16} color="white" />
                      </Box>
                      <Text fontWeight="700" fontSize={{ base: 'sm', sm: 'md' }} color="gray.800">
                        Profile Information
                      </Text>
                    </HStack>
                    <VStack align="stretch" gap={2} mt={3}>
                      <HStack justify="space-between">
                        <Text fontSize={{ base: 'xs', sm: 'sm' }} color="gray.600" fontWeight="500">
                          Name:
                        </Text>
                        <Text fontSize={{ base: 'xs', sm: 'sm' }} color="gray.900" fontWeight="600">
                          {user?.name}
                        </Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize={{ base: 'xs', sm: 'sm' }} color="gray.600" fontWeight="500">
                          Email:
                        </Text>
                        <Text fontSize={{ base: 'xs', sm: 'sm' }} color="gray.900" fontWeight="600">
                          {user?.email}
                        </Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize={{ base: 'xs', sm: 'sm' }} color="gray.600" fontWeight="500">
                          Role:
                        </Text>
                        <Badge
                          colorScheme={getRoleBadgeColor(user?.role)}
                          fontSize="xs"
                          px={2}
                          py={1}
                          borderRadius="full"
                          fontWeight="600"
                        >
                          {user?.role}
                        </Badge>
                      </HStack>
                    </VStack>
                    
                  </Box>
                </VStack>
              </Dialog.Body>
              
              <Dialog.Footer 
                px={{ base: 4, md: 6 }} 
                py={{ base: 4, md: 4 }}
                borderTopWidth="1px"
                borderColor="gray.100"
              >
                <HStack gap={{ base: 2, sm: 3 }} w="full" justify="flex-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSettingsOpen(false)}
                    size={{ base: 'sm', md: 'md' }}
                    borderRadius="lg"
                    borderWidth="2px"
                    _hover={{ bg: 'gray.50' }}
                    px={6}  
                  >
                    Cancel
                  </Button>
                  <Button 
                    bg="black" 
                    color="white" 
                    onClick={handleSaveSettings} 
                    _hover={{ bg: "gray.800", transform: 'translateY(-1px)', shadow: 'lg' }}
                    _active={{ transform: 'translateY(0)' }}
                    size={{ base: 'sm', md: 'md' }}
                    borderRadius="lg"
                    transition="all 0.2s"
                    px={6}
                  >
                    Save Changes
                  </Button>
                </HStack>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default Header;