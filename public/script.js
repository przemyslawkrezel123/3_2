const button = document.getElementById("searchBtn");
const tableBody = document.getElementById("resultsBody");
const errorBox = document.getElementById("error");
const status = document.getElementById("status");

button.addEventListener("click", downloadData);

async function downloadData() {
  errorBox.style.display = "none";
  tableBody.innerHTML = "";

  const datasetid = document.getElementById("datasetid").value;
  const locationid = document.getElementById("locationid").value;
  const startdate = document.getElementById("startdate").value;
  const enddate = document.getElementById("enddate").value;
  const limit = document.getElementById("limit").value;

  const query = new URLSearchParams({ datasetid, locationid, startdate, enddate, limit }).toString();

  try {
    const res = await fetch(`/data?${query}`);
    if (!res.ok) throw new Error(`Błąd serwera: ${res.status}`);

    const data = await res.json();

    if (!data.results) {
      tableBody.innerHTML = `<tr><td colspan="5">Brak danych</td></tr>`;
      return;
    }

    data.results.forEach(d => {
      const row = `
        <tr>
          <td>${d.datatype || "-"}</td>
          <td>${d.station || "-"}</td>
          <td>${d.date || "-"}</td>
          <td>${d.value ?? "-"}</td>
          <td>${d.attributes || "-"}</td>
        </tr>`;
      tableBody.innerHTML += row;
    });
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="5">Błąd: ${err.message}</td></tr>`;
  }
}

