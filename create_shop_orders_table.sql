-- Create shop_orders table for storing shop order information
CREATE TABLE IF NOT EXISTS shop_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    items JSONB NOT NULL, -- Store items as JSON array
    total_amount DECIMAL(10,2) NOT NULL, -- Amount in cedis
    discount_code TEXT,
    discount_data JSONB, -- Store discount information as JSON
    reference TEXT UNIQUE NOT NULL, -- Paystack reference
    order_id TEXT NOT NULL, -- Custom order ID
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on reference for faster lookups
CREATE INDEX IF NOT EXISTS idx_shop_orders_reference ON shop_orders(reference);

-- Create index on order_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_shop_orders_order_id ON shop_orders(order_id);

-- Create index on customer_email for customer queries
CREATE INDEX IF NOT EXISTS idx_shop_orders_customer_email ON shop_orders(customer_email);

-- Add comment to table
COMMENT ON TABLE shop_orders IS 'Stores shop order information including customer details, items, and payment status';

-- Add comments to columns
COMMENT ON COLUMN shop_orders.items IS 'JSON array of ordered items with product_id, quantity, price, name, and images';
COMMENT ON COLUMN shop_orders.discount_data IS 'JSON object containing discount_percentage, discount_amount, and usage_count';
COMMENT ON COLUMN shop_orders.reference IS 'Paystack payment reference number';
COMMENT ON COLUMN shop_orders.order_id IS 'Custom order identifier (e.g., SHOP-1234567890)';
