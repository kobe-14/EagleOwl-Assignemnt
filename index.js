"use strict";

// const input = document.getElementById("file-input");

// input.addEventListener("change", (e) => {
//   const fileReader = new FileReader();

//   fileReader.onload = function (e) {
//     console.log("=.=.=.=.=.=.=.=.=.==.=", e.target.result);
//   };

//   fileReader.readAsText(e.target.files[0]);
// });

// const reader = (filePath) => {
//     const fileReader = new FileReader()

//     fileReader.
// }

document
  .getElementById("file-input")
  .addEventListener("change", readFile, false);

let customerData = [];

function readFile(evt) {
  var files = evt.target.files;
  var file = files[0];
  var reader = new FileReader();
  reader.onload = function (event) {
    var data = event.target.result;
    data = data.replace("data:text/plain;base64,", "");
    const converted1dData = data.split(/[\n,]/);
    const converted2dData = convertTo2dArray(converted1dData, 4);
    var keys = converted2dData.shift(); //gets the first element in 2D array

    //To generate an array of objects of orders
    var orders = converted2dData.map(function (values) {
      return keys.reduce(function (o, k, i) {
        o[k] = values[i];
        return o;
      }, {});
    });

    const totalOrder = orders.length;
    document.getElementById(
      "totalOrder"
    ).innerHTML = `Total Orders Recieved is ${totalOrder}`;

    const totalAmount = orders.reduce((acc, curr) => {
      return acc + parseFloat(curr.Amount);
    }, 0);
    document.getElementById(
      "totalAmount"
    ).innerHTML = `Total Amount is ${totalAmount}`;

    var counts = {}; // Object which has customer name as key and number of orders as value
    orders.forEach((order) => {
      counts[order.Name] = (counts[order.Name] || 0) + 1;
    });

    let orderCounts = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    };

    for (let names in counts) {
      if (counts[names] === 1) orderCounts[1].push(names);
      if (counts[names] === 2) orderCounts[2].push(names);
      if (counts[names] === 3) orderCounts[3].push(names);
      if (counts[names] === 4) orderCounts[4].push(names);
      if (counts[names] === 5 || counts[names] > 5) orderCounts[5].push(names);
    }

    const orderedOnce = document.getElementById("orderedOnce");
    const pText = document.createElement("p");
    pText.innerHTML = "Customers who have ordered only once are:";
    orderedOnce.appendChild(pText);

    const ulTag = document.createElement("ul");

    for (let i = 0; i < orderCounts[1].length; i++) {
      const li = document.createElement("li");
      li.innerHTML = `${orderCounts[1][i]}`;
      ulTag.appendChild(li);
    }

    orderedOnce.appendChild(ulTag);

    //DOM Manipulation for Table
    const tableArea = document.getElementById("tableArea");
    const table = document.createElement("table");

    const tableHeader = document.createElement("thead");
    const tableHeadingRow = document.createElement("tr");

    const headingCell1 = document.createElement("td");
    const headingText1 = document.createTextNode("No. of Orders");
    headingCell1.appendChild(headingText1);
    tableHeadingRow.appendChild(headingCell1);

    const headingCell2 = document.createElement("td");
    const headingText2 = document.createTextNode("Count Of Customers");
    headingCell2.appendChild(headingText2);
    tableHeadingRow.appendChild(headingCell2);

    tableHeader.appendChild(tableHeadingRow);
    table.appendChild(tableHeader);

    const tableBody = document.createElement("tbody");

    for (let i = 0; i < 5; i++) {
      const row = document.createElement("tr");

      const tbCell1 = document.createElement("td");
      let text;
      if (i === 4) text = `${i + 1}+`;
      else text = `${i + 1}`;
      const tbCell1Text = document.createTextNode(text);
      tbCell1.appendChild(tbCell1Text);
      row.appendChild(tbCell1);

      const tbCell2 = document.createElement("td");
      const tbCell2Text = document.createTextNode(
        `${orderCounts[i + 1].length}`
      );
      tbCell2.appendChild(tbCell2Text);
      row.appendChild(tbCell2);

      tableBody.appendChild(row);
    }

    table.appendChild(tableBody);

    tableArea.appendChild(table);

    table.setAttribute("border", "2");

    //Plotly Data
    const yAxisData = Object.values(orderCounts).map((el) => el.length);

    var data = [
      {
        x: Object.keys(orderCounts),
        y: yAxisData,
        type: "bar",
      },
    ];

    Plotly.newPlot("graph", data, {
      annotations: [
        {
          xref: "paper",
          yref: "paper",
          x: 0,
          xanchor: "right",
          y: 1,
          yanchor: "bottom",
          text: "Customers",
          showarrow: false,
        },
        {
          xref: "paper",
          yref: "paper",
          x: 1,
          xanchor: "left",
          y: 0,
          yanchor: "top",
          text: "Orders",
          showarrow: false,
        },
      ],
    });
  };
  reader.readAsText(file);
}

/**
 *
 * @param {1D array that needs to be converted} array
 * @param {Number of columns in 2D array} part
 * @description Returns 2D array
 */
function convertTo2dArray(array, part) {
  var tmp = [];
  for (var i = 0; i < array.length; i += part) {
    if (array[i] === "") {
      break;
    }
    var arr = array.slice(i, i + part);
    arr = arr.map((el) => el.trim());
    tmp.push(arr);
  }
  return tmp;
}
