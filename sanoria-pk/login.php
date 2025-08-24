<?php
require_once 'includes/config.php';

// If already logged in, redirect
if(isLoggedIn()) {
    header('Location: account.php');
    exit();
}

$error = '';
$success = '';

if($_SERVER['REQUEST_METHOD'] == 'POST') {
    if(isset($_POST['login'])) {
        // Login process
        $email = sanitize($_POST['email']);
        $password = $_POST['password'];
        
        $stmt = $pdo->prepare("SELECT id, full_name, password, is_admin, is_verified FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if($user && verifyPassword($password, $user['password'])) {
            if(!$user['is_verified']) {
                $error = 'Please verify your email first';
            } else {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['full_name'];
                $_SESSION['is_admin'] = $user['is_admin'];
                
                // Redirect to intended page or account
                $redirect = $_SESSION['redirect_after_login'] ?? 'account.php';
                unset($_SESSION['redirect_after_login']);
                header('Location: ' . $redirect);
                exit();
            }
        } else {
            $error = 'Invalid email or password';
        }
    } elseif(isset($_POST['register'])) {
        // Registration process
        $fullName = sanitize($_POST['full_name']);
        $email = sanitize($_POST['email']);
        $password = $_POST['password'];
        $confirmPassword = $_POST['confirm_password'];
        $phone = sanitize($_POST['phone']);
        
        // Validation
        if(strlen($password) < 8) {
            $error = 'Password must be at least 8 characters';
        } elseif($password !== $confirmPassword) {
            $error = 'Passwords do not match';
        } else {
            // Check if email exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if($stmt->fetch()) {
                $error = 'Email already registered';
            } else {
                // Create account
                $hashedPassword = hashPassword($password);
                $verificationCode = generateVerificationCode();
                
                $stmt = $pdo->prepare("INSERT INTO users (full_name, email, password, phone, verification_code) VALUES (?, ?, ?, ?, ?)");
                if($stmt->execute([$fullName, $email, $hashedPassword, $phone, $verificationCode])) {
                    // Send verification email (simplified for demo)
                    $success = 'Account created successfully! Please check your email for verification.';
                    
                    // For demo purposes, auto-verify
                    $stmt = $pdo->prepare("UPDATE users SET is_verified = 1 WHERE email = ?");
                    $stmt->execute([$email]);
                } else {
                    $error = 'Error creating account';
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login / Register - Sanoria.pk</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        .auth-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            display: flex;
            align-items: center;
            padding: 40px 0;
        }
        
        .auth-container {
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
            max-width: 900px;
            margin: 0 auto;
        }
        
        .auth-sidebar {
            background: linear-gradient(135deg, var(--primary-color) 0%, #c19660 100%);
            padding: 60px 40px;
            color: #ffffff;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .auth-sidebar h3 {
            color: #ffffff;
            font-size: 32px;
            margin-bottom: 20px;
        }
        
        .auth-sidebar p {
            font-size: 16px;
            opacity: 0.9;
            line-height: 1.8;
        }
        
        .auth-sidebar .features {
            margin-top: 40px;
        }
        
        .auth-sidebar .features li {
            list-style: none;
            padding: 10px 0;
            font-size: 14px;
        }
        
        .auth-sidebar .features li i {
            margin-right: 10px;
            color: #ffffff;
        }
        
        .auth-forms {
            padding: 60px 40px;
        }
        
        .nav-tabs {
            border-bottom: none;
            margin-bottom: 30px;
        }
        
        .nav-tabs .nav-link {
            border: none;
            background: none;
            color: var(--text-light);
            font-weight: 500;
            padding: 10px 20px;
            margin-right: 10px;
            border-radius: 50px;
            transition: all 0.3s ease;
        }
        
        .nav-tabs .nav-link.active {
            background-color: var(--primary-color);
            color: #ffffff;
        }
        
        .form-floating label {
            color: var(--text-light);
        }
        
        .form-control {
            border-radius: 10px;
            border: 2px solid #e0e0e0;
            padding: 12px 15px;
            height: auto;
        }
        
        .form-control:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(212, 165, 116, 0.25);
        }
        
        .btn-auth {
            background-color: var(--primary-color);
            border: none;
            border-radius: 50px;
            padding: 12px 40px;
            font-weight: 600;
            width: 100%;
            transition: all 0.3s ease;
        }
        
        .btn-auth:hover {
            background-color: #c19660;
            transform: translateY(-2px);
        }
        
        .divider {
            text-align: center;
            margin: 30px 0;
            position: relative;
        }
        
        .divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background-color: #e0e0e0;
        }
        
        .divider span {
            background-color: #ffffff;
            padding: 0 20px;
            position: relative;
            color: var(--text-light);
            font-size: 14px;
        }
        
        .social-login {
            display: flex;
            gap: 10px;
        }
        
        .social-login .btn {
            flex: 1;
            border-radius: 10px;
            padding: 10px;
            border: 2px solid #e0e0e0;
            background: #ffffff;
            color: var(--text-dark);
            transition: all 0.3s ease;
        }
        
        .social-login .btn:hover {
            border-color: var(--primary-color);
            background-color: var(--bg-light);
        }
    </style>
</head>
<body>
    <div class="auth-page">
        <div class="container">
            <div class="auth-container">
                <div class="row g-0">
                    <div class="col-md-5">
                        <div class="auth-sidebar">
                            <h3>Welcome to Sanoria.pk</h3>
                            <p>Your trusted destination for premium beauty and skincare products</p>
                            <ul class="features">
                                <li><i class="fas fa-check-circle"></i> Authentic Products</li>
                                <li><i class="fas fa-check-circle"></i> Fast Delivery</li>
                                <li><i class="fas fa-check-circle"></i> Easy Returns</li>
                                <li><i class="fas fa-check-circle"></i> Secure Payments</li>
                                <li><i class="fas fa-check-circle"></i> Free Gifts with Orders</li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="auth-forms">
                            <div class="text-center mb-4">
                                <img src="assets/images/logo.png" alt="Sanoria.pk" style="height: 60px;">
                            </div>
                            
                            <?php if($error): ?>
                                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i class="fas fa-exclamation-circle"></i> <?php echo $error; ?>
                                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                                </div>
                            <?php endif; ?>
                            
                            <?php if($success): ?>
                                <div class="alert alert-success alert-dismissible fade show" role="alert">
                                    <i class="fas fa-check-circle"></i> <?php echo $success; ?>
                                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                                </div>
                            <?php endif; ?>
                            
                            <!-- Nav tabs -->
                            <ul class="nav nav-tabs" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" data-bs-toggle="tab" href="#login">Login</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-bs-toggle="tab" href="#register">Register</a>
                                </li>
                            </ul>
                            
                            <!-- Tab panes -->
                            <div class="tab-content">
                                <!-- Login Tab -->
                                <div id="login" class="tab-pane active">
                                    <form method="POST" action="">
                                        <input type="hidden" name="login" value="1">
                                        
                                        <div class="form-floating mb-3">
                                            <input type="email" class="form-control" id="loginEmail" name="email" placeholder="Email" required>
                                            <label for="loginEmail">Email Address</label>
                                        </div>
                                        
                                        <div class="form-floating mb-3">
                                            <input type="password" class="form-control" id="loginPassword" name="password" placeholder="Password" required>
                                            <label for="loginPassword">Password</label>
                                        </div>
                                        
                                        <div class="d-flex justify-content-between mb-3">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="remember">
                                                <label class="form-check-label" for="remember">
                                                    Remember me
                                                </label>
                                            </div>
                                            <a href="forgot-password.php" class="text-decoration-none">Forgot Password?</a>
                                        </div>
                                        
                                        <button type="submit" class="btn btn-primary btn-auth">
                                            <i class="fas fa-sign-in-alt"></i> Login
                                        </button>
                                    </form>
                                    
                                    <div class="divider">
                                        <span>Or login with</span>
                                    </div>
                                    
                                    <div class="social-login">
                                        <button class="btn">
                                            <i class="fab fa-google"></i> Google
                                        </button>
                                        <button class="btn">
                                            <i class="fab fa-facebook-f"></i> Facebook
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- Register Tab -->
                                <div id="register" class="tab-pane fade">
                                    <form method="POST" action="">
                                        <input type="hidden" name="register" value="1">
                                        
                                        <div class="form-floating mb-3">
                                            <input type="text" class="form-control" id="fullName" name="full_name" placeholder="Full Name" required>
                                            <label for="fullName">Full Name</label>
                                        </div>
                                        
                                        <div class="form-floating mb-3">
                                            <input type="email" class="form-control" id="regEmail" name="email" placeholder="Email" required>
                                            <label for="regEmail">Email Address</label>
                                        </div>
                                        
                                        <div class="form-floating mb-3">
                                            <input type="tel" class="form-control" id="phone" name="phone" placeholder="Phone" required>
                                            <label for="phone">Phone Number</label>
                                        </div>
                                        
                                        <div class="form-floating mb-3">
                                            <input type="password" class="form-control" id="regPassword" name="password" placeholder="Password" required>
                                            <label for="regPassword">Password</label>
                                        </div>
                                        
                                        <div class="form-floating mb-3">
                                            <input type="password" class="form-control" id="confirmPassword" name="confirm_password" placeholder="Confirm Password" required>
                                            <label for="confirmPassword">Confirm Password</label>
                                        </div>
                                        
                                        <div class="form-check mb-3">
                                            <input class="form-check-input" type="checkbox" id="terms" required>
                                            <label class="form-check-label" for="terms">
                                                I agree to the <a href="terms.php">Terms & Conditions</a>
                                            </label>
                                        </div>
                                        
                                        <button type="submit" class="btn btn-primary btn-auth">
                                            <i class="fas fa-user-plus"></i> Create Account
                                        </button>
                                    </form>
                                </div>
                            </div>
                            
                            <div class="text-center mt-4">
                                <a href="index.php" class="text-decoration-none">
                                    <i class="fas fa-arrow-left"></i> Back to Home
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>