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
    });$.when(getPersonnelSearchResults).then((result)=>populatePersonnelTable(result))
}