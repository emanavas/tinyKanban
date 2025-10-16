# tinyKanban

A simple and elegant Kanban board application built with Node.js, Express, and SQLite.

## Overview

tinyKanban is a lightweight, single-page web application that allows you to manage your tasks using a visual Kanban board. You can create tasks, move them between different stages (Backlog, Active, Blocked, Done), and delete them. The application features a clean and intuitive drag-and-drop interface.

## Features

- **Create, Read, Update, Delete (CRUD) Tasks:** Easily manage your tasks with full CRUD functionality.
- **Drag-and-Drop Interface:** Move tasks between columns with a smooth drag-and-drop experience.
- **Task Properties:** Each task includes a creator, description, priority level, and timestamp.
- **Persistent Storage:** Tasks are saved in a local SQLite database, so your data persists between sessions.
- **Responsive Design:** The application is built with Bootstrap and is responsive, working on different screen sizes.
- **API:** A simple RESTful API provides access to the task data.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/tinyKanban.git
    cd tinyKanban
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the server:**
    ```bash
    node server.js
    ```

4.  **Open the application:**
    Open your web browser and navigate to `http://localhost:3000`.

## How to Use

- **Create a Task:** Click the "Create New Task" button, fill in the details in the modal, and click "Create Task".
- **Move a Task:** Click and drag a task from one column to another.
- **Delete a Task:** Click the trash icon on a task card to delete it.
- **Clear Completed Tasks:** Click the "Clear Completed" button to delete all tasks in the "Done" column.
