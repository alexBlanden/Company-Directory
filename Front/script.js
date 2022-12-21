import {
    getData
} from './get-data.js'

import {
    sortTableByColumnAsc, 
    sortTableByColumnDesc
} from './tables/table-sort.js'

function getAllData () {
    var selectAll = new getData('../Project2/Back/getAll.php', {

    });$.when(selectAll).then((result)=>{
        console.log(result);
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
                <button type="button" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>
            </div></td>
        </tr>`)
        }

    }, function (error){
        console.log(error.responseText)
    })
}

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

// $('.edit-user-btn').on('click', function (){editUserModal.toggle(), console.log('opening modal')});
const editUserModal = document.getElementById('edit-user-modal')
editUserModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const userId = button.getAttribute('data-id');
    populateUserModal(userId)

})

// $('#create-user-btn').on('click', ()=>editUserModal.toggle());


//Event listeners for buttons in table headers, sort table values by ascending or descending depending on data attribute of button
$('#p-surname').on('click', ()=> {
    if($('#p-surname').attr('data') == 'up'){
        sortTableByColumnAsc("personnel-table", 0)
        $('#p-surname').attr('data', 'down');

        $('#p-surname > i').attr('class', '')
        $('#p-surname > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#p-surname').attr('data') == 'down'){
        sortTableByColumnDesc("personnel-table", 0)
        $('#p-surname').attr('data', 'up');

        $('#p-surname > i').attr('class', '')
        $('#p-surname > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#p-forename').on('click', ()=> {
    if($('#p-forename').attr('data') == 'up'){
        sortTableByColumnAsc("personnel-table", 1)
        $('#p-forename').attr('data', 'down');
        $('#p-forename > i').attr('class', '')
        $('#p-forename > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#p-forename').attr('data') == 'down'){
        sortTableByColumnDesc("personnel-table", 1)
        $('#p-forename').attr('data', 'up');
        $('#p-forename > i').attr('class', '')
        $('#p-forename > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#p-email').on('click', ()=> {
    if($('#p-email').attr('data') == 'up'){
        sortTableByColumnAsc("personnel-table", 2)

        $('#p-email > i').attr('class', '')
        $('#p-email > i').attr("class", "fa-solid fa-sort-asc")
        $('#p-email').attr('data', 'down');
    } else if ($('#p-email').attr('data') == 'down'){
        sortTableByColumnDesc("personnel-table", 2)
        $('#p-email').attr('data', 'up');

        $('#p-email > i').attr('class', '')
        $('#p-email > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#p-dept').on('click', ()=> {
    if($('#p-dept').attr('data') == 'up'){
        sortTableByColumnAsc("personnel-table", 3)
        $('#p-dept').attr('data', 'down');

        $('#p-dept > i').attr('class', '')
        $('#p-dept > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#p-dept').attr('data') == 'down'){
        sortTableByColumnDesc("personnel-table", 3)
        $('#p-dept').attr('data', 'up');

        $('#p-dept > i').attr('class', '')
        $('#p-dept > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$('#p-location').on('click', ()=> {
    if($('#p-location').attr('data') == 'up'){
        sortTableByColumnAsc("personnel-table", 4)
        $('#p-location').attr('data', 'down');

        $('#p-location > i').attr('class', '')
        $('#p-location > i').attr("class", "fa-solid fa-sort-asc")
    } else if ($('#p-location').attr('data') == 'down'){
        sortTableByColumnDesc("personnel-table", 4)
        $('#p-location').attr('data', 'up');

        $('#p-location > i').attr('class', '')
        $('#p-location > i').attr("class", "fa-solid fa-sort-desc")
    }
});

$( document ).ready(getAllData())