// types.ts

// --- Auth ---
export interface AuthResponse {
    token: string;
    userTag: string;
    userId: number;
}

// --- User & Friends ---
export interface User {
    id: number;
    userTag: string;
    displayName: string;
}

export interface FriendRequest {
    requestId: number;
    senderId: number;
    senderUserTag: string;
    senderDisplayName: string;
}

// --- Chat ---
export interface ChatMessage {
    id?: number;
    senderTag?: string;     // Nullable for system messages or inferred
    recipientTag?: string;  // Nullable for group chats
    groupId?: number;       // Nullable for 1:1 chats
    content: string;
    timestamp?: string;     // ISO String from Java LocalDateTime
}

// --- Groups ---
export interface GroupMember {
    id: number;
    userTag: string;
    displayName: string;
}

export interface Group {
    id: number;
    name: string;
    owner: GroupMember;
    members: GroupMember[];
    createdAt: string;
}