<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Database config
$servername = "db";
$username = "root";
$password = "verysecurepassword";
$dbname = "agency_contact";

// Helper function for consistent JSON responses
function respond($success, $message = "") {
    echo json_encode(["success" => $success, "message" => $message]);
    exit;
}

// Connect to database
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    respond(false, "Erreur de connexion à la base de données.");
}

// Allow only POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, "Méthode invalide.");
}

// Sanitize and validate inputs
$required_fields = ['civilite', 'nom', 'prenom', 'email', 'telephone', 'message', 'type_message', 'disponibilites'];
foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        respond(false, "Le champ '$field' est requis.");
    }
}

$civilite = htmlspecialchars(trim($_POST['civilite']));
$nom = htmlspecialchars(trim($_POST['nom']));
$prenom = htmlspecialchars(trim($_POST['prenom']));
$email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
$telephone = htmlspecialchars(trim($_POST['telephone']));
$message = htmlspecialchars(trim($_POST['message']));
$type_message = htmlspecialchars(trim($_POST['type_message']));
$disponibilites = trim($_POST['disponibilites']);

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, "Format d'email invalide.");
}

//  Real email existence check using Mailboxlayer
$access_key = "4e932832cefcbb9be78ffa7dfb8271bc"; 
$verifyUrl = "https://apilayer.net/api/check?access_key=$access_key&email=$email&smtp=1&format=1";

// Make API request
$verifyResponse = @file_get_contents($verifyUrl);
if (!$verifyResponse) {
    respond(false, "Impossible de vérifier l'adresse e-mail pour le moment.");
}

$verifyResult = json_decode($verifyResponse, true);

if (!$verifyResult['smtp_check']) {
    respond(false, "L'adresse e-mail semble invalide ou injoignable.");
}

// Check if email already exists
$checkEmail = $conn->prepare("SELECT id FROM contacts WHERE email = ?");
$checkEmail->bind_param("s", $email);
$checkEmail->execute();
$checkEmail->store_result();

if ($checkEmail->num_rows > 0) {
    respond(false, "Cet email est déjà utilisé.");
}

// Insert into database
$stmt = $conn->prepare("INSERT INTO contacts (civilite, nom, prenom, email, telephone, message, type_message, disponibilites) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssssss", $civilite, $nom, $prenom, $email, $telephone, $message, $type_message, $disponibilites);

if ($stmt->execute()) {
    respond(true, "Contact enregistré avec succès.");
} else {
    respond(false, "Erreur d'insertion: " . $stmt->error);
}
?>
