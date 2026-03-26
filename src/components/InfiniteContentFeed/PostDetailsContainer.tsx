import React, { Fragment } from 'react';
import { styled } from 'styled-components';
import type { ContentItem } from './api';

const PostContainer = styled.div`
  max-width: 100%;
  width: 100%;
  animation: slideInRight 0.3s ease-out;

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const PostHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.space.xl};
  padding-bottom: ${({ theme }) => theme.space.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
  cursor: pointer;
  padding: ${({ theme }) => theme.space.xs} 0;
  margin-bottom: ${({ theme }) => theme.space.lg};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const PostTitle = styled.h1`
  font-size: 2rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.space.md} 0;
  line-height: 1.3;
  letter-spacing: -0.02em;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const PostCategory = styled.span<{ $category: string }>`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${({ $category, theme }) => {
    switch ($category) {
      case 'featured':
        return `
          background: rgba(168, 85, 247, 0.1);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.2);
        `;
      case 'trending':
        return `
          background: rgba(34, 197, 94, 0.1);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.2);
        `;
      default:
        return `
          background: rgba(156, 163, 175, 0.1);
          color: ${theme.colors.textMuted};
          border: 1px solid ${theme.colors.border};
        `;
    }
  }}
`;

const PostDate = styled.time`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
`;

const PostAuthor = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
`;

const PostContent = styled.div`
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  
  p {
    margin: 0 0 ${({ theme }) => theme.space.lg} 0;
  }
  
  h2 {
    font-size: 1.5rem;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.text};
    margin: ${({ theme }) => theme.space.xl} 0 ${({ theme }) => theme.space.lg} 0;
    letter-spacing: -0.015em;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.text};
    margin: ${({ theme }) => theme.space.lg} 0 ${({ theme }) => theme.space.md} 0;
  }
`;

const PostStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.lg};
  padding: ${({ theme }) => theme.space.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  margin-top: ${({ theme }) => theme.space.xl};
`;

const PostStat = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface PostDetailsContainerProps {
  item: ContentItem;
  onBack: () => void;
}

const PostDetailsContainer: React.FC<PostDetailsContainerProps> = ({ item, onBack }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const renderContent = (text: string) =>
    text.split(/\n\n+/).map((para, i) => (
      <p key={i}>
        {para.split('\n').map((line, j, arr) => (
          <Fragment key={j}>
            {line}
            {j < arr.length - 1 && <br />}
          </Fragment>
        ))}
      </p>
    ));

  return (
    <PostContainer>
      <PostHeader>
        <BackButton onClick={onBack}>
          ← Back to Feed
        </BackButton>
        
        <PostTitle>{item.title}</PostTitle>
        
        <PostMeta>
          <PostCategory $category={item.category}>
            {item.category}
          </PostCategory>
          <PostDate dateTime={item.createdAt}>
            {formatDate(item.createdAt)}
          </PostDate>
          <PostAuthor>
            by {item.author.name}
          </PostAuthor>
        </PostMeta>
      </PostHeader>

      <PostContent>
        {renderContent(item.description)}
      </PostContent>

      <PostStats>
        <PostStat>
          👁 {formatNumber(item.views)} views
        </PostStat>
        <PostStat>
          ❤️ {formatNumber(item.likes)} likes
        </PostStat>
        {item.comments && (
          <PostStat>
            💬 {formatNumber(item.comments)} comments
          </PostStat>
        )}
      </PostStats>
    </PostContainer>
  );
};

export default PostDetailsContainer;