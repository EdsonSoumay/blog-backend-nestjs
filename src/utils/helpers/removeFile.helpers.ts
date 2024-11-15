import fs from 'fs'

export const removePreviousImage = (currentImage: string | null | undefined, previousPhoto: string | null | undefined) => {
    if (currentImage && previousPhoto) {
      const filePath = previousPhoto;
      if (filePath) {
        fs.unlink(`public/images/${filePath}`, (err) => {
          if (err) {
            console.error('Error deleting the file:', err);
          } else {
            console.log('File deleted successfully');
          }
        });
      }
    }
    return true;
  }


export const deleteImage = (filePath: string | null | undefined) => {
  console.log("delete image")
    if (filePath) {
      fs.unlink(`public/images/${filePath}`, (err) => {
        if (err) {
          console.error('Error deleting the file:', err);
        } else {
          console.log('File deleted successfully');
        }
      });
  }
  return true;
}