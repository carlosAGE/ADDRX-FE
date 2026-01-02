import type { ReactNode } from "react";
import Nav from "../components/Nav";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Nav />
      <main>{children}</main>
    </div>
  );
}
