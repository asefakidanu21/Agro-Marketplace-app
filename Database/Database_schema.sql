

-- 1. USERS
CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL
        CHECK (role IN ('farmer', 'buyer', 'admin')),
    profile_image TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATEGORIES
CREATE TABLE categories (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id)
        ON DELETE SET NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. PRODUCTS
CREATE TABLE products (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    farmer_id INTEGER NOT NULL REFERENCES users(id)
        ON DELETE RESTRICT,
    category_id INTEGER REFERENCES categories(id)
        ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    unit VARCHAR(30) NOT NULL,
    quantity NUMERIC(12, 2) NOT NULL CHECK (quantity >= 0),
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'available'
        CHECK (status IN ('available', 'unavailable')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ADDRESSES
CREATE TABLE addresses (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id)
        ON DELETE CASCADE,
    region VARCHAR(100),
    city VARCHAR(100),
    sub_city VARCHAR(100),
    woreda VARCHAR(100),
    kebele VARCHAR(100),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. CARTS
CREATE TABLE carts (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    buyer_id INTEGER NOT NULL UNIQUE REFERENCES users(id)
        ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. CART ITEMS
CREATE TABLE cart_items (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES carts(id)
        ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id)
        ON DELETE RESTRICT,
    quantity NUMERIC(12, 2) NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (cart_id, product_id)
);

-- 7. ORDERS
-- One order belongs to one farmer.
CREATE TABLE orders (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    buyer_id INTEGER NOT NULL REFERENCES users(id)
        ON DELETE RESTRICT,
    farmer_id INTEGER NOT NULL REFERENCES users(id)
        ON DELETE RESTRICT,
    address_id INTEGER REFERENCES addresses(id)
        ON DELETE SET NULL,
    total_amount NUMERIC(12, 2) NOT NULL
        CHECK (total_amount >= 0),
    fulfillment_method VARCHAR(20) NOT NULL
        CHECK (fulfillment_method IN ('pickup', 'delivery')),
    status VARCHAR(30) DEFAULT 'pending'
        CHECK (status IN (
            'pending',
            'accepted',
            'rejected',
            'processing',
            'ready_for_delivery',
            'completed',
            'cancelled'
        )),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. ORDER ITEMS
CREATE TABLE order_items (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id)
        ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id)
        ON DELETE SET NULL,
    product_name VARCHAR(150) NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL
        CHECK (unit_price >= 0),
    quantity NUMERIC(12, 2) NOT NULL
        CHECK (quantity > 0),
    subtotal NUMERIC(12, 2) NOT NULL
        CHECK (subtotal >= 0)
);

-- 9. PAYMENTS
CREATE TABLE payments (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id)
        ON DELETE RESTRICT,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(30) NOT NULL
        CHECK (payment_method IN (
            'cash_on_delivery',
            'cash_on_pickup',
            'telebirr',
            'cbe_birr',
            'bank_transfer'
        )),
    payment_status VARCHAR(20) DEFAULT 'pending'
        CHECK (payment_status IN (
            'pending',
            'paid',
            'failed',
            'refunded'
        )),
    transaction_reference VARCHAR(150) UNIQUE,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. FAVORITES
CREATE TABLE favorites (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    buyer_id INTEGER NOT NULL REFERENCES users(id)
        ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id)
        ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (buyer_id, product_id)
);

-- 11. NOTIFICATIONS
CREATE TABLE notifications (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id)
        ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    related_order_id INTEGER REFERENCES orders(id)
        ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


