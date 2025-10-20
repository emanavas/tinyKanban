# tinyKanban

A simple and elegant Kanban board application built with Node.js, Express, and Supabase.

## Overview

![alt text](https://github.com/emanavas/tinyKanban/blob/main/tinyKB.png?raw=true)

tinyKanban is a lightweight, single-page web application that allows you to manage your tasks using a visual Kanban board. You can create tasks, move them between different stages (Backlog, Active, Blocked, Done), and delete them. The application features a clean and intuitive drag-and-drop interface.

## Features

- **Create, Read, Update, Delete (CRUD) Tasks:** Easily manage your tasks with full CRUD functionality.
- **Drag-and-Drop Interface:** Move tasks between columns with a smooth drag-and-drop experience.
- **Persistent Storage:** Tasks are saved in a Supabase database, so your data persists between sessions.
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

3.  **Set up Supabase:**
    - Create a new project on [Supabase](https://supabase.com/).
    - In your Supabase project, go to the "SQL Editor" and run the content of the `schema.sql` file to create the `tasks` table.
    - Go to "Settings" > "API" to find your Supabase URL and anon key.

4.  **Configure the server:**
    - In `server.js`, replace `'YOUR_SUPABASE_URL'` and `'YOUR_SUPABASE_ANON_KEY'` with your actual Supabase URL and anon key.

5.  **Start the server:**
    ```bash
    node server.js
    ```

6.  **Open the application:**
    Open your web browser and navigate to `http://localhost:5000`.

## How to Use

- **Create a Task:** Click the "Create New Task" button, fill in the details in the modal, and click "Create Task".
- **Move a Task:** Click and drag a task from one column to another.
- **Delete a Task:** Click the trash icon on a task card to delete it.
- **Clear Completed Tasks:** Click the "Clear Completed" button to delete all tasks in the "Done" column.