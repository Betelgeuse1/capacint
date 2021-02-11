import { App } from '@tinyhttp/app'
import { nanoid } from 'nanoid'
import fs from 'fs/promises'
import serve from 'serve-static'

import { exec_promise, formidable_promise } from './utils.js'

const app = new App()

app.use(serve('public'))

app.post('/upload', async (req, res, next) => {
    const id = nanoid(8)
    const svg_dir = `public/svgs/${id}`

    try {
        // MAYBE: change all the nanoid + tmp_dir nonsense to mkdtemp
        const tmp_dir = `${svg_dir}/tmp`
        await fs.mkdir(tmp_dir, { recursive: true })

        let { _ , files } = await formidable_promise(req, {
            multiples: true,
            uploadDir: tmp_dir
        })
        // Managing the unique file issue        
        if (!Array.isArray(files)) files = [files]

        files = files.map((file) => ({
            pathname: file.path.split('/').pop(),
            // Turning the original name into the svg one
            name: `${file.name.substring(0, file.name.lastIndexOf('.'))}.svg`
        }))

        for (const file of files) {
            // The converting linux command uses convert (ImageMagik) and autotrace
            // The 000001 color is just a magic number for background transparency
            // TODO: Creer un script custom pour convertir les images en utilisant les ressources suivantes : ppmcolormask | potrace | mkbitmap | tool to read all the colors from an image
            await exec_promise(`convert -background '#000001' -alpha background ${tmp_dir}/${file.pathname} ${tmp_dir}/out.ppm && autotrace --output-format svg --output-file ${svg_dir}/${file.name} --background-color 000001 ${tmp_dir}/out.ppm`)
        }

        // Putting all the files into a zip archive.
        // Went with a zip archive because both Linux and Windows users will
        // be able to extract it easily .
        // The -j will junk the paths so it only stores files, no directories.
        await exec_promise(`zip ${svg_dir}/${id}.zip ${svg_dir}/*.svg -j`)

        res.json({
            archive: `${svg_dir.substring(svg_dir.indexOf('/'))}/${id}.zip`,
            files: files.map((file) => {
                return {
                    name: file.name,
                    // doing substring to remove the public/ bit from the path 
                    link: `${svg_dir.substring(svg_dir.indexOf('/'))}/${file.name}`
                }
            })
        })

    } catch(err) {
        next(err)
    }
})

app.listen(8080, () => console.log('server is running on port 8080'))