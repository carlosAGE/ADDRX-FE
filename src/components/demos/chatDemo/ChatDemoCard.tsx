import React from "react";
import Card from "../../Card/Card";
import { styled } from "styled-components";
import ModeSelect from "../../Selectors/ModeSelect";

const StyledDemoCardComponent = styled.div``;

const SEA_NATIVE = "SEA_NATIVE";
const description1 =
  "AI built for Southeast Asia — multilingual, local-first, business-ready";
const OPS_CONTROL = "OPS_CONTROL";
const description2 =
  "High-precision operations mode with reduced creativity and tighter rules.";
const INSTANT_CHAT = "INSTANT_CHAT";
const description3 =
  "Low-latency, conversational AI for quick answers and ideation.";
const COMPLIANCE_GUARD = "COMPLIANCE_GUARD";
const description4 =
  "Risk-aware, audit-friendly AI designed to protect the business.";
const OFFLINE = "OFFLINE";
const description5 =
  "AI that runs entirely on local infrastructure for maximum data security.";
const CUSTOM_TAILORED = "CUSTOM_TAILORED";
const description6 =
  "AI tuned specifically to your company’s data, language, and workflows.";

const CHAT_TYPES = {
  [SEA_NATIVE]: description1,
  [OPS_CONTROL]: description2,
  [INSTANT_CHAT]: description3,
  [COMPLIANCE_GUARD]: description4,
  [OFFLINE]: description5,
  [CUSTOM_TAILORED]: description6,
};

export default function ChatDemoCard() {
  const [chatType, setChatType] = React.useState(SEA_NATIVE);

  return (
    <Card>
      <StyledDemoCardComponent>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <h2 className="title">
            Featured Service: Custom trained AI Chat specifically for your
            business
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <h3>Not all AIs are created equal</h3>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <h4>Power your business with the right tool for the job</h4>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <ModeSelect
            value={chatType}
            onChange={setChatType}
            options={[
              { value: SEA_NATIVE, label: "SEA Native" },
              { value: OPS_CONTROL, label: "Ops Control" },
              { value: INSTANT_CHAT, label: "Instant Chat" },
              { value: COMPLIANCE_GUARD, label: "Compliance Guard" },
              { value: OFFLINE, label: "Offline" },
              { value: CUSTOM_TAILORED, label: "Custom Tailored" },
            ]}
          />
        </div>

        <div className="chatWindow">CHAT WINDOW TYPE HERE</div>
        <div className="chatInput">INPUT AREA TYPE HERE</div>
      </StyledDemoCardComponent>
    </Card>
  );
}
