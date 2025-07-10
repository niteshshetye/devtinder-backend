const z = require("zod");

const updateProfilePayloadSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  age: z.number().int().min(18, "Age must be at least 18").optional(),
  skills: z.array(z.string()).optional(),
  gender: z
    .enum(["male", "female"], {
      errorMap: (issue, _ctx) => {
        const { received = "", code = "" } = issue;

        if (code === "invalid_enum_value") {
          return { message: `${received} is not a valid gender` };
        }

        return { message: "" };
      },
    })
    .optional(),
  photoUrl: z.string().url({ message: "Please enter a valid URL" }).optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
});

const validateUpdateProfileBody = async (payload) => {
  const result = await updateProfilePayloadSchema.safeParseAsync(payload);

  if (!result.success) {
    const errors = result.error.errors.map((error) => error.message);
    return { success: false, errors };
  }

  return { success: true, data: result.data };
};

module.exports = {
  validateUpdateProfileBody,
};
