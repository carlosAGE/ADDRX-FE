import React from 'react';
import { styled } from 'styled-components';
import { supabase } from '../../lib/supabase';
import AuthGuard from './AuthGuard';

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

const TopBarActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
`;

const Button = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  background: ${({ theme, $variant }) =>
    $variant === 'primary' ? theme.colors.surface2 : 'transparent'};
  border: 1px solid ${({ theme, $variant }) =>
    $variant === 'primary' ? theme.colors.border : 'transparent'};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.surface2};
    border-color: ${({ theme }) => theme.colors.border};
  }
`;

const Body = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.lg};
  padding: ${({ theme }) => theme.space.xl};
`;

const Hint = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
  margin: 0;
`;

const NewPostButton = styled.button`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => `${theme.space.md} ${theme.space.xl}`};
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  box-shadow: ${({ theme }) => theme.shadow.card};

  &:hover {
    background: ${({ theme }) => theme.colors.surface2};
    border-color: ${({ theme }) => theme.colors.accent2};
  }
`;

function DashboardContent() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin';
  };

  const handleNewPost = () => {
    window.location.href = '/admin/new-post';
  };

  return (
    <Wrapper>
      <TopBar>
        <Logo>ADDRX — Admin</Logo>
        <TopBarActions>
          <Button $variant="ghost" onClick={handleSignOut}>Sign out</Button>
        </TopBarActions>
      </TopBar>
      <Body>
        <NewPostButton onClick={handleNewPost}>+ New Post</NewPostButton>
        <Hint>More controls coming soon.</Hint>
      </Body>
    </Wrapper>
  );
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
