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
} from './capitaliseWord.js'

import {
    searchTable
} from './tables/table-search.js'

var newPersonnelFirstName,
    newPersonnelSurname,
    newPersonnelEmail,
    newPersonnelDepartment,
    newPersonneldepartmentId

var newDepartmentName,
    newDepartmentLocation,
    newDepartmentLocationID;

var newLocationName;
window.onscroll = function () {
    scrollFunction();
}

$("#personnel-search").keyup(()=> searchTable("personnel-search-input", "personnel-table", 'personnel'))
$("#dept-search").keyup(()=> searchTable("dept-search-input", "departments-table"))

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
        if(result.data.department_count == 0){
            $('#locations-table-body').append(`
        <tr>
            <td>${result.data[i].location_name}</td>
            <td>${result.data[i].department_count}</td>
            <td><div class="container-fluid d-flex justify-content-around">
                                <button type="button" class="btn btn-light"><i class="fa-solid fa-pen"></i></button>
                                <button type="button" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>
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
        const fullName = `${result.data.personnel[0].firstName} ${result.data.personnel[0].lastName}`
        const id = result.data.personnel[0].id
        console.log(id)
        $('#confirm-delete-user').html(`Are you sure you want to delete ${fullName}? You cannot undo this action`)
        $('#confirm-delete-user-button').on('click', ()=>deleteUser(id))
    })
}

function populateDepartmentDeleteModal (id) {
    var selectDepartmentByID = new getData('./Back/getDepartmentByID.php',
    {
        id
    });$.when(selectDepartmentByID).then(result => {
        const id = result.data[0].id;
        console.log(result);
        $('#confirm-delete-department').html(`Are you sure you want to delete ${result.data[0].name}? You cannot undo this action`)
        $('#confirm-delete-department-button').on('click', ()=>deleteDepartment(id));
    }, error=> console.log(error))
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
        createAlert('department-alert', result.data, 'danger');
        getAllDepartments();
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

function getDepartments () {
    var getDepartmentAndLocation = new getData('./Back/getDepartmentAndLocation.php', {

    });$.when(getDepartmentAndLocation).then(result=> {
        console.log(result)
        populateDepartmentsTable(result)
    });
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
                                <button type="button" class="btn btn-danger" data-id="${result.data.departmentAndLocation[i].deptID}" data-bs-target="#delete-department-modal" data-bs-toggle="modal" data-bs-target="delete-department-modal"><i class="fa-solid fa-trash"></i></button>
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
//Fetch user details for edit
function populateUserModal(id) {
    var selectUserById = new getData('./Back/getPersonnelByID.php', 
    {
        id
    });$.when(selectUserById).then(result => {
        console.log(result)
        const fullName = `${result.data.personnel[0].firstName} ${result.data.personnel[0].lastName}`
        $('#edit-user-title').html(fullName)
        $('#edit-user-forename').attr('value', result.data.personnel[0].firstName);
        $('#edit-user-surname').attr('value', result.data.personnel[0].lastName);
        $('#edit-user-email').attr('value', result.data.personnel[0].email);

        $('#edit-user-dept').html("");
        for(let i = 0; i < result.data.department.length; i++){
            $('#edit-user-dept').append(`<option value="${result.data.department[i].id}">${result.data.department[i].name}</option>
        `)}

        $('#edit-user-dept').val(result.data.personnel[0].departmentID);
    })
}
//Display message asking user to confirm creation 
function confirmCreateNewUser(firstName, surname, email, department, departmentId){
    $('#confirm-create-firstname').html(firstName)
    $('#confirm-create-surname').html(surname)
    $('#confirm-create-email').html(email)
    $('#confirm-create-department').html(department)

    $('#confirm-add-personnel').on('click', ()=>{
        createNewUser(firstName, surname, email, departmentId)
    })
}

function confirmCreateNewDept(departmentName, locationId, location){
    $('#confirm-create-dept-name').html("");
    $('#confirm-create-dept-location').html("");
    console.log(departmentName, location, locationId)
    // const locationId = locationId;
    $('#confirm-create-dept-name').html(departmentName);
    $('#confirm-create-dept-location').html(location);
    $('#confirm-add-dept').on('click', ()=> addDepartment(departmentName, locationId));
}

function addDepartment (name, locationId) {
    var insertDepartment = new getData('./Back/insertDepartment.php', 
    {
        name,
        locationId
    });$.when(insertDepartment).then((result)=> {
        console.log(result);
        $('#create-dept-name').html("");
        getAllDepartments();
        createAlert('department-alert', result.status.description, 'success');
    }, err => console.log(err))

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
        ()=>{
        $('#create-firstname').html("");
        $('#create-surname').html("");
        $('#create-email').html("");
        $('#create-department').html("");
        getAllPersonnel(); 
        getAllDepartments();
        createAlert('user-alert', 'User created successfully!', 'success');
        scrollFunction();
    },
     (err)=> {
        console.log(err);
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

// const createDepartmentModal = document.getElementById('create-dept-modal');
// createDepartmentModal.addEventListener('show.bs.modal', event => {

// })



$('#departments-tab').on('click', ()=>sortDepartmentsTableByColumn(0, 'ASC'));
$('#add-personnel').on('click', event => {
    event.preventDefault;
    newPersonnelFirstName = $('#create-user-firstname').val();
    newPersonnelSurname = $('#create-user-surname').val();
    newPersonnelEmail = $('#create-user-email').val();
    newPersonnelDepartment = $( "#create-user-dept option:selected" ).text();
    newPersonneldepartmentId = $('#create-user-dept').val();
    confirmCreateNewUser(newPersonnelFirstName, newPersonnelSurname, newPersonnelEmail, newPersonnelDepartment, newPersonneldepartmentId)
})


$('#create-dept-btn').on('click', ()=> sortLocationsTableByColumn(0, 'ASC'));
$('#add-dept').on('click', event => {
    event.preventDefault;
    newDepartmentName = capitalise($('#create-dept-name').val());
    newDepartmentLocation = $('#dept-location-dropdown option:selected').text();
    newDepartmentLocationID = $('#dept-location-dropdown').val();
    confirmCreateNewDept(department, locationId, location);
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

$('.btn-sort').on('click', function () {
    $('.btn-sort').removeClass('active');
    $(this).addClass('active');
})

$('#locations-tab').on('click', ()=> {
    sortLocationsTableByColumn(0, 'ASC')
})
$( document ).ready(getAllPersonnel(), getAllDepartments())