import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-bg p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image
            src={"/icons_sticker_smile.svg"}
            width={52}
            height={52}
            alt={"logo"}
          />
        </Link>
        {children}
      </div>
    </div>
  );
}
