export function searchTable() {
    //Declare variables
    var input,filter, table, tr, td, txtValue;
    input = document.getElementById("personnel-search-input");
    //Search is not case sensitive
    filter = input.value.toUpperCase();
    table = document.getElementById("personnel-table");
    tr = table.getElementsByTagName("tr");

    //Loop through all table rows
    for(let i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            //If user input value doesn't exist as substring in the text value of the table cell, css display value is set to none:
            if(txtValue.toUpperCase().indexOf(filter) > -1){
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }

}
