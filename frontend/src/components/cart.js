import React, { useState } from "react";

const Cart = () => {
    const [cart, setCart] = useState([]);

    const addToCart = (card) => {
        setCart([...cart, card]);
    };

    return (
        <div>
            <h1>Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <ul>
                    {cart.map((card, index) => (
                        <li key={index}>
                            {card.name} - ${card.price}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Cart;
