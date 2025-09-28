export async function authenticate(req, replay) {
    try{
        await req.jwtVerify();
    } catch (err) {
        replay.code(401).send({ message: 'Authentication required'});
    }
};