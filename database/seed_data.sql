-- =============================================
-- Sanoria.pk Database Seed Data
-- =============================================

USE sanoria_pk;

-- =============================================
-- ADMIN USERS
-- =============================================

-- Insert initial admin user (password: 11223344)
INSERT INTO admin_users (username, email, password_hash, role, permissions, is_active) VALUES
('admin', 'abcd@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', 
'{"products": {"create": true, "read": true, "update": true, "delete": true}, "orders": {"create": true, "read": true, "update": true, "delete": true}, "users": {"create": true, "read": true, "update": true, "delete": true}, "settings": {"create": true, "read": true, "update": true, "delete": true}}', 
true);

-- =============================================
-- SITE SETTINGS
-- =============================================

INSERT INTO site_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', 'Sanoria.pk', 'text', 'Website name', true),
('site_tagline', 'Premium Beauty & Skincare', 'text', 'Website tagline', true),
('contact_email', 'info@sanoria.pk', 'text', 'Contact email address', true),
('contact_phone', '+92 300 1234567', 'text', 'Contact phone number', true),
('free_shipping_threshold', '2000', 'number', 'Minimum order amount for free shipping', true),
('currency', 'PKR', 'text', 'Default currency', true),
('tax_rate', '0', 'number', 'Default tax rate percentage', false),
('return_policy_days', '14', 'number', 'Return policy duration in days', true),
('min_order_amount', '500', 'number', 'Minimum order amount', true),
('company_address', 'Karachi, Pakistan', 'text', 'Company address', true),
('social_facebook', 'https://facebook.com/sanoria.pk', 'text', 'Facebook page URL', true),
('social_instagram', 'https://instagram.com/sanoria.pk', 'text', 'Instagram page URL', true),
('social_youtube', 'https://youtube.com/sanoria.pk', 'text', 'YouTube channel URL', true),
('social_tiktok', 'https://tiktok.com/@sanoria.pk', 'text', 'TikTok page URL', true);

-- =============================================
-- PAYMENT GATEWAYS
-- =============================================

INSERT INTO payment_gateways (name, gateway_key, display_name, description, configuration, is_active, sort_order) VALUES
('Cash on Delivery', 'cod', 'Cash on Delivery', 'Pay when you receive your order', '{"fee": 0, "description": "Pay cash when your order is delivered to your doorstep"}', true, 1),
('JazzCash', 'jazzcash', 'JazzCash', 'Pay using JazzCash mobile wallet', '{"merchant_id": "", "password": "", "salt": "", "test_mode": true}', true, 2),
('EasyPaisa', 'easypaisa', 'EasyPaisa', 'Pay using EasyPaisa mobile wallet', '{"store_id": "", "merchant_id": "", "test_mode": true}', true, 3),
('Bank Transfer', 'bank_transfer', 'Bank Transfer', 'Transfer money directly to our bank account', '{"account_details": "Bank: HBL\nAccount: 1234567890\nIBAN: PK12HABB1234567890123456"}', true, 4);

-- =============================================
-- CATEGORIES
-- =============================================

INSERT INTO categories (name, slug, description, image, sort_order, is_active, meta_title, meta_description) VALUES
('Skincare', 'skincare', 'Complete range of skincare products for all skin types', 'images/categories/skincare.jpg', 1, true, 'Skincare Products - Sanoria.pk', 'Discover premium skincare products including cleansers, moisturizers, serums and treatments for all skin types.'),
('Makeup', 'makeup', 'Premium makeup products and cosmetics', 'images/categories/makeup.jpg', 2, true, 'Makeup & Cosmetics - Sanoria.pk', 'Explore our collection of high-quality makeup products including foundation, lipstick, eyeshadow and more.'),
('Hair Care', 'hair-care', 'Hair care products for healthy and beautiful hair', 'images/categories/haircare.jpg', 3, true, 'Hair Care Products - Sanoria.pk', 'Professional hair care products including shampoos, conditioners, treatments and styling products.'),
('Fragrance', 'fragrance', 'Luxury fragrances and perfumes', 'images/categories/fragrance.jpg', 4, true, 'Fragrances & Perfumes - Sanoria.pk', 'Discover our exclusive collection of luxury fragrances and perfumes for men and women.'),
('Beauty Tools', 'beauty-tools', 'Professional beauty tools and accessories', 'images/categories/beauty-tools.jpg', 5, true, 'Beauty Tools & Accessories - Sanoria.pk', 'Professional beauty tools including brushes, sponges, and skincare devices.');

-- Subcategories for Skincare
INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) VALUES
('Cleansers', 'cleansers', 'Face cleansers and cleansing products', 1, 1, true),
('Moisturizers', 'moisturizers', 'Face and body moisturizers', 1, 2, true),
('Serums', 'serums', 'Face serums and treatments', 1, 3, true),
('Sunscreen', 'sunscreen', 'Sun protection products', 1, 4, true),
('Masks', 'masks', 'Face masks and treatments', 1, 5, true),
('Toners', 'toners', 'Face toners and essences', 1, 6, true),
('Eye Care', 'eye-care', 'Eye creams and treatments', 1, 7, true),
('Lip Care', 'lip-care', 'Lip balms and treatments', 1, 8, true);

-- =============================================
-- BRANDS
-- =============================================

INSERT INTO brands (name, slug, description, logo, website, is_active) VALUES
('Ordinary', 'ordinary', 'Science-backed skincare with clinical formulations', 'images/brands/ordinary.png', 'https://theordinary.com', true),
('CeraVe', 'cerave', 'Dermatologist developed skincare with ceramides', 'images/brands/cerave.png', 'https://cerave.com', true),
('Neutrogena', 'neutrogena', 'Trusted skincare brand recommended by dermatologists', 'images/brands/neutrogena.png', 'https://neutrogena.com', true),
('L\'Oreal', 'loreal', 'Leading beauty brand with innovative formulations', 'images/brands/loreal.png', 'https://loreal.com', true),
('Maybelline', 'maybelline', 'Bold makeup for confident women', 'images/brands/maybelline.png', 'https://maybelline.com', true),
('NYX Professional', 'nyx-professional', 'Professional makeup for makeup artists', 'images/brands/nyx.png', 'https://nyxcosmetics.com', true),
('Revlon', 'revlon', 'Classic beauty brand with timeless products', 'images/brands/revlon.png', 'https://revlon.com', true),
('Garnier', 'garnier', 'Natural beauty solutions for hair and skin', 'images/brands/garnier.png', 'https://garnier.com', true);

-- =============================================
-- PRODUCTS
-- =============================================

-- Skincare Products
INSERT INTO products (name, slug, description, short_description, sku, brand_id, category_id, price, sale_price, stock_quantity, skin_types, ingredients, how_to_use, benefits, is_featured, is_new_arrival, is_best_seller, meta_title, meta_description) VALUES

('Hydrating Facial Serum', 'hydrating-facial-serum', 'A powerful hydrating serum that deeply moisturizes and plumps the skin with hyaluronic acid and vitamin E. This lightweight formula absorbs quickly and provides long-lasting hydration for all skin types.', 'Deeply hydrating serum with hyaluronic acid for plump, moisturized skin.', 'HFS-001', 1, 9, 1299.00, 999.00, 50, '["dry", "combination", "normal", "sensitive"]', 'Hyaluronic Acid, Vitamin E, Glycerin, Panthenol, Allantoin', 'Apply 2-3 drops to clean face morning and evening. Gently pat until absorbed. Follow with moisturizer.', 'Intense hydration, plumper skin, reduced fine lines, improved skin texture', true, true, true, 'Hydrating Facial Serum with Hyaluronic Acid - Sanoria.pk', 'Deeply hydrating facial serum with hyaluronic acid. Perfect for dry and dehydrated skin. Shop now at Sanoria.pk'),

('Vitamin C Brightening Serum', 'vitamin-c-brightening-serum', 'A potent vitamin C serum that brightens skin tone, reduces dark spots, and provides antioxidant protection. Formulated with 20% vitamin C and vitamin E for maximum effectiveness.', 'Brightening serum with 20% Vitamin C for radiant, even-toned skin.', 'VCS-002', 1, 9, 1599.00, 1299.00, 35, '["oily", "combination", "normal"]', 'L-Ascorbic Acid 20%, Vitamin E, Ferulic Acid, Hyaluronic Acid', 'Use in the morning after cleansing. Apply 3-4 drops and gently massage. Always follow with sunscreen.', 'Brightens skin tone, reduces dark spots, antioxidant protection, improves skin texture', true, true, false, 'Vitamin C Brightening Serum 20% - Sanoria.pk', 'Powerful 20% Vitamin C serum for brighter, more radiant skin. Reduces dark spots and provides antioxidant protection.'),

('Gentle Foaming Cleanser', 'gentle-foaming-cleanser', 'A mild, sulfate-free foaming cleanser that effectively removes makeup, dirt, and impurities without stripping the skin. Enriched with ceramides and niacinamide for healthy skin barrier.', 'Gentle sulfate-free cleanser that removes impurities while maintaining skin barrier.', 'GFC-003', 2, 6, 899.00, 749.00, 75, '["dry", "sensitive", "normal"]', 'Ceramides, Niacinamide, Glycerin, Cocamidopropyl Betaine', 'Wet face with lukewarm water. Apply small amount to hands, lather and massage gently. Rinse thoroughly.', 'Deep cleansing, maintains skin barrier, reduces irritation, suitable for sensitive skin', false, false, true, 'Gentle Foaming Cleanser with Ceramides - Sanoria.pk', 'Sulfate-free gentle cleanser with ceramides. Perfect for sensitive and dry skin types.'),

('Anti-Aging Night Cream', 'anti-aging-night-cream', 'A rich, nourishing night cream formulated with retinol, peptides, and hyaluronic acid to reduce signs of aging while you sleep. Promotes skin renewal and improves firmness.', 'Rich night cream with retinol and peptides for anti-aging benefits.', 'ANC-004', 3, 7, 1899.00, 1599.00, 40, '["dry", "combination", "normal"]', 'Retinol, Peptides, Hyaluronic Acid, Shea Butter, Vitamin E', 'Apply to clean face and neck every evening. Start with 2-3 times per week, gradually increase usage.', 'Reduces fine lines, improves skin firmness, promotes cell renewal, deeply moisturizing', true, false, true, 'Anti-Aging Night Cream with Retinol - Sanoria.pk', 'Powerful anti-aging night cream with retinol and peptides. Reduces fine lines and improves skin firmness.'),

('SPF 50 Sunscreen', 'spf-50-sunscreen', 'Broad-spectrum SPF 50 sunscreen that provides superior protection against UVA and UVB rays. Lightweight, non-greasy formula that absorbs quickly and doesn\'t leave white cast.', 'Broad-spectrum SPF 50 protection with lightweight, non-greasy formula.', 'SUN-005', 3, 10, 1199.00, 999.00, 60, '["oily", "combination", "normal", "sensitive"]', 'Zinc Oxide, Titanium Dioxide, Octyl Methoxycinnamate, Vitamin E', 'Apply generously 15 minutes before sun exposure. Reapply every 2 hours or after swimming/sweating.', 'Superior sun protection, prevents premature aging, lightweight feel, no white cast', false, true, false, 'SPF 50 Broad Spectrum Sunscreen - Sanoria.pk', 'Lightweight SPF 50 sunscreen with broad spectrum protection. No white cast, perfect for daily use.'),

('Niacinamide 10% Serum', 'niacinamide-10-serum', 'A high-concentration niacinamide serum that regulates oil production, minimizes pores, and improves skin texture. Perfect for oily and acne-prone skin types.', 'High-concentration niacinamide serum for oil control and pore minimization.', 'NIA-006', 1, 9, 1099.00, 899.00, 45, '["oily", "combination"]', 'Niacinamide 10%, Zinc PCA, Hyaluronic Acid, Tamarindus Indica Seed Gum', 'Apply 4-5 drops to clean face twice daily. Can be mixed with other serums or moisturizers.', 'Controls oil production, minimizes pores, improves skin texture, reduces blemishes', true, false, true, 'Niacinamide 10% Serum for Oil Control - Sanoria.pk', '10% niacinamide serum perfect for oily skin. Controls oil production and minimizes the appearance of pores.');

-- Makeup Products
INSERT INTO products (name, slug, description, short_description, sku, brand_id, category_id, price, sale_price, stock_quantity, is_featured, is_new_arrival, meta_title, meta_description) VALUES

('Matte Liquid Lipstick', 'matte-liquid-lipstick', 'Long-wearing matte liquid lipstick that provides intense color payoff and all-day comfort. Dries down to a transfer-proof finish that won\'t crack or flake.', 'Long-wearing matte liquid lipstick with intense color and comfort.', 'MLL-007', 5, 2, 799.00, 699.00, 80, false, true, 'Matte Liquid Lipstick - Long Wearing - Sanoria.pk', 'Long-wearing matte liquid lipstick with intense color. Transfer-proof formula that lasts all day.'),

('HD Foundation', 'hd-foundation', 'Full-coverage HD foundation that provides a flawless, airbrushed finish. Available in multiple shades to match every skin tone. Buildable coverage that lasts up to 16 hours.', 'Full-coverage HD foundation with 16-hour wear and flawless finish.', 'HDF-008', 4, 2, 1499.00, 1299.00, 25, true, false, 'HD Foundation - Full Coverage - Sanoria.pk', 'Full-coverage HD foundation with 16-hour wear. Available in multiple shades for every skin tone.'),

('Eyeshadow Palette', 'eyeshadow-palette', 'Professional eyeshadow palette with 12 highly pigmented shades in matte and shimmer finishes. Perfect for creating versatile looks from natural to dramatic.', '12-shade eyeshadow palette with matte and shimmer finishes.', 'ESP-009', 6, 2, 1899.00, 1599.00, 30, true, true, 'Professional Eyeshadow Palette - 12 Shades - Sanoria.pk', 'Professional 12-shade eyeshadow palette with highly pigmented matte and shimmer shades.');

-- Hair Care Products
INSERT INTO products (name, slug, description, short_description, sku, brand_id, category_id, price, sale_price, stock_quantity, is_featured, meta_title, meta_description) VALUES

('Argan Oil Hair Mask', 'argan-oil-hair-mask', 'Intensive hair mask enriched with pure argan oil and keratin to deeply nourish and repair damaged hair. Leaves hair soft, shiny, and manageable.', 'Intensive hair mask with argan oil for deep nourishment and repair.', 'AHM-010', 8, 3, 1299.00, 1099.00, 40, false, 'Argan Oil Hair Mask - Deep Repair - Sanoria.pk', 'Intensive argan oil hair mask for damaged hair. Deep nourishment and repair for soft, shiny hair.'),

('Keratin Shampoo', 'keratin-shampoo', 'Sulfate-free keratin shampoo that gently cleanses while strengthening and smoothing hair. Ideal for frizzy, damaged, or chemically treated hair.', 'Sulfate-free keratin shampoo for smooth, strong hair.', 'KS-011', 8, 3, 899.00, 749.00, 55, false, 'Keratin Shampoo - Sulfate Free - Sanoria.pk', 'Sulfate-free keratin shampoo that strengthens and smooths hair. Perfect for frizzy and damaged hair.');

-- =============================================
-- PRODUCT IMAGES
-- =============================================

INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
(1, 'images/products/hydrating-serum-1.jpg', 'Hydrating Facial Serum - Front View', 1, true),
(1, 'images/products/hydrating-serum-2.jpg', 'Hydrating Facial Serum - Ingredients', 2, false),
(1, 'images/products/hydrating-serum-3.jpg', 'Hydrating Facial Serum - In Use', 3, false),

(2, 'images/products/vitamin-c-serum-1.jpg', 'Vitamin C Brightening Serum - Front View', 1, true),
(2, 'images/products/vitamin-c-serum-2.jpg', 'Vitamin C Brightening Serum - Texture', 2, false),

(3, 'images/products/gentle-cleanser-1.jpg', 'Gentle Foaming Cleanser - Front View', 1, true),
(3, 'images/products/gentle-cleanser-2.jpg', 'Gentle Foaming Cleanser - Foam Texture', 2, false),

(4, 'images/products/night-cream-1.jpg', 'Anti-Aging Night Cream - Front View', 1, true),
(4, 'images/products/night-cream-2.jpg', 'Anti-Aging Night Cream - Texture', 2, false),

(5, 'images/products/sunscreen-1.jpg', 'SPF 50 Sunscreen - Front View', 1, true),
(5, 'images/products/sunscreen-2.jpg', 'SPF 50 Sunscreen - Application', 2, false),

(6, 'images/products/niacinamide-1.jpg', 'Niacinamide 10% Serum - Front View', 1, true),
(6, 'images/products/niacinamide-2.jpg', 'Niacinamide 10% Serum - Dropper', 2, false),

(7, 'images/products/lipstick-1.jpg', 'Matte Liquid Lipstick - Product Shot', 1, true),
(7, 'images/products/lipstick-2.jpg', 'Matte Liquid Lipstick - Color Swatch', 2, false),

(8, 'images/products/foundation-1.jpg', 'HD Foundation - Product Shot', 1, true),
(8, 'images/products/foundation-2.jpg', 'HD Foundation - Shade Range', 2, false),

(9, 'images/products/eyeshadow-1.jpg', 'Eyeshadow Palette - Closed', 1, true),
(9, 'images/products/eyeshadow-2.jpg', 'Eyeshadow Palette - Open View', 2, false),

(10, 'images/products/hair-mask-1.jpg', 'Argan Oil Hair Mask - Front View', 1, true),
(11, 'images/products/shampoo-1.jpg', 'Keratin Shampoo - Front View', 1, true);

-- =============================================
-- BLOG CATEGORIES
-- =============================================

INSERT INTO blog_categories (name, slug, description, is_active) VALUES
('Skincare Tips', 'skincare-tips', 'Expert advice and tips for healthy skin', true),
('Makeup Tutorials', 'makeup-tutorials', 'Step-by-step makeup tutorials and techniques', true),
('Product Reviews', 'product-reviews', 'Honest reviews of beauty products', true),
('Beauty Trends', 'beauty-trends', 'Latest trends in beauty and fashion', true),
('Hair Care', 'hair-care-blog', 'Hair care tips and styling advice', true);

-- =============================================
-- BLOG POSTS
-- =============================================

INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, category_id, author_id, status, is_featured, published_at) VALUES

('Winter Skincare Routine for Glowing Skin', 'winter-skincare-routine-glowing-skin', 'Discover the essential steps to maintain healthy, hydrated skin during the harsh winter months with our expert-recommended routine.', 
'<p>Winter can be particularly harsh on your skin, with cold temperatures, low humidity, and indoor heating all contributing to dryness, irritation, and dullness. But with the right skincare routine, you can maintain healthy, glowing skin all season long.</p>

<h3>Morning Routine</h3>
<p>Start your day with a gentle cleanser that won\'t strip your skin\'s natural oils. Follow with a hydrating serum containing hyaluronic acid, then apply a rich moisturizer to lock in hydration. Don\'t forget SPF – UV rays are present year-round!</p>

<h3>Evening Routine</h3>
<p>In the evening, use a nourishing cleanser to remove makeup and impurities. Apply a treatment serum with ingredients like vitamin C or retinol (alternating nights), followed by a deeply moisturizing night cream.</p>

<h3>Weekly Treatments</h3>
<p>Incorporate a hydrating face mask 1-2 times per week to give your skin an extra boost of moisture. Gentle exfoliation once a week can help remove dead skin cells and improve product absorption.</p>

<h3>Pro Tips</h3>
<ul>
<li>Use a humidifier in your bedroom to add moisture to the air</li>
<li>Drink plenty of water to hydrate from within</li>
<li>Avoid hot showers which can further dry out your skin</li>
<li>Apply body moisturizer immediately after showering</li>
</ul>', 
'images/blog/winter-skincare.jpg', 1, 1, 'published', true, '2024-12-15 10:00:00'),

('Top 5 Makeup Trends for 2024', 'top-5-makeup-trends-2024', 'Stay ahead of the beauty curve with these must-try makeup trends that are dominating 2024.', 
'<p>2024 is all about bold expression and natural beauty. Here are the top makeup trends you need to know about this year.</p>

<h3>1. Glass Skin Effect</h3>
<p>The glass skin trend continues to dominate, focusing on achieving a dewy, luminous complexion that looks like porcelain. Use a hydrating primer, lightweight foundation, and cream highlighter for this look.</p>

<h3>2. Bold Colored Eyeliner</h3>
<p>Say goodbye to basic black liner! Bright blues, emerald greens, and electric purples are taking center stage. Use these vibrant colors to create graphic lines or subtle pops of color.</p>

<h3>3. Glossy Lids</h3>
<p>Shimmery, glossy eyeshadows are making a comeback. Apply a clear or tinted gloss over your eyeshadow for an ultra-modern, editorial look.</p>

<h3>4. Natural Brows</h3>
<p>Overly sculpted brows are out. The focus is on enhancing your natural brow shape with light brushing and minimal product for a soft, feathery appearance.</p>

<h3>5. Monochromatic Makeup</h3>
<p>Using the same color family across eyes, cheeks, and lips creates a cohesive, sophisticated look. Try soft pinks, warm terracottas, or muted berries.</p>', 
'images/blog/makeup-trends-2024.jpg', 2, 1, 'published', true, '2024-12-10 14:30:00'),

('How to Choose Products for Your Skin Type', 'how-to-choose-products-skin-type', 'Learn how to identify your skin type and select the perfect products for your unique needs.', 
'<p>Understanding your skin type is the foundation of any effective skincare routine. Here\'s how to identify your skin type and choose the right products.</p>

<h3>Identifying Your Skin Type</h3>

<h4>Dry Skin</h4>
<p>Signs: Tight feeling, flakiness, fine lines, dull appearance</p>
<p>Choose: Rich moisturizers with ceramides, hyaluronic acid serums, gentle cream cleansers</p>

<h4>Oily Skin</h4>
<p>Signs: Shine throughout the day, enlarged pores, frequent breakouts</p>
<p>Choose: Gel or foam cleansers, niacinamide serums, lightweight moisturizers, salicylic acid treatments</p>

<h4>Combination Skin</h4>
<p>Signs: Oily T-zone, normal to dry cheeks</p>
<p>Choose: Multi-step routine with different products for different areas, gentle cleansers, lightweight moisturizers</p>

<h4>Sensitive Skin</h4>
<p>Signs: Redness, irritation, burning or stinging with products</p>
<p>Choose: Fragrance-free products, gentle ingredients like aloe vera, avoid harsh actives</p>

<h3>Building Your Routine</h3>
<p>Start with the basics: cleanser, moisturizer, and SPF. Gradually add targeted treatments based on your specific concerns.</p>', 
'images/blog/skin-type-guide.jpg', 1, 1, 'published', false, '2024-12-05 09:15:00');

-- =============================================
-- COUPONS
-- =============================================

INSERT INTO coupons (code, name, description, type, value, minimum_amount, usage_limit, valid_from, valid_until, is_active) VALUES
('WELCOME20', 'Welcome Discount', 'Get 20% off on your first order', 'percentage', 20.00, 1000.00, 100, '2024-01-01 00:00:00', '2024-12-31 23:59:59', true),
('FREESHIP', 'Free Shipping', 'Free shipping on all orders', 'free_shipping', 0.00, 1500.00, 500, '2024-01-01 00:00:00', '2024-12-31 23:59:59', true),
('SKINCARE15', 'Skincare Special', '15% off on all skincare products', 'percentage', 15.00, 800.00, 200, '2024-01-01 00:00:00', '2024-12-31 23:59:59', true),
('SAVE500', 'Save 500', 'Get Rs. 500 off on orders over Rs. 3000', 'fixed_amount', 500.00, 3000.00, 150, '2024-01-01 00:00:00', '2024-12-31 23:59:59', true);

-- =============================================
-- SAMPLE REVIEWS
-- =============================================

INSERT INTO product_reviews (product_id, user_id, rating, title, review_text, is_verified_purchase, is_approved, helpful_votes) VALUES
(1, NULL, 5, 'Amazing hydration!', 'This serum has transformed my dry skin. I noticed a difference after just one week of use. Highly recommend!', false, true, 15),
(1, NULL, 4, 'Good product', 'Nice texture and absorbs well. Good value for money.', false, true, 8),
(2, NULL, 5, 'Brightened my skin tone', 'Love this vitamin C serum! My skin looks brighter and more even after a month of use.', false, true, 22),
(3, NULL, 4, 'Gentle and effective', 'Perfect for my sensitive skin. Removes makeup without irritation.', false, true, 12),
(4, NULL, 5, 'Best night cream ever!', 'I\'ve been using this for 3 months and my fine lines have visibly reduced. Will repurchase!', false, true, 18);

-- =============================================
-- SAMPLE NOTIFICATIONS
-- =============================================

INSERT INTO notifications (user_id, type, title, message, data) VALUES
(NULL, 'promotion', 'Welcome Offer!', 'Get 20% off on your first order with code WELCOME20', '{"code": "WELCOME20", "discount": 20}'),
(NULL, 'system', 'Free Shipping Alert', 'Enjoy free shipping on orders over Rs. 2000', '{"threshold": 2000}'),
(NULL, 'product', 'New Arrivals', 'Check out our latest skincare collection with premium ingredients', '{"category": "skincare"}'),
(NULL, 'blog', 'New Blog Post', 'Read our latest article: Winter Skincare Routine for Glowing Skin', '{"post_id": 1}');

-- =============================================
-- UPDATE INITIAL STOCK MOVEMENTS
-- =============================================

-- Add initial stock for products (simulating initial inventory)
INSERT INTO stock_movements (product_id, movement_type, quantity, reference_type, notes, created_by) VALUES
(1, 'in', 50, 'purchase', 'Initial stock - Hydrating Facial Serum', 1),
(2, 'in', 35, 'purchase', 'Initial stock - Vitamin C Brightening Serum', 1),
(3, 'in', 75, 'purchase', 'Initial stock - Gentle Foaming Cleanser', 1),
(4, 'in', 40, 'purchase', 'Initial stock - Anti-Aging Night Cream', 1),
(5, 'in', 60, 'purchase', 'Initial stock - SPF 50 Sunscreen', 1),
(6, 'in', 45, 'purchase', 'Initial stock - Niacinamide 10% Serum', 1),
(7, 'in', 80, 'purchase', 'Initial stock - Matte Liquid Lipstick', 1),
(8, 'in', 25, 'purchase', 'Initial stock - HD Foundation', 1),
(9, 'in', 30, 'purchase', 'Initial stock - Eyeshadow Palette', 1),
(10, 'in', 40, 'purchase', 'Initial stock - Argan Oil Hair Mask', 1),
(11, 'in', 55, 'purchase', 'Initial stock - Keratin Shampoo', 1);