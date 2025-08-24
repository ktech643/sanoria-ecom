<?php
// Create a stylish logo for Sanoria.pk using PHP GD library

// Create image
$width = 300;
$height = 100;
$image = imagecreatetruecolor($width, $height);

// Enable transparency
imagesavealpha($image, true);
$transparent = imagecolorallocatealpha($image, 0, 0, 0, 127);
imagefill($image, 0, 0, $transparent);

// Define colors
$primaryColor = imagecolorallocate($image, 212, 165, 116); // Gold/Bronze
$darkColor = imagecolorallocate($image, 44, 62, 80); // Dark Blue-Grey
$white = imagecolorallocate($image, 255, 255, 255);

// Create gradient effect
for ($i = 0; $i < $height; $i++) {
    $alpha = 127 - (127 * ($i / $height));
    $gradientColor = imagecolorallocatealpha($image, 212, 165, 116, $alpha);
    imagefilledrectangle($image, 0, $i, $width, $i + 1, $gradientColor);
}

// Add brand name with elegant font
$fontPath = __DIR__ . '/assets/fonts/Playfair-Display-Bold.ttf';
$fontSize = 32;
$text = 'Sanoria';

// If font doesn't exist, use built-in font
if (!file_exists($fontPath)) {
    // Draw text using built-in font
    $font = 5;
    $textWidth = imagefontwidth($font) * strlen($text);
    $textHeight = imagefontheight($font);
    $x = ($width - $textWidth) / 2;
    $y = ($height - $textHeight) / 2 - 10;
    imagestring($image, $font, $x, $y, $text, $darkColor);
    
    // Add .pk
    $subtext = '.pk';
    $subtextWidth = imagefontwidth(3) * strlen($subtext);
    $subX = $x + $textWidth + 5;
    $subY = $y + 10;
    imagestring($image, 3, $subX, $subY, $subtext, $primaryColor);
} else {
    // Use TrueType font
    $bbox = imagettfbbox($fontSize, 0, $fontPath, $text);
    $textWidth = $bbox[2] - $bbox[0];
    $x = ($width - $textWidth) / 2;
    $y = 60;
    imagettftext($image, $fontSize, 0, $x, $y, $darkColor, $fontPath, $text);
    
    // Add .pk
    imagettftext($image, 20, 0, $x + $textWidth + 5, $y, $primaryColor, $fontPath, '.pk');
}

// Add decorative element
imagesetthickness($image, 3);
imageline($image, 50, $height - 20, $width - 50, $height - 20, $primaryColor);

// Add small circles as design elements
imagefilledellipse($image, 40, $height/2, 8, 8, $primaryColor);
imagefilledellipse($image, $width - 40, $height/2, 8, 8, $primaryColor);

// Save the image
$logoPath = __DIR__ . '/assets/images/logo.png';
imagepng($image, $logoPath);
imagedestroy($image);

// Also create a favicon
$favicon = imagecreatetruecolor(32, 32);
imagesavealpha($favicon, true);
$transparent = imagecolorallocatealpha($favicon, 0, 0, 0, 127);
imagefill($favicon, 0, 0, $transparent);

// Draw S for favicon
$primaryColorFav = imagecolorallocate($favicon, 212, 165, 116);
$darkColorFav = imagecolorallocate($favicon, 44, 62, 80);

// Create circle background
imagefilledellipse($favicon, 16, 16, 30, 30, $primaryColorFav);
imagefilledellipse($favicon, 16, 16, 26, 26, $white);

// Add S
if (!file_exists($fontPath)) {
    imagestring($favicon, 5, 11, 8, 'S', $darkColorFav);
} else {
    imagettftext($favicon, 20, 0, 8, 24, $darkColorFav, $fontPath, 'S');
}

// Save favicon
$faviconPath = __DIR__ . '/assets/images/favicon.png';
imagepng($favicon, $faviconPath);
imagedestroy($favicon);

echo "Logo and favicon created successfully!<br>";
echo "Logo saved at: " . $logoPath . "<br>";
echo "Favicon saved at: " . $faviconPath;
?>