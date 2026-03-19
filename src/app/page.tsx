import { getServerSession } from 'next-auth'

import { getPosts } from '@/application/use-cases/getPosts'
import { FeedPagination } from '@/components/feed/FeedPagination'
import { PostCard } from '@/components/feed/PostCard'
import { LeftSidebar } from '@/components/layout/LeftSidebar'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { PrismaPostRepository } from '@/infrastructure/db/repositories/PrismaPostRepository'
import { formatRelativeTime } from '@/lib/formatRelativeTime'

type HomePageProps = {
  searchParams: Promise<{
    sort?: string
    cursor?: string
  }>
}

const trendingSubOzs = [
  { name: 'r/emeraldcity', members: '12.5k Travelers', color: 'bg-emerald-500/20 text-emerald-500' },
  { name: 'r/munchkinland', members: '8.2k Travelers', color: 'bg-pink-500/20 text-pink-500' },
  { name: 'r/wickedwest', members: '4.1k Travelers', color: 'bg-blue-500/20 text-blue-500' },
]

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams
  const session = await getServerSession(authOptions)
  const sort = params.sort === 'new' ? 'new' : 'hot'
  const cursor = params.cursor
  const postRepository = new PrismaPostRepository()
  const { posts, nextCursor } = await getPosts(
    {
      sort,
      cursor,
      viewerUserId: session?.user?.id,
    },
    { postRepository }
  )

  return (
    <main className='max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8'>
      {/* Left Sidebar */}
      <LeftSidebar recentCommunities={
        posts
          .map(p => ({ name: p.subredditName }))
          .filter((c, i, arr) => arr.findIndex(x => x.name === c.name) === i)
          .slice(0, 3)
      } />

      {/* Main Content Area */}
      <div className='lg:col-span-7 space-y-6'>
        {/* Create Post Header (Simplified for now) */}
        <div className='magic-card rounded-xl p-4 flex items-center gap-4'>
          <div className='size-10 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden'>
            <span className='material-symbols-outlined text-slate-400'>person</span>
          </div>
          <input 
            className='flex-1 bg-accent/5 border border-accent/20 rounded-xl py-2 px-4 focus:ring-1 focus:ring-accent focus:bg-accent/10 transition-all outline-none text-slate-100 placeholder:text-slate-500' 
            placeholder='Share your magical discovery...' 
            type='text' 
          />
          <div className='flex items-center gap-2'>
            <button className='p-2 text-slate-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-all'><span className='material-symbols-outlined'>image</span></button>
            <button className='p-2 text-slate-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-all'><span className='material-symbols-outlined'>link</span></button>
          </div>
        </div>

        {/* Feed Posts */}
        <div className='space-y-4'>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <PostCard
                key={post.id}
                postId={post.id}
                title={post.title}
                excerpt={post.body ?? ''}
                author={post.authorUsername ?? 'unknown'}
                subreddit={post.subredditName}
                createdAt={formatRelativeTime(post.createdAt)}
                score={post.score}
                currentUserVote={post.currentUserVote}
                commentCount={post.commentCount}
                href={`/r/${post.subredditName}/${post.id}`}
                isLarge={index === 0}
              />
            ))
          ) : (
            <div className='magic-card rounded-2xl p-8 text-center border-dashed'>
              <p className='text-slate-400'>No magical discoveries yet.</p>
            </div>
          )}
        </div>

        <FeedPagination
          basePath='/'
          sort={sort}
          currentCursor={cursor}
          nextCursor={nextCursor}
        />
      </div>

      {/* Right Sidebar */}
      <aside className='hidden lg:block lg:col-span-3 space-y-6'>
        {/* Trending Communities */}
        <div className='magic-card rounded-2xl p-5'>
          <h4 className='text-sm font-bold text-slate-100 mb-4 flex items-center gap-2'>
            <span className='material-symbols-outlined text-accent'>explore</span> Trending Sub-OZs
          </h4>
          <div className='space-y-4'>
            {trendingSubOzs.map((community) => (
              <div key={community.name} className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className={`size-8 rounded-lg flex items-center justify-center font-bold text-xs ${community.color}`}>
                    {community.name.substring(2, 4).toUpperCase()}
                  </div>
                  <div>
                    <p className='text-xs font-bold'>{community.name}</p>
                    <p className='text-[10px] text-slate-500'>{community.members}</p>
                  </div>
                </div>
                <button className='bg-accent/20 hover:bg-accent/30 text-accent text-[10px] font-bold px-3 py-1 rounded-full transition-all'>Join</button>
              </div>
            ))}
          </div>
        </div>

        {/* News Widget (OZ Style) */}
        <div className='bg-gradient-to-br from-accent/30 to-background rounded-2xl p-5 border border-accent/20'>
          <p className='text-[10px] font-bold text-accent uppercase mb-1'>Breaking News</p>
          <h5 className='text-sm font-bold text-slate-100 leading-snug'>Hot Air Balloon sighted near the Deadly Desert!</h5>
          <p className='text-xs text-slate-400 mt-2'>Authorities advise travelers to keep their ruby slippers polished and ready for sudden departures...</p>
          <button className='mt-4 w-full py-2 bg-accent text-white text-xs font-bold rounded-xl hover:shadow-[0_0_15px_rgba(159,31,239,0.5)] transition-all'>Read More</button>
        </div>

        <div className='px-4 text-[10px] text-slate-600 space-x-2'>
          <a className='hover:underline' href='#'>Privacy Policy</a>
          <span>•</span>
          <a className='hover:underline' href='#'>Terms of Service</a>
          <span>•</span>
          <a className='hover:underline' href='#'>Wizard Rules</a>
          <p className='mt-4'>© 2024 OZ-Reddit Inc. All magical rights reserved.</p>
        </div>
      </aside>
    </main>
  )
}
