export type SortOption = 'newest' | 'oldest' | 'popular';
export type FilterOption = 'all' | 'featured' | 'trending';
export type TopicType = 'daily' | 'team' | 'services' | 'thoughts';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: 'featured' | 'trending' | 'regular';
    topic: TopicType;
  createdAt: string;
  views: number;
  likes: number;
  comments?: number;
  author: {
    name: string;
    avatar?: string;
  };
}

// Mock data generator
const generateMockContent = (startId: number, count: number = 10): ContentItem[] => {
  const categories: ContentItem['category'][] = ['featured', 'trending', 'regular'];
    const topics: TopicType[] = ['daily', 'team', 'services', 'thoughts'];

    const titlesByTopic = {
        daily: [
            'Daily Updates from Our Development Team',
            'Morning Coffee Chat: Industry Insights',
            'Today\'s Featured Project Spotlight',
            'Daily Dose of Creative Inspiration',
            'Breaking: Latest Technology Trends',
        ],
        team: [
            'Meet Our Lead Designer: Sarah Chen',
            'Behind the Scenes: Our Development Process',
            'Team Spotlight: Engineering Excellence',
            'Our Culture: Building Together',
            'Employee Spotlight: Innovation at Work',
        ],
        services: [
            'Custom Web Development Solutions',
            'Brand Identity & Visual Design',
            'Full-Stack Technical Consulting',
            'User Experience Design Services',
            'Digital Strategy & Implementation',
        ],
        thoughts: [
            'The Future of Minimalist Design',
            'Reflections on Sustainable Development',
            'Why Simplicity Wins in User Experience',
            'Building Authentic Digital Relationships',
            'The Philosophy Behind Our Approach',
        ],
    };

    const descriptionsByTopic = {
        daily: [
            'Stay up to date with our latest project developments, team insights, and daily discoveries in the world of digital design.',
            'Fresh perspectives and industry updates from our team, delivered daily to keep you informed and inspired.',
            'A glimpse into our ongoing projects, daily learnings, and the creative process behind our boutique approach.',
        ],
        team: [
            'Get to know the talented individuals behind our projects, their expertise, and what drives them to create exceptional work.',
            'Learn about our collaborative culture, team dynamics, and the people who make our boutique agency unique.',
            'Insights from our team members about their craft, experience, and passion for creating meaningful digital experiences.',
        ],
        services: [
            'Discover our comprehensive range of digital services, from concept to launch, tailored to meet your unique business needs.',
            'Explore how our boutique approach to web development and design can elevate your brand and engage your audience.',
            'Learn about our specialized services and methodology for creating impactful digital solutions that drive results.',
        ],
        thoughts: [
            'Deep reflections on design philosophy, industry trends, and the principles that guide our creative approach.',
            'Thoughtful perspectives on the intersection of technology, design, and human experience in the digital age.',
            'Our insights on building meaningful connections through thoughtful design and authentic digital experiences.',
        ],
    };

  const authors = [
    'Alex Chen',
      'Morgan Taylor', 
    'Sam Rivera',
    'Jordan Kim',
    'Casey Martinez',
    'Riley Park',
    'Avery Johnson',
    'Quinn Davis',
    'Blake Wilson',
    'Dylan Foster',
  ];

  return Array.from({ length: count }, (_, index) => {
    const id = startId + index;
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const topicTitles = titlesByTopic[randomTopic];
      const topicDescriptions = descriptionsByTopic[randomTopic];
      const randomTitle = topicTitles[Math.floor(Math.random() * topicTitles.length)];
      const randomDescription = topicDescriptions[Math.floor(Math.random() * topicDescriptions.length)];
    const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    
    // Generate realistic engagement metrics based on category
    let baseViews, baseLikes, baseComments;
    switch (randomCategory) {
      case 'featured':
        baseViews = Math.floor(Math.random() * 8000) + 2000;
        baseLikes = Math.floor(baseViews * 0.08) + Math.floor(Math.random() * 50);
        baseComments = Math.floor(baseLikes * 0.15) + Math.floor(Math.random() * 10);
        break;
      case 'trending':
        baseViews = Math.floor(Math.random() * 5000) + 1000;
        baseLikes = Math.floor(baseViews * 0.06) + Math.floor(Math.random() * 30);
        baseComments = Math.floor(baseLikes * 0.12) + Math.floor(Math.random() * 8);
        break;
      default:
        baseViews = Math.floor(Math.random() * 2000) + 200;
        baseLikes = Math.floor(baseViews * 0.04) + Math.floor(Math.random() * 20);
        baseComments = Math.floor(baseLikes * 0.1) + Math.floor(Math.random() * 5);
    }

    // Generate creation date (last 30 days)
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));

    return {
      id: `content-${id}`,
        title: randomTitle,
      description: randomDescription,
      category: randomCategory,
        topic: randomTopic,
      createdAt: createdAt.toISOString(),
      views: baseViews,
      likes: baseLikes,
      comments: baseComments > 0 ? baseComments : undefined,
      author: {
        name: randomAuthor,
      },
    };
  });
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API function
export const mockFetchContentBatch = async (
  batch: number,
  sortBy: SortOption = 'newest',
    filterBy: FilterOption = 'all',
    topic: TopicType = 'daily'
): Promise<ContentItem[]> => {
  // Simulate network delay
  await delay(400 + Math.random() * 600);

  const batchSize = 10;
  const startId = (batch - 1) * batchSize + 1;
  
  // Generate content for this batch
  let content = generateMockContent(startId, batchSize);

    // Apply topic filter first
    content = content.filter(item => item.topic === topic);

    // Apply category filters
  if (filterBy !== 'all') {
    content = content.filter(item => item.category === filterBy);
  }

  // Apply sorting
  content.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'popular':
        return (b.views + b.likes * 10) - (a.views + a.likes * 10);
      default:
        return 0;
    }
  });

  // Simulate end of content after batch 5
  if (batch > 5) {
    return [];
  }

  // Simulate filtered content running out
  if (filterBy !== 'all' && batch > 3) {
    return [];
  }

  return content;
};

// Mock function to fetch a single post by ID
export const mockFetchPostById = async (postId: string): Promise<ContentItem | null> => {
    // Simulate network delay
    await delay(200 + Math.random() * 300);

    // Extract the numeric ID from the post ID format "content-123"
    const numericId = parseInt(postId.replace('content-', ''));
    if (isNaN(numericId)) return null;

    // Generate the specific post with the given ID
    const posts = generateMockContent(numericId, 1);
    return posts.length > 0 ? posts[0] : null;
};