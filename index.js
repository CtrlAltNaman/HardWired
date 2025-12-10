let csvData1 = [];
let csvData2 = [];
let chart1, chart2;
let startIndex1 = 0;
let startIndex2 = 0;

// Load both CSV files initially and set up the periodic refresh
document.addEventListener('DOMContentLoaded', (event) => {
  loadCSV1();
  loadCSV2();
  setInterval(updateDisplays, 2000); // Update displays every 2 seconds
});

function loadCSV1() {
  fetch('data1.csv')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(text => {
      csvData1 = parseCSV(text);
      updateGraph1();
      updateTable1();
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation for data1.csv:', error);
    });
}

function loadCSV2() {
  fetch('data2.csv')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(text => {
      csvData2 = parseCSV(text);
      updateGraph2();
      updateTable2();
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation for data2.csv:', error);
    });
}

// Function to parse CSV text
function parseCSV(text) {
  return text.split('\n').map(row => row.split(',').map(cell => cell.trim()));
}

// Function to update displays
function updateDisplays() {
  updateGraph1();
  updateGraph2();
  updateTable1();
  updateTable2();
}

// Function to get next 4 rows of data
function getNextFourRows(data, startIndex) {
  const dataWithoutHeader = data.slice(1); // Remove header row
  const nextFourRows = [];
  for (let i = 0; i < 5; i++) {
    nextFourRows.push(dataWithoutHeader[(startIndex + i) % dataWithoutHeader.length]);
  }
  return nextFourRows;
}

// Function to update the first graph (data1.csv)
function updateGraph1() {
  const nextFourRows = getNextFourRows(csvData1, startIndex1);
  const categories = nextFourRows.map(row => row[0]);
  const values = nextFourRows.map(row => parseFloat(row[1]));
  const ctx = document.getElementById('chart1').getContext('2d');

  if (chart1) {
    chart1.data.labels = categories;
    chart1.data.datasets[0].data = values;
    chart1.update();
  } else {
    chart1 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: categories,
        datasets: [{
          label: 'Value from data1.csv',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  startIndex1 = (startIndex1 + 5) % (csvData1.length - 1); // Update start index for next time
}

// Function to update the second graph (data2.csv)
function updateGraph2() {
  const nextFourRows = getNextFourRows(csvData2, startIndex2);
  const categories = nextFourRows.map(row => row[0]);
  const values = nextFourRows.map(row => parseFloat(row[1]));
  const ctx = document.getElementById('chart2').getContext('2d');

  if (chart2) {
    chart2.data.labels = categories;
    chart2.data.datasets[0].data = values;
    chart2.update();
  } else {
    chart2 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: categories,
        datasets: [{
          label: 'Value from data2.csv',
          data: values,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  startIndex2 = (startIndex2 + 5) % (csvData2.length - 1); // Update start index for next time
}

// Function to display CSV data in a table
function updateTable1() {
  const nextFourRows = getNextFourRows(csvData1, startIndex1);
  const table = document.getElementById('table1');
  table.innerHTML = '';
  
  // Add header row
  const headerRow = document.createElement('tr');
  csvData1[0].forEach(cell => {
    const th = document.createElement('th');
    th.textContent = cell;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Add data rows
  nextFourRows.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
}

// Function to display CSV data in a table
function updateTable2() {
  const nextFourRows = getNextFourRows(csvData2, startIndex2);
  const table = document.getElementById('table2');
  table.innerHTML = '';
  
  // Add header row
  const headerRow = document.createElement('tr');
  csvData2[0].forEach(cell => {
    const th = document.createElement('th');
    th.textContent = cell;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Add data rows
  nextFourRows.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
}
