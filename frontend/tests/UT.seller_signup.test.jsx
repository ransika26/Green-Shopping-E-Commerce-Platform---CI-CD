import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Seller_signup from "../src/Pages/seller/seller_signup/Seller_signup";

// Mock axios
vi.mock("axios");
global.alert = vi.fn();

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

const generateRandomString = () => Math.random().toString(36).substring(2, 10);
const generateRandomEmail = () => `${generateRandomString()}@example.com`;
const generateRandomPhone = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();

describe("Seller_signup Component", () => {
  it("should show validation error for missing fields", () => {
    renderWithRouter(<Seller_signup />);

    // Click the signup button without filling any fields
    fireEvent.click(screen.getByText(/signup/i));

    // Check validation error messages
    expect(screen.getByText(/company name is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/email is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/address is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/phone number is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/please select a geolocation\./i)).toBeInTheDocument();
    expect(screen.getByText(/description is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/password is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/please upload a company logo\./i)).toBeInTheDocument();
  });

  it("should show an error for invalid email format", () => {
    renderWithRouter(<Seller_signup />);

    // Fill the email field with an invalid email
    fireEvent.change(screen.getByPlaceholderText(/company email/i), {
      target: { value: "invalid-email" },
    });

    // Click the signup button
    fireEvent.click(screen.getByText(/signup/i));

    // Check validation error message
    expect(screen.getByText(/invalid email address\./i)).toBeInTheDocument();
  });

  it("should show an error if image is not uploaded", () => {
    renderWithRouter(<Seller_signup />);

    // Fill all required fields except the file input
    fireEvent.change(screen.getByPlaceholderText(/company name/i), {
      target: { value: generateRandomString() },
    });
    fireEvent.change(screen.getByPlaceholderText(/company email/i), {
      target: { value: generateRandomEmail() },
    });
    fireEvent.change(screen.getByPlaceholderText(/company address/i), {
      target: { value: generateRandomString() },
    });
    fireEvent.change(screen.getByPlaceholderText(/valid telephone number/i), {
      target: { value: generateRandomPhone() },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter a small description/i), {
      target: { value: generateRandomString() },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: generateRandomString() },
    });

    // Click the signup button without uploading a file
    fireEvent.click(screen.getByText(/signup/i));

    // Assert that the error message is displayed
    expect(screen.getByText(/please upload a company logo/i)).toBeInTheDocument();

    // Ensure axios.post was not called
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("should show an error if phone number is not provided", () => {
    renderWithRouter(<Seller_signup />);

    // Fill all required fields except the phone number
    fireEvent.change(screen.getByPlaceholderText(/company name/i), {
      target: { value: generateRandomString() },
    });
    fireEvent.change(screen.getByPlaceholderText(/company email/i), {
      target: { value: generateRandomEmail() },
    });
    fireEvent.change(screen.getByPlaceholderText(/company address/i), {
      target: { value: generateRandomString() },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter a small description/i), {
      target: { value: generateRandomString() },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: generateRandomString() },
    });

    // Click the signup button without entering the phone number
    fireEvent.click(screen.getByText(/signup/i));

    // Assert that the error message is displayed
    expect(screen.getByText(/phone number is required\./i)).toBeInTheDocument();

    // Ensure axios.post was not called
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("should show an error if password is not provided", () => {
    renderWithRouter(<Seller_signup />);

    // Fill all required fields except the password
    fireEvent.change(screen.getByPlaceholderText(/company name/i), {
      target: { value: generateRandomString() },
    });
    fireEvent.change(screen.getByPlaceholderText(/company email/i), {
      target: { value: generateRandomEmail() },
    });
    fireEvent.change(screen.getByPlaceholderText(/company address/i), {
      target: { value: generateRandomString() },
    });
    fireEvent.change(screen.getByPlaceholderText(/valid telephone number/i), {
      target: { value: generateRandomPhone() },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter a small description/i), {
      target: { value: generateRandomString() },
    });

    // Click the signup button without entering the password
    fireEvent.click(screen.getByText(/signup/i));

    // Assert that the error message is displayed
    expect(screen.getByText(/password is required\./i)).toBeInTheDocument();

    // Ensure axios.post was not called
    expect(axios.post).not.toHaveBeenCalled();
  });
});