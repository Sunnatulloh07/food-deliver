import NavItems from "../NavItems";
import styles from "@/utils/style";
import ProfileDropdown from "../ProfileDropdown";
import { cookies } from "next/headers";

async function Header() {
  const cookieStore = await cookies();
  const pathname = cookieStore.get('currentPath')?.value || '/';

  return (
    <header className="w-full  bg-[#0F1524]" >
      <div className="w-[90%] mx-auto h-[80px] flex items-center justify-between">
        <h1 className={styles.logo}>Fast Food</h1>
        <NavItems activeItem={pathname} />
        <ProfileDropdown />
      </div>
    </header>
  );
}

export default Header
