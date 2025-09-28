export function set_cookie(req, reply, done) {
    reply.setCookie('cookieName', 'cookieValue', {
        path: '/',
        domain: 'example.com',
        httpOnly: true,
        secure: true
    })
    .send({ cookie: 'set' })
};

export function get_cookie(req, reply, done) {
    const value = req.cookie.cookieName
    reply.send({ value })
};