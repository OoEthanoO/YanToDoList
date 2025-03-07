# YanToDoList

A simple, elegant, and cross-platform to-do list application built with Electron.

## About

YanToDoList helps you keep track of your tasks with a clean and intuitive interface. It supports due dates, school tasks, and allows you to stay organized with an easy drag-and-drop interface.

## Features

- **Task Management**: Add, complete, and delete tasks easily
- **Due Dates**: Assign due dates to your tasks with smart date formatting
- **School Tasks**: Mark tasks specifically related to school with a special highlight
- **"Done for Today"**: Mark tasks as done for today without removing them from your list
- **Drag and Drop**: Reorder your tasks with simple drag and drop functionality
- **Random Todo**: Get a random task suggestion when you're not sure what to work on next
- **Persistent Storage**: Your tasks are automatically saved and loaded between sessions

## Getting Started

### Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Start the app with `npm start`

### Building the App

To build the application for your platform:

```bash
npm run build          # Build for current platform
npm run build-mac      # Build for macOS
npm run build-win      # Build for Windows
```

## How to Use

### Adding Tasks

1. Type your task in the text input field
2. (Optional) Set a due date using the date picker
3. (Optional) Check the "For School" box if it's a school-related task
4. Click "Add" or press Enter

### Managing Tasks

- **Complete a Task**: Click the first checkbox next to a task
- **Mark as Done for Today**: Click the second checkbox to mark a task as done for today
- **Delete a Task**: Click the "Delete" button
- **Reorder Tasks**: Drag and drop tasks using the handle (⋮⋮) on the left side

### Random Task Selector

Not sure what to work on? Click the "Random Todo" button at the bottom to get a suggestion from your task list.

## Task Properties

- **Due Date**: Shows as relative time (today, tomorrow, etc.) when close, or as a specific date
- **School Tasks**: Displayed in red to help prioritize academic work
- **Completion Status**: Completed tasks are crossed out

## Development

This application is built with:

- Electron - for cross-platform desktop functionality
- HTML/CSS/JavaScript - for the user interface
- Node.js - for file system operations and backend functionality

## Made with ❤️ from Ethan Yan Xu
