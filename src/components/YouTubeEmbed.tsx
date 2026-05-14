export default function YouTubeEmbed({ videoId, title }: { videoId: string; title?: string }) {
    return (
        <div className="relative rounded-2xl overflow-hidden border border-border bg-card aspect-video">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={title || 'YouTube video player'}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    )
}
