/*eslint-env browser*/
/*eslint no-console:0, no-unused-vars:1*/
/*global d3, download*/

'use-strict'

function scrapeTable() {
    function nodeListToArray(nodeList) {
        return Array.prototype.map.call(nodeList, function (node) {
            return node;
        });
    }

    function getTextFromEle(ele) {
        return ele.innerText.trim();
    }

    var tKeys = nodeListToArray(document.querySelectorAll('thead tr th')),
        tRows = nodeListToArray(document.querySelectorAll('tbody tr')),
        list, emptyRowObj;

    //convert headers to just text
    tKeys = tKeys.map(function (ele) {
        return getTextFromEle(ele);
    });

    //fix for if the table does not have any data
    if (tRows.length === 0) {
        //for each key in tKey make a prop in the obj named the same as key and equal to empty string
        emptyRowObj = tKeys.reduce(function (objOut, key) {
            objOut[key] = '';
            return objOut;
        }, {});
        list = [emptyRowObj];
    } else {
        //for each row
        list = tRows.map(function (row) {
            //get the td's (cells) in this row    
            var tds = nodeListToArray(row.querySelectorAll('td')),
                rowObj;
            //for each key in tKey make a prop in the obj named the same as key and equal to the text of the td at the same index
            rowObj = tKeys.reduce(function (objOut, key, index) {
                objOut[key] = getTextFromEle(tds[index]);
                return objOut;
            }, {});
            //send it back to the list array
            return rowObj;

        })
    }

    console.log("list", list);
    return d3.csv.format(list);
}

document.querySelector('#download').addEventListener('click', function () {
    download(scrapeTable(), "PressureSimulatorResults.csv", "text/csv");
});
