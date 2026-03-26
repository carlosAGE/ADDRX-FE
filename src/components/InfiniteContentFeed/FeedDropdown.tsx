import React from 'react';
import { styled } from 'styled-components';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { SortOption, FilterOption } from './api';

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
  padding: ${({ theme }) => theme.space.lg};
  position: sticky;
  top: ${({ theme }) => theme.space.lg};
  height: fit-content;
`;

const SidebarTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DropdownTrigger = styled(DropdownMenu.Trigger)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  justify-content: space-between;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.surface2};
  }

  &[data-state="open"] {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.surface2};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accent}33;
  }
`;

const DropdownContent = styled(DropdownMenu.Content)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space.xs};
  box-shadow: ${({ theme }) => theme.shadow.card};
  min-width: 180px;
  z-index: 50;

  &[data-state="open"] {
    animation: slideDownAndFade 300ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes slideDownAndFade {
    from {
      opacity: 0;
      transform: translateY(-2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DropdownSection = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    margin-bottom: ${({ theme }) => theme.space.xs};
    padding-bottom: ${({ theme }) => theme.space.xs};
  }
`;

const DropdownLabel = styled(DropdownMenu.Label)`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DropdownItem = styled(DropdownMenu.Item)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  outline: none;
  user-select: none;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface2};
    color: ${({ theme }) => theme.colors.accent2};
  }

  &:focus {
    background: ${({ theme }) => theme.colors.surface2};
    color: ${({ theme }) => theme.colors.accent2};
  }

  &[data-disabled] {
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
    pointer-events: none;
  }
`;

const DropdownCheckbox = styled.div<{ $checked: boolean }>`
  width: 16px;
  height: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  ${({ $checked, theme }) => $checked && `
    background: ${theme.colors.accent};
    border-color: ${theme.colors.accent};
  `}

  &::after {
    content: '✓';
    font-size: 10px;
    color: ${({ theme }) => theme.colors.bg};
    opacity: ${({ $checked }) => $checked ? 1 : 0};
    transition: opacity 0.15s ease;
  }
`;

const TriggerIcon = styled.span<{ $isOpen?: boolean }>`
  font-size: 12px;
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => $isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

interface FeedDropdownProps {
  sortBy: SortOption;
  filterBy: FilterOption;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
}

const FeedDropdown: React.FC<FeedDropdownProps> = ({
  sortBy,
  filterBy,
  onSortChange,
  onFilterChange,
}) => {
  const [open, setOpen] = React.useState(false);

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
  ] as const;

  const filterOptions = [
    { value: 'all', label: 'All Content' },
    { value: 'featured', label: 'Featured' },
    { value: 'trending', label: 'Trending' },
  ] as const;

  const getCurrentLabel = () => {
    const sortLabel = sortOptions.find(opt => opt.value === sortBy)?.label;
    const filterLabel = filterBy !== 'all' 
      ? filterOptions.find(opt => opt.value === filterBy)?.label 
      : null;
    
    return filterLabel ? `${filterLabel} • ${sortLabel}` : sortLabel;
  };

  return (
    <SidebarContainer>
      <SidebarTitle>Filters</SidebarTitle>
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownTrigger>
          {getCurrentLabel()}
          <TriggerIcon $isOpen={open}>▼</TriggerIcon>
        </DropdownTrigger>

        <DropdownMenu.Portal>
          <DropdownContent sideOffset={5} align="end">
            <DropdownSection>
              <DropdownLabel>Sort By</DropdownLabel>
              {sortOptions.map((option) => (
                <DropdownItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                >
                  <DropdownCheckbox $checked={sortBy === option.value} />
                  {option.label}
                </DropdownItem>
              ))}
            </DropdownSection>

            <DropdownSection>
              <DropdownLabel>Filter</DropdownLabel>
              {filterOptions.map((option) => (
                <DropdownItem
                  key={option.value}
                  onClick={() => onFilterChange(option.value)}
                >
                  <DropdownCheckbox $checked={filterBy === option.value} />
                  {option.label}
                </DropdownItem>
              ))}
            </DropdownSection>
          </DropdownContent>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </SidebarContainer>
  );
};

export default FeedDropdown;