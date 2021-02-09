import 'milligram'
import { h, text, app } from 'hyperapp'

// Events
const form_request = (dispatch, props) => {
    const form = props.form

    fetch(form.action, {
        method: form.method,
        body: new FormData(form)
    })
    .then(res => res.json())
    .then(data => dispatch(request_change_state, data))
    .catch(error => dispatch(request_change_state, error))
}

const request = infos => [infos.action, infos.props]

// Actions
const upload_files = (state, event) => {
    event.preventDefault()
    return [
        {
            ...state,
            // TODO: Mettre un truc pour dire qu'on est entrain de convertir les images
            fetching: true
        },
        request({
            props: {
                form: event.target
            },
            action: form_request
        })
    ]
}

const request_change_state = (state, props) => {
    return { ...state, ...props }
}

// View's Parts
const upload_form = () => {
    return h('form', { onsubmit: upload_files, action: 'upload', method: 'POST' }, [
        h('input', { type: 'file', name: 'files', multiple: true }),
        h('br', {}),
        h('button', { type: 'submit' }, text('UPLOAD'))
    ])
}

const file_row = ({ name, link }) => {
    return h('tr', {}, [
        h('td', {}, text(name)),
        h('td', {}, 
            h('a', { href: link, target: '_blank', download: name }, text('Download'))
        )
    ])
}

const show_files_table = props => {
    return h('div', {}, [
        h('div', {}, [
            h('a', {class: 'button', href: props.archive}, text('Download all')),,
            // TODO: Use a real button tag with action emptying files array
            h('a', { href: '/', class: ['button', 'button-outline'] }, text('Reset'))
        ]),
        h('table', {}, [
            h('thead', {}, h('tr', {}, [
                h('th', {}, text('Name')),
                h('th', {}, text('Link'))
            ])),
            h('tbody', {}, props.files.map(file_row))
        ]),
    ])
}

// View
export const view = state => h('div', {}, [
    h('header', {}, [
        h('h1', {}, text('Capacint')),
        h('h4', {}, text('A tool to convert images into svg.'))
    ]),
    h('main', {}, state.files.length === 0 
        ? upload_form()
        : show_files_table(state),
    ),
    // TODO: Add copyrights shit and social + github links
    h('footer', {})
])

app({
    init: {
        error: undefined,
        files: [],
        archive: ''
    },
    view: view,
    node: document.getElementById('app')
})