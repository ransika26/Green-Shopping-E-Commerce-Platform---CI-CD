// Import necessary libraries
import { faker } from "@faker-js/faker";
import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import Signup from "../src/Pages/signup/Signup";

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
beforeAll(() => {
  global.alert = vi.fn();
});

afterAll(() => {
  delete global.alert;
});

describe("Signup Component", () => {
  const generateRandomUserData = () => ({
    username: faker.internet.username(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    phoneNumber: faker.phone.number("##########"), // Generate a 10-digit phone number
    password: faker.internet.password(),
  });

  it("should show validation errors for missing inputs", async () => {
    // Arrange
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Act
    const signupButton = screen.getByText("Signup");
    fireEvent.click(signupButton);

    // Assert
    expect(screen.getByText("Username is required.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
  });

  it("should call API with valid inputs", async () => {
    // Arrange
    const mockResponse = { data: { success: true, token: "mockToken", customerId: "123" } };
    axios.post.mockResolvedValueOnce(mockResponse);

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText("User name");
    const emailInput = screen.getByPlaceholderText("User email");
    const addressInput = screen.getByPlaceholderText("User address");
    const phoneInput = screen.getByPlaceholderText("Valid telephone number");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signupButton = screen.getByText("Signup");

    // Act
    fireEvent.change(usernameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(addressInput, { target: { value: "123 Test St" } });
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(signupButton);

    // Assert
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3000/api/customerauthentication/customersignup",
      {
        CustomerName: "John Doe",
        CustomerEmail: "john@example.com",
        CustomerAddress: "123 Test St",
        CustomerPhoneNumber: "1234567890",
        CustomerPassword: "password123",
      }
    );
  });

  it("should show validation error for missing password", async () => {
    // Arrange
    const userData = generateRandomUserData();

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText("User name");
    const emailInput = screen.getByPlaceholderText("User email");
    const addressInput = screen.getByPlaceholderText("User address");
    const phoneInput = screen.getByPlaceholderText("Valid telephone number");
    const signupButton = screen.getByText("Signup");

    // Act
    fireEvent.change(usernameInput, { target: { value: userData.username } });
    fireEvent.change(emailInput, { target: { value: userData.email } });
    fireEvent.change(addressInput, { target: { value: userData.address } });
    fireEvent.change(phoneInput, { target: { value: userData.phoneNumber } });

    fireEvent.click(signupButton);

    // Assert
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
  });
});
