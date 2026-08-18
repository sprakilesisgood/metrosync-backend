const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// admin has no model file in this layout, so keep the schema next to the auth code that uses it.
const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'admin' },
  },
  { timestamps: true }
);
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

function signToken(admin) {
  return jwt.sign(
    { id: admin._id.toString(), role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

// check the email + password, hand back a token. wrong creds -> 401.
async function login(email, password) {
  const admin = await Admin.findOne({ email: String(email).toLowerCase() });
  if (!admin) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  return { token: signToken(admin), admin: { id: admin._id, email: admin.email, role: admin.role } };
}

module.exports = { Admin, login, signToken };
