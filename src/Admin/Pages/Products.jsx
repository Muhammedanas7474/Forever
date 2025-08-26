import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash, FiPlus, FiX, FiSave } from "react-icons/fi";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation schema
const productSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .required("Product name is required"),
  price: Yup.number()
    .min(0, "Price must be a positive number")
    .required("Price is required"),
  stock: Yup.number()
    .min(0, "Stock must be a positive number")
    .required("Stock is required"),
  image: Yup.string()
    .required("At least one image URL is required")
    .test('is-valid-urls', 'Enter valid comma-separated URLs', (value) => {
      if (!value) return false;
      const urls = value.split(',').map(url => url.trim());
      return urls.every(url => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      });
    }),
  category: Yup.string()
    .required("Category is required"),
  subCategory: Yup.string()
    .required("Sub category is required"),
  sizes: Yup.string()
    .required("Sizes are required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  bestseller: Yup.boolean()
});

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      stock: "",
      image: "",
      category: "",
      subCategory: "",
      sizes: "",
      description: "",
      bestseller: false,
    },
    validationSchema: productSchema,
    onSubmit: (values, { resetForm }) => {
      if (editProduct) {
        handleUpdateProduct(values);
      } else {
        handleAddProduct(values);
      }
      resetForm();
    }
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

  // Add product
  const handleAddProduct = async (values) => {
    try {
      const newId = Date.now().toString();

      const newProduct = {
        _id: newId,
        name: values.name,
        description: values.description,
        price: parseFloat(values.price),
        image: values.image
          ? values.image.split(",").map((url) => url.trim())
          : [],
        category: values.category,
        subCategory: values.subCategory,
        sizes: values.sizes
          ? values.sizes.split(",").map((size) => size.trim())
          : [],
        date: Number(new Date().toISOString().slice(0, 10).replace(/-/g, "")),
        bestseller: values.bestseller,
        stock: parseInt(values.stock) || 0,
      };

      await axios.post("http://localhost:3000/products", newProduct);
      fetchProducts();
      setShowForm(false);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    }
  };

  // Edit product (open form with pre-filled data)
  const handleEditProduct = (product) => {
    setEditProduct(product);
    formik.setValues({
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
  const handleUpdateProduct = async (values) => {
    try {
      const updatedProduct = {
        _id: editProduct.id,
        name: values.name,
        description: values.description,
        price: parseFloat(values.price),
        image: values.image
          ? values.image.split(",").map((url) => url.trim())
          : [],
        category: values.category,
        subCategory: values.subCategory,
        sizes: values.sizes
          ? values.sizes.split(",").map((size) => size.trim())
          : [],
        date: editProduct.date,
        bestseller: values.bestseller,
        stock: parseInt(values.stock) || 0,
      };

      await axios.put(
        `http://localhost:3000/products/${editProduct.id}`,
        updatedProduct
      );
      fetchProducts();
      setShowForm(false);
      setEditProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product. Please try again.");
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:3000/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product. Please try again.");
      }
    }
  };

  const closeModal = () => {
    setShowForm(false);
    setEditProduct(null);
    formik.resetForm();
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
        <h1 className="text-2xl font-bold text-gray-800">
          Products Management
        </h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditProduct(null);
            formik.resetForm();
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

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <img
                    src={
                      Array.isArray(product.image) && product.image.length > 0
                        ? product.image[0]
                        : "/placeholder-image.jpg"
                    }
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-4">
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {product.description}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-gray-900">{product.category || "N/A"}</div>
                  <div className="text-sm text-gray-500">{product.subCategory || ""}</div>
                </td>
                <td className="p-4">${product.price}</td>
                <td className="p-4">{product.stock ?? "N/A"}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
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

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Product Name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      name="price"
                      placeholder="Price"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.price && formik.errors.price && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.price}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      placeholder="Stock"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={formik.values.stock}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.stock && formik.errors.stock && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.stock}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma separated)</label>
                    <input
                      type="text"
                      name="image"
                      placeholder="Image URLs"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={formik.values.image}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.image && formik.errors.image && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.image}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      name="category"
                      placeholder="Category"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.category && formik.errors.category && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.category}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                    <input
                      type="text"
                      name="subCategory"
                      placeholder="Sub Category"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={formik.values.subCategory}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.subCategory && formik.errors.subCategory && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.subCategory}</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma separated)</label>
                    <input
                      type="text"
                      name="sizes"
                      placeholder="Sizes"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={formik.values.sizes}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.sizes && formik.errors.sizes && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.sizes}</div>
                    )}
                  </div>
                  
                  <div className="flex items-center mt-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="bestseller"
                        checked={formik.values.bestseller}
                        onChange={formik.handleChange}
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
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                  >
                    <FiSave className="mr-2" />
                    {editProduct ? "Update Product" : "Add Product"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;