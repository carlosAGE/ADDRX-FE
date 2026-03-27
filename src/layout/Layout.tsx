import type { ReactNode } from "react";
import Nav from "../components/Nav";
import { DrawerProvider } from "../context/DrawerContext";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DrawerProvider>
      <div>
        <Nav />
        <main>{children}</main>
      </div>
    </DrawerProvider>
  );
}
