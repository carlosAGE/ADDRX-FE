import Layout from "../../src/layout/Layout";
import { styled } from "styled-components";
import ChatDemoCard from "../../src/components/demos/chatDemo/ChatDemoCard";

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
      <StyledHome>
        <ChatDemoCard />
      </StyledHome>
    </Layout>
  );
}
