<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'vendor/autoload.php';

header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['name'], $data['email'], $data['items'], $data['total'])) {
        throw new Exception('Données incomplètes');
    }

    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email invalide');
    }

    $pdo = new PDO('mysql:host=localhost;dbname=boutique_africaine', 'username', 'password');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $pdo->prepare('INSERT INTO orders (name, email, phone, total, created_at) VALUES (?, ?, ?, ?, NOW())');
    $stmt->execute([$data['name'], $data['email'], $data['phone'] ?? '', $data['total']]);
    $orderId = $pdo->lastInsertId();

    $stmt = $pdo->prepare('INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)');
    foreach ($data['items'] as $item) {
        $stmt->execute([$orderId, $item['id'], $item['name'], $item['price'], $item['quantity']]);
    }

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.example.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'your_smtp_username';
    $mail->Password = 'your_smtp_password';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $itemsList = '';
    foreach ($data['items'] as $item) {
        $itemsList .= "- {$item['name']} (x{$item['quantity']}): " . number_format($item['price'], 2, ',', ' ') . " €\n";
    }

    // Admin email
    $mail->setFrom('no-reply@boutique-africaine.be', 'Institut de Beauté Valfred');
    $mail->addAddress('info@boutique-africaine.be');
    $mail->addReplyTo($data['email'], $data['name']);
    $mail->Subject = 'Nouvelle commande';
    $mail->Body = "Nouvelle commande reçue:\n\n" .
                  "Nom: {$data['name']}\n" .
                  "Email: {$data['email']}\n" .
                  "Téléphone: {$data['phone']}\n" .
                  "Articles:\n{$itemsList}" .
                  "Total: " . number_format($data['total'], 2, ',', ' ') . " €";
    $mail->send();

    // Customer email
    $mail->clearAddresses();
    $mail->addAddress($data['email'], $data['name']);
    $mail->Subject = 'Confirmation de votre commande';
    $mail->Body = "Cher(e) {$data['name']},\n\n" .
                  "Merci pour votre commande chez Institut de Beauté Valfred.\n\n" .
                  "Détails de votre commande:\n{$itemsList}" .
                  "Total: " . number_format($data['total'], 2, ',', ' ') . " €\n\n" .
                  "Nous vous contacterons pour organiser la livraison. Pour toute question, contactez-nous à info@boutique-africaine.be ou au +32 2 123 45 67.\n\n" .
                  "Cordialement,\nL'équipe Institut de Beauté Valfred";
    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Commande confirmée']);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>