import { Users } from "../users/users.interface"

export interface Meeting{
    id: string,
    Collaborators: Users[],
    StartTime: Date,
    EndTime: Date
}

