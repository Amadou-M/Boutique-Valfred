<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'vendor/autoload.php';

header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['name'], $data['email'], $data['phone'], $data['service'], $data['date'], $data['time'])) {
        throw new Exception('Données incomplètes');
    }

    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email invalide');
    }

    $pdo = new PDO('mysql:host=localhost;dbname=boutique_africaine', 'username', 'password');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $pdo->prepare('INSERT INTO bookings (name, email, phone, service, date, time, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())');
    $stmt->execute([$data['name'], $data['email'], $data['phone'], $data['service'], $data['date'], $data['time']]);

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.example.com'; // Replace with your SMTP host
    $mail->SMTPAuth = true;
    $mail->Username = 'your_smtp_username'; // Replace
    $mail->Password = 'your_smtp_password'; // Replace
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Admin email
    $mail->setFrom('no-reply@boutique-africaine.be', 'Institut de Beauté Valfred');
    $mail->addAddress('info@boutique-africaine.be');
    $mail->addReplyTo($data['email'], $data['name']);
    $mail->Subject = 'Nouvelle réservation';
    $mail->Body = "Nouvelle réservation reçue:\n\n" .
                  "Nom: {$data['name']}\n" .
                  "Email: {$data['email']}\n" .
                  "Téléphone: {$data['phone']}\n" .
                  "Service: {$data['service']}\n" .
                  "Date: {$data['date']}\n" .
                  "Heure: {$data['time']}";
    $mail->send();

    // Customer email
    $mail->clearAddresses();
    $mail->addAddress($data['email'], $data['name']);
    $mail->Subject = 'Confirmation de votre réservation';
    $mail->Body = "Cher(e) {$data['name']},\n\n" .
                  "Merci pour votre réservation chez Institut de Beauté Valfred.\n\n" .
                  "Détails de votre réservation:\n" .
                  "Service: {$data['service']}\n" .
                  "Date: {$data['date']}\n" .
                  "Heure: {$data['time']}\n\n" .
                  "Nous vous contacterons pour confirmer. Pour toute question, contactez-nous à info@boutique-africaine.be ou au +32 2 123 45 67.\n\n" .
                  "Cordialement,\nL'équipe Institut de Beauté Valfred";
    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Réservation confirmée']);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>