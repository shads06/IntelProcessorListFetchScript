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
for(techSectionsIndex=0;techSectionsIndex<totalTechSections;techSectionsIndex++)
{

	// Get Current Section Heading  element
	var techSectionHeading = techSections[techSectionsIndex].getElementsByClassName("tech-heading");

	// Create a variable to store section heading
	var heading = "";
	
	// Get the section heading
	heading = techSectionHeading[0].innerText;
	
	// there is a one section in which there is no heading but that section has content, add a trailing | to identify it as a separate section heading
	if(heading == "" || heading == undefined)
	{
		heading = "|";
	}

	// Concatenate Section Name as Master heading
	CSVDataMasterHeadingRow = CSVDataMasterHeadingRow.concat("~",heading);
	
	// Get all rows for the current section
	var rows = techSections[techSectionsIndex].getElementsByClassName("mobileRow");
	
	// Set row index to iterate through each row for the current section
	var rowsindex = 0;
	
	// Loop through each data row i.e. content
	for(rowsindex=0;rowsindex<rows.length;rowsindex++)
	{

		// Get the content of the current row
		data = rows[rowsindex].innerText;
		
		// Split the content to get heading and content
		var splittedData = data.split("\n");
		
		// Store the heading
		var contentHeading = splittedData[0];
		
		// Store the content
		var contentContent = splittedData[1];
		
		// Concatenate Content heading in CSVDataHeadingRow
		CSVDataHeadingRow = CSVDataHeadingRow.concat("~",contentHeading);
		
		// Concatenate Content Content in CSVContentRow
		CSVContentRow = CSVContentRow.concat("~",contentContent);
		
		if(rowsindex == 0)
			continue;
		else
			// Concatenate Empty data in master heading row
			CSVDataMasterHeadingRow = CSVDataMasterHeadingRow.concat("~"," ");
		
	}
	
}

// Concatenate Content heading in CSVDataHeadingRow
CSVDataHeadingRow = CSVDataHeadingRow.concat("`");
		
// Concatenate Content Content in CSVContentRow
CSVContentRow = CSVContentRow.concat("`");
		
// Concatenate Empty data in master heading row
CSVDataMasterHeadingRow = CSVDataMasterHeadingRow.concat("`");

CSVDATA = CSVDATA.concat(CSVDataMasterHeadingRow,CSVDataHeadingRow,CSVContentRow);
	
console.log(CSVDATA);

/*
var hiddenElement = document.createElement('a');
hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(CSVDATA);
hiddenElement.target = '_blank';
hiddenElement.download = 'CSVDATA.csv';
hiddenElement.click();
*/

/*
var rows = document.getElementsByClassName("mobileRow");

var rowsindex = 0;

for(rowsindex=0;rowsindex<rows.length;rowsindex++)

{

	data = rows[rowsindex].innerText;


	var splittedData = data.split("\n");

	if(splittedData[0] == "" || splittedData[0] == undefined)
		continue;

	if(splittedData[1] == "" || splittedData[1] == undefined)
		continue;

	console.log(splittedData[0]);

	console.log(splittedData[1]);
}


var techSections = document.getElementsByClassName("tech-section");

var totalTechSections = techSections.length;

var techSectionsIndex = 0;

for(techSectionsIndex=0;techSectionsIndex<totalTechSections;techSectionsIndex++)
{
	var totalLabels = techSections[techSectionsIndex].querySelectorAll(".tech-label");

	console.log(totalLabels.length);
}
*/