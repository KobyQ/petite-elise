"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Image from "next/image";
import { 
  FaSearch, 
  FaFilter, 
  FaShoppingCart, 
  FaHeart, 
  FaStar,
  FaTimes,
  FaTag,
  FaCreditCard,
  FaShieldAlt,
  FaEye
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { formatMoneyToCedis } from "@/utils/constants";
import supabase from "@/utils/supabaseClient";
import CTA from "@/components/programs/CTA";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean; // Product active status
  details?: Record<string, string>;
  created_at: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// ProductCard component defined outside to prevent re-creation on every render
const ProductCard = ({ 
  product, 
  cart, 
  onAddToCart, 
  onViewDetails, 
  onViewCart 
}: { 
  product: Product; 
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onViewCart: () => void;
}) => {
  const isInCart = cart.some(item => item.product.id === product.id);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
    >
      <div className="relative overflow-hidden">
        <Image
          src={product.images?.[0] || "/placeholder-product.jpg"}
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.is_featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            ⭐ Featured
          </div>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50">
            <FaHeart className="text-red-500" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
          {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{product.name}</h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
                           <div className="flex items-center justify-between mb-4">
           <div className="text-2xl font-bold text-primary">
             {formatMoneyToCedis(product.price)}
           </div>
         </div>
        
        <div className="space-y-3">
          <Button
            type="button"
            onClick={() => onViewDetails(product)}
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
          >
            <FaEye className="mr-2" />
            View Details
          </Button>
          
          <Button
            type="button"
            onClick={() => isInCart ? onViewCart() : onAddToCart(product)}
            disabled={product.stock_quantity === 0}
            className={`w-full font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
              isInCart 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white"
            }`}
          >
            <FaShoppingCart className="mr-2" />
            {product.stock_quantity === 0 
              ? "Out of Stock" 
              : isInCart 
                ? "View Cart" 
                : "Add to Cart"
            }
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountData, setDiscountData] = useState<{ discount_percentage: number; is_active: boolean; usage_count: number } | null>(null);
  const [validatingDiscount, setValidatingDiscount] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);
  const [showCustomerInfoModal, setShowCustomerInfoModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // Memoized callback functions to prevent unnecessary re-renders
  const handleViewDetails = useCallback((product: Product) => {
    setSelectedProductForDetails(product);
    setShowDetailsModal(true);
  }, []);

  const handleViewCart = useCallback(() => {
    setShowCart(true);
  }, []);

  // Fetch products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Filter products when search, category, or sort changes
  useEffect(() => {
    let filtered = products;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "featured":
        filtered = filtered.filter(product => product.is_featured);
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("product_categories")
        .select("name")
        .order("name");

      if (error) throw error;
      setCategories(data?.map(cat => cat.name) || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getCartTotal = () => {
    // Product prices are stored in pesewas, calculate total in pesewas
    const subtotalInPesewas = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    if (discountData) {
      const discount = (subtotalInPesewas * discountData.discount_percentage) / 100;
      // Round to nearest integer to ensure Paystack compatibility
      const finalAmount = Math.round(subtotalInPesewas - discount);
      // Ensure amount is at least 1 pesewa (minimum Paystack amount)
      return Math.max(1, finalAmount);
    }
    return subtotalInPesewas;
  };



  const validateDiscountCode = async (code: string) => {
    if (!code.trim()) {
      setDiscountData(null);
      return;
    }

    setValidatingDiscount(true);
    try {
      const { data, error } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("discount_code", code.trim().toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        toast.error("Invalid or inactive discount code");
        setDiscountData(null);
        return;
      }

      // Validate discount percentage
      if (!data.discount_percentage || data.discount_percentage <= 0 || data.discount_percentage > 100) {
        toast.error("Invalid discount percentage");
        setDiscountData(null);
        return;
      }

      setDiscountData(data);
      toast.success(`Discount code applied! ${data.discount_percentage}% off`);
    } catch (error) {
      console.error("Error validating discount code:", error);
      toast.error("Error validating discount code");
    } finally {
      setValidatingDiscount(false);
    }
  };

  const initiatePayment = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Show customer info modal first
    setShowCustomerInfoModal(true);
  };

  const processPayment = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error("Please fill in all customer information");
      return;
    }

    setSubmittingPayment(true);

    try {
      // getCartTotal() now returns amount in pesewas, so we don't need to multiply by 100
      const totalAmountInPesewas = getCartTotal();

      // Validate amount before proceeding
      if (totalAmountInPesewas <= 0 || !Number.isInteger(totalAmountInPesewas)) {
        throw new Error("Invalid amount calculated. Please try again.");
      }

      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price, // Keep in pesewas for consistency
          name: item.product.name,
          images: item.product.images
        })),
        total_amount: totalAmountInPesewas, // Store in pesewas to match Paystack
        discount_code: discountCode.trim().toUpperCase() || null,
        discount_data: discountData,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        program_type: "Shop Order"
      };

      // Initialize payment with Paystack
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customerInfo.email,
          amount: totalAmountInPesewas,
          callback_url: `${window.location.origin}/shop/payment-success`,
          metadata: {
            order_type: "shop_order",
            customer_name: customerInfo.name,
            customer_phone: customerInfo.phone,
            amount_in_cedis: totalAmountInPesewas / 100
          }
        }),
      });

      const result = await response.json();

      if (!result.status) {
        throw new Error(result.message || "Failed to initialize payment");
      }

      // Save transaction to our database
      const { error: dbError } = await supabase.from("transactions").insert({
        amount: totalAmountInPesewas, // Store in pesewas to match Paystack
        reference: result.data.reference,
        paystack_response: result,
        status: "pending",
        details: orderData,
        order_id: `SHOP-${Date.now()}`,
      });

      if (dbError) {
        throw new Error(`Failed to save transaction: ${dbError.message}`);
      }

      // Redirect to Paystack payment page
      window.location.href = result.data.authorization_url;

    } catch (error: unknown) {
      console.error("Payment error:", error);
      const errorMessage = error instanceof Error ? error.message : "Payment failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSubmittingPayment(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section - Following the existing pattern */}
      <div className="relative h-[60vh] flex items-center justify-center text-center text-white">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://media.istockphoto.com/id/639407632/photo/excited-school-girls-during-chemistry-experiment.jpg?s=612x612&w=0&k=20&c=-W-vGm-bJ9XnxiCyFIxmLz3Asi0NJEiUjJoPShtBGLo=')",
          }}
        >
          {/* Lighter Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, rgba(0, 127, 148, 0.3), rgba(0, 127, 148, 0.5))`,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-md">School Supplies Shop</h1>
          <p className="text-xl mb-8 drop-shadow-md">Quality educational materials and supplies for your child&apos;s learning journey</p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <input
              type="search"
              placeholder="Search for school supplies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
              className="w-full px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
            />
            <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="featured">Featured Only</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              cart={cart}
              onAddToCart={addToCart}
              onViewDetails={handleViewDetails}
              onViewCart={handleViewCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>

      {/* Shopping Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                  <button
                    type="button"
                    onClick={() => setShowCart(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FaTimes />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🛒</div>
                      <p className="text-gray-500">Your cart is empty</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-4">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <Image
                            src={item.product.images?.[0] || "/placeholder-product.jpg"}
                            alt={item.product.name}
                            width={60}
                            height={60}
                            className="w-15 h-15 object-cover rounded-lg"
                          />
                                                     <div className="flex-1">
                             <h4 className="font-semibold text-gray-900 line-clamp-1">{item.product.name}</h4>
                             <p className="text-primary font-bold">{formatMoneyToCedis(item.product.price)}</p>
                           </div>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Discount Code */}
                    <div className="border-t pt-4 mb-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Discount code"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Button
                          type="button"
                          onClick={() => validateDiscountCode(discountCode)}
                          disabled={validatingDiscount || !discountCode}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                        >
                          {validatingDiscount ? "..." : "Apply"}
                        </Button>
                      </div>
                      {discountData && (
                        <div className="mt-2 text-sm text-green-600 flex items-center">
                          <FaTag className="mr-1" />
                          {discountData.discount_percentage}% discount applied!
                        </div>
                      )}
                    </div>

                                         {/* Cart Total */}
                     <div className="border-t pt-4 mb-4">
                       <div className="flex justify-between text-lg font-semibold">
                         <span>Total:</span>
                         <span className="text-primary">{formatMoneyToCedis(getCartTotal())}</span>
                       </div>
                       {discountData && (
                         <div className="text-sm text-gray-500 text-right">
                           You saved {formatMoneyToCedis(Math.round(cart.reduce((total, item) => total + (item.product.price * item.quantity), 0) - getCartTotal()))}
                         </div>
                       )}
                     </div>

                    {/* Checkout Button */}
                    <Button
                      type="button"
                      onClick={initiatePayment}
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <FaCreditCard className="mr-2" />
                      Proceed to Checkout
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedProductForDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Product Details</h2>
                  <button
                    type="button"
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FaTimes className="text-gray-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Product Images */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Images</h3>
                    {selectedProductForDetails.images && selectedProductForDetails.images.length > 0 ? (
                      <div className="space-y-4">
                        {selectedProductForDetails.images.map((image, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={image}
                              alt={`${selectedProductForDetails.name} - ${index + 1}`}
                              width={400}
                              height={300}
                              className="w-full h-64 object-cover rounded-lg border"
                            />
                            {index === 0 && (
                              <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                Main Image
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No images available</p>
                      </div>
                    )}
                  </div>

                  {/* Product Information */}
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">Basic Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Product Name</label>
                          <p className="text-lg font-semibold text-gray-900">{selectedProductForDetails.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Category</label>
                          <p className="text-gray-900">{selectedProductForDetails.category}</p>
                        </div>
                                                 <div>
                           <label className="text-sm font-medium text-gray-600">Price</label>
                           <p className="text-2xl font-bold text-primary">{formatMoneyToCedis(selectedProductForDetails.price)}</p>
                         </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Stock Quantity</label>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedProductForDetails.stock_quantity > 10
                              ? "bg-green-100 text-green-800"
                              : selectedProductForDetails.stock_quantity > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {selectedProductForDetails.stock_quantity} in stock
                          </span>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Status</label>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedProductForDetails.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {selectedProductForDetails.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        {selectedProductForDetails.is_featured && (
                          <div>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                              ⭐ Featured Product
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">Description</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedProductForDetails.description || "No description available"}
                      </p>
                    </div>

                    {/* Dynamic Details */}
                    {selectedProductForDetails.details && Object.keys(selectedProductForDetails.details).length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Additional Details</h3>
                        <div className="grid grid-cols-1 gap-3">
                          {Object.entries(selectedProductForDetails.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="font-medium text-gray-700 capitalize">
                                {key.replace(/_/g, ' ')}:
                              </span>
                              <span className="text-gray-900">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add to Cart Button */}
                    <div className="pt-4">
                      <Button
                        type="button"
                        onClick={() => {
                          if (cart.some(item => item.product.id === selectedProductForDetails.id)) {
                            setShowCart(true);
                            setShowDetailsModal(false);
                          } else {
                            addToCart(selectedProductForDetails);
                            setShowDetailsModal(false);
                          }
                        }}
                        disabled={selectedProductForDetails.stock_quantity === 0}
                        className={`w-full font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                          cart.some(item => item.product.id === selectedProductForDetails.id)
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white"
                        }`}
                      >
                        <FaShoppingCart className="mr-2" />
                        {selectedProductForDetails.stock_quantity === 0 
                          ? "Out of Stock" 
                          : cart.some(item => item.product.id === selectedProductForDetails.id)
                            ? "View Cart" 
                            : "Add to Cart"
                        }
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Information Modal */}
      <AnimatePresence>
        {showCustomerInfoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCustomerInfoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Customer Information</h2>
                  <button
                    type="button"
                    onClick={() => setShowCustomerInfoModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FaTimes className="text-gray-500" />
                  </button>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                                         {cart.map((item) => (
                       <div key={item.product.id} className="flex justify-between">
                         <span>{item.product.name} (x{item.quantity})</span>
                         <span>{formatMoneyToCedis(item.product.price * item.quantity)}</span>
                       </div>
                     ))}
                                         {discountData && (
                       <div className="border-t pt-2 mt-2">
                         <div className="flex justify-between text-green-600">
                           <span>Discount ({discountData.discount_percentage}%)</span>
                           <span>-{formatMoneyToCedis(Math.round(cart.reduce((total, item) => total + (item.product.price * item.quantity), 0) - getCartTotal()))}</span>
                         </div>
                       </div>
                     )}
                                         <div className="border-t pt-2 mt-2 font-semibold">
                       <div className="flex justify-between">
                         <span>Total:</span>
                         <span className="text-primary">{formatMoneyToCedis(getCartTotal())}</span>
                       </div>
                     </div>
                  </div>
                </div>

                {/* Customer Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                                          <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your full name"
                      />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                                          <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your email address"
                      />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                                          <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your phone number"
                      />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCustomerInfoModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={processPayment}
                    disabled={submittingPayment || !customerInfo.name || !customerInfo.email || !customerInfo.phone}
                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold py-3 rounded-lg transition-all duration-300"
                  >
                    {submittingPayment ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCreditCard className="mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Cart Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-40"
      >
        <FaShoppingCart className="text-2xl" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </motion.button>

      {/* Trust Indicators - Preschool focused */}
      <div className="bg-blue-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our School Supplies?</h2>
            <p className="text-lg text-gray-600">Quality materials that support your child&apos;s educational development</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FaShieldAlt className="text-2xl text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Safe & Quality Materials</h3>
              <p className="text-gray-600 text-sm">All products meet safety standards for children</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FaStar className="text-2xl text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Educational Excellence</h3>
              <p className="text-gray-600 text-sm">Carefully selected to enhance learning experiences</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <FaCreditCard className="text-2xl text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600 text-sm">Safe and secure payment processing</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Following the existing pattern */}
      <CTA />
    </div>
  );
};

export default Shop;
