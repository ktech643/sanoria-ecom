<?php
// ==========================================================================
//   Sanoria.pk Cart API
// ==========================================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        handleGetCart();
        break;
    case 'POST':
        handleAddToCart();
        break;
    case 'PUT':
        handleUpdateCart();
        break;
    case 'DELETE':
        handleRemoveFromCart();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function handleGetCart() {
    global $database;
    
    $userId = $_GET['user_id'] ?? null;
    $sessionId = $_GET['session_id'] ?? null;
    
    if (!$userId && !$sessionId) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID or Session ID is required']);
        return;
    }
    
    $sql = "SELECT c.*, p.name, p.price, p.sale_price, p.image, p.stock_quantity
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE ";
    
    if ($userId) {
        $sql .= "c.user_id = ?";
        $params = [$userId];
    } else {
        $sql .= "c.session_id = ?";
        $params = [$sessionId];
    }
    
    $cartItems = $database->fetchAll($sql, $params);
    
    $total = 0;
    foreach ($cartItems as &$item) {
        $price = $item['sale_price'] ?? $item['price'];
        $item['item_total'] = $price * $item['quantity'];
        $total += $item['item_total'];
    }
    
    echo json_encode([
        'items' => $cartItems,
        'total' => $total,
        'count' => count($cartItems)
    ]);
}

function handleAddToCart() {
    global $database, $input;
    
    $productId = $input['product_id'] ?? null;
    $quantity = $input['quantity'] ?? 1;
    $userId = $input['user_id'] ?? null;
    $sessionId = $input['session_id'] ?? null;
    
    if (!$productId) {
        http_response_code(400);
        echo json_encode(['error' => 'Product ID is required']);
        return;
    }
    
    if (!$userId && !$sessionId) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID or Session ID is required']);
        return;
    }
    
    // Check if product exists and is in stock
    $product = $database->fetch("SELECT stock_quantity FROM products WHERE id = ? AND status = 'active'", [$productId]);
    if (!$product) {
        http_response_code(404);
        echo json_encode(['error' => 'Product not found']);
        return;
    }
    
    if ($product['stock_quantity'] < $quantity) {
        http_response_code(400);
        echo json_encode(['error' => 'Insufficient stock']);
        return;
    }
    
    // Check if item already exists in cart
    $whereClause = $userId ? "user_id = ? AND product_id = ?" : "session_id = ? AND product_id = ?";
    $params = [$userId ?? $sessionId, $productId];
    
    $existingItem = $database->fetch("SELECT * FROM cart WHERE $whereClause", $params);
    
    if ($existingItem) {
        // Update quantity
        $newQuantity = $existingItem['quantity'] + $quantity;
        if ($product['stock_quantity'] < $newQuantity) {
            http_response_code(400);
            echo json_encode(['error' => 'Insufficient stock for requested quantity']);
            return;
        }
        
        $database->query("UPDATE cart SET quantity = ? WHERE id = ?", [$newQuantity, $existingItem['id']]);
    } else {
        // Add new item
        $sql = "INSERT INTO cart (user_id, session_id, product_id, quantity) VALUES (?, ?, ?, ?)";
        $database->query($sql, [$userId, $sessionId, $productId, $quantity]);
    }
    
    echo json_encode(['success' => true, 'message' => 'Item added to cart']);
}

function handleUpdateCart() {
    global $database, $input;
    
    $cartId = $input['cart_id'] ?? null;
    $quantity = $input['quantity'] ?? null;
    
    if (!$cartId || !$quantity) {
        http_response_code(400);
        echo json_encode(['error' => 'Cart ID and quantity are required']);
        return;
    }
    
    // Get cart item and check stock
    $cartItem = $database->fetch("SELECT * FROM cart WHERE id = ?", [$cartId]);
    if (!$cartItem) {
        http_response_code(404);
        echo json_encode(['error' => 'Cart item not found']);
        return;
    }
    
    $product = $database->fetch("SELECT stock_quantity FROM products WHERE id = ?", [$cartItem['product_id']]);
    if ($product['stock_quantity'] < $quantity) {
        http_response_code(400);
        echo json_encode(['error' => 'Insufficient stock']);
        return;
    }
    
    if ($quantity <= 0) {
        $database->query("DELETE FROM cart WHERE id = ?", [$cartId]);
        echo json_encode(['success' => true, 'message' => 'Item removed from cart']);
    } else {
        $database->query("UPDATE cart SET quantity = ? WHERE id = ?", [$quantity, $cartId]);
        echo json_encode(['success' => true, 'message' => 'Cart updated']);
    }
}

function handleRemoveFromCart() {
    global $database;
    
    $cartId = $_GET['cart_id'] ?? null;
    if (!$cartId) {
        http_response_code(400);
        echo json_encode(['error' => 'Cart ID is required']);
        return;
    }
    
    $database->query("DELETE FROM cart WHERE id = ?", [$cartId]);
    echo json_encode(['success' => true, 'message' => 'Item removed from cart']);
}
?>