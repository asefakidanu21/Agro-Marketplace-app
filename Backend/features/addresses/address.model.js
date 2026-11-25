
import sql from "../../config/database.js";

// Create address
export const createAddress = async (userId, data) => {
  const [address] = await sql`
    INSERT INTO addresses (
      user_id,
      region,
      city,
      sub_city,
      woreda,
      kebele,
      latitude,
      longitude
    )
    VALUES (
      ${userId},
      ${data.region},
      ${data.city},
      ${data.sub_city},
      ${data.woreda},
      ${data.kebele},
      ${data.latitude},
      ${data.longitude}
    )
    RETURNING *
  `;

  return address;
};

// Get user's addresses
export const findUserAddresses = async (userId) => {
  return await sql`
    SELECT *
    FROM addresses
    WHERE user_id = ${userId}
    ORDER BY is_default DESC, created_at DESC
  `;
};

// Get one address belonging to a user
export const findAddressById = async (id, userId) => {
  const [address] = await sql`
    SELECT *
    FROM addresses
    WHERE id = ${id} AND user_id = ${userId}
  `;

  return address;
};

// Update address
export const updateAddress = async (id, userId, data) => {
  const [address] = await sql`
    UPDATE addresses
    SET
      region = ${data.region},
      city = ${data.city},
      sub_city = ${data.sub_city},
      woreda = ${data.woreda},
      kebele = ${data.kebele},
      latitude = ${data.latitude},
      longitude = ${data.longitude}
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING *
  `;

  return address;
};

// Set default address
export const setDefaultAddress = async (id, userId) => {
  return await sql.begin(async (tx) => {
    const [existingAddress] = await tx`
      SELECT id FROM addresses
      WHERE id = ${id} AND user_id = ${userId}
    `;

    if (!existingAddress) return null;

    await tx`
      UPDATE addresses
      SET is_default = false
      WHERE user_id = ${userId}
    `;

    const [address] = await tx`
      UPDATE addresses
      SET is_default = true
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `;

    return address;
  });
};

// Delete address
export const deleteAddress = async (id, userId) => {
  const [address] = await sql`
    DELETE FROM addresses
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING *
  `;

  return address;
};
