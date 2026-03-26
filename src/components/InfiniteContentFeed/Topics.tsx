import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { fetchAllTags, type Tag } from './api';

const TopicsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => theme.space.lg};
  position: sticky;
  top: ${({ theme }) => theme.space.lg};
  height: fit-content;
`;

const TopicsTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 ${({ theme }) => theme.space.md} 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TopicsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`;

const TopicItem = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.875rem;
  font-weight: 400;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  text-transform: capitalize;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.surface : 'transparent'};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.text : theme.colors.textMuted};
  border: 1px solid ${({ $isActive, theme }) =>
    $isActive ? theme.colors.accent : 'transparent'};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.border};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CountBadge = styled.span`
  font-size: 0.65rem;
  padding: 1px 5px;
  border-radius: 99px;
  background: ${({ theme }) => theme.colors.surface2};
  color: ${({ theme }) => theme.colors.textMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  min-width: 18px;
  text-align: center;
  flex-shrink: 0;
`;

interface TopicsProps {
  activeTagId: string | null;
  onTagChange: (id: string | null) => void;
}

const Topics: React.FC<TopicsProps> = ({ activeTagId, onTagChange }) => {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    fetchAllTags().then(setTags);
  }, []);

  return (
    <TopicsContainer>
      <TopicsTitle>Topics</TopicsTitle>
      <TopicsList>
        {tags.map(tag => (
          <TopicItem
            key={tag.id}
            $isActive={activeTagId === tag.id}
            onClick={() => onTagChange(activeTagId === tag.id ? null : tag.id)}
          >
            {tag.name}
            <CountBadge>
              {(tag.postCount ?? 0) > 99 ? '99+' : tag.postCount ?? 0}
            </CountBadge>
          </TopicItem>
        ))}
      </TopicsList>
    </TopicsContainer>
  );
};

export default Topics;
