import {
  HiCheckCircle,
  HiDeviceMobile,
  HiMail,
  HiPhone,
} from"react-icons/hi";
import { cn } from"@/shared/lib/utils";

type ContactItem = {
 type:"call"|"mobile"|"email"|"accepting";
 label: string;
 value?: string;
 onClick?: () => void;
};

type StoreContactsProps = {
 contacts: ContactItem[];
};

const contactIcons = {
 call: HiPhone,
  mobile: HiDeviceMobile,
 email: HiMail,
 accepting: HiCheckCircle,
};

export default function StoreContacts({ contacts }: StoreContactsProps) {
 return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
 {contacts.map((contact) => {
 const Icon = contactIcons[contact.type];
 return (
 <button
 key={contact.type}
 onClick={contact.onClick}
            type="button"
 className={cn(
              "group inline-flex items-center gap-2.5 text-custom-primary transition-colors",
              contact.type !=="accepting"&&"hover:text-custom-accent"
 )}
 >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border transition-all",
                contact.type ==="accepting"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                  : "border-sky-200 bg-white text-sky-500 group-hover:border-sky-300 group-hover:bg-sky-50"
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="font-medium">{contact.label}</span>
 </button>
 );
 })}
 </div>
 );
}

