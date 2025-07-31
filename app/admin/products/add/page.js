"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const [form, setForm] = useState({ 
    title: "", 
    price: "", 
    description: "", 
    image: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          userId: "admin-123" // This should come from the session in a real app
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Product added successfully!");
        setForm({ title: "", price: "", description: "", image: "" });
        
        // Redirect to products page after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(data.error || "Failed to add product");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Product</h1>
        
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
              {success}
            </div>
          )}
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Product Title
            </label>
            <input 
              id="title"
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input 
              id="price"
              type="number"
              step="0.01"
              min="0"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter price (e.g., 99.99)"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
            />
          </div>
          
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input 
              id="image"
              type="url"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter image URL"
              value={form.image}
              onChange={e => setForm({ ...form, image: e.target.value })}
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea 
              id="description"
              required
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          
          <div className="flex gap-4">
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
            
            <button 
              type="button"
              onClick={() => router.push("/")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
