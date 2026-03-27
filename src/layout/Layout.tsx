import type { ReactNode } from "react";
import Nav from "../components/Nav";
import ContactModal from "../components/ContactModal";
import { DrawerProvider } from "../context/DrawerContext";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DrawerProvider>
      <div>
        <Nav />
        <main>{children}</main>
        <ContactModal />
      </div>
    </DrawerProvider>
  );
}
