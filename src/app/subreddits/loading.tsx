export default function Loading() {
  return (
    <div className='mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6'>
      {/* Hero skeleton */}
      <div className='glass-card rounded-2xl p-8 animate-pulse space-y-4'>
        <div className='h-5 w-36 rounded-full bg-accent/20' />
        <div className='h-10 w-2/3 rounded-xl bg-accent/10' />
        <div className='h-4 w-full rounded-full bg-accent/10' />
        <div className='flex gap-3 pt-2'>
          <div className='h-10 w-36 rounded-full bg-accent/20' />
          <div className='h-10 w-36 rounded-full bg-accent/10' />
        </div>
      </div>

      {/* List skeleton */}
      <div className='glass-card rounded-2xl p-8 space-y-4 animate-pulse'>
        <div className='h-8 w-40 rounded-xl bg-accent/20' />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className='magic-card rounded-xl p-5 space-y-2'>
            <div className='flex items-center gap-3'>
              <div className='h-5 w-32 rounded-full bg-accent/20' />
              <div className='h-5 w-20 rounded-full bg-accent/10' />
            </div>
            <div className='h-3 w-full rounded-full bg-accent/10' />
          </div>
        ))}
      </div>
    </div>
  )
}
