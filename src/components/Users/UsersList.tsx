import React from 'react';
import {
  Box,
  Heading,
  Flex,
  Spinner,
  Card,
  Table,
  HStack,
  Text,
  Avatar,
  Select,
  Button,
  Input,
  Badge,
  IconButton,
  VStack,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  Dialog,
  Field
} from '@chakra-ui/react';
import { createListCollection } from '@chakra-ui/react';
import {
  Lock,
  Search,
  MoreVertical,
  Mail,
  Shield,
  Edit2,
  Trash2,
  Filter,
  Download,
  RefreshCw,
  Plus,
  UserPlus
} from 'lucide-react';
import type { User } from '../../types';
import { api } from '../../lib/api';

// Mock hooks and API for demo
const useAuth = () => ({
  user: { name: 'John Doe', email: 'john@example.com', role: 'admin' }
});

const hasPermission = (role: string, permission: string) => {
  const permissions: Record<string, string[]> = {
    admin: ['manage_users', 'read'],
    editor: ['read'],
    viewer: ['read']
  };
  return permissions[role?.toLowerCase()]?.includes(permission) || false;
};

const useData = () => ({
  data: [
    { id: '1', name: 'Alice Johnson', email: 'admin@cms.com', role: 'admin', status: 'active', lastActive: '2 hours ago' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'editor', status: 'active', lastActive: '1 day ago' },
    { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'viewer', status: 'inactive', lastActive: '1 week ago' },
    { id: '4', name: 'David Brown', email: 'david@example.com', role: 'editor', status: 'active', lastActive: '3 hours ago' },
  ],
  isLoading: false,
  refetch: () => {}
});

export const UsersList = () => {
  const { user } = useAuth();
  const { data: users, isLoading, refetch } = useData();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('all');
  const [isAddUserOpen, setIsAddUserOpen] = React.useState(false);
  const [newUser, setNewUser] = React.useState({ name: '', email: '', role: 'viewer' });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [userToEdit, setUserToEdit] = React.useState<User | null>(null);
  const [localUsers, setLocalUsers] = React.useState(users || []);

  
  React.useEffect(() => {
    if (users && localUsers.length === 0) {
      setLocalUsers(users);
    }
  }, [users, localUsers.length]); 

  const roleItems = React.useMemo(() => createListCollection({
    items: [
      { value: 'all', label: 'All Roles' },
      { value: 'admin', label: 'Admin' },
      { value: 'editor', label: 'Editor' },
      { value: 'viewer', label: 'Viewer' }
    ]
  }), []);

  const userRoleItems = React.useMemo(() => createListCollection({
    items: [
      { value: 'admin', label: 'Admin' },
      { value: 'editor', label: 'Editor' },
      { value: 'viewer', label: 'Viewer' }
    ]
  }), []);

  const getRoleBadgeColor = (role: string) => {
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

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' ? 'green' : 'gray';
  };


  const handleAddUser = async () => {
    // Basic validation
    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
    
      const createdUser = await api.createUser({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as 'admin' | 'editor' | 'viewer',
        status: 'active',
        lastActive: 'Just now'
      });

      setLocalUsers([...localUsers, createdUser]);
      setIsAddUserOpen(false);
      setNewUser({ name: '', email: '', role: 'viewer' });
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user. Please try again.');
    }
  };

  const handleDeleteUser = (id: string) => {
    console.log('Opening delete dialog for user:', id);
    setUserToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      console.log('Deleting user:', userToDelete);
      
      // Remove user from local state
      setLocalUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete));
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const saveEditUser = () => {
    if (userToEdit) {
      console.log('Saving user:', userToEdit);
      
      // Update user in local state
      setLocalUsers(prevUsers => prevUsers.map(u => 
        u.id === userToEdit.id ? { ...userToEdit } : u
      ));
      setIsEditDialogOpen(false);
      setUserToEdit(null);
    }
  };

  const filteredUsers = localUsers?.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (!user || !hasPermission(user.role, 'manage_users')) {
    return (
      <Flex align="center" justify="center" minH="500px" direction="column" gap={4}>
        <Box
          w="20"
          h="20"
          bg="gray.100"
          borderRadius="2xl"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Lock size={40} color="#9CA3AF" />
        </Box>
        <VStack gap={2}>
          <Heading size="lg" color="gray.800">Access Denied</Heading>
          <Text color="gray.500" fontSize="md" textAlign="center" maxW="md">
            You don't have permission to manage users. Please contact your administrator for access.
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Flex 
        justify="space-between" 
        align={{ base: 'stretch', md: 'center' }}
        mb={6}
        gap={4}
        direction={{ base: 'column', md: 'row' }}
      >
        <Box>
          <Heading size={{ base: 'lg', md: 'xl' }} fontWeight="black" color="gray.900">
            Users Management
          </Heading>
          <Text fontSize="sm" color="gray.600" mt={1}>
            Manage user accounts, roles, and permissions
          </Text>
        </Box>
        <HStack gap={2}>
          <IconButton
            aria-label="Refresh"
            variant="outline"
            size="md"
            borderRadius="lg"
            onClick={refetch}
            _hover={{ bg: 'gray.100' }}
          >
            <RefreshCw size={18} />
          </IconButton>
          <IconButton
            aria-label="Export"
            variant="outline"
            size="md"
            borderRadius="lg"
            _hover={{ bg: 'gray.100' }}
          >
            <Download size={18} />
          </IconButton>
          <Button
            bg="black"
            color="white"
            size="md"
            borderRadius="full"
            onClick={() => setIsAddUserOpen(true)}
            _hover={{ bg: 'gray.800', transform: 'translateY(-1px)', shadow: 'lg' }}
            _active={{ transform: 'translateY(0)' }}
            transition="all 0.2s"
            p={6}
          >
            <Plus size={18} />
            Add User
          </Button>
        </HStack>
      </Flex>

      {/* Filters and Search */}
      <Card.Root mb={6} bg="white" borderRadius="xl" shadow="sm">
        <Card.Body p={4}>
          <Flex gap={3} direction={{ base: 'column', md: 'row' }}>
            <Box flex={1} position="relative">
              <Box
                position="absolute"
                left={3}
                top="50%"
                transform="translateY(-50%)"
                color="black"
                pointerEvents="none"
                zIndex={1}
              >
                <Search size={18} />
              </Box>
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                pl={10}
                borderRadius="lg"
                border="2px solid"
                borderColor="gray.200"
                _focus={{ borderColor: 'black', shadow: '0 0 0 3px rgba(0,0,0,0.1)' }}
                bg="white"
              />
            </Box>
            <HStack gap={2}>
              <Box position="relative">
                <Box
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                  pointerEvents="none"
                >
                  <Filter size={16} />
                </Box>
                <Select.Root
                  collection={roleItems}
                  value={[roleFilter]}
                  onValueChange={(e) => setRoleFilter(e.value[0])}
                  size="md"
                  width={{ base: 'full', md: '200px' }}
                >
                  <Select.Trigger pl={9} borderRadius="lg">
                    <Select.ValueText placeholder="Filter by role" />
                  </Select.Trigger>
                  <Select.Content>
                    {roleItems.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Box>
            </HStack>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* Users Table */}
      {isLoading ? (
        <Flex justify="center" align="center" minH="400px">
          <VStack gap={4}>
            <Spinner size="xl" color="black" />
            <Text color="gray.600" fontSize="sm">Loading users...</Text>
          </VStack>
        </Flex>
      ) : (
        <Box overflowX="auto">
          <Card.Root shadow="md" borderRadius="xl" overflow="hidden" minW="800px">
            <Table.Root variant="outline" size="lg">
              <Table.Header bg="gray.50">
                <Table.Row>
                  <Table.ColumnHeader fontWeight="bold" color="gray.700" fontSize="sm" px={6}>
                    USER
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold" color="gray.700" fontSize="sm" px={6}>
                    CONTACT
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold" color="gray.700" fontSize="sm" px={6}>
                    ROLE
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold" color="gray.700" fontSize="sm" px={6}>
                    STATUS
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold" color="gray.700" fontSize="sm" px={6}>
                    LAST ACTIVE 
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold" color="gray.700" fontSize="sm" textAlign="right" px={6}>
                    ACTIONS
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredUsers?.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={6} textAlign="center" py={12} >
                      <VStack gap={3}>
                        <Box
                          w="16"
                          h="16"
                          bg="gray.100"
                          borderRadius="2xl"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Search size={32} color="#9CA3AF" />
                        </Box>
                        <Text color="gray.500" fontSize="md" fontWeight="500">
                          No users found
                        </Text>
                        <Text color="gray.400" fontSize="sm">
                          Try adjusting your search or filters
                        </Text>
                      </VStack>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  filteredUsers?.map(u => (
                    <Table.Row 
                      key={u.id} 
                      _hover={{ bg: 'gray.50' }}
                      transition="background 0.2s"
                    >
                      <Table.Cell>
                        <HStack gap={3}>
                          <Avatar.Root 
                            size="md"
                            bg="black"
                            m={4}
                          >
                            <Avatar.Fallback
                              color="white"
                              fontWeight="bold"
                              fontSize="sm"

                            >
                              {u.name.split(' ').map(n => n[0]).join('')}
                            </Avatar.Fallback>
                          </Avatar.Root>
                          <Box>
                            <Text fontWeight="600" color="gray.900" fontSize="sm">
                              {u.name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              ID: {u.id}
                            </Text>
                          </Box>
                        </HStack>
                      </Table.Cell>
                      <Table.Cell>
                        <HStack gap={2}>
                          <Box
                            w="7"
                            h="7"
                            bg="gray.100"
                            borderRadius="lg"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Mail size={14} color="#6B7280" />
                          </Box>
                          <Text color="gray.700" fontSize="sm">{u.email}</Text>
                        </HStack>
                      </Table.Cell>
                      <Table.Cell>
                        <Select.Root
                          collection={userRoleItems}
                          value={[u.role]}
                          onValueChange={(e) => {
                            const newRole = e.value[0];
                            setLocalUsers(localUsers.map(user => 
                              user.id === u.id ? { ...user, role: newRole } : user
                            ));
                          }}
                          size="sm"
                          width="140px"
                        >
                          <Select.Trigger borderRadius="full" px={3} py={1}>
                            <HStack gap={2} >
                              <Shield size={14} />
                              <Select.ValueText  />
                            </HStack>
                          </Select.Trigger>
                          <Select.Content>
                            {userRoleItems.items.map((item) => (
                              <Select.Item key={item.value} item={item}>
                                <Badge
                                  colorScheme={getRoleBadgeColor(item.value)}
                                  fontSize="xs"
                                  px={2}
                                  py={1}
                                  borderRadius="full"
                                  fontWeight="600"
                                
                                >
                                  {item.label}
                                </Badge>
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          colorScheme={getStatusBadgeColor(u.status)}
                          fontSize="xs"
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontWeight="600"
                          textTransform="capitalize"
                          m={4}
                          
                        >
                          {u.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Text fontSize="sm" color="gray.600" m={4}>
                          {u.lastActive}
                        </Text>
                      </Table.Cell>
                      <Table.Cell textAlign="right" m={4}>
                        <HStack gap={2} justify="flex-end">
                          <IconButton
                            aria-label="Edit user"
                            size="sm"
                            variant="ghost"
                            borderRadius="lg"
                            
                            _hover={{ bg: 'gray.100' }}
                            onClick={() => {
                              const user = localUsers.find(user => user.id === u.id);
                              if (user) {
                                setUserToEdit(user as User);
                                setIsEditDialogOpen(true);
                              }
                            }}
                          >
                            <Edit2 size={16} />
                          </IconButton>
                          <MenuRoot>
                            <MenuTrigger asChild>
                              <IconButton
                                aria-label="More options"
                                size="sm"
                                variant="ghost"
                                borderRadius="lg"
                                _hover={{ bg: 'gray.100' }}
                              >
                                <MoreVertical size={16} />
                              </IconButton>
                            </MenuTrigger>
                            <MenuContent minW="180px" borderRadius="lg" p={1}>
                              <MenuItem
                                value="edit"
                                borderRadius="md"
                                _hover={{ bg: 'gray.50' }}
                                onClick={() => {
                                  const user = localUsers.find(user => user.id === u.id);
                                  if (user) {
                                    setUserToEdit(user as User);
                                    setIsEditDialogOpen(true);
                                  }
                                }}
                              >
                                <HStack gap={2}>
                                  <Edit2 size={14} />
                                  <Text fontSize="sm">Edit Profile</Text>
                                </HStack>
                              </MenuItem>
                              <MenuItem
                                value="delete"
                                onClick={() => handleDeleteUser(u.id)}
                                borderRadius="md"
                                _hover={{ bg: 'red.50' }}
                                color="red.600"
                              >
                                <HStack gap={2}>
                                  <Trash2 size={14} />
                                  <Text fontSize="sm">Delete User</Text>
                                </HStack>
                              </MenuItem>
                            </MenuContent>
                          </MenuRoot>
                        </HStack>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Card.Root>

          {/* Results Summary */}
          {filteredUsers && filteredUsers.length > 0 && (
            <Flex justify="space-between" align="center" mt={4} px={2}>
              <Text fontSize="sm" color="gray.600">
                Showing <strong>{filteredUsers.length}</strong> of <strong>{localUsers?.length}</strong> users
              </Text>
              <Text fontSize="sm" color="gray.500">
                Page 1 of 1
              </Text>
            </Flex>
          )}
        </Box>
      )}

      {/* Add User Dialog */}
      <Dialog.Root open={isAddUserOpen} onOpenChange={(e) => setIsAddUserOpen(e.open)}>
        <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <Dialog.Positioner style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}>
          <Dialog.Content borderRadius="2xl" maxW="500px" shadow="2xl">
            <Dialog.Header borderBottomWidth="1px" borderColor="gray.100" pb={4} p={6}>
              <HStack gap={3}>
                <Box
                  w="12"
                  h="12"
                  bg="black"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                
                >
                  <UserPlus size={22} color="white" />
                </Box>
                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="gray.900">
                    Add New User
                  </Text>
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    Create a new user account
                  </Text>
                </Box>
              </HStack>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            
            <Dialog.Body px={6} py={6}>
              <VStack gap={5} align="stretch">
                <Field.Root>
                  <Field.Label fontWeight="600" color="gray.700" mb={2}>
                    Full Name
                  </Field.Label>
                  <Input
                    placeholder="Enter full name"
                    p={2}
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'black', shadow: '0 0 0 3px rgba(0,0,0,0.1)' }}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="600" color="gray.700" mb={2}>
                    Email Address
                  </Field.Label>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'black', shadow: '0 0 0 3px rgba(0,0,0,0.1)' }}
                    p={2}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="600" color="gray.700" mb={2}>
                    Role
                  </Field.Label>
                  <Select.Root
                    collection={userRoleItems}
                    value={[newUser.role]}
                    onValueChange={(e) => setNewUser({ ...newUser, role: e.value[0] })}
                  >
                    <Select.Trigger borderRadius="xl" px={4} py={2}>
                      <Select.ValueText />
                    </Select.Trigger>
                    <Select.Content>
                      {userRoleItems.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          {item.label}
                        </Select.Item> 
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Field.Root>
              </VStack>
            </Dialog.Body>
            
            <Dialog.Footer px={6} py={4} borderTopWidth="1px" borderColor="gray.100">
              <HStack gap={3} w="full" justify="flex-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddUserOpen(false)}
                  borderRadius="lg"
                  borderWidth="2px"
                  p={4}
                >
                  Cancel
                </Button>
                <Button 
                  bg="black" 
                  color="white" 
                  onClick={handleAddUser}
                  _hover={{ bg: 'gray.800', transform: 'translateY(-1px)', shadow: 'lg' }}
                  _active={{ transform: 'translateY(0)' }}
                  borderRadius="lg"
                  transition="all 0.2s"
                  p={4}
                >
                  Add User
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={isDeleteDialogOpen} onOpenChange={(e) => setIsDeleteDialogOpen(e.open)}>
        <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <Dialog.Positioner style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}>
          <Dialog.Content borderRadius="2xl" maxW="400px" shadow="2xl">
            <Dialog.Header borderBottomWidth="1px" borderColor="gray.100" pb={4} p={4}>
              <Text fontSize="xl" fontWeight="bold" color="gray.900">
                Delete User
              </Text>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            
            <Dialog.Body px={6} py={6}>
              <Text color="gray.700">
                Are you sure you want to delete this user? This action cannot be undone.
              </Text>
            </Dialog.Body>
            
            <Dialog.Footer px={6} py={4} borderTopWidth="1px" borderColor="gray.100">
              <HStack gap={3} w="full" justify="flex-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteDialogOpen(false)}
                  borderRadius="lg"
                  borderWidth="2px"
                  p={4}
                >
                  Cancel
                </Button>
                <Button 
                  bg="red.600" 
                  color="white" 
                  onClick={confirmDelete}
                  _hover={{ bg: 'red.700' }}
                  borderRadius="lg"
                  p={4} 
                >
                  Delete
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {/* Edit User Dialog */}
      <Dialog.Root open={isEditDialogOpen} onOpenChange={(e) => setIsEditDialogOpen(e.open)}>
        <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <Dialog.Positioner style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}>
          <Dialog.Content borderRadius="2xl" maxW="500px" shadow="2xl">
            <Dialog.Header borderBottomWidth="1px" borderColor="gray.100" pb={4} p={6}>
              <Text fontSize="xl" fontWeight="bold" color="gray.900">
                Edit User
              </Text>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            
            <Dialog.Body px={6} py={6}>
              <VStack gap={5} align="stretch">
                <Field.Root>
                  <Field.Label fontWeight="600" color="gray.700" mb={2}>
                    Full Name
                  </Field.Label>
                  <Input
                    placeholder="Enter full name"
                    value={userToEdit?.name || ''}
                    onChange={(e) => setUserToEdit(userToEdit ? { ...userToEdit, name: e.target.value } : null)}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'black', shadow: '0 0 0 3px rgba(0,0,0,0.1)' }}
                    p={2}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="600" color="gray.700" mb={2}>
                    Email Address
                  </Field.Label>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={userToEdit?.email || ''}
                    onChange={(e) => setUserToEdit(userToEdit ? { ...userToEdit, email: e.target.value } : null)}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'black', shadow: '0 0 0 3px rgba(0,0,0,0.1)' }}
                    p={2}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="600" color="gray.700" mb={2}>
                    Role
                  </Field.Label>
                  <Select.Root
                    collection={userRoleItems}
                    value={userToEdit?.role ? [userToEdit.role] : []}
                    onValueChange={(e) => setUserToEdit(userToEdit ? { ...userToEdit, role: e.value[0] as 'admin' | 'editor' | 'viewer' } : null)}
                  >
                    <Select.Trigger borderRadius="xl" px={4} py={2}>
                      <Select.ValueText />
                    </Select.Trigger>
                    <Select.Content>
                      {userRoleItems.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          {item.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Field.Root>
              </VStack>
            </Dialog.Body>
            
            <Dialog.Footer px={6} py={4} borderTopWidth="1px" borderColor="gray.100">
              <HStack gap={3} w="full" justify="flex-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  borderRadius="lg"
                  borderWidth="2px"
                  p={4}
                >
                  Cancel
                </Button>
                <Button 
                  bg="black" 
                  color="white" 
                  onClick={saveEditUser}
                  _hover={{ bg: 'gray.800' }}
                  borderRadius="lg"
                  p={4} 
                >
                  Save Changes
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
};

export default UsersList;