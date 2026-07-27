
"""
Database seeding script.

Creates default admin and customer accounts, and inserts initial vehicle stock.
Run this script manually from the command line:
    python -m scripts.seed_db
"""

from decimal import Decimal
from sqlalchemy.orm import Session

from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models.user import User
from app.models.vehicle import Vehicle
from app.core.security import hash_password


def seed_db() -> None:
    """Create initial users and vehicles in the database."""
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized.")

    db: Session = SessionLocal()
    try:
        # Seed Users
        admin_email = "admin@dealership.com"
        customer_email = "customer@dealership.com"

        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            admin = User(
                email=admin_email,
                hashed_password=hash_password("adminpassword123"),
                is_admin=True,
            )
            db.add(admin)
            print(f"Created Admin account: {admin_email}")
        else:
            print(f"Admin account already exists: {admin_email}")

        customer = db.query(User).filter(User.email == customer_email).first()
        if not customer:
            customer = User(
                email=customer_email,
                hashed_password=hash_password("customerpassword123"),
                is_admin=False,
            )
            db.add(customer)
            print(f"Created Customer account: {customer_email}")
        else:
            print(f"Customer account already exists: {customer_email}")

        # Seed Vehicles (51 cars total)
        vehicles_data = [
            {"make": "Porsche", "model": "911 GT3 RS", "category": "Coupe", "price": Decimal("241300.00"), "quantity": 2},
            {"make": "BMW", "model": "M4 Competition xDrive", "category": "Coupe", "price": Decimal("88300.00"), "quantity": 4},
            {"make": "Mercedes-Benz", "model": "AMG GT 63 S E Performance", "category": "Coupe", "price": Decimal("194900.00"), "quantity": 1},
            {"make": "Audi", "model": "RS e-tron GT", "category": "Electric", "price": Decimal("147100.00"), "quantity": 3},
            {"make": "Chevrolet", "model": "Corvette Z06 3LZ", "category": "Convertible", "price": Decimal("128500.00"), "quantity": 0},
            {"make": "Ford", "model": "Mustang Dark Horse", "category": "Coupe", "price": Decimal("63200.00"), "quantity": 5},
            {"make": "Tesla", "model": "Model S Plaid", "category": "Electric", "price": Decimal("89990.00"), "quantity": 3},
            {"make": "Lexus", "model": "LC 500 Bespoke Edition", "category": "Coupe", "price": Decimal("106200.00"), "quantity": 2},
            {"make": "Toyota", "model": "GR Supra 3.0 Premium", "category": "Coupe", "price": Decimal("59590.00"), "quantity": 6},
            {"make": "Nissan", "model": "Z Performance", "category": "Coupe", "price": Decimal("53410.00"), "quantity": 4},
            {"make": "Honda", "model": "Civic Type R", "category": "Hatchback", "price": Decimal("44890.00"), "quantity": 7},
            {"make": "Volkswagen", "model": "Golf R", "category": "Hatchback", "price": Decimal("46935.00"), "quantity": 5},
            {"make": "Hyundai", "model": "Elantra N", "category": "Sedan", "price": Decimal("34125.00"), "quantity": 9},
            {"make": "Kia", "model": "Stinger GT2", "category": "Sedan", "price": Decimal("52890.00"), "quantity": 4},
            {"make": "Subaru", "model": "WRX STI", "category": "Sedan", "price": Decimal("41195.00"), "quantity": 2},
            {"make": "Mazda", "model": "MX-5 Miata RF", "category": "Convertible", "price": Decimal("38915.00"), "quantity": 6},
            {"make": "Lamborghini", "model": "Huracán EVO", "category": "Coupe", "price": Decimal("261274.00"), "quantity": 1},
            {"make": "Ferrari", "model": "F8 Tributo", "category": "Coupe", "price": Decimal("276550.00"), "quantity": 1},
            {"make": "McLaren", "model": "720S", "category": "Coupe", "price": Decimal("299000.00"), "quantity": 1},
            {"make": "Aston Martin", "model": "Vantage", "category": "Coupe", "price": Decimal("146986.00"), "quantity": 2},
            {"make": "Porsche", "model": "Taycan Turbo S", "category": "Sedan", "price": Decimal("194900.00"), "quantity": 3},
            {"make": "Lucid", "model": "Air Sapphire", "category": "Sedan", "price": Decimal("249000.00"), "quantity": 2},
            {"make": "Rivian", "model": "R1S Performance", "category": "SUV", "price": Decimal("94000.00"), "quantity": 4},
            {"make": "Ford", "model": "F-150 Raptor R", "category": "Truck", "price": Decimal("109250.00"), "quantity": 3},
            {"make": "Chevrolet", "model": "Silverado ZR2", "category": "Truck", "price": Decimal("72595.00"), "quantity": 5},
            {"make": "Ram", "model": "1500 TRX", "category": "Truck", "price": Decimal("88435.00"), "quantity": 2},
            {"make": "Toyota", "model": "Tacoma TRD Pro", "category": "Truck", "price": Decimal("52010.00"), "quantity": 6},
            {"make": "Land Rover", "model": "Defender 110 V8", "category": "SUV", "price": Decimal("108875.00"), "quantity": 2},
            {"make": "Jeep", "model": "Wrangler Rubicon 392", "category": "SUV", "price": Decimal("82995.00"), "quantity": 4},
            {"make": "BMW", "model": "X5 M Competition", "category": "SUV", "price": Decimal("122300.00"), "quantity": 3},
            {"make": "Mercedes-Benz", "model": "G63 AMG", "category": "SUV", "price": Decimal("179000.00"), "quantity": 2},
            {"make": "Porsche", "model": "Cayenne Turbo GT", "category": "SUV", "price": Decimal("196300.00"), "quantity": 1},
            {"make": "Lamborghini", "model": "Urus Performante", "category": "SUV", "price": Decimal("260676.00"), "quantity": 1},
            {"make": "Bentley", "model": "Bentayga Speed", "category": "SUV", "price": Decimal("245000.00"), "quantity": 1},
            {"make": "Rolls-Royce", "model": "Cullinan Black Badge", "category": "SUV", "price": Decimal("450000.00"), "quantity": 1},
            {"make": "Ferrari", "model": "Roma", "category": "Coupe", "price": Decimal("243350.00"), "quantity": 1},
            {"make": "McLaren", "model": "GT", "category": "Coupe", "price": Decimal("215000.00"), "quantity": 2},
            {"make": "Aston Martin", "model": "DB12", "category": "Coupe", "price": Decimal("248086.00"), "quantity": 1},
            {"make": "Porsche", "model": "911 Carrera GTS", "category": "Coupe", "price": Decimal("145100.00"), "quantity": 3},
            {"make": "BMW", "model": "M5 CS", "category": "Sedan", "price": Decimal("142000.00"), "quantity": 1},
            {"make": "Mercedes-Benz", "model": "C63 S E Performance", "category": "Sedan", "price": Decimal("94500.00"), "quantity": 3},
            {"make": "Audi", "model": "RS6 Avant", "category": "Wagon", "price": Decimal("123900.00"), "quantity": 3},
            {"make": "Cadillac", "model": "CT5-V Blackwing", "category": "Sedan", "price": Decimal("93390.00"), "quantity": 2},
            {"make": "Acura", "model": "NSX Type S", "category": "Coupe", "price": Decimal("169500.00"), "quantity": 1},
            {"make": "Nissan", "model": "GT-R NISMO", "category": "Coupe", "price": Decimal("220990.00"), "quantity": 1},
            {"make": "Chevrolet", "model": "Camaro ZL1 1LE", "category": "Coupe", "price": Decimal("75495.00"), "quantity": 2},
            {"make": "Ford", "model": "GT", "category": "Coupe", "price": Decimal("550000.00"), "quantity": 1},
            {"make": "Dodge", "model": "Challenger SRT Demon 170", "category": "Coupe", "price": Decimal("96666.00"), "quantity": 1},
            {"make": "Tesla", "model": "Model 3 Performance", "category": "Sedan", "price": Decimal("50990.00"), "quantity": 7},
            {"make": "Polestar", "model": "2 BST Edition 230", "category": "Hatchback", "price": Decimal("75500.00"), "quantity": 2},
            {"make": "Porsche", "model": "718 Cayman GT4 RS", "category": "Coupe", "price": Decimal("149100.00"), "quantity": 1},
        ]

        for item in vehicles_data:
            existing = db.query(Vehicle).filter(
                Vehicle.make == item["make"],
                Vehicle.model == item["model"]
            ).first()

            if not existing:
                vehicle = Vehicle(
                    make=item["make"],
                    model=item["model"],
                    category=item["category"],
                    price=item["price"],
                    quantity=item["quantity"],
                )
                db.add(vehicle)
                print(f"Added vehicle: {item['make']} {item['model']} ({item['quantity']} units)")
            else:
                print(f"Vehicle already exists: {item['make']} {item['model']}")

        db.commit()
        print("Database seeding completed successfully.")

    except Exception as e:
        db.rollback()
        print(f"An error occurred while seeding the database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_db()
