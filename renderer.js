//Global variables
let currentUser = null;
let currentRoom = null;

// DOM Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const chatInterface = document.getElementById('chat-interface');
const messageForm = document.getElementById('message-form');
const messageList = document.getElementById('message-list');
const roomList = document.getElementById('room-list');
const createRoomForm = document.getElementById('create-room-form');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
messageForm.addEventListener('submit', handleSendMessage);
createRoomForm.addEventListener('submit', handleCreateRoom);

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    try {
        currentUser = await window.api.login(username, password);
        showChatInterface();
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    try {
        currentUser = await window.api.register(username, password);
        showChatInterface();
    } catch (error) {
        alert('Registration failed: ' + error.message);
    }
}

// Chat functions
async function handleSendMessage(e) {
    e.preventDefault();
    const content = document.getElementById('message-input').value;
    if (currentRoom && content) {
        try {
            await window.api.sendMessage(currentRoom.id, currentUser.id, content);
            document.getElementById('message-input').value = '';
            refreshMessages();
        } catch (error) {
            alert('Failed to send message: ' + error.message);
        }
    }
}

async function refreshMessages() {
    if (currentRoom) {
        const messages = await window.api.getMessages(currentRoom.id);
        messageList.innerHTML = '';
        messages.forEach(msg => {
            const msgElement = document.createElement('div');
            msgElement.textContent = `${msg.user_id}: ${msg.content}`;
            msgElement.classList.add('message');
            messageList.appendChild(msgElement);
        });
    }
}

// Room functions
async function handleCreateRoom(e) {
    e.preventDefault();
    const roomName = document.getElementById('room-name').value;
    try {
        const room = await window.api.createRoom(roomName, currentUser.id);
        refreshRooms();
    } catch (error) {
        alert('Failed to create room: ' + error.message);
    }
}

async function refreshRooms() {
    // In a real app, you'd fetch rooms from the backend
    // For now, we'll just add a dummy room
    roomList.innerHTML = ''; // Clear existing rooms
    const roomElement = document.createElement('div');
    roomElement.textContent = 'General Room';
    roomElement.classList.add('room-item');
    roomElement.addEventListener('click', () => joinRoom({ id: 1, name: 'General Room' }));
    roomList.appendChild(roomElement);
}

async function joinRoom(room) {
    currentRoom = room;
    document.getElementById('room-name-display').textContent = room.name;
    refreshMessages();
}

// UI functions
function showChatInterface() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    chatInterface.style.display = 'flex';
    refreshRooms();
}

// Initialize the application
function initApp() {
    // Any initial setup can go here
    // For now, we'll just ensure the login form is visible
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    chatInterface.style.display = 'none';
}

// Call initApp when the window loads
window.addEventListener('load', initApp);