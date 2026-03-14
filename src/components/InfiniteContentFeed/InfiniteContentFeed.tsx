import React, { useState, useEffect, useRef, useCallback } from 'react';
import { styled } from 'styled-components';
import ContentItem from './ContentItem.tsx';
import FeedDropdown from './FeedDropdown.tsx';
import { mockFetchContentBatch, type ContentItem as ContentItemType, type SortOption, type FilterOption } from './mockApi.ts';

const FeedContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.lg} ${({ theme }) => theme.space.md};
  width: 100%;
`;

const FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.xl};
  padding-bottom: ${({ theme }) => theme.space.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const FeedTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  letter-spacing: -0.025em;
`;

const FeedGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.space.xl};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
  font-weight: 300;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top: 2px solid ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: ${({ theme }) => theme.space.sm};

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EndMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space.xl};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
  font-weight: 300;
  font-style: italic;
`;

const InfiniteContentFeed: React.FC = () => {
  const [items, setItems] = useState<ContentItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentBatch, setCurrentBatch] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingElementRef = useRef<HTMLDivElement | null>(null);

  const loadMoreContent = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newItems = await mockFetchContentBatch(currentBatch, sortBy, filterBy);
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
        setCurrentBatch(prev => prev + 1);
        
        // Update URL for SEO
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('batch', currentBatch.toString());
        if (sortBy !== 'newest') newUrl.searchParams.set('sort', sortBy);
        if (filterBy !== 'all') newUrl.searchParams.set('filter', filterBy);
        window.history.replaceState({}, '', newUrl);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, currentBatch, sortBy, filterBy]);

  // Intersection Observer setup
  useEffect(() => {
    const currentLoadingElement = loadingElementRef.current;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          loadMoreContent();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (currentLoadingElement) {
      observerRef.current.observe(currentLoadingElement);
    }

    return () => {
      if (observerRef.current && currentLoadingElement) {
        observerRef.current.unobserve(currentLoadingElement);
      }
    };
  }, [loadMoreContent, hasMore, loading]);

  // Reset and reload when filter/sort changes
  useEffect(() => {
    setItems([]);
    setCurrentBatch(1);
    setHasMore(true);
    
    // Load initial content with new filters
    const loadInitialContent = async () => {
      setLoading(true);
      try {
        const newItems = await mockFetchContentBatch(1, sortBy, filterBy);
        setItems(newItems);
        setCurrentBatch(2);
        
        // Update URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('batch', '1');
        if (sortBy !== 'newest') {
          newUrl.searchParams.set('sort', sortBy);
        } else {
          newUrl.searchParams.delete('sort');
        }
        if (filterBy !== 'all') {
          newUrl.searchParams.set('filter', filterBy);
        } else {
          newUrl.searchParams.delete('filter');
        }
        window.history.replaceState({}, '', newUrl);
        
      } catch (error) {
        console.error('Error loading initial content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialContent();
  }, [sortBy, filterBy]);

  // Load initial content on mount
  useEffect(() => {
    // Parse URL parameters on initial load
    const urlParams = new URLSearchParams(window.location.search);
    const urlSort = urlParams.get('sort') as SortOption;
    const urlFilter = urlParams.get('filter') as FilterOption;
    const urlBatch = urlParams.get('batch');

    if (urlSort && ['newest', 'oldest', 'popular'].includes(urlSort)) {
      setSortBy(urlSort);
    }
    if (urlFilter && ['all', 'featured', 'trending'].includes(urlFilter)) {
      setFilterBy(urlFilter);
    }
    if (urlBatch && !isNaN(Number(urlBatch))) {
      setCurrentBatch(Number(urlBatch));
    }
  }, []);

  return (
    <FeedContainer>
      <FeedHeader>
        <FeedTitle>Content Feed</FeedTitle>
        <FeedDropdown 
          sortBy={sortBy}
          filterBy={filterBy}
          onSortChange={setSortBy}
          onFilterChange={setFilterBy}
        />
      </FeedHeader>
      
      <FeedGrid>
        {items.map((item) => (
          <ContentItem key={item.id} item={item} />
        ))}
      </FeedGrid>

      <div ref={loadingElementRef}>
        {loading && (
          <LoadingIndicator>
            <LoadingSpinner />
            Loading more content...
          </LoadingIndicator>
        )}
        
        {!hasMore && items.length > 0 && (
          <EndMessage>
            You've reached the end of the feed
          </EndMessage>
        )}
      </div>
    </FeedContainer>
  );
};

export default InfiniteContentFeed;
