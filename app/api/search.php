<?php
include './configs.php';

header("Access-Control-Allow-Origin: *");

$SEARCH = $_GET["search"];
$PAGE = $_GET["page"];
$PAGE_SIZE = $_GET["per_page"];


$endpoint = "https://jueri.com.br/sis/api/v1/$ID/produto?page=$PAGE&per_page=$PAGE_SIZE";

if ($SEARCH === "") {
    $endpoint = "https://jueri.com.br/sis/api/v1/$ID/produto?search=$SEARCH&page=$PAGE&per_page=$PAGE_SIZE";
}

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');


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
