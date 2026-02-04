import Link from "next/link";
import {
  ChevronRightIcon,
  User,
  Palette,
  ShieldCheck,
  LayoutGrid,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Bitshow } from "@/components/font/font";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export default function Settings() {
  return (
    <div>
      <h1
        className={`${Bitshow.className} scroll-m-20 mt-5 text-center text-4xl font-extrabold tracking-tight text-balance`}
      >
        Settings
      </h1>
      <p className="text-muted-foreground text-xs text-center">
        Customize, Control and Adjust your Settings.
      </p>
      <div className="mt-5 p-2 flex flex-col gap-2 md:grid md:grid-cols-2 justify-center">
        {settingsList.map((setting) => (
          <Link key={crypto.randomUUID()} href={`/settings/${setting.href}`}>
            <Item variant="outline">
              <ItemMedia>{setting.icon}</ItemMedia>
              <ItemContent>
                <ItemTitle>{setting.title}</ItemTitle>
                <ItemDescription>{setting.description}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRightIcon />
              </ItemActions>
            </Item>
          </Link>
        ))}
      </div>
    </div>
  );
}
type settingsListType = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
};

const settingsList: settingsListType[] = [
  {
    icon: <User size={20} />,
    title: "Account",
    description: "Update your personal details, email, and profile picture.",
    href: "account",
  },
  {
    icon: <Palette size={20} />,
    title: "Appearance",
    description: "Customize themes, dark mode, and visual preferences.",
    href: "appearance",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Privacy",
    description: "Manage your visibility, online status, and data sharing.",
    href: "privacy",
  },
  {
    icon: <LayoutGrid size={20} />,
    title: "Categories",
    description: "Organize your chats into custom folders or groups.",
    href: "catagory",
  },
  {
    icon: <Trash2 size={20} className="text-red-500" />,
    title: "Danger Zone",
    description: "Permanently delete your account or wipe sensitive data.",
    href: "dangerous",
  },
];
