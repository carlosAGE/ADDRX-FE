import Layout from "../../src/layout/Layout";
import { styled } from "styled-components";
import ChatDemoCard from "../../src/components/demos/chatDemo/ChatDemoCard";
import { SlideInBot } from "../../src/components/Wrappers/Animations/SlideInBot";

const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
export default function Page() {
  return (
    <Layout>
      <SlideInBot>
        <StyledHome>
          <ChatDemoCard />
        </StyledHome>
      </SlideInBot>
    </Layout>
  );
}
