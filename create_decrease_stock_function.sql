-- Create function to decrease product stock quantity
CREATE OR REPLACE FUNCTION decrease_stock(product_id UUID, quantity INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    current_stock INTEGER;
    new_stock INTEGER;
BEGIN
    -- Get current stock quantity
    SELECT stock_quantity INTO current_stock
    FROM products
    WHERE id = product_id;
    
    -- Check if product exists
    IF current_stock IS NULL THEN
        RAISE EXCEPTION 'Product with ID % not found', product_id;
    END IF;
    
    -- Check if enough stock available
    IF current_stock < quantity THEN
        RAISE EXCEPTION 'Insufficient stock for product %. Available: %, Requested: %', 
                       product_id, current_stock, quantity;
    END IF;
    
    -- Calculate new stock quantity
    new_stock := current_stock - quantity;
    
    -- Update stock quantity
    UPDATE products
    SET stock_quantity = new_stock,
        updated_at = NOW()
    WHERE id = product_id;
    
    RETURN new_stock;
END;
$$;

-- Add comment to function
COMMENT ON FUNCTION decrease_stock(UUID, INTEGER) IS 'Decreases product stock quantity by specified amount and returns new stock level';
