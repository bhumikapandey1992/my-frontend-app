// src/App.tsx
import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

// Define a TypeScript interface for the Product data structure
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

/**
 * Main application component.
 * This component now fetches a list of products from the Django backend
 * and displays them in a simple catalog.
 */
function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the environment variable for the backend URL.
        // This is the crucial part that needs to be correctly picked up at build time.
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000/api/';
        console.log(`Fetching products from: ${backendUrl}products/`); // For debugging

        const response = await fetch(`${backendUrl}products/`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (e: any) {
        console.error("Failed to fetch products:", e);
        setError(`Failed to load products: ${e.message}. Please ensure backend is running and has products.`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Product Catalog</h1> 
      </header>
      <main>
        {loading && <p>Loading products...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p>No products found. Please add some in the Django admin!</p>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="product-list">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p><strong>Price:</strong> ${parseFloat(product.price).toFixed(2)}</p>
                <p><strong>Stock:</strong> {product.stock}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="App-footer">
        <p>Powered by React and Django</p>
      </footer>
    </div>
  );
}
export default App;
