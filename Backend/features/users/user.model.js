
import sql from "../../config/database.js";

// Fields safe to return to API clients
const publicUserFields = sql`
  id,
  full_name,
  email,
  phone,
  role,
  profile_image,
  is_active,
  created_at,
  updated_at
`;

// Find user by ID
export const findUserById = async (id) => {
  const [user] = await sql`
    SELECT ${publicUserFields}
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `;

  return user;
};

// Find user by email
// Internal use by Auth feature
export const findUserByEmail = async (email) => {
  const [user] = await sql`
    SELECT *
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;

  return user;
};

// Get all users
export const findAllUsers = async (limit, offset) => {
  return await sql`
    SELECT ${publicUserFields}
    FROM users
    ORDER BY created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;
};

// Create user
// Internal use by Auth feature
export const createUser = async (userData) => {
  const {
    full_name,
    email,
    phone,
    password_hash,
    role,
  } = userData;

  const [user] = await sql`
    INSERT INTO users (
      full_name,
      email,
      phone,
      password_hash,
      role
    )
    VALUES (
      ${full_name},
      ${email},
      ${phone},
      ${password_hash},
      ${role}
    )
    RETURNING ${publicUserFields}
  `;

  return user;
};

// Update user profile
export const updateUser = async (id, userData) => {
  const {
    full_name,
    phone,
    profile_image,
  } = userData;

  const [user] = await sql`
    UPDATE users
    SET
      full_name = ${full_name},
      phone = ${phone},
      profile_image = ${profile_image},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING ${publicUserFields}
  `;

  return user;
};

// Activate or deactivate user
export const updateUserStatus = async (id, is_active) => {
  const [user] = await sql`
    UPDATE users
    SET
      is_active = ${is_active},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING ${publicUserFields}
  `;

  return user;
};
