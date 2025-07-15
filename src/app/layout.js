import './globals.css';

export const metadata = {
  title: 'Home',
  description: 'My Tailwind Next.js App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-gray-800 antialiased overflow-x-hidden">
        <div className="min-h-screen flex flex-col">
          {children} 

          <footer className="w-full bg-gray-100 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} My App. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
