<?php
// Create placeholder images for the website

$images = [
    // Hero images
    ['name' => 'hero-1.jpg', 'width' => 1920, 'height' => 600, 'text' => 'Premium Beauty Products', 'bg' => [212, 165, 116]],
    ['name' => 'hero-2.jpg', 'width' => 1920, 'height' => 600, 'text' => 'New Year Sale', 'bg' => [232, 180, 163]],
    
    // Product placeholder
    ['name' => 'products/default.jpg', 'width' => 400, 'height' => 400, 'text' => 'Product Image', 'bg' => [248, 249, 250]],
    
    // Payment method icons
    ['name' => 'cod.png', 'width' => 80, 'height' => 40, 'text' => 'COD', 'bg' => [255, 255, 255]],
    ['name' => 'jazzcash.png', 'width' => 80, 'height' => 40, 'text' => 'JazzCash', 'bg' => [255, 255, 255]],
    ['name' => 'easypaisa.png', 'width' => 80, 'height' => 40, 'text' => 'EasyPaisa', 'bg' => [255, 255, 255]],
    ['name' => 'bank-transfer.png', 'width' => 80, 'height' => 40, 'text' => 'Bank', 'bg' => [255, 255, 255]],
    
    // Courier logos
    ['name' => 'tcs.png', 'width' => 80, 'height' => 40, 'text' => 'TCS', 'bg' => [255, 255, 255]],
    ['name' => 'leopard.png', 'width' => 80, 'height' => 40, 'text' => 'Leopard', 'bg' => [255, 255, 255]],
    ['name' => 'pkdex.png', 'width' => 80, 'height' => 40, 'text' => 'PKDex', 'bg' => [255, 255, 255]],
];

foreach ($images as $img) {
    $image = imagecreatetruecolor($img['width'], $img['height']);
    
    // Set background color
    $bgColor = imagecolorallocate($image, $img['bg'][0], $img['bg'][1], $img['bg'][2]);
    imagefill($image, 0, 0, $bgColor);
    
    // Add text
    $textColor = imagecolorallocate($image, 100, 100, 100);
    $font = 5; // Built-in font
    
    // Calculate text position
    $textWidth = imagefontwidth($font) * strlen($img['text']);
    $textHeight = imagefontheight($font);
    $x = ($img['width'] - $textWidth) / 2;
    $y = ($img['height'] - $textHeight) / 2;
    
    // Draw text
    imagestring($image, $font, $x, $y, $img['text'], $textColor);
    
    // Add border for smaller images
    if ($img['width'] <= 100) {
        $borderColor = imagecolorallocate($image, 200, 200, 200);
        imagerectangle($image, 0, 0, $img['width'] - 1, $img['height'] - 1, $borderColor);
    }
    
    // Save image
    $path = __DIR__ . '/assets/images/' . $img['name'];
    $dir = dirname($path);
    if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
    }
    
    if (strpos($img['name'], '.jpg') !== false) {
        imagejpeg($image, $path, 90);
    } else {
        imagepng($image, $path);
    }
    
    imagedestroy($image);
    echo "Created: " . $img['name'] . "<br>";
}

echo "<br>All placeholder images created successfully!";
?>