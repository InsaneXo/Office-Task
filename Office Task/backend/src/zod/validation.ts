import { z } from "zod"

const userSchemaValidator = z.object({
    username: z.string(),
    email: z.string().email(),
    phoneNo: z.string().regex(/^\d{10}$/),
    password: z.string().min(8),
})

export { userSchemaValidator }