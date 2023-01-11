<?php


	// example use from browser
	// http://localhost/companydirectory/libs/php/getAllDepartments.php

	// remove next two lines for production	
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);
	$colVal = $_POST['colVal'];
    $direction = $_POST['direction'];
	$sortFields = ['d.name', 'l.name','personnel_count'];

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

	// SQL does not accept parameters and so is not prepared

	$query = 'SELECT d.name AS deptName, d.ID AS deptID, l.name AS locName, l.ID AS locID, COUNT(p.departmentID) AS personnel_count FROM department AS d JOIN location AS l ON d.locationID = l.ID JOIN personnel AS p ON d.ID = p.departmentID GROUP BY d.name, l.name ORDER BY '.' '. $sortFields[$colVal]. ' '. $direction;

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
   
   	$deptAndLocation = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($deptAndLocation, $row);

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data']['departmentAndLocation'] = $deptAndLocation;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>