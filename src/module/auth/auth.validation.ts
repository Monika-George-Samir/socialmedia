import z, { refine } from "zod";


export const loginSchema = {
    body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })
}


export const signupSchema = {
    body: z.object({
        name: z.string().min(3).max(30),
        email: z.string().email(),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
        age: z.number().min(12).max(50),
        phone: z.string()
    }).superRefine((data, ctx)=>{
        if (data.password != data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "password and confirmPassword didn't match",
                path: ['confirmPassword']
            })
        }
    })
}


export const updateProfileSchema = {
    body: z.object({
        name: z.string().min(3).max(30).optional(),
        age: z.number().min(12).max(50).optional(),
        phone: z.string().optional()
    }).refine(
        (data) => Object.keys(data).length > 0,
        {message: "no field provided to update"}
    )

}