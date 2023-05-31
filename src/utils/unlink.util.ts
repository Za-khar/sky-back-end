import fs from 'fs'

export const unlinkPhoto = (photo: string | undefined, directory: string) => {
  if (photo && directory) {
    const path = `public\\${directory}\\${photo}`

    fs.unlink(path, (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log(`Deleted ${path}`)
      }
    })
  }
}
