import Image from "next/image";
import type { Stream } from "@/lib/types";

interface StreamCardProps {
  stream: Stream;
}

export default function StreamCard({ stream }: StreamCardProps) {
  // Fallback for thumbnail and avatar if they don't exist
  const thumbnailSrc =
    stream.thumbnail ||
    `/placeholder.svg?height=360&width=640&text=${stream.genre || "Stream"}`;
  const blurDataURL =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRseHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/2wBDAR";

  return (
    <div className="group cursor-pointer">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-md mb-2">
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded z-10">
          LIVE
        </div>
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded z-10">
          {stream.viewers.toLocaleString()} viewers
        </div>
        <Image
          src={thumbnailSrc}
          alt={`${stream.streamer_name}'s stream`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          placeholder="blur"
          blurDataURL={blurDataURL}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
      </div>

      {/* Stream Info */}
      <div className="flex gap-2">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-purple-600 overflow-hidden relative">
            <Image
              src={stream.avatar || "/placeholder.svg"}
              alt={stream.streamer_name}
              fill
              className="object-cover w-full h-full"
              sizes="40px"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-1 group-hover:text-purple-400 transition-colors">
            {stream.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-1">
            {stream.streamer_name}
          </p>
          <p className="text-sm text-gray-400 line-clamp-1">
            {stream.game || stream.genre}
          </p>

          <div className="flex flex-wrap gap-1 mt-1">
            <span className="text-xs bg-[#2d2d32] text-gray-300 px-1.5 py-0.5 rounded">
              {stream.language}
            </span>
            {stream.tags &&
              stream.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-[#2d2d32] text-gray-300 px-1.5 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
