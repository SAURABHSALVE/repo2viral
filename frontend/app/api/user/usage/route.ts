import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongodb";

// GET /api/user/usage — returns { is_pro, usage_count } for current user
export async function GET() {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ is_pro: false, usage_count: 0 });
        }

        const { db } = await connectToDatabase();
        const user = await db.collection("user_usage").findOne({
            $or: [
                { user_id: session.userId },
                { email: session.user.email },
            ],
        });

        if (!user) {
            return NextResponse.json({ is_pro: false, usage_count: 0 });
        }

        return NextResponse.json({
            is_pro: user.is_pro || false,
            usage_count: user.usage_count || 0,
            email: user.email,
            gumroad_subscription_id: user.gumroad_subscription_id || null,
        });
    } catch (error) {
        console.error("Error fetching usage:", error);
        return NextResponse.json({ is_pro: false, usage_count: 0 });
    }
}
