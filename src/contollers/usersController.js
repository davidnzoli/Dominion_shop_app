import { createUserService, deleteUserService, getAllUserService, getUserByIdService } from "../modeles/userModel.js";

const handleResponse = (res, status, message, data = null)=>{
    res.status(status).json({
        status,
        message,
        data,
    });
};

export const createUser = async (req, res, next) =>{
    const {name, email} = req.body;
    try{
        const newUser= await createUserService(name,email);
        handleResponse(res,201,"user created successfully", newUser);
    }catch(err){
        next(err)
    }
}

export const getAllUsers = async (req, res, next) =>{
    try{
        const users= await getAllUserService();
        handleResponse(res,200,"users fetched successfully", users);
    }catch(err){
        next(err)
    }
}

export const getUserById = async (req, res, next) =>{
    
    try{
        const user = await getUserByIdService(req.params.id);
        if(!user) return handleResponse(res,404,"user not found")
        handleResponse(res,200,"user fetched successfully", user);
    }catch(err){
        next(err)
    }
}

export const updateUser = async (req, res, next) =>{
    const {name, email} = req.body;
    try{
        const updateUser = await updateUserService(req.params.id,name,email);
        if(!user) return handleResponse(res,404,"user not found")
        handleResponse(res,200,"user updated successfully", updateUser);
    }catch(err){
        next(err)
    }
}

export const deleteUser = async (req, res, next) =>{
    try{
        const deleteUser = await deleteUserService(req.params.id);
        if(!user) return handleResponse(res,404,"user not found")
        handleResponse(res,200,"user deleted successfully", deleteUser);
    }catch(err){
        next(err)
    }
}