<?php
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	
	$searchVal = $_POST['searchVal'];
    $columnVal = $_POST['columnVal'];
    // $direction = $_POST['direction'];
    $sortField = ['p.lastName','p.firstName', 'p.email', 'd.name', 'l.name'];
    $searchVal = mysqli_real_escape_string($conn, $searchVal);
    $columnVal = mysqli_real_escape_string($conn, $columnVal);
    $sortField = mysqli_real_escape_string($conn, $sortField[$columnVal]);

$query = "SELECT p.lastName, p.firstName, p.jobTitle, p.email, p.id, d.name as department, l.name as location
    FROM personnel p 
    LEFT JOIN department d ON (d.id = p.departmentID) 
    LEFT JOIN location l ON (l.id = d.locationID) 
    WHERE $sortField LIKE '%".$searchVal."%'
    ORDER BY $sortField ASC;";
	// _________________________
	// CORRECT SQL TO SEARCH WHOLE DATABASE:
	// SELECT p.lastName, p.firstName, p.jobTitle, p.email, p.id, d.name AS department, l.name AS location FROM personnel p LEFT JOIN department d ON d.id = p.departmentID LEFT JOIN location l ON l.id = d.locationID WHERE p.lastName LIKE '%HI%' OR p.firstName LIKE '%HI%' OR p.email LIKE '%HI%' OR l.name LIKE '%HI%' OR d.name LIKE '%HI%';
	// ______________________

	$result = $conn->query($query);
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
	$data=[];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	$output['data']['length'] = count($data);

	mysqli_close($conn);

	echo json_encode($output); 

?>