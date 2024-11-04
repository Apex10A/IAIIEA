import Image from 'next/image'
import Logo from "@/assets/auth/images/IAIIEA Logo I.png";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="w-full flex flex-col relative min-h-screen overflow-auto items-center justify-center">
      {children}
      <Image
        src={Logo}
        alt="vector illustration of a book"
        className="absolute z-[-10]"
        width={150}
        height={50}
      />
    </main>
  )
}
