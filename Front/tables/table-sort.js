import { getData } from "../get-data.js"
import { 
    populatePersonnelTable,
    populateDepartmentsTable,
    populateLocationsTable,
    populateLocationsDropdown,
 } from "../script.js";


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

export {
    sortPersonnelTableByColumn,
    sortDepartmentsTableByColumn,
    sortLocationsTableByColumn
}