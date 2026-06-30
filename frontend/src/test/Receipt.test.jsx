// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Import the DOM matchers and extend Vitest's expect engine
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

import ReceiptForm from '../components/Receiptform';
import ReceiptLayout from '../components/Receiptlayout';

// Shared base mock metrics matching your application screenshots
const baselineMockProps = {
  patientName: 'John Doe',
  doctorName: 'Dr. Sarah Jenkins, OD',
  date: '2026-06-23',
  receiptNumber: 'EYE-20260623-NU13',
  odRx: 'Sph -2.50 / Cyl -0.50 x 180',
  osRx: 'Sph -2.25 / DS',
  items: [
    { name: 'Anti-Reflective Lenses (1.61)', quantity: 1, price: 120.00 },
    { name: 'Designer Frame - Matte Black', quantity: 1, price: 145.00 }
  ],
  setPatientName: vi.fn(),
  setDoctorName: vi.fn(),
  setDate: vi.fn(),
  setReceiptNumber: vi.fn(),
  setOdRx: vi.fn(),
  setOsRx: vi.fn(),
  handleItemChange: vi.fn(),
  handlePrint: vi.fn()
};

// ========================================================
// 1. RECEIPT DATA INPUT COMPONENT TESTS
// ========================================================
describe('ReceiptForm Component - User Input Triggers', () => {

  it('it should be able to allow users to enter patient information, doctor information, and receipt data details', () => {
    render(<ReceiptForm {...baselineMockProps} />);
    
    // Test Patient Name Input
    const patientInput = screen.getByLabelText(/Patient Name/i);
    fireEvent.change(patientInput, { target: { value: 'princess margareth Latiza' } });
    expect(baselineMockProps.setPatientName).toHaveBeenCalledWith('princess margareth Latiza');

    // Test Doctor Name Input
    const doctorInput = screen.getByLabelText(/Doctor Name/i);
    fireEvent.change(doctorInput, { target: { value: 'Dr. Ara Manimtim' } });
    expect(baselineMockProps.setDoctorName).toHaveBeenCalledWith('Dr. Ara Manimtim');

    // FIX: Using a different date value forces an update event
    const dateInput = screen.getByLabelText(/Date/i);
    fireEvent.change(dateInput, { target: { value: '2026-07-15' } });
    expect(baselineMockProps.setDate).toHaveBeenCalledWith('2026-07-15');
  });

  it('it should be able to allow users to modify prescription details for both eyes', () => {
    render(<ReceiptForm {...baselineMockProps} />);
    
    // Test Right Eye Rx Input
    const odInput = screen.getByLabelText(/OD \(Right Eye\)/i);
    fireEvent.change(odInput, { target: { value: 'Sph -3.00 / Cyl -0.25 x 180' } });
    expect(baselineMockProps.setOdRx).toHaveBeenCalledWith('Sph -3.00 / Cyl -0.25 x 180');

    // Test Left Eye Rx Input
    const osInput = screen.getByLabelText(/OS \(Left Eye\)/i);
    fireEvent.change(osInput, { target: { value: 'Sph -2.75 / DS' } });
    expect(baselineMockProps.setOsRx).toHaveBeenCalledWith('Sph -2.75 / DS');
  });

  it('it should be able to allow users to manipulate individual line item details including descriptions, quantities, and prices', () => {
    render(<ReceiptForm {...baselineMockProps} />);
    
    // Test Line Item Description Input
    const itemDescInputs = screen.getAllByLabelText(/Description/i);
    fireEvent.change(itemDescInputs[0], { target: { value: 'Premium Blue Light Lens' } });
    expect(baselineMockProps.handleItemChange).toHaveBeenCalledWith(0, 'name', 'Premium Blue Light Lens');

    // Test Line Item Quantity Input
    const itemQtyInputs = screen.getAllByLabelText(/Qty/i);
    fireEvent.change(itemQtyInputs[0], { target: { value: '2' } });
    expect(baselineMockProps.handleItemChange).toHaveBeenCalledWith(0, 'quantity', '2');

    // Test Line Item Price Input
    const itemPriceInputs = screen.getAllByLabelText(/Price/i);
    fireEvent.change(itemPriceInputs[0], { target: { value: '150.00' } });
    expect(baselineMockProps.handleItemChange).toHaveBeenCalledWith(0, 'price', '150.00');
  });
});

// ========================================================
// 2. RECEIPT DOCUMENT STRUCTURAL PRESENTATION TESTS
// ========================================================
describe('ReceiptLayout Component - Layout Columns & Formats', () => {

  it('it should be displaying item descriptions, quantities, prices, and totals in their correct columns and format', () => {
    render(<ReceiptLayout {...baselineMockProps} />);
    
    // Verify Column Headers structurally map to a table layout matrix
    expect(screen.getByRole('columnheader', { name: /Item\/Service Description/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Qty/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Price/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Total/i })).toBeInTheDocument();

    // Verify Row 1: Anti-Reflective Lenses (1.61) description renders
    expect(screen.getByText('Anti-Reflective Lenses (1.61)')).toBeInTheDocument();
    
    // Resolves duplication for $120.00 (Appears in Unit Price and Total columns)
    const priceElements120 = screen.getAllByText('$120.00');
    expect(priceElements120.length).toBeGreaterThanOrEqual(2);
    priceElements120.forEach(el => expect(el).toBeInTheDocument());

    // Verify Row 2: Designer Frame - Matte Black description renders
    expect(screen.getByText('Designer Frame - Matte Black')).toBeInTheDocument();
    
    // Resolves duplication for $145.00 (Appears in Unit Price and Total columns)
    const priceElements145 = screen.getAllByText('$145.00');
    expect(priceElements145.length).toBeGreaterThanOrEqual(2);
    priceElements145.forEach(el => expect(el).toBeInTheDocument());

    // Verify live calculation summaries match total aggregation layout formulas
    expect(screen.getByTestId('preview-subtotal').textContent).toBe('$265.00'); 
    expect(screen.getByTestId('preview-tax').textContent).toBe('$13.25');     
    expect(screen.getByTestId('preview-total').textContent).toBe('$278.25');   
  });
});