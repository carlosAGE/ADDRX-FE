import React, { useState, useEffect, useRef, useCallback } from 'react';
import { styled } from 'styled-components';
import ContentItem from './ContentItem.tsx';
import FeedDropdown from './FeedDropdown.tsx';
import Bio from './Bio.tsx';
import Topics, { type TopicType } from './Topics.tsx';
import PostDetailsContainer from './PostDetailsContainer.tsx';
import { fetchContentBatch, fetchPostById, type ContentItem as ContentItemType, type SortOption, type FilterOption } from './api.ts';

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr 280px;
  gap: ${({ theme }) => theme.space.xl};
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.lg} ${({ theme }) => theme.space.md};
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.space.lg};
  }
`;

const FeedContainer = styled.div<{ $isVisible: boolean }>`
  max-width: 100%;
  width: 100%;
  transition: all 0.3s ease-out;
  transform: translateX(${({ $isVisible }) => $isVisible ? '0' : '-100%'});
  opacity: ${({ $isVisible }) => $isVisible ? '1' : '0'};
  ${({ $isVisible }) => !$isVisible && 'pointer-events: none;'}
`;

const PostContainer = styled.div<{ $isVisible: boolean }>`
  max-width: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all 0.3s ease-out;
  transform: translateX(${({ $isVisible }) => $isVisible ? '0' : '100%'});
  opacity: ${({ $isVisible }) => $isVisible ? '1' : '0'};
  ${({ $isVisible }) => !$isVisible && 'pointer-events: none;'}
  z-index: ${({ $isVisible }) => $isVisible ? '2' : '1'};
`;

const ContentWrapper = styled.div`
  position: relative;
  overflow: hidden;
  min-height: 100vh;
`;

const SidebarContainer = styled.div`
  @media (max-width: 1024px) {
    display: none;
  }
`;

const FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.xl};
  padding-bottom: ${({ theme }) => theme.space.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
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
  const [activeTopic, setActiveTopic] = useState<TopicType | null>(null);
  const [currentView, setCurrentView] = useState<'feed' | 'post'>('feed');
  const [selectedPost, setSelectedPost] = useState<ContentItemType | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingElementRef = useRef<HTMLDivElement | null>(null);

  const handleViewPost = useCallback((post: ContentItemType) => {
    setSelectedPost(post);
    setCurrentView('post');
    
    // Update URL for the specific post
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('post', post.id);
    window.history.pushState({}, '', newUrl);
  }, []);

  const handleBackToFeed = useCallback(() => {
    setCurrentView('feed');
    setSelectedPost(null);
    
    // Remove post parameter from URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('post');
    window.history.replaceState({}, '', newUrl);
  }, []);
  const loadMoreContent = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newItems = await fetchContentBatch(currentBatch, sortBy, filterBy, activeTopic);
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
        setCurrentBatch(prev => prev + 1);
        
        // Update URL for SEO (only if in feed view)
        if (currentView === 'feed') {
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('batch', currentBatch.toString());
          if (sortBy !== 'newest') newUrl.searchParams.set('sort', sortBy);
          if (filterBy !== 'all') newUrl.searchParams.set('filter', filterBy);
          if (activeTopic) newUrl.searchParams.set('topic', activeTopic);
          window.history.replaceState({}, '', newUrl);
        }
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, currentBatch, sortBy, filterBy, activeTopic, currentView]);

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

  // Reset and reload when filter/sort/topic changes
  useEffect(() => {
    setItems([]);
    setCurrentBatch(1);
    setHasMore(true);
    
    // Load initial content with new filters
    const loadInitialContent = async () => {
      setLoading(true);
      try {
        const newItems = await fetchContentBatch(1, sortBy, filterBy, activeTopic);
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
        if (activeTopic) {
          newUrl.searchParams.set('topic', activeTopic);
        } else {
          newUrl.searchParams.delete('topic');
        }
        window.history.replaceState({}, '', newUrl);
        
      } catch (error) {
        console.error('Error loading initial content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialContent();
  }, [sortBy, filterBy, activeTopic]);

  // Load initial content on mount
  useEffect(() => {
    // Parse URL parameters on initial load
    const urlParams = new URLSearchParams(window.location.search);
    const urlSort = urlParams.get('sort') as SortOption;
    const urlFilter = urlParams.get('filter') as FilterOption;
    const urlTopic = urlParams.get('topic') as TopicType;
    const urlBatch = urlParams.get('batch');
    const urlPost = urlParams.get('post');

    if (urlSort && ['newest', 'oldest', 'popular'].includes(urlSort)) {
      setSortBy(urlSort);
    }
    if (urlFilter && ['all', 'featured', 'trending'].includes(urlFilter)) {
      setFilterBy(urlFilter);
    }
    if (urlTopic && ['daily', 'team', 'services', 'thoughts'].includes(urlTopic)) {
      setActiveTopic(urlTopic);
    }
    if (urlBatch && !isNaN(Number(urlBatch))) {
      setCurrentBatch(Number(urlBatch));
    }
    
    // If there's a post parameter, load that specific post
    if (urlPost) {
      const loadSpecificPost = async () => {
        try {
          const post = await fetchPostById(urlPost);
          if (post) {
            setSelectedPost(post);
            setCurrentView('post');
          } else {
            // Post not found, redirect back to feed
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('post');
            window.history.replaceState({}, '', newUrl);
          }
        } catch (error) {
          console.error('Error loading post:', error);
          // On error, redirect back to feed
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('post');
          window.history.replaceState({}, '', newUrl);
        }
      };
      
      loadSpecificPost();
    }
  }, []);

  return (
    <MainLayout>
      <SidebarContainer>
        <Topics 
          activeTopic={activeTopic}
          onTopicChange={setActiveTopic}
        />
      </SidebarContainer>
      
      <ContentWrapper>
        <FeedContainer $isVisible={currentView === 'feed'}>
          <FeedHeader>
            <Bio />
          </FeedHeader>
          
          <FeedGrid>
            {items.map((item) => (
              <ContentItem 
                key={item.id} 
                item={item} 
                onViewPost={handleViewPost}
              />
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

        <PostContainer $isVisible={currentView === 'post'}>
          {selectedPost && (
            <PostDetailsContainer 
              item={selectedPost}
              onBack={handleBackToFeed}
            />
          )}
        </PostContainer>
      </ContentWrapper>

      <SidebarContainer>
        <FeedDropdown 
          sortBy={sortBy}
          filterBy={filterBy}
          onSortChange={setSortBy}
          onFilterChange={setFilterBy}
        />
      </SidebarContainer>
    </MainLayout>
  );
};

export default InfiniteContentFeed;
