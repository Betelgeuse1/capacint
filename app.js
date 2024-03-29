import 'milligram'
import { h, text, app } from 'hyperapp'
// MAYBE: use the @hyperapp/html module instead of only h function

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
        state,
        request({
            props: {
                form: event.target
            },
            action: form_request
        })
    ] // Same thing as [state, [form_request, { props_obkect }]]
}

const request_change_state = (state, props) => ({ ...state, ...props })

// View's Parts
const upload_form = () => {
    return h('form', { onsubmit: upload_files, action: 'upload', method: 'POST' }, [
        h('input', { type: 'file', name: 'files', multiple: true }),
        h('br', {}),
        h('button', { type: 'submit' }, text('CONVERT'))
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
            // Don't need to reset the state coz reloading the page will reset for us.
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
    // TODO: Add licence's stuff + social + github
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