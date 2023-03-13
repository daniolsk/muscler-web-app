import Image from "next/image";
import Link from "next/link";

function Header({
  noButton,
  buttonText,
  buttonOnClick,
  buttonImageName,
  asLink,
  href,
}) {
  return (
    <div className="flex items-center justify-between bg-background-darker-color p-1.5 md:p-2.5 md:text-xl">
      <div className="p-2">
        <Link href="/dashboard" className="hover:text-neutral-300">
          MUSCLER{" "}
        </Link>
        <span className="text-sm font-thin italic text-neutral-400 md:text-base">
          by Daniel Skowron
        </span>
      </div>
      {noButton ? (
        ""
      ) : (
        <>
          {asLink ? (
            <Link
              href={href}
              className="flex cursor-pointer items-center rounded-md p-1.5 hover:bg-white/20"
            >
              <div className="mr-2">{buttonText}</div>
              <Image
                alt="log out icon"
                src={`/icons/${buttonImageName}.svg`}
                width={15}
                height={15}
                priority
              ></Image>
            </Link>
          ) : (
            <button
              className="flex cursor-pointer items-center rounded-md p-1.5 hover:bg-white/20"
              onClick={buttonOnClick}
            >
              <div className="mr-2">{buttonText}</div>
              <Image
                alt="log out icon"
                src={`/icons/${buttonImageName}.svg`}
                width={15}
                height={15}
                priority
              ></Image>
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default Header;
