<?php
session_start();
require_once '../includes/config.php';

header('Content-Type: application/json');

// Check if user is logged in
if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Please login to continue']);
    exit();
}

$userId = $_SESSION['user_id'];
$action = $_REQUEST['action'] ?? '';

switch($action) {
    case 'add':
        $productId = intval($_POST['product_id']);
        $quantity = intval($_POST['quantity']) ?: 1;
        
        // Check if product exists
        $stmt = $pdo->prepare("SELECT id, stock_quantity FROM products WHERE id = ? AND status = 'active'");
        $stmt->execute([$productId]);
        $product = $stmt->fetch();
        
        if (!$product) {
            echo json_encode(['success' => false, 'message' => 'Product not found']);
            exit();
        }
        
        if ($product['stock_quantity'] < $quantity) {
            echo json_encode(['success' => false, 'message' => 'Insufficient stock']);
            exit();
        }
        
        // Check if already in cart
        $stmt = $pdo->prepare("SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?");
        $stmt->execute([$userId, $productId]);
        $cartItem = $stmt->fetch();
        
        if ($cartItem) {
            // Update quantity
            $newQuantity = $cartItem['quantity'] + $quantity;
            $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
            $stmt->execute([$newQuantity, $cartItem['id']]);
        } else {
            // Add to cart
            $stmt = $pdo->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
            $stmt->execute([$userId, $productId, $quantity]);
        }
        
        echo json_encode(['success' => true, 'message' => 'Added to cart']);
        break;
        
    case 'update':
        $productId = intval($_POST['product_id']);
        $quantity = intval($_POST['quantity']);
        
        if ($quantity <= 0) {
            // Remove from cart
            $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?");
            $stmt->execute([$userId, $productId]);
        } else {
            // Update quantity
            $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?");
            $stmt->execute([$quantity, $userId, $productId]);
        }
        
        echo json_encode(['success' => true]);
        break;
        
    case 'remove':
        $productId = intval($_POST['product_id']);
        
        $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?");
        $stmt->execute([$userId, $productId]);
        
        echo json_encode(['success' => true]);
        break;
        
    case 'count':
        $count = getCartCount();
        echo json_encode(['success' => true, 'count' => $count]);
        break;
        
    case 'get':
        $stmt = $pdo->prepare("
            SELECT c.*, p.name, p.price, p.sale_price, pi.image_url 
            FROM cart c
            JOIN products p ON c.product_id = p.id
            LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
            WHERE c.user_id = ?
        ");
        $stmt->execute([$userId]);
        $items = $stmt->fetchAll();
        
        $total = 0;
        foreach($items as &$item) {
            $price = $item['sale_price'] ?: $item['price'];
            $item['subtotal'] = $price * $item['quantity'];
            $total += $item['subtotal'];
        }
        
        echo json_encode([
            'success' => true,
            'items' => $items,
            'total' => $total
        ]);
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>