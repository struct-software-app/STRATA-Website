import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Boxes, ThumbsUp, ThumbsDown, Share2, Check, MessageSquare, Send } from 'lucide-react';
import { useData } from '../context/DataContext';
import { youtubeEmbedUrl } from '../lib/youtube';
import { formatReleaseDate } from '../lib/formatDate';
import { AssetImage } from '../components/AssetImage';
import { Avatar } from '../components/Avatar';
import { SuggestedList } from '../components/academy/SuggestedList';

const DESCRIPTION_COLLAPSE_CHARS = 280;

interface CommentItem {
  id: string;
  author: string;
  avatar?: string;
  date: string;
  text: string;
  likes: number;
}

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    author: 'Structural Lead',
    date: '3 days ago',
    text: 'Very clear breakdown of the stiffness matrix and code compliance checks. Much faster than manual spreadsheet verification.',
    likes: 8,
  },
  {
    id: 'c2',
    author: 'Civil Consultant',
    date: '1 week ago',
    text: 'The step-by-step export to DXF and calculation report feature saves a lot of drafting hours.',
    likes: 4,
  },
];

export const AcademyWatchPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    apps,
    categories,
    appLogos,
    loading,
    user,
    profile,
    getAcademyVideo,
    getRelatedVideos,
  } = useData();

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Like & Dislike state
  const [likeStatus, setLikeStatus] = useState<'liked' | 'disliked' | null>(null);
  const [likeCount, setLikeCount] = useState(42);
  const [copiedLink, setCopiedLink] = useState(false);

  // Comments state
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');

  const video = videoId ? getAcademyVideo(videoId) : undefined;
  const fromAcademy = Boolean(
    (location.state as { fromAcademy?: boolean } | null)?.fromAcademy
  );

  useEffect(() => {
    setIframeLoaded(false);
    setIsExpanded(false);
    setLikeStatus(null);
  }, [videoId]);

  useEffect(() => {
    if (video) {
      document.title = `${video.title} — STRATA Tutorial`;
    }
    return () => {
      document.title = 'Strata ENG';
    };
  }, [video]);

  const program = useMemo(() => {
    if (!video?.programId) return undefined;
    return apps.find(
      (a) => a.id === video.programId || a.slug === video.programId
    );
  }, [apps, video]);

  const category = useMemo(() => {
    const slug = video?.categoryId || program?.categorySlug;
    if (!slug) return undefined;
    return categories.find((c) => c.slug === slug);
  }, [categories, video, program]);

  const relatedVideos = useMemo(() => {
    if (!video) return [];
    return getRelatedVideos(video, 8);
  }, [video, getRelatedVideos]);

  if (loading && !video) {
    return <div className="min-h-[50vh]" />;
  }

  if (!video) {
    return <Navigate to="/tutorial" replace />;
  }

  const programLogo = program
    ? appLogos[program.id] || appLogos[program.slug]
    : undefined;
  const releaseDate = formatReleaseDate(video.createdAt);
  const isLongDescription = video.description.length > DESCRIPTION_COLLAPSE_CHARS;
  const displayedDescription =
    isLongDescription && !isExpanded
      ? `${video.description.slice(0, DESCRIPTION_COLLAPSE_CHARS).trimEnd()}...`
      : video.description;

  const handleBack = () => {
    if (fromAcademy) {
      navigate(-1);
    } else {
      navigate('/tutorial');
    }
  };

  const handleLike = () => {
    if (likeStatus === 'liked') {
      setLikeStatus(null);
      setLikeCount((prev) => prev - 1);
    } else {
      if (likeStatus === 'disliked') {
        // Just switch
      } else {
        setLikeCount((prev) => prev + 1);
      }
      setLikeStatus('liked');
    }
  };

  const handleDislike = () => {
    if (likeStatus === 'disliked') {
      setLikeStatus(null);
    } else {
      if (likeStatus === 'liked') {
        setLikeCount((prev) => prev - 1);
      }
      setLikeStatus('disliked');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCommentText.trim();
    if (!trimmed) return;

    const authorName = profile?.firstName
      ? `${profile.firstName} ${profile.secondName || ''}`.trim()
      : user?.email?.split('@')[0] || 'Engineer';

    const newComment: CommentItem = {
      id: `c_${Date.now()}`,
      author: authorName,
      date: 'Just now',
      text: trimmed,
      likes: 0,
    };

    setComments((prev) => [newComment, ...prev]);
    setNewCommentText('');
  };

  return (
    <div className="bg-white text-zinc-900 min-h-screen py-6 md:py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>All tutorials</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 lg:gap-10">
          {/* Left Column: Embedded Player, Actions, Comments */}
          <div className="min-w-0">
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-elevated">
              <iframe
                key={video.id}
                src={youtubeEmbedUrl(video.videoId, { autoplay: true })}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => setIframeLoaded(true)}
                className={`w-full h-full border-0 transition-opacity duration-300 motion-reduce:transition-none ${
                  iframeLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>

            {/* Video Title */}
            <div className="mt-4">
              <h1 className="text-xl md:text-2xl font-bold text-black tracking-tight leading-snug">
                {video.title}
              </h1>

              {/* YouTube Style Action Bar: Channel info on left, Like/Dislike/Share on right */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                {/* Channel / Program details */}
                <div className="flex items-center gap-3 min-w-0">
                  {program ? (
                    <Link
                      to={`/app/${program.slug}`}
                      className="w-10 h-10 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200/80 flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
                    >
                      <AssetImage
                        src={programLogo}
                        alt={program.name}
                        className="w-full h-full object-cover"
                        fallback={<Boxes className="w-5 h-5 text-zinc-700" />}
                      />
                    </Link>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-bold font-mono shrink-0">
                      S
                    </div>
                  )}

                  <div className="min-w-0">
                    {program ? (
                      <Link
                        to={`/app/${program.slug}`}
                        className="font-bold text-sm text-black hover:underline truncate block"
                      >
                        {program.name}
                      </Link>
                    ) : (
                      <span className="font-bold text-sm text-black">STRATA Engineering</span>
                    )}
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      {category && <span>{category.name}</span>}
                      {category && releaseDate && <span>•</span>}
                      {releaseDate && <span>{releaseDate}</span>}
                      {video.duration && <span>•</span>}
                      {video.duration && <span className="font-mono">{video.duration}</span>}
                    </div>
                  </div>
                </div>

                {/* Right: Like / Dislike pill and Share button */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Like / Dislike Group */}
                  <div className="inline-flex items-center bg-zinc-100 rounded-full p-1 border border-zinc-200">
                    <button
                      type="button"
                      onClick={handleLike}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors focus:outline-none ${
                        likeStatus === 'liked'
                          ? 'bg-black text-white'
                          : 'text-zinc-800 hover:bg-zinc-200/80'
                      }`}
                      aria-label="Like video"
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${likeStatus === 'liked' ? 'fill-white' : ''}`} />
                      <span>{likeCount}</span>
                    </button>

                    <div className="w-px h-4 bg-zinc-300 mx-1" aria-hidden="true" />

                    <button
                      type="button"
                      onClick={handleDislike}
                      className={`p-1.5 rounded-full text-xs font-semibold transition-colors focus:outline-none ${
                        likeStatus === 'disliked'
                          ? 'bg-black text-white'
                          : 'text-zinc-800 hover:bg-zinc-200/80'
                      }`}
                      aria-label="Dislike video"
                    >
                      <ThumbsDown className={`w-3.5 h-3.5 ${likeStatus === 'disliked' ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  {/* Share button */}
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 rounded-full text-xs font-semibold text-zinc-800 transition-colors focus:outline-none"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Description Box */}
              {video.description && (
                <div className="mt-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                  <p className="whitespace-pre-line text-xs sm:text-sm text-zinc-700 leading-relaxed">
                    {displayedDescription}
                  </p>

                  {isLongDescription && (
                    <button
                      type="button"
                      onClick={() => setIsExpanded((prev) => !prev)}
                      className="mt-2 text-xs font-semibold text-black hover:opacity-75 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    >
                      {isExpanded ? 'Show less' : '...more'}
                    </button>
                  )}
                </div>
              )}

              {/* Comments Section */}
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-5">
                  <MessageSquare className="w-5 h-5 text-black" />
                  <h2 className="text-base font-bold text-black">
                    {comments.length} Comments
                  </h2>
                </div>

                {/* Comment Input */}
                <form onSubmit={handleAddComment} className="flex items-start gap-3 mb-6">
                  {user ? (
                    <Avatar size={36} />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center text-xs font-bold shrink-0">
                      U
                    </div>
                  )}

                  <div className="flex-1">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full pb-2 pt-1 border-b border-zinc-300 text-sm focus:border-black focus:outline-none bg-transparent transition-colors placeholder:text-zinc-400"
                    />
                    {newCommentText.trim() && (
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setNewCommentText('')}
                          className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-black"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-black text-white text-xs font-semibold rounded-full hover:bg-zinc-800 transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          <span>Comment</span>
                        </button>
                      </div>
                    )}
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-black">
                            @{comment.author.toLowerCase().replace(/\s+/g, '_')}
                          </span>
                          <span className="text-[11px] text-zinc-500">
                            {comment.date}
                          </span>
                        </div>
                        <p className="mt-1 text-xs sm:text-sm text-zinc-800 leading-relaxed">
                          {comment.text}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 hover:text-black transition-colors"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{comment.likes > 0 ? comment.likes : ''}</span>
                          </button>
                          <button
                            type="button"
                            className="hover:text-black transition-colors"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            className="font-medium hover:text-black transition-colors"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Suggested */}
          <aside aria-label="Suggested tutorials" className="min-w-0">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-black mb-4">
              Suggested
            </h2>
            <SuggestedList videos={relatedVideos} fromAcademy={fromAcademy} />
          </aside>
        </div>
      </div>
    </div>
  );
};
