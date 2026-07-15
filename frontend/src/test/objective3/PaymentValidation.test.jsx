import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PaymentValidation from "../../components/Objective3/PaymentValidation";

describe("Payment Validation", () => {

  beforeEach(() => {
    window.alert = vi.fn();
  });

  it("should render payment validation form", () => {

    render(<PaymentValidation />);

    expect(screen.getByText("Payment Validation")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Customer ID")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Amount")).toBeInTheDocument();

  });

  it("should require customer ID before submission", () => {

    render(<PaymentValidation />);

    fireEvent.click(screen.getByText("Preview Receipt"));

    expect(window.alert).toHaveBeenCalledWith(
      "Customer ID is required"
    );

  });

  it("should reject payment amount less than or equal to zero", () => {

    render(<PaymentValidation />);

    fireEvent.change(screen.getByPlaceholderText("Customer ID"), {
      target: { value: "C001" },
    });

    fireEvent.change(screen.getByPlaceholderText("Amount"), {
      target: { value: "0" },
    });

    fireEvent.change(
      screen.getByDisplayValue(""),
      {
        target: {
          value: "2026-07-08",
        },
      }
    );

    fireEvent.click(screen.getByText("Preview Receipt"));

    expect(window.alert).toHaveBeenCalledWith(
      "Amount must be greater than 0"
    );

  });

  it("should require transaction date before submission", () => {

    render(<PaymentValidation />);

    fireEvent.change(screen.getByPlaceholderText("Customer ID"), {
      target: { value: "C001" },
    });

    fireEvent.change(screen.getByPlaceholderText("Amount"), {
      target: { value: "500" },
    });

    fireEvent.click(screen.getByText("Preview Receipt"));

    expect(window.alert).toHaveBeenCalledWith(
      "Date is required"
    );

  });

  it("should generate receipt preview when payment amount is greater than zero", () => {

    render(<PaymentValidation />);

    fireEvent.change(screen.getByPlaceholderText("Customer ID"), {
      target: { value: "C001" },
    });

    fireEvent.change(screen.getByPlaceholderText("Amount"), {
      target: { value: "1000" },
    });

    fireEvent.change(
      screen.getByDisplayValue(""),
      {
        target: {
          value: "2026-07-08",
        },
      }
    );

    fireEvent.click(screen.getByText("Preview Receipt"));

    expect(window.alert).not.toHaveBeenCalled();

    expect(
      screen.getByText("Receipt Preview")
    ).toBeInTheDocument();

  });

});  