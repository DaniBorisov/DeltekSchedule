import express, {Request, Response} from "express";
import { Meeting } from "./meetings.interface";
import { StatusCodes } from "http-status-codes";
import * as data from "./meetings.storage";
import * as Userdata from "../users/users.storage";
import { v4 as uuidv4 } from 'uuid';
import { Users } from "../users/users.interface";


export const meetingRouter = express.Router();

meetingRouter.post("/addMeeting", async (req: Request, res: Response) => {
    try {
        const { Collaborators, StartTime }: Meeting = req.body;
        if (!Collaborators || !StartTime || Collaborators.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Please provide all the required parameters." });
        }

        const startTimeDate = new Date(StartTime);
        const participants = await Promise.all(Collaborators.map(colaborator => Userdata.getUserByEmail(colaborator.email)));
        if (participants.some(participant => !participant)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Some participants do not exist." });
        }

        const meeting = await data.addMeeting({ id: uuidv4(), Collaborators: participants.filter(Boolean) as Users[], StartTime: new Date(startTimeDate),EndTime: new Date(startTimeDate.getTime() )});
        return res.status(StatusCodes.CREATED).json({ meeting });
    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An internal server error occurred." });
    }
});

meetingRouter.get("/schedule/:email", async (req: Request, res: Response) => {
    try {
        const email = req.params.email;
        const meetings = await data.getMeetingsByUserEmail(email);

        return res.status(StatusCodes.OK).json({ meetings });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
});

meetingRouter.post("/suggestTimeslots", async (req: Request, res: Response) => {
    try {
        const { participantEmails, hoursAhead } = req.body;
        if (!participantEmails || participantEmails.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Please provide participant emails." });
        }

        const availableSlots = await data.suggestAvailableTimeslots(participantEmails);

        return res.status(StatusCodes.OK).json({ availableSlots });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
});