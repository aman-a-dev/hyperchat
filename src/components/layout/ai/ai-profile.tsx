"use client";

import { useEffect, useRef, useState, memo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Download,
  RefreshCcw,
  Loader2,
  Paperclip,
  X,
  UserPen,
  Sparkles,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import ClientOnly from "@/components/shared/client-only";
import { cn } from "@/lib/utils";

/* ---------------- TYPES ---------------- */

type StylePreset = "Realistic" | "Anime" | "Cinematic" | "Pixel" | "Minimal";

type ChatMessage =
  | {
      id: number;
      role: "user";
      content: string;
      style: StylePreset;
      image?: string;
    }
  | {
      id: number;
      role: "ai";
      images: string[];
      prompt: string;
      style: StylePreset;
    };

/* ---------------- DEMO DATA ---------------- */

const STYLE_PRESETS: { label: StylePreset; icon: React.ReactNode }[] = [
  { label: "Realistic", icon: "🎨" },
  { label: "Anime", icon: "🌸" },
  { label: "Cinematic", icon: "🎬" },
  { label: "Pixel", icon: "🕹️" },
  { label: "Minimal", icon: "⚪" },
];

/* ---------------- COMPONENT ---------------- */

function AIProfile() {
  const [started, setStarted] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<StylePreset>("Realistic");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState("");
  const [upload, setUpload] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  /* auto scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function streamTyping(text: string) {
    setTyping("");
    for (let i = 0; i < text.length; i++) {
      await new Promise((r) => setTimeout(r, 20));
      setTyping((prev) => prev + text[i]);
    }
    setTimeout(() => setTyping(""), 1000);
  }

  async function generate(promptText: string, preset: StylePreset) {
    setLoading(true);
    await streamTyping("Generating images…");

    // 🔴 DEMO IMAGES (replace with real API)
    const images = Array.from({ length: 1 }).map(
      (_, i) => `/avatar-${(i % 5) + 1}.png`,
    );

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "ai",
        images,
        prompt: promptText,
        style: preset,
      },
    ]);

    setLoading(false);
  }

  async function handleSend() {
    if (!prompt.trim() && !upload) return;
    if (!started) setStarted(true);

    const userPrompt = prompt;
    const preset = style;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        content: userPrompt || "Uploaded an image",
        style: preset,
        image: upload || undefined,
      },
    ]);

    setPrompt("");
    setUpload(null);
    await generate(userPrompt, preset);
  }

  function handleRegenerate(msg: ChatMessage) {
    if (msg.role !== "ai") return;
    generate(msg.prompt, msg.style);
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUpload(URL.createObjectURL(file));
  }

  function downloadImage(src: string) {
    const a = document.createElement("a");
    a.href = src;
    a.download = "ai-avatar.png";
    a.click();
  }

  function setAsProfile(src: string) {
    setSelectedImage(src);
    // In a real app, you would make an API call here
    setTimeout(() => {
      setSelectedImage(null);
    }, 2000);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-hidden mt-10">
        {/* START SCREEN */}
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div
              key="start-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col overflow-scroll"
            >
              {/* Hero Section */}
              <div className="flex-1 pt-20 flex flex-col items-center justify-center px-4 text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/20 rounded-full blur-xl" />
                    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border backdrop-blur-sm">
                      <Sparkles className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-2xl"
                >
                  <h2 className="text-3xl font-bold tracking-tight mb-3">
                    Create Your Perfect Avatar
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Describe your ideal profile picture or upload a reference
                    image. Choose from multiple styles to match your
                    personality.
                  </p>
                </motion.div>

                {/* Style Chips - Start Screen */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-2 justify-center mb-8"
                >
                  {STYLE_PRESETS.map(({ label, icon }) => (
                    <Button
                      key={label}
                      size="sm"
                      variant={style === label ? "default" : "outline"}
                      className="gap-2 rounded-full"
                      onClick={() => setStyle(label)}
                    >
                      <span>{icon}</span>
                      {label}
                    </Button>
                  ))}
                </motion.div>
              </div>

              {/* Demo Gallery Slider */}
              <div className="pb-12">
                <div className="mb-4 px-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Try these examples
                  </h3>
                </div>
                <ClientOnly>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
                    <InfiniteSlider speed={15} gap={16} reverse>
                      {Array.from({ length: 10 }).map((_, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.05, y: -4 }}
                          whileTap={{ scale: 0.95 }}
                          className="group relative rounded-2xl overflow-hidden border shadow-sm bg-card"
                          onClick={() => {
                            //setPrompt(item.prompt)
                            // textareaRef.current?.focus()
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                          <Image
                            src={`/demo/ai_profle_(${i + 1}).webp`}
                            alt={`ai_profile_(${i})`}
                            width={180}
                            height={180}
                            className="rounded object-cover h-full w-full"
                          />
                          <div className="absolute bottom-2 left-2 right-2 z-20">
                            <p className="text-xs text-white/90 text-left truncate px-2">
                              {/*item.prompt*/ i}
                            </p>
                          </div>
                        </motion.button>
                      ))}
                    </InfiniteSlider>
                    <InfiniteSlider speed={15} gap={16}>
                      {Array.from({ length: 10 }).map((item, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.05, y: -4 }}
                          whileTap={{ scale: 0.95 }}
                          className="mt-3 group relative rounded-2xl overflow-hidden border shadow-sm bg-card"
                          onClick={() => {
                            //setPrompt(item.prompt)
                            // textareaRef.current?.focus()
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                          <Image
                            src={`/demo/ai_profle_(${i + 10}).webp`}
                            alt={`ai_profile_(${i})`}
                            width={180}
                            height={180}
                            className="rounded object-cover h-full w-full"
                          />
                          <div className="absolute bottom-2 left-2 right-2 z-20">
                            <p className="text-xs text-white/90 text-left truncate px-2">
                              {/*item.prompt*/ i}
                            </p>
                          </div>
                        </motion.button>
                      ))}
                    </InfiniteSlider>
                  </div>
                </ClientOnly>
              </div>
            </motion.div>
          ) : (
            /* CHAT INTERFACE */
            <motion.div
              key="chat-interface"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col"
            >
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-8">
                  <AnimatePresence mode="wait">
                    {messages.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                      >
                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-4">
                          <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">
                          Start Creating
                        </h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          Describe your ideal avatar or upload a reference
                          image. The AI will generate multiple options based on
                          your style.
                        </p>
                      </motion.div>
                    )}

                    {messages.map((msg) =>
                      msg.role === "user" ? (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex justify-end"
                        >
                          <div className="max-w-[80%]">
                            <div className="flex items-end gap-2 mb-1">
                              <div className="text-xs text-muted-foreground">
                                You
                              </div>
                              <div className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                {msg.style}
                              </div>
                            </div>
                            <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-2xl rounded-br-none px-4 py-3 space-y-3">
                              {msg.content && <p>{msg.content}</p>}
                              {msg.image && (
                                <div className="relative">
                                  <Image
                                    src={msg.image}
                                    alt="Uploaded reference"
                                    width={160}
                                    height={160}
                                    className="rounded-lg border-2 border-white/20 object-cover"
                                  />
                                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                    Reference
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="p-1 rounded-md bg-primary/10">
                              <Sparkles className="h-3 w-3 text-primary" />
                            </div>
                            <div className="text-xs font-medium">
                              AI Generated
                            </div>
                            <div className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {msg.style}
                            </div>
                          </div>

                          {/* Image Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {msg.images.map((img, i) => (
                              <motion.div
                                key={i}
                                initial={{
                                  opacity: 0,
                                  scale: 0.9,
                                }}
                                animate={{
                                  opacity: 1,
                                  scale: 1,
                                }}
                                transition={{ delay: i * 0.1 }}
                                className={cn(
                                  "group relative rounded-xl overflow-hidden border bg-card",
                                  selectedImage === img &&
                                    "ring-2 ring-primary ring-offset-2",
                                )}
                              >
                                <Image
                                  src={img}
                                  alt={`Generated option ${i + 1}`}
                                  width={200}
                                  height={200}
                                  className="w-full h-48 object-cover"
                                />

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="flex-1 gap-1"
                                      onClick={() => downloadImage(img)}
                                    >
                                      <Download size={12} />
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="default"
                                      className="flex-1 gap-1"
                                      onClick={() => setAsProfile(img)}
                                    >
                                      {selectedImage === img ? (
                                        <Check size={12} />
                                      ) : (
                                        <UserPen size={12} />
                                      )}
                                      {selectedImage === img
                                        ? "Selected"
                                        : "Use"}
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRegenerate(msg)}
                              className="gap-2"
                            >
                              <RefreshCcw size={14} />
                              Regenerate
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2"
                            >
                              <UserPen size={14} />
                              Set as Profile{" "}
                            </Button>
                          </div>
                        </motion.div>
                      ),
                    )}

                    {/* Typing Indicator */}
                    {typing && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div className="flex gap-1">
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150" />
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-300" />
                        </div>
                        {typing}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={bottomRef} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* INPUT AREA - Fixed at bottom */}
      <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Style Chips - Chat Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs font-medium text-muted-foreground">
                  Style:
                </span>
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                  {STYLE_PRESETS.map(({ label, icon }) => (
                    <Button
                      key={label}
                      size="sm"
                      variant={style === label ? "default" : "outline"}
                      className="gap-1.5 rounded-full shrink-0"
                      onClick={() => setStyle(label)}
                    >
                      <span className="text-xs">{icon}</span>
                      <span className="text-xs">{label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Upload Preview */}
            {upload && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card/50"
              >
                <div className="relative">
                  <Image
                    src={upload}
                    alt="Upload preview"
                    width={48}
                    height={48}
                    className="rounded-md object-cover"
                  />
                  <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] px-1 rounded">
                    Ref
                  </div>
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-medium">Reference Image Added</div>
                  <div className="text-xs text-muted-foreground">
                    AI will use this as a style reference
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => setUpload(null)}
                >
                  <X size={14} />
                </Button>
              </motion.div>
            )}

            {/* Input Area */}
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-xl blur-sm" />
              <div className="relative flex gap-2 p-2 rounded-xl bg-card border">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />

                <Textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your avatar... (e.g., 'professional headshot with blue background')"
                  className="min-h-[60px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={loading}
                />
                <div className="flex flex-col justify-between">
                  <Button
                    size="icon"
                    className="shrink-0 rounded-lg"
                    onClick={handleSend}
                    disabled={loading || (!prompt.trim() && !upload)}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <ArrowRight className="h-5 w-5" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="shrink-0 rounded-lg"
                    onClick={() => fileRef.current?.click()}
                    disabled={loading}
                  >
                    <Paperclip size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Helper Text */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Press{" "}
                <kbd className="px-1.5 py-0.5 rounded border text-xs">
                  Enter
                </kbd>{" "}
                to send •
                <kbd className="mx-1 px-1.5 py-0.5 rounded border text-xs">
                  Shift + Enter
                </kbd>{" "}
                for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(AIProfile);
