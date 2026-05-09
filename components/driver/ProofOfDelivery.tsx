'use client'

import { useState, useRef } from 'react'

export default function ProofOfDelivery({ onComplete }) {
  const [photo, setPhoto] = useState(null)
  const [signature, setSignature] = useState(null)
  const [notes, setNotes] = useState('')
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  
  const takePhoto = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    if (videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play()
      
      // Capture photo after 1 second
      setTimeout(() => {
        const canvas = canvasRef.current
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
        const photoData = canvas.toDataURL('image/jpeg')
        setPhoto(photoData)
        stream.getTracks().forEach(track => track.stop())
      }, 1000)
    }
  }
  
  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setSignature(null)
  }
  
  const saveSignature = () => {
    const canvas = canvasRef.current
    const signatureData = canvas.toDataURL()
    setSignature(signatureData)
  }
  
  const handleSubmit = () => {
    onComplete({ photo, signature, notes })
  }
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Take Photo</h3>
        <video ref={videoRef} className="w-full rounded-lg mb-2" />
        <canvas ref={canvasRef} className="hidden" />
        <button onClick={takePhoto} className="bg-gray-200 px-4 py-2 rounded">Take Photo</button>
        {photo && <img src={photo} alt="Delivery proof" className="mt-2 rounded-lg max-h-48" />}
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">Signature</h3>
        <canvas 
          ref={canvasRef}
          width={400}
          height={200}
          className="border rounded-lg"
          onMouseDown={(e) => {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            ctx.lineTo(x, y)
            ctx.stroke()
          }}
        />
        <div className="flex gap-2 mt-2">
          <button onClick={clearSignature} className="bg-gray-200 px-4 py-2 rounded">Clear</button>
          <button onClick={saveSignature} className="bg-blue-500 text-white px-4 py-2 rounded">Save Signature</button>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">Delivery Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded-lg"
          rows="3"
          placeholder="Any special notes about this delivery..."
        />
      </div>
      
      <button onClick={handleSubmit} className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold">
        Complete Delivery
      </button>
    </div>
  )
}
