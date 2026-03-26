import { supabase } from '../../lib/supabase';

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

const BATCH_SIZE = 10;

// Map DB row shape to ContentItem
const mapRow = (row: Record<string, unknown>): ContentItem => ({
  id: row.id as string,
  title: row.title as string,
  description: row.description as string,
  category: row.category as ContentItem['category'],
  topic: row.topic as TopicType,
  createdAt: row.created_at as string,
  views: row.views as number,
  likes: row.likes as number,
  comments: row.comments as number | undefined,
  author: {
    name: row.author_name as string,
    avatar: row.author_avatar as string | undefined,
  },
});

export const fetchContentBatch = async (
  batch: number,
  sortBy: SortOption = 'newest',
  filterBy: FilterOption = 'all',
  topic: TopicType | null = null
): Promise<ContentItem[]> => {
  const from = (batch - 1) * BATCH_SIZE;
  const to = from + BATCH_SIZE - 1;

  let query = supabase
    .from('content_items')
    .select('*')
    .range(from, to);

  if (topic) {
    query = query.eq('topic', topic);
  }

  if (filterBy !== 'all') {
    query = query.eq('category', filterBy);
  }

  switch (sortBy) {
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'popular':
      query = query.order('likes', { ascending: false }).order('views', { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return (data ?? []).map(mapRow);
};

export const fetchPostById = async (postId: string): Promise<ContentItem | null> => {
  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .eq('id', postId)
    .single();

  if (error) return null;

  return mapRow(data);
};
