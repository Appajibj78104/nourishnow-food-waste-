<<<<<<< HEAD
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = { catchAsync }; 
=======
module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}; 
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
