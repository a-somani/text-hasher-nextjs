// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { hashString } from "@/utils/hash"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  hashedText: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { inputText } = req.body
  const hashedText = hashString(inputText)
  res.status(200).json({ hashedText })
}
