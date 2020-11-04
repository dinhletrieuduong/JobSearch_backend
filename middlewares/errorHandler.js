module.exports = (errors, req, res, next) => {
    const status = errors.statusCode || 500;
    const message = errors.message;
    const data = errors.data;
    const validation = errors.validation;
    res.status(status).json({
        message: message,
        data: data,
        validation: validation
    })
}