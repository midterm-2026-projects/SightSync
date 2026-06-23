# Inventory and Order Tracking Module

## Objective Information

**Objective #:** 2  
**Owner:** Manalo, Dexter T.  
**Objective Title:** Inventory and Order Tracking Module

### Objective Description

The objective of the Inventory and Order Tracking module is to efficiently manage optical product inventory and monitor patient orders within the clinic. It enables accurate tracking of lenses and frames, updates inventory pricing and stock availability, and records the selected products for each patient. The module also incorporates AI-based prediction to identify frequently used lenses and frames, helping improve inventory planning and operational efficiency.

---

# Development Plan

## Week 1

### Day 1 – Create Inventory Management Interface

#### Sub-Tasks
- Create Inventory page layout
- Create inventory table component for lenses and frames
- Create Add/Edit Product form component

#### Deliverables
- InventoryPage.jsx
- InventoryTable.jsx
- InventoryForm.jsx

#### Acceptance Criteria
- It should be able to view the Inventory Management page without errors.
- It should be able to see the inventory table for lenses and frames.
- It should be able to access the Add/Edit Product form.

---

## Week 2

### Day 1 – Implement Inventory Monitoring Features

#### Sub-Tasks
- Display inventory data using sample data
- Add inventory item cards or table rows
- Show available lenses and frames

#### Deliverables
- Updated InventoryTable.jsx
- Sample inventory data file
- Inventory display components

#### Acceptance Criteria
- It should be able to view all available lenses and frames using sample data.
- It should be able to see inventory records displayed in the table.
- It should be able to see updates when inventory data changes.

---

### Day 2 – Implement Price and Stock Management UI

#### Sub-Tasks
- Create price input fields
- Create stock quantity input fields
- Add frontend validation for price and stock values

#### Deliverables
- Updated InventoryForm.jsx
- Validation functions
- Price and stock input components

#### Acceptance Criteria
- It should be able to enter a valid price value.
- It should be able to enter a valid stock quantity.
- It should be notified when invalid values are entered.

---

## Week 3

### Day 1 – Set Up Inventory Management Backend

#### Sub-Tasks
- Configure Neon PostgreSQL connection
- Create lenses and frames database tables
- Create inventory routes

#### Deliverables
- backend/src/config/db.js
- create_lenses_table.sql
- create_frames_table.sql
- backend/src/routes/inventory.js

#### Acceptance Criteria
- It should be able to connect to the Neon PostgreSQL database successfully.
- It should be able to verify that the lenses and frames tables were created.
- It should be able to access the inventory routes without server errors.

---

### Day 2 – Implement Inventory Management API

#### Sub-Tasks
- Create endpoint for retrieving lenses and frames
- Create endpoint for recording inventory prices
- Create endpoint for updating inventory prices

#### Deliverables
- GET Inventory API
- POST Inventory Price API
- PUT Inventory Price API

#### Acceptance Criteria
- It should be able to retrieve all available lenses and frames.
- It should be able to record inventory price information successfully.
- It should be able to update inventory prices successfully.

---

## Week 4

### Day 1 – Develop Order Tracking Backend

#### Sub-Tasks
- Create orders database table
- Create order routes
- Create endpoint for recording selected lenses and frames per patient

#### Deliverables
- create_orders_table.sql
- backend/src/routes/order.js
- backend/src/controllers/order.controller.js

#### Acceptance Criteria
- It should be able to create a patient order successfully.
- It should be able to record the selected lens and frame for a patient.
- It should be able to access the order routes without errors.

---

### Day 2 – Implement Stock Availability Tracking

#### Sub-Tasks
- Retrieve current stock quantities from inventory records
- Update stock quantities when orders are recorded
- Prevent selection of unavailable lenses and frames

#### Deliverables
- Updated inventory.controller.js
- Updated order.controller.js
- Stock validation functions

#### Acceptance Criteria
- It should be able to view the current stock quantity of a lens or frame.
- It should be able to see stock quantities updated after recording an order.
- It should not be able to record an order for unavailable items.

---

## Week 5

### Day 1 – Implement AI-Based Prediction Backend

#### Sub-Tasks
- Retrieve historical order records from the database
- Calculate frequently selected lenses
- Calculate frequently selected frames

#### Deliverables
- backend/src/services/prediction.service.js
- backend/src/controllers/prediction.controller.js
- backend/src/routes/prediction.js

#### Acceptance Criteria
- It should be able to retrieve frequently used lenses from historical order records.
- It should be able to retrieve frequently used frames from historical order records.
- It should be able to access the prediction endpoint successfully.

---

### Day 2 – Implement AI-Based Prediction Interface

#### Sub-Tasks
- Create prediction dashboard page
- Display frequently used lenses
- Display frequently used frames

#### Deliverables
- frontend/src/pages/PredictionDashboard.jsx
- frontend/src/components/FrequentlyUsedLenses.jsx
- frontend/src/components/FrequentlyUsedFrames.jsx

#### Acceptance Criteria
- It should be able to view frequently used lenses.
- It should be able to view frequently used frames.
- It should be able to view prediction results without errors.

---

## Week 6

### Day 1 – Perform End-to-End Testing and Final Validation

#### Sub-Tasks
- Test Inventory Management workflow
- Test Order Tracking workflow
- Test AI Prediction workflow

#### Deliverables
- TEST_REPORT.md
- Bug Fix Commits
- Final Validation Report

#### Acceptance Criteria
- It should be able to complete the Inventory Management workflow successfully.
- It should be able to complete the Order Tracking workflow successfully.
- It should be able to use the AI Prediction feature successfully.

---

## Tech Stack

### Frontend
- React.js
- JSX Components

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL (Neon)

### AI Prediction
- Historical Order Analysis
- Frequently Used Lens and Frame Prediction

---