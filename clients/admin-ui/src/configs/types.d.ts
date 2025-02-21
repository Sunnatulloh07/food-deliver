import { JSX } from "react/jsx-runtime";

export type SidebarItem = {
    name: string,
    link: string,
    icon: JSX.Element
}

type DashboardCardType = {
    icon: JSX.Element,
    title: string,
    percentage: string,
    amount: string
    color: string
}

type OrdersDataType = {
    id: string,
    name: string,
    email: string,
    title: string,
    price: string,
    createdAt: Date | string
}

type FoodsDataType = {
    id: string,
    name: string,
    totalOrders: number,
    price: string | number,
    images: string[],
    category: string,
    createdAt: Date | string
}