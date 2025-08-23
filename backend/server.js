const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes, Op } = require('sequelize');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'Balamanikandanb191';

const sequelize = new Sequelize('store_ratings_db', 'root', 'Bala&2005', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 60], 
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    validate: {
      len: {
        args: [0, 400],
        msg: 'Address must be less than 400 characters',
      },
    },
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Normal User', 'Store Owner'),
    defaultValue: 'Normal User',
  },
});

const Store = sequelize.define('store', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [0, 400],
        msg: 'Address must be less than 400 characters',
      },
    },
  },
  overallRating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

const Rating = sequelize.define('rating', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
});

User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });
Store.hasMany(Rating, { foreignKey: 'storeId' });
Rating.belongsTo(Store, { foreignKey: 'storeId' });
Store.belongsTo(User, { as: 'Owner', foreignKey: 'ownerId' });

sequelize.sync({ force: true })
  .then(() => {
    console.log('Tables synced with database.');
   
    bcrypt.hash('Admin@123', 10).then(hashedPassword => {
      User.create({
        name: 'System Administrator',
        email: 'admin@test.com',
        password: hashedPassword,
        address: 'Admin Address',
        role: 'Admin',
      }).then(() => {
        console.log('Default Admin user created.');
        
        bcrypt.hash('User@123', 10).then(hashedPassword => {
          User.create({
            name: 'Normal User John Doe',
            email: 'user@test.com',
            password: hashedPassword,
            address: 'User Address',
            role: 'Normal User',
          });
        });
        bcrypt.hash('Owner@123', 10).then(hashedPassword => {
          User.create({
            name: 'Store Owner Jane Doe',
            email: 'owner@test.com',
            password: hashedPassword,
            address: 'Owner Address',
            role: 'Store Owner',
          }).then(owner => {
            const stores = [
              { name: 'The Coffee House', email: 'coffee@store.com', address: '123 Main St, Anytown', ownerId: owner.id },
              { name: 'Tech Gadget Hub', email: 'tech@store.com', address: '456 Tech Ave, Techville', ownerId: owner.id },
              { name: 'Pizza Palace', email: 'pizza@store.com', address: '789 Pizza Rd, Foodie City', ownerId: owner.id },
              { name: 'Fashion Fiesta', email: 'fashion@store.com', address: '321 Style Blvd, Fashion Town', ownerId: owner.id },
              { name: 'Grocery Galore', email: 'grocery@store.com', address: '654 Fresh St, Market Hub', ownerId: owner.id },
              { name: 'Auto Repair Shop', email: 'auto@store.com', address: '111 Car Lane, Mechanicsburg', ownerId: owner.id },
              { name: 'Book Nook', email: 'books@store.com', address: '222 Reading Ave, Literaria', ownerId: owner.id },
              { name: 'Fitness First', email: 'gym@store.com', address: '333 Wellness Rd, Fitland', ownerId: owner.id },
              { name: 'Garden Center', email: 'garden@store.com', address: '444 Green St, Bloom County', ownerId: owner.id },
              { name: 'Pet Paradise', email: 'pets@store.com', address: '555 Paw St, Petville', ownerId: owner.id },
              { name: 'Hardware Haven', email: 'hardware@store.com', address: '666 Tool Rd, Fixington', ownerId: owner.id },
              { name: 'Movie Mania', email: 'movies@store.com', address: '777 Film Ave, Hollytown', ownerId: owner.id },
              { name: 'Sushi Spot', email: 'sushi@store.com', address: '888 Sashimi Ln, Eatville', ownerId: owner.id },
              { name: 'Toy Emporium', email: 'toys@store.com', address: '999 Play St, Gameland', ownerId: owner.id },
              { name: 'Health Pharmacy', email: 'pharma@store.com', address: '101 Med Rd, Cureville', ownerId: owner.id },
              { name: 'Home Decor', email: 'decor@store.com', address: '202 Design Ave, Creativille', ownerId: owner.id },
              { name: 'Music Store', email: 'music@store.com', address: '303 Harmony Blvd, Musictown', ownerId: owner.id },
              { name: 'Sports Gear', email: 'sports@store.com', address: '404 Field Rd, Sportsville', ownerId: owner.id },
              { name: 'Jewelry Joy', email: 'jewelry@store.com', address: '505 Bling Ave, Gem City', ownerId: owner.id },
              { name: 'Art Gallery', email: 'art@store.com', address: '606 Canvas St, Artland', ownerId: owner.id },
            ];
            Store.bulkCreate(stores);
          });
        });
      });
    });
  });

app.use(cors());
app.use(bodyParser.json());
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const checkRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: 'Access Denied' });
  }
  next();
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
   
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be 8-16 characters, include one uppercase letter and one special character.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, address });
    res.status(201).json({ message: 'User created successfully.', user: newUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: 'User not found.' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token, role: user.role, userId: user.id });
});

app.get('/api/admin/dashboard', authenticateToken, checkRole('Admin'), async (req, res) => {
  const totalUsers = await User.count();
  const totalStores = await Store.count();
  const totalRatings = await Rating.count();
  res.json({ totalUsers, totalStores, totalRatings });
});

app.post('/api/admin/add-user', authenticateToken, checkRole('Admin'), async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be 8-16 characters, include one uppercase letter and one special character.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, address, role });
    res.status(201).json({ message: 'User added successfully.', user: newUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/admin/users', authenticateToken, checkRole('Admin'), async (req, res) => {
  const { filter, sort } = req.query;
  let where = {};
  let order = [];
  if (filter) {
    where = {
      [Op.or]: [
        { name: { [Op.like]: `%${filter}%` } },
        { email: { [Op.like]: `%${filter}%` } },
        { address: { [Op.like]: `%${filter}%` } },
        { role: { [Op.like]: `%${filter}%` } },
      ],
    };
  }
  if (sort) {
    const [field, direction] = sort.split(':');
    order.push([field, direction.toUpperCase()]);
  }
  const users = await User.findAll({
    where,
    order,
    attributes: ['id', 'name', 'email', 'address', 'role'],
  });
  res.json(users);
});

app.get('/api/admin/stores', authenticateToken, checkRole('Admin'), async (req, res) => {
  const { filter, sort } = req.query;
  let where = {};
  let order = [];
  if (filter) {
    where = {
      [Op.or]: [
        { name: { [Op.like]: `%${filter}%` } },
        { email: { [Op.like]: `%${filter}%` } },
        { address: { [Op.like]: `%${filter}%` } },
      ],
    };
  }
  if (sort) {
    const [field, direction] = sort.split(':');
    order.push([field, direction.toUpperCase()]);
  }
  const stores = await Store.findAll({
    where,
    order,
  });
  res.json(stores);
});

app.post('/api/admin/add-store', authenticateToken, checkRole('Admin'), async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const store = await Store.create({ name, email, address, ownerId: ownerId || null });
    res.status(201).json({ message: 'Store added successfully.', store });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/stores/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const store = await Store.findByPk(id);
  if (!store) {
    return res.status(404).json({ message: 'Store not found.' });
  }
  const ratings = await Rating.findAll({ where: { storeId: id } });
  res.json({ store, ratings });
});

app.get('/api/user/stores', authenticateToken, checkRole('Normal User'), async (req, res) => {
  const { filter, sort } = req.query;
  let where = {};
  let order = [];
  if (filter) {
    where = {
      [Op.or]: [
        { name: { [Op.like]: `%${filter}%` } },
        { address: { [Op.like]: `%${filter}%` } },
      ],
    };
  }
  if (sort) {
    const [field, direction] = sort.split(':');
    order.push([field, direction.toUpperCase()]);
  }
  
  const stores = await Store.findAll({
    where,
    order,
    attributes: ['id', 'name', 'address', 'overallRating'],
    include: [{
      model: Rating,
      where: { userId: req.user.id },
      required: false,
      attributes: ['rating'],
    }],
  });
  res.json(stores);
});

app.post('/api/user/rate-store/:storeId', authenticateToken, checkRole('Normal User'), async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id; 
    const [newRating, created] = await Rating.findOrCreate({
      where: { userId, storeId },
      defaults: { rating },
    });

    if (!created) {
      newRating.rating = rating;
      await newRating.save();
    }

    const allRatings = await Rating.findAll({ where: { storeId } });
    const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allRatings.length;
    await Store.update({ overallRating: averageRating }, { where: { id: storeId } });

    res.json({ message: 'Rating submitted successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/user/update-password', authenticateToken, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: 'Password must be 8-16 characters, include one uppercase letter and one special character.' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.get('/api/store-owner/dashboard', authenticateToken, checkRole('Store Owner'), async (req, res) => {
  const store = await Store.findOne({ where: { ownerId: req.user.id } });
  if (!store) {
    return res.status(404).json({ message: 'Store not found for this owner.' });
  }
  const ratings = await Rating.findAll({
    where: { storeId: store.id },
    include: [{
      model: User,
      attributes: ['name', 'email', 'address'],
    }],
  });
  res.json({ averageRating: store.overallRating, ratings });
});

app.put('/api/store-owner/update-password', authenticateToken, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: 'Password must be 8-16 characters, include one uppercase letter and one special character.' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
