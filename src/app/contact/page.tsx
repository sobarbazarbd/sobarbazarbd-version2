import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="container mt-4 md:mt-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Contact Us</h1>
        <p className="mt-1 text-sm text-neutral-500">We're here to help — reach out anytime</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-base font-bold">Send us a message</h2>
            <form className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input placeholder="Your name" />
              <Input placeholder="Email" type="email" />
              <Input placeholder="Subject" className="sm:col-span-2" />
              <textarea
                placeholder="Your message"
                rows={5}
                className="sm:col-span-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
              />
              <Button type="submit" size="lg" className="sm:col-span-2">Send message</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Info icon={<MapPin />} title="Address" body="Dhaka, Bangladesh" />
          <Info icon={<Phone />} title="Phone" body="09678-123456" />
          <Info icon={<Mail />} title="Email" body="support@sobarbazarbd.com" />
          <Info icon={<Clock />} title="Hours" body="9am – 9pm, every day" />
        </div>
      </div>
    </div>
  );
}

function Info({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">{icon}</span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{title}</p>
          <p className="text-sm font-medium">{body}</p>
        </div>
      </CardContent>
    </Card>
  );
}
