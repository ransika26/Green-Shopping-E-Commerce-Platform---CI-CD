import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Contact from "../src/Pages/contact/Contact";

vi.mock("axios");

describe("Contact Component", () => {
  beforeEach(() => {
    global.alert = vi.fn(); // Reset the alert mock
  });

  it("renders the contact form correctly", () => {
    render(<Contact />);

    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Message...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("validates the form inputs before submission", async () => {
    render(<Contact />);

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(screen.getByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Message cannot be empty.")).toBeInTheDocument();
  });

  it("shows an error for invalid email format", () => {
    render(<Contact />);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(screen.getByText("Invalid email address.")).toBeInTheDocument();
  });

 
});
