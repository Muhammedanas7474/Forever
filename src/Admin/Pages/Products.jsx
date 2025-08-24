import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash, FiPlus, FiX, FiSave } from "react-icons/fi";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
    category: "",
    subCategory: "",
    sizes: "",
    description: "",
    bestseller: false,
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products");
      setProducts(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add product
  const handleAddProduct = async () => {
    try {
      const newId = `p${Date.now()}`;
      const shortId = Math.random().toString(36).substring(2, 6);

      const newProduct = {
        _id: newId,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image ? formData.image.split(",").map(url => url.trim()) : [],
        category: formData.category,
        subCategory: formData.subCategory,
        sizes: formData.sizes ? formData.sizes.split(",").map(size => size.trim()) : [],
        date: Number(new Date().toISOString().slice(0, 10).replace(/-/g, "")),
        bestseller: formData.bestseller,
        id: shortId,
        stock: parseInt(formData.stock) || 0,
      };

      await axios.post("http://localhost:3000/products", newProduct);
      fetchProducts();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    }
  };

  // Edit product
  const handleEditProduct = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: Array.isArray(product.image)
        ? product.image.join(",")
        : product.image || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      sizes: Array.isArray(product.sizes) ? product.sizes.join(",") : "",
      description: product.description || "",
      bestseller: product.bestseller || false,
    });
    setShowForm(true);
  };

  // Update product
  const handleUpdateProduct = async () => {
    try {
      const updatedProduct = {
        _id: editProduct._id,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image ? formData.image.split(",").map(url => url.trim()) : [],
        category: formData.category,
        subCategory: formData.subCategory,
        sizes: formData.sizes ? formData.sizes.split(",").map(size => size.trim()) : [],
        date: editProduct.date,
        bestseller: formData.bestseller,
        id: editProduct.id,
        stock: parseInt(formData.stock) || 0,
      };

      // JSON Server uses 'id' instead of '_id' for resource identification
      await axios.put(`http://localhost:3000/products/${editProduct.id}`, updatedProduct);
      fetchProducts();
      setShowForm(false);
      setEditProduct(null);
      resetForm();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product. Please try again.");
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // JSON Server uses 'id' instead of '_id' for resource identification
        await axios.delete(`http://localhost:3000/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      stock: "",
      image: "",
      category: "",
      subCategory: "",
      sizes: "",
      description: "",
      bestseller: false,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditProduct(null);
            resetForm();
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <FiPlus className="mr-2" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {editProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditProduct(null);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                name="price"
                placeholder="Price"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma separated)</label>
              <input
                type="text"
                name="image"
                placeholder="Image URLs"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.image}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                name="category"
                placeholder="Category"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
              <input
                type="text"
                name="subCategory"
                placeholder="Sub Category"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.subCategory}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma separated)</label>
              <input
                type="text"
                name="sizes"
                placeholder="Sizes"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.sizes}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex items-center mt-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="bestseller"
                  checked={formData.bestseller}
                  onChange={handleChange}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Bestseller</span>
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Description"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={editProduct ? handleUpdateProduct : handleAddProduct}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FiSave className="mr-2" />
              {editProduct ? "Update Product" : "Add Product"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditProduct(null);
                resetForm();
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="p-4">
                  <img
                    src={
                      Array.isArray(product.image) && product.image.length > 0
                        ? product.image[0]
                        : "/placeholder-image.jpg"
                    }
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <div className="text-gray-900">{product.category || "N/A"}</div>
                    <div className="text-sm text-gray-500">{product.subCategory || ""}</div>
                  </div>
                </td>
                <td className="p-4 text-gray-900">${product.price}</td>
                <td className="p-4">{product.stock ?? "N/A"}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                      (product.stock ?? 0) === 0
                        ? "bg-red-100 text-red-800"
                        : (product.stock ?? 0) < 10
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {(product.stock ?? 0) === 0
                      ? "Out of Stock"
                      : (product.stock ?? 0) < 10
                      ? "Low Stock"
                      : "In Stock"}
                  </span>
                  {product.bestseller && (
                    <span className="ml-2 inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                      Bestseller
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                      title="Edit"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                      title="Delete"
                    >
                      <FiTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  {searchTerm ? "No products match your search" : "No products found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;