let chartData = null;
        let chart = null;
    
        function loadCSV(file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const csvData = e.target.result;
            processData(csvData);
          };
          reader.readAsText(file);
        }
    
        function processData(csvData) {
          const lines = csvData.split('\n');
          const headers = lines[0].split(',');
          const data = [];
    
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length === headers.length) {
              const entry = {};
              for (let j = 0; j < headers.length; j++) {
                entry[headers[j]] = values[j];
              }
              data.push(entry);
            }
          }
    
          chartData = data;
          displayPreview(data);
        }
    
        function displayPreview(data) {
          const table = document.createElement('table');
          const headers = Object.keys(data[0]);
    
          let tableHTML = '<thead><tr>';
          for (const header of headers) {
            tableHTML += `<th>${header}</th>`;
          }
          tableHTML += '</tr></thead>';
    
          tableHTML += '<tbody>';
          for (const entry of data) {
            tableHTML += '<tr>';
            for (const header of headers) {
              tableHTML += `<td>${entry[header]}</td>`;
            }
            tableHTML += '</tr>';
          }
          tableHTML += '</tbody>';
    
          table.innerHTML = tableHTML;
          document.getElementById('dataPreview').innerHTML = '';
          document.getElementById('dataPreview').appendChild(table);
        }
    
        function generateChart() {
        const selectedChartType = document.getElementById('chartType').value;
        const chartContainer = document.getElementById('chart');
        const chartWidth = 550;
        const chartHeight = 350;

        if (chart) {
          chart.destroy();
        }

        const ctx = chartContainer.getContext('2d');
        let chartConfig = null;

        if (selectedChartType === 'line') {
          chartConfig = {
            type: 'line',
            data: {
              labels: chartData.map(entry => entry.Date),
              datasets: [
                {
                  label: 'Valores',
                  data: chartData.map(entry => entry.Value),
                  borderColor: 'rgb(75, 192, 192)',
                  borderWidth: 1,
                },
              ],
            },
          };
        } else if (selectedChartType === 'bar') {
          chartConfig = {
            type: 'bar',
            data: {
              labels: chartData.map(entry => entry.Date),
              datasets: [
                {
                  label: 'Valores',
                  data: chartData.map(entry => entry.Value),
                  backgroundColor: 'rgb(75, 192, 192)',
                  borderColor: 'rgb(75, 192, 192)',
                  borderWidth: 1,
                },
              ],
            },
          };
        } else if (selectedChartType === 'pie') {
          chartConfig = {
            type: 'pie',
            data: {
              labels: chartData.map(entry => entry.Date),
              datasets: [
                {
                  data: chartData.map(entry => entry.Value),
                  backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                  ],
                },
              ],
            },
          };
        }

        chart = new Chart(ctx, chartConfig);
      }
    
        function saveChart() {
          const chartContainer = document.getElementById('chart');
          const downloadLink = document.createElement('a');
          downloadLink.href = chartContainer.toDataURL('image/png');
          downloadLink.download = 'chart.png';
          downloadLink.click();
        }
    
        document.getElementById('csvFileInput').addEventListener('change', function () {
          loadCSV(this.files[0]);
        });
    
        document.getElementById('generateChart').addEventListener('click', generateChart);
        document.getElementById('saveChart').addEventListener('click', saveChart);