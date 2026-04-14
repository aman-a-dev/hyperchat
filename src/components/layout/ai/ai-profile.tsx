"use client";

import { useEffect, useRef, useState, memo, useCallback } from "react";
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
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type StylePreset = "Realistic" | "Anime" | "Cinematic" | "Pixel" | "Minimal";

interface UserMessage {
  id: number;
  role: "user";
  content: string;
  style: StylePreset;
  image?: string;
}

interface AIMessage {
  id: number;
  role: "ai";
  images: string[]; // base64 strings
  prompt: string;
  style: StylePreset;
}

type ChatMessage = UserMessage | AIMessage;

const STYLE_PRESETS: { label: StylePreset; icon: string }[] = [
  { label: "Realistic", icon: "🎨" },
  { label: "Anime", icon: "🌸" },
  { label: "Cinematic", icon: "🎬" },
  { label: "Pixel", icon: "🕹️" },
  { label: "Minimal", icon: "⚪" },
];

function base64ToBlob(base64: string, mimeType = "image/png"): Blob {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: mimeType });
}

function AIProfile() {
  const [started, setStarted] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<StylePreset>("Realistic");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [upload, setUpload] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateImages = useCallback(
    async (promptText: string, preset: StylePreset) => {
      setLoading(true);
      const toastId = toast.loading("Generating your avatar...");

      try {
        const response = await fetch("/api/ai/avatar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptText, style: preset }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to generate images");
        }

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "ai",
            images: data.images,
            prompt: promptText,
            style: preset,
          },
        ]);

        toast.success("Images generated successfully!", { id: toastId });
      } catch (error: any) {
        console.error("Generation error:", error);
        toast.error(error.message || "Image generation failed. Please try again.", {
          id: toastId,
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSend = useCallback(async () => {
    if ((!prompt.trim() && !upload) || loading) return;
    if (!started) setStarted(true);

    const userPrompt = prompt.trim() || "Generate an avatar";
    const preset = style;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        content: userPrompt,
        style: preset,
        image: upload || undefined,
      },
    ]);

    setPrompt("");
    setUpload(null);
    await generateImages(userPrompt, preset);
  }, [prompt, upload, loading, started, style, generateImages]);

  const handleRegenerate = useCallback(
    (msg: AIMessage) => {
      if (loading) return;
      generateImages(msg.prompt, msg.style);
    },
    [loading, generateImages]
  );

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUpload(url);
  };

  const downloadImage = (base64: string) => {
    const blob = base64ToBlob(base64);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-avatar.png";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Download started");
  };

  const setAsProfile = async (base64Image: string) => {
    setSelectedImage(base64Image);
    const toastId = toast.loading("Updating profile picture...");

    try {
      const blob = base64ToBlob(base64Image);
      const file = new File([blob], "avatar.png", { type: "image/png" });
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/user-data", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) throw new Error("Upload failed");

      toast.success("Profile picture updated!", { id: toastId });
      setTimeout(() => setSelectedImage(null), 2000);
    } catch (error) {
      console.error("Failed to set profile:", error);
      toast.error("Failed to update profile picture. Please try again.", { id: toastId });
      setSelectedImage(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const StartScreen = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col items-center justify-center text-center p-6"
    >
      <div className="max-w-md mx-auto space-y-6">
        <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
          <Sparkles className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">AI Avatar Generator</h1>
        <p className="text-muted-foreground">
          Create unique avatars powered by Pollinations.ai. Describe your ideal avatar and choose a style.
        </p>
        <Button size="lg" onClick={() => setStarted(true)}>
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <main className="flex-1 overflow-hidden mt-10">
        <AnimatePresence mode="wait">
          {!started ? (
            <StartScreen />
          ) : (
            <motion.div
              key="chat-interface"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col"
            >
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-8">
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <p className="text-muted-foreground">
                        Describe your avatar and hit send!
                      </p>
                    </motion.div>
                  )}

                  {messages.map((msg) => (
                    <div key={msg.id}>
                      {msg.role === "user" ? (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex justify-end"
                        >
                          <div className="max-w-[80%]">
                            <div className="flex items-end gap-2 mb-1">
                              <div className="text-xs text-muted-foreground">You</div>
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
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="p-1 rounded-md bg-primary/10">
                              <Sparkles className="h-3 w-3 text-primary" />
                            </div>
                            <div className="text-xs font-medium">AI Generated</div>
                            <div className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {msg.style}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {msg.images.map((imgBase64, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className={cn(
                                  "group relative rounded-xl overflow-hidden border bg-card",
                                  selectedImage === imgBase64 && "ring-2 ring-primary ring-offset-2"
                                )}
                              >
                                <img
                                  src={`data:image/png;base64,${imgBase64}`}
                                  alt={`Generated option ${idx + 1}`}
                                  className="w-full h-48 object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="flex-1 gap-1"
                                      onClick={() => downloadImage(imgBase64)}
                                      disabled={loading}
                                    >
                                      <Download size={12} />
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="default"
                                      className="flex-1 gap-1"
                                      onClick={() => setAsProfile(imgBase64)}
                                      disabled={loading || selectedImage === imgBase64}
                                    >
                                      {selectedImage === imgBase64 ? (
                                        <Check size={12} />
                                      ) : (
                                        <UserPen size={12} />
                                      )}
                                      {selectedImage === imgBase64 ? "Selected" : "Set as Profile"}
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRegenerate(msg)}
                              className="gap-2"
                              disabled={loading}
                            >
                              <RefreshCcw size={14} />
                              Regenerate
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}

                  <div ref={bottomRef} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Style Chips */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs font-medium text-muted-foreground">Style:</span>
                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                  {STYLE_PRESETS.map(({ label, icon }) => (
                    <Button
                      key={label}
                      size="sm"
                      variant={style === label ? "default" : "outline"}
                      className="gap-1.5 rounded-full shrink-0"
                      onClick={() => setStyle(label)}
                      disabled={loading}
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
                  disabled={loading}
                >
                  <X size={14} />
                </Button>
              </motion.div>
            )}

            {/* Input Area */}
            <div className="relative">
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

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Press{" "}
                <kbd className="px-1.5 py-0.5 rounded border text-xs">Enter</kbd> to send •
                <kbd className="mx-1 px-1.5 py-0.5 rounded border text-xs">Shift + Enter</kbd> for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(AIProfile);