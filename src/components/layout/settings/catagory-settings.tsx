// src/components/layout/settings/catagory-settings.tsx
"use client";
import { Bitshow } from "@/components/font/font";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog2";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Plus,
  Save,
  Folder,
  ChevronsUpDown,
  EllipsisVertical,
  Edit,
  Trash,
  Check,
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
  SheetHeader,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import { validateCatagoryName } from "@/actions/validation";

export default function CatagorySettings() {
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);

  const handleCreatCatagory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const catagoryName = formData.get("catagory-name") as string;
    const isValid = validateCatagoryName(catagoryName);
    if (isValid) {
      closeDialogRef.current?.click();
    }
  };

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const handleSelectedChange = (ids: string[]) => {
    setSelectedUserIds(ids);
  };

  return (
    <div>
      <h1
        className={`${Bitshow.className} scroll-m-20 mt-5 text-center text-4xl font-extrabold tracking-tight text-balance`}
      >
        Catagory
      </h1>
      <p className="text-muted-foreground text-xs text-center">
        Categoriz your chats in to organised folders.
      </p>
      <div className="mt-5 p-2 flex flex-col gap-2 justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="md:w-3xl md:mx-auto">
              <span>Add Catagory</span>
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form
              className="flex flex-col gap-4 items-center"
              onSubmit={handleCreatCatagory}
            >
              <DialogClose ref={closeDialogRef} className="sr-only">
                Close Dialog
              </DialogClose>
              <div className="flex flex-col gap-2 items-center">
                <Folder className="size-15" />
                <DialogTitle className="text-3xl">Catagory</DialogTitle>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="catagory-input" className="sr-only">
                  Catagory Name
                </Label>
                <InputGroup>
                  <InputGroupInput
                    id="catagory-input"
                    placeholder="Catagory Name___"
                    name="catagory-name"
                  />
                  <InputGroupAddon align="inline-end">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-[30%/30%]"
                          type="button"
                        >
                          <Plus />
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="overflow-y-scroll">
                        <SheetHeader>
                          <SheetTitle>Choose A Member</SheetTitle>
                          <SheetDescription>
                            Choose a member for your catagory.
                          </SheetDescription>
                          <MemberOptionList
                            onSelectedChange={handleSelectedChange}
                          />
                        </SheetHeader>
                      </SheetContent>
                    </Sheet>
                  </InputGroupAddon>
                </InputGroup>
                <Button type="submit">
                  <span>Create</span>
                  <Save />
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <div className="flex flex-col gap-2 md:grid md:grid-cols-2 justify-center gap-2 my-3">
          {catagorys.map(({ id, name }) => (
            <Item variant="outline" size="sm" key={id}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <EllipsisVertical />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-1 text-start p-1 ml-5 w-max">
                  <Button
                    variant="outline"
                    className="flex justify-start items-center w-full"
                  >
                    <Edit />
                    <span>Edit</span>
                  </Button>
                  <Button variant="outline" className="text-primary w-full">
                    <Trash />
                    <span>Delete</span>
                  </Button>
                </PopoverContent>
              </Popover>
              <ItemContent>
                <ItemTitle>{name}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <ChevronsUpDown className="size-4" />
              </ItemActions>
            </Item>
          ))}
        </div>
      </div>
    </div>
  );
}

const catagorys = [
  { id: crypto.randomUUID(), name: "Friends 👬", index: 1 },
  { id: crypto.randomUUID(), name: "Dev 💻", index: 2 },
  { id: crypto.randomUUID(), name: "Family 👨‍👧‍👧", index: 4 },
];

function MemberOptionList({
  onSelectedChange,
}: {
  onSelectedChange?: (ids: string[]) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);

    // Convert to array and notify parent
    onSelectedChange?.(Array.from(next));
  };

  return (
    <div className="grid grid-cols-4 py-10">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="flex justify-center items-center flex-col gap-2 cursor-pointer"
          onClick={() => toggleSelection(contact.id)}
        >
          <div
            className={`relative rounded-[30%/30%] ${
              selectedIds.has(contact.id) ? "ring-2 ring-primary" : ""
            }`}
          >
            <Avatar className="rounded-[30%/30%]">
              <AvatarImage src={contact.src} />
              <AvatarFallback className="rounded-[30%/30%]">
                {contact.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {selectedIds.has(contact.id) && (
              <div className="absolute -top-3 -right-3 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                ✓
              </div>
            )}
          </div>

          <h3 className="text-muted-foreground text-xs md:text-sm">
            {`${contact.name.slice(0, 3)}...`}
          </h3>
        </div>
      ))}
    </div>
  );
}

export const contacts = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    src: "/avatar1.png",
    online: true,
    link: "/chats/1",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    src: "/avatar2.png",
    online: false,
    link: "/chats/2",
  },
  // ... rest of contacts (keeping as is)
  {
    id: "3",
    name: "Charlie Davis",
    email: "charlie.davis@example.com",
    src: "/avatar3.png",
    online: true,
    link: "/chats/3",
  },
  // Add remaining contacts...
];
