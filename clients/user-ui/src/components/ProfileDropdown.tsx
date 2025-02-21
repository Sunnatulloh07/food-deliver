"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CircleUserRound } from "lucide-react";
import AuthScreen from "../screens/AuthScreen";
import { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";


function ProfileDropdown() {
  const { loading, data } = useUser();
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      setSignedIn(!!data);
    }
  }, [data, loading]);

  const handleLogout = () => {
    Cookies.remove("access_token_user");
    Cookies.remove("refresh_token_user");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    setSignedIn(false);
    setOpen(false);
    router.push("/");
  };

  return (
    <div className="flex items-center gap-4">
      {signedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={data?.avatar?.url} />
              <AvatarFallback>
                {data?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent aria-label="Profile Menu">
            <DropdownMenuLabel>
              Signed in as
              <p className="text-sm text-muted-foreground">{data?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/orders">Orders</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/apply-for-seller">Apply for seller account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500 cursor-pointer hover:bg-red-500/10"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <CircleUserRound
          className="w-8 h-8 text-white cursor-pointer"
          onClick={() => setOpen(true)}
        />
      )}
      {open && <AuthScreen open={open} setOpen={setOpen} />}
    </div>
  );
}

export default ProfileDropdown;
