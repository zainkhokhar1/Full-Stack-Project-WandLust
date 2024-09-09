const asyncwrap = (fn) => {
    return (req, res, next)=> {
        fn(req, res, next).catch((err) => {
            // console.log(err.name);
            next(err);
        })
    }
}
module.exports = asyncwrap;