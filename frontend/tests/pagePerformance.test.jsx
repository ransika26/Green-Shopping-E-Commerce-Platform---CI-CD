import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import { describe, expect, it } from 'vitest';
import Admin from '../src/Pages/Admin/Admin'; // Adjust the path
import Account from '../src/Pages/account/Account'; // Adjust the path
import Cart from '../src/Pages/cart/Cart'; // Adjust the path
import Contact from '../src/Pages/contact/Contact'; // Adjust the path
import Home from '../src/Pages/home/Home'; // Adjust the path
import Login from '../src/Pages/login/Login'; // Adjust the path
import Men from '../src/Pages/men/Men'; // Adjust the path
import Offers from '../src/Pages/offers/Offers'; // Adjust the path
import Product_details from '../src/Pages/product_details/Product_details'; // Adjust the path
import Signup from '../src/Pages/signup/Signup'; // Adjust the path
import Wish_list from '../src/Pages/wish_list/Wish_list'; // Adjust the path
import Women from '../src/Pages/women/Women'; // Adjust the path

describe('Frontend Page Load Performance Tests', () => {
  it('should measure render time for Home Page', () => {
    const start = performance.now();
    // Wrap Home component in MemoryRouter
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const end = performance.now();

    console.log(`Home Render Time: ${end - start}ms`);
    expect(end - start).toBeLessThan(300); // Set threshold
  });

  it('should measure render time for Product Details Page', () => {
    const start = performance.now();
    render(
      <MemoryRouter>
        <Product_details />
      </MemoryRouter>
    );
    const end = performance.now();

    console.log(`Product_details Render Time: ${end - start}ms`);
    expect(end - start).toBeLessThan(300);
  });

  it('should measure render time for Admin Account Page', () => {
    const start = performance.now();
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );
    const end = performance.now();

    console.log(`Admin Render Time: ${end - start}ms`);
    expect(end - start).toBeLessThan(400);
  });

  it('should measure render time for Customer Account Page', () => {
    const start = performance.now();
    render(
      <MemoryRouter>
        <Account />
      </MemoryRouter>
    );
    const end = performance.now();

    console.log(`Customer_Account Render Time: ${end - start}ms`);
    expect(end - start).toBeLessThan(400);
  });

  it('should measure render time for Contact Page', () => {
    const start = performance.now();
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    );
    const end = performance.now();

    console.log(`Contact_Page Render Time: ${end - start}ms`);
    expect(end - start).toBeLessThan(400);
  });

  it('should measure render time for Cart Page', () => {
    const start = performance.now();
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );
    const end = performance.now();

    console.log(`Cart_Page Render Time: ${end - start}ms`);
    expect(end - start).toBeLessThan(400);
  });

  it('should measure render time for Customer Signup Page', () => {
    const start = performance.now();
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    const end = performance.now();

    console.log(`Customer_Signup_Page Render Time: ${end - start}ms`);
    expect(end - start).toBeLessThan(400);
  });

  it('should measure render time for Customer Login Page', () => {
    const start = performance.now();
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const end = performance.now();

    console.log(`Customer_Login_Page Render Time: ${end - start}ms`);
    expect(end - start).toBeLessThan(400);
  });

  it('should measure render time for Men Page', () => {
    const start = performance.now();
    render(
      <MemoryRouter>
        <Men />
      </MemoryRouter>
    );
    const end = performance.now();

    console.log(`Men_Page Render Time: ${end - start}ms`);
    expect(end - start).toBeLessThan(400);
  });

  it('should measure render time for Offers Page', () => {
    const start = performance.now();
    render(
      <MemoryRouter>
        <Offers />
      </MemoryRouter>
    );
    const end = performance.now();

    console.log(`Offers_Page Render Time: ${end - start}ms`);
    expect(end - start).toBeLessThan(400);
  });

  it('should measure render time for Women Page', () => {
    const start = performance.now();
    render(
      <MemoryRouter>
        <Women />
      </MemoryRouter>
    );
    const end = performance.now();

    console.log(`Women_Page Render Time: ${end - start}ms`);
    expect(end - start).toBeLessThan(400);
  });

  it('should measure render time for Wish_List Page', () => {
    const start = performance.now();
    render(
      <MemoryRouter>
        <Wish_list />
      </MemoryRouter>
    );
    const end = performance.now();

    console.log(`Wish_List Render Time: ${end - start}ms`);
    expect(end - start).toBeLessThan(400);
  });
});
