import { Request, Response, NextFunction } from "express";
import {
    createUserService,
    deleteUserService,
    getAllUserService,
    getUserByIdService,
    updateUserService,
} from "../modeles/userModel.js";

const handleResponse = (
    res: Response,
    status: number,
    message: string,
    data: unknown = null
): Response => {
    return res.status(status).json({
        status,
        message,
        data,
    });
};

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { name, email,role,hashedPassword } = req.body || {};
    if (!name || !email || !hashedPassword) {
        return handleResponse(
            res,
            400,
            "name and email are required in the request body (JSON)"
        );
    }
    try {
        const newUser = await createUserService(name, email,role,hashedPassword);
        return handleResponse(res, 201, "user created successfully", newUser);
    } catch (err) {
        next(err);
    }
};

export const getAllUsers = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const users = await getAllUserService();
        return handleResponse(res, 200, "users fetched successfully", users);
    } catch (err) {
        next(err);
    }
};

export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
        return handleResponse(res, 400, "Identifiant d'utilisateur requis");
    }

    try {
        const user = await getUserByIdService(id);
        if (!user) {
            return handleResponse(res, 404, "user not found");
        }
        return handleResponse(res, 200, "user fetched successfully", user);
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
        return handleResponse(res, 400, "Identifiant d'utilisateur requis");
    }

    const { name, email } = req.body || {};
    if (!name || !email) {
        return handleResponse(
            res,
            400,
            "name and email are required in the request body (JSON)"
        );
    }
    try {
        const updatedUser = await updateUserService(id, name, email);
        if (!updatedUser) {
            return handleResponse(res, 404, "user not found");
        }
        return handleResponse(res, 200, "user updated successfully", updatedUser);
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
        return handleResponse(res, 400, "Identifiant d'utilisateur requis");
    }

    try {
        const deletedUser = await deleteUserService(id);
        if (!deletedUser) {
            return handleResponse(res, 404, "user not found");
        }
        return handleResponse(res, 200, "user deleted successfully", deletedUser);
    } catch (err) {
        next(err);
    }
};
