import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import ReceiptLayout from '../components/Receiptlayout'

describe('ReceiptLayout Component - Layout Columns & Formats', () => {

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
    ]
  }

  it('should display item descriptions, quantities, prices, and totals in their correct columns and format', () => {
    // Arrange
    render(<ReceiptLayout {...baselineMockProps} />)

    // Act & Assert
    // 1. Verify Column Headers structurally map to a table layout matrix
    expect(screen.getByRole('columnheader', { name: /Item\/Service Description/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Qty/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Price/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Total/i })).toBeInTheDocument()

    // 2. Verify Line Item Row 1
    expect(screen.getByText('Anti-Reflective Lenses (1.61)')).toBeInTheDocument()
    
    const priceElements120 = screen.getAllByText('$120.00')
    expect(priceElements120.length).toBeGreaterThanOrEqual(2)
    priceElements120.forEach(el => expect(el).toBeInTheDocument())

    // 3. Verify Line Item Row 2
    expect(screen.getByText('Designer Frame - Matte Black')).toBeInTheDocument()
    
    const priceElements145 = screen.getAllByText('$145.00')
    expect(priceElements145.length).toBeGreaterThanOrEqual(2)
    priceElements145.forEach(el => expect(el).toBeInTheDocument())

    // 4. Verify live calculation summaries match total aggregation formulas
    expect(screen.getByTestId('preview-subtotal').textContent).toBe('$265.00') 
    expect(screen.getByTestId('preview-tax').textContent).toBe('$13.25')     
    expect(screen.getByTestId('preview-total').textContent).toBe('$278.25')   
  })

})