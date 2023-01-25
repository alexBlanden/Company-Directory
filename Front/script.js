import {
    getData
} from './get-data.js'

import {
    sortPersonnelTableByColumn,
    sortDepartmentsTableByColumn,
    sortLocationsTableByColumn
} from './tables/table-sort.js'

import {
    createAlert
} from './alert.js'

import {
    backToTop,
    scrollFunction
} from './scrollToTop.js'

import {
    capitalise
} from './utils/capitaliseWord.js'

import {
    searchTable
} from './tables/table-search.js'

import {
    resetObject
} from './utils/objectReset.js'

var existingPersonnel = {
    firstName: null,
    surname: null,
    email: null,
    id: null,
    departmentID: null,
    departmentName: null
}

var newPersonnel = {
    firstName: null,
    surname: null,
    email: null,
    department: null,
    departmentID: null
}

var existingDepartment = {
    name: null,
    location: null,
    locationID: null
}
var newDepartment = {
    name: null,
    location: null,
    locationID: null
}

var existingLocation = {
    name: null,
    id: null
}

var newLocationName;
window.onscroll = function () {
    scrollFunction();
}

//'X' buttons on modals and 'add-new-user/dept/location' will clear text from form inputs:
$('.input-clear').on('click', ()=> {
    $('form input').val("");
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
$("#personnel-search").keyup(()=> searchTable("personnel-search-input", "personnel-table", '#personnel-search-select'))
$("#dept-search").keyup(()=> searchTable("dept-search-input", "departments-table"))
$("#location-search").keyup(()=> searchTable("location-search-input", "locations-table"))

export function populatePersonnelTable(result){
    $('#personnel-table-body').html("")
        for(let i = 0; i < result.data.length; i++){
            $('#personnel-table-body').append(`<tr>
            <td data-id="${result.data[i].id}">${result.data[i].lastName}</td>
            <td>${result.data[i].firstName}</td>
            <td><a href="mailto:${result.data[i].email}"</a>${result.data[i].email}</td>
            <td>${result.data[i].department}</td>
            <td>${result.data[i].location}</td>
            <td><div class="container-fluid d-flex justify-content-around">
                <button type="button" class="btn btn-light edit-user-btn" data-bs-toggle="modal" data-bs-target="#edit-user-modal" data-table-row="${i+1}" data-id="${result.data[i].id}"><i class="fa-solid fa-pen"></i></button>
                <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete-user-modal" data-id="${result.data[i].id}"><i class="fa-solid fa-trash"></i></button>
            </div></td>
        </tr>`)
        }
}
//Also populates locations dropdown in create department modal

export function populateLocationsDropdown (result) {
    $('#dept-location-dropdown').html("")
    for (let i=0; i< result.data.length; i++){
        if(i == 0) {
            $('#dept-location-dropdown').append(`<option selected value="${result.data[i].location_id}">${result.data[i].location_name}</option>`)
        } else { 
            $('#dept-location-dropdown').append(`<option value="${result.data[i].location_id}">${result.data[i].location_name}</option>`)
        }
    }
}
export function populateLocationsTable(result){
    $('#locations-table-body').html("")
    console.log(result)
    for (let i=0; i< result.data.length; i++){
        if(result.data[i].department_count == 0){
            $('#locations-table-body').append(`
        <tr>
            <td>${result.data[i].location_name}</td>
            <td>${result.data[i].department_count}</td>
            <td><div class="container-fluid d-flex justify-content-around">
                                <button type="button" class="btn btn-light"><i class="fa-solid fa-pen"></i></button>
                                <button type="button" class="btn btn-danger" data-id="${result.data[i].location_id}" data-bs-target="#delete-location-modal" data-bs-toggle="modal"><i class="fa-solid fa-trash"></i></button>
                </div></td>
        </tr>`)
        } else {
            $('#locations-table-body').append(`
            <tr>
                <td>${result.data[i].location_name}</td>
                <td>${result.data[i].department_count}</td>
                <td><div class="container-fluid d-flex justify-content-around">
                                <button type="button" class="btn btn-light"><i class="fa-solid fa-pen"></i></button>
                                <span class="d-inline-block" tabindex="0" data-bs-toggle="tooltip" data-bs-title="Location must be emtpy. Please move Departments!">
                                <button type="button" class="btn btn-danger disabled"><i class="fa-solid fa-trash"></i></button>
                                </span>
                </div></td>
            </tr>`)
        }
    }
    loadToolTips()
}

export function populateDepartmentsTable (result) {
    $('#departments-table-body').html("");
    for(let i=0; i<result.data.departmentAndLocation.length; i++){
        if(result.data.departmentAndLocation[i].personnel_count == '0'){
            console.log('Found empty department')
            $('#departments-table-body').append(`
        <tr>
            <td>${result.data.departmentAndLocation[i].deptName}</td>
            <td>${result.data.departmentAndLocation[i].locName}</td>
            <td class="text-end">${result.data.departmentAndLocation[i].personnel_count}</td>
            <td><div class="container-fluid d-flex justify-content-around">
                            <button type="button" class="btn btn-light"><i class="fa-solid fa-pen"></i></button>
                            <button type="button" class="btn btn-danger" data-id="${result.data.departmentAndLocation[i].deptID}" data-bs-target="#delete-department-modal" data-bs-toggle="modal"><i class="fa-solid fa-trash"></i></button>
            </div></td>
        </tr>
        `)
        } else {
            $('#departments-table-body').append(`
        <tr>
            <td>${result.data.departmentAndLocation[i].deptName}</td>
            <td>${result.data.departmentAndLocation[i].locName}</td>
            <td class="text-end">${result.data.departmentAndLocation[i].personnel_count}</td>
            <td><div class="container-fluid d-flex justify-content-around">
                            <button type="button" class="btn btn-light"><i class="fa-solid fa-pen"></i></button>
                            <span class="d-inline-block" tabindex="0" data-bs-toggle="tooltip" data-bs-title="Department must be emtpy. Please move Personnel!">
                            <button type="button" class="btn btn-danger disabled" data-id="${result.data.departmentAndLocation[i].deptID}"><i class="fa-solid fa-trash"></i></button>
                            </span>
            </div></td>
        </tr>
        `)
        }
        console.log('added')
    }
    loadToolTips()
}

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
        console.log(result)
        existingPersonnel.firstName = result.data.personnel[0].firstName
        existingPersonnel.surname = result.data.personnel[0].lastName
        existingPersonnel.id = result.data.personnel[0].id
        console.log(id)
        $('#confirm-delete-user').html(`Are you sure you want to delete ${existingPersonnel.firstName} ${existingPersonnel.surname}? You cannot undo this action`)
    })
}

$('#confirm-delete-user-button').on('click', ()=>{
    deleteUser(existingPersonnel.id);
    resetObject(existingPersonnel);
})

function populateDepartmentDeleteModal (id) {
    var selectDepartmentByID = new getData('./Back/getDepartmentByID.php',
    {
        id
    });$.when(selectDepartmentByID).then(result => {
        existingDepartment.id = result.data[0].id;
        existingDepartment.name = result.data[0].name
        console.log(result.data[0].id);
        $('#confirm-delete-department').html(`Are you sure you want to delete ${existingDepartment.name}? You cannot undo this action`)
    }, error=> console.log(error))
}
$('#confirm-delete-department-button').on('click', ()=>{
    deleteDepartment(existingDepartment.id);
    resetObject(existingDepartment);
});

function populateLocationDeleteModal (id) {
    console.log(id)
    var selectLocationByID = new getData('./Back/getLocationByID.php',
    {
        id
    });$.when(selectLocationByID).then(result => {
        existingLocation.id = result.data[0].id;
        console.log(result.data[0].id);
        $('#confirm-delete-location').html(`Are you sure you want to delete ${result.data[0].name}? You cannot undo this action`)
    }, error=> console.log(error))
}

$('#confirm-delete-location-button').on('click', ()=>{
    deleteLocation(existingLocation.id);
    resetObject(existingLocation);
});
function deleteLocation(id){
    var deleteLocationByID = new getData('./Back/deleteLocationByID.php',
    {
        id
    });$.when(deleteLocationByID).then(result => {
        console.log(result);
        createAlert('location-alert', result.status.description, 'danger');
        sortLocationsTableByColumn(0, 'ASC');
        backToTop();
    })
}


//Delete user
function deleteUser(id) {
    var deletePersonnel = new getData('./Back/deleteUserByID.php', 
    {
        id
    });$.when(deletePersonnel).then(result => {
        console.log(result)
        createAlert('user-alert', result.data, 'danger')
        getAllPersonnel()
        backToTop();
    }, err => console.log(err))
}

function deleteDepartment(id){
    var deleteDepartmentByID = new getData('./Back/deleteDepartmentByID.php',
    {
        id
    });$.when(deleteDepartmentByID).then(result => {
        console.log(result);
        createAlert('department-alert', result.status.description, 'danger');
        sortDepartmentsTableByColumn(0, 'ASC');
        backToTop();
    })
}
//Populate dropdown select menu for create user
function getAllDepartments () {
    var getDepartments = new getData('./Back/getAllDepartments.php', {

    });$.when(getDepartments).then((result)=> {
        console.log(result)
        $('#edit-user-dept').html("")
        $('#create-user-dept').html("")
        for(let i = 0; i < result.data.length; i++){
            $('#edit-user-dept',).append(`<option value="${result.data[i].id}">${result.data[i].name}</option>`)
            $('#create-user-dept').append(`<option value="${result.data[i].id}">${result.data[i].name}</option>`)
            
        }
    });
}
//Fetch user details for edit
function populateUserModal(id) {
    var selectUserById = new getData('./Back/getPersonnelByID.php', 
    {
        id
    });$.when(selectUserById).then(result => {
        console.log(result)
        //Full name for Modal Title
        const fullName = `${result.data.personnel[0].firstName} ${result.data.personnel[0].lastName}`
        //Update Existing Personnel Object
        existingPersonnel.firstName = result.data.personnel[0].firstName;
        existingPersonnel.surname = result.data.personnel[0].lastName;
        existingPersonnel.email = result.data.personnel[0].email;
        existingPersonnel.id = result.data.personnel[0].id;
        existingPersonnel.departmentID = result.data.personnel[0].departmentID;
        existingPersonnel.departmentName = result.data.personnel[0].departmentName;
        //Use Object Values to Populate Placeholder Text
        $('#edit-user-title').html(fullName)
        $('#edit-user-forename').attr('placeholder', existingPersonnel.firstName);
        $('#edit-user-surname').attr('placeholder', existingPersonnel.surname);
        $('#edit-user-email').attr('placeholder', existingPersonnel.email);

        $('#edit-user-dept').html("");
        for(let i = 0; i < result.data.department.length; i++){
            $('#edit-user-dept').append(`<option value="${result.data.department[i].id}">${result.data.department[i].name}</option>
        `)}

        $('#edit-user-dept').val(result.data.personnel[0].departmentID);
    })
}


$('#update-user').on('click', ()=> {
    //Check for new entries in Edit user modal or leave existing personnel object values:
    if($('#edit-user-forename').val()){
        existingPersonnel.firstName = capitalise($('#edit-user-forename').val()).trim()
    }

    if($('#edit-user-surname').val()){
        existingPersonnel.surname = capitalise($('#edit-user-surname').val()).trim()
    }

    if($('#edit-user-email').val()){
        existingPersonnel.email = $('#edit-user-email').val().trim()
    }
    existingPersonnel.departmentName = $('#edit-user-dept option:selected').text()
    existingPersonnel.departmentID = $('#edit-user-dept').val()
    confirmUpdateUser()
})
//Populate modal asking users for confirmation
function confirmUpdateUser(){   
    $('#confirm-update-firstname').html(existingPersonnel.firstName)
    $('#confirm-update-surname').html(existingPersonnel.surname)
    $('#confirm-update-email').html(existingPersonnel.email)
    $('#confirm-update-department').html(existingPersonnel.departmentName)
}

$('#confirm-update-user').on('click', ()=> {
    updateUser(existingPersonnel.firstName, existingPersonnel.surname, existingPersonnel.email, existingPersonnel.departmentID, existingPersonnel.id)
})

function updateUser (firstName, lastName, email, departmentID, personnelID) {
    var sendUserDetails = new getData('./Back/updatePersonnel.php',
    {
        firstName,
        lastName,
        email,
        departmentID,
        personnelID
    });$.when(sendUserDetails).then(result => {
        createAlert('user-alert', result.status.description, 'success');
        resetObject(existingPersonnel);
        sortPersonnelTableByColumn(0, 'ASC');
    }, err => {
        console.log(err)
    })
}
//Display message asking user to confirm creation 
function confirmCreateNewUser(firstName, surname, email, department){
    $('#confirm-create-firstname').html(firstName)
    $('#confirm-create-surname').html(surname)
    $('#confirm-create-email').html(email)
    $('#confirm-create-department').html(department)
}

function confirmCreateLocation (locationName) {
    $('#confirm-create-location-name').html(locationName)
}

$('#confirm-add-personnel').on('click', ()=>{
    //Global variables passed to createNewUser set in Add-Personnel event listener
    createNewUser(newPersonnel.firstName, newPersonnel.surname, newPersonnel.email, newPersonnel.departmentID)
})

function addLocation(name){
    var insertLocation = new getData('./Back/insertLocation.php', 
    {
        name,
    });$.when(insertLocation).then((result)=> {
        console.log(result);
        $('#create-location-name').html("");
        // sortDepartmentsTableByColumn(0, 'ASC');
        sortLocationsTableByColumn(0, 'ASC')
        createAlert('location-alert', result.status.description, 'success');
    }, err => {
        if(err.responseText.indexOf("Duplicate entry") !== -1){
            createAlert('location-alert', "ERROR: Location already exists", 'warning')
        } else {
            createAlert('location-alert', `ERROR: ${err.responseText}`, 'warning' )
        }
        console.log(err)
    })
}

function confirmCreateNewDept(departmentName, locationId, location){
    $('#confirm-create-dept-name').html("");
    $('#confirm-create-dept-location').html("");
    console.log(departmentName, location, locationId)
    // const locationId = locationId;
    $('#confirm-create-dept-name').html(departmentName);
    $('#confirm-create-dept-location').html(location);
}

$('#confirm-add-dept').on('click', ()=> addDepartment(newDepartment.name, newDepartment.locationID));
$('#confirm-add-location').on('click', ()=> addLocation(newLocationName));

function addDepartment (name, locationId) {
    var insertDepartment = new getData('./Back/insertDepartment.php', 
    {
        name,
        locationId
    });$.when(insertDepartment).then((result)=> {
        console.log(result);
        // $('#create-dept-name').html("");
        sortDepartmentsTableByColumn(0, 'ASC');
        createAlert('department-alert', result.status.description, 'success');
    }, err => {
        console.log(err)
        if(err.responseText.indexOf("Duplicate entry") !== -1){
            createAlert('department-alert', "ERROR: Department already exists", 'warning')
        } else {
            createAlert('department-alert', `WARNING: ${err.responseText}`, 'warning' )
        }
    })

}
//Upon confirm, create new user
function createNewUser(firstName, lastName, email, departmentID){
    var insertUser = new getData('./Back/insertUser.php', 
    {
        firstName,
        lastName,
        email,
        departmentID,
    });$.when(insertUser).then(
        (result)=>{
        resetObject(newPersonnel);
        getAllPersonnel(); 
        createAlert('user-alert', result.responseText, 'success');
        scrollFunction();
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
}


function loadToolTips(){
    let tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}

//Fetch user-id from button data attribute to populate user info modal
const editUserModal = document.getElementById('edit-user-modal')
editUserModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const userId = button.getAttribute('data-id');
    populateUserModal(userId)
})

//Fetch user-id from button data attribute to create confirm delete message
const deleteUserModal = document.getElementById('delete-user-modal');
deleteUserModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const userId = button.getAttribute('data-id');
    populateUserDeleteModal(userId);
})

const deleteDepartmentModal = document.getElementById('delete-department-modal');
deleteDepartmentModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const departmentID = button.getAttribute('data-id');
    populateDepartmentDeleteModal(departmentID);
})

const deleteLocationModal = document.getElementById('delete-location-modal');
deleteLocationModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const locationID = button.getAttribute('data-id');
    populateLocationDeleteModal(locationID);
})



$('#departments-tab').on('click', ()=>sortDepartmentsTableByColumn(0, 'ASC'));

let personnelFormInputs = $('#create-user-form')
let departmentFormInputs = $('#create-dept-form')
let locationFormInputs = $('#create-location-form')
//Check create user/dept/location form is filled out, 'create' button stays inactive until formValid == true:
$('#create-user-form').on('keyup', ()=> {
    let formInputArray = personnelFormInputs.serializeArray()
    console.log(formInputArray)
    const formValid = formInputArray.every(input => input.value.trim() !== "")
    console.log(formValid)
    if(formValid){
        $('#add-personnel').attr({
            'data-bs-toggle': "modal"
        })
        $('#add-personnel > button').attr({
            'disabled': false,
            'title': ""
        })
    } else {
        $('#add-personnel').attr({
            'data-bs-toggle': ""
        })
        $('#add-personnel > button').attr({
            'disabled': true,
            'data-bs-toggle': "tooltip",
            'title': "Please complete all fields to continue"
        })
    }
})

$('#create-dept-form').on('keyup', ()=> {
    let deptFormInputArray = departmentFormInputs.serializeArray()
    console.log(deptFormInputArray)
    const formValid = deptFormInputArray.every(input => input.value.trim() !== "")
    if(formValid){
        $('#add-dept').attr({
            'data-bs-toggle': "modal"
        })
        $('#add-dept > button').attr({
            'disabled': false,
            'title': ""
        })
    } else {
        $('#add-dept').attr({
            'data-bs-toggle': ""
        })
        $('#add-dept > button').attr({
            'disabled': true,
            'data-bs-toggle': "tooltip",
            'title': "Please complete all fields to continue"
        })
    }
})

$('#create-location-form').on('keyup', ()=> {
    let locationFormInputArray = locationFormInputs.serializeArray()
    console.log(locationFormInputArray)
    const formValid = locationFormInputArray.every(input => input.value.trim() !== "")
    if(formValid){
        $('#add-location').attr({
            'data-bs-toggle': "modal"
        })
        $('#add-location > button').attr({
            'disabled': false,
            'title': ""
        })
    } else {
        $('#add-location').attr({
            'data-bs-toggle': ""
        })
        $('#add-location > button').attr({
            'disabled': true,
            'data-bs-toggle': "tooltip",
            'title': "Please complete all fields to continue"
        })
    }
})

$('#add-personnel').on('click', function (event) {
    event.preventDefault;
    resetObject(newPersonnel)
    console.log(JSON.stringify(newPersonnel))
        //Update newPersonnelObject
        newPersonnel.firstName = capitalise($('#create-user-firstname').val().trim());
        newPersonnel.surname = capitalise($('#create-user-surname').val().trim());
        newPersonnel.email = $('#create-user-email').val().trim();
        newPersonnel.department = $("#create-user-dept option:selected").text();
        newPersonnel.departmentID = $('#create-user-dept').val();
        //Display newPersonnelObject to user in modal and ask to confirm action
        confirmCreateNewUser(newPersonnel.firstName, newPersonnel.surname, newPersonnel.email, newPersonnel.department)
})

$('#add-location').on('click', event => {
    event.preventDefault;
    newLocationName = capitalise($('#create-location-name').val().trim());
    console.log(newLocationName)
    confirmCreateLocation(newLocationName)
})
$('#create-dept-btn').on('click', ()=>{
    //For some reason sortLocationsByColumn also populates locations dropdown menu in create department modal. Must change!
    sortLocationsTableByColumn(0, 'ASC');
    $('#create-dept-name').html("");
});

$('#add-dept').on('click', event => {
    event.preventDefault;
    newDepartment.name = capitalise($('#create-dept-name').val().trim());
    newDepartment.location = $('#dept-location-dropdown option:selected').text();
    newDepartment.locationID = $('#dept-location-dropdown').val();
    confirmCreateNewDept(newDepartment.name, newDepartment.locationID, newDepartment.location);
})


//Event listeners for buttons in table headers, sort table values by ascending or descending depending on data attribute of button
$('#p-surname').on('click', ()=> {
    if($('#p-surname').attr('data') == 'up'){
        sortPersonnelTableByColumn(0, 'ASC')
        $('#p-surname').attr('data', 'down');

        $('#p-surname > i').attr('class', '')
        $('#p-surname > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#p-surname').attr('data') == 'down'){
        sortPersonnelTableByColumn(0, 'DESC')
        $('#p-surname').attr('data', 'up');

        $('#p-surname > i').attr('class', '')
        $('#p-surname > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#p-forename').on('click', ()=> {
    if($('#p-forename').attr('data') == 'up'){
        sortPersonnelTableByColumn(1, 'ASC')
        $('#p-forename').attr('data', 'down');
        $('#p-forename > i').attr('class', '')
        $('#p-forename > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#p-forename').attr('data') == 'down'){
        sortPersonnelTableByColumn(1, 'DESC')
        $('#p-forename').attr('data', 'up');
        $('#p-forename > i').attr('class', '')
        $('#p-forename > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#p-email').on('click', ()=> {
    if($('#p-email').attr('data') == 'up'){
        sortPersonnelTableByColumn(2, 'ASC')

        $('#p-email > i').attr('class', '')
        $('#p-email > i').attr("class", "fa-solid fa-sort-asc")
        $('#p-email').attr('data', 'down');
    } else if ($('#p-email').attr('data') == 'down'){
        sortPersonnelTableByColumn(2, 'DESC')
        $('#p-email').attr('data', 'up');

        $('#p-email > i').attr('class', '')
        $('#p-email > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#p-dept').on('click', ()=> {
    if($('#p-dept').attr('data') == 'up'){
        sortPersonnelTableByColumn(3, 'ASC')
        $('#p-dept').attr('data', 'down');

        $('#p-dept > i').attr('class', '')
        $('#p-dept > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#p-dept').attr('data') == 'down'){
        sortPersonnelTableByColumn(3, 'DESC')
        $('#p-dept').attr('data', 'up');

        $('#p-dept > i').attr('class', '')
        $('#p-dept > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#p-location').on('click', ()=> {
    if($('#p-location').attr('data') == 'up'){
        sortPersonnelTableByColumn(4, 'ASC')
        $('#p-location').attr('data', 'down');

        $('#p-location > i').attr('class', '')
        $('#p-location > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#p-location').attr('data') == 'down'){
        sortPersonnelTableByColumn(4, 'DESC')
        $('#p-location').attr('data', 'up');

        $('#p-location > i').attr('class', '')
        $('#p-location > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#d-name').on('click', ()=> {
    if($('#d-name').attr('data') == 'up'){
        sortDepartmentsTableByColumn(0, 'ASC')
        $('#d-name').attr('data', 'down');

        $('#d-name > i').attr('class', '')
        $('#d-name > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#d-name').attr('data') == 'down'){
        sortDepartmentsTableByColumn(0, 'DESC')
        $('#d-name').attr('data', 'up');

        $('#d-name > i').attr('class', '')
        $('#d-name > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#d-location-name').on('click', ()=> {
    if($('#d-location-name').attr('data') == 'up'){
        sortDepartmentsTableByColumn(1, 'ASC')
        $('#d-location-name').attr('data', 'down');

        $('#d-location-name > i').attr('class', '')
        $('#d-location-name > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#d-location-name').attr('data') == 'down'){
        sortDepartmentsTableByColumn(1, 'DESC')
        $('#d-location-name').attr('data', 'up');

        $('#d-location-name > i').attr('class', '')
        $('#d-location-name > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#d-personnel-count').on('click', ()=> {
    if($('#d-personnel-count').attr('data') == 'up'){
        sortDepartmentsTableByColumn(2, 'ASC')
        $('#d-personnel-count').attr('data', 'down');

        $('#d-personnel-count > i').attr('class', '')
        $('#d-personnel-count > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#d-personnel-count').attr('data') == 'down'){
        sortDepartmentsTableByColumn(2, 'DESC')
        $('#d-personnel-count').attr('data', 'up');

        $('#d-personnel-count > i').attr('class', '')
        $('#d-personnel-count > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#l-name').on('click', ()=> {
    if($('#l-name').attr('data') == 'up'){
        sortLocationsTableByColumn(0, 'ASC')
        $('#l-name').attr('data', 'down');

        $('#l-name > i').attr('class', '')
        $('#l-name > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#l-name').attr('data') == 'down'){
        sortLocationsTableByColumn(0, 'DESC')
        $('#l-name').attr('data', 'up');

        $('#l-name > i').attr('class', '')
        $('#l-name > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#l-dept-count').on('click', ()=> {
    if($('#l-dept-count').attr('data') == 'up'){
        sortLocationsTableByColumn(1, 'ASC')
        $('#l-dept-count').attr('data', 'down');

        $('#l-dept-count > i').attr('class', '')
        $('#l-dept-count > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#l-dept-count').attr('data') == 'down'){
        sortLocationsTableByColumn(1, 'DESC')
        $('#l-dept-count').attr('data', 'up');

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
$( document ).ready(getAllPersonnel(), getAllDepartments())