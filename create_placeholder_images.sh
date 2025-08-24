#!/bin/bash

# Create placeholder images for Sanoria.pk
# This script creates simple SVG placeholders for development

# Main logo
cat > images/logo.png << 'EOF'
<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
  <circle cx="25" cy="25" r="20" fill="#d4af37"/>
  <text x="25" y="30" text-anchor="middle" fill="white" font-family="serif" font-size="18" font-weight="bold">S</text>
</svg>
EOF

# White logo for footer
cat > images/logo-white.png << 'EOF'
<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
  <circle cx="25" cy="25" r="20" fill="white"/>
  <text x="25" y="30" text-anchor="middle" fill="#d4af37" font-family="serif" font-size="18" font-weight="bold">S</text>
</svg>
EOF

# Product placeholders
for i in {1..11}; do
cat > "images/products/product-${i}.jpg" << EOF
<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="#f8f9fa"/>
  <rect x="50" y="100" width="200" height="150" fill="#d4af37" opacity="0.3"/>
  <text x="150" y="180" text-anchor="middle" fill="#2c3e50" font-family="Arial" font-size="16">Product ${i}</text>
</svg>
EOF
done

# Category placeholders
categories=("skincare" "makeup" "haircare" "fragrance" "beauty-tools")
for cat in "${categories[@]}"; do
cat > "images/categories/${cat}.jpg" << EOF
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#667eea"/>
  <rect x="50" y="100" width="300" height="100" fill="white" opacity="0.9"/>
  <text x="200" y="160" text-anchor="middle" fill="#2c3e50" font-family="Arial" font-size="18" font-weight="bold">${cat^}</text>
</svg>
EOF
done

# Hero images
cat > images/hero-1.jpg << 'EOF'
<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#grad1)"/>
  <text x="600" y="400" text-anchor="middle" fill="white" font-family="Arial" font-size="48" font-weight="bold">Beauty Hero</text>
</svg>
EOF

cat > images/hero-product.png << 'EOF'
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="transparent"/>
  <circle cx="200" cy="200" r="150" fill="#d4af37" opacity="0.2"/>
  <rect x="150" y="100" width="100" height="200" fill="#d4af37" rx="10"/>
  <text x="200" y="210" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">Serum</text>
</svg>
EOF

# QR Code placeholder
cat > images/qr-code.png << 'EOF'
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="white"/>
  <rect x="20" y="20" width="160" height="160" fill="black"/>
  <rect x="30" y="30" width="140" height="140" fill="white"/>
  <text x="100" y="110" text-anchor="middle" fill="black" font-family="Arial" font-size="12">QR CODE</text>
</svg>
EOF

# Payment method icons
cat > images/jazzcash.png << 'EOF'
<svg width="60" height="30" xmlns="http://www.w3.org/2000/svg">
  <rect width="60" height="30" fill="#ff6b35" rx="5"/>
  <text x="30" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="8" font-weight="bold">JazzCash</text>
</svg>
EOF

cat > images/easypaisa.png << 'EOF'
<svg width="60" height="30" xmlns="http://www.w3.org/2000/svg">
  <rect width="60" height="30" fill="#00a651" rx="5"/>
  <text x="30" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="8" font-weight="bold">EasyPaisa</text>
</svg>
EOF

cat > images/cod.png << 'EOF'
<svg width="60" height="30" xmlns="http://www.w3.org/2000/svg">
  <rect width="60" height="30" fill="#2c3e50" rx="5"/>
  <text x="30" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="8" font-weight="bold">COD</text>
</svg>
EOF

# Blog images
for i in {1..3}; do
cat > "images/blog/blog-${i}.jpg" << EOF
<svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="250" fill="#f8f9fa"/>
  <rect x="50" y="75" width="300" height="100" fill="#d4af37" opacity="0.3"/>
  <text x="200" y="130" text-anchor="middle" fill="#2c3e50" font-family="Arial" font-size="16">Blog Post ${i}</text>
</svg>
EOF
done

# Skin type images
skin_types=("dry-skin" "oily-skin" "combination-skin" "sensitive-skin")
for skin in "${skin_types[@]}"; do
cat > "images/${skin}.jpg" << EOF
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="200" fill="#667eea"/>
  <circle cx="150" cy="100" r="60" fill="white" opacity="0.8"/>
  <text x="150" y="110" text-anchor="middle" fill="#2c3e50" font-family="Arial" font-size="12" font-weight="bold">${skin^}</text>
</svg>
EOF
done

echo "Placeholder images created successfully!"
EOF

chmod +x create_placeholder_images.sh