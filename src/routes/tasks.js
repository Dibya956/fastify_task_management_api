import { authenticate } from "../hook/auth.js";

export async function tasksRouter(fastify, opts) {
    fastify.post("/api/projects/:projectId/tasks", { preHandler: [authenticate] },  async (req, reply) => {
        const { ObjectId } = fastify.mongo;
        const { projectId } = req.params;
        const { title, status, priority } = req.body;
        const taskCollection = fastify.mongo.db.collection('tasks');
        const result = await taskCollection.insertOne({ project_id: new ObjectId(projectId), user_id: new ObjectId(req.user.id), title, status, priority });

        reply.code(200).send({ message: result})
    });

    fastify.get("/api/projects/:projectId/tasks", { preHandler: [authenticate] }, async (req, reply) => {
        const { ObjectId } = fastify.mongo;
        const { projectId } = req.params;
        const { status, priority, limit } = req.query;

        const filter = { project_id: new ObjectId(projectId), user_id: new ObjectId(req.user.id) };
        if (status) {
            filter.status = status;
        }
        if (priority) {
            filter.priority = priority;
        }
        const limitNumber = parseInt(limit, 10) || 10;
        const taskCollection = fastify.mongo.db.collection('tasks');
        const tasks = await taskCollection.find(filter).sort({ createdAt: -1 }).limit(limitNumber).toArray();

        reply.code(200).send({ filtered_task: tasks});
    });

    fastify.get("/api/tasks/:taskId", { preHandler: [authenticate] }, async (req, reply) => {
        const { ObjectId } = fastify.mongo;
        const { taskId } = req.params;
        const taskCollection = fastify.mongo.db.collection('tasks');
        const task = await taskCollection.findOne(new ObjectId(taskId));

        reply.code(200).send({ task: task});
    });

    fastify.delete("/api/tasks/:taskId", { preHandler: [authenticate] }, async (req, reply) => {
        const { ObjectId } = fastify.mongo;
        const { taskId } = req.params;
        const taskCollection = fastify.mongo.db.collection('tasks');
        const delete_task = await taskCollection.deleteOne({ _id: new ObjectId(taskId) });

        reply.code(200).send({ message: "Task deleted sucessfully"})
    });
};
