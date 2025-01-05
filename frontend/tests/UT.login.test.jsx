import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Login from "../src/Pages/login/Login";

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

// Mock `window.alert`
global.alert = vi.fn();

describe("Login Component", () => {
  it("should show validation errors for missing inputs", async () => {
    // Arrange
    render(
      <MemoryRouter>
        <Login />
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
    const mockResponse = { data: { success: true, token: "mockToken", customerId: "123" } };
    axios.post.mockResolvedValueOnce(mockResponse);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("User email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("Login");

    // Act
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    // Assert
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3000/api/customerauthentication/customerlogin",
      {
        CustomerEmail: "john@example.com",
        CustomerPassword: "password123",
      }
    );
  });

  it("should show validation error for missing email", async () => {
    // Arrange
    render(
      <MemoryRouter>
        <Login />
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
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("User email");
    const loginButton = screen.getByText("Login");

    // Act
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.click(loginButton);

    // Assert
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
  });
});
