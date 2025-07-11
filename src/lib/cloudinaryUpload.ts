import cloudinary from './cloudinary';

export async function uploadImageToCloudinary( file:File, options:{ folder:'users'|'products', publicId:string, }):Promise<string> {
  if (!file || !options.folder || !options.publicId) throw new Error('Datos de imagen incompletos');

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.publicId,
        overwrite: true,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error || new Error('Fallo al subir imagen'));
        } else {
          resolve(result.secure_url);
        };
      },
    );

    uploadStream.end(buffer);
  });
};
