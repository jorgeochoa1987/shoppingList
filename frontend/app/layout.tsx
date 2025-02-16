import { ProductProvider } from '../context/ProductContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ProductProvider>
          {children}
        </ProductProvider>
      </body>
    </html>
  );
} 