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
    <div className="flex items-center justify-between bg-background-darker-color p-3  md:p-4 md:text-xl">
      <div>
        <Link href="/dashboard">MUSCLER </Link>
        <span className="text-sm font-thin italic text-neutral-400 md:text-base">
          by Daniel Skowron
        </span>
      </div>
      {noButton ? (
        ""
      ) : (
        <>
          {asLink ? (
            <Link href={href} className="flex cursor-pointer items-center">
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
              className="flex cursor-pointer items-center"
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
