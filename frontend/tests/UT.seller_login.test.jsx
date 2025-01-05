import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Seller_login from "../src/Pages/seller/seller_login/Seller_login";

// Mock `axios` for API call handling
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock `react-router-dom` partially
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()), // Mock `useNavigate` only
  };
});
// Mocking window.alert
global.alert = vi.fn();


describe("Seller_login Component", () => {
  it("should show validation errors for missing inputs", async () => {
    // Arrange
    render(
      <MemoryRouter>
        <Seller_login />
      </MemoryRouter>
    );

    // Act
    const loginButton = screen.getByText("Login");
    fireEvent.click(loginButton);

    // Assert
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
  });

  it("should call API with valid inputs", async () => {
    // Arrange
    const mockResponse = { data: { success: true, token: "mockToken", sellerId: "123" } };
    axios.post.mockResolvedValueOnce(mockResponse);

    render(
      <MemoryRouter>
        <Seller_login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("Company email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("Login");

    // Act
    fireEvent.change(emailInput, { target: { value: "seller@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    // Assert
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3000/api/sellerauthentication/sellerlogin",
      {
        SellerEmail: "seller@example.com",
        SellerPassword: "password123",
      }
    );
  });

  it("should show validation error for missing email", async () => {
    // Arrange
    render(
      <MemoryRouter>
        <Seller_login />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("Login");

    // Act
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    // Assert
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
  });

  it("should show validation error for missing password", async () => {
    // Arrange
    render(
      <MemoryRouter>
        <Seller_login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("Company email");
    const loginButton = screen.getByText("Login");

    // Act
    fireEvent.change(emailInput, { target: { value: "seller@example.com" } });
    fireEvent.click(loginButton);

    // Assert
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
  });

  it("should show error for invalid email format", async () => {
    // Arrange
    render(
      <MemoryRouter>
        <Seller_login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("Company email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("Login");

    // Act
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    // Assert
    expect(screen.getByText("Invalid email address.")).toBeInTheDocument();
  });

  it("should show error for password less than 6 characters", async () => {
    // Arrange
    render(
      <MemoryRouter>
        <Seller_login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("Company email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("Login");

    // Act
    fireEvent.change(emailInput, { target: { value: "seller@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.click(loginButton);

    // Assert
    expect(screen.getByText("Password must be at least 6 characters.")).toBeInTheDocument();
  });
});
