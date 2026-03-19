import { HiCheckCircle, HiMail, HiPhone } from"react-icons/hi";
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
 mobile: HiPhone,
 email: HiMail,
 accepting: HiCheckCircle,
};

export default function StoreContacts({ contacts }: StoreContactsProps) {
 return (
 <div className="flex flex-wrap items-center gap-3 text-sm">
 {contacts.map((contact) => {
 const Icon = contactIcons[contact.type];
 return (
 <button
 key={contact.type}
 onClick={contact.onClick}
 className={cn(
"flex items-center gap-2 px-3 py-2 rounded-full border border-custom-primary text-custom-primary bg-custom-primary/30 transition-colors hover:bg-custom-primary/50",
 contact.type ==="accepting"&&"border-primary-light"
 )}
 >
 <Icon
 className={contact.type ==="accepting"?"text-primary-light":""}
 />
 <span>{contact.label}</span>
 </button>
 );
 })}
 </div>
 );
}

