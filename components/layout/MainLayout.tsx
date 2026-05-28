'use client'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6FBFB] overflow-x-hidden">
      
      

      {/* Main Content */}
      <main className="flex-1 pb-16 md:pb-0 relative">
        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          
          {/* Turquoise Glow */}
          <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-[#DDF5F4]/50 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />

          {/* Sunflower Glow */}
          <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[#FFF4D6]/50 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
        </div>

        {/* Page Content */}
        <div className="relative z-10">
          {children}
        </div>
      </main>

      
    </div>
  )
}