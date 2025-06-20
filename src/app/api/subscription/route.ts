import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST() {
  const userId = (await auth()).userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // capture payment detail
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 400 });
    }

    const subscriptionEnds = new Date();
    subscriptionEnds.setMonth(subscriptionEnds.getMonth() + 1);

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isSubscribed: true,
        subscriptionEnds: subscriptionEnds,
      },
    });

    return NextResponse.json(
      {
        message: "Subscribed successfully! ",
        subscriptionEnds: updatedUser.subscriptionEnds,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating subscription: ", error);
    return NextResponse.json(
      {
        error: "Internal Server error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const userId = (await auth()).userId;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        isSubscribed: true,
        subscriptionEnds: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 400 });
    }

    const now = new Date();
    if (user.subscriptionEnds && user.subscriptionEnds < now) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          isSubscribed: false,
          subscriptionEnds: null,
        },
      });

      return NextResponse.json({
        isSubscribed: false,
        subscriptionEnds: null,
      });
    }

    return NextResponse.json({
      isSubscribed: user.isSubscribed,
      subscriptionEnds: user.subscriptionEnds,
    });
  } catch (error) {
    console.error("Error displaying subscription: ", error);
    return NextResponse.json(
      {
        error: "Internal Server error",
      },
      { status: 500 }
    );
  }
}
