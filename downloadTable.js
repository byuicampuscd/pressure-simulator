/*eslint-env browser*/
/*eslint no-console:0*/
/*eslint no-unused-vars:1*/
/*global d3*/

'use-strict'


function enableDownload(measurements) {

    //var csvList = d3.csv.format(measurements, ['Volume', 'Pressure']);
    var csvList = d3.csv.format(measurements);
    document.getElementById('download').href = "data:text/csv;charset=utf-8," + encodeURIComponent(csvList);
    document.getElementById('download').classList.remove('disabled');
}


function scrapeTable() {
    var tempObj = {},
        tKeys = document.querySelectorAll('thead tr th'),
        tRows = document.querySelectorAll('tbody tr'),
        list = [];

    //fills list with objects that match each table row
    for (var i = 0; i < tRows.length; i++) {
        tempObj = {};
        for (var j = 0; j < tRows[i].childNodes.length; j++) {
            tempObj[tKeys[j].innerText] = tRows[i].childNodes[j].innerHTML;
        }
        list.push(tempObj);
    }
    enableDownload(list);
}

function startListening() {
    var config = {
            childList: true
        },
        target = document.querySelector('table tbody'),
        observer = new MutationObserver(function () {
            scrapeTable();
        })

    observer.observe(target, config);
}
