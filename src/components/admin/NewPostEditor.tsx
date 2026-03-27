import React, { useState } from 'react';
import { styled } from 'styled-components';
import { supabase } from '../../lib/supabase';
import AuthGuard from './AuthGuard';
import TagInput, { type SelectedTag } from './TagInput';
import { upsertTag } from '../InfiniteContentFeed/api';

// ─── Layout ────────────────────────────────────────────────────────────────

const Wrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Logo = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Body = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.space.xl};
`;

const Form = styled.form`
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
`;

// ─── Fields ────────────────────────────────────────────────────────────────

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.72rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
`;

const Input = styled.input`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s;

  &:focus { border-color: ${({ theme }) => theme.colors.accent2}; }
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; opacity: 0.4; }
`;

const Textarea = styled.textarea`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  font-size: 0.95rem;
  outline: none;
  resize: vertical;
  min-height: 240px;
  line-height: 1.6;
  font-family: inherit;
  transition: border-color 0.15s;

  &:focus { border-color: ${({ theme }) => theme.colors.accent2}; }
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; opacity: 0.4; }
`;

const SegmentRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.xs};
  flex-wrap: wrap;
`;

const Segment = styled.button<{ $active: boolean }>`
  background: ${({ theme, $active }) => $active ? theme.colors.surface2 : theme.colors.surface};
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.accent2 : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme, $active }) => $active ? theme.colors.text : theme.colors.textMuted};
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
`;

// ─── Bottom row ────────────────────────────────────────────────────────────

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatusText = styled.span<{ $error?: boolean }>`
  font-size: 0.8rem;
  color: ${({ theme, $error }) => $error ? '#f87171' : theme.colors.textMuted};
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.surface2};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.xl}`};
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.accent2};
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

// ─── Component ─────────────────────────────────────────────────────────────

const CATEGORIES = ['regular', 'trending', 'featured'] as const;
type Category = typeof CATEGORIES[number];

function NewPostEditorContent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [tags, setTags] = useState<SelectedTag[]>([]);
  const [link, setLink] = useState('');
  const [category, setCategory] = useState<Category>('regular');
  const [status, setStatus] = useState<{ msg: string; error: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = '/admin';
      return;
    }

    // Resolve tags sequentially — upsert new ones to get real IDs
    const validTags: { id: string; name: string }[] = [];
    for (const tag of tags) {
      if (tag.id) {
        validTags.push({ id: tag.id, name: tag.name });
      } else {
        const created = await upsertTag(tag.name);
        if (created) validTags.push({ id: created.id, name: created.name });
      }
    }

    // Insert the post
    const { data: post, error: postError } = await supabase
      .from('content_items')
      .insert({
        title: title.trim(),
        description: description.trim(),
        author_name: authorName.trim(),
        category,
        link: link.trim() || null,
        views: 0,
        likes: 0,
      })
      .select('id')
      .single();

    if (postError) {
      setStatus({ msg: postError.message, error: true });
      setLoading(false);
      return;
    }

    // Link tags to post
    if (validTags.length > 0) {
      const { error: tagError } = await supabase.from('content_item_tags').insert(
        validTags.map(tag => ({ content_item_id: post.id, tag_id: tag.id }))
      );
      if (tagError) {
        setStatus({ msg: tagError.message, error: true });
        setLoading(false);
        return;
      }
    }

    setStatus({ msg: 'Post published.', error: false });
    setLoading(false);
    setTitle('');
    setDescription('');
    setAuthorName('');
    setTags([]);
    setLink('');
    setCategory('regular');
  };

  return (
    <Wrapper>
      <TopBar>
        <Logo>New Post</Logo>
        <BackButton onClick={() => window.location.href = '/admin/dashboard'}>
          ← Dashboard
        </BackButton>
      </TopBar>
      <Body>
        <Form onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Post title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </Field>

          <Field>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What's this post about?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </Field>

          <Field>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              type="text"
              placeholder="Your name"
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              required
            />
          </Field>

          <Field>
            <Label htmlFor="link">YouTube Link <span style={{ fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></Label>
            <Input
              id="link"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={link}
              onChange={e => setLink(e.target.value)}
            />
          </Field>

          <Field>
            <Label>Tags</Label>
            <TagInput value={tags} onChange={setTags} />
          </Field>

          <Field>
            <Label>Category</Label>
            <SegmentRow>
              {CATEGORIES.map(c => (
                <Segment
                  key={c}
                  type="button"
                  $active={category === c}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </Segment>
              ))}
            </SegmentRow>
          </Field>

          <BottomRow>
            {status ? (
              <StatusText $error={status.error}>{status.msg}</StatusText>
            ) : (
              <span />
            )}
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Publishing…' : 'Publish'}
            </SubmitButton>
          </BottomRow>
        </Form>
      </Body>
    </Wrapper>
  );
}

export default function NewPostEditor() {
  return (
    <AuthGuard>
      <NewPostEditorContent />
    </AuthGuard>
  );
}
