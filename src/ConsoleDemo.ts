import * as Userdata from "./users/users.storage"
import * as Meetingdata from "./meetings/meetings.storage"

import { Meeting } from "./meetings/meetings.interface";
import { Users } from "./users/users.interface";


async function runDemo() {
    //Add users
    await Userdata.addUser("Pikachu" , "pika@ICU.pt" );
    await Userdata.addUser("Charmander" , "Char@ICU.r36" );
    await Userdata.addUser("Bulbasaur" , "BB@ICU.er" );
    await Userdata.addUser("OakDaGoat" , "OakDG@Pt.pkb" );
    console.log("Users added successfully! ")
    
    const u1 = await Userdata.getUserByEmail("pika@ICU.pt") as Users;
    const u2 = await Userdata.getUserByEmail("Char@ICU.r36") as Users;
    const u3 = await Userdata.getUserByEmail("BB@ICU.er") as Users;
    const u4 = await Userdata.getUserByEmail("OakDG@Pt.pkb") as Users;
 
    // Create Meetings     
    const now = new Date();
    now.setHours(now.getHours() + Math.round(now.getMinutes()/60))
    now.setMinutes(0); 
    now.setSeconds(0); 
    now.setMilliseconds(0); 
    const meeting1 :Meeting = {
        id: "dasdas",
        Collaborators: [u1,u2],
        StartTime: now,
        EndTime: new Date(now.getTime() + 1 * 60 * 60 * 1000)
    }
    console.log("Meeting 1 created: ", meeting1);

     const meeting2 :Meeting = {
        id: "dasdas",
        Collaborators: [u1,u3],
        StartTime: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        EndTime: new Date(now.getTime() + 3 * 60 * 60 * 1000)
    }    
    console.log("Meeting 2 created: ", meeting2);

    await Meetingdata.addMeeting(meeting1)
    await Meetingdata.addMeeting(meeting2)

    // Suggest available slots
    const availableSlots = await Meetingdata.suggestAvailableTimeslots([u4.email,u1.email])
    console.log(`Available timeslots for ${u1.email} and ${u2.email}: ` , availableSlots)
}

runDemo().catch(error => console.error("Error occurred:", error));