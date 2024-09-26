async function displayNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    // get all notes
    const data = await fetch('/api/v1/md/download/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
    const records = await data.json()
    if (records.files) {
        const list = document.createElement('ul');
        records.files.forEach(note => {
            const id = note.id;
            const listItem = document.createElement('li');
            listItem.innerHTML = `
            <span>${note.filename}</span>
            <div>

            <a href="/api/v1/md/check/${id}" target="_blank">
            <button id="submitBtn" >Check Grammar</button>
            </a>
            
            <a href="/api/v1/md/render/${id}" target="_blank">
            <button id="submitBtn">Render In HTML</button>
            </a>

            </div>
            
            <div>
            <button id="deleteBtn" onclick="deleteNote('${id}')">Delete</button>
            </div>
            `;
            list.appendChild(listItem);
        })
        notesList.appendChild(list);

    } else {
        const NotFound = document.createElement('div');
        NotFound.innerHTML = `<div id="NotFound">No Files Found !</div>`;
        notesList.appendChild(NotFound);

    }

}

async function saveNote() {
    const noteTitle = document.getElementById('note-title').value.trim();
    const noteText = document.getElementById('note-text').value.trim();

    if (!noteText) {
        alert("u have to write something");
        return
    }
    if (!noteTitle) {
        alert("u have to write Title");
        return
    }
    await fetch(`/api/v1/md/save`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Title: noteTitle, Body: noteText }),
    })
    document.getElementById('note-text').value = '';
    document.getElementById('note-title').value = '';
    await displayNotes();

}

async function deleteNote(noteId) {
    await fetch(`/api/v1/md/${noteId}`, {
        method: 'DELETE'
    })
    console.log(noteId);
    await displayNotes();
}

displayNotes();