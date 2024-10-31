// Funcția pentru căutarea cursurilor
async function searchCourses() {
    const searchInput = document.querySelector('section.content .search-input'); // Selectează input-ul din secțiunea corectă
    const query = searchInput.value.trim();
    const resultsContainer = document.getElementById('courseResults');
    resultsContainer.innerHTML = ''; // Curăță rezultatele anterioare

    if (query) {
        const apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.docs && data.docs.length > 0) {
                data.docs.forEach(book => {
                    const bookElement = document.createElement("div");
                    bookElement.className = "course-item"; // Asigură-te că stilizezi această clasă în CSS
                    bookElement.innerHTML = `
                        <h3>${book.title}</h3>
                        <p>Author: ${book.author_name ? book.author_name.join(", ") : "Unknown"}</p>
                        <p>First Published: ${book.first_publish_year || "N/A"}</p>
                        <button onclick="window.open('https://openlibrary.org${book.key}', '_blank')">View Book</button>
                    `;
                    resultsContainer.appendChild(bookElement);
                });
            } else {
                resultsContainer.innerHTML = '<p>No books found.</p>';
            }
        } catch (error) {
            console.error("Error fetching books:", error);
            resultsContainer.innerHTML = '<p>Error fetching books. Please try again later.</p>';
        }
    } else {
        alert("Please enter a search term.");
    }
}

// Funcția pentru generarea roadmap-ului
async function generateRoadmap() {
    const learningGoals = document.getElementById('learningGoals').value.trim();
    const timeAvailable = document.getElementById('timeAvailable').value.trim();
    const interests = document.getElementById('interests').value.trim();
    const resultsContainer = document.getElementById('roadmapResults');
    resultsContainer.innerHTML = ''; // Curăță rezultatele anterioare

    if (learningGoals && timeAvailable && interests) {
        // URL-ul API-ului pentru generarea roadmap-ului (înlocuiește cu URL-ul real)
        const apiUrl = `https://api.example.com/generate-roadmap?goals=${encodeURIComponent(learningGoals)}&time=${encodeURIComponent(timeAvailable)}&interests=${encodeURIComponent(interests)}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.roadmap) {
                const roadmapElement = document.createElement("div");
                roadmapElement.className = "roadmap-item";
                roadmapElement.innerHTML = `
                    <h3>Your Personalized Roadmap</h3>
                    <p>${data.roadmap.description}</p>
                    <ul>
                        ${data.roadmap.resources.map(resource => `<li>${resource}</li>`).join('')}
                    </ul>
                `;
                resultsContainer.appendChild(roadmapElement);
            } else {
                resultsContainer.innerHTML = '<p>No roadmap generated. Please try again.</p>';
            }
        } catch (error) {
            console.error("Error generating roadmap:", error);
            resultsContainer.innerHTML = '<p>Error generating roadmap. Please try again later.</p>';
        }
    } else {
        alert("Please fill in all fields.");
    }
}


let studySessions = []; // Array pentru a stoca sesiunile de studiu

// Funcție pentru a adăuga o sesiune de studiu
function addStudySession() {
    const title = document.getElementById('sessionTitle').value;
    const date = document.getElementById('sessionDate').value;
    const resultsContainer = document.getElementById('sessionResults');

    if (title && date) {
        const session = { title, date };
        studySessions.push(session); // Adaugă sesiunea în array
        displaySessions(); // Afișează sesiunile
        notifyUser(session); // Apelează funcția de notificare
        clearInputFields(); // Curăță câmpurile de input
    } else {
        alert("Please fill in both fields.");
    }
}

// Funcție pentru a afișa sesiunile de studiu
function displaySessions() {
    const resultsContainer = document.getElementById('sessionResults');
    resultsContainer.innerHTML = ''; // Curăță rezultatele anterioare

    studySessions.forEach((session, index) => {
        const sessionElement = document.createElement("div");
        sessionElement.className = "study-session-item";
        sessionElement.innerHTML = `
            <h4>${session.title}</h4>
            <p>Date: ${new Date(session.date).toLocaleString()}</p>
            <button onclick="removeSession(${index})">Remove</button>
        `;
        resultsContainer.appendChild(sessionElement);
    });
}

// Funcție pentru a șterge o sesiune
function removeSession(index) {
    studySessions.splice(index, 1); // Elimină sesiunea din array
    displaySessions(); // Reafișează sesiunile
}

// Funcție pentru a notifica utilizatorul
function notifyUser(session) {
    const notificationTime = new Date(session.date).getTime() - new Date().getTime();
    if (notificationTime > 0) {
        setTimeout(() => {
            alert(`Time to study: ${session.title}`);
        }, notificationTime);
    }
}

// Funcție pentru a curăța câmpurile de input
function clearInputFields() {
    document.getElementById('sessionTitle').value = '';
    document.getElementById('sessionDate').value = '';
}

// Funcția pentru căutarea planurilor de studiu
async function searchStudyPlans() {
    const searchInput = document.querySelector('section.content .search-input'); // Selectează input-ul din secțiunea corectă
    const query = searchInput.value.trim();
    const resultsContainer = document.getElementById('plannerResults'); // Corectare a ID-ului
    resultsContainer.innerHTML = ''; // Curăță rezultatele anterioare

    if (query) {
        // URL-ul API-ului pentru căutare, modifică-l cu cel real
        const apiUrl = `https://api.example.com/study-plans?query=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.plans && data.plans.length > 0) {
                data.plans.forEach(plan => {
                    const planElement = document.createElement("div");
                    planElement.className = "study-plan-item";
                    planElement.innerHTML = `
                        <h3>${plan.title}</h3>
                        <p>${plan.description}</p>
                        <button onclick="window.open('${plan.link}', '_blank')">View Study Plan</button>
                    `;
                    resultsContainer.appendChild(planElement);
                });
            } else {
                resultsContainer.innerHTML = '<p>No study plans found.</p>';
            }
        } catch (error) {
            console.error("Error fetching study plans:", error);
            resultsContainer.innerHTML = '<p>Error fetching study plans. Please try again later.</p>';
        }
    } else {
        alert("Please enter a search term.");
    }
}


// Inițializăm array-uri pentru mesajele de chat
let groupMessages = [];
let privateMessages = [];

// Funcție pentru a trimite mesaje în chat-ul de grup
function sendGroupMessage() {
    const input = document.getElementById('groupChatInput');
    const message = input.value.trim();

    if (message) {
        const timestamp = new Date().toLocaleTimeString();
        groupMessages.push({ message, timestamp });
        input.value = ''; // Curățăm câmpul de input
        displayGroupMessages();
    } else {
        alert("Please enter a message.");
    }
}

// Funcție pentru a afișa mesajele din chat-ul de grup
function displayGroupMessages() {
    const chatBox = document.getElementById('groupChat');
    chatBox.innerHTML = ''; // Curățăm mesajele anterioare

    groupMessages.forEach(msg => {
        const msgElement = document.createElement('div');
        msgElement.className = 'chat-message';
        msgElement.innerHTML = `<strong>[${msg.timestamp}]</strong> ${msg.message}`;
        chatBox.appendChild(msgElement);
    });
}

// Funcție pentru a trimite mesaje în chat-ul privat
function sendPrivateMessage() {
    const input = document.getElementById('privateChatInput');
    const message = input.value.trim();

    if (message) {
        const timestamp = new Date().toLocaleTimeString();
        privateMessages.push({ message, timestamp });
        input.value = ''; // Curățăm câmpul de input
        displayPrivateMessages();
    } else {
        alert("Please enter a message.");
    }
}

// Funcție pentru a afișa mesajele din chat-ul privat
function displayPrivateMessages() {
    const chatBox = document.getElementById('privateChat');
    chatBox.innerHTML = ''; // Curățăm mesajele anterioare

    privateMessages.forEach(msg => {
        const msgElement = document.createElement('div');
        msgElement.className = 'chat-message';
        msgElement.innerHTML = `<strong>[${msg.timestamp}]</strong> ${msg.message}`;
        chatBox.appendChild(msgElement);
    });
}

// Funcția pentru căutarea chat-urilor
function searchFunction(type) {
    // Implementați funcționalitatea de căutare aici
    alert(`Searching in ${type}...`);
}


// Funcție pentru a începe apelul vocal și a obține răspuns de la AI
function startVoiceCall() {
    const userQuestion = document.getElementById('userQuestion').value.trim();

    if (userQuestion) {
        // Afișăm întrebarea utilizatorului
        displayUserQuestion(userQuestion);
        
        // Simulăm obținerea unui răspuns de la AI
        const aiResponse = getAIResponse(userQuestion);
        
        // Afișăm răspunsul AI-ului
        displayAIResponse(aiResponse);
    } else {
        alert("Please enter a question.");
    }
}

// Funcție pentru a afișa întrebarea utilizatorului
function displayUserQuestion(question) {
    const responseText = document.getElementById('responseText');
    responseText.innerHTML = `<strong>You:</strong> ${question}`;
}

// Funcție pentru a obține un răspuns simulativ de la AI
function getAIResponse(question) {
    // Exemplu simplificat de răspuns pe baza întrebării
    if (question.includes("homework")) {
        return "Sure! What subject do you need help with regarding your homework?";
    } else if (question.includes("topic")) {
        return "Please specify the topic, and I'll provide detailed explanations.";
    } else {
        return "I'm here to help! Please elaborate on your question.";
    }
}

// Funcție pentru căutarea AI Teacher
function searchFunction(type) {
    // Implementați funcționalitatea de căutare aici
    alert(`Searching in ${type}...`);
}


// Funcție pentru a genera rezumatul notelor
function generateSummary() {
    const notes = document.getElementById('notesInput').value.trim();
    const summaryLength = document.getElementById('summaryLength').value;
    const summaryTextElement = document.getElementById('summaryText');

    if (notes) {
        // Simulăm crearea unui rezumat
        let summary;
        if (summaryLength === 'short') {
            summary = "Short summary of the provided notes.";
        } else if (summaryLength === 'medium') {
            summary = "Medium summary that covers the main points.";
        } else {
            summary = "Detailed summary with thorough explanations.";
        }

        summaryTextElement.innerText = summary;
    } else {
        alert("Please enter notes to summarize.");
    }
}

