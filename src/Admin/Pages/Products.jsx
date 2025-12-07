import React, { useEffect, useState } from "react";
import { 
  FiEdit, 
  FiTrash, 
  FiPlus, 
  FiX, 
  FiSave,
  FiSearch,
  FiImage,
  FiPackage,
  FiTrendingUp,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle
} from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import adminService from "../services/adminService";
import { toast } from "react-toastify";

// 🔐 category name → id map (based on your DB)
const CATEGORY_ID_MAP = {
  Men: 1,
  Kids: 2,
  Women: 3,
};

// Reverse mapping for display
const CATEGORY_ID_TO_NAME = {
  1: "Men",
  2: "Kids",
  3: "Women"
};

// Cloudinary base URL
const CLOUDINARY_BASE = "https://res.cloudinary.com/dvbxeayci/";

// Validation schema for create
const createProductSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .required("Product name is required"),
  price: Yup.number()
    .positive("Price must be a positive number")
    .required("Price is required"),
  stock_count: Yup.number()
    .min(0, "Stock must be 0 or greater")
    .integer("Stock must be a whole number")
    .required("Stock is required"),
  category: Yup.number().required("Category is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  sizes: Yup.array()
    .min(1, "At least one size is required")
    .required("Sizes are required"),
});

// Validation schema for edit (images not required)
const editProductSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .required("Product name is required"),
  price: Yup.number()
    .positive("Price must be a positive number")
    .required("Price is required"),
  stock_count: Yup.number()
    .min(0, "Stock must be 0 or greater")
    .integer("Stock must be a whole number")
    .required("Stock is required"),
  category: Yup.number().required("Category is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  sizes: Yup.array()
    .min(1, "At least one size is required")
    .required("Sizes are required"),
});

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories] = useState([
    { id: 1, name: "Men" },
    { id: 2, name: "Kids" },
    { id: 3, name: "Women" }
  ]);
  const [authError, setAuthError] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [availableSizes] = useState(["XS", "S", "M", "L", "XL", "XXL", "One Size"]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });

  // Formik initialization - use create schema by default
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      stock_count: "",
      category: "",
      description: "",
      active: true,
      sizes: [],
    },
    validationSchema: createProductSchema,
    onSubmit: async (values, { resetForm }) => {
      await handleSubmitProduct(values, resetForm);
    },
  });

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
    fetchProducts();
  }, []);

  // Check if user is authenticated and is admin
  const checkAuthentication = () => {
    try {
      const token = localStorage.getItem("access_token");
      const userData = localStorage.getItem("user");
      
      if (!token || !userData) {
        setAuthError(true);
        toast.error("Please login to access admin panel");
        return false;
      }

      const user = JSON.parse(userData);
      if (user.role !== "admin") {
        setAuthError(true);
        toast.error("Admin access required");
        return false;
      }

      setAuthError(false);
      return true;
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthError(true);
      return false;
    }
  };

  // Fetch products
  const fetchProducts = async (page = 1) => {
    if (!checkAuthentication()) return;

    try {
      setLoading(true);
      const response = await adminService.getProducts(page);

      // Handle paginated response
      if (response && response.results) {
        const productsList = response.results.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: Number(p.price) || 0,
          stock_count: p.stock_count ?? 0,
          category: CATEGORY_ID_TO_NAME[p.category] || "Uncategorized",
          categoryId: p.category,
          active: p.active,
          sizes: p.sizes || [],
          created_at: p.created_at,
          updated_at: p.updated_at,
          images: (p.images || []).map((img) =>
            img?.image?.startsWith('http') ? img.image : `${CLOUDINARY_BASE}${img.image}`
          ).filter(Boolean),
        }));

        setProducts(productsList);
        setPagination({
          currentPage: page,
          totalPages: Math.ceil(response.count / 10),
          totalItems: response.count,
          pageSize: 10
        });
      } else if (Array.isArray(response)) {
        const productsList = response.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: Number(p.price) || 0,
          stock_count: p.stock_count ?? 0,
          category: CATEGORY_ID_TO_NAME[p.category] || "Uncategorized",
          categoryId: p.category,
          active: p.active,
          sizes: p.sizes || [],
          images: (p.images || []).map((img) =>
            img?.image?.startsWith('http') ? img.image : `${CLOUDINARY_BASE}${img.image}`
          ).filter(Boolean),
        }));

        setProducts(productsList);
      }
    } catch (error) {
      console.error("Error fetching products:", error);

      if (error.response?.status === 401 || error.message?.includes("401")) {
        toast.error("Session expired. Please login again.");
        setAuthError(true);
      } else {
        toast.error("Failed to load products");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (!searchValue) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      const response = await adminService.searchProducts(searchValue);
      
      if (response && response.results) {
        const productsList = response.results.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: Number(p.price) || 0,
          stock_count: p.stock_count ?? 0,
          category: CATEGORY_ID_TO_NAME[p.category] || "Uncategorized",
          categoryId: p.category,
          active: p.active,
          sizes: p.sizes || [],
          images: (p.images || []).map((img) =>
            img?.image?.startsWith('http') ? img.image : `${CLOUDINARY_BASE}${img.image}`
          ).filter(Boolean),
        }));
        setProducts(productsList);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      toast.error("Failed to search products");
    } finally {
      setLoading(false);
    }
  };

  // Edit product
  const handleEditProduct = (product) => {
    setEditProduct(product);
    setSizes(product.sizes || []);
    setImagePreviews(product.images || []);
    setSelectedImages([]);
    
    formik.setValues({
      name: product.name || "",
      price: product.price || "",
      stock_count: product.stock_count || 0,
      category: product.categoryId || "",
      description: product.description || "",
      active: product.active !== false,
      sizes: product.sizes || [],
    });
    
    // Switch to edit schema
    formik.validationSchema = editProductSchema;
    
    setShowForm(true);
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = [];
    const newImages = [];

    files.forEach(file => {
      newPreviews.push(URL.createObjectURL(file));
      newImages.push(file);
    });

    setImagePreviews(prev => [...prev, ...newPreviews]);
    setSelectedImages(prev => [...prev, ...newImages]);
  };

  // Remove image
  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    const newImages = [...selectedImages];
    
    newPreviews.splice(index, 1);
    newImages.splice(index, 1);
    
    setImagePreviews(newPreviews);
    setSelectedImages(newImages);
  };

  // Handle size selection
  const toggleSize = (size) => {
    const newSizes = sizes.includes(size) 
      ? sizes.filter(s => s !== size)
      : [...sizes, size];
    
    setSizes(newSizes);
    formik.setFieldValue('sizes', newSizes);
  };

  // Handle product submission
  const handleSubmitProduct = async (values, resetForm) => {
    if (!checkAuthentication()) return;

    try {
      setIsSubmitting(true);

      if (editProduct) {
        // For updates - PATCH with JSON data
        const updateData = {
          name: values.name,
          price: parseFloat(values.price),
          stock_count: parseInt(values.stock_count),
          category: parseInt(values.category),
          description: values.description,
          active: values.active,
          sizes: values.sizes,
        };
        
        console.log("Updating product with data:", updateData);
        console.log("Product ID:", editProduct.id);
        
        await adminService.updateProduct(editProduct.id, updateData);
        toast.success("Product updated successfully");
      } else {
        // For new products - POST with FormData
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('price', parseFloat(values.price));
        formData.append('stock_count', parseInt(values.stock_count));
        formData.append('category', parseInt(values.category));
        formData.append('description', values.description);
        formData.append('active', values.active);
        formData.append('sizes', JSON.stringify(values.sizes));

        // Add images
        if (selectedImages.length === 0) {
          toast.error("At least one image is required");
          setIsSubmitting(false);
          return;
        }
        
        selectedImages.forEach((img) => {
          formData.append('images', img);
        });
        
        console.log("Creating product with FormData:");
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
        
        await adminService.createProduct(formData);
        toast.success("Product created successfully");
      }

      await fetchProducts();
      closeModal();
    } catch (error) {
      console.error("Error saving product:", error);
      setIsSubmitting(false);
      
      // Handle validation errors from backend
      if (error.response?.data) {
        const errors = error.response.data;
        
        if (typeof errors === 'object') {
          Object.keys(errors).forEach(key => {
            // Handle nested errors
            if (Array.isArray(errors[key])) {
              errors[key].forEach(err => toast.error(`${key}: ${err}`));
            } else if (typeof errors[key] === 'object') {
              // Handle nested object errors
              Object.keys(errors[key]).forEach(nestedKey => {
                toast.error(`${key}.${nestedKey}: ${errors[key][nestedKey]}`);
              });
            } else {
              toast.error(`${key}: ${errors[key]}`);
            }
          });
        } else if (typeof errors === 'string') {
          toast.error(errors);
        } else {
          toast.error("Failed to save product");
        }
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(`Failed to ${editProduct ? "update" : "create"} product`);
      }
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!checkAuthentication()) return;

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await adminService.deleteProduct(id);
        toast.success("Product deleted successfully");
        await fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);

        if (error.response?.status === 401 || error.message?.includes("401")) {
          toast.error("Session expired. Please login again.");
          setAuthError(true);
        } else {
          toast.error("Failed to delete product");
        }
      }
    }
  };

  // Toggle product status
  const toggleProductStatus = async (id, currentStatus) => {
    if (!checkAuthentication()) return;

    try {
      await adminService.updateProduct(id, { active: !currentStatus });
      toast.success(`Product ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      await fetchProducts();
    } catch (error) {
      console.error("Error toggling product status:", error);
      toast.error("Failed to update product status");
    }
  };

  const closeModal = () => {
    setShowForm(false);
    setEditProduct(null);
    setSelectedImages([]);
    setImagePreviews([]);
    setSizes([]);
    formik.resetForm();
    // Reset to create schema
    formik.validationSchema = createProductSchema;
  };

  // Get stock status
  const getStockStatus = (stock) => {
    if (stock === 0 || stock === undefined) {
      return { text: "Out of Stock", colorClass: "bg-red-100 text-red-700" };
    }
    if (stock < 10) {
      return { text: "Low Stock", colorClass: "bg-yellow-100 text-yellow-700" };
    }
    return { text: "In Stock", colorClass: "bg-green-100 text-green-700" };
  };

  // Get product status
  const getProductStatus = (active) => {
    return active 
      ? { text: "Active", colorClass: "bg-green-100 text-green-700" }
      : { text: "Inactive", colorClass: "bg-red-100 text-red-700" };
  };

  // Get image URL
  const getImageUrl = (product) => {
    if (Array.isArray(product.images) && product.images[0]) {
      return product.images[0];
    }
    return null;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Show authentication error
  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6">
        <FiAlertCircle className="text-4xl text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Authentication Required</h2>
        <p className="text-gray-600 mb-4 text-center">
          You need to be logged in as an administrator to access this page.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => window.location.href = "/login"}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => window.location.href = "/"}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
          <p className="text-gray-600">
            {pagination.totalItems} product{pagination.totalItems !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => fetchProducts()}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center transition-colors"
              title="Refresh"
            >
              <FiRefreshCw />
            </button>
            <button
              onClick={() => {
                if (!checkAuthentication()) return;
                setShowForm(true);
                setEditProduct(null);
                setSelectedImages([]);
                setImagePreviews([]);
                setSizes([]);
                formik.resetForm();
                // Reset to create schema
                formik.validationSchema = createProductSchema;
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
            >
              <FiPlus className="mr-2" /> Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => fetchProducts(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => fetchProducts(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <FiPackage className="mx-auto text-4xl text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {searchTerm ? "No products match your search" : "No products found"}
          </h3>
          <p className="text-gray-500 mb-4">
            {!searchTerm && "Start by adding your first product"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => {
                if (!checkAuthentication()) return;
                setShowForm(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg inline-flex items-center transition-colors"
            >
              <FiPlus className="mr-2" /> Add Product
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Image</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Product</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Category</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Price</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Stock</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Last Updated</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const stockStatus = getStockStatus(product.stock_count);
                  const productStatus = getProductStatus(product.active);
                  const imageUrl = getImageUrl(product);
                  
                  return (
                    <tr key={product.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                            <FiImage className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">
                          {product.name || "Unnamed Product"}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description || "No description"}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.sizes?.map((size, index) => (
                            <span key={index} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded">
                              {size}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {product.category || "Uncategorized"}
                        </span>
                      </td>
                      <td className="p-4 font-medium">
                        ${product.price?.toFixed ? product.price.toFixed(2) : product.price}
                      </td>
                      <td className="p-4">{product.stock_count || 0}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${stockStatus.colorClass}`}>
                            {stockStatus.text}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${productStatus.colorClass}`}>
                            {productStatus.text}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {formatDate(product.updated_at)}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col space-y-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-600 hover:text-blue-800 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => toggleProductStatus(product.id, product.active)}
                              className={`p-1.5 rounded-full transition-colors ${
                                product.active 
                                  ? "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                                  : "text-green-600 hover:text-green-800 hover:bg-green-50"
                              }`}
                              title={product.active ? "Deactivate" : "Activate"}
                            >
                              {product.active ? <FiXCircle size={18} /> : <FiCheckCircle size={18} />}
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <FiTrash size={18} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault(); // CRITICAL: Prevent default form submission
                formik.handleSubmit(e);
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Product Name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition-colors"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      placeholder="Price"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition-colors"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.price && formik.errors.price && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.price}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Count *
                    </label>
                    <input
                      type="number"
                      name="stock_count"
                      placeholder="Stock Quantity"
                      min="0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition-colors"
                      value={formik.values.stock_count}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.stock_count && formik.errors.stock_count && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.stock_count}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition-colors"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {formik.touched.category && formik.errors.category && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.category}</div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    placeholder="Product description..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition-colors"
                    rows="3"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sizes *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          sizes.includes(size)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {formik.touched.sizes && formik.errors.sizes && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.sizes}</div>
                  )}
                  <div className="text-sm text-gray-500 mt-2">
                    Selected: {sizes.join(", ") || "None"}
                  </div>
                </div>

                {!editProduct && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Images *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center justify-center"
                      >
                        <FiImage className="text-4xl text-gray-400 mb-2" />
                        <p className="text-gray-600">Click to upload images</p>
                        <p className="text-sm text-gray-500">Supported: JPG, PNG, WebP</p>
                      </label>
                    </div>
                    {imagePreviews.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Selected Images ({imagePreviews.length})
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              >
                                <FiX size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {formik.touched.images && formik.errors.images && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.images}</div>
                    )}
                  </div>
                )}

                <div className="flex items-center mb-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formik.values.active}
                      onChange={formik.handleChange}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active Product</span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                  >
                    <FiSave className="mr-2" />
                    {isSubmitting ? "Saving..." : editProduct ? "Update Product" : "Create Product"}
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