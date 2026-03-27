import React, { useState } from 'react';
import { styled, keyframes, css } from 'styled-components';

// ─── Animations ────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── FAB ───────────────────────────────────────────────────────────────────

const Fab = styled.button`
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 100;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface2};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  transition: background 0.15s, border-color 0.15s, transform 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent2};
    transform: scale(1.07);
  }
`;

// ─── Overlay ───────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(3px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${fadeIn} 0.2s ease;
`;

// ─── Modal ─────────────────────────────────────────────────────────────────

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.space.xl};
  width: 100%;
  max-width: 420px;
  box-shadow: ${({ theme }) => theme.shadow.card};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
  animation: ${slideUp} 0.22s cubic-bezier(0.2,0.9,0.2,1);
`;

const ModalTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.1rem;
  cursor: pointer;
  padding: 2px 4px;
  line-height: 1;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

// ─── Form elements ─────────────────────────────────────────────────────────

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`;

const Label = styled.label`
  font-size: 0.7rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const sharedInputStyles = css`
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;

  &:focus { border-color: ${({ theme }) => theme.colors.accent2}; }
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; opacity: 0.4; }
`;

const Input = styled.input`
  ${sharedInputStyles}
`;

const Textarea = styled.textarea`
  ${sharedInputStyles}
  resize: vertical;
  min-height: 110px;
  line-height: 1.6;
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.surface2};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.lg}`};
  font-size: 0.82rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  align-self: flex-end;
  transition: border-color 0.15s;

  &:hover:not(:disabled) { border-color: ${({ theme }) => theme.colors.accent2}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const StatusText = styled.p<{ $error?: boolean }>`
  font-size: 0.8rem;
  margin: 0;
  color: ${({ $error }) => $error ? '#f87171' : '#86efac'};
`;

// ─── Component ─────────────────────────────────────────────────────────────

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ msg: string; error: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('https://formsubmit.co/ajax/addrxpteltd@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          _subject: `Message from ${name.trim()} via ADDRX`,
        }),
      });

      if (res.ok) {
        setStatus({ msg: 'Message sent.', error: false });
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus({ msg: 'Something went wrong. Try again.', error: true });
      }
    } catch {
      setStatus({ msg: 'Network error. Try again.', error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Fab onClick={() => setOpen(true)} aria-label="Contact us">
        ✉
      </Fab>

      {open && (
        <Overlay onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <Modal>
            <ModalTop>
              <ModalTitle>Email</ModalTitle>
              <CloseButton onClick={() => setOpen(false)}>✕</CloseButton>
            </ModalTop>

            <Form onSubmit={handleSubmit}>
              <Field>
                <Label htmlFor="c-name">Name</Label>
                <Input
                  id="c-name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="c-email">Email</Label>
                <Input
                  id="c-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="c-message">Message</Label>
                <Textarea
                  id="c-message"
                  placeholder="What's on your mind?"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                />
              </Field>

              {status && <StatusText $error={status.error}>{status.msg}</StatusText>}

              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Sending…' : 'Send'}
              </SubmitButton>
            </Form>
          </Modal>
        </Overlay>
      )}
    </>
  );
}
