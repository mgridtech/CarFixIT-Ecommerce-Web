import React, { useState, useEffect } from "react";
import { getUserId } from "../utils/auth";
import { getMyOrders } from "../pages/Services/Services";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            const userId = getUserId();
            if (!userId) {
                setError("User ID not found. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                const result = await getMyOrders(userId);

                if (result.success) {
                    // Assuming the API returns an array of orders in result.data or result.data.data
                    const ordersData = result.data.data || result.data || [];
                    setOrders(ordersData);
                } else {
                    setError(result.error || "Failed to fetch orders.");
                }
            } catch (err) {
                setError("An unexpected error occurred while fetching orders.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Function to determine status color
    const getStatusColor = (status) => {
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
            default:
                return 'text-gray-600 bg-gray-100';
        }
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
                <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow">
                    <p className="font-medium">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <section className="w-full py-12 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-6">
                <h1 className="text-3xl font-bold text-[#8B1E51] mb-6 flex items-center" style={{marginTop:22}}>
                    <ShoppingBag className="mr-2" size={28} style={{marginTop:22}} />
                    My Orders
                </h1>

                {orders.length === 0 ? (
                    <div className="bg-white shadow-md rounded-lg p-8 text-center">
                        <ShoppingBag className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-lg text-gray-600">You haven't placed any orders yet.</p>
                        <button className="mt-4 px-6 py-2 bg-[#8B1E51] text-white font-medium rounded-md hover:bg-[#6e1641] transition-colors">
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {orders.map((order) => (
                            <div
                                key={order.id || order._id}
                                className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow border border-gray-100 cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-lg text-gray-800">
                                        Order Id: {order.orderId || order.id || order._id || "N/A"}
                                    </h3>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                                        {order.status || "Processing"}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm">Amount:</span>
                                        <span className="font-medium">₹{order.orderValue || order.amount || "0.00"}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm">Date:</span>
                                        <span className="text-gray-800">{formatDate(order.date || order.createdAt || new Date())}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/order-details/${order.orderId || order.id || order._id}`)}
                                    className="w-full mt-4 px-4 py-2 bg-gray-100 text-[#8B1E51] text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default MyOrders;