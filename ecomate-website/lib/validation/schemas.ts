import { z } from 'zod'

export const orderSchema = z.object({
  client_id: z.string().uuid(),
  customer_name: z.string().min(2, 'Customer name is required'),
  phone: z.string().min(8, 'Valid phone number is required'),
  wilaya: z.string().min(1, 'Wilaya is required'),
  total_da: z.preprocess((val) => Number(val), z.number().positive()),
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'returned', 'cancelled']).optional(),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })).optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  businessName: z.string().min(2),
  phone: z.string().optional(),
})
