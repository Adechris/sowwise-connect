import { Facebook, Instagram, Linkedin, Mail, MessageCircle, Phone, Twitter } from "lucide-react";
export function PublicFooter() {
  return (
    <footer id="contact" className="border-t border-border bg-secondary mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-lg gradient-hero text-primary-foreground font-bold">S</span>
            Sowwise<span className="text-primary">Technologies365</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-md">Practical, industry-led tech training designed to launch and elevate careers across Africa.</p>
          <div className="mt-4 flex gap-3 text-muted-foreground">
            <a href="#" className="hover:text-primary"><Facebook className="h-4 w-4"/></a>
            <a href="#" className="hover:text-primary"><Twitter className="h-4 w-4"/></a>
            <a href="#" className="hover:text-primary"><Instagram className="h-4 w-4"/></a>
            <a href="#" className="hover:text-primary"><Linkedin className="h-4 w-4"/></a>
          </div>
        </div>
        <div><h4 className="text-sm font-semibold mb-3">Programmes</h4><ul className="space-y-2 text-sm text-muted-foreground"><li>Data Analytics</li><li>Web Development</li><li>Cybersecurity</li><li>UI/UX Design</li></ul></div>
        <div><h4 className="text-sm font-semibold mb-3">Contact</h4><ul className="space-y-2 text-sm text-muted-foreground"><li className="flex items-center gap-2"><Mail className="h-4 w-4"/> hello@sowwise365.com</li><li className="flex items-center gap-2"><Phone className="h-4 w-4"/> +234 800 000 0000</li><li className="flex items-center gap-2"><MessageCircle className="h-4 w-4"/> WhatsApp Support</li></ul></div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} SowwiseTechnologies365. All rights reserved.</div>
    </footer>
  );
}
