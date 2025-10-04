let goals = [];
let editMode = false;
let currentEditId = null;

function addGoal() {
    const input = document.getElementById('newGoal');
    const text = input.value.trim();

    if (text) {
        const goal = {
            id: Date.now(),
            text: text
        };
        goals.push(goal);
        input.value = '';
        renderGoals();
    }
}

function deleteGoal(id) {
    goals = goals.filter(goal => goal.id !== id);
    renderGoals();
}

function editGoal(id) {
    const goal = goals.find(g => g.id === id);
    if (goal) {
        editMode = true;
        currentEditId = id;
        renderGoals();
    }
}

function saveGoal(id) {
    const input = document.querySelector('.edit-input');
    const newText = input.value.trim();

    if (newText) {
        goals = goals.map(goal =>
            goal.id === id ? {...goal, text: newText} : goal
        );
        editMode = false;
        currentEditId = null;
        renderGoals();
    }
}

function cancelEdit() {
    editMode = false;
    currentEditId = null;
    renderGoals();
}

function renderGoals() {
    const container = document.getElementById('goalsContainer');
    container.innerHTML = '';

    goals.forEach(goal => {
        const goalElement = document.createElement('div');
        goalElement.className = 'goal-card';

        if (editMode && goal.id === currentEditId) {
            goalElement.innerHTML = `
                <input type="text" class="edit-input" value="${goal.text}">
                <div class="goal-actions">
                    <button class="edit-btn" onclick="saveGoal(${goal.id})">Сохранить</button>
                    <button class="delete-btn" onclick="cancelEdit()">Отмена</button>
                </div>
            `;
        } else {
            goalElement.innerHTML = `
                <div class="goal-text">${goal.text}</div>
                <div class="goal-actions">
                    <button class="edit-btn" onclick="editGoal(${goal.id})">Редактировать</button>
                    <button class="delete-btn" onclick="deleteGoal(${goal.id})">Удалить</button>
                </div>
            `;
        }

        container.appendChild(goalElement);
    });
}

// Добавляем возможность нажимать Enter для добавления цели
document.getElementById('newGoal').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addGoal();
    }
});