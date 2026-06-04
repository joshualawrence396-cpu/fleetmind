'use client'

import { useState, useRef } from 'react'

interface ProofOfDeliveryData {
  photo: string | null
  signature: string | null
  notes: string
}

interface ProofOfDeliveryProps {
  onComplete: (data: ProofOfDeliveryData) => void
}

export default function ProofOfDelivery({
  onComplete,
}: ProofOfDeliveryProps) {
  const [photo, setPhoto] = useState<string | null>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [notes, setNotes] = useState<string>('')

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handlePhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.onloadend = () => {
      setPhoto(reader.result as string)
    }

    reader.readAsDataURL(file)
  }

  const handleComplete = () => {
    onComplete({
      photo,
      signature,
      notes,
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Proof of Delivery
      </h2>

      <div>
        <label className="block mb-2">
          Upload Photo
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
        />
      </div>

      {photo && (
        <img
          src={photo}
          alt="Proof of delivery"
          className="max-w-xs rounded"
        />
      )}

      <div>
        <label className="block mb-2">
          Signature
        </label>

        <input
          type="text"
          placeholder="Customer signature"
          value={signature || ''}
          onChange={(e) => setSignature(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block mb-2">
          Notes
        </label>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border p-2 rounded w-full"
          rows={4}
        />
      </div>

      <button
        onClick={handleComplete}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Complete Delivery
      </button>
    </div>
  )
}