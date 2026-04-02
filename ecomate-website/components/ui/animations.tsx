'use client'
import { motion, HTMLMotionProps, Variants } from 'framer-motion'

interface AnimationProps extends HTMLMotionProps<'div'> {
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
}

const getDirectionVariants = (direction: string, distance: number = 20): Variants => {
  const transitions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: { x: 0, y: 0 }
  }
  return {
    hidden: { 
      opacity: 0, 
      ...transitions[direction as keyof typeof transitions] 
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
    }
  }
}

export const FadeIn = ({ 
  children, 
  delay = 0, 
  direction = 'up', 
  duration = 0.5,
  className, 
  ...props 
}: AnimationProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={getDirectionVariants(direction)}
    transition={{ 
      duration, 
      delay, 
      ease: [0.21, 0.47, 0.32, 0.98] 
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

export const ScaleIn = ({ children, delay = 0, duration = 0.5, className, ...props }: AnimationProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.94 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration, delay, ease: [0.23, 1, 0.32, 1] }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

export const StaggerContainer = ({ 
  children, 
  delay = 0, 
  className, 
  ...props 
}: AnimationProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: delay
        }
      }
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)

export const StaggerItem = ({ children, className, ...props }: AnimationProps) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 15 },
      visible: { opacity: 1, y: 0 }
    }}
    transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
)
