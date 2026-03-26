import React from 'react';
import { styled } from 'styled-components';

const BioContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`;

const BioTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  letter-spacing: -0.025em;
`;

const BioDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  line-height: 1.5;
  font-weight: 300;
`;

const Bio: React.FC = () => {
  return (
    <BioContainer>
      <BioTitle>ADDRX</BioTitle>
      <BioDescription>
        Join us on our next build and get featured
      </BioDescription>
    </BioContainer>
  );
};

export default Bio;