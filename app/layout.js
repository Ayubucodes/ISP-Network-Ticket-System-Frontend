import "./globals.css";

export const metadata = {
  title: "ISP Network Ticket System",
  description:
    "A modern ticketing platform for ISPs. Monitor nodes, resolve incidents, and delight customers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
