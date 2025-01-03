import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import axios from "axios";
import { io } from "socket.io-client";
import "./product_details.css";
import { Questionsm } from "../../Components/Modules/product_details_questions/Product_details_questions";

const Product_details = () => {
  const [quantity, setQuantity] = useState(1);
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };
  const handleIncrement = () => {
    if (quantity < 50) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  };
  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 50) {
      setQuantity(value);
    } else if (value < 1) {
      setQuantity(1);
    } else if (value > 50) {
      setQuantity(50);
    }
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleButtonClick = (value) => {
    setModalOpen(false);
    setMessage(value);
  };
  const location = useLocation();
  const { productId } = location.state || {};
  const [product, setProduct] = useState(null);
  // Fetch product details
  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/productsdetailsdisplay/${productId}`
      );
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    const customerId = localStorage.getItem("customerId");

    if (!token) {
      alert("Please login to add items to the cart.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/pendingcart/pendingcartadd",
        {
          CustomerID: customerId,
          ProductID: productId,
          Quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const handleAddToWishList = async () => {
    const token = localStorage.getItem("token");
    const customerId = localStorage.getItem("customerId");

    if (!token) {
      alert("Please login to add items to wish list.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/wishlist/wishlistadd",
        {
          CustomerID: customerId,
          ProductID: productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Item added to wish list successfully!");
    } catch (error) {
      console.error("Error adding item to  wish list:", error);
      alert("Failed to add item to  wish list. Please try again.");
    }
  };

  // Fetch initial questions
  const [Questions, setQuestions] = useState([]);
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/productsshowquestions/${productId}`
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io("http://localhost:3000");

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    newSocket.on("new-question", (data) => {
      if (data?.productId === productId) {
        setQuestions((prevQuestions) => [data.question, ...prevQuestions]);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    setSocket(newSocket);

    return () => {
      newSocket.removeAllListeners();
      newSocket.close();
    };
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
      fetchQuestions();
    }
  }, [productId]);

  const [visibleQuestions, setVisibleQuestions] = useState(3);
  const showMoreQuestions = () => {
    setVisibleQuestions((prev) => prev + 3);
  };

  return (
    <div>
      {product ? (
        <section className="product-details-con">
          <div className="product-details-image-con">
            <img
              className="product-details-image"
              src={`http://localhost:3000/uploads/${product.ImageFile}`}
              alt={product.ProductName || "Product Image"}
            />
          </div>
          <div className="product-details-details">
            <h3 className="text-hili">{product.ProductName}</h3>
            <h4>{product.ShortDescription}</h4>
            <p className="product-details-top">{product.LongDescription}</p>
            <h4 className="product-details-top text-hili">
              ${product.Price - (product.Price * product.Discount) / 100}
            </h4>
            <h5 className="product-details-discount">${product.Price}</h5>
            <div className="product-details-stepper">
              <button
                className="product-details-stepper-button button-left"
                onClick={handleDecrement}
              >
                -
              </button>
              <input
                className="product-details-stepper-input"
                type="number"
                value={quantity}
                onChange={handleInputChange}
                min="1"
                max="50"
              />
              <button
                className="product-details-stepper-button button-right"
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
            <div className="product-details-button">
              <button
                className="product-details-wish-button"
                onClick={handleAddToWishList}
              >
                <img
                  className="product-details-wish-img"
                  src="wish-list.png"
                  alt="Add to Wishlist"
                />
              </button>
              <button
                className="product-details-cart-button"
                onClick={handleAddToCart}
              >
                Add to cart
              </button>
            </div>
          </div>
        </section>
      ) : (
        <p>Loading product details...</p>
      )}
      {/* Chat Section */}
      <section className="product-chat-con">
        {/* repeat*/}
        {Questions.length > 0 &&
          Questions.slice(0, visibleQuestions).map((question) => (
            <div key={question._id || index} className="product-chat">
              <p className="product-chat-lable-customer text-hili">
                <img
                  className="product-chat-image"
                  src="user-logo.png"
                  alt=""
                />
                {question.Question}
              </p>
              <p className="product-chat-lable-seller">
                {question.Answer}
                <img
                  className="product-chat-image"
                  src={
                    question.ProductID &&
                    question.ProductID.SellerID &&
                    question.ProductID.SellerID.LogoImageFile
                      ? `http://localhost:3000/uploads/${question.ProductID.SellerID.LogoImageFile}`
                      : "default-logo.png"
                  }
                  alt={
                    question.ProductID.SellerID.LogoImageFile || "Logo Image"
                  }
                />
              </p>
            </div>
          ))}
        {/* repeat*/}
        {visibleQuestions < Questions.length && (
          <button
            className="product-chat-show-more-button"
            onClick={showMoreQuestions}
          >
            Show more
          </button>
        )}
        <button
          className="product-chat-input"
          onClick={() => setModalOpen(true)}
        >
          Ask questions
        </button>
        {modalOpen &&
          createPortal(
            <Questionsm
              closeModal={handleButtonClick}
              onSubmit={handleButtonClick}
              onCancel={handleButtonClick}
              productId={productId}
            ></Questionsm>,
            document.body
          )}
      </section>
    </div>
  );
};

export default Product_details;
