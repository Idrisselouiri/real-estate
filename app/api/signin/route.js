import { mongooseConnect } from "@lib/mongoose";
import User from "@models/user";
import bcryptjs from "bcryptjs";

export async function POST(request) {
  const { name, email, password } = await request.json();
  if (
    !name ||
    !email ||
    !password ||
    name === "" ||
    email === "" ||
    password === ""
  ) {
    return Response.json(
      { message: "All fields are required", success: false },
      { status: 401 }
    );
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });
  try {
    await mongooseConnect();
    await newUser.save();
    return Response.json(
      { message: "Signin SuccessFully", success: true },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error.message, success: false },
      { status: 404 }
    );
  }
}
