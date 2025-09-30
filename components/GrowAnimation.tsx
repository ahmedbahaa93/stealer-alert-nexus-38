import { MotionDiv } from "@/components/ui/motion"
import React from "react"

interface GrowAnimationProps {
  children: React.ReactNode
  scale?: number
  className?: string
}

function GrowAnimation({ children, scale = 1.01, className = '' }: GrowAnimationProps) {
  return (
    <MotionDiv
      className={className}
      initial={{ scale: 1 }}
      whileHover={{ scale: scale }}
      transition={{ type: "keyframes", stiffness: 400 }}
    >
      {children}
    </MotionDiv>
  )
}

export default GrowAnimation
