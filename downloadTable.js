/*eslint-env browser*/
/*eslint no-console:0*/
/*global d3*/

'use-strict'


function enableDownload(measurements) {

    //var csvList = d3.csv.format(measurements, ['Volume', 'Pressure']);
    var csvList = d3.csv.format(measurements);
    console.log(csvList);
    document.getElementById('download').href = "data:text/csv;charset=utf-8," + encodeURIComponent(csvList);
    document.getElementById('download').classList.remove('disabled');
}


function scrapeTable() {
    var tempObj = {},
        tKeys = document.querySelectorAll('thead tr th'),
        tRows = document.querySelectorAll('tbody tr'),
        list = [];

    //fills list with objects that match each table row
    tRows.forEach(function (row) {
        tempObj = {};
        row.childNodes.forEach(function (td, i) {
            tempObj[tKeys[i].innerText] = td.innerHTML;
        });
        list.push(tempObj);
    });

    enableDownload(list);
}

function startListening() {
    var config = {
            childList: true
        },
        target = document.querySelector('table tbody'),
        observer = new MutationObserver(function (mutations) {
            scrapeTable();
            //console.log(mutations);
        })

    observer.observe(target, config);
}
