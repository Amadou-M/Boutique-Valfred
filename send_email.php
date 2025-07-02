<?php
// Définit le type de contenu de la réponse comme JSON
header('Content-Type: application/json');
// Vérifie si la requête est de type POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupère et nettoie les données du formulaire pour éviter les injections
    $firstName = filter_input(INPUT_POST, 'firstName', FILTER_SANITIZE_STRING); // Prénom
    $lastName = filter_input(INPUT_POST, 'lastName', FILTER_SANITIZE_STRING); // Nom
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL); // Adresse email
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING); // Numéro de téléphone
    $subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING); // Sujet du message
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING); // Contenu du message
    $newsletter = isset($_POST['newsletter']) ? 'Yes' : 'No'; // Vérifie si l'utilisateur veut la newsletter

    // Vérifie que tous les champs obligatoires sont remplis
    if (empty($firstName) || empty($lastName) || empty($email) || empty($subject) || empty($message)) {
        http_response_code(400); // Code d'erreur 400 (Bad Request)
        echo json_encode(['success' => false, 'message' => 'Veuillez remplir tous les champs obligatoires.']);
        exit; // Arrête l'exécution du script
    }

    // Vérifie que l'adresse email est valide
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400); // Code d'erreur 400 (Bad Request)
        echo json_encode(['success' => false, 'message' => 'Adresse email invalide.']);
        exit; // Arrête l'exécution du script
    }

    // Configuration de l'email
    $to = 'info@boutique-africaine.be'; // Adresse email du destinataire (propriétaire de la boutique)
    $from = 'noreply@boutique-africaine.be'; // Adresse email de l'expéditeur (serveur)
    $subjectLine = "Nouveau message: $subject"; // Sujet de l'email
    $headers = "From: $from\r\n"; // En-tête : expéditeur
    $headers .= "Reply-To: $email\r\n"; // En-tête : email de réponse
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n"; // En-tête : type de contenu et encodage

    // Corps de l'email
    $body = "Nouveau message de contact\n\n";
    $body .= "Prénom: $firstName\n";
    $body .= "Nom: $lastName\n";
    $body .= "Email: $email\n";
    $body .= "Téléphone: $phone\n";
    $body .= "Sujet: $subject\n";
    $body .= "Message:\n$message\n";
    $body .= "Inscription à la newsletter: $newsletter\n";

    // Envoi de l'email
    if (mail($to, $subjectLine, $body, $headers)) {
        // Si l'envoi réussit, retourne un message de succès
        echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès !']);
    } else {
        // En cas d'échec, retourne un message d'erreur
        http_response_code(500); // Code d'erreur 500 (Internal Server Error)
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'envoi du message.']);
    }
} else {
    // Si la requête n'est pas POST, retourne une erreur
    http_response_code(405); // Code d'erreur 405 (Method Not Allowed)
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
}
?>