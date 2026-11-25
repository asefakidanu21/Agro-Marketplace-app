
import sql from "../../config/database.js";

// Create category
export const createCategory = async (categoryData) => {
  const { name, description, parent_id, image_url } = categoryData;

  const [category] = await sql`
    INSERT INTO categories (
      name,
      description,
      parent_id,
      image_url
    )
    VALUES (
      ${name},
      ${description},
      ${parent_id},
      ${image_url}
    )
    RETURNING *
  `;

  return category;
};

// Get all categories
export const findAllCategories = async () => {
  return await sql`
    SELECT
      c.*,
      parent.name AS parent_name
    FROM categories c
    LEFT JOIN categories parent
      ON c.parent_id = parent.id
    ORDER BY c.name ASC
  `;
};

// Get category by ID
export const findCategoryById = async (id) => {
  const [category] = await sql`
    SELECT
      c.*,
      parent.name AS parent_name
    FROM categories c
    LEFT JOIN categories parent
      ON c.parent_id = parent.id
    WHERE c.id = ${id}
    LIMIT 1
  `;

  return category;
};

// Find category by name
export const findCategoryByName = async (name) => {
  const [category] = await sql`
    SELECT *
    FROM categories
    WHERE LOWER(name) = LOWER(${name})
    LIMIT 1
  `;

  return category;
};

// Update category
export const updateCategory = async (id, categoryData) => {
  const { name, description, parent_id, image_url } = categoryData;

  const [category] = await sql`
    UPDATE categories
    SET
      name = ${name},
      description = ${description},
      parent_id = ${parent_id},
      image_url = ${image_url}
    WHERE id = ${id}
    RETURNING *
  `;

  return category;
};

// Delete category
export const deleteCategory = async (id) => {
  const [category] = await sql`
    DELETE FROM categories
    WHERE id = ${id}
    RETURNING *
  `;

  return category;
};

// Check whether a category has children
export const findChildCategories = async (id) => {
  return await sql`
    SELECT id, name
    FROM categories
    WHERE parent_id = ${id}
  `;
};

