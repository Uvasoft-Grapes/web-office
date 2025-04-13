import Image from "next/image";

export default function AvatarGroup({ avatars, maxVisible }:{ avatars:{ name:string, img:string }[], maxVisible:number }) {
  return(
    <ul className="flex items-center">
    {avatars.slice(0, maxVisible).map((avatar, index)=>(
      <li key={index} className="size-9 rounded-full -ml-4 first:ml-0 group">
        <Image
          src={avatar.img}
          alt={`Avatar ${index}`}
          width={50} height={50}
          className="max-w-9 max-h-9 rounded-full border-2 border-secondary-light dark:border-secondary-dark"
        />
        <span className="absolute hidden group-hover:inline px-2 py-1 rounded text-nowrap font-medium text-xs text-primary-dark dark:text-primary-light bg-primary-light dark:bg-primary-dark">{avatar.name}</span>
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