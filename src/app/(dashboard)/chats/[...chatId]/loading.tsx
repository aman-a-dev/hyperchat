import { Skeleton } from "@/components/ui/skeleton";
import { EllipsisVertical, ArrowLeft } from "lucide-react";
export default function ChatRoomLoading() {
  return (
    <div className="h-full flex flex-col justify-between">
      <div
        className={`mb-5 h-14 flex items-center justify-between p-3 px-5 gap-2 z-10 bg-background/50 backdrop-blur-md border border-b border-sidebar-background`}
      >
        <div className="flex items-center gap-3">
          <ArrowLeft />
          <Skeleton className="h-10 w-10" />
          <div className="flex gap-1 flex-col">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight md:text-right">
              <Skeleton className="h-5 w-52" />
            </h3>
            <h3 className="scroll-m-20 text-xs font-semibold tracking-tight md:text-right">
              <Skeleton className="h-2 w-32" />
            </h3>
          </div>
        </div>
        <EllipsisVertical />
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {Array.from({ length: 12 }).map((_, i) => {
          const isOwn = i % 2 !== 1;
          return (
            <div
              key={crypto.randomUUID()}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <Skeleton
                className={`
            h-10 rounded-2xl
            ${
              isOwn
                ? "w-3/5 rounded-tr-none bg-primary/25"
                : "w-2/3 rounded-tl-none bg-muted/50"
            }
          `}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
