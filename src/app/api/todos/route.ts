import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const ITEMS_PER_PAGE = 10;

export async function GET(req: NextRequest) {
  const userId = (await auth()).userId;

  if (!userId) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";

  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId,
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: { createdAt: "desc" },
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
    });

    const todoItems = await prisma.todo.count({
      where: {
        userId,
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    const totalPages = Math.ceil(todoItems / ITEMS_PER_PAGE);

    return NextResponse.json({
      todos,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching todos", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const userId = (await auth()).userId;

  if (!userId) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        todos: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found!",
        },
        { status: 404 }
      );
    }

    if (!user.isSubscribed && user.todos.length >= 3) {
      return NextResponse.json(
        {
          error:
            "Free users can only create upto 3 todos. Please subscribe to our paid plans to write more awesome todos.",
        },
        { status: 403 }
      );
    }

    const { title } = await req.json();
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Todo title must be at least 1 character long" },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.create({
      data: {
        title: title.trim(),
        userId,
      },
    });

    return NextResponse.json(todo, { status: 200 });
  } catch (error) {
    console.error("Error fetching todos", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
