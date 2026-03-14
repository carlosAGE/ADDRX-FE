export type SortOption = 'newest' | 'oldest' | 'popular';
export type FilterOption = 'all' | 'featured' | 'trending';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: 'featured' | 'trending' | 'regular';
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
  const titles = [
    'Exploring Modern Web Development Patterns',
    'The Future of Remote Work Culture',
    'Sustainable Technology Practices',
    'Understanding User Experience Design',
    'Building Resilient Digital Communities',
    'The Art of Minimalist Architecture',
    'Innovations in Sustainable Living',
    'Digital Transformation Strategies',
    'Creative Problem-Solving Methods',
    'The Psychology of Product Design',
    'Emerging Trends in Data Visualization',
    'Crafting Authentic Brand Stories',
    'The Philosophy of Calm Technology',
    'Building Inclusive Digital Spaces',
    'The Science of Effective Communication',
    'Exploring Cultural Design Patterns',
    'The Future of Human-Computer Interaction',
    'Sustainable Business Model Innovation',
    'The Art of Thoughtful Leadership',
    'Creating Meaningful User Journeys',
  ];

  const descriptions = [
    'A deep dive into modern approaches to creating digital experiences that prioritize user needs while maintaining technical excellence.',
    'Examining how organizations are reshaping work culture to embrace flexibility, creativity, and human-centered values.',
    'Exploring practical methods for integrating sustainability into technology development and deployment processes.',
    'Understanding the principles that guide exceptional user experience design and their impact on digital products.',
    'Investigating strategies for fostering authentic connections and engagement in digital community spaces.',
    'An exploration of minimalist architectural principles and their application in contemporary design practices.',
    'Discovering innovative approaches to sustainable living that blend technology with environmental consciousness.',
    'Strategic frameworks for organizations navigating the complexities of digital transformation initiatives.',
    'Methodologies for approaching complex challenges with creativity, empathy, and systematic thinking.',
    'Psychological insights that inform effective product design decisions and user interaction patterns.',
  ];

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
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
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
      title: `${randomTitle} ${id > 20 ? `(Part ${Math.floor(id / 20) + 1})` : ''}`,
      description: randomDescription,
      category: randomCategory,
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
  filterBy: FilterOption = 'all'
): Promise<ContentItem[]> => {
  // Simulate network delay
  await delay(400 + Math.random() * 600);

  const batchSize = 10;
  const startId = (batch - 1) * batchSize + 1;
  
  // Generate content for this batch
  let content = generateMockContent(startId, batchSize);

  // Apply filters
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