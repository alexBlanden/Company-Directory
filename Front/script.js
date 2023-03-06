
//Ajax Request:
var getData = function (address, query) {
    return $.ajax({
        url: address,
        type: "POST",
        dataType: "json",
        data: query
    })
}

var headerHeight;
const editPersonnelFormInputs = $('#edit-user-form')[0];
console.log($('#edit-user-form'))
const personnelFormInputs = $('#create-user-form')
const departmentFormInputs = $('#create-dept-form')
const locationFormInputs = $('#create-location-form')

window.onscroll = function () {
    scrollFunction();
}

//'X' buttons on modals and 'add-new-user/dept/location' will clear text from form inputs:
$('.input-clear').on('click', ()=> {
    $('input[type=text]').val("");
    $('#add-personnel > button').attr({
        'disabled': true,
        'data-bs-toggle': "tooltip",
        'title': "Please complete all fields to continue"
    });
    $('#add-dept > button').attr({
        'disabled': true,
        'data-bs-toggle': "tooltip",
        'title': "Department needs a name to continue"
    });
    $('#add-location > button').attr({
        'disabled': true,
        'data-bs-toggle': "tooltip",
        'title': "Location needs a name to continue"
    });
})

var tables = $('table').map(function(){
    return this.id
}).get();
setStickyTHeads()

function populatePersonnelTable(result){
    $('#personnel-table-body').html("")
    console.log(result.data[0].jobTitle)
        for(let i = 0; i < result.data.length; i++){
            $('#personnel-table-body').append(`<tr>
            <td data-id="${result.data[i].id}">${result.data[i].lastName}</td>
            <td>${result.data[i].firstName}</td>
            <td class="d-none d-lg-table-cell">${result.data[i].jobTitle}</td>
            <td class="d-none d-lg-table-cell"><a href="mailto:${result.data[i].email}"</a>${result.data[i].email}</td>
            <td class="d-none d-lg-table-cell">${result.data[i].department}</td>
            <td class="d-none d-lg-table-cell">${result.data[i].location}</td>
            <td><div class="container-fluid d-flex justify-content-around">
                <button type="button" class="btn btn-light edit-user-btn" data-bs-toggle="modal" data-bs-target="#edit-user-modal" data-table-row="${i+1}" data-id="${result.data[i].id}"><i class="fa-solid fa-pen"></i></button>
                <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete-user-modal" data-id="${result.data[i].id}"><i class="fa-solid fa-trash"></i></button>
            </div></td>
        </tr>`)
        }
    $(window).trigger('resize');
    backToTop();

}

function populateEditDepartmentLocationDropown(locationID, colVal, direction){
    var getLocationNameAndID = new getData('./Back/getLocations.php',
    {
        colVal,
        direction
    });
    $.when(getLocationNameAndID).then(result => {
        $('#edit-dept-location').html("")
        for(let i=0; i< result.data.length; i++){
            if(result.data[i].location_id == locationID){
                $('#edit-dept-location').append(`<option selected value="${result.data[i].location_id}">${result.data[i].location_name}</option>`)
            } else {
                $('#edit-dept-location').append(`<option value="${result.data[i].location_id}">${result.data[i].location_name}</option>`)
            }
        }
    }, err => console.log(err))
}
function populateLocationsDropdown (result) {
    $('#dept-location-dropdown').html("")
    for (let i=0; i< result.data.length; i++){
        if(i == 0) {
            $('#dept-location-dropdown').append(`<option selected value="${result.data[i].location_id}">${result.data[i].location_name}</option>`)
        } else { 
            $('#dept-location-dropdown').append(`<option value="${result.data[i].location_id}">${result.data[i].location_name}</option>`)
        }
    }
}
function populateLocationsTable(result){
    $('#locations-table-body').html("")
    for (let i=0; i< result.data.length; i++){
        if(result.data[i].department_count == 0){
            $('#locations-table-body').append(`
        <tr>
            <td>${result.data[i].location_name}</td>
            <td class="text-end">${result.data[i].department_count}</td>
            <td><div class="container-fluid d-flex justify-content-around">
                                <button type="button" class="btn btn-light" data-id="${result.data[i].location_id}" data-bs-toggle="modal" data-bs-target="#edit-location-modal"><i class="fa-solid fa-pen"></i></button>
                                <button type="button" class="btn btn-danger delete-location-btn" data-id="${result.data[i].location_id}"><i class="fa-solid fa-trash"></i></button>
                </div></td>
        </tr>`)
        } else {
            $('#locations-table-body').append(`
            <tr>
                <td>${result.data[i].location_name}</td>
                <td class="text-end">${result.data[i].department_count}</td>
                <td><div class="container-fluid d-flex justify-content-around">
                                <button type="button" class="btn btn-light" data-id="${result.data[i].location_id}" data-bs-toggle="modal" data-bs-target="#edit-location-modal"><i class="fa-solid fa-pen"></i></button>
                                <span class="d-inline-block" tabindex="0" data-bs-toggle="tooltip" data-bs-title="Location must be emtpy. Please move Departments!">
                                <button type="button" class="btn btn-danger disabled"><i class="fa-solid fa-trash"></i></button>
                                </span>
                </div></td>
            </tr>`)
        }
    }
    loadToolTips();
    $(window).trigger('resize');
    backToTop();
}

function populateDepartmentsTable (result) {
    $('#departments-table-body').html("");
    for(let i=0; i<result.data.departmentAndLocation.length; i++){
        if(result.data.departmentAndLocation[i].personnel_count == '0'){
            $('#departments-table-body').append(`
        <tr>
            <td>${result.data.departmentAndLocation[i].deptName}</td>
            <td>${result.data.departmentAndLocation[i].locName}</td>
            <td class="text-end d-none d-lg-table-cell">${result.data.departmentAndLocation[i].personnel_count}</td>
            <td><div class="container-fluid d-flex justify-content-around">
                            <button type="button" class="btn btn-light edit-dept-btn" data-bs-toggle="modal" data-bs-target="#edit-dept-modal" data-id="${result.data.departmentAndLocation[i].deptID}" data-loc-id="${result.data.departmentAndLocation[i].locID}"><i class="fa-solid fa-pen"></i></button>
                            <button type="button" class="btn btn-danger delete-dept-btn" data-id="${result.data.departmentAndLocation[i].deptID}"><i class="fa-solid fa-trash"></i></button>
            </div></td>
        </tr>
        `)
        } else {
            $('#departments-table-body').append(`
        <tr>
            <td>${result.data.departmentAndLocation[i].deptName}</td>
            <td>${result.data.departmentAndLocation[i].locName}</td>
            <td class="text-end d-none d-lg-table-cell">${result.data.departmentAndLocation[i].personnel_count}</td>
            <td><div class="container-fluid d-flex justify-content-around">
                            <button type="button" class="btn btn-light edit-dept-button" data-bs-toggle="modal" data-bs-target="#edit-dept-modal" data-id="${result.data.departmentAndLocation[i].deptID}" data-loc-id="${result.data.departmentAndLocation[i].locID}"><i class="fa-solid fa-pen"></i></button>
                            <span class="d-inline-block" tabindex="0" data-bs-toggle="tooltip" data-bs-title="Department must be emtpy. Please move Personnel!">
                            <button type="button" class="btn btn-danger disabled"><i class="fa-solid fa-trash"></i></button>
                            </span>
            </div></td>
        </tr>
        `)
        }
    }
    loadToolTips()
    $(window).trigger('resize');
    backToTop()
}
//Check Department is still empty before deleting
$('#departments-table-body').on('click', '.delete-dept-btn', function () {
    const id = $(this).attr('data-id')
    const checkDept = new getData('./Back/checkDepartmentById.php', {
        id
    });$.when(checkDept).then((result)=> {
        if(result.status.code === '200'){
            if(result.data[0].departmentCount === 0){
                populateDepartmentDeleteModal(id)
                $('#delete-department-modal').modal('show');
            } else {
                $("#cant-delete-dept-name").text(result.data[0].departmentName);
                $("#dept-count").text(result.data[0].departmentCount);
                $('#cant-delete-dept-modal').modal('show');
            }
        } else {
            createAlert('department-alert', 'Error retrieving data', 'warning');
        } 
    }, (err)=> console.log(err))
})
$('#cant-delete-dept-close').on('click', ()=>{
    sortDepartmentsTableByColumn(0,'ASC');
})

$('#locations-table-body').on('click', '.delete-location-btn', function(){
    const id = $(this).attr('data-id');
    const checkLocation = new getData('./Back/checkLocationById.php', {
        id
    });$.when(checkLocation).then((result)=> {
        if(result.status.code === '200'){
            if(result.data[0].departmentCount === 0){
                populateLocationDeleteModal(id)
                $('#delete-location-modal').modal('show');
            } else {
                $("#cant-delete-location-name").text(result.data[0].locationName);
                $("#location-count").text(result.data[0].departmentCount);
                $('#cant-delete-location-modal').modal('show');
            }
        } else {
            createAlert('location-alert', 'Error retrieving data', 'warning');
        }
    }, error => console.log(error))
})

//Populate Personnel Table
function getAllPersonnel () {
    var selectAll = new getData('./Back/getAll.php', {

    });$.when(selectAll).then(
        result => populatePersonnelTable(result),
    
        error =>console.log(error.responseText)
    )
}
//Fetch user details for user delete modal
function populateUserDeleteModal(id){
    var selectUserById = new getData('./Back/getPersonnelByID.php', 
    {
        id
    });$.when(selectUserById).then(result => {
        let existingPersonnelfirstName = result.data.personnel[0].firstName;
        let existingPersonnelsurname = result.data.personnel[0].lastName;
        let existingPersonnelid = result.data.personnel[0].id;
        $('#confirm-delete-user').html(`Are you sure you want to delete ${existingPersonnelfirstName} ${existingPersonnelsurname}? You cannot undo this action`);
        $('#confirm-delete-user-id').html(existingPersonnelid);
    })
}

$('#confirm-delete-user-button').on('click', ()=>{
    let existingPersonnelid = $('#confirm-delete-user-id').html();
    // deleteUser(existingPersonnelid);
    var deletePersonnel = new getData('./Back/deleteUserByID.php', 
    {
        existingPersonnelid
    });$.when(deletePersonnel).then(result => {
        createAlert('user-alert', result.data, 'danger')
        getAllPersonnel()
        backToTop();
    }, err => console.log(err))
})

function populateDepartmentDeleteModal (id) {
    var selectDepartmentByID = new getData('./Back/getDepartmentByID.php',
    {
        id
    });$.when(selectDepartmentByID).then(result => {
        let existingDepartmentID = result.data[0].id;
        let existingDepartmentName = result.data[0].name
        $('#confirm-delete-department').html(`Are you sure you want to delete ${existingDepartmentName}? You cannot undo this action`)
        $('#confirm-delete-department-id').html(existingDepartmentID)
    }, error=> console.log(error))
}
$('#confirm-delete-department-button').on('click', ()=>{
    let existingDepartmentID = $('#confirm-delete-department-id').html();
    var deleteDepartmentByID = new getData('./Back/deleteDepartmentByID.php',
    {
        existingDepartmentID
    });$.when(deleteDepartmentByID).then(result => {
        createAlert('department-alert', result.status.description, 'danger');
        sortDepartmentsTableByColumn(0, 'ASC');
        backToTop();
    })
});

function populateLocationDeleteModal (id) {
    var selectLocationByID = new getData('./Back/getLocationByID.php',
    {
        id
    });$.when(selectLocationByID).then(result => {
        let existingLocationid = result.data[0].id;
        $('#confirm-delete-location').html(`Are you sure you want to delete ${result.data[0].name}? You cannot undo this action`);
        $('#confirm-delete-location-id').html(existingLocationid);
    }, error=> console.log(error))
}

function populateLocationModal(id) {
    var selectLocationByID = new getData('./Back/getLocationByID.php',
    {
        id
    });$.when(selectLocationByID).then(result => {
        existingLocation.name = result.data[0].name
        $('#edit-location-name').val(result.data[0].name)
        $('#location-id').val(result.data[0].id)
    })
}
$('#edit-location-form').on('submit', (event)=> {
    event.preventDefault()
    let existingLocationName = capitalise($('#edit-location-name').val().trim());
    let id = $('#location-id').val()
    var sendLocation = new getData('./Back/updateLocation.php', 
    {
        id,
        existingLocationName
    });$.when(sendLocation).then(result => {
        if(result.status.code = 200){
            $('#edit-location-modal').modal('hide');
            createAlert('location-alert', result.status.description, 'success')
            sortLocationsTableByColumn(0,'ASC');
        }
    }, err => {
        console.log(err)
        if(err.responseText.indexOf("Duplicate entry") !== -1){
            createAlert('location-alert', "ERROR: Location Name Must Be Unique", 'warning')
        } else {
            createAlert('location-alert', `WARNING: ${err.responseText}`, 'warning' )
        }
    })
})


$('#confirm-delete-location-button').on('click', ()=>{
    let existingLocationid = $('#confirm-delete-location-id').html();
    // deleteLocation(existingLocationid);
    var deleteLocationByID = new getData('./Back/deleteLocationByID.php',
    {
        existingLocationid
    });$.when(deleteLocationByID).then(result => {
        createAlert('location-alert', result.status.description, 'danger');
        sortLocationsTableByColumn(0, 'ASC');
        backToTop();
    })
});

//Populate dropdown select menu for create user
function getAllDepartments () {
    var getDepartments = new getData('./Back/getAllDepartments.php', {

    });$.when(getDepartments).then((result)=> {
        $('#edit-user-dept').html("")
        $('#create-user-dept').html("")
        for(let i = 0; i < result.data.length; i++){
            $('#edit-user-dept',).append(`<option value="${result.data[i].id}">${result.data[i].name}</option>`)
            $('#create-user-dept').append(`<option value="${result.data[i].id}">${result.data[i].name}</option>`)
            
        }
    });
}

$('#edit-user-form').on('submit', (event)=> {
    event.preventDefault()
    let personnelID,
    firstName,
    lastName,
    email,
    jobTitle,
    departmentName,
    departmentID;
    //Check for new entries in Edit user modal or leave existing personnel object values:
    personnelID = $('#employeeID').val();
    firstName = capitalise($('#edit-user-forename').val()).trim();
    lastName = capitalise($('#edit-user-surname').val()).trim();
    email = $('#edit-user-email').val().trim();
    if(('#edit-user-job-title').val()){
        jobTitle = capitalise($('#edit-user-job-title').val()).trim();
    }
    departmentName = $('#edit-user-dept option:selected').text()
    departmentID = $('#edit-user-dept').val()
    var sendUserDetails = new getData('./Back/updatePersonnel.php',
    {
        firstName,
        lastName,
        email,
        jobTitle,
        departmentID,
        personnelID
    });$.when(sendUserDetails).then(result => {
        $('#edit-user-modal').modal('hide');
        createAlert('user-alert', result.status.description, 'success');
        sortPersonnelTableByColumn(0, 'ASC');
    }, err => {
        console.log(err)
        if(err.responseText.indexOf("Duplicate entry") !== -1){
            createAlert('user-alert', "ERROR: Email address already taken. Please use another", 'warning')
        } else {
            createAlert('location-alert', `ERROR: ${err.responseText}`, 'warning' )
        }
    })
})

$('#edit-dept-form').on('submit', (event)=> {
    //Check for new entries in Edit user modal or leave existing personnel object values:
    event.preventDefault();
    let existingDepartmentName,
    existingDepartmentID,
    existingDepartmentLocation,
    existingDepartmentLocationID

    existingDepartmentID = $('#dept-id').val()
    if($('#edit-dept-name').val()){
        existingDepartmentName = capitalise($('#edit-dept-name').val()).trim()
    } 
    existingDepartmentLocation = $('#edit-dept-location option:selected').text()
    existingDepartmentLocationID = $('#edit-dept-location').val()
    var sendDeptDetails = new getData('./Back/updateDept.php', 
    {
        existingDepartmentName,
        existingDepartmentID,
        existingDepartmentLocationID
    });$.when(sendDeptDetails).then((result)=> {
        if(result.status.code == 200){
            $('#edit-dept-modal').modal('hide')
            createAlert('department-alert', result.status.description, 'success');
            sortDepartmentsTableByColumn(0, 'ASC');
        }
    }, err => {
        console.log(err)
        if(err.responseText.indexOf("Duplicate entry") !== -1){
            $('#edit-dept-modal').modal('hide')
            createAlert('department-alert', "ERROR: Department name must be unique", 'warning')
        } else {
            $('#edit-dept-modal').modal('hide')
            createAlert('deparment-alert', `ERROR: ${err.responseText}`, 'warning' )
        }
    })
})

function loadToolTips(){
    let tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}

//Fetch user-id from button data attribute to populate user info modal
const editUserModal = document.getElementById('edit-user-modal');
editUserModal.addEventListener('show.bs.modal', () => {
    
})
editUserModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const id = button.getAttribute('data-id');
    var selectUserById = new getData('./Back/getPersonnelByID.php', 
    {
        id
    });$.when(selectUserById).then(result => {
        if(result.status.code == 200){
        //Full name for Modal Title
        const fullName = `${result.data.personnel[0].firstName} ${result.data.personnel[0].lastName}`
        $('#edit-user-title').html(fullName)
        $('#employeeID').val(result.data.personnel[0].id);
        $('#edit-user-forename').val(result.data.personnel[0].firstName);
        $('#edit-user-surname').val(result.data.personnel[0].lastName);
        $('#edit-user-email').val(result.data.personnel[0].email);
        $('#edit-user-job-title').val(result.data.personnel[0].jobTitle);
        $('#edit-user-dept').html("");
        for(let i = 0; i < result.data.department.length; i++){
            $('#edit-user-dept').append(`<option value="${result.data.department[i].id}">${result.data.department[i].name}</option>
        `)}
        $('#edit-user-dept').val(result.data.personnel[0].departmentID);
    } else {
        $('#edit-user-title').html('Error Retrieving Data')
    }
    }, error => {
        $('#edit-user-modal').html('Error Retrieving Data');
    })
})


const editDepartmentModal = document.getElementById('edit-dept-modal');
editDepartmentModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const editDeptID = button.getAttribute('data-id');
    const editDeptLocationID = parseInt(button.getAttribute('data-loc-id'));
    populateDepartmentModal(editDeptID);
    populateEditDepartmentLocationDropown(editDeptLocationID, 0, 'ASC');
})

const editLocationModal = document.getElementById('edit-location-modal');
editLocationModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    existingLocation.id = button.getAttribute('data-id');
    populateLocationModal(existingLocation.id)
})


function populateDepartmentModal (id) {
    var selectDepartmentByID = new getData('./Back/getDepartmentByID.php',
    {
        id
    });$.when(selectDepartmentByID).then(result => {
        $('#edit-dept-name').val(result.data[0].name)
        $('#dept-id').val(result.data[0].id)
    }, error=> console.log(error))
}
//Fetch user-id from button data attribute to create confirm delete message
const deleteUserModal = document.getElementById('delete-user-modal');
deleteUserModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const userId = button.getAttribute('data-id');
    populateUserDeleteModal(userId);
})

$('#departments-tab').on('click', ()=>{
    sortDepartmentsTableByColumn(0, 'ASC');
});

$(window).on('resize', ()=> {
    setStickyTHeads()
})

//Table headers stick just below search which moves to fit nav bar on smaller screens so sticky point must be reset
function setStickyTHeads () {
    if ($(document).width()<= 617){
        headerHeight = 135
        
        tables.forEach(table => {    
            $(`#${table}`).trigger('reflow')
        });
    } else if ($(document).width()> 617){
        headerHeight = 96;
        tables.forEach(table => {
            $(`#${table}`).trigger('reflow')
        });
    }
}

$(".sticky-header").floatThead({
    top: function() {
        return headerHeight;
    },
    responsiveContainer: function($table){
        return $table.closest(".table-responsive");
    }});


$('#cancel-create-user').on('click', (event)=> {
    //Check at least one form input has a value before asking user to confirm cancel:
    let formInputArray = personnelFormInputs.serializeArray()
    const formValid = formInputArray.some(input => input.value.trim() !== "")
    if(formValid){
        if (confirm('Warning: You have unsaved changes. Are you sure you want to cancel?')){
            $('#create-user-modal').modal('hide');
            sortPersonnelTableByColumn(0, 'ASC');
        } else {
            event.preventDefault();
        }
    } else {
        $('#create-user-modal').modal('hide');
    }
})

$('#cancel-create-dept').on('click', (event)=> {
//Check at least one form input has a value before asking user to confirm cancel:
    const formValid =  $('#create-dept-name').val().trim() !== "";
    if(formValid){
        if (confirm('Warning: You have unsaved changes. Are you sure you want to cancel?')){
            sortDepartmentsTableByColumn (0, 'ASC')
            $('#create-dept-modal').modal('hide');
        } else {
            event.preventDefault();
        }
    } else {
        $('#create-dept-modal').modal('hide');
    }
})

$('#cancel-create-location').on('click', (event)=> {
//Check at least one form input has a value before asking user to confirm cancel:
    const formValid = $('#create-location-name').val().trim() !== "";
    if(formValid){
        if(confirm('Warning: You have unsaved changes. Are you sure you want to cancel?')){
            sortLocationsTableByColumn(0, 'ASC');
            $('#create-location-modal').modal('hide');
        } else {
            event.preventDefault();
        }
    } else {
        $('#create-location-modal').modal('hide');
    }
})

//Check each create user/dept/location form input has a value, 'create' button stays inactive until formValid == true:
$('#edit-user-form').on('keyup', ()=> {
    const formValid = $('#edit-user-form')[0].checkValidity();
    if(formValid){
        console.log(true)
        $('#save-changes > button').attr({
            'disabled': false,
            'title': ""
        })
    } else {
        $('#save-changes > button').attr({
            'disabled': true,
            'data-bs-toggle': "tooltip",
            'title': "Please complete all fields to continue"
        })
    }
})

$('#create-user-form').on('keyup', ()=> {
    let formInputArray = personnelFormInputs.serializeArray()
    console.log(formInputArray, personnelFormInputs)
    const formValid = formInputArray.every(input => input.value.trim() !== "")
    if(formValid){
        $('#add-personnel > button').attr({
            'disabled': false,
            'title': ""
        })
    } else {
        $('#add-personnel > button').attr({
            'disabled': true,
            'data-bs-toggle': "tooltip",
            'title': "Please complete all fields to continue"
        })
    }
})

$('#create-dept-form').on('keyup', ()=> {
    let deptFormInputArray = departmentFormInputs.serializeArray()
    const formValid = deptFormInputArray.every(input => input.value.trim() !== "")
    if(formValid){
        $('#add-dept > button').attr({
            'disabled': false,
            'title': ""
        })
    } else {
        $('#add-dept > button').attr({
            'disabled': true,
            'data-bs-toggle': "tooltip",
            'title': "Please complete all fields to continue"
        })
    }
})

$('#create-location-form').on('keyup', ()=> {
    let locationFormInputArray = locationFormInputs.serializeArray()
    const formValid = locationFormInputArray.every(input => input.value.trim() !== "")
    if(formValid){
        $('#add-location > button').attr({
            'disabled': false,
            'title': "",
            'data-bs-toggle': ""
        })
    } else {
        $('#add-location > button').attr({
            'disabled': true,
            'data-bs-toggle': "tooltip",
            'title': "Please complete all fields to continue"
        })
    }
})

$('#create-user-form').on('submit', function (event) {
    event.preventDefault();
    let firstName = capitalise($('#create-user-firstname').val().trim());
    let lastName = capitalise($('#create-user-surname').val().trim());
    let email = $('#create-user-email').val().trim();
    let jobTitle = $('#create-user-job-title').val().trim();
    let department = $("#create-user-dept option:selected").text();
    let departmentID = $('#create-user-dept').val();
        //Display newPersonnelObject to user in modal and ask to confirm action
        var insertUser = new getData('./Back/insertUser.php', 
    {
        firstName,
        lastName,
        email,
        jobTitle,
        departmentID,
    });$.when(insertUser).then(
        (result)=>{
        if(result.status.code == 200){
            $('#create-user-modal').modal('hide');
            $('#create-user-form')[0].reset();
            getAllPersonnel(); 
            createAlert('user-alert', result.status.description, 'success');
            scrollFunction()
        } else {
           createAlert('user-alert', 'Error Communicating with Database', 'warning');
        };
    },
     (err)=> {
        console.log(err);
        //Search response error, if 'Duplicate entry' string exists, email is already used as it's the only unique field:
        if(err.responseText.indexOf("Duplicate entry") !== -1){
            createAlert('user-alert', "ERROR: A member of Personnel with that email already exists", 'warning')
        } else {
            createAlert('user-alert', `WARNING: ${err.responseText}`, 'warning' )
        }
    })
})

$('#create-location-form').on('submit', event => {
    event.preventDefault();
    let locationName = capitalise($('#create-location-name').val().trim());
    var insertLocation = new getData('./Back/insertLocation.php', 
    {
        locationName,
    });$.when(insertLocation).then((result)=> {
        if(result.status.code == 200){
            $('#create-location-name').html("");
            $('#create-location-modal').modal('hide');
            sortLocationsTableByColumn(0, 'ASC')
            createAlert('location-alert', result.status.description, 'success');
        } else {
            createAlert('location-alert', result.status.description, 'warning');
        }
    }, err => {
        if(err.responseText.indexOf("Duplicate entry") !== -1){
            createAlert('location-alert', "ERROR: Location already exists", 'warning')
        } else {
            createAlert('location-alert', `ERROR: ${err.responseText}`, 'warning' )
        }
        console.log(err)
    })
})
$('#create-dept-btn').on('click', ()=>{
    //sortLocationsByColumn also populates locations dropdown menu in create department modal.
    sortLocationsTableByColumn(0, 'ASC');
    $('#create-dept-name').html("");
});

$('#create-dept-form').on('submit', event => {
    event.preventDefault();
    let newDepartmentName = capitalise($('#create-dept-name').val().trim()),
    newDepartmentLocation = $('#dept-location-dropdown option:selected').text(),
    locationId = $('#dept-location-dropdown').val();
    var insertDepartment = new getData('./Back/insertDepartment.php', 
    {
        newDepartmentName,
        locationId
    });$.when(insertDepartment).then((result)=> {
        if(result.status.code == 200){
            $('#create-dept-modal').modal('hide');
            sortDepartmentsTableByColumn(0, 'ASC');
            createAlert('department-alert', result.status.description, 'success');
        } else {
            $('#create-dept-modal').modal('hide');
            createAlert('department-alert', result.status.description, 'warning');    
        }
    }, err => {
        console.log(err)
        if(err.responseText.indexOf("Duplicate entry") !== -1){
            $('#create-dept-modal').modal('hide');
            createAlert('department-alert', "ERROR: Department already exists", 'warning')
        } else {
            $('#create-dept-modal').modal('hide');
            createAlert('department-alert', `WARNING: ${err.responseText}`, 'warning' )
        }
    })
})

//Table Sort Functions:
function sortPersonnelTableByColumn (colVal, direction){
    var getSortedData = new getData('././Back/getAllSort.php', {
        colVal,
        direction
    });$.when(getSortedData).then(
        result => {
            populatePersonnelTable(result);
        },
        error => console.log(error)
    )
}

function sortDepartmentsTableByColumn (colVal, direction) {
    var getSortedData = new getData('././Back/getDepartmentAndLocation.php', {
        colVal,
        direction
    });$.when(getSortedData).then(
        result => {
            populateDepartmentsTable(result);
            },
        error => console.log(error)
    )
}

function sortLocationsTableByColumn (colVal, direction){
    var getSortedData = new getData('././Back/getLocations.php', {
        colVal,
        direction
    });$.when(getSortedData).then(result => {
        populateLocationsTable(result);
        populateLocationsDropdown(result);
    }, error => console.log(error))
}

//User Dialogue injects html to relevant element to create bootstrap alert:
function createAlert (elementID, message, type) {
    const alertPlaceholder = document.getElementById(elementID);
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissable d-flex justify-content-between align-items-baseline" role="alert">`,
        `<span class="fs-6">${message}</span>`,
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

        alertPlaceholder.append(wrapper)
    tables.forEach(table => $(`#${table}`).trigger('reflow'))
}

$('#department-alert, #location-alert, #user-alert').on('click', ()=> {
    tables.forEach(table => {
        $(`#${table}`).trigger('reflow')
    });
})
const toTopButton = document.getElementById('btn-back-to-top');
$(toTopButton).on('click', ()=>backToTop());
//Measure pixel amount of vertical scroll and change display value or scroll button to suit
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        toTopButton.style.display = "block";
    } else {
        toTopButton.style.display = "none"
    }
}

//Reset vertical scroll
function backToTop () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

//Event listeners for buttons in table headers, sort table values by ascending or descending depending on data attribute of button
$('#p-surname').on('click', ()=> {
    if($('#p-surname').attr('data-direction') == 'up'){
        sortPersonnelTableByColumn(0, 'ASC')
        $('#p-surname').attr('data-direction', 'down');

        $('#p-surname > i').attr('class', '')
        $('#p-surname > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#p-surname').attr('data-direction') == 'down'){
        sortPersonnelTableByColumn(0, 'DESC')
        $('#p-surname').attr('data-direction', 'up');

        $('#p-surname > i').attr('class', '')
        $('#p-surname > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#p-forename').on('click', ()=> {
    if($('#p-forename').attr('data-direction') == 'up'){
        sortPersonnelTableByColumn(1, 'ASC')
        $('#p-forename').attr('data-direction', 'down');
        $('#p-forename > i').attr('class', '')
        $('#p-forename > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#p-forename').attr('data-direction') == 'down'){
        sortPersonnelTableByColumn(1, 'DESC')
        $('#p-forename').attr('data-direction', 'up');
        $('#p-forename > i').attr('class', '')
        $('#p-forename > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#p-email').on('click', ()=> {
    if($('#p-email').attr('data-direction') == 'up'){
        sortPersonnelTableByColumn(2, 'ASC')

        $('#p-email > i').attr('class', '')
        $('#p-email > i').attr("class", "fa-solid fa-sort-asc")
        $('#p-email').attr('data-direction', 'down');
    } else if ($('#p-email').attr('data') == 'down'){
        sortPersonnelTableByColumn(2, 'DESC')
        $('#p-email').attr('data-direction', 'up');

        $('#p-email > i').attr('class', '')
        $('#p-email > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#p-dept').on('click', ()=> {
    if($('#p-dept').attr('data-direction') == 'up'){
        sortPersonnelTableByColumn(4, 'ASC')
        $('#p-dept').attr('data-direction', 'down');

        $('#p-dept > i').attr('class', '')
        $('#p-dept > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#p-dept').attr('data-direction') == 'down'){
        sortPersonnelTableByColumn(4, 'DESC')
        $('#p-dept').attr('data-direction', 'up');

        $('#p-dept > i').attr('class', '')
        $('#p-dept > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#p-job-title').on('click', ()=> {
    if($('#p-job-title').attr('data-direction') == 'up'){
        sortPersonnelTableByColumn(3, 'ASC')
        $('#p-job-title').attr('data-direction', 'down');

        $('#p-job-title > i').attr('class', '')
        $('#p-job-title > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#p-job-title').attr('data-direction') == 'down'){
        sortPersonnelTableByColumn(3, 'DESC')
        $('#p-job-title').attr('data-direction', 'up');

        $('#p-job-title > i').attr('class', '')
        $('#p-job-title > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#p-location').on('click', ()=> {
    if($('#p-location').attr('data-direction') == 'up'){
        sortPersonnelTableByColumn(4, 'ASC')
        $('#p-location').attr('data-direction', 'down');

        $('#p-location > i').attr('class', '')
        $('#p-location > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#p-location').attr('data-direction') == 'down'){
        sortPersonnelTableByColumn(4, 'DESC')
        $('#p-location').attr('data-direction', 'up');

        $('#p-location > i').attr('class', '')
        $('#p-location > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#d-name').on('click', ()=> {
    if($('#d-name').attr('data-direction') == 'up'){
        sortDepartmentsTableByColumn(0, 'ASC')
        $('#d-name').attr('data-direction', 'down');

        $('#d-name > i').attr('class', '')
        $('#d-name > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#d-name').attr('data-direction') == 'down'){
        sortDepartmentsTableByColumn(0, 'DESC')
        $('#d-name').attr('data-direction', 'up');

        $('#d-name > i').attr('class', '')
        $('#d-name > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#d-location-name').on('click', ()=> {
    if($('#d-location-name').attr('data-direction') == 'up'){
        sortDepartmentsTableByColumn(1, 'ASC')
        $('#d-location-name').attr('data-direction', 'down');

        $('#d-location-name > i').attr('class', '')
        $('#d-location-name > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#d-location-name').attr('data-direction') == 'down'){
        sortDepartmentsTableByColumn(1, 'DESC')
        $('#d-location-name').attr('data-direction', 'up');

        $('#d-location-name > i').attr('class', '')
        $('#d-location-name > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#d-personnel-count').on('click', ()=> {
    if($('#d-personnel-count').attr('data-direction') == 'up'){
        sortDepartmentsTableByColumn(2, 'ASC')
        $('#d-personnel-count').attr('data-direction', 'down');

        $('#d-personnel-count > i').attr('class', '')
        $('#d-personnel-count > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#d-personnel-count').attr('data-direction') == 'down'){
        sortDepartmentsTableByColumn(2, 'DESC')
        $('#d-personnel-count').attr('data-direction', 'up');

        $('#d-personnel-count > i').attr('class', '')
        $('#d-personnel-count > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#l-name').on('click', ()=> {
    if($('#l-name').attr('data-direction') == 'up'){
        sortLocationsTableByColumn(0, 'ASC')
        $('#l-name').attr('data-direction', 'down');

        $('#l-name > i').attr('class', '')
        $('#l-name > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#l-name').attr('data-direction') == 'down'){
        sortLocationsTableByColumn(0, 'DESC')
        $('#l-name').attr('data-direction', 'up');

        $('#l-name > i').attr('class', '')
        $('#l-name > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#l-dept-count').on('click', ()=> {
    if($('#l-dept-count').attr('data-direction') == 'up'){
        sortLocationsTableByColumn(1, 'ASC')
        $('#l-dept-count').attr('data-direction', 'down');

        $('#l-dept-count > i').attr('class', '')
        $('#l-dept-count > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#l-dept-count').attr('data-direction') == 'down'){
        sortLocationsTableByColumn(1, 'DESC')
        $('#l-dept-count').attr('data-direction', 'up');

        $('#l-dept-count > i').attr('class', '')
        $('#l-dept-count > i').attr("class", "fa-solid fa-sort-desc")
    }
});

//Use Bootstrap active state to indicate which column user has arranged by
$('.btn-sort').on('click', function () {
    $('.btn-sort').removeClass('active');
    $(this).addClass('active');
})
$('#locations-tab').on('click', ()=> {
    sortLocationsTableByColumn(0, 'ASC')
})

$('#personnel-search-addon-btn').on('click', ()=> {
    const searchVal = $('#personnel-search-input').val()
    var getPersonnelSearchResults = new getData('./Back/personnelSearch.php', 
    {
        searchVal
    });$.when(getPersonnelSearchResults).then((result)=>{
        $('#search-personnel-table').html("")
    if(result.data.length == 0){
        $('#search-personnel-table').html(`
        <tr>
            <td></td>
            <td class="text-center">No results found. Please try again.</td>
            <td></td>
        </tr>`)
    }
    for(let i=0; i< result.data.length; i++){
        $('#search-personnel-table').append(
            `<tr>
                <td class="align-middle">${result.data[i].firstName} ${result.data[i].lastName}</td>
                
                <td class="d-none d-lg-table-cell"><a href="mailto:${result.data[i].email}"</a>${result.data[i].email}</td>
                <td class="d-none d-lg-table-cell">${result.data[i].department}</td>
                <td class="d-none d-lg-table-cell">${result.data[i].location}</td>

                <td><div class="container-fluid d-flex justify-content-around">
                <button type="button" class="btn btn-light edit-user-btn" data-bs-toggle="modal" data-bs-target="#edit-user-modal" data-table-row="${i+1}" data-id="${result.data[i].id}"><i class="fa-solid fa-pen"></i></button></td>
            </tr>`
        )
    }
    }, (error)=> {
        console.log(error);
    })
})

$('#dept-search-addon-btn').on('click', ()=> {
    const searchVal = $('#dept-search-input').val()
    // searchDeptTable(deptVal)
    var getPersonnelSearchResults = new getData('./Back/deptSearch.php', 
    {
        searchVal
    });$.when(getPersonnelSearchResults).then((result)=>{
        $('#search-dept-table').html("")
    if(result.data.length == 0){
        $('#search-dept-table').html(`
        <tr>
            <td></td>
            <td class="text-center">No results found. Please try again.</td>
            <td></td>
        </tr>`)
    }
    for(let i=0; i< result.data.length; i++){
        $('#search-dept-table').append(
            `<tr>
                <td class="align-middle">${result.data[i].name}</td>
                <td><div class="container-fluid d-flex justify-content-around">
                <button type="button" class="btn btn-light edit-user-btn" data-bs-toggle="modal" data-bs-target="#edit-dept-modal" data-table-row="${i+1}" data-id="${result.data[i].id}"><i class="fa-solid fa-pen"></i></button></td>
            </tr>`
        )
    }
    })
})
$('#location-search-addon-btn').on('click', ()=> {
    const searchVal = $('#location-search-input').val()
    var getLocationSearchResults = new getData('./Back/locationSearch.php',
    {
        searchVal
    });$.when(getLocationSearchResults).then((result)=> {
        $('#search-location-table').html("")
    if(result.data.length == 0){
        $('#search-location-table').html(`
        <tr>
            <td></td>
            <td class="text-center">No results found. Please try again.</td>
            <td></td>
        </tr>`)
    }
    for(let i=0; i< result.data.length; i++){
        $('#search-location-table').append(
            `<tr>
                <td class="align-middle">${result.data[i].name}</td>
                <td><div class="container-fluid d-flex justify-content-around">
                <button type="button" class="btn btn-light edit-user-btn" data-bs-toggle="modal" data-bs-target="#edit-location-modal" data-table-row="${i+1}" data-id="${result.data[i].id}"><i class="fa-solid fa-pen"></i></button></td>
            </tr>`
        )
    }
    })
})

$('#personnel-search-input').keyup((event)=> {
    if($('#personnel-search-input').val().trim()){
        $('#personnel-search-addon-btn').attr('disabled', false)
    } else {
        $('#personnel-search-addon-btn').attr('disabled', true)
    }
    if(event.key ==='Enter'){
        $('#personnel-search-addon-btn').click()
    }
})

$("#dept-search").keyup((event)=> {
    if($('#dept-search-input').val().trim()){
        $('#dept-search-addon-btn').attr('disabled', false);
    } else {
        $('#dept-search-addon-btn').attr('disabled', true);
        
    }
    if(event.key === 'Enter'){
        $('#dept-search-addon-btn').click();
    }
})
$("#location-search").keyup((event)=> {
    if($('#location-search-input').val().trim()){
        $('#location-search-addon-btn').attr('disabled', false);
    } else {
        $('#location-search-addon-btn').attr('disabled', true);
    }
    if(event.key === 'Enter'){
        $('#location-search-addon-btn').click()
    }
})

function capitalise(word) {
    if(!word){
      return;
    }
    const words = word.split(" ");
    for(let i=0; i < words.length; i++){
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    const capitalisedWords = words.join(" ");
    return capitalisedWords;
}

$( document ).ready(sortPersonnelTableByColumn(0, 'ASC'), getAllDepartments())