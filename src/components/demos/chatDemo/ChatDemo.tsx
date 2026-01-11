import React from "react";

export default function ChatDemo(props: { chatType: string }) {
  const { chatType } = props;

  return (
    <div style={{}}>
      <div className="chatWindow">{chatType}</div>

      <div></div>
      <div className="chatInput"></div>
    </div>
  );
}
