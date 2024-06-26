
import React from "react";
import { DM_Sans } from "next/font/google";

const inter = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "InterviewSensei  ",
  description: "Ace interview",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

