//centralized error handling

const error = (err, req, res, next)=>{
    console.log(err.stack);
    res.status(500).json({
        status : 500,
        message: "Something went wrong",
        error: err.message
    })
}

export default error;