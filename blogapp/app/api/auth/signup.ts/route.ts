import { NextRequest, NextResponse } from "next/server";
import payload from "payload";

/**
 * Handles the user registration process by accepting a POST request with user credentials.
 *
 * The function expects a JSON body containing `username`, `email`, and `password`. It
 * validates that all fields are present and checks if the email is already in use. If
 * the email is unique, it creates a new user in the "users" collection and responds
 * with the user ID. In case of missing fields or duplicate emails, it returns an
 * appropriate error message. On server errors, it responds with a 500 status.
 *
 * @param {NextRequest} req - The incoming request object containing the user details.
 * @returns {Promise<NextResponse>} - The response object with success status and user ID
 *                                    or an error message.
 */

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json(); // Parse JSON body

    console.log("Payload server", username, email, password);

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (existingUser.totalDocs > 0) {
      return NextResponse.json(
        { error: "Email is already in use." },
        { status: 409 }
      );
    }

    // Create the user
    const user = await payload.create({
      collection: "users",
      data: {
        username,
        email,
        password, 
      },
    });

    return NextResponse.json(
      { success: true, userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Payload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Handles GET requests to the `/api/auth/signup` endpoint.
 *
 * This function simply returns a 405 status with a JSON response containing
 * an error message, indicating that the route only supports POST requests.
 *
 * @returns {Promise<NextResponse>} - The response object with a 405 status and
 *                                    an appropriate error message.
 */
export async function GET() {
  return NextResponse.json(
    { message: "This route only supports POST requests." },
    { status: 405 }
  );
}
