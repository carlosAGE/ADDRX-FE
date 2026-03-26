import React, { useState, useEffect, useRef } from 'react';
import { styled } from 'styled-components';
import { fetchAllTags, type Tag } from '../InfiniteContentFeed/api';

export interface SelectedTag {
  id: string | null; // null = new, not yet in DB
  name: string;
}

interface TagInputProps {
  value: SelectedTag[];
  onChange: (tags: SelectedTag[]) => void;
}

// ─── Styles ────────────────────────────────────────────────────────────────

const Container = styled.div`
  position: relative;
`;

const InputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.xs};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
  min-height: 42px;
  align-items: center;
  cursor: text;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.accent2};
  }
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${({ theme }) => theme.colors.surface2};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.78rem;
  padding: 2px 8px;
  letter-spacing: 0.03em;
`;

const ChipRemove = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  padding: 0;
  font-size: 0.85rem;
  line-height: 1;
  display: flex;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Input = styled.input`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  outline: none;
  flex: 1;
  min-width: 120px;
  padding: 2px 0;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.4;
  }
`;

const Dropdown = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  list-style: none;
  margin: 0;
  padding: ${({ theme }) => theme.space.xs} 0;
  z-index: 20;
  box-shadow: ${({ theme }) => theme.shadow.card};
  max-height: 200px;
  overflow-y: auto;
`;

const DropdownItem = styled.li<{ $isCreate?: boolean }>`
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  font-size: 0.85rem;
  color: ${({ theme, $isCreate }) => $isCreate ? theme.colors.accent2 : theme.colors.text};
  cursor: pointer;
  font-style: ${({ $isCreate }) => $isCreate ? 'italic' : 'normal'};

  &:hover {
    background: ${({ theme }) => theme.colors.surface2};
  }
`;

const EmptyHint = styled.li`
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
`;

// ─── Component ─────────────────────────────────────────────────────────────

export default function TagInput({ value, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAllTags().then(setAllTags);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedNames = new Set(value.map(t => t.name.toLowerCase()));

  const suggestions = allTags.filter(
    t =>
      t.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedNames.has(t.name.toLowerCase())
  );

  const trimmed = inputValue.trim().toLowerCase();
  const canCreate =
    trimmed.length > 0 &&
    !selectedNames.has(trimmed) &&
    !allTags.some(t => t.name.toLowerCase() === trimmed);

  const addTag = (tag: SelectedTag) => {
    onChange([...value, tag]);
    setInputValue('');
    setIsOpen(false);
  };

  const removeTag = (name: string) => {
    onChange(value.filter(t => t.name !== name));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0 && !canCreate) {
        addTag({ id: suggestions[0].id, name: suggestions[0].name });
      } else if (canCreate) {
        addTag({ id: null, name: trimmed });
      }
    }
    if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value[value.length - 1].name);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const showDropdown = isOpen && (suggestions.length > 0 || canCreate || (trimmed.length === 0 && allTags.length > 0));

  return (
    <Container ref={containerRef}>
      <InputRow onClick={() => (containerRef.current?.querySelector('input') as HTMLInputElement)?.focus()}>
        {value.map(tag => (
          <Chip key={tag.name}>
            {tag.name}
            <ChipRemove type="button" onClick={() => removeTag(tag.name)}>×</ChipRemove>
          </Chip>
        ))}
        <Input
          placeholder={value.length === 0 ? 'Add tags…' : ''}
          value={inputValue}
          onChange={e => { setInputValue(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </InputRow>

      {showDropdown && (
        <Dropdown>
          {suggestions.length === 0 && !canCreate && (
            <EmptyHint>No tags yet</EmptyHint>
          )}
          {suggestions.map(tag => (
            <DropdownItem key={tag.id} onMouseDown={() => addTag({ id: tag.id, name: tag.name })}>
              {tag.name}
            </DropdownItem>
          ))}
          {canCreate && (
            <DropdownItem $isCreate onMouseDown={() => addTag({ id: null, name: trimmed })}>
              Create "{trimmed}"
            </DropdownItem>
          )}
        </Dropdown>
      )}
    </Container>
  );
}
