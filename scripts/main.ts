interface Goal {
    id: number;
    text: string;
}

class TodoApp {
    private goals: Goal[] = [];
    private editMode: boolean = false;
    private currentEditId: number | null = null;

    constructor() {
        this.initializeEventListeners();
        this.renderGoals();
    }

    private initializeEventListeners(): void {
        const addButton = document.getElementById('addButton');
        const newGoalInput = document.getElementById('newGoal') as HTMLInputElement;

        addButton?.addEventListener('click', () => this.addGoal());
        
        newGoalInput?.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                this.addGoal();
            }
        });
    }

    private addGoal(): void {
        const input = document.getElementById('newGoal') as HTMLInputElement;
        const text = input.value.trim();

        if (text) {
            const goal: Goal = {
                id: Date.now(),
                text: text
            };
            this.goals.push(goal);
            input.value = '';
            this.renderGoals();
        }
    }

    private deleteGoal(id: number): void {
        this.goals = this.goals.filter(goal => goal.id !== id);
        this.renderGoals();
    }

    private editGoal(id: number): void {
        const goal = this.goals.find(g => g.id === id);
        if (goal) {
            this.editMode = true;
            this.currentEditId = id;
            this.renderGoals();
        }
    }

    private saveGoal(id: number): void {
        const input = document.querySelector('.edit-input') as HTMLInputElement;
        const newText = input.value.trim();

        if (newText) {
            this.goals = this.goals.map(goal =>
                goal.id === id ? {...goal, text: newText} : goal
            );
            this.editMode = false;
            this.currentEditId = null;
            this.renderGoals();
        }
    }

    private cancelEdit(): void {
        this.editMode = false;
        this.currentEditId = null;
        this.renderGoals();
    }

    private renderGoals(): void {
        const container = document.getElementById('goalsContainer');
        if (!container) return;

        container.innerHTML = '';

        this.goals.forEach(goal => {
            const goalElement = document.createElement('div');
            goalElement.className = 'goal-card';

            if (this.editMode && goal.id === this.currentEditId) {
                goalElement.innerHTML = `
                    <input type="text" class="edit-input" value="${this.escapeHtml(goal.text)}">
                    <div class="goal-actions">
                        <button class="edit-btn" data-action="save" data-id="${goal.id}">Сохранить</button>
                        <button class="delete-btn" data-action="cancel">Отмена</button>
                    </div>
                `;
            } else {
                goalElement.innerHTML = `
                    <div class="goal-text">${this.escapeHtml(goal.text)}</div>
                    <div class="goal-actions">
                        <button class="edit-btn" data-action="edit" data-id="${goal.id}">Редактировать</button>
                        <button class="delete-btn" data-action="delete" data-id="${goal.id}">Удалить</button>
                    </div>
                `;
            }

            container.appendChild(goalElement);
        });

        this.attachEventListenersToGoals();
    }

    private attachEventListenersToGoals(): void {
        const buttons = document.querySelectorAll('.goal-actions button');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.target as HTMLButtonElement;
                const action = target.getAttribute('data-action');
                const id = target.getAttribute('data-id');

                if (action && id) {
                    const numericId = parseInt(id, 10);
                    
                    switch (action) {
                        case 'edit':
                            this.editGoal(numericId);
                            break;
                        case 'delete':
                            this.deleteGoal(numericId);
                            break;
                        case 'save':
                            this.saveGoal(numericId);
                            break;
                        case 'cancel':
                            this.cancelEdit();
                            break;
                    }
                }
            });
        });
    }

    private escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});