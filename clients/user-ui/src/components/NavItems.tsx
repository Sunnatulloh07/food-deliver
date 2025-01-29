import styles from "@/utils/style"
import Link from "next/link"


const navItems = [
    {
        name: "Home",
        link: "/",
    },
    {
        name: "About",
        link: "/about",
    },
    {
        name: "Restaurants",
        link: "/restaurants",
    },
    {
        name: "Popular foods",
        link: "/foods",
    },
    {
        name: "Contact us",
        link: "/contact",
    },
]

function NavItems({activeItem = "/"}: {activeItem?: string}) {
    return (
        <div className="flex items-center gap-2">
            {navItems.map((item,i) => (
                <Link href={item.link} key={i} className={`${styles.navLink} ${
                    item.link == activeItem ? "text-[#37b668]" : ""
                    }`}>{item.name}</Link>
            ))}

        </div>
    )
}

export default NavItems
