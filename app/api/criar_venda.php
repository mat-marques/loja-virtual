<?php
include './configs.php';

header("Access-Control-Allow-Origin: *");

$post_body = file_get_contents('php://input');
$params = json_decode(json_encode($post_body), true);

$endpoint = "https://jueri.com.br/sis/api/v1/$ID/venda";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $params);

$headers = array();
$headers[] = "Authorization: Bearer $TOKEN";
$headers[] = "Content-Type: application/json";
$headers[] = "Accept: application/json";
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$result = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
}
curl_close($ch);

echo json_encode($result);
