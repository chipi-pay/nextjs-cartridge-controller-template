import { prisma } from "@/lib/prisma-client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const dynamicUserId = "dummy-dynamic-user-id";
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const total = await prisma.investment.count({
    where: { dynamicUserId },
  });

  // Get paginated and sorted investments
  const investments = await prisma.investment.findMany({
    where: { dynamicUserId },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return NextResponse.json({
    investments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
