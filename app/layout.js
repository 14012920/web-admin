import { Inter } from "next/font/google";
import "./ui/globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DuoPrimp Admin",
  description: "this is Duoprimp website admin panel",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
