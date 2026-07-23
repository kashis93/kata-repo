# Car Dealership API Backend

This is a production-level FastAPI application implementing authentication, user levels (Customer and Admin), and dealership vehicle inventory management.

## Tech Stack & Highlights
- **Framework**: FastAPI
- **Database**: SQLite (persistent database stored in `car_dealership.db`)
- **ORM**: SQLAlchemy 2.x
- **Authentication**: JWT (JSON Web Tokens) with token expiration and encryption
- **Security**: Direct implementation of `bcrypt` password hashing (solving the passlib deprecation and compatibility errors with Python 3.10+)
- **Testing**: Complete `pytest` suite testing all business logic and router endpoints with isolated in-memory databases

---

## Getting Started

### 1. Requirements
Ensure you have Python 3.10+ installed.

### 2. Install Dependencies
Activate the virtual environment and install the required modules:
```bash
# If using Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Install requirements
pip install -r requirements.txt
```

### 3. Environment Variables (`.env`)
A default `.env` is already configured in the root directory:
```env
DATABASE_URL=sqlite:///./car_dealership.db
SECRET_KEY=dev-secret-key-change-in-production-min-32-chars
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256
```

### 4. Initialize & Seed Database
We have provided a database seeding script. It creates the database tables, creates seed users, and populates the database with initial vehicles:
```bash
python -m scripts.seed_db
```
**Default Seed Accounts**:
- **Admin**: `admin@dealership.com` / `adminpassword123`
- **Customer**: `customer@dealership.com` / `customerpassword123`

---

## Running the Application

### Option A: Running Locally
Run the Uvicorn development server:
```bash
python -m uvicorn app.main:app --reload
```
The server will start at: `http://127.0.0.1:8000`

### Option B: Running with Docker
Build and run the API using Docker Compose:
```bash
docker-compose up --build
```
The API container will start and bind to port `8000`.

---

## Running Automated Tests

Run the full suite of unit and integration tests using `pytest`:
```bash
python -m pytest tests/ -v
```
All 31 tests are set up to run using an isolated in-memory database instance, guaranteeing they don't affect your development database.

---

## Manual Testing with Postman

We have generated a pre-configured Postman Collection file in the root folder:
[car_dealership_postman_collection.json](./car_dealership_postman_collection.json)

### How to Import & Use:
1. Open **Postman**.
2. Click the **Import** button in the top left corner, select the `car_dealership_postman_collection.json` file from the repository, and click Import.
3. The collection is configured with collection variables (`baseUrl`, `customerToken`, and `adminToken`).
4. **Step 1: Authenticate**
   - Execute the **Login Customer** request under the "Authentication" folder. This request will automatically save the customer token to the collection variables.
   - Execute the **Login Admin** request under the "Authentication" folder. This will automatically save the admin token to the collection variables.
5. **Step 2: Try Endpoint Testing**
   - **Public / Customer Endpoints**: Run the "List All Vehicles", "Search Vehicles", or "Get Specific Vehicle By ID" requests.
   - **Purchase Vehicles**: Run the "Purchase Vehicle" request under the "Inventory" folder. It will decrease the quantity of the vehicle.
   - **Admin Operations**: Run the "Add Vehicle", "Update Vehicle Details", "Delete Vehicle", or "Restock Vehicle" requests. These requests use the `adminToken` variable.
   - **Access Control Checks**: If you try to run Admin operations using the `customerToken` (by changing the request auth settings or swapping the tokens), the API will return `403 Forbidden` as expected.
