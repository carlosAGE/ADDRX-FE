import Layout from "../../src/layout/Layout";
import { styled } from "styled-components";
import { SlideInBot } from "../../src/components/Wrappers/Animations/SlideInBot";
import InfiniteContentFeed from "../../src/components/InfiniteContentFeed/InfiniteContentFeed.tsx";

const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
`;

export default function Page() {
  return (
    <Layout>
      <SlideInBot>
        <StyledHome>
          <InfiniteContentFeed />
        </StyledHome>
      </SlideInBot>
    </Layout>
  );
}
