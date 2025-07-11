// src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css'; // Assuming you still have some basic CSS from create-react-app

// Define a TypeScript interface for the Product data structure
// This helps with type checking and autocompletion.
interface Product {
  id: number;
  name: string;
  description: string;
  price: string; // Django DecimalField often comes as a string in JSON
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
  // State to store the list of products received from the backend
  const [products, setProducts] = useState<Product[]>([]);
  // State to manage loading status
  const [loading, setLoading] = useState<boolean>(true);
  // State to handle any errors during the API call
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to perform side effects (like data fetching)
  // This effect runs once after the initial render (due to empty dependency array [])
  useEffect(() => {
    /**
     * Function to fetch products from the Django backend.
     * It uses the Fetch API to make a GET request to the /api/products/ endpoint.
     */
    const fetchProducts = async () => {
      try {
        // Set loading to true while fetching
        setLoading(true);
        setError(null); // Clear previous errors

        // Make sure this URL matches your Django backend's address and API endpoint.
        // Django's default development server runs on http://127.0.0.1:8000
        const response = await fetch('http://127.0.0.1:8000/api/products/');

        // Check if the response was successful (status code 200-299)
        if (!response.ok) {
          // If not successful, throw an error with the status
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();
        // Update the products state with the data from the backend
        setProducts(data); // Assuming the API returns an array directly
      } catch (e: any) {
        // Catch any errors during the fetch operation
        console.error("Failed to fetch products:", e);
        // Update the error state to display an error message to the user
        setError(`Failed to load products: ${e.message}. Please ensure Django backend is running and has products.`);
      } finally {
        // Set loading to false once fetching is complete (whether successful or not)
        setLoading(false);
      }
    };

    // Call the fetchProducts function when the component mounts
    fetchProducts();
  }, []); // Empty dependency array means this effect runs only once on mount

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
