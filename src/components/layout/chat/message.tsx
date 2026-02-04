"use client";
import { motion } from "motion/react";
import {
  MoreHorizontal,
  Copy,
  ArrowUpRightIcon,
  CheckIcon,
  Pin,
  Trash,
  Reply,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopy } from "@/hooks/use-copy";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Message({
  id,
  sender = "user",
  url = "/",
  content = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum praesentium voluptatum sint libero delectus officia, molestiae blanditiis culpa nesciunt deleniti animi, facilis voluptates quae modi commodi. Rem accusamus eaque nesciunt!",
  timestamp = new Date(),
  demo = false,
}) {
  const { copyToClipboard, isCopied } = useCopy();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div key={id} className="mt-5 m-3">
      <div
        className={`flex w-full ${
          sender === "user" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`flex max-w-[80%] gap-3 ${
            sender === "user" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {/* Avatar */}
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              sender === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {sender === "user" ? (
              <Link href="/profile">
                <Avatar className="rounded-[30%/30%] shadow-lg">
                  <AvatarImage src="/avaar.png" />
                  <AvatarFallback className="rounded-[30%/30%] dark:text-white">
                    M
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Link href={url}>
                <Avatar className="rounded-[30%/30%] shadow-lg">
                  <AvatarImage src="/avaar.png" />
                  <AvatarFallback className="rounded-[30%/30%] dark:text-white">
                    O
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>

          {/* Bubble */}
          <div
            className={`flex flex-col ${
              sender === "user" ? "items-end" : "items-start"
            }`}
          >
            {/* Message */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring" }}
              className="flex flex-col"
            >
              <div
                className={`px-4 py-2.5 rounded-3xl text-sm leading-relaxed shadow-sm ${
                  sender === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-xs"
                    : "bg-muted text-foreground rounded-tl-xs"
                }`}
              >
                <div>{content}</div>
                {/* Timestamp section (commented out in original) */}
                <span
                  className={`${
                    sender === "user"
                      ? "text-background"
                      : "text-muted-foreground"
                  } text-[8px] `}
                >
                  {timestamp.toUTCString()}
                </span>
              </div>
              {!demo && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 mt-1 rounded-sm"
                    >
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Trash />
                      <span>Delete</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pin />
                      <span>Pin</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Reply />
                      <span>Reply</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ArrowUpRightIcon />
                      <span>Forward</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        copyToClipboard(content, id);
                      }}
                    >
                      {isCopied(id) ? <CheckIcon /> : <Copy />}
                      <span>Copy</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
