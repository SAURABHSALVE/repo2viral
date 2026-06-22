import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ is_pro: false, usage_count: 0 });
        }

        const userId = (session as any).userId || session.user.id;
        if (!userId) {
            return NextResponse.json({ is_pro: false, usage_count: 0 });
        }

        const res = await fetch(`${BACKEND_URL}/profile?user_id=${encodeURIComponent(userId)}`);
        if (!res.ok) {
            return NextResponse.json({ is_pro: false, usage_count: 0 });
        }

        const user = await res.json();
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
