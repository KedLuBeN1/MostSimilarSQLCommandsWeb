function submitSql() {

    const sqlCommand = document.getElementById('sqlCommand').value;
    const useIdentifiers = document.getElementById('useIdentifiers').checked;
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const sqlCommandsList = document.getElementById("sqlCommandsList");

    loadingSpinner.style.display = "block";
    errorMessage.style.display = "none";

    fetch('http://localhost:8080/processSql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({sqlQuery: sqlCommand, useIdentifiers: useIdentifiers}),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorMessage => {
                    throw new Error('Server returned ' + response.status + ' ' + response.statusText + ': ' + errorMessage);
                });
            }
            return response.json()
        })
        .then(data => {

            sqlCommandsList.style.display = "block";
            sqlCommandsList.innerHTML = "";

            data.forEach(item => {
                const sqlElement = document.createElement("a");

                sqlElement.href = "https://stackoverflow.com/questions/" + item.questionId;
                sqlElement.target = "_blank";

                const listItem = document.createElement("li");

                const sqlText = document.createElement("div");
                sqlText.classList.add("sql-text");
                sqlText.textContent = item.sqlStatement;

                const similarityText = document.createElement("div");
                similarityText.classList.add("similarity-text");
                similarityText.textContent = item.similarity;

                listItem.appendChild(sqlText);
                listItem.appendChild(similarityText);
                sqlElement.appendChild(listItem);

                sqlCommandsList.appendChild(sqlElement);
            });

            loadingSpinner.style.display = "none";
            sqlCommandsList.style.maxHeight = "400px";
            sqlCommandsList.style.overflowY = "auto";
        })
        .catch(error => {
            console.error('Error:', error.message);
            errorMessage.style.display = "block";
            errorMessage.textContent =  error.message;
            loadingSpinner.style.display = "none";
            sqlCommandsList.style.display = "none";
        });
}