import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Admin_login from "../src/Pages/Admin/Admin_Login";

// Mock axios
vi.mock("axios");

describe("Admin_Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  it("renders the login form correctly", () => {
    render(
      <MemoryRouter>
        <Admin_login />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Admin email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("validates input fields and shows error messages", async () => {
    render(
      <MemoryRouter>
        <Admin_login />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
    expect(await screen.findByText("Password is required.")).toBeInTheDocument();
  });

  it("shows an error for invalid email format", async () => {
    render(
      <MemoryRouter>
        <Admin_login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("Admin email");
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    fireEvent.click(loginButton);

    expect(await screen.findByText("Invalid email address.")).toBeInTheDocument();
  });

  
  it("displays an API error message on login failure", async () => {
    const mockError = {
      response: {
        data: {
          message: "Invalid credentials",
        },
      },
    };

    axios.post.mockRejectedValue(mockError);

    render(
      <MemoryRouter>
        <Admin_login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("Admin email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "admin@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(loginButton);

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });
});
