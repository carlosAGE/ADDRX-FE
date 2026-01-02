import type { ReactNode } from "react";
import Nav from "../components/Nav";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: 24 }}>
      <Nav />
      <main style={{ marginTop: 20 }}>{children}</main>
    </div>
  );
}
