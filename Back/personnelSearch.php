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

    // $searchVal = mysqli_real_escape_string($conn, $searchVal);
	$searchVal = "%" . $searchVal . "%";

	// _________________________
	// CORRECT SQL TO SEARCH WHOLE DATABASE:
	$query = $conn->prepare("SELECT p.lastName, p.firstName, p.jobTitle, p.email, p.id, d.name AS department, l.name AS location FROM personnel p LEFT JOIN department d ON d.id = p.departmentID LEFT JOIN location l ON l.id = d.locationID WHERE p.lastName LIKE ? OR p.firstName LIKE ? OR p.email LIKE ? OR l.name LIKE ? OR d.name LIKE ?");
	
	$query->bind_param("sssss", $searchVal, $searchVal, $searchVal, $searchVal, $searchVal);

	$query->execute();

	$result = $query->get_result();
	
	
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