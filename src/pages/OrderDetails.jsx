import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserId } from "../utils/auth";
import { getOrderDetails, cancelOrder } from "../pages/Services/Services";
import { ShoppingBag, ArrowLeft, Calendar, Clock, Car, MapPin, CreditCard, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // Validate id exists and is not empty
                if (!id || id.trim() === "") {
                    throw new Error("Invalid Order ID");
                }

                console.log("Fetching order details for ID:", id);

                const result = await getOrderDetails(id);
                console.log("API response:", result);

                if (result && result.success) {
                    // Handle different response structures
                    const detailsData = result.data?.data || result.data;
                    if (!detailsData) {
                        throw new Error("Order data not found in response");
                    }
                    setOrderDetails(detailsData);
                } else {
                    throw new Error(result?.error || "Failed to fetch order details");
                }
            } catch (err) {
                console.error("Order details fetch error:", err);
                setError(err.message || "An unexpected error occurred while fetching order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id]);

    const handleCancelClick = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleCancel = async () => {
        try {
            setCancelling(true);

            // Get user ID from auth utility
            const userId = getUserId();

            if (!userId) {
                throw new Error("User ID not found. Please log in again.");
            }

            const result = await cancelOrder(userId, id);

            if (result.success) {
                // Update the order details with cancelled status
                setOrderDetails({
                    ...orderDetails,
                    orderStatus: "Cancelled"
                });

                // Show success message
                toast.success("Order Cancelled successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } else {
                throw new Error(result.error || "Failed to cancel order");
            }
        } catch (err) {
            console.error("Cancel order error:", err);
            toast.error(`An error occurred while cancelling the order: ${err.message}`, {
                      position: "top-right",
                      autoClose: 3000,
                    });
        } finally {
            setCancelling(false);
            setShowModal(false);
        }
    };

    // Function to format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch (e) {
            console.error("Date formatting error:", e);
            return "Invalid date";
        }
    };

    // Function to determine status color
    const getStatusColor = (status) => {
        if (!status) return 'text-gray-600 bg-gray-100';

        switch (status.toLowerCase()) {
            case 'delivered':
                return 'text-green-600 bg-green-100';
            case 'shipped':
                return 'text-blue-600 bg-blue-100';
            case 'processing':
                return 'text-yellow-600 bg-yellow-100';
            case 'canceled':
                return 'text-red-600 bg-red-100';
            case 'pending':
                return 'text-orange-600 bg-orange-100';
            case 'paid':
                return 'text-green-600 bg-green-100';
            case 'unpaid':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    // Confirmation Modal
    const ConfirmationModal = () => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Cancel Order</h3>
                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="mb-6">
                        <p className="text-gray-700">Are you sure you want to cancel this order? This action cannot be undone.</p>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors"
                        >
                            No, Keep Order
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={cancelling}
                            className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors disabled:bg-red-400"
                        >
                            {cancelling ? "Cancelling..." : "Yes, Cancel Order"}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-28 w-28 border-t-2 border-b-2 border-[#8B1E51]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow max-w-md text-center">
                    <p className="font-medium mb-2">Error loading order details</p>
                    <p className="text-sm mb-4">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-[#8B1E51] hover:underline"
                    >
                        <ArrowLeft className="inline mr-1" size={16} />
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    if (!orderDetails) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg shadow max-w-md text-center">
                    <p className="font-medium">No order details found</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-[#8B1E51] hover:underline mt-2"
                    >
                        <ArrowLeft className="inline mr-1" size={16} />
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <section className="w-full py-12 bg-gray-50 min-h-screen">

            {showModal && <ConfirmationModal />}

            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <ToastContainer />
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-[#8B1E51] mb-6 hover:underline"
                >
                    <ArrowLeft className="mr-2" size={16} />
                    Back to Orders
                </button>

                <h1 className="text-3xl font-bold text-[#8B1E51] mb-6 flex items-center">
                    <ShoppingBag className="mr-2" size={28} />
                    Order Details
                </h1>

                <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 mb-6 border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-6 pb-4 border-b border-gray-100">
                        <div className="mb-4 sm:mb-0">
                            <h2 className="text-xl font-bold text-gray-800">Order ID: {id}</h2>
                            <p className="text-gray-600 mt-1">
                                {formatDate(orderDetails.orderDate || orderDetails.createdAt)}
                            </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(orderDetails.orderStatus)}`}>
                            {orderDetails.orderStatus || "Processing"}
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-3">Customer Information</h3>
                            <div className="space-y-2">
                                <p className="text-gray-800"><span className="font-medium">Name:</span> {orderDetails.userDetails?.name || "N/A"}</p>
                                <p className="text-gray-800"><span className="font-medium">Phone:</span> {orderDetails.userDetails?.phone || "N/A"}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-700 mb-3">Delivery Address</h3>
                            <div className="flex items-start">
                                <MapPin className="text-[#8B1E51] mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <p className="text-gray-800">{orderDetails.userAddress || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-3">Appointment Details</h3>
                            <div className="space-y-2">
                                <p className="flex items-center text-gray-800">
                                    <Calendar className="text-[#8B1E51] mr-2" size={16} />
                                    <span className="font-medium mr-2">Date:</span> {formatDate(orderDetails.appointmentDate)}
                                </p>
                                <p className="flex items-center text-gray-800">
                                    <Clock className="text-[#8B1E51] mr-2" size={16} />
                                    <span className="font-medium mr-2">Time:</span> {orderDetails.appointmentTime || "N/A"}
                                </p>
                                <p className="flex items-center text-gray-800">
                                    <Car className="text-[#8B1E51] mr-2" size={16} />
                                    <span className="font-medium mr-2">Delivery Type:</span> {orderDetails.deliveryType || "Standard"}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-700 mb-3">Payment Information</h3>
                            <div className="space-y-2">
                                <p className="flex items-center text-gray-800">
                                    <CreditCard className="text-[#8B1E51] mr-2" size={16} />
                                    <span className="font-medium mr-2">Method:</span> {orderDetails.paymentMethod || "N/A"}
                                </p>
                                <p className="flex items-center">
                                    <span className="font-medium mr-2">Status:</span>
                                    <span className={`px-2 py-0.5 rounded-full text-sm font-medium ${getStatusColor(orderDetails.paymentStatus)}`}>
                                        {orderDetails.paymentStatus || "Pending"}
                                    </span>
                                </p>
                                <p className="text-gray-800">
                                    <span className="font-medium">Total Value:</span>
                                    <span className="text-lg font-bold ml-2">₹{orderDetails.totalValue || orderDetails.orderValue || "0.00"}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {orderDetails.carDetails && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-700 mb-3">Car Information</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-800">{orderDetails.carDetails}</p>
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-3">Order Items</h3>
                        {orderDetails.orderItems?.length > 0 ? (
                            <div className="space-y-3">
                                {orderDetails.orderItems.map((item, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg flex flex-col sm:flex-row justify-between">
                                        <div className="mb-3 sm:mb-0 sm:w-1/2">
                                            <p className="font-medium">{item.productName || `Item #${index + 1}`}</p>
                                            {item.description && (
                                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600">Qty</p>
                                                <p className="font-medium">{item.quantity || 1}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Price</p>
                                                <p className="font-medium">₹{item.price || "0.00"}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Total</p>
                                                <p className="font-medium">₹{(item.price * item.quantity)?.toFixed(2) || "0.00"}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Status</p>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                                    {item.status || "Processing"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 italic">No items found for this order</p>
                        )}
                    </div>

                    {/* Only show Cancel button if status is not Cancelled or Delivered */}
                    {orderDetails.orderStatus !== "canceled" &&
                        orderDetails.orderStatus !== "Delivered" && (
                            <div className="flex justify-center">
                                <button
                                    onClick={handleCancelClick}
                                    disabled={cancelling}
                                    className="px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors disabled:bg-red-400"
                                >
                                    {cancelling ? "Cancelling..." : "Cancel Order"}
                                </button>
                            </div>
                        )}
                </div>
            </div>
        </section>
    );
};

export default OrderDetails;