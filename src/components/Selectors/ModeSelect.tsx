import * as React from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import styled from "styled-components";

type Option = {
  value: string;
  label: string;
};

type Props = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

export default function ModeSelect({ options, value, onChange }: Props) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const pillRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef(new Map<string, HTMLButtonElement>());

  const setItemRef = (val: string) => (el: HTMLButtonElement | null) => {
    if (!el) itemRefs.current.delete(val);
    else itemRefs.current.set(val, el);
  };

  React.useEffect(() => {
    const el = itemRefs.current.get(value);
    const root = rootRef.current;
    const pill = pillRef.current;
    if (!el || !root || !pill) return;

    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    pill.style.transform = `translateX(${elRect.left - rootRect.left}px)`;
    pill.style.width = `${elRect.width}px`;
    pill.style.opacity = "1";
  }, [value]);

  React.useEffect(() => {
    const onResize = () => {
      const el = itemRefs.current.get(value);
      const root = rootRef.current;
      const pill = pillRef.current;
      if (!el || !root || !pill) return;

      const rootRect = root.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      pill.style.transform = `translateX(${elRect.left - rootRect.left}px)`;
      pill.style.width = `${elRect.width}px`;
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [value]);

  return (
    <Root
      ref={rootRef}
      value={value}
      onValueChange={onChange}
      aria-label="Mode selector"
    >
      <Pill ref={pillRef} />
      {options.map((o) => (
        <Item key={o.value} value={o.value} ref={setItemRef(o.value)}>
          {o.label}
        </Item>
      ))}
    </Root>
  );
}

/* ---------- styles ---------- */

const Root = styled(RadioGroup.Root)`
  position: relative;
  display: inline-flex;
  gap: 6px;
  padding: 6px 8px;
  /* border-radius: 14px; */
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.03);
`;

/* The moving highlight */
const Pill = styled.div`
  position: absolute;
  left: 0px;
  bottom: 0.5rem;
  height: 1.25rem;
  width: 0px;

  background: transparent;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text};
  pointer-events: none;
  opacity: 0;

  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
    width 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 160ms ease;

  /* soft glow rising from the border */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1px; /* sits just above border */
    height: 65%; /* glow height (~1/4–1/2 of text area); tweak */
    pointer-events: none;

    background: linear-gradient(
      to top,
      rgba(255, 255, 255, 0.18),
      rgba(255, 255, 255, 0.08) 45%,
      rgba(255, 255, 255, 0)
    );

    /* make it feel like light, not a block */
    filter: blur(6px);
    opacity: 0.9;
  }
`;

const Item = styled(RadioGroup.Item)`
  all: unset;
  cursor: pointer;
  position: relative;
  z-index: 1;

  padding: 8px 14px;
  font-size: 14px;
  line-height: 1;
  white-space: nowrap;

  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 160ms ease;

  &[data-state="checked"] {
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.25);
    outline-offset: 2px;
  }
`;
