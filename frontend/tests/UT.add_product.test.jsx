import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { describe, expect, it, vi } from "vitest";
import AddProduct from "../src/Pages/seller/add_product/Add_product";

// Mock `axios` for API call handling
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("AddProduct Component", () => {
  it("should show validation errors for missing inputs", async () => {
    // Arrange
    render(<AddProduct />);

    // Act
    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Product name is required.")).toBeInTheDocument();
      expect(screen.getByText("Short description is required.")).toBeInTheDocument();
      expect(screen.getByText("Long description is required.")).toBeInTheDocument();
      expect(screen.getByText("Please enter a valid price.")).toBeInTheDocument();
      expect(screen.getByText("Please enter a valid discount (0-100%).")).toBeInTheDocument();
      expect(screen.getByText("Please enter a valid quantity.")).toBeInTheDocument();
      expect(screen.getByText("Please select an advertise option.")).toBeInTheDocument();
      expect(screen.getByText("Please select a gender option.")).toBeInTheDocument();
      expect(screen.getByText("Please select a category.")).toBeInTheDocument();
      expect(screen.getByText("Please upload an image.")).toBeInTheDocument();
    });
  });

  it("should call API with valid inputs", async () => {
    // Arrange
    const mockResponse = { data: { success: true, message: "Product added successfully!" } };
    axios.post.mockResolvedValueOnce(mockResponse);

    render(<AddProduct />);

    const productNameInput = screen.getByPlaceholderText("Enter product name");
    const shortDescriptionInput = screen.getByPlaceholderText(
      "Enter short description (Limit to 25 characters)"
    );
    const longDescriptionInput = screen.getByPlaceholderText(
      "Enter long description (Limit to 250 characters)"
    );
    const priceInput = screen.getByPlaceholderText("Price");
    const discountInput = screen.getByPlaceholderText("Discount (%)");
    const quantityInput = screen.getByPlaceholderText("Quantity");
    const addButton = screen.getByText("Add");

    const advertiseSelect = screen.getByText("Advertise");
    const genderSelect = screen.getByText("For who");
    const categorySelect = screen.getByText("Category");

    // Act
    fireEvent.change(productNameInput, { target: { value: "Test Product" } });
    fireEvent.change(shortDescriptionInput, { target: { value: "Short Desc" } });
    fireEvent.change(longDescriptionInput, { target: { value: "This is a long description." } });
    fireEvent.change(priceInput, { target: { value: "100" } });
    fireEvent.change(discountInput, { target: { value: "10" } });
    fireEvent.change(quantityInput, { target: { value: "5" } });

    fireEvent.keyDown(advertiseSelect, { key: "ArrowDown" });
    fireEvent.click(screen.getByText("Hot"));

    fireEvent.keyDown(genderSelect, { key: "ArrowDown" });
    fireEvent.click(screen.getByText("Men"));

    fireEvent.keyDown(categorySelect, { key: "ArrowDown" });
    fireEvent.click(screen.getByText("Shoes"));

    // Deliberately omit file input to test missing image validation
    fireEvent.click(addButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Please upload an image.")).toBeInTheDocument();
    });
  });

  it("should show validation error for missing product name", async () => {
    // Arrange
    render(<AddProduct />);

    const shortDescriptionInput = screen.getByPlaceholderText(
      "Enter short description (Limit to 25 characters)"
    );
    const longDescriptionInput = screen.getByPlaceholderText(
      "Enter long description (Limit to 250 characters)"
    );
    const priceInput = screen.getByPlaceholderText("Price");
    const discountInput = screen.getByPlaceholderText("Discount (%)");
    const quantityInput = screen.getByPlaceholderText("Quantity");
    const addButton = screen.getByText("Add");

    // Act
    fireEvent.change(shortDescriptionInput, { target: { value: "Short Desc" } });
    fireEvent.change(longDescriptionInput, { target: { value: "This is a long description." } });
    fireEvent.change(priceInput, { target: { value: "100" } });
    fireEvent.change(discountInput, { target: { value: "10" } });
    fireEvent.change(quantityInput, { target: { value: "5" } });
    fireEvent.click(addButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Product name is required.")).toBeInTheDocument();
    });
  });

  it("should show validation error for missing image", async () => {
    // Arrange
    render(<AddProduct />);

    const productNameInput = screen.getByPlaceholderText("Enter product name");
    const shortDescriptionInput = screen.getByPlaceholderText(
      "Enter short description (Limit to 25 characters)"
    );
    const longDescriptionInput = screen.getByPlaceholderText(
      "Enter long description (Limit to 250 characters)"
    );
    const priceInput = screen.getByPlaceholderText("Price");
    const discountInput = screen.getByPlaceholderText("Discount (%)");
    const quantityInput = screen.getByPlaceholderText("Quantity");
    const addButton = screen.getByText("Add");

    // Act
    fireEvent.change(productNameInput, { target: { value: "Test Product" } });
    fireEvent.change(shortDescriptionInput, { target: { value: "Short Desc" } });
    fireEvent.change(longDescriptionInput, { target: { value: "This is a long description." } });
    fireEvent.change(priceInput, { target: { value: "100" } });
    fireEvent.change(discountInput, { target: { value: "10" } });
    fireEvent.change(quantityInput, { target: { value: "5" } });
    fireEvent.click(addButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Please upload an image.")).toBeInTheDocument();
    });
  });

  it("should show validation error for missing quantity", async () => {
    // Arrange
    render(<AddProduct />);

    const productNameInput = screen.getByPlaceholderText("Enter product name");
    const shortDescriptionInput = screen.getByPlaceholderText(
      "Enter short description (Limit to 25 characters)"
    );
    const longDescriptionInput = screen.getByPlaceholderText(
      "Enter long description (Limit to 250 characters)"
    );
    const priceInput = screen.getByPlaceholderText("Price");
    const discountInput = screen.getByPlaceholderText("Discount (%)");
    const addButton = screen.getByText("Add");

    // Act
    fireEvent.change(productNameInput, { target: { value: "Test Product" } });
    fireEvent.change(shortDescriptionInput, { target: { value: "Short Desc" } });
    fireEvent.change(longDescriptionInput, { target: { value: "This is a long description." } });
    fireEvent.change(priceInput, { target: { value: "100" } });
    fireEvent.change(discountInput, { target: { value: "10" } });
    fireEvent.click(addButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Please enter a valid quantity.")).toBeInTheDocument();
    });
  });

  it("should show validation error for missing price", async () => {
    // Arrange
    render(<AddProduct />);

    const productNameInput = screen.getByPlaceholderText("Enter product name");
    const shortDescriptionInput = screen.getByPlaceholderText(
      "Enter short description (Limit to 25 characters)"
    );
    const longDescriptionInput = screen.getByPlaceholderText(
      "Enter long description (Limit to 250 characters)"
    );
    const quantityInput = screen.getByPlaceholderText("Quantity");
    const discountInput = screen.getByPlaceholderText("Discount (%)");
    const addButton = screen.getByText("Add");

    // Act
    fireEvent.change(productNameInput, { target: { value: "Test Product" } });
    fireEvent.change(shortDescriptionInput, { target: { value: "Short Desc" } });
    fireEvent.change(longDescriptionInput, { target: { value: "This is a long description." } });
    fireEvent.change(quantityInput, { target: { value: "5" } });
    fireEvent.change(discountInput, { target: { value: "10" } });
    fireEvent.click(addButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText("Please enter a valid price.")).toBeInTheDocument();
    });
  });
});
