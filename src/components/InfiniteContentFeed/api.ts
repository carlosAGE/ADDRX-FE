import { supabase } from '../../lib/supabase';

export type SortOption = 'newest' | 'oldest' | 'popular';
export type FilterOption = 'all' | 'featured' | 'trending';

export interface Tag {
  id: string;
  name: string;
  postCount?: number;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: 'featured' | 'trending' | 'regular';
  tags: Tag[];
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

const mapRow = (row: Record<string, unknown>): ContentItem => ({
  id: row.id as string,
  title: row.title as string,
  description: row.description as string,
  category: row.category as ContentItem['category'],
  tags: ((row.content_item_tags as Array<{ tags: Tag }>) ?? [])
    .map(ct => ct.tags)
    .filter(Boolean),
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
  activeTagId: string | null = null
): Promise<ContentItem[]> => {
  const from = (batch - 1) * BATCH_SIZE;
  const to = from + BATCH_SIZE - 1;

  const selectStr = activeTagId
    ? '*, content_item_tags!inner(tags(id, name))'
    : '*, content_item_tags(tags(id, name))';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase.from('content_items').select(selectStr).range(from, to);

  if (activeTagId) {
    query = query.eq('content_item_tags.tag_id', activeTagId);
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
    .select('*, content_item_tags(tags(id, name))')
    .eq('id', postId)
    .single();

  if (error) return null;
  return mapRow(data as Record<string, unknown>);
};

export const fetchAllTags = async (): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from('tags')
    .select('id, name, content_item_tags(count)')
    .order('name');
  if (error) return [];
  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    name: row.name as string,
    postCount: (row.content_item_tags as Array<{ count: number }>)?.[0]?.count ?? 0,
  }));
};

export const upsertTag = async (name: string): Promise<Tag | null> => {
  const { data, error } = await supabase
    .from('tags')
    .upsert({ name: name.toLowerCase().trim() }, { onConflict: 'name' })
    .select('id, name')
    .single();
  if (error) return null;
  return data as Tag;
};
