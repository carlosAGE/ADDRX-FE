import React from 'react';
import { styled } from 'styled-components';
import type { ContentItem as ContentItemType } from './mockApi';

const ItemContainer = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space.lg};
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadow.card};
    transform: translateY(-1px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.accent2},
      ${({ theme }) => theme.colors.accent}
    );
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const ItemTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1.4;
  letter-spacing: -0.01em;
`;

const ItemMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.space.xs};
`;

const ItemCategory = styled.span<{ $category: string }>`
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

const ItemDate = styled.time`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 300;
`;

const ItemDescription = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 ${({ theme }) => theme.space.md} 0;
`;

const ItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.space.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ItemStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
`;

const ItemStat = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ItemAction = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.75rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface2};
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:active {
    transform: scale(0.98);
  }
`;

interface ContentItemProps {
  item: ContentItemType;
  onViewPost: (post: ContentItemType) => void;
}

const ContentItem: React.FC<ContentItemProps> = ({ item, onViewPost }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
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

  return (
    <ItemContainer>
      <ItemHeader>
        <ItemTitle>{item.title}</ItemTitle>
        <ItemMeta>
          <ItemCategory $category={item.category}>
            {item.category}
          </ItemCategory>
          <ItemDate dateTime={item.createdAt}>
            {formatDate(item.createdAt)}
          </ItemDate>
        </ItemMeta>
      </ItemHeader>

      <ItemDescription>{item.description}</ItemDescription>

      <ItemFooter>
        <ItemStats>
          <ItemStat>
            👁 {formatNumber(item.views)}
          </ItemStat>
          <ItemStat>
            ❤️ {formatNumber(item.likes)}
          </ItemStat>
          {item.comments && (
            <ItemStat>
              💬 {formatNumber(item.comments)}
            </ItemStat>
          )}
        </ItemStats>
        <ItemAction onClick={() => onViewPost(item)}>
          View Details
        </ItemAction>
      </ItemFooter>
    </ItemContainer>
  );
};

export default ContentItem;