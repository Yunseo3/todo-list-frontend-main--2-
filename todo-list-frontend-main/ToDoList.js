// 할 일 추가
function addTask() {
    var newTask = document.getElementById("task").value.trim();
    if (newTask) {
        fetch('http://localhost:8080/todolist/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({content: newTask, date: new Date().toISOString().slice(0,10)}),
        })
            .then(response => response.json())
            .then(data => {
                var taskList = document.getElementById("taskList");
                var newRow = taskList.insertRow();

                newRow.insertCell(0).textContent = new Date().toLocaleDateString();
                newRow.insertCell(1).innerHTML = '<span class="task-content" onclick="editTask(this,' + data.id + ')">' + newTask + '</span>';
                newRow.insertCell(2).innerHTML = '<button onclick="deleteTask(this.parentNode.parentNode,' + data.id + ')">X</button>';
                document.getElementById("task").value = "";
                newRow.cells[0].setAttribute('data-date', new Date().toISOString().slice(0,10));
            })
            .catch((error) => console.error('Error:', error));
    }
}

// 할 일 수정
function editTask(taskSpan, id) {
    var originalText = taskSpan.textContent;

    var editInput = document.createElement('input');
    editInput.setAttribute('type', 'text');
    editInput.setAttribute('value', originalText);

    editInput.addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            var newText = editInput.value.trim();
            if(newText) {
                var existingDate = taskSpan.parentNode.previousElementSibling.getAttribute('data-date');
                fetch(`http://localhost:8080/todolist/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: newText,  date: existingDate }),
                })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    taskSpan.textContent = newText; 
                })
                .catch(error => console.error('Error:', error));
            }
        }
    });

    taskSpan.textContent = ""; 
    taskSpan.appendChild(editInput);
    editInput.focus();
}


// 할 일 삭제
function deleteTask(row, id) { 
    fetch(`http://localhost:8080/todolist/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            row.parentNode.removeChild(row);
        })
        .catch(error => console.error('Error:', error));
}

