import React from 'react';
import { Box, Card, VStack, Field, Input, Textarea, Select, Button, HStack, Heading } from '@chakra-ui/react';
import { createListCollection } from '@chakra-ui/react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import type { Post } from '../../types';

export const PostFormModal: React.FC<{ isOpen: boolean; onClose: () => void; post?: Post; onSuccess: () => void }> = ({ isOpen, onClose, post, onSuccess }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [title, setTitle] = React.useState(post?.title || '');
  const [content, setContent] = React.useState(post?.content || '');
  const [status, setStatus] = React.useState<'draft' | 'published'>(post?.status || 'draft');

  const statusItems = React.useMemo(() => createListCollection({
    items: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' }
    ]
  }), []);

  React.useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setStatus(post.status);
    } else {
      setTitle('');
      setContent('');
      setStatus('draft');
    }
  }, [post]);

  const handleSubmit = async () => {
    if (!title || !content) {
      alert('Please fill all fields');
      return;
    }
    setIsLoading(true);
    try {
      if (post) {
        await api.updatePost(post.id, { title, content, status });
        alert('Post updated successfully');
      } else {
        await api.createPost({ title, content, status, authorId: user!.id });
        alert('Post created successfully');
      }
      onSuccess();
      onClose();
    } catch {
      alert('Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0,0,0,0.6)"
      backdropFilter="blur(4px)"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={onClose}
      p={4}
    >
      <Card.Root
        maxW="600px"
        w="full"
        shadow="2xl"
        borderRadius="2xl"
        overflow="hidden"
        onClick={(e) => e.stopPropagation()}
        border="1px solid"
        borderColor="whiteAlpha.200"
      >
        <Card.Header bg="blue.50" borderBottomWidth="1px" borderColor="blue.100" py={6}>
          <Heading size="lg" color="blue.800" textAlign="center">
            {post ? 'Edit Post' : 'Create New Post'}
          </Heading>
        </Card.Header>
        <Card.Body p={8}>
          <VStack gap={6}>
            <Field.Root>
              <Field.Label>Title</Field.Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} size="lg" />
            </Field.Root>
            <Field.Root>
              <Field.Label>Content</Field.Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} size="lg" />
            </Field.Root>
            <Field.Root>
              <Field.Label>Status</Field.Label>
              <Select.Root
                collection={statusItems}
                value={[status]}
                onValueChange={(e) => setStatus(e.value[0] as 'draft' | 'published')}
                size="lg"
              >
                <Select.Trigger>
                  <Select.ValueText placeholder="Select status" />
                </Select.Trigger>
                <Select.Positioner />
                <Select.Content>
                  {statusItems.items.map((item) => (
                    <Select.Item key={item.value} item={item}>{item.label}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Field.Root>
            <HStack gap={4} w="full" justify="end" pt={4}>
              <Button
                variant="outline"
                onClick={onClose}
                size="lg"
                borderRadius="lg"
                _hover={{ bg: 'gray.50' }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                loading={isLoading}
                loadingText={post ? 'Updating...' : 'Creating...'}
                size="lg"
                borderRadius="lg"
                shadow="md"
                _hover={{ shadow: 'lg', transform: 'translateY(-1px)' }}
                transition="all 0.2s"
              >
                {post ? 'Update Post' : 'Create Post'}
              </Button>
            </HStack>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Box>
  );
};