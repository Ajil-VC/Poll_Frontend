export interface Poll {

    id: string
    question: string,
    options: [
        {
            id: string
            text: string,
            voteCount: number,
        }
    ],
    url: string,
    createdBy: string,
    createdAt: Date,
    expiresAt: Date,
    isActive: Boolean
}


export type ListPoll = Omit<Poll, "options" | "url" | "createdBy" | "createdAt">;