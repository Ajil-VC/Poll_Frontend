import { User } from "./user.model";

export interface ChatMessage {

    id: string;
    user: User,
    message: string,
    pollId: string,
    type: "text" | "system",

    createdAt?: Date,
    updatedAt?: Date,
}