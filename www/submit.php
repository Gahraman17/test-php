<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$servername = "db";
$username = "root";
$password = "verysecurepassword";
$dbname = "agency_contact";

// Connect DB
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Erreur de connexion à la base de données."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $civilite = $_POST['civilite'];
    $nom = $_POST['nom'];
    $prenom = $_POST['prenom'];
    $email = $_POST['email'];
    $telephone = $_POST['telephone'];
    $message = $_POST['message'];
    $type_message = $_POST['type_message'];
    $disponibilites = $_POST['disponibilites']; // Keep as JSON string

    // Check email duplicate
    $checkEmail = $conn->prepare("SELECT id FROM contacts WHERE email = ?");
    $checkEmail->bind_param("s", $email);
    $checkEmail->execute();
    $checkEmail->store_result();
    if ($checkEmail->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Cet email est déjà utilisé."]);
        exit;
    }

    // Insert contact with disponibilites as JSON
    $stmt = $conn->prepare("INSERT INTO contacts (civilite, nom, prenom, email, telephone, message, type_message, disponibilites) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssss", $civilite, $nom, $prenom, $email, $telephone, $message, $type_message, $disponibilites);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Erreur d'insertion: " . $stmt->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Méthode invalide."]);
}
?>