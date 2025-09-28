
# fastify_task_management_api

This is a task management api.


## Deployment

To deploy this project run

```bash
  npm run dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_URL = mongodb://localhost:27017/fastify_db`

`JWT_SECRET = hdjowiqhiebant4508u9q6\=64wi6\`

`NODE_ENV = production`


## Roadmap

### 🔑 Core Entities

- Users – Can register, login, and manage their tasks/projects.

- Projects – Each user can create multiple projects.

- Tasks – Tasks belong to projects.

### 🔒 Authentication

- Use JWT auth (JSON Web Token).

- Some routes are public (register, login), others require authentication.

### 🌐 Suggested Endpoints (10–13) 
#### Auth

POST /api/auth/register

- Create a new user.

- Public route.

- Body: { "name": "John", "email": "john@mail.com", "password": "123456" }

- Returns JWT token.

POST /api/auth/login

- User login.

- Public route.

- Body: { "email": "john@mail.com", "password": "123456" }

- Returns JWT token.

GET /api/auth/me

- Get logged-in user profile.

- Auth required.

#### Projects

POST /api/projects

- Create a new project.

- Auth required.

- Body: { "name": "My Project", "description": "Demo project" }.

GET /api/projects

- Get all projects of logged-in user.

- Auth required.

GET /api/projects/:id

- Get details of one project.

- Auth required.

PUT /api/projects/:id

- Update project (only owner).

- Auth required.

DELETE /api/projects/:id

- Delete project (only owner).

- Auth required.

#### Tasks

POST /api/projects/:projectId/tasks

- Add task to a project.

- Body: { "title": "Fix bug", "status": "pending", "priority": "high" }.

- Auth required.

GET /api/projects/:projectId/tasks

- List all tasks in a project.

- Support filters: ?status=completed&priority=high&&limit=10.

- Auth required.

GET /api/tasks/:taskId

- Get single task details.

- Auth required.

PUT /api/tasks/:taskId

- Update a task (title, status, priority, dueDate).

- Auth required.

DELETE /api/tasks/:taskId

- Delete a task.

- Auth required.
