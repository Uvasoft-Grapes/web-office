import Image from "next/image";

export default function AvatarGroup({ avatars, maxVisible }:{ avatars:{ name:string, img:string }[], maxVisible:number }) {
  return(
    <ul className="flex items-center">
    {avatars.slice(0, maxVisible).map((avatar, index)=>(
      <li key={`avatar-${index}`} className="size-10 rounded-full -ml-3 first:ml-0 group">
        <Image
          src={avatar.img}
          alt={`Avatar ${index}`}
          width={50} height={50}
          className="max-w-10 max-h-10 rounded-full border-2 border-secondary-light dark:border-secondary-dark"
        />
        <span className="absolute z-20 hidden group-hover:inline px-2 py-1 rounded text-nowrap font-medium text-xs text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light">{avatar.name}</span>
      </li>
    ))}
    {avatars.length > maxVisible &&
      <li className="flex items-center justify-center size-9 -ml-4 rounded-full font-medium text-sm text-primary-light dark:text-primary-dark bg-primary-dark dark:bg-primary-light border-2 border-secondary-light dark:border-secondary-dark">
        +{avatars.length - maxVisible}
      </li>
    }
    </ul>
  );
};