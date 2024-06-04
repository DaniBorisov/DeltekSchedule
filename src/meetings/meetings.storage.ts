import { Meeting } from "./meetings.interface";

let meetings:Meeting[] = [];

export async function addMeeting(meeting: Meeting) {
    const startTime = new Date(meeting.StartTime);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); 
    
    if (startTime.getMinutes() !== 0 || startTime.getSeconds() !== 0 || startTime.getMilliseconds() !== 0) {
        throw new Error('Meeting must start at the hour mark.');
    }

    meeting.EndTime = endTime;
    meetings.push(meeting)
    return meeting
}

export async function getMeetingsByUserEmail(email: string) {
    return meetings.filter(meeting => meeting.Collaborators.some(colaborator => colaborator.email === email));
}

export async function suggestAvailableTimeslots(emails: string[], hoursAhead: number = 5) {
    const availableSlots: Date[] = [];
    const now = new Date();
    now.setHours(now.getHours() + Math.round(now.getMinutes()/60))
    now.setMinutes(0); 
    now.setSeconds(0); 
    now.setMilliseconds(0); 

    console.log(`"Its meeting time: "${meetings[1].StartTime.getTime()}`)

    for (let i = 0; i <= hoursAhead; i++) {
        const slot = new Date(now.getTime() + i * 60 * 60 * 1000);
        
        // Check if the slot is available
        const isAvailable = !meetings.some(meeting => {
            
            const meetingStartTime = new Date(meeting.StartTime);
    
            // console.log(`Meeting Start Time: ${meetingStartTime} `)
            // console.log(`Slot.getTime: ${slot} \n`)

            return (
                meetingStartTime.getTime() === slot.getTime() &&
                meeting.Collaborators.some(c => emails.includes(c.email))
            );
        });
        
        if (isAvailable) {
            availableSlots.push(slot);
        }
    }
    return availableSlots;
}
