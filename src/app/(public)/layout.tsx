import Footer from "@/components/layout/home/footer";
import Nav from "@/components/layout/home/nav";

export default function PublicPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
