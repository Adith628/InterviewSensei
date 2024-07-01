import Nav from "@components/Nav";

export const metadata = {
  title: "InterviewSensei",
  description:
    "Web application where people can practice their interview skills",
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <body>
      <main className="app">
        <Nav />
        {children}
      </main>
    </body>
  </html>
);

export default RootLayout;
