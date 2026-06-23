# Objective Plan

## Objective #: 3

**Owner (Member Name):** Manimtim, Hazel Ann D.

**Objective Title:** Transaction and Communication module

**Objective Description:**

The objective of the Transaction and Communication module is to streamline payment processing and improve communication between the clinic and its stakeholders. It enables accurate recording of patient deposits and payments while automatically generating digital receipts for every transaction. The module also provides timely notifications on order status, completion, and other important updates to ensure efficient coordination and service delivery.

---

# 5-Week Task Breakdown

## Week 1

### Day 1

#### Task Description
Develop Digital Receipt Generation

#### Sub-Tasks
-Generate Data Form 
-modify prescription details
-manipulate individual line item details
-displaying item descriptions


#### Deliverable(s)
-receipt form
-prescription details
-item details
-item desciption





#### Test Suite / PR Acceptance Criteria
-it should be able to allow users to enter patient information, doctor information, and receipt data details
-it should be able to allow users to modify prescription details for both eyes
-it should be able to allow users to manipulate individual line item details including descriptions, quantities, and prices.
-it should be displaying item descriptions, quantities, prices, and totals in their correct columns and format



---

## Week 2

### Day 1

#### Task Description
Integrate Payment and Receipt Features

#### Sub-Tasks
- Connect payment records to receipts
- Test receipt generation workflow

#### Deliverable(s)
- payment records to receipts
- receipt generation workflow

#### Test Suite / PR Acceptance Criteria
- It should be ensured that every successful payment record is correctly linked to its corresponding receipt in the database.
- It should be verified that receipt generation is automatically triggered after payment confirmation and displayed without errors or missing data.

---

### Day 2

#### Task Description
Develop Stakeholder Communication Updates

#### Sub-Tasks
- Create update message feature
- Restrict access to authorized users
- Store communication logs

#### Deliverable(s)
- update message feature
- access to authorized users
- communication logs

#### Test Suite / PR Acceptance Criteria
- It should be ensured that only users with authorized roles admin/staff can create and send update messages.
- It should be verified that unauthorized users are blocked from accessing the messaging module access denied response shown.
- It should be confirmed that all sent messages are stored in the database with correct timestamp, sender ID, and message content.

---

## Week 3

### Day 1

#### Task Description
Design Payment and Receipt Management Module

#### Sub-Tasks
- Create database structure for payments and deposits
- Design payment forms
- Define receipt format

#### Deliverable(s)
- database structure for payments and deposits
- payment forms
- receipt format

#### Test Suite / PR Acceptance Criteria
- It should be ensured that database tables correctly store payments and deposits with proper field constraints NOT NULL, primary keys, foreign keys.
- It should be verified that payment forms validate required fields amount > 0, valid date, required customer ID before submission.
- It should be confirmed that receipt format remains consistent across all transactions and follows the defined template structure.

---

### Day 2

#### Task Description
Implement Payment Recording Feature

#### Sub-Tasks
- Develop payment entry form
- Save deposits and payments to database
- Validate input fields

#### Deliverable(s)
- payment entry form
- deposits and payments to database
- input fields

#### Test Suite / PR Acceptance Criteria
- It should be ensured that the payment entry form successfully captures all required fields and prevents empty submissions.
- It should be verified that all payment and deposit records are correctly stored in the database with accurate values matching user input.
- It should be confirmed that invalid inputs negative values, empty fields, invalid formats are rejected with proper error messages.

---

## Week 4

### Day 1

#### Task Description
Implement Order Status Notifications

#### Sub-Tasks
- Create status update triggers
- Send notifications for order progress
- Test notification delivery

#### Deliverable(s)
- update triggers
- notifications for order progress
- notification delivery

#### Test Suite / PR Acceptance Criteria
- It should be ensured that status changes pending, processing, completed automatically trigger notifications.
- It should be verified that notifications are sent immediately after status update and reflect correct order information.
- It should be confirmed that notifications are received successfully on the user side and logged in the database with timestamps.

---

### Day 2

#### Task Description
Design Notification System

#### Sub-Tasks
- Create notification database table
- Define notification types
- Design notification interface

#### Deliverable(s)
- notification database table
- notification types
- notification interface

#### Test Suite / PR Acceptance Criteria
- It should be ensured that the notification table correctly stores notification ID, user ID, type, message, and timestamp.
- It should be verified that notification types order update, payment alert, system message are correctly categorized and retrievable.
- It should be confirmed that the notification UI displays messages in real-time and is properly sorted by newest to oldest.

---

## Week 5

### Day 1

#### Task Description
Integrate Notification and Communication Features

#### Sub-Tasks
- Connect notification system with order records
- Test stakeholder updates

#### Deliverable(s)
- notification system with order records
- stakeholder updates

#### Test Suite / PR Acceptance Criteria
- It should be ensured that notifications are automatically generated when an order status changes in the system.
- It should be verified that all stakeholders admin, customer, staff receive correct updates based on their role permissions.

---

### Day 2

#### Task Description
System Testing and Bug Fixing

#### Sub-Tasks
- Perform unit testing
- Conduct integration testing
- Fix identified issues

#### Deliverable(s)
- unit testing
- integration testing
- identified issues

#### Test Suite / PR Acceptance Criteria
- It should be ensured that all individual modules pass unit testing with expected outputs for valid and invalid inputs.
- It should be verified that integrated modules payment, receipt, notification work together without data mismatch or system errors.
- It should be confirmed that all identified bugs are fixed, re-tested, and no critical/high severity issues remain.

---

## Week 6

### Day 1

#### Task Description
Final Documentation and Deployment Preparation

#### Sub-Tasks
- Prepare user documentation
- Final code review
- Deploy module to testing environment

#### Deliverable(s)
- user documentation
- code review
- module to testing environment

#### Test Suite / PR Acceptance Criteria
- It should be ensured that user documentation includes complete step-by-step instructions, system features, and troubleshooting guide.
- It should be verified that final code review passes all standards including naming conventions, structure, and error handling.
- It should be confirmed that the module is successfully deployed in the testing environment and is accessible for QA testing without errors.