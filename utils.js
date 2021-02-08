import formidable from 'formidable'
import { exec } from 'child_process'

export const formidable_promise = (req, opts) => {
    return new Promise(function (resolve, reject) {
        var form = new formidable.IncomingForm(opts)
        form.parse(req, function (err, fields, files) {
            if (err) return reject(err)
            resolve({ fields, ...files })
        })
    })
}

export const exec_promise = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (stdout, stderr, err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}