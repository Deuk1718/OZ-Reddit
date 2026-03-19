export default function Loading() {
  return (
    <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
        {/* Vote column skeleton */}
        <div className='hidden lg:flex lg:col-span-1 flex-col items-center gap-4 py-4 animate-pulse'>
          <div className='size-10 rounded-full bg-accent/20' />
          <div className='h-4 w-6 rounded bg-accent/10' />
          <div className='size-10 rounded-full bg-accent/20' />
        </div>

        {/* Post content skeleton */}
        <div className='lg:col-span-8 space-y-6 animate-pulse'>
          <div className='glass-card rounded-2xl p-6 space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='size-8 rounded-full bg-accent/20' />
              <div className='h-3 w-40 rounded-full bg-accent/20' />
            </div>
            <div className='h-8 w-3/4 rounded-xl bg-accent/10' />
            <div className='space-y-2'>
              <div className='h-3 w-full rounded-full bg-accent/10' />
              <div className='h-3 w-full rounded-full bg-accent/10' />
              <div className='h-3 w-2/3 rounded-full bg-accent/10' />
            </div>
          </div>

          {/* Comment skeleton */}
          <div className='glass-card rounded-2xl p-6 space-y-4'>
            <div className='h-5 w-24 rounded-full bg-accent/20' />
            {[1, 2, 3].map((i) => (
              <div key={i} className='space-y-2 border-l-2 border-accent/20 pl-4'>
                <div className='flex items-center gap-2'>
                  <div className='size-6 rounded-full bg-accent/20' />
                  <div className='h-3 w-24 rounded-full bg-accent/20' />
                </div>
                <div className='h-3 w-full rounded-full bg-accent/10' />
                <div className='h-3 w-3/4 rounded-full bg-accent/10' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
