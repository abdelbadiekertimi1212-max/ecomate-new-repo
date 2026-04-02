'use client'
import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label: string
  bucket?: string
  folder?: string
}

export default function ImageUpload({ value, onChange, label, bucket = 'media', folder = 'assets' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file) return

      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      onChange(data.publicUrl)
      toast.success('Image uploaded successfully!')
    } catch (error: any) {
      toast.error('Error uploading image: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 8, display: 'block' }}>{label}</label>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        style={{
          width: '100%',
          height: 140,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)')}
        onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
      >
        {value ? (
          <img 
            src={value} 
            alt="Upload Preview" 
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 10 }} 
          />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
            <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.4)' }}>
              {uploading ? 'Uploading...' : 'Click to upload (PNG, JPG)'}
            </div>
          </div>
        )}
        
        {uploading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div className="spinner" />
          </div>
        )}
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />
      
      {value && (
        <button 
          onClick={(e) => { e.stopPropagation(); onChange('') }}
          style={{
            marginTop: 8,
            fontSize: 11,
            color: '#ef4444',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Remove Image
        </button>
      )}
    </div>
  )
}
