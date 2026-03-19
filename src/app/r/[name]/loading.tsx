export default function Loading() {
  return (
    <div className='mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6'>
      {/* Subreddit header skeleton */}
      <div className='glass-card rounded-2xl p-8 animate-pulse space-y-4'>
        <div className='h-5 w-24 rounded-full bg-accent/20' />
        <div className='h-10 w-1/2 rounded-xl bg-accent/10' />
        <div className='h-4 w-3/4 rounded-full bg-accent/10' />
      </div>

      {/* Post list skeleton */}
      <div className='space-y-4'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='glass-card rounded-2xl p-5 space-y-3 animate-pulse'>
            <div className='flex items-center gap-3'>
              <div className='size-8 rounded-full bg-accent/20' />
              <div className='h-3 w-32 rounded-full bg-accent/20' />
            </div>
            <div className='h-5 w-3/4 rounded-full bg-accent/10' />
            <div className='h-3 w-full rounded-full bg-accent/10' />
            <div className='h-3 w-2/3 rounded-full bg-accent/10' />
            <div className='flex gap-4 pt-2'>
              <div className='h-7 w-20 rounded-full bg-accent/10' />
              <div className='h-7 w-16 rounded-full bg-accent/10' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
