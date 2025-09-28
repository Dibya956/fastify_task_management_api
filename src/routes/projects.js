import { authenticate } from '../hook/auth.js';

export async function projectRouter(fastify, opts){
    fastify.post("/api/projects", { preHandler: [authenticate] }, async (req, reply) => {
        const { ObjectId } = fastify.mongo
        const { name, description } = req.body;
        const { id } = req.user;
        const projectCollection = fastify.mongo.db.collection('projects');
        const result = await projectCollection.insertOne({ user_id: new ObjectId(id), name, description });

        reply.code(200).send({ message: "New project created" })
    });

    fastify.get("/api/projects", { preHandler: [authenticate] }, async (req, reply) => {
        const { ObjectId } = fastify.mongo;
        const { id } = req.user;
        const projectCollection = fastify.mongo.db.collection('projects');
        const result = await projectCollection.find({ user_id: new ObjectId(id) }).project({ name: 1, description: 1, _id: 0 }).toArray();

        reply.code(200).send({ All_Projects: result });
    });

    fastify.get("/api/projects/:id", { preHandler: [authenticate] }, async (req, reply) => {
        const { ObjectId } = fastify.mongo;
        const { id } = req.params;
        const projectCollection = fastify.mongo.db.collection('projects');
        const result = await projectCollection.findOne({ _id: new ObjectId(id) });

        reply.code(200).send({ task_details: result });
    });

    fastify.put("/api/projects/:id", { preHandler: [authenticate] }, async (req, reply) => {
        const { ObjectId } = fastify.mongo;
        const { id } = req.params;
        const user_id = req.user.id;
        const projectCollection = fastify.mongo.db.collection('projects');
        const result = await projectCollection.findOne({ _id: new ObjectId(id) });
        if  (user_id == result.user_id) {
            const update_result = await projectCollection.updateOne(
                { _id: new ObjectId(id)},
                { $set: { name: req.body?.name || result.name, description: req.body?.description || result.description }}
            );
            reply.code(200).send(update_result);
        }

        reply.code(200).send({ error: "Can not update" });
    });

    fastify.delete("/api/projects/:id", { preHandler: [authenticate] }, async (req, reply) => {
        const { ObjectId } = fastify.mongo;
        const { id } = req.params;
        const user_id = req.user.id;
        const projectCollection = fastify.mongo.db.collection('projects');
        const result = await projectCollection.findOne({ _id: new ObjectId(id) });
        if  (user_id == result.user_id) {
            const delete_result = await projectCollection.deleteOne({ _id: new ObjectId(id) });
            reply.code(200).send(delete_result);
        }

        reply.code(200).send({ error: "Can not update" });
    });
}
