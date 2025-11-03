import React from 'react';
import { Box, Flex, Container, VStack, Text, SimpleGrid, Card, HStack, Badge } from '@chakra-ui/react';
import { FileText, Users, TrendingUp, Activity, Calendar } from 'lucide-react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { PostsList } from './Posts/PostsList';
import { UsersList } from './Users/UsersList';
import { usePosts } from '../hooks/usePosts';
import { useUsers } from '../hooks/useUsers';

const StatsCard: React.FC<{ 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  color: string;
  subtitle?: string;
  badge?: string;
}> = ({ title, value, icon, color, subtitle, badge }) => (
  <Card.Root 
    bg="white" 
    borderRadius="xl" 
    shadow="sm" 
    overflow="hidden" 
    transition="all 0.2s"
    _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
  >
    <Card.Body p={6}>
      <Flex align="center" justify="space-between" mb={4}>
        <Box 
          p={3} 
          bg={`${color}.50`} 
          borderRadius="lg"
        >
          <Box color={color}>
            {icon}
          </Box>
        </Box>
        {badge && (
          <Badge 
            colorScheme="green" 
            fontSize="xs" 
            px={2} 
            py={1} 
            borderRadius="full"
            fontWeight="600"
          >
            {badge}
          </Badge>
        )}
      </Flex>
      <Box>
        <Text fontSize="sm" color="gray.600" fontWeight="500" mb={1}>
          {title}
        </Text>
        <Text fontSize="3xl" fontWeight="bold" color="gray.900" mb={1}>
          {value}
        </Text>
        {subtitle && (
          <Text fontSize="xs" color="gray.500">
            {subtitle}
          </Text>
        )}
      </Box>
    </Card.Body>
  </Card.Root>
);

const ActivityCard: React.FC = () => {
  const activities = [
    { user: 'Alice Johnson', action: 'published', item: 'Getting Started with React', time: '2 hours ago', type: 'post' },
    { user: 'Bob Smith', action: 'created', item: 'New user account', time: '5 hours ago', type: 'user' },
    { user: 'Carol White', action: 'updated', item: 'UI/UX Best Practices', time: '1 day ago', type: 'post' },
    { user: 'David Brown', action: 'scheduled', item: 'Database Optimization Tips', time: '2 days ago', type: 'post' },
  ];

  return (
    <Card.Root bg="white" borderRadius="xl" shadow="sm">
      <Card.Body p={6}>
        <Flex align="center" justify="space-between" mb={4}>
          <Text fontSize="lg" fontWeight="bold" color="gray.900">
            Recent Activity
          </Text>
          <Badge colorScheme="gray" fontSize="xs" px={2} py={1} borderRadius="full">
            Last 7 days
          </Badge>
        </Flex>
        <VStack gap={4} align="stretch">
          {activities.map((activity, index) => (
            <Flex 
              key={index} 
              p={4} 
              bg="gray.50" 
              borderRadius="lg"
              align="center"
              gap={4}
              transition="all 0.2s"
              _hover={{ bg: 'gray.100' }}
            >
              <Box 
                p={2} 
                bg={activity.type === 'post' ? 'blue.50' : 'purple.50'} 
                borderRadius="lg"
              >
                {activity.type === 'post' ? (
                  <FileText size={16} color={activity.type === 'post' ? '#3182CE' : '#805AD5'} />
                ) : (
                  <Users size={16} color="#805AD5" />
                )}
              </Box>
              <Box flex="1">
                <Text fontSize="sm" color="gray.900" fontWeight="600">
                  {activity.user}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  {activity.action} <Text as="span" fontWeight="500">{activity.item}</Text>
                </Text>
              </Box>
              <HStack gap={2}>
                <Calendar size={12} color="gray" />
                <Text fontSize="xs" color="gray.500">
                  {activity.time}
                </Text>
              </HStack>
            </Flex>
          ))}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

const QuickStatsCard: React.FC = () => {
  const stats = [
    { label: 'Published Today', value: '12', trend: '+5%' },
    { label: 'Total Views', value: '2.4K', trend: '+12%' },
    { label: 'Avg. Read Time', value: '3.5m', trend: '-2%' },
  ];

  return (
    <Card.Root bg="white" borderRadius="xl" shadow="sm">
      <Card.Body p={6}>
        <Text fontSize="lg" fontWeight="bold" color="gray.900" mb={4}>
          Quick Stats
        </Text>
        <VStack gap={4} align="stretch">
          {stats.map((stat, index) => (
            <Flex key={index} justify="space-between" align="center">
              <Box>
                <Text fontSize="xs" color="gray.600" mb={1}>
                  {stat.label}
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="gray.900">
                  {stat.value}
                </Text>
              </Box>
              <Badge 
                colorScheme={stat.trend.startsWith('+') ? 'green' : 'red'} 
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="full"
              >
                {stat.trend}
              </Badge>
            </Flex>
          ))}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('posts');
  const { data: posts } = usePosts();
  const { data: users } = useUsers();

  const stats = [
    {
      title: 'Total Posts',
      value: posts?.length.toString() || '0',
      icon: <FileText size={24} />,
      color: 'blue',
      subtitle: `${posts?.filter(p => p.status === 'published').length || 0} published`,
      badge: '+12%'
    },
    {
      title: 'Total Users',
      value: users?.length.toString() || '0',
      icon: <Users size={24} />,
      color: 'purple',
      subtitle: `${users?.filter(u => u.role === 'admin').length || 0} admins`,
      badge: '+5%'
    },
    {
      title: 'Published',
      value: posts?.filter(p => p.status === 'published').length.toString() || '0',
      icon: <TrendingUp size={24} />,
      color: 'green',
      subtitle: 'Live content',
      badge: '+8%'
    },
    {
      title: 'Draft Posts',
      value: posts?.filter(p => p.status === 'draft').length.toString() || '0',
      icon: <Activity size={24} />,
      color: 'orange',
      subtitle: 'Work in progress'
    }
  ];

  return (
    <Box bg="gray.50" minH="100vh">
      <Header />
      <Flex>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <Box 
          flex={1} 
          p={{ base: 4, md: 6, lg: 8 }} 
          overflowX="hidden"
          maxW="100%"
        >
          <Container maxW="1400px" px={{ base: 0, md: 4 }}>
            {activeTab === 'overview' && (
              <VStack gap={{ base: 6, md: 8 }} align="stretch">
                
                <Box>
                  <Text 
                    fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }} 
                    fontWeight="bold" 
                    color="gray.900"
                    mb={1}
                  >
                    Dashboard Overview
                  </Text>
                  <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600">
                    Welcome back! Here's what's happening with your content.
                  </Text>
                </Box>

                {/* Stats Grid */}
                <SimpleGrid 
                  columns={{ base: 1, sm: 2, lg: 4 }} 
                  gap={{ base: 4, md: 6 }}
                >
                  {stats.map((stat, index) => (
                    <StatsCard
                      key={index}
                      title={stat.title}
                      value={stat.value}
                      icon={stat.icon}
                      color={stat.color}
                      subtitle={stat.subtitle}
                      badge={stat.badge}
                    />
                  ))}
                </SimpleGrid>

                {/* Activity and Quick Stats */}
                <SimpleGrid 
                  columns={{ base: 1, lg: 3 }} 
                  gap={{ base: 4, md: 6 }}
                >
                  <Box gridColumn={{ base: '1', lg: 'span 2' }}>
                    <ActivityCard />
                  </Box>
                  <Box>
                    <QuickStatsCard />
                  </Box>
                </SimpleGrid>

                
                <Card.Root bg="white" borderRadius="xl" shadow="sm">
                  <Card.Body p={6}>
                    <Flex align="center" justify="space-between" mb={4}>
                      <Text fontSize="lg" fontWeight="bold" color="gray.900">
                        Recent Posts
                      </Text>
                      <Text 
                        fontSize="sm" 
                        color="blue.600" 
                        fontWeight="600"
                        cursor="pointer"
                        _hover={{ color: 'blue.700', textDecoration: 'underline' }}
                        onClick={() => setActiveTab('posts')}
                      >
                        View all →
                      </Text>
                    </Flex>
                    <VStack gap={3} align="stretch">
                      {posts?.slice(0, 3).map((post, index) => (
                        <Flex 
                          key={index}
                          p={4}
                          bg="gray.50"
                          borderRadius="lg"
                          align="center"
                          justify="space-between"
                          transition="all 0.2s"
                          _hover={{ bg: 'gray.100' }}
                        >
                          <Box flex="1">
                            <Text fontSize="sm" fontWeight="600" color="gray.900" mb={1}>
                              {post.title}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              by {post.authorId}
                            </Text>
                          </Box>
                          <Badge
                            colorScheme={post.status === 'published' ? 'green' : 'gray'}
                            fontSize="xs"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontWeight="600"
                          >
                            {post.status}
                          </Badge>
                        </Flex>
                      ))}
                    </VStack>
                  </Card.Body>
                </Card.Root>
              </VStack>
            )}
            {activeTab === 'posts' && <PostsList />}
            {activeTab === 'users' && <UsersList />}
          </Container>
        </Box>
      </Flex>
    </Box>
  );
};