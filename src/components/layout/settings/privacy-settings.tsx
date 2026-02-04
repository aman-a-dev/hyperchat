import { Bitshow } from "@/components/font/font";
import { SunMoon, Eye, Book, Earth, Building, Mail } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
//import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
export default function PrivacySetting() {
  return (
    <div className="min-h-[200vh]">
      <h1
        className={`${Bitshow.className} scroll-m-20 mt-5 text-center text-4xl font-extrabold tracking-tight text-balance`}
      >
        Privacy
      </h1>
      <p className="text-muted-foreground text-xs text-center">
        Manage your visibility, online status, and data sharing.
      </p>
      <div className="mt-5 p-2 flex flex-col gap-2 md:grid md:grid-cols-2 md:items-start">
        <Accordion type="single" collapsible className="m-3">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex gap-3">
                <SunMoon />
                <div>
                  <h3 className="scroll-m-20 text-md font-semibold tracking-tight">
                    Online Status
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Who can see your online status.
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-9 space-y-1.5">
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="everyone" value="everyone" />
                  <Label htmlFor="everyone">Everyone</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="contacts" value="contacts" />
                  <Label htmlFor="contacts">Contacts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="no-body" value="no-body" />
                  <Label htmlFor="no-body">No body</Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <div className="flex gap-3">
                <Eye />
                <div>
                  <h3 className="scroll-m-20 text-md font-semibold tracking-tight">
                    Last Seen
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Your last online time.
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-9 space-y-1.5">
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="everyone" value="everyone" />
                  <Label htmlFor="everyone">Everyone</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="contacts" value="contacts" />
                  <Label htmlFor="contacts">Contacts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="no-body" value="no-body" />
                  <Label htmlFor="no-body">No body</Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              <div className="flex gap-3">
                <Book />
                <div>
                  <h3 className="scroll-m-20 text-md font-semibold tracking-tight">
                    Bio
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Who can see your bio.
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-9 space-y-1.5">
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="everyone" value="everyone" />
                  <Label htmlFor="everyone">Everyone</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="contacts" value="contacts" />
                  <Label htmlFor="contacts">Contacts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="no-body" value="no-body" />
                  <Label htmlFor="no-body">No body</Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              <div className="flex gap-3">
                <Building />
                <div>
                  <h3 className="scroll-m-20 text-md font-semibold tracking-tight">
                    Job
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Who can see your job.
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-9 space-y-1.5">
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="everyone" value="everyone" />
                  <Label htmlFor="everyone">Everyone</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="contacts" value="contacts" />
                  <Label htmlFor="contacts">Contacts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="no-body" value="no-body" />
                  <Label htmlFor="no-body">No body</Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>
              <div className="flex gap-3">
                <Earth />
                <div>
                  <h3 className="scroll-m-20 text-md font-semibold tracking-tight">
                    Country
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Who can see your country.
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-9 space-y-1.5">
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="everyone" value="everyone" />
                  <Label htmlFor="everyone">Everyone</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="contacts" value="contacts" />
                  <Label htmlFor="contacts">Contacts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="no-body" value="no-body" />
                  <Label htmlFor="no-body">No body</Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Item>
          <ItemMedia>
            <Mail />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Emails</ItemTitle>
            <ItemDescription>Sync Emails from your gmail.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Switch className="bg-red-600" />
          </ItemActions>
        </Item>
      </div>
    </div>
  );
}
