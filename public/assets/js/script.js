// KBtool - Professional Kanban Board Application
class KBtool {
    constructor() {
        this.tasks = [];
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadTasks();
        this.renderTasks();
        this.updateCounts();
    }

    setupEventListeners() {
        // Save Task Button
        document.getElementById('saveTaskBtn').addEventListener('click', () => {
            this.createTask();
        });

        // Clear Completed Button
        document.getElementById('clearCompleted').addEventListener('click', () => {
            this.clearCompleted();
        });

        // Form submission
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTask();
        });

        // Modal close event
        document.getElementById('createTaskModal').addEventListener('hidden.bs.modal', () => {
            this.resetForm();
        });
    }

    async createTask() {
        const creator = document.getElementById('taskCreator').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const priority = document.getElementById('taskPriority').value;

        if (!creator || !description) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        const taskContent = {
            creator,
            description,
            priority,
            createdAt: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: JSON.stringify(taskContent), status: 'backlog' }),
            });

            if (!response.ok) {
                throw new Error('Failed to create task');
            }

            const newTask = await response.json();
            this.tasks.push(newTask);
            this.renderTasks();
            this.updateCounts();

            const modal = bootstrap.Modal.getInstance(document.getElementById('createTaskModal'));
            modal.hide();
            this.resetForm();

            this.showToast('Task created successfully!', 'success');
        } catch (error) {
            console.error('Error creating task:', error);
            this.showToast('Error creating task', 'error');
        }
    }

    renderTasks() {
        // Clear all columns
        document.querySelectorAll('.task-column').forEach(column => {
            column.innerHTML = '<div class="task-placeholder text-center text-muted py-5"><i class="bi bi-inbox display-4 d-block mb-2"></i><small>Drag tasks here</small></div>';
        });

        // Group tasks by status
        const tasksByStatus = this.tasks.reduce((acc, task) => {
            if (!acc[task.status]) acc[task.status] = [];
            acc[task.status].push(task);
            return acc;
        }, {});

        // Render tasks in each column
        Object.keys(tasksByStatus).forEach(status => {
            const column = document.querySelector(`[data-status="${status}"]`);
            if (!column) return;

            const placeholder = column.querySelector('.task-placeholder');
            if (placeholder) {
                placeholder.remove();
            }

            tasksByStatus[status].forEach(task => {
                const taskElement = this.createTaskElement(task);
                column.appendChild(taskElement);
            });
        });
    }

    createTaskElement(task) {
        const taskDiv = document.createElement('div');
        const taskContent = JSON.parse(task.content);

        taskDiv.className = `task-card priority-${taskContent.priority}`;
        taskDiv.draggable = true;
        taskDiv.dataset.taskId = task.id;

        const createdDate = new Date(taskContent.createdAt);
        const formattedDate = createdDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        taskDiv.innerHTML = `
            <div class="task-actions">
                <button onclick="kbtool.deleteTask(${task.id})" title="Delete Task">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="task-id">#${task.id}</div>
            <div class="task-creator">
                <i class="bi bi-person-fill me-1"></i>
                ${taskContent.creator}
            </div>
            <div class="task-description">${taskContent.description}</div>
            <div class="task-time">
                <i class="bi bi-clock me-1"></i>
                ${formattedDate}
            </div>
            <div class="task-priority">${taskContent.priority}</div>
        `;

        // Add drag event listeners
        taskDiv.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', task.id);
            taskDiv.classList.add('dragging');
        });

        taskDiv.addEventListener('dragend', () => {
            taskDiv.classList.remove('dragging');
        });

        return taskDiv;
    }

    async deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
                if (!response.ok) {
                    throw new Error('Failed to delete task');
                }
                this.tasks = this.tasks.filter(task => task.id !== taskId);
                this.renderTasks();
                this.updateCounts();
                this.showToast('Task deleted successfully!', 'success');
            } catch (error) {
                console.error('Error deleting task:', error);
                this.showToast('Error deleting task', 'error');
            }
        }
    }

    async clearCompleted() {
        const completedTasks = this.tasks.filter(task => task.status === 'done');
        if (completedTasks.length === 0) {
            this.showToast('No completed tasks to clear', 'info');
            return;
        }

        if (confirm(`Are you sure you want to delete ${completedTasks.length} completed task(s)?`)) {
            try {
                for (const task of completedTasks) {
                    await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
                }
                this.tasks = this.tasks.filter(task => task.status !== 'done');
                this.renderTasks();
                this.updateCounts();
                this.showToast(`${completedTasks.length} completed task(s) cleared!`, 'success');
            } catch (error) {
                console.error('Error clearing completed tasks:', error);
                this.showToast('Error clearing completed tasks', 'error');
            }
        }
    }

    updateCounts() {
        const counts = {
            backlog: this.tasks.filter(task => task.status === 'backlog').length,
            active: this.tasks.filter(task => task.status === 'active').length,
            blocked: this.tasks.filter(task => task.status === 'blocked').length,
            done: this.tasks.filter(task => task.status === 'done').length
        };

        document.getElementById('backlogCount').textContent = counts.backlog;
        document.getElementById('activeCount').textContent = counts.active;
        document.getElementById('blockedCount').textContent = counts.blocked;
        document.getElementById('doneCount').textContent = counts.done;
    }

    resetForm() {
        document.getElementById('taskForm').reset();
    }

    showToast(message, type = 'success') {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        
        const toast = document.createElement('div');
        toast.className = `custom-toast ${type === 'error' ? 'bg-danger' : ''}`;
        toast.innerHTML = `
            <i class="bi ${type === 'error' ? 'bi-x-circle' : 'bi-check-circle'} me-2"></i>
            ${message}
        `;

        toastContainer.appendChild(toast);
        document.body.appendChild(toastContainer);

        setTimeout(() => {
            toast.remove();
            if (toastContainer.children.length === 0) {
                toastContainer.remove();
            }
        }, 3000);
    }

    async moveTask(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && task.status !== newStatus) {
            try {
                const response = await fetch(`/api/tasks/${task.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });

                if (!response.ok) {
                    throw new Error('Failed to move task');
                }

                task.status = newStatus;
                this.renderTasks();
                this.updateCounts();
                
                const statusMap = {
                    'backlog': 'Backlog',
                    'active': 'Active',
                    'blocked': 'Blocked',
                    'done': 'Done'
                };
                
                this.showToast(`Task moved to ${statusMap[newStatus]}!`, 'success');
            } catch (error) {
                console.error('Error moving task:', error);
                this.showToast('Error moving task', 'error');
            }
        }
    }

    async loadTasks() {
        try {
            const response = await fetch('/api/tasks');
            if (!response.ok) {
                throw new Error('Failed to load tasks');
            }
            this.tasks = await response.json();
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.showToast('Error loading tasks', 'error');
        }
    }
}

// Global drag and drop functions
function allowDrop(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.add('drag-over');
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.remove('drag-over');
    
    const taskId = parseInt(ev.dataTransfer.getData('text/plain'));
    const newStatus = ev.currentTarget.dataset.status;
    
    kbtool.moveTask(taskId, newStatus);
}

// Initialize the application
let kbtool;
document.addEventListener('DOMContentLoaded', () => {
    kbtool = new KBtool();
});