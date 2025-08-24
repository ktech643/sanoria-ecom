<?php
// ==========================================================================
//   Sanoria.pk Products API
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
        handleGetProducts();
        break;
    case 'POST':
        handleCreateProduct();
        break;
    case 'PUT':
        handleUpdateProduct();
        break;
    case 'DELETE':
        handleDeleteProduct();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function handleGetProducts() {
    global $database;
    
    $category = $_GET['category'] ?? null;
    $featured = $_GET['featured'] ?? null;
    $skin_type = $_GET['skin_type'] ?? null;
    $search = $_GET['search'] ?? null;
    $limit = $_GET['limit'] ?? 20;
    $offset = $_GET['offset'] ?? 0;
    
    $sql = "SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.status = 'active'";
    $params = [];
    
    if ($category) {
        $sql .= " AND c.slug = ?";
        $params[] = $category;
    }
    
    if ($featured) {
        $sql .= " AND p.featured = 1";
    }
    
    if ($skin_type && $skin_type !== 'all') {
        $sql .= " AND (p.skin_type = ? OR p.skin_type = 'all')";
        $params[] = $skin_type;
    }
    
    if ($search) {
        $sql .= " AND (p.name LIKE ? OR p.description LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    
    $sql .= " ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
    $params[] = (int)$limit;
    $params[] = (int)$offset;
    
    $products = $database->fetchAll($sql, $params);
    
    // Get total count
    $countSql = str_replace('SELECT p.*, c.name as category_name', 'SELECT COUNT(*)', $sql);
    $countSql = str_replace(' ORDER BY p.created_at DESC LIMIT ? OFFSET ?', '', $countSql);
    array_pop($params); // Remove offset
    array_pop($params); // Remove limit
    $total = $database->fetch($countSql, $params)['COUNT(*)'];
    
    echo json_encode([
        'products' => $products,
        'total' => $total,
        'limit' => $limit,
        'offset' => $offset
    ]);
}

function handleCreateProduct() {
    global $database, $input;
    
    // Validate required fields
    $required = ['name', 'category_id', 'price', 'stock_quantity'];
    foreach ($required as $field) {
        if (!isset($input[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Field '$field' is required"]);
            return;
        }
    }
    
    $slug = generateSlug($input['name']);
    
    $sql = "INSERT INTO products (
        name, slug, description, short_description, category_id, sku,
        price, sale_price, stock_quantity, image, featured, skin_type,
        ingredients, usage_instructions, meta_title, meta_description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $params = [
        $input['name'],
        $slug,
        $input['description'] ?? '',
        $input['short_description'] ?? '',
        $input['category_id'],
        $input['sku'] ?? generateSKU(),
        $input['price'],
        $input['sale_price'] ?? null,
        $input['stock_quantity'],
        $input['image'] ?? 'images/placeholder.jpg',
        $input['featured'] ?? 0,
        $input['skin_type'] ?? 'all',
        $input['ingredients'] ?? '',
        $input['usage_instructions'] ?? '',
        $input['meta_title'] ?? $input['name'],
        $input['meta_description'] ?? $input['description'] ?? ''
    ];
    
    try {
        $database->query($sql, $params);
        $productId = $database->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'Product created successfully',
            'product_id' => $productId
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create product: ' . $e->getMessage()]);
    }
}

function handleUpdateProduct() {
    global $database, $input;
    
    $productId = $_GET['id'] ?? null;
    if (!$productId) {
        http_response_code(400);
        echo json_encode(['error' => 'Product ID is required']);
        return;
    }
    
    // Build update query dynamically
    $fields = [];
    $params = [];
    
    $allowedFields = [
        'name', 'description', 'short_description', 'category_id', 'sku',
        'price', 'sale_price', 'stock_quantity', 'image', 'featured',
        'skin_type', 'ingredients', 'usage_instructions', 'status'
    ];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $fields[] = "$field = ?";
            $params[] = $input[$field];
        }
    }
    
    if (empty($fields)) {
        http_response_code(400);
        echo json_encode(['error' => 'No fields to update']);
        return;
    }
    
    $sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = ?";
    $params[] = $productId;
    
    try {
        $database->query($sql, $params);
        echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update product: ' . $e->getMessage()]);
    }
}

function handleDeleteProduct() {
    global $database;
    
    $productId = $_GET['id'] ?? null;
    if (!$productId) {
        http_response_code(400);
        echo json_encode(['error' => 'Product ID is required']);
        return;
    }
    
    try {
        $database->query("DELETE FROM products WHERE id = ?", [$productId]);
        echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete product: ' . $e->getMessage()]);
    }
}

function generateSlug($name) {
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
    return $slug;
}

function generateSKU() {
    return 'SP' . date('Ymd') . rand(1000, 9999);
}
?>