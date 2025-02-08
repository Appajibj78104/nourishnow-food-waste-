const errorHandler = (err, req, res, next) => {
<<<<<<< HEAD
<<<<<<< HEAD
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
=======
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body
    });

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
>>>>>>> 7c904d1 (Saved local changes before pulling from remote)
=======
    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
>>>>>>> 2fa7dd5 (Updated backend and frontend changes)
    });
};

module.exports = { errorHandler };