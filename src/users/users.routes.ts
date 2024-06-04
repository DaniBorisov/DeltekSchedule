import express, {Request, Response} from "express";
import { Users } from "./users.interface";
import { StatusCodes } from "http-status-codes";
import * as data from "./users.storage";

export const userRouter = express.Router()

userRouter.post("/addUser", async (req: Request, res: Response) => {
    try{
        const {name,email} = req.body

        if(!name || !email)
        {
            return res.status(StatusCodes.BAD_REQUEST).json({error : `Please provide all the required parameters..`})
        }

        const newUser = await data.addUser(req.body.name, req.body.email);
        
        return res.status(StatusCodes.CREATED).json({newUser})
    } catch (error:any) {
        if (error.message === 'Email already exists') {
            return res.status(StatusCodes.CONFLICT).json({ error: error.message });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

userRouter.get("/getUser", async (req: Request, res: Response) => {
    try {
        const {email} = req.body;       
        if(!email)
        {
                return res.status(StatusCodes.BAD_REQUEST).json({error : `Please provide all the required parameters..`})
        }
            
        const fetchedUser = await data.getUserByEmail(email);
        return res.status(StatusCodes.OK).json({ fetchedUser});

    } catch (error)  {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

userRouter.get("/AllUsers", async (req:Request, res: Response) =>{
    try{
        const users: Users[] = await data.getAllUsers();
        return res.status(StatusCodes.OK).json({ users});
    } catch (error)  {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})