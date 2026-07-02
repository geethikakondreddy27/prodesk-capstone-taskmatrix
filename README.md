# FlowStack

# FlowStack

> **Current Status:**  MVP Authentication Phase (Sprint 14)
>
> The project is currently under active development. The core authentication system has been completed, including secure user registration, JWT-based authentication, protected routes, and MongoDB integration. The remaining modules described in this document represent the planned implementation roadmap for upcoming sprints.

---

## Product Requirements Document (PRD)

### Project Information

| Field | Details |
|---------|---------|
| Project Name | FlowStack |
| Repository Name | prodesk-capstone-taskmatrix |
| Project Type | Agile Project Management Platform |
| Track | Full Stack Development |
| Author | Geethika Kondreddy |

---



## Project Overview

FlowStack is a full-stack Agile Project Management platform designed for software development teams to efficiently plan, organize, track, and deliver projects.

Inspired by modern project management tools such as Jira and Asana, FlowStack provides a centralized workspace where teams can manage projects, assign tasks, collaborate in real time, monitor deadlines, and visualize workflow progress through Kanban boards.

The platform combines project management, role-based collaboration, task tracking, deadline monitoring, and real-time activity updates into a unified system. In addition to traditional Agile workflows, FlowStack introduces an Intelligent Work Dashboard that highlights overdue tasks, blocked work items, approaching deadlines, and high-priority activities requiring immediate attention.

---

## Problem Statement

Software development teams often work across multiple projects, deadlines, and team members simultaneously. As project complexity increases, maintaining visibility over task ownership, project progress, and delivery timelines becomes increasingly difficult.

Teams frequently encounter challenges such as:

- Unclear task ownership
- Missed deadlines
- Lack of project visibility
- Workflow bottlenecks
- Poor collaboration between stakeholders
- Difficulty identifying high-priority work

While existing project management platforms provide extensive functionality, many teams require a streamlined solution that balances usability, collaboration, and actionable project insights.

FlowStack addresses these challenges by providing a centralized Agile project management platform that enables teams to organize work, monitor progress, collaborate effectively, and proactively identify project risks before they impact delivery.

---

## Product Vision

To build a modern Agile project management platform that helps software teams organize work, collaborate efficiently, and proactively identify project risks through intelligent workflow visibility and real-time collaboration tools.

---

## Solution Overview

FlowStack enables teams to:

- Organize projects efficiently
- Manage tasks through Kanban workflows
- Assign responsibilities across teams
- Track project progress in real time
- Monitor deadlines and priorities
- Collaborate through activity feeds and comments
- Identify overdue and blocked work items quickly

The platform is designed to provide software teams with a clear understanding of what requires attention, helping improve productivity and project delivery outcomes.

---

## User Roles

| Role | Responsibilities |
|--------|--------|
| Admin | Manage workspaces, users, permissions, and platform settings |
| Project Manager | Create projects, assign tasks, manage deadlines, and monitor project progress |
| Team Member | Update task status, collaborate on tasks, track assigned work, and participate in project activities |

---

## Core Features

### Priority 0 (Critical Features)

| Feature | Description |
|----------|------------|
| Authentication & Authorization | Secure user registration, login, and role-based access control |
| Workspace Management | Create and manage team workspaces |
| Project Management | Create, update, and monitor projects |
| Kanban Board System | Drag-and-drop workflow management |
| Task Management | Create, assign, edit, and track tasks |

### Priority 1 (Important Features)

| Feature | Description |
|----------|------------|
| Deadline Management | Due dates and overdue task monitoring |
| Priority Tagging | Low, Medium, High, and Critical priority levels |
| Activity Feed | Real-time project activity tracking |
| Team Collaboration | Task comments and collaboration history |
| Notifications | Assignment and deadline alerts |

### Priority 2 (Enhancement Features)

| Feature | Description |
|----------|------------|
| Intelligent Work Dashboard | Highlights overdue, blocked, and high-priority tasks |
| Project Analytics | Completion metrics and project insights |
| Productivity Tracking | Team performance indicators |
| Advanced Reporting | Project summaries and progress reports |

---

## Technology Stack

| Layer | Technology |
|---------|---------|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT |
| Real-Time Communication | Socket.io |
| Deployment | Vercel, Render |
| Version Control | Git & GitHub |

---

## System Architecture Overview

FlowStack follows a modern three-tier full-stack architecture.

### Presentation Layer
- React.js
- Vite
- Tailwind CSS

### Application Layer
- Node.js
- Express.js
- JWT Authentication
- Socket.io

### Data Layer
- MongoDB Atlas
- Mongoose ODM

### Deployment Layer
- Vercel
- Render
- MongoDB Atlas Cloud

---

## Planned Database Collections

| Collection | Purpose |
|------------|---------|
| Users | User profiles, authentication, and role management |
| Workspaces | Team workspace information |
| Projects | Project metadata and ownership |
| Tasks | Task details, status, deadlines, and assignments |
| Comments | Team collaboration and discussions |
| ActivityLogs | Activity tracking and audit history |
| Notifications | User alerts and reminders |

---

## Development Roadmap

| Phase | Deliverables |
|---------|---------|
| Phase 1 | PRD, Wireframes, ERD, System Architecture Planning |
| Phase 2 | Authentication, Workspace Management, Project Management |
| Phase 3 | Task Management, Kanban Board, Role Management |
| Phase 4 | Activity Feed, Notifications, Intelligent Work Dashboard |
| Phase 5 | Testing, Optimization, Deployment |

---

## UI/UX Wireframes

The user interface will be designed using Figma before development begins.

### Planned Screens

1. Authentication Screen
2. Workspace Dashboard
3. Project Kanban Board
4. Task Details View
5. Intelligent Work Dashboard

**Figma Link:** *Will be linked after UI/UX wireframe completion.*

---

## Entity Relationship Diagram (ERD)

The Entity Relationship Diagram (ERD) will document the relationships between the core MongoDB collections used within FlowStack.

### Planned Entities

- Users
- Workspaces
- Projects
- Tasks
- Comments
- ActivityLogs
- Notifications

**ERD Diagram:** * Will be embedded after architecture design completion*

---

## Future Enhancements

Potential future enhancements include:

- Sprint planning and backlog management
- GitHub integration
- Slack integration
- Google Calendar integration
- Email notifications
- Advanced analytics dashboards
- AI-assisted task prioritization
- Team workload balancing

---

## Success Metrics

The success of FlowStack will be evaluated based on:

- Task completion visibility
- Project progress transparency
- Team collaboration effectiveness
- Deadline adherence
- Real-time activity tracking
- Overall user experience

---

## Author

**Geethika Kondreddy**

Full Stack Developer Intern  
ProDesk IT
Capstone Project
