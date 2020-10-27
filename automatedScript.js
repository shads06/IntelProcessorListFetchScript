function exportToCsv(filename, rows) {
  var processRow = function(row) {
    var finalVal = '';
    for (var j = 0; j < row.length; j++) {
      var innerValue = row[j] === null ? '' : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      }
      var result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0)
        result = '"' + result + '"';
      if (j > 0)
        finalVal += ',';
      finalVal += result;
    }
    return finalVal + '\n';
  };

  var csvFile = '';
  for (var i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], {
    type: 'text/csv;charset=utf-8;'
  });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

async function fetchTheDOM(url) {
  return fetch(url)
    .then(e => e.blob(),console.error)
    .then(e => e.text(),console.error)
    .then((f) => {
      var parser = new DOMParser();
      return parser.parseFromString(f, 'text/html');
    },console.error).catch(console.error)
}

function grabData(document) {
  // Create a variable to store the master heading of the CSV Data
  var CSVDataMasterHeadingRow = "";

  // Create a variable to store the heading of the CSV Data
  var CSVDataHeadingRow = "";

  // Create a variable to store the row content of the csv data
  var CSVContentRow = "";

  // Create a variable to store the complete csv data with header and content
  var CSVDATA = "";

  // Get Processor Title
  var title = document.querySelector(".headline-font-clear-bold").innerText;

  // Concatenate Processor Name Heading in CSV Data Master Heading Row
  CSVDataMasterHeadingRow = CSVDataMasterHeadingRow.concat("Processor Name");

  // Concatenate Empty data for CSV Data Heading Row
  CSVDataHeadingRow = CSVDataHeadingRow.concat(" ");

  // Concatenate Processor Name in CSV Data Content Row
  CSVContentRow = CSVContentRow.concat(title);

  // Get all heading sections separately from the above techSectionHeading. Above one contains just heading but this one contains all sections
  var techSections = document.getElementsByClassName("tech-section");

  // Get the count of total number of sections to loop through
  var totalTechSections = techSections.length;

  // Set the section iterating counter to interate through each section
  var techSectionsIndex = 0;

  // Loop through each section
  for (techSectionsIndex = 0; techSectionsIndex < totalTechSections; techSectionsIndex++) {

    // Get Current Section Heading  element
    var techSectionHeading = techSections[techSectionsIndex].getElementsByClassName("tech-heading");

    // Create a variable to store section heading
    var heading = "";

    // Get the section heading
    heading = techSectionHeading[0].innerText;

    // there is a one section in which there is no heading but that section has content, add a trailing | to identify it as a separate section heading
    if (heading == "" || heading == undefined) {
      heading = "|";
    }

    // Concatenate Section Name as Master heading
    CSVDataMasterHeadingRow = CSVDataMasterHeadingRow.concat("~", heading);

    // Get all rows for the current section
    var rows = techSections[techSectionsIndex].getElementsByClassName("mobileRow");

    // Set row index to iterate through each row for the current section
    var rowsindex = 0;

    // Loop through each data row i.e. content
    for (rowsindex = 0; rowsindex < rows.length; rowsindex++) {

      // Get the content of the current row
      data = rows[rowsindex].innerText;

      // Split the content to get heading and content
      var splittedData = data.split("\n");

      // Store the heading
      var contentHeading = splittedData[0];

      // Store the content
      var contentContent = splittedData[1];

      // Concatenate Content heading in CSVDataHeadingRow
      CSVDataHeadingRow = CSVDataHeadingRow.concat("~", contentHeading);

      // Concatenate Content Content in CSVContentRow
      CSVContentRow = CSVContentRow.concat("~", contentContent);

      if (rowsindex == 0)
        continue;
      else
        // Concatenate Empty data in master heading row
        CSVDataMasterHeadingRow = CSVDataMasterHeadingRow.concat("~", " ");

    }

  }

  // Concatenate Content heading in CSVDataHeadingRow
  CSVDataHeadingRow = CSVDataHeadingRow.concat("`");

  // Concatenate Content Content in CSVContentRow
  CSVContentRow = CSVContentRow.concat("`");

  // Concatenate Empty data in master heading row
  CSVDataMasterHeadingRow = CSVDataMasterHeadingRow.concat("`");

  CSVDATA = CSVDATA.concat(CSVDataMasterHeadingRow, CSVDataHeadingRow, CSVContentRow);

  return [CSVDataMasterHeadingRow.split("~"), CSVDataHeadingRow.split("~"), CSVContentRow.split("~")]

}


fetchTheDOM("https://www.intel.com/content/www/us/en/products/processors/core/i5-processors.html")
  .then(document => {
  	console.log("fetched main url")
    var processorLinks = Array.from(document.querySelectorAll(".prodNameTitle.prodNameList")).map(e => e.parentElement.href)
	
  	console.log(`Got ${processorLinks.length} links for processors`);
  
  	var linksQueued = 0;
    var promises = [];
    var allCSV = [];

    for (var link of processorLinks) {
    	console.log(linksQueued+" links queued")
      promises.push(fetchTheDOM(link))
    }

    Promise.all(promises)
      .then(documents => {
      	console.log("Done fetching all links")
        for (var doc of documents) {
          if (allCSV.length < 2) {
            var data = grabData(doc);
            allCSV.push(data[0]);
            allCSV.push(data[1]);
            allCSV.push(data[2]);
          } else {
            var data = grabData(doc);
            allCSV.push(data[2]);
          }
        }
      })
      .finally(() => {
      	console.log("Exporting csv file...")
        exportToCsv("all.csv", allCSV)
      })

  })
