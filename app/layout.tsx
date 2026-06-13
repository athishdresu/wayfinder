import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";

export const metadata = {
  title: "WayFinder Command Center",
  description: "Spatial Intelligence and Navigation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning is required by next-themes!
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}