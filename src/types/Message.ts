enum ContentType {
    user = "user", 
    assistant = "assistant",
}

interface Message {
    id: string
    date: Date
    name: string
    content: Content[]
}

interface Content {
    id: string
    role: ContentType
    value: string
}

export type { Message, Content };
export { ContentType };