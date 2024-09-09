<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "cadastros";

// Conexão com o banco de dados
$conn = new mysqli($host, $user, $pass, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// Processa o cadastro
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nomeCompleto = $conn->real_escape_string($_POST['nomeCompleto']);
    $email = $conn->real_escape_string($_POST['email']);
    $cpf = $conn->real_escape_string($_POST['cpf']);
    $senha = password_hash($_POST['senhaCadastro'], PASSWORD_BCRYPT);

    $sql = "INSERT INTO usuarios (nomeCompleto, email, cpf, senha) VALUES ('$nomeCompleto', '$email', '$cpf', '$senha')";

    if ($conn->query($sql) === TRUE) {
        echo "Cadastro realizado com sucesso!";
        // Redirecionar ou exibir mensagem de sucesso
    } else {
        echo "Erro: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>