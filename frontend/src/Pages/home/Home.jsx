import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "../../Components/category/category.css";
import "../../Components/category/category_page/category_page.css";
import "./home.css";

const categories = [
  "Clothes",
  "Shoes",
  "Watches",
  "Perfume",
  "Hats",
  "Wallets",
  "Hand Bags",
  "Cargo Bags",
  "Slippers",
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  // Fetch products from back-end
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/productsdisplay${
            selectedCategory ? `?category=${selectedCategory}` : ""
          }`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5.3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const handleCardClick = (productId) => {
    navigate(`/Product_details`, { state: { productId } });
  };

  return (
    <div>
      {/* Img section 1 */}
      <section className="section-image home-bg1">
        <div className="section-image-left">
          <div>
            <h4 className="text-hili">the best shopping experience </h4>
            <h1>BLACK FRIDAY SALE</h1>
            <p>ELEVATE YOUR EVERYDAY WITH ESSENTIAL MATTERS!</p>
            <button className="section-image-button">Shop Now</button>
          </div>
        </div>
        <div className="section-image-right">
          <img
            className="section-image-img"
            src="section1-right-img.png"
            alt=""
          />
        </div>
      </section>

      {/* Category Slider Section */}
      <Slider {...sliderSettings}>
        {categories.map((category, idx) => (
          <div
            className={`category-slider ${
              selectedCategory === category ? "active" : ""
            }`}
            key={`category-${idx}`}
            onClick={() =>
              setSelectedCategory(
                category === selectedCategory ? null : category
              )
            }
          >
            <div className="category-slider-item">
              <img
                className="category-slider-item-img"
                src={`${category.toLowerCase()}.jpg`}
                alt={category}
              />
              <div className="category-slider-item-dis">
                <h4>{category}</h4>
                <p className="p">See more</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Product Card Section */}
      <div className="grid-container">
        {products.map((product) => (
          <article
            className={`card ${product.Advertise === "Hot" ? "hot" : ""} ${
              product.Advertise === "Offers" ? "offers" : ""
            }`}
            key={product._id}
            onClick={() => handleCardClick(product._id)}
          >
            <div className="card-brand">
              <div>
                {product.SellerID && product.SellerID.LogoImageFile ? (
                  <img
                    src={`http://localhost:3000/uploads/${product.SellerID.LogoImageFile}`}
                    alt={product.brand}
                  />
                ) : null}
              </div>
              <div className="name">
                {product.SellerID && product.SellerID.SellerName ? (
                  <h4>{product.SellerID.SellerName}</h4>
                ) : null}
              </div>
            </div>
            <div className="card-image">
              <img
                src={`http://localhost:3000/uploads/${product.ImageFile}`}
                alt={product.ProductName}
              />
            </div>
            <div className="card-info">
              <div className="name">
                <h4>{product.ProductName}</h4>
              </div>
              <p>{product.ShortDescription}</p>
            </div>
            <div className="card-more">
              <div className="card-options">
                <label htmlFor="">Price - </label>
                <label htmlFor="">
                  ${product.Price - (product.Price * product.Discount) / 100}
                </label>
              </div>
              <div className="buttons">
                <button className="card-wish-button">
                  <img
                    className="card-wish-img"
                    src="wish-list.png"
                    alt="wishlist"
                  />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Img section 2 */}
      <section className="section-image home-bg2">
        <div className="section-image-left">
          <div>
            <h4 className="text-hili">the best shopping experience </h4>
            <h1>BLACK FRIDAY SALE</h1>
            <p>ELEVATE YOUR EVERYDAY WITH ESSENTIAL MATTERS!</p>
            <button className="section-image-button">Shop Now</button>
          </div>
        </div>
        <div className="section-image-right">
          <img
            className="section-image-img"
            src="section1-right-img.png"
            alt=""
          />
        </div>
      </section>

      {/* Dit section */}
      <section className="section2">
        <div className="section2-card">
          <img
            className="section2-img"
            src="section2-main-bg.jpeg"
            alt="Artistic Design"
          />
          <div className="section2-dis">
            <h4 className="section2-dis-head text-hili">
              The Essence of Sustainable Living
            </h4>
            <p className="section2-dis-text">
              In today’s world, embracing sustainability isn’t just a choice;
              it’s a responsibility. Our platform celebrates the harmony between
              art, functionality, and eco-consciousness by offering a curated
              selection of products designed with care for both aesthetics and
              the planet.
            </p>
            <p className="section2-dis-text">
              Every product featured here tells a story—a story of thoughtful
              craftsmanship, minimal environmental impact, and a dedication to
              creating a better future. By choosing our platform, you become
              part of a movement that values innovation and sustainability.
            </p>
            <ul className="section2-dis-li">
              <li>Eco-friendly materials and packaging</li>
              <li>Supporting local and sustainable businesses</li>
              <li>Minimalist designs for modern lifestyles</li>
              <li>Commitment to reducing carbon footprints</li>
              <li>Promoting ethical consumerism</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;