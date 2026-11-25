import z from "zod";


export const loginSchema = {
    body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })
}


export const signupSchema = {
    body: z.object({
        name: z.string(),
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