import React from "react";
import { styled } from "styled-components";

const StyledCard = styled.div``;

export default function Card({ children }: { children: React.ReactNode }) {
  return <StyledCard>{children}</StyledCard>;
}
