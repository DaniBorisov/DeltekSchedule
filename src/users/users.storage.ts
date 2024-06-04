import { Users } from "./users.interface";

let users: Users[] = [];


export async function addUser (name:string, email:string) 
{
    try{
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const newuser :Users = {name: name, email: email}
        users.push(newuser);
        console.log('User added succsessfully ! ')
    } catch (error){
        console.log('Failed adding user: ${error}')
    }
}

export async function getUserByEmail(email: string) {

    try {
        return users.find(user => user.email === email);

    } catch (error) {
        console.error('Failed to find the user with email ${email}')
    }
}

export function getAllUsers() {
    return users;
} 

