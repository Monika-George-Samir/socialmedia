import z from "zod";


export const signupSchema = {
    body: z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        confirmPassword: z.string().min(6)
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