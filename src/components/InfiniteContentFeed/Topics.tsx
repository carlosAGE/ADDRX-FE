import React from 'react';
import { styled } from 'styled-components';

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
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.875rem;
  font-weight: 400;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  background: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.surface : 'transparent'
  };
  color: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.text : theme.colors.textMuted
  };
  border: 1px solid ${({ $isActive, theme }) => 
    $isActive ? theme.colors.accent : 'transparent'
  };

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.border};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export type TopicType = 'daily' | 'team' | 'services' | 'thoughts';

interface TopicsProps {
  activeTopic: TopicType | null;
  onTopicChange: (topic: TopicType | null) => void;
}

const Topics: React.FC<TopicsProps> = ({ activeTopic, onTopicChange }) => {
  const topics = [
    { value: 'daily', label: 'DAILY' },
    { value: 'team', label: 'THE TEAM' },
    { value: 'services', label: 'SERVICES' },
    { value: 'thoughts', label: 'THOUGHTS' },
  ] as const;

  return (
    <TopicsContainer>
      <TopicsTitle>Topics</TopicsTitle>
      <TopicsList>
        {topics.map((topic) => (
          <TopicItem
            key={topic.value}
            $isActive={activeTopic === topic.value}
            onClick={() => onTopicChange(activeTopic === topic.value ? null : topic.value)}
          >
            {topic.label}
          </TopicItem>
        ))}
      </TopicsList>
    </TopicsContainer>
  );
};

export default Topics;