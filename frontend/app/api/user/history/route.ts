import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json([]);
        }

        const userId = (session as any).userId || session.user.id;
        if (!userId) {
            return NextResponse.json([]);
        }

        const res = await fetch(`${BACKEND_URL}/history?user_id=${encodeURIComponent(userId)}`);
        if (!res.ok) {
            return NextResponse.json([]);
        }

        const history = await res.json();
        return NextResponse.json(history);
    } catch (error) {
        console.error("Error fetching history:", error);
        return NextResponse.json([]);
    }
}
