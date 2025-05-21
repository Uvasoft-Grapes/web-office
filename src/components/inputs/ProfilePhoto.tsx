import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { TbPhotoEdit } from "react-icons/tb";
import { getAvatars } from "@utils/avatars";

export default function ProfilePhotoSelect({ imageUrl, setImageUrl }:{ imageUrl:string, setImageUrl:(file:string)=>void }) {
  const [previewUrl, setPreviewUrl] = useState<string>(imageUrl);
  const [state, setState] = useState(false);
  const [avatars] = useState<StaticImageData[]>(getAvatars());

  const handleImageChange = () => {
    setState(true);
  };

  const onChooseFile = (index:number) => {
    const url = avatars[index].src;
    setImageUrl(url);
    setPreviewUrl(url);
    setState(false);
  };

  return(
    <div className="flex">
      <button type="button" onClick={handleImageChange} className="relative w-12 xl:w-14 h-12 xl:h-14 flex items-center justify-center rounded-full hover:opacity-50 cursor-pointer duration-300">
        <Image src={previewUrl || ""} alt="Foto de perfil" width={64} height={64} className="w-12 xl:w-14 h-12 xl:h-14 rounded-full object-cover"/>
        <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 xl:w-6 h-5 xl:h-6 rounded-full text-primary-light dark:text-primary-dark bg-blue-light dark:bg-blue-dark">
          <TbPhotoEdit className="text-xs xl:text-sm"/>
        </div>
      </button>
    {state &&
      <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen p-10 bg-stone-950/50 dark:bg-stone-100/25">
        <div className="flex flex-col gap-5 p-10 rounded bg-stone-100 dark:bg-stone-950">
          <h3 className="font-medium text-2xl text-stone-950 dark:text-stone-100">Elige un avatar</h3>
          <ul className="grid grid-cols-3 sm:grid-cols-7 gap-5">
          {avatars.map((avatar, index) => (
            <li key={index} className={`relative w-12 sm:w-14 xl:w-16 h-12 sm:h-14 xl:h-16 flex items-center justify-center rounded-full border-2 ${avatar.src === previewUrl ? "border-blue-light dark:border-blue-dark" : "border-primary-dark dark:border-primary-light"}  overflow-hidden hover:opacity-50 cursor-pointer duration-300`} onClick={() => onChooseFile(index)}>
              <Image src={avatar} alt="Foto de perfil" width={64} height={64}  className="w-12 xl:w-14 h-12 xl:h-14 rounded-full object-cover"/>
            </li>
          ))}
          </ul>
        </div>
      </div>
    }
    </div>
  );
};