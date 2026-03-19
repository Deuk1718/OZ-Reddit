import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

import { getComments } from '@/application/use-cases/getComments'
import { getPostById } from '@/application/use-cases/getPostById'
import { CommentComposer } from '@/components/comments/CommentComposer'
import { CommentThreadList } from '@/components/comments/CommentThreadList'
import { DeletePostButton } from '@/components/feed/DeletePostButton'
import { VoteButton } from '@/components/feed/VoteButton'
import { authOptions } from '@/infrastructure/auth/authOptions'
import { PrismaCommentRepository } from '@/infrastructure/db/repositories/PrismaCommentRepository'
import { PrismaPostRepository } from '@/infrastructure/db/repositories/PrismaPostRepository'
import { formatRelativeTime } from '@/lib/formatRelativeTime'

type PostDetailPageProps = {
  params: Promise<{
    name: string
    postId: string
  }>
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { name, postId } = await params
  const session = await getServerSession(authOptions)
  const postRepository = new PrismaPostRepository()
  const commentRepository = new PrismaCommentRepository()
  const post = await getPostById(postId, {
    postRepository,
    viewerUserId: session?.user?.id,
  }).catch(() => null)
  const comments = post
    ? await getComments(
        {
          postId: post.id,
          viewerUserId: session?.user?.id,
        },
        { commentRepository, postRepository }
      ).catch(() => [])
    : []

  if (!post || post.subredditName !== name) {
    notFound()
  }

  return (
    <main className='max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8'>
      {/* Left Sidebar: Interaction (Desktop) */}
      <div className='hidden lg:flex lg:col-span-1 flex-col items-center gap-6 py-4'>
        <div className='flex flex-col items-center gap-2 bg-background/50 p-2 rounded-full border border-accent/10'>
          <button className='w-10 h-10 rounded-full hover:bg-accent/20 hover:text-secondary flex items-center justify-center transition-all'>
            <span className='material-symbols-outlined'>expand_less</span>
          </button>
          <span className='text-xs font-bold'>{post.score >= 1000 ? `${(post.score / 1000).toFixed(1)}k` : post.score}</span>
          <button className='w-10 h-10 rounded-full hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all'>
            <span className='material-symbols-outlined'>expand_more</span>
          </button>
        </div>
        <button className='w-10 h-10 rounded-full bg-background border border-accent/10 flex items-center justify-center hover:bg-accent/20 group'>
          <span className='material-symbols-outlined text-slate-400 group-hover:text-accent transition-colors'>share</span>
        </button>
        <button className='w-10 h-10 rounded-full bg-background border border-accent/10 flex items-center justify-center hover:bg-accent/20 group'>
          <span className='material-symbols-outlined text-slate-400 group-hover:text-accent transition-colors'>bookmark</span>
        </button>
        {session?.user?.id === post.authorId && (
          <DeletePostButton postId={post.id} subredditName={post.subredditName} />
        )}
      </div>

      {/* Main Content Column */}
      <div className='lg:col-span-8 flex flex-col gap-6'>
        {/* Post Content */}
        <article className='glass-card rounded-xl overflow-hidden glowing-border'>
          <div className='p-6'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-12 h-12 rounded-full bg-gradient-to-tr from-accent to-secondary p-[2px]'>
                <div className='w-full h-full rounded-full bg-background flex items-center justify-center'>
                  <span className='material-symbols-outlined text-secondary'>auto_fix_high</span>
                </div>
              </div>
              <div>
                <div className='flex items-center gap-2'>
                  <h3 className='font-bold text-slate-100'>u/{post.authorUsername ?? 'unknown'}</h3>
                  <span className='bg-accent/20 text-accent text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider'>Traveler</span>
                </div>
                <p className='text-xs text-slate-400'>Posted in <span className='text-secondary'>z/{post.subredditName}</span> • {formatRelativeTime(post.createdAt)}</p>
              </div>
            </div>

            <h1 className='text-3xl md:text-4xl font-bold mb-6 leading-tight text-slate-100'>
              {post.title}
            </h1>

            <div className='prose-oz max-w-none text-slate-300 whitespace-pre-wrap'>
              {post.body}
            </div>

            <div className='mt-10 pt-6 border-t border-accent/10 flex flex-wrap gap-4'>
              <VoteButton
                targetType='post'
                targetId={post.id}
                initialScore={post.score}
                initialVote={post.currentUserVote}
              />
              <button className='flex items-center gap-2 bg-background hover:bg-accent/20 px-4 py-2 rounded-full border border-accent/10 transition-colors'>
                <span className='material-symbols-outlined text-sm'>magic_button</span>
                <span className='text-sm font-medium'>Share the Magic</span>
              </button>
            </div>
          </div>
        </article>

        {/* Comment Section */}
        <section className='mt-8 space-y-6'>
          <h3 className='text-xl font-bold px-2 flex items-center gap-2'>
            <span className='material-symbols-outlined text-secondary'>forum</span>
            Arcane Responses ({post.commentCount})
          </h3>

          <div className='bg-background/50 border border-accent/10 rounded-xl p-4'>
            {session?.user?.id ? (
              <CommentComposer
                postId={post.id}
                submitLabel='Scribe Comment'
                placeholder='Write a response to the Archive...'
              />
            ) : (
              <div className='py-4 text-center'>
                <p className='text-slate-400 text-sm mb-4'>Login to share your wisdom.</p>
                <Link href='/login' className='bg-accent hover:bg-accent-strong text-white px-6 py-2 rounded-full text-sm font-bold transition-all'>
                  Login to Oz
                </Link>
              </div>
            )}
          </div>

          <div className='mt-6'>
            <CommentThreadList
              comments={comments}
              currentUserId={session?.user?.id ?? null}
              postId={post.id}
            />
          </div>
        </section>
      </div>

      {/* Sidebar */}
      <aside className='lg:col-span-3 flex flex-col gap-6'>
        {/* Stats Widget */}
        <div className='glass-card p-5 rounded-xl border border-accent/20'>
          <h4 className='font-bold text-slate-100 mb-4 flex items-center gap-2 text-sm'>
            <span className='material-symbols-outlined text-accent text-sm'>analytics</span>
            Sub-OZ Statistics
          </h4>
          <div className='space-y-4 text-sm'>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-slate-400'>Sub-OZ</span>
              <span className='font-bold text-secondary'>z/{post.subredditName}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-slate-400'>Post Score</span>
              <span className='font-bold'>{post.score}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-xs text-slate-400'>Comments</span>
              <span className='font-bold'>{post.commentCount}</span>
            </div>
            <button className='w-full py-2 mt-2 bg-accent/20 hover:bg-accent/30 text-accent font-bold text-sm rounded-lg transition-all border border-accent/20'>
              Join Sub-OZ
            </button>
          </div>
        </div>

        {/* Related (Stub) */}
        <div className='glass-card p-5 rounded-xl border border-accent/20'>
          <h4 className='font-bold text-slate-100 mb-4 flex items-center gap-2 text-sm'>
            <span className='material-symbols-outlined text-accent text-sm'>auto_stories</span>
            Other Archives
          </h4>
          <div className='space-y-5'>
            <div className='group block cursor-pointer'>
              <p className='text-xs text-accent mb-1'>z/{post.subredditName} • Recent</p>
              <p className='text-sm font-medium group-hover:text-secondary transition-colors'>More magical secrets coming soon...</p>
            </div>
          </div>
        </div>

        {/* Footer Small */}
        <div className='px-2 text-[10px] text-slate-500 flex flex-wrap gap-x-4 gap-y-2 uppercase tracking-widest font-bold'>
          <a className='hover:text-slate-300' href='#'>Terms of Magic</a>
          <a className='hover:text-slate-300' href='#'>Archive Policy</a>
          <span>© 2024 OZ-Reddit</span>
        </div>
      </aside>
    </main>
  )
}
