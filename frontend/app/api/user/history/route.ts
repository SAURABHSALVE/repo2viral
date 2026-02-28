import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongodb";

// GET /api/user/history — returns content_history for current user
export async function GET() {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json([]);
        }

        const { db } = await connectToDatabase();

        // Find user's ID from user_usage collection
        const user = await db.collection("user_usage").findOne({
            $or: [
                { user_id: session.userId },
                { email: session.user.email },
            ],
        });

        const userId = user?.user_id || session.userId;

        const history = await db
            .collection("content_history")
            .find({ user_id: userId })
            .sort({ created_at: -1 })
            .toArray();

        // Convert MongoDB _id to string
        const serialized = history.map((item) => ({
            ...item,
            _id: item._id.toString(),
            id: item._id.toString(),
        }));

        return NextResponse.json(serialized);
    } catch (error) {
        console.error("Error fetching history:", error);
        return NextResponse.json([]);
    }
}
