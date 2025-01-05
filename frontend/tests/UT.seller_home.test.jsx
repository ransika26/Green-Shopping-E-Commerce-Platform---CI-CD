import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Seller_home from "../src/Pages/seller/seller_home/Seller_home";

// Mocking fetch API
global.fetch = vi.fn();

// Mocking the Edit and Delete components
vi.mock("../src/Components/Modules/seller_product_delete/Seller_product_delete", () => ({
  Delete: ({ closeModal, onSubmit }) => (
    <div data-testid="delete-modal">
      <button onClick={onSubmit}>Confirm Delete</button>
      <button onClick={closeModal}>Cancel</button>
    </div>
  ),
}));

vi.mock("../src/Components/Modules/seller_product_edit/Seller_product_edit", () => ({
  Edit: ({ closeModal, product }) => (
    <div data-testid="edit-modal">
      <p>{product.ProductName}</p>
      <button onClick={closeModal}>Close</button>
    </div>
  ),
}));

describe("Seller_home", () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.setItem("sellerId", "test-seller-id");
  });

  it("renders the product table correctly", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        {
          _id: "1",
          ProductName: "Test Product",
          Quantity: 10,
          Price: 20,
          ImageFile: "test-image.jpg",
        },
      ]),
    });

    render(<Seller_home />);

    // Wait for products to load
    await waitFor(() => screen.getByText("Test Product"));

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("$20")).toBeInTheDocument();
    expect(screen.getByAltText("Test Product")).toHaveAttribute(
      "src",
      "http://localhost:3000/uploads/test-image.jpg"
    );
  });

  
  

  it("opens the delete modal when Delete button is clicked", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([
        {
          _id: "1",
          ProductName: "Test Product",
          Quantity: 10,
          Price: 20,
          ImageFile: "test-image.jpg",
        },
      ]),
    });

    render(<Seller_home />);

    // Wait for products to load
    await waitFor(() => screen.getByText("Test Product"));

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
  });

  it("calls handleDelete and removes the product on delete confirmation", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          {
            _id: "1",
            ProductName: "Test Product",
            Quantity: 10,
            Price: 20,
            ImageFile: "test-image.jpg",
          },
        ]),
      })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ message: "Product deleted successfully" }) });

    render(<Seller_home />);

    // Wait for products to load
    await waitFor(() => screen.getByText("Test Product"));

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    // Confirm delete
    const confirmButton = screen.getByText("Confirm Delete");
    fireEvent.click(confirmButton);

    await waitFor(() => expect(screen.queryByText("Test Product")).not.toBeInTheDocument());
  });
});
