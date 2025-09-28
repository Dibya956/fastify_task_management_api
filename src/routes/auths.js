import bcrypt from 'bcrypt';
import { authenticate } from '../hook/auth.js';

export async function authRouter(fastify, opts) {
    fastify.post("/api/auth/register", async (req, reply) => {

        const { name, email, password } = req.body;
        const userCollection = fastify.mongo.db.collection('users');
        const existingUser = await userCollection.findOne({ email });

        if (existingUser) {
            return reply.code(409).send({ message: "User with this email already exists" })
        }

        const saltRounds = 10;
        const hpassword = await bcrypt.hash(password, saltRounds);
        const result = await userCollection.insertOne({name, email, hpassword});                                                               
        const payload = { id: result.insertedId, name: name, email: email };
        const token = await reply.jwtSign(payload);
        
        reply
            .setCookie('token', token, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            })
            .code(201)
            .send({ id: result.insertedId, nessage: "Registration sucessful" });
    });

    fastify.post("/api/auth/login", async(req, reply) => {

        const { email, password } = req.body;
        const userCollection = fastify.mongo.db.collection('users');
        const user = await userCollection.findOne({ email });

        if (!user.name) {
            return reply.code(401).send({ message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.hpassword);

        if (isMatch) {
            const payload = { id: user._id, name: user.name, email: email };
            const token = await reply.jwtSign(payload);
            
            reply
                .setCookie('token', token, {
                    path: '/',
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                })
                .send({ message: "Login sucessful" });
        } else {
            reply.code(401).send({ message: "Invalid credentials" })
        }   
    });

    fastify.post("/api/auth/me", { preHandler: [authenticate] }, async(req, reply) => {
        return {
            message: "It's all about you!",
            user: req.user
        };
    });

    fastify.post("/api/auth/logout", async (req, reply) => {
        reply.clearCookie('token', { path: '/' }).send({ message: "Logout sucessful" });
    });
}