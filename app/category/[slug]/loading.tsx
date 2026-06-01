// app/category/[slug]/loading.tsx
// 
// Ye sirf tab dikhega jab navigating between categories ho
// (client-side navigation). Initial server render mein ye nahi dikhega.
// "Loading..." text hatao, skeleton UI rakho.

export default function CategoryLoading() {
  return (
    <div style={{ background: '#F6FBFB', minHeight: '100vh' }}>
      {/* Banner skeleton */}
      <div
        className='w-full h-48 animate-pulse'
        style={{ background: '#E0F5F5' }}
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Toolbar skeleton */}
        <div
          className='h-16 rounded-[1.5rem] mb-8 animate-pulse'
          style={{ background: 'white', border: '1px solid #E7EEEE' }}
        />

        {/* Product grid skeleton — 8 cards */}
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className='rounded-2xl animate-pulse'
              style={{
                background: 'white',
                border: '1px solid #E7EEEE',
                height: '320px',
              }}
            >
              <div
                className='w-full h-52 rounded-t-2xl'
                style={{ background: '#E0F5F5' }}
              />
              <div className='p-4 space-y-2'>
                <div className='h-4 rounded' style={{ background: '#E7EEEE', width: '80%' }} />
                <div className='h-4 rounded' style={{ background: '#E7EEEE', width: '50%' }} />
                <div className='h-6 rounded' style={{ background: '#E0F5F5', width: '40%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}