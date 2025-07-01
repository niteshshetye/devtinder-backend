const z = require("zod");

const signupPayloadSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  emailId: z
    .string({ required_error: "Email is Required" })
    .email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  age: z.number().int().min(18, "Age must be at least 18"),
  gender: z.enum(["male", "female"], {
    errorMap: (issue, _ctx) => {
      const { received = "", code = "" } = issue;

      if (code === "invalid_enum_value") {
        return { message: `${received} is not a valid gender` };
      }

      return { message: "Gender is required" };
    },
  }),
  photoUrl: z.string().url({ message: "Please enter a valid URL" }).optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  skills: z.array(z.string()).optional(),
});

const loginPayloadSchema = z.object({
  emailId: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long"),
});

const validateSignupBody = async (payload) => {
  const result = await signupPayloadSchema.safeParseAsync(payload);

  if (!result.success) {
    const errors = result.error.errors.map((error) => error.message);
    return { success: false, errors };
  }

  return { success: true, data: result.data };
};

const validateLoginBody = async (payload) => {
  const result = await loginPayloadSchema.safeParseAsync(payload);

  if (!result.success) {
    const errors = result.error.errors.map((error) => error.message);
    return { success: false, errors };
  }

  return { success: true, data: result.data };
};

module.exports = {
  validateSignupBody,
  validateLoginBody,
};
