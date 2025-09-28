import Fastify from 'fastify';
import fastifyMongodb from '@fastify/mongodb';
import cookies from '@fastify/cookie';
import jwt from '@fastify/jwt';
import { authRouter } from './src/routes/auths.js';
import { projectRouter } from './src/routes/projects.js';
import { tasksRouter } from './src/routes/tasks.js';

const fastify = new Fastify({
    logger: false
});

// Register plugins that provide decorators BEFORE the routes that use them.
fastify.register(fastifyMongodb, {
    forceClose: true,
    url: process.env.DB_URL
});
fastify.register(jwt, {
  secret: process.env.JWT_SECRET, 
  cookie: {
    cookieName: 'token', 
    signed: false, 
  }
});

fastify.register(cookies);

// Now register the routes after their dependencies are available.
fastify.register(authRouter);
fastify.register(projectRouter);
fastify.register(tasksRouter);

fastify.get("/", (req, reply) => {
    return {
        message: "Welcome to auth service"
    };
});

const start = async () => {
    const PORT = process.env.PORT || 4000;
    try{
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server listening on port ${PORT}`);
    } catch(err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();