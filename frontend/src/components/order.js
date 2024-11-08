// src/components/Orders.js
import React from "react";
import { useAppContext } from "../context/AppContext";

function Orders() {
    const { orders, addOrder, removeOrder } = useAppContext();

    const handleAddOrder = () => {
        const newOrder = { id: Date.now(), cardId: 1, quantity: 2 };
        addOrder(newOrder); // Example of adding a new order
    };

    const handleRemoveOrder = (orderId) => {
        removeOrder(orderId); // Remove order by id
    };

    return (
        <div>
            <h2>Your Orders</h2>
            <button onClick={handleAddOrder}>Add Order</button>
            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        Order #{order.id} - Card ID: {order.cardId} - Quantity: {order.quantity}
                        <button onClick={() => handleRemoveOrder(order.id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Orders;
