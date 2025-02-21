import { ChartNoAxesCombined, Home, Salad, ShoppingBag, Soup } from "lucide-react"
import { SidebarItem } from "./types"

export const sideBarItems: SidebarItem[] = [
    {
        name: "Dashboard",
        link: "/",
        icon: <Home />
    },
    {
        name: "Orders",
        link: "/orders",
        icon: <ShoppingBag />
    },
    {
        name: "Create Food",
        link: "/create-food",
        icon: <Soup />
    },
    {
        name: "Foods",
        link: "/foods",
        icon: <Salad />
    },
    {
        name: "Analytics",
        link: "/analytics",
        icon: <ChartNoAxesCombined />
    }
]


export const categories: string[] = [
    'Burger',
    'Pizza',
    'Drinks',
    'Desserts',
    'Pasta',
    'Sushi',
    'Steak',
    'Schnitzel',
    'Tacos',
]