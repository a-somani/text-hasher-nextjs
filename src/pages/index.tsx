import DOMPurify from "dompurify"
import { Inter } from "next/font/google"
import { useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const inter = Inter({ subsets: ["latin"] })

const textMaxLength = 140

export default function Home() {
  const [activeNotification, setActiveNotification] = useState("")
  const [formText, setFormText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)

    const response = await fetch("/api/hashForm", {
      method: "POST",
      body: JSON.stringify({ inputText: DOMPurify.sanitize(formText) }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const { hashedText } = await response.json()
    if (activeNotification) {
      toast.dismiss(activeNotification)
      setActiveNotification("")
    }
    const notification = toast.success(
      <div className="flex w-full flex-col items-center self-center text-center">
        <h1 className="font-semibold text-[#102A43]">Your Hashed Text</h1>
        <span className="text-[#102A43]">{hashedText}</span>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
      }
    )
    setActiveNotification(notification as string)
    setFormText("")
    setSubmitting(false)
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#243B53] p-4">
      <ToastContainer
        draggable={false}
        toastStyle={{
          width: "max-content",
          maxWidth: "100%",
          margin: "8px auto",
        }}
        style={{
          width: "max-content",
          maxWidth: "100%",
          margin: "8px auto",
        }}
        position="top-center"
      />
      <form
        className="h-xl flex w-full max-w-sm flex-col rounded-lg bg-white p-8 shadow-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-8 self-center text-center text-lg font-semibold text-[#102A43]">
          Write any text and see it hashed using the SHA-256 algorithm in
          base64!
        </h1>
        <div className="flex w-full items-end justify-between align-bottom">
          <label htmlFor="input" className="text-[#102A43]">
            Input text
          </label>
          <p
            className={`text-xs font-semibold ${
              textMaxLength - formText.length === 0
                ? "text-[#911111]"
                : textMaxLength - formText.length - 10 < 0
                ? "text-[#E9B949]"
                : "text-[#102A43]"
            }`}
          >
            {textMaxLength - formText.length}
          </p>
        </div>
        <input
          id="input"
          type="text"
          disabled={submitting}
          maxLength={textMaxLength}
          autoComplete="off"
          className={`${
            submitting && "opacity-75"
          } mb-4 mt-1 w-full appearance-none rounded-md border-2 border-[#F0F4F8] bg-[#D9E2EC] px-2 py-1 leading-tight text-[#102A43] placeholder-[#486581] focus:border-[#486581] focus:bg-white focus:outline-none`}
          placeholder="write text here"
          value={formText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormText(e.target.value)
          }
        />
        <button
          type="submit"
          disabled={submitting || formText.length === 0}
          className={`${
            submitting || (formText.length === 0 && "opacity-75")
          } w-full rounded-md bg-[#2CB1BC] py-1 font-semibold uppercase text-[#102A43] hover:bg-[#38BEC9]`}
        >{`Submit`}</button>
      </form>
    </div>
  )
}
