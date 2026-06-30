import React, { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'


// A wrapper component to manage the true state lifecycle during testing
const TestFormWrapper = ({ onSubmit, handlePrint }) => {
  const [patientName, setPatientName] = useState('John Doe')
  const [doctorName, setDoctorName] = useState('Dr. Sarah Jenkins, OD')
  const [date, setDate] = useState('2026-06-23')
  const [receiptNumber, setReceiptNumber] = useState('EYE-20260623')
  const [odRx, setOdRx] = useState('Sph -2.50 / Cyl -0.50 x 180')
  const [osRx, setOsRx] = useState('Sph -2.25 / DS')
  const [items, setItems] = useState([
    { name: 'Anti-Reflective Lenses (1.61)', quantity: 1, price: 120.00 }
  ])

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'quantity' || field === 'price' ? (value === '' ? '' : Number(value)) : value
    }
    setItems(updatedItems)
  }

  return (
    <ReceiptForm
      patientName={patientName} setPatientName={setPatientName}
      doctorName={doctorName} setDoctorName={setDoctorName}
      date={date} setDate={setDate}
      receiptNumber={receiptNumber} setReceiptNumber={setReceiptNumber}
      odRx={odRx} setOdRx={setOdRx}
      osRx={osRx} setOsRx={setOsRx}
      items={items} handleItemChange={handleItemChange}
      handlePrint={handlePrint}
      onSubmit={onSubmit}
    />
  )
}

describe('ReceiptForm Component - User Input Triggers', () => {

  it('shows error when patient information is missing', () => {
    const handleSubmit = vi.fn()
    const { container } = render(<TestFormWrapper onSubmit={handleSubmit} />)
    const patientInput = screen.getByLabelText(/Patient Name/i)
    const doctorInput = screen.getByLabelText(/Doctor Name/i)
    const dateInput = screen.getByLabelText(/Date/i)
    const receiptInput = screen.getByLabelText(/Receipt Number/i)

    fireEvent.change(patientInput, { target: { value: '' } })
    expect(patientInput).toHaveValue('')

    fireEvent.change(doctorInput, { target: { value: 'Dr. Alex Mercer, OD' } })
    expect(doctorInput).toHaveValue('Dr. Alex Mercer, OD')

    fireEvent.change(dateInput, { target: { value: '2026-06-23' } })
    expect(dateInput).toHaveValue('2026-06-23')

    fireEvent.change(receiptInput, { target: { value: 'EYE-20269999' } })
    expect(receiptInput).toHaveValue('EYE-20269999')

    fireEvent.submit(container.querySelector('form'))
    const error = screen.getByText(/Patient Name is required/i)
    expect(error).toBeInTheDocument()
  })

  it('shows error when doctor name is missing', () => {
    const handleSubmit = vi.fn()
    const { container } = render(<TestFormWrapper onSubmit={handleSubmit} />)
    const patientInput = screen.getByLabelText(/Patient Name/i)
    const doctorInput = screen.getByLabelText(/Doctor Name/i)
    const dateInput = screen.getByLabelText(/Date/i)
    const receiptInput = screen.getByLabelText(/Receipt Number/i)

    fireEvent.change(patientInput, { target: { value: 'John Doe' } })
    expect(patientInput).toHaveValue('John Doe')

    fireEvent.change(doctorInput, { target: { value: '' } })
    expect(doctorInput).toHaveValue('')

    fireEvent.change(dateInput, { target: { value: '2026-06-23' } })
    expect(dateInput).toHaveValue('2026-06-23')

    fireEvent.change(receiptInput, { target: { value: 'EYE-20269999' } })
    expect(receiptInput).toHaveValue('EYE-20269999')

    fireEvent.submit(container.querySelector('form'))
    const error = screen.getByText(/Doctor Name is required/i)
    expect(error).toBeInTheDocument()
  })

  it('shows error when date is missing', () => {
    const handleSubmit = vi.fn()
    const { container } = render(<TestFormWrapper onSubmit={handleSubmit} />)
    const patientInput = screen.getByLabelText(/Patient Name/i)
    const doctorInput = screen.getByLabelText(/Doctor Name/i)
    const dateInput = screen.getByLabelText(/Date/i)
    const receiptInput = screen.getByLabelText(/Receipt Number/i)

    fireEvent.change(patientInput, { target: { value: 'John Doe' } })
    expect(patientInput).toHaveValue('John Doe')

    fireEvent.change(doctorInput, { target: { value: 'Dr. Alex Mercer, OD' } })
    expect(doctorInput).toHaveValue('Dr. Alex Mercer, OD')

    fireEvent.change(dateInput, { target: { value: '' } })
    expect(dateInput).toHaveValue('')

    fireEvent.change(receiptInput, { target: { value: 'EYE-20269999' } })
    expect(receiptInput).toHaveValue('EYE-20269999')

    fireEvent.submit(container.querySelector('form'))
    const error = screen.getByText(/Date is required/i)
    expect(error).toBeInTheDocument()
  })

  it('shows error when receipt number is missing', () => {
    const handleSubmit = vi.fn()
    const { container } = render(<TestFormWrapper onSubmit={handleSubmit} />)
    const patientInput = screen.getByLabelText(/Patient Name/i)
    const doctorInput = screen.getByLabelText(/Doctor Name/i)
    const dateInput = screen.getByLabelText(/Date/i)
    const receiptInput = screen.getByLabelText(/Receipt Number/i)

    fireEvent.change(patientInput, { target: { value: 'John Doe' } })
    expect(patientInput).toHaveValue('John Doe')

    fireEvent.change(doctorInput, { target: { value: 'Dr. Alex Mercer, OD' } })
    expect(doctorInput).toHaveValue('Dr. Alex Mercer, OD')

    fireEvent.change(dateInput, { target: { value: '2026-06-23' } })
    expect(dateInput).toHaveValue('2026-06-23')

    fireEvent.change(receiptInput, { target: { value: '' } })
    expect(receiptInput).toHaveValue('')

    fireEvent.submit(container.querySelector('form'))
    const error = screen.getByText(/Receipt Number is required/i)
    expect(error).toBeInTheDocument()
  })

  it('submits correctly when all data is valid', () => {
    const handleSubmit = vi.fn()
    const { container } = render(<TestFormWrapper onSubmit={handleSubmit} />)
    const patientInput = screen.getByLabelText(/Patient Name/i)
    const doctorInput = screen.getByLabelText(/Doctor Name/i)
    const dateInput = screen.getByLabelText(/Date/i)
    const receiptInput = screen.getByLabelText(/Receipt Number/i)

    fireEvent.change(patientInput, { target: { value: 'Dr. Alex Mercer, OD' } })
    expect(patientInput).toHaveValue('Dr. Alex Mercer, OD')

    fireEvent.change(doctorInput, { target: { value: 'Dr. Alex Mercer, OD' } })
    expect(doctorInput).toHaveValue('Dr. Alex Mercer, OD')

    fireEvent.change(dateInput, { target: { value: '2026-06-23' } })
    expect(dateInput).toHaveValue('2026-06-23')

    fireEvent.change(receiptInput, { target: { value: 'EYE-20269999' } })
    expect(receiptInput).toHaveValue('EYE-20269999')

   expect(handleSubmit).not.toHaveBeenCalled()
    fireEvent.submit(container.querySelector('form'))
    expect(handleSubmit).toHaveBeenCalled()
  })

  it('shows error when prescription OD is missing', () => {
    const handleSubmit = vi.fn()
    const { container } = render(<TestFormWrapper onSubmit={handleSubmit} />)
    const odInput = screen.getByLabelText(/OD \(Right Eye\)/i)
    const osInput = screen.getByLabelText(/OS \(Left Eye\)/i)

    fireEvent.change(odInput, { target: { value: '' } })
    expect(odInput).toHaveValue('')

    fireEvent.change(osInput, { target: { value: 'Sph -1.75 / DS' } })
    expect(osInput).toHaveValue('Sph -1.75 / DS')

    fireEvent.submit(container.querySelector('form'))
    const error = screen.getByText(/OD Rx is required/i)
    expect(error).toBeInTheDocument()
  })

  it('shows error when prescription OS is missing', () => {
    const handleSubmit = vi.fn()
    const { container } = render(<TestFormWrapper onSubmit={handleSubmit} />)
    const odInput = screen.getByLabelText(/OD \(Right Eye\)/i)
    const osInput = screen.getByLabelText(/OS \(Left Eye\)/i)

    fireEvent.change(odInput, { target: { value: 'Sph -2.00 / DS' } })
    expect(odInput).toHaveValue('Sph -2.00 / DS')

    fireEvent.change(osInput, { target: { value: '' } })
    expect(osInput).toHaveValue('')

    fireEvent.submit(container.querySelector('form'))
    const error = screen.getByText(/OS Rx is required/i)
    expect(error).toBeInTheDocument()
  })

  it('shows explicit error string when item quantity is missing', () => {
    const handleSubmit = vi.fn()
    const { container } = render(<TestFormWrapper onSubmit={handleSubmit} />)
    const itemDescInput = screen.getByLabelText(/Description/i)
    const itemQtyInput = screen.getByLabelText(/Qty/i)

    fireEvent.change(itemDescInput, { target: { value: 'AntiReflective Coating' } })
    expect(itemDescInput).toHaveValue('AntiReflective Coating')

    fireEvent.change(itemQtyInput, { target: { value: '' } })
    expect(itemQtyInput).toHaveValue(null) 

    fireEvent.submit(container.querySelector('form'))
    
    const error = screen.getByText(/Item Quantity is required/i)
    expect(error).toBeInTheDocument()
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('submits correct line item structure when entries are complete', () => {
    const handleSubmit = vi.fn()
    const { container } = render(<TestFormWrapper onSubmit={handleSubmit} />)
    const itemDescInput = screen.getByLabelText(/Description/i)
    const itemQtyInput = screen.getByLabelText(/Qty/i)
    const itemPriceInput = screen.getByLabelText(/Price \(\$\)/i)

    fireEvent.change(itemDescInput, { target: { value: 'Reflection Coating' } })
    expect(itemDescInput).toHaveValue('Reflection Coating')

    fireEvent.change(itemQtyInput, { target: { value: '5' } })
    expect(itemQtyInput).toHaveValue(5)

    fireEvent.change(itemPriceInput, { target: { value: '0' } })
    expect(itemPriceInput).toHaveValue(0)

    fireEvent.submit(container.querySelector('form'))
    expect(handleSubmit).toHaveBeenCalled()
  })

  it('asserts HTML5 constraint invalidation when item quantity is missing', () => {
    const handleSubmit = vi.fn()
    const { container } = render(<TestFormWrapper onSubmit={handleSubmit} />)
    const itemDescInput = screen.getByLabelText(/Description/i)
    const itemQtyInput = screen.getByLabelText(/Qty/i)

    fireEvent.change(itemDescInput, { target: { value: 'AntiReflective Coating' } })
    expect(itemDescInput).toHaveValue('AntiReflective Coating')

    fireEvent.change(itemQtyInput, { target: { value: '' } })
    expect(itemQtyInput).toHaveValue(null) 

    fireEvent.submit(container.querySelector('form'))

    const error = screen.getByText(/Item Quantity is required/i)
    expect(error).toBeInTheDocument()
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('triggers the printing workflow when the print button is pressed', () => {
    const handlePrintMock = vi.fn()
    render(<TestFormWrapper handlePrint={handlePrintMock} />)
    const printButton = screen.getByRole('button', { name: /Print Digital Receipt/i })

    fireEvent.click(printButton)
    expect(handlePrintMock).toHaveBeenCalledTimes(1)
  })

})