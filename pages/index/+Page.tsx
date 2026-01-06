import Layout from "../../src/layout/Layout";
import { styled } from "styled-components";

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
        <div>Custom tooling to get ahead of the competition</div>
        <div>HOT</div>
        <div>
          <div>CHAT</div>
          <div>INPUT</div>
        </div>
      </StyledHome>
    </Layout>
  );
}
