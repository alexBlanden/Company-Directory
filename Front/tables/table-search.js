// export function searchTable(inputName, tableName, selectID = 0) {
// //    var tableColumn = $('#personnel-search-select').val()
//     var tableColumn
//    if ($(selectID).val()) {
//     tableColumn = $(selectID).val()
//    } else {
//     tableColumn = 0
//    }
//     //Declare variables
//     var input,filter, table, tr, td, txtValue;
//     // input = document.getElementById("personnel-search-input");
//     input = document.getElementById(inputName);
//     //Search is not case sensitive
//     filter = input.value.toUpperCase();
//     // table = document.getElementById("personnel-table");
//     table = document.getElementById(tableName);
//     tr = table.getElementsByTagName("tr");



//     //Loop through all table rows
//     for(let i = 0; i < tr.length; i++) {
//         td = tr[i].getElementsByTagName("td")[tableColumn];
//         if (td) {
//             txtValue = td.textContent || td.innerText;
//             //If user input value doesn't exist as substring in the text value of the table cell, css display value is set to none:
//             if(txtValue.toUpperCase().indexOf(filter) > -1){
//                 tr[i].style.display = "";
//             } else {
//                 tr[i].style.display = "none";
//             }
//         }
//     }

// }
import { getData } from '../get-data.js';
import { populatePersonnelTable } from "../script.js";

export function searchPersonnelTable (searchVal, columnVal) {
    var getPersonnelSearchResults = new getData('./Back/personnelSearch.php', 
    {
        searchVal,
        columnVal
    });$.when(getPersonnelSearchResults).then((result)=>populateSearchPersonnelTable(result))
}
export function searchDeptTable (searchVal) {
    var getPersonnelSearchResults = new getData('./Back/deptSearch.php', 
    {
        searchVal
    });$.when(getPersonnelSearchResults).then((result)=>populateSearchDeptTable(result))
}

export function populateSearchDeptTable (result) {
    console.log(result)
    $('#search-dept-table').html("")
    if(result.data.length == 0){
        $('#search-dept-table').html(`
        <tr>
            <td></td>
            <td>No results found. Please try again.</td>
            <td></td>
        </tr>`)
    }
    for(let i=0; i< result.data.length; i++){
        $('#search-dept-table').append(
            `<tr>
                <td>${result.data[i].name}</td>
                <td><div class="container-fluid d-flex justify-content-around">
                <button type="button" class="btn btn-light edit-user-btn" data-bs-toggle="modal" data-bs-target="#edit-dept-modal" data-table-row="${i+1}" data-id="${result.data[i].id}"><i class="fa-solid fa-pen"></i></button></td>
            </tr>`
        )
    }
}



export function populateSearchPersonnelTable (result) {
    console.log(result)
    $('#search-personnel-table').html("")
    if(result.data.length == 0){
        $('#search-personnel-table').html(`
        <tr>
            <td></td>
            <td>No results found. Please try again.</td>
            <td></td>
        </tr>`)
    }
    for(let i=0; i< result.data.length; i++){
        $('#search-personnel-table').append(
            `<tr>
                <td>${result.data[i].firstName}</td>
                <td>${result.data[i].lastName}</td>
                <td><a href="mailto:${result.data[i].email}"</a>${result.data[i].email}</td>
                <td><div class="container-fluid d-flex justify-content-around">
                <button type="button" class="btn btn-light edit-user-btn" data-bs-toggle="modal" data-bs-target="#edit-user-modal" data-table-row="${i+1}" data-id="${result.data[i].id}"><i class="fa-solid fa-pen"></i></button></td>
            </tr>`
        )
    }
}