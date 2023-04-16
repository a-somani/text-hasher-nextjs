import crypto from "crypto"

export const hashString = (str: string) => {
  const hash = crypto.createHash("sha256")
  hash.update(str)
  return hash.digest("base64")
}
