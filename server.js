import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const currentFilePath = typeof __filename !== 'undefined' ? __filename : (import.meta.url ? fileURLToPath(import.meta.url) : '');
const currentDirPath = typeof __dirname !== 'undefined' ? __dirname : (currentFilePath ? path.dirname(currentFilePath) : process.cwd());

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // In-memory Database state
  const users = [
    {
      id: 'usr_admin',
      email: 'admin@autolot.com',
      is_admin: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'usr_customer',
      email: 'customer@autolot.com',
      is_admin: false,
      created_at: new Date().toISOString()
    }
  ];

  const vehicles = [
    { id: 'v1', make: 'Porsche', model: '911 GT3 RS', category: 'Coupe', price: 241300, quantity: 2 },
    { id: 'v2', make: 'Ferrari', model: 'SF90 Stradale', category: 'Coupe', price: 524000, quantity: 1 },
    { id: 'v3', make: 'Aston Martin', model: 'DBS 770 Ultimate', category: 'Coupe', price: 387600, quantity: 3 },
    { id: 'v4', make: 'Mercedes-Benz', model: 'AMG GT Black Series', category: 'Coupe', price: 325000, quantity: 1 },
    { id: 'v5', make: 'Lamborghini', model: 'Huracán Sterrato', category: 'Coupe', price: 278900, quantity: 2 },
    { id: 'v6', make: 'McLaren', model: '750S Spider', category: 'Convertible', price: 345000, quantity: 2 },
    { id: 'v7', make: 'Audi', model: 'RS e-tron GT', category: 'Electric', price: 147100, quantity: 4 },
    { id: 'v8', make: 'BMW', model: 'M8 Competition Coupe', category: 'Coupe', price: 138800, quantity: 3 },
    { id: 'v9', make: 'Bugatti', model: 'Chiron Pur Sport', category: 'Coupe', price: 3600000, quantity: 1 },
    { id: 'v10', make: 'Chevrolet', model: 'Corvette Z06 C8.R', category: 'Coupe', price: 128900, quantity: 2 },
    { id: 'v11', make: 'Ford', model: 'GT Mk II Track Edition', category: 'Coupe', price: 1200000, quantity: 1 },
    { id: 'v12', make: 'Maserati', model: 'MC20 Cielo Roadster', category: 'Convertible', price: 275000, quantity: 2 },
    { id: 'v13', make: 'Alfa Romeo', model: 'Giulia GTA Super Saloon', category: 'Sedan', price: 185000, quantity: 2 },
    { id: 'v14', make: 'Koenigsegg', model: 'Jesko Attack Hypercar', category: 'Coupe', price: 3200000, quantity: 1 },
    { id: 'v15', make: 'Pagani', model: 'Huayra Roadster BC', category: 'Convertible', price: 3500000, quantity: 1 },
    { id: 'v16', make: 'Lexus', model: 'LFA Nürburgring Edition', category: 'Coupe', price: 850000, quantity: 1 }
  ];

  let nextVehicleId = 17;

  // Authentication API
  app.post('/api/auth/register', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ detail: 'Email and password required' });
    }
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ detail: 'User already exists' });
    }
    const isAdmin = email.toLowerCase().includes('admin');
    const newUser = {
      id: `usr_${Date.now()}`,
      email,
      is_admin: isAdmin,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    return res.status(201).json(newUser);
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!email) {
      return res.status(400).json({ detail: 'Email required' });
    }
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      const isAdmin = email.toLowerCase().includes('admin') || email.toLowerCase().includes('staff');
      user = {
        id: `usr_${Date.now()}`,
        email,
        is_admin: isAdmin,
        created_at: new Date().toISOString()
      };
      users.push(user);
    }
    const token = `token_${user.id}_${Date.now()}`;
    return res.json({ access_token: token, token_type: 'bearer' });
  });

  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      return res.status(401).json({ detail: 'Unauthenticated' });
    }
    let user = users.find(u => token.includes(u.id));
    if (!user) {
      user = users[0];
    }
    return res.json(user);
  });

  // Vehicles API
  app.get('/api/vehicles/search', (req, res) => {
    let result = [...vehicles];
    const { make, model, category, min_price, max_price } = req.query;
    if (make) {
      result = result.filter(v => v.make.toLowerCase().includes(make.toLowerCase()));
    }
    if (model) {
      result = result.filter(v => v.model.toLowerCase().includes(model.toLowerCase()));
    }
    if (category) {
      result = result.filter(v => v.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (min_price) {
      result = result.filter(v => v.price >= Number(min_price));
    }
    if (max_price) {
      result = result.filter(v => v.price <= Number(max_price));
    }
    return res.json(result);
  });

  app.get('/api/vehicles', (req, res) => {
    return res.json(vehicles);
  });

  app.get('/api/vehicles/:id', (req, res) => {
    const vehicle = vehicles.find(v => String(v.id) === String(req.params.id));
    if (!vehicle) {
      return res.status(404).json({ detail: 'Vehicle not found' });
    }
    return res.json(vehicle);
  });

  app.post('/api/vehicles', (req, res) => {
    const { make, model, category, price, quantity } = req.body || {};
    if (!make || !model) {
      return res.status(400).json({ detail: 'Make and model are required' });
    }
    const newVehicle = {
      id: `v${nextVehicleId++}`,
      make,
      model,
      category: category || 'Sedan',
      price: Number(price) || 50000,
      quantity: Number(quantity) || 1
    };
    vehicles.push(newVehicle);
    return res.status(201).json(newVehicle);
  });

  app.put('/api/vehicles/:id', (req, res) => {
    const vehicle = vehicles.find(v => String(v.id) === String(req.params.id));
    if (!vehicle) {
      return res.status(404).json({ detail: 'Vehicle not found' });
    }
    const { make, model, category, price, quantity } = req.body || {};
    if (make !== undefined) vehicle.make = make;
    if (model !== undefined) vehicle.model = model;
    if (category !== undefined) vehicle.category = category;
    if (price !== undefined) vehicle.price = Number(price);
    if (quantity !== undefined) vehicle.quantity = Number(quantity);
    return res.json(vehicle);
  });

  app.patch('/api/vehicles/:id', (req, res) => {
    const vehicle = vehicles.find(v => String(v.id) === String(req.params.id));
    if (!vehicle) {
      return res.status(404).json({ detail: 'Vehicle not found' });
    }
    const { make, model, category, price, quantity } = req.body || {};
    if (make !== undefined) vehicle.make = make;
    if (model !== undefined) vehicle.model = model;
    if (category !== undefined) vehicle.category = category;
    if (price !== undefined) vehicle.price = Number(price);
    if (quantity !== undefined) vehicle.quantity = Number(quantity);
    return res.json(vehicle);
  });

  app.delete('/api/vehicles/:id', (req, res) => {
    const idx = vehicles.findIndex(v => String(v.id) === String(req.params.id));
    if (idx === -1) {
      return res.status(404).json({ detail: 'Vehicle not found' });
    }
    vehicles.splice(idx, 1);
    return res.status(204).send();
  });

  app.post('/api/vehicles/:id/restock', (req, res) => {
    const vehicle = vehicles.find(v => String(v.id) === String(req.params.id));
    if (!vehicle) {
      return res.status(404).json({ detail: 'Vehicle not found' });
    }
    const amount = Number(req.body?.amount) || 1;
    vehicle.quantity = (vehicle.quantity || 0) + amount;
    return res.json(vehicle);
  });

  app.post('/api/vehicles/:id/purchase', (req, res) => {
    const vehicle = vehicles.find(v => String(v.id) === String(req.params.id));
    if (!vehicle) {
      return res.status(404).json({ detail: 'Vehicle not found' });
    }
    const qty = Number(req.query.quantity) || 1;
    if (vehicle.quantity < qty) {
      return res.status(400).json({ detail: 'Insufficient vehicle inventory stock' });
    }
    vehicle.quantity -= qty;
    return res.json(vehicle);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
