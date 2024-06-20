import { z } from "zod";

export const formSchema = z.object({
  comment: z
    .string({
      required_error: "댓글을 입력해주세요.",
    })
    .max(300, "댓글은 300자 이하로 입력해주세요."),
});

export type postType = z.infer<typeof formSchema>;
