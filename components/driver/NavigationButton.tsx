'use client'

interface Destination {
  latitude: number
  longitude: number
}

interface NavigationButtonProps {
  destination: Destination
}

export default function NavigationButton({
  destination,
}: NavigationButtonProps) {
  const openNavigation = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&travelmode=driving`

    window.open(url, '_blank')
  }

  return (
    <button
      onClick={openNavigation}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
    >
      Navigate
    </button>
  )
}
