const Middleware = {
    fetchUser: ( req, res, next ) => {
        try {
            if( req.session.username ) {
                const user = { username: req.session.username };
                res.locals.user = user;
            }
            next();
        } catch( error ) {
            console.log( error );
        }
    },
}

module.exports = Middleware;