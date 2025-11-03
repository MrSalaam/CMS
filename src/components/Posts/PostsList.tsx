import React from 'react';
import {
  Box,
  Card,
  Flex,
  Text,
  Input,
  Button,
  HStack,
  VStack,
  Badge,
  IconButton,
  Spinner,
  Table,
  Field,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  Dialog,
  Select,
  createListCollection,
} from '@chakra-ui/react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  MoreVertical,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../hooks/useData';
import { api } from '../../lib/api';
import type { Post } from '../../types';


export const PostsList: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [isAddPostOpen, setIsAddPostOpen] = React.useState(false);
  const [newPost, setNewPost] = React.useState({
    title: '',
    author: user?.name || '',
    status: 'draft' as 'draft' | 'published'
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [postToDelete, setPostToDelete] = React.useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [postToEdit, setPostToEdit] = React.useState<Post | null>(null);
  console.log('postToEdit:', postToEdit);
  const { data: posts, isLoading } = useData(api.getPosts);
  const [localPosts, setLocalPosts] = React.useState<Post[]>([]);

  
  React.useEffect(() => {
    if (posts && localPosts.length === 0) {
      setLocalPosts(posts);
    }
  }, [posts, localPosts.length]);

  const statusItems = React.useMemo(() => createListCollection({
    items: [
      { value: 'all', label: 'All Status' },
      { value: 'published', label: 'Published' },
      { value: 'draft', label: 'Draft' },
      { value: 'scheduled', label: 'Scheduled' }
    ]
  }), []);

  const postStatusItems = React.useMemo(() => createListCollection({
    items: [
      { value: 'published', label: 'Published' },
      { value: 'draft', label: 'Draft' },
      { value: 'scheduled', label: 'Scheduled' }
    ]
  }), []);


  const categoryItems = React.useMemo(() => createListCollection({
    items: [
      { value: 'all', label: 'All Categories' },
      { value: 'Tutorial', label: 'Tutorial' },
      { value: 'Development', label: 'Development' },
      { value: 'Design', label: 'Design' },
      { value: 'Backend', label: 'Backend' }
    ]
  }), []);


  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return 'green';
      case 'draft':
        return 'gray';
      case 'scheduled':
        return 'orange';
      default:
        return 'gray';
    }
  };


  const handleAddPost = () => {
    const newPostData: Post = {
      id: String(Date.now()),
      title: newPost.title,
      content: '',
      status: newPost.status as 'draft' | 'published',
      authorId: user?.id || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setLocalPosts([...localPosts, newPostData]);
    setIsAddPostOpen(false);
    setNewPost({
      title: '',
      author: user?.name || '',
      status: 'draft'
    });

    console.log('Post created successfully');
  };

  const handleDeletePost = (id: string) => {
    setPostToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      setLocalPosts(prevPosts => prevPosts.filter(p => p.id !== postToDelete));
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
      
      console.log('Post deleted successfully');
    }
  };

  const handleEditPost = (postId: string) => {
    const post = localPosts.find(p => p.id === postId);
    if (post) {
      setPostToEdit({ ...post });
      setIsEditDialogOpen(true);
    }
  };

  const saveEditPost = () => {
    if (postToEdit) {
      setLocalPosts(prevPosts => prevPosts.map(p => 
        p.id === postToEdit.id ? { ...postToEdit } : p
      ));
      setIsEditDialogOpen(false);
      setPostToEdit(null);
      
      console.log('Post updated successfully');
    }
  };

  const filteredPosts = localPosts?.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


  
  if (!user) {
    return (
      <Flex align="center" justify="center" minH="500px" direction="column" gap={4}>
        <Text fontSize="48px" color="gray"></Text>
        <Text fontSize="lg" color="gray.600">
          You need to be logged in to access this page
        </Text>
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
          <Text fontSize="2xl" fontWeight="bold" color="gray.900" mb={1}>
            {user.role === 'viewer' ? 'Posts View' : 'Posts Management'}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {user.role === 'viewer' ? 'View all posts' : 'Manage and organize your content'}
          </Text>
        </Box>
        
       
        {(user.role === 'admin' || user.role === 'editor') && (
          <Button
            bg="black"
            color="white"
            size="lg"
            borderRadius="full"
            px={4}
            fontWeight="600"
            _hover={{ bg: 'gray.800', transform: 'translateY(-2px)', shadow: 'lg' }}
            transition="all 0.2s"
            onClick={() => setIsAddPostOpen(true)}
          >
            <Plus size={20} />
            <Text ml={2}>New Post</Text>
          </Button>
        )}
      </Flex>

      
      <Card.Root mb={6} bg="white" borderRadius="xl" shadow="sm">
        <Card.Body p={6}>
          <Flex gap={4} direction={{ base: 'column', lg: 'row' }}>
            {/* Search */}
            <Box flex="1" position="relative">
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="lg"
                borderRadius="xl"
                border="2px solid"
                borderColor="gray.200"
                _focus={{ borderColor: 'black', shadow: '0 0 0 3px rgba(0,0,0,0.1)' }}
                ps={12}
              />
              <Box position="absolute" left={4} top="48%" transform="translateY(-50%)">
                <Search size={20} color="gray" />
              </Box>
            </Box>

           
            <Box w={{ base: 'full', lg: '200px' }}>
              <Select.Root
                collection={statusItems}
                value={[statusFilter]}
                onValueChange={(e) => setStatusFilter(e.value[0])}
                size="lg"
              >
                <Select.Trigger borderRadius="xl">
                  <HStack gap={2} pl={2}>
                    <Filter size={16} />
                    <Select.ValueText />
                  </HStack>
                </Select.Trigger>
                <Select.Content>
                  {statusItems.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>

            
            <Box w={{ base: 'full', lg: '200px' }}>
              <Select.Root
                collection={categoryItems}
                value={[categoryFilter]}
                onValueChange={(e) => setCategoryFilter(e.value[0])}
                size="lg"
              >
                <Select.Trigger borderRadius="xl">
                  <HStack gap={2} pl={2}>
                    <FileText size={16} />
                    <Select.ValueText />
                  </HStack>
                </Select.Trigger>
                <Select.Content>
                  {categoryItems.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>
          </Flex>
        </Card.Body>
      </Card.Root>

     
      {isLoading ? (
        <Flex justify="center" align="center" minH="400px">
          <Spinner size="xl" color="black"  />
        </Flex>
      ) : (
        <Box overflowX="auto">
          <Card.Root bg="white" borderRadius="xl" shadow="sm">
            <Table.Root size="lg" variant="outline" showColumnBorder>
              <Table.Header bg="gray.50" px={6} py={4}>
                <Table.Row>
                  <Table.ColumnHeader fontWeight="700" color="gray.700" py={4} px={6}>
                    Post Title
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="700" color="gray.700" py={4} px={6}>
                    Author
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="700" color="gray.700"  py={4} px={6}>
                    Status
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="700" color="gray.700"  py={4} px={6}>
                    Created At
                  </Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="700" color="gray.700"  py={4} px={6}>
                    Last Updated
                  </Table.ColumnHeader>
              
                  {(user.role === 'admin' || user.role === 'editor') && (
                    <Table.ColumnHeader fontWeight="700" color="gray.700" textAlign="center">
                      Actions
                    </Table.ColumnHeader>
                  )}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredPosts?.map((post) => (
                  <Table.Row key={post.id} _hover={{ bg: 'gray.50' }}>
                    <Table.Cell py={4}>
                      <VStack align="left" gap={1} px={6}>
                        <Text fontWeight="600" color="gray.900" >
                          {post.title}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          ID: {post.id}
                        </Text>
                      </VStack>
                    </Table.Cell>
                    <Table.Cell px={6}>
                      <Text color="gray.700">{post.authorId}</Text>
                    </Table.Cell>
                    <Table.Cell px={6}>
                     
                      {(user.role === 'admin' || user.role === 'editor') ? (
                        <Select.Root
                          collection={postStatusItems}
                          value={[post.status]}
                          onValueChange={(e) => {
                            const newStatus = e.value[0];
                            setLocalPosts(prevPosts => prevPosts.map(p => 
                              p.id === post.id ? { ...p, status: newStatus as 'draft' | 'published' } : p
                            ));
                          }}
                          size="sm"
                          width="140px"
                        >
                          <Select.Trigger borderRadius="full" px={3} py={1}>
                            <Select.ValueText  />
                          </Select.Trigger>
                          <Select.Content>
                            {postStatusItems.items.map((item) => (
                              <Select.Item key={item.value} item={item}>
                                <Badge
                                  colorScheme={getStatusBadgeColor(item.value)}
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
                      ) : (
                        <Badge
                          colorScheme={getStatusBadgeColor(post.status)}
                          fontSize="xs"
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontWeight="600"
                        >
                          {post.status}
                        </Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell px={6}>
                      <Text fontSize="sm" color="gray.600">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Text>
                    </Table.Cell>
                    <Table.Cell px={6}>
                      <Text fontSize="sm" color="gray.600">
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </Text>
                    </Table.Cell>
                   
                    {(user.role === 'admin' || user.role === 'editor') && (
                      <Table.Cell textAlign="right">
                        <HStack gap={4} justify="flex-end">
                          {/* Edit button for admin and editor */}
                          <IconButton
                            aria-label="Edit post"
                            size="sm"
                            variant="ghost"
                            borderRadius="lg"
                            _hover={{ bg: 'gray.100' }}
                            onClick={() => handleEditPost(post.id)}
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
                            <MenuContent minW="180px" borderRadius="lg" p={1} gap={1}>
                              
                              <MenuItem
                                value="edit"
                                borderRadius="md"
                                _hover={{ bg: 'gray.50' }}
                                onClick={() => handleEditPost(post.id)}
                              >
                                <HStack gap={2}>
                                  <Edit2 size={14} />
                                  <Text fontSize="sm">Edit Post</Text>
                                </HStack>
                              </MenuItem>
                              
                            
                              {user.role === 'admin' && (
                                <MenuItem
                                  value="delete"
                                  onClick={() => handleDeletePost(post.id)}
                                  borderRadius="md"
                                  _hover={{ bg: 'red.50' }}
                                  color="red.600"
                                >
                                  <HStack gap={2}>
                                    <Trash2 size={14} />
                                    <Text fontSize="sm">Delete Post</Text>
                                  </HStack>
                                </MenuItem>
                              )}
                            </MenuContent>
                          </MenuRoot>
                        </HStack>
                      </Table.Cell>
                    )}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card.Root>

          
          {filteredPosts && filteredPosts.length > 0 && (
            <Flex justify="space-between" align="center" mt={4} px={2}>
              <Text fontSize="sm" color="gray.600">
                Showing <strong>{filteredPosts.length}</strong> of <strong>{localPosts?.length}</strong> posts
              </Text>
              <Text fontSize="sm" color="gray.500">
                Page 1 of 1
              </Text>
            </Flex>
          )}
        </Box>
      )}

  
      <Dialog.Root open={isAddPostOpen} onOpenChange={(e) => setIsAddPostOpen(e.open)}>
        <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <Dialog.Positioner style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Dialog.Content borderRadius="2xl" maxW="500px" shadow="2xl">
            <Dialog.Header borderBottomWidth="1px" borderColor="gray.100" py={4} px={6}>
              <Text fontSize="xl" fontWeight="bold" color="gray.900">
                Create New Post
              </Text>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            
            <Dialog.Body px={6} py={6}>
              <VStack gap={5} align="stretch">
                <Field.Root>
                  <Field.Label fontWeight="600" color="gray.700" mb={2}>
                    Post Title
                  </Field.Label>
                  <Input
                    placeholder="Enter post title"
                    px={2}
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'black', shadow: '0 0 0 3px rgba(0,0,0,0.1)' }}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="600" color="gray.700" mb={2}>
                    Author
                  </Field.Label>
                  <Input
                    placeholder="Enter author name"
                    px={2}
                    value={newPost.author}
                    onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'black', shadow: '0 0 0 3px rgba(0,0,0,0.1)' }}
                  />
                </Field.Root>


                <Field.Root>
                  <Field.Label fontWeight="600" color="gray.700" mb={2}>
                    Status
                  </Field.Label>
                  <Select.Root
                    collection={postStatusItems}
                    value={[newPost.status]}
                    onValueChange={(e) => setNewPost({ ...newPost, status: e.value[0] as 'draft' | 'published' })}
                  >
                    <Select.Trigger borderRadius="xl" px={2}>
                      <Select.ValueText />
                    </Select.Trigger>
                    <Select.Content>
                      {postStatusItems.items.map((item) => (
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
                  onClick={() => setIsAddPostOpen(false)}
                  borderRadius="lg"
                  borderWidth="2px"
                  p={4}
                >
                  Cancel
                </Button>
                <Button 
                  bg="black" 
                  color="white" 
                  onClick={handleAddPost}
                  _hover={{ bg: 'gray.800' }}
                  borderRadius="lg"
                  p={4}
                >
                  Create Post
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      
      <Dialog.Root open={isDeleteDialogOpen} onOpenChange={(e) => setIsDeleteDialogOpen(e.open)}>
        <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <Dialog.Positioner style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Dialog.Content borderRadius="2xl" maxW="400px" shadow="2xl">
            <Dialog.Header borderBottomWidth="1px" borderColor="gray.100" py={4} px={6}>
              <Text fontSize="xl" fontWeight="bold" color="gray.900">
                Delete Post
              </Text>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            
            <Dialog.Body px={6} py={6}>
              <Text color="gray.700">
                Are you sure you want to delete this post? This action cannot be undone.
              </Text>
            </Dialog.Body>
            
            <Dialog.Footer px={6} py={4} borderTopWidth="1px" borderColor="gray.100">
              <HStack gap={3} w="full" justify="flex-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteDialogOpen(false)}
                  borderRadius="lg"
                  borderWidth="2px"
                  p={2}
                >
                  Cancel
                </Button>
                <Button 
                  bg="red.600" 
                  color="white" 
                  onClick={confirmDelete}
                  _hover={{ bg: 'red.700' }}
                  borderRadius="lg"
                  p={2}
                >
                  Delete
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

     
      <Dialog.Root open={isEditDialogOpen} onOpenChange={(e) => setIsEditDialogOpen(e.open)}>
        <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <Dialog.Positioner  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Dialog.Content borderRadius="2xl" maxW="500px" shadow="2xl">
            <Dialog.Header borderBottomWidth="1px" borderColor="gray.100" py={4} px={6}>
              <Text fontSize="xl" fontWeight="bold" color="gray.900">
                Edit Post
              </Text>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            
            <Dialog.Body px={6} py={6}>
              <VStack gap={5} align="stretch">
                <Field.Root>
                  <Field.Label fontWeight="600" color="gray.700" mb={2}>
                    Post Title
                  </Field.Label>
                  <Input
                    placeholder="Enter post title"
                    value={postToEdit?.title || ''}
                    onChange={(e) => setPostToEdit(postToEdit ? { ...postToEdit, title: e.target.value } : null)}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'black', shadow: '0 0 0 3px rgba(0,0,0,0.1)' }}
                    p={2}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="600" color="gray.700" mb={2}>
                    Author
                  </Field.Label>
                  <Input
                    placeholder="Enter author name"
                    value={postToEdit?.authorId || ''}
                    onChange={(e) => setPostToEdit(postToEdit ? { ...postToEdit, authorId: e.target.value } : null)}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'black', shadow: '0 0 0 3px rgba(0,0,0,0.1)' }}
                    p={2}
                  />
                </Field.Root>


                <Field.Root>
                  <Field.Label fontWeight="600" color="gray.700" mb={2}>
                    Status
                  </Field.Label>
                  <Select.Root
                    collection={postStatusItems}
                    value={postToEdit?.status ? [postToEdit.status] : []}
                    onValueChange={(e) => setPostToEdit(postToEdit ? { ...postToEdit, status: e.value[0] as 'draft' | 'published' } : null)}
                  
                  >
                    <Select.Trigger borderRadius="xl" p={2}>
                      <Select.ValueText />
                    </Select.Trigger>
                    <Select.Content>
                      {postStatusItems.items.map((item) => (
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
                  p={2}
                >
                  Cancel
                </Button>
                <Button 
                  bg="black" 
                  color="white" 
                  onClick={saveEditPost}
                  _hover={{ bg: 'gray.800' }}
                  borderRadius="lg"
                  p={2}
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

export default PostsList;