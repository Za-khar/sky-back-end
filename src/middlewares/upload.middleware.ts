import multer from 'multer'
import path from 'path'

export const uploadPhotoMiddleware = (photoName: string, directory: string) => {
  return multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'public/' + directory)
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + Date.now() + ext)
      },
    }),
    fileFilter: function (req, file, cb) {
      // Check file type
      const allowedMimes = ['image/jpeg', 'image/png', 'image/gif']

      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.'))
      }
    },
  }).single(photoName)
}
